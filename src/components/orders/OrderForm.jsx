import React, { useState, useEffect } from 'react';
import { Save, X, Plus, Trash2, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate, useParams } from 'react-router-dom';
import ApiService from '../../services/api';

// Fallback configuration used only if the /api/products config is empty or fails to load.
// Item #7 removals are already applied here (Pant Elastic & Pant Belt = Color only).
const FALLBACK_SIZE_MAPPING = {
  'Pant Elastic': ['20', '22', '24', '26', '28', '30', '32', '34', '36', '38', '40', '42', '44'],
  'Pant Belt': ['26', '28', '30', '32', '34', '36', '38/26', '38/28', '40/28', '40/30', '40/32', '40/34', '42/28', '42/30', '42/32', '42/34', '42/36', '42/38', '42/40'],
  'Skirt': ['14', '16', '18', '20', '22', '24', '26/28', '26/30', '26/32', '26/34', '26/36'],
  'Tunick': ['20', '22', '24', '26', '28', '30', '32', '34', '36', '38', '40', '42', '44'],
  'Blazer': ['20', '22', '24', '26', '28', '30', '32', '34', '36', '38', '40', '42', '44'],
  'Shirt': ['20', '22', '24', '26', '28', '30', '32', '34', '36', '38', '40', '42', '44'],
};

const FALLBACK_DETAIL_MAPPING = {
  'Shirt': [
    { label: 'Collar', key: 'collarType', options: ['Pipeline', 'Matching Collar', 'Collar Patti', 'Creation'] },
    { label: 'Astin', key: 'astinType', options: ['Patti', 'Pipeline', 'Luppi', 'Creation'] },
    { label: 'Front', key: 'frontType', options: ['Patti', 'Pipeline', 'Creation'] },
    { label: 'Mono', key: 'mono', options: ['Yes', 'No'] },
    { label: 'Pocket', key: 'pocketType', options: ['Pipeline', 'Patti', 'Creation'] },
    { label: 'Color', key: 'color', options: ['White', 'Black', 'Blue', 'Red', 'Other'] },
  ],
  'Tunick': [
    { label: 'Color', key: 'color', options: ['White', 'Black', 'Blue', 'Red', 'Pink', 'Green', 'Yellow', 'Orange', 'Purple', 'Other'] },
  ],
  'Skirt': [
    { label: 'Cloth Type', key: 'clothType', options: ['Cotton', 'Linen', 'Silk', 'Polyester'] },
    { label: 'Length Type', key: 'lengthType', options: ['Knee Length', 'Midi', 'Maxi', 'Mini'] },
    { label: 'Style', key: 'style', options: ['A-Line', 'Pencil', 'Pleated', 'Wrap'] },
    { label: 'Color', key: 'color', options: ['White', 'Black', 'Blue', 'Red', 'Other'] },
  ],
  'Blazer': [
    { label: 'Cloth Type', key: 'clothType', options: ['Wool', 'Cotton', 'Linen', 'Synthetic'] },
    { label: 'Button Style', key: 'buttonStyle', options: ['Single Breasted', 'Double Breasted'] },
    { label: 'Lining Type', key: 'liningType', options: ['Full Lined', 'Half Lined', 'Unlined'] },
    { label: 'Color', key: 'color', options: ['Black', 'Navy', 'Grey', 'Beige', 'Other'] },
  ],
  'Pant Elastic': [
    { label: 'Color', key: 'color', options: ['Black', 'White', 'Grey', 'Other'] },
  ],
  'Pant Belt': [
    { label: 'Color', key: 'color', options: ['Black', 'Brown', 'Tan', 'Other'] },
  ],
};

const OrderForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    customer: '',
    dueDate: '',
    orderDescription: '',
    items: [
      { id: 1, product: '', sizes: {}, details: {} }
    ]
  });

  // Product configuration (sizes + detail fields) loaded from the backend.
  const [sizeConfig, setSizeConfig] = useState(FALLBACK_SIZE_MAPPING);
  const [detailConfig, setDetailConfig] = useState(FALLBACK_DETAIL_MAPPING);
  const [customerSuggestions, setCustomerSuggestions] = useState([]);

  // Image state: a newly chosen File (orderImage) + its preview URL, and any existing image (edit mode).
  const [orderImage, setOrderImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);

  // Live clock (#6) and the order's date (#1).
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [orderDateDisplay, setOrderDateDisplay] = useState(new Date());

  // Inline "add" UI state for custom sizes (#4) and custom options (#3).
  const [sizeAdd, setSizeAdd] = useState(null);       // { itemId, value }
  const [optionAdd, setOptionAdd] = useState(null);   // { itemId, fieldKey, value }

  // Tracks an in-flight create/update request so the button can show progress.
  const [isSubmitting, setIsSubmitting] = useState(false);

  const products = Object.keys(sizeConfig);

  // Live clock tick
  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load product configs + customer suggestions on mount
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const productList = await ApiService.getProductConfigs();
        if (Array.isArray(productList) && productList.length > 0) {
          const sizeMap = {};
          const detailMap = {};
          productList.forEach(p => {
            sizeMap[p.name] = p.sizes || [];
            detailMap[p.name] = p.details || [];
          });
          setSizeConfig(sizeMap);
          setDetailConfig(detailMap);
        }
      } catch (err) {
        console.error('Failed to load product configs, using fallback:', err);
      }

      try {
        const orders = await ApiService.getOrders();
        const names = [...new Set((orders || []).map(o => o.customerName).filter(Boolean))];
        setCustomerSuggestions(names);
      } catch (err) {
        console.error('Failed to load customer suggestions:', err);
      }
    };
    loadConfig();
  }, []);

  // Prefill the form when editing an existing order
  useEffect(() => {
    if (!isEdit) return;
    const loadOrder = async () => {
      try {
        const order = await ApiService.getOrder(id);
        setFormData({
          customer: order.customerName || '',
          dueDate: order.deliveryDate ? new Date(order.deliveryDate).toISOString().slice(0, 10) : '',
          orderDescription: order.orderDescription || '',
          items: (order.items || []).map((it, i) => ({
            id: i + 1,
            product: it.product || '',
            sizes: it.sizes || {},
            details: it.details || {}
          }))
        });
        if (order.orderImage?.url) setExistingImageUrl(order.orderImage.url);
        if (order.orderDate || order.createdAt) {
          setOrderDateDisplay(new Date(order.orderDate || order.createdAt));
        }
      } catch (err) {
        console.error('Failed to load order for editing:', err);
        alert('❌ Failed to load order for editing.');
      }
    };
    loadOrder();
  }, [id, isEdit]);

  // Revoke object URL on unmount / change to avoid leaks
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleImageChange = (file) => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setOrderImage(file || null);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const validatePayload = (payload) => {
    if (!payload.customerName?.trim()) {
      return 'Customer name is required';
    }
    if (!payload.deliveryDate) {
      return 'Delivery date is required';
    }
    if (!payload.product?.trim()) {
      return 'At least one product is required';
    }
    if (!Array.isArray(payload.items) || payload.items.length === 0) {
      return 'At least one item is required';
    }
    for (const item of payload.items) {
      if (!item.product || item.product.trim() === '') return 'Each item must have a product selected';
      if (!item.sizes || Object.keys(item.sizes).length === 0) return 'Each item must have sizes';
    }
    return null;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    try {
      const validItems = formData.items.filter(item => item.product && item.product.trim() !== '');

      const payload = {
        customerName: formData.customer,
        deliveryDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : '',
        product: validItems.length > 0 ? validItems[0].product : '',
        items: validItems.map(item => ({
          product: item.product,
          sizes: item.sizes,
          details: item.details || {}
        })),
        orderDescription: formData.orderDescription || ''
      };

      const validationError = validatePayload(payload);
      if (validationError) {
        alert(`❌ ${validationError}`);
        return;
      }

      setIsSubmitting(true);

      // Only send multipart FormData when a NEW image file was chosen; otherwise send JSON
      // (on edit, sending JSON keeps the existing image untouched).
      let result;
      if (orderImage) {
        const fd = new FormData();
        fd.append('customerName', payload.customerName);
        fd.append('deliveryDate', payload.deliveryDate);
        fd.append('product', payload.product);
        fd.append('items', JSON.stringify(payload.items));
        if (payload.orderDescription) {
          fd.append('orderDescription', payload.orderDescription);
        }
        fd.append('orderImage', orderImage);

        result = isEdit
          ? await ApiService.updateOrder(id, fd)
          : await ApiService.createOrder(fd);
      } else {
        result = isEdit
          ? await ApiService.updateOrder(id, payload)
          : await ApiService.createOrder(payload);
      }

      alert(isEdit ? '✅ Order updated successfully!' : '✅ Order created successfully!');
      navigate(isEdit ? `/orders/${id}` : '/orders');
    } catch (error) {
      console.error('Save order error:', error);

      if (error.message && error.message.includes('Authentication required')) {
        alert('❌ Please login to continue.');
        navigate('/login');
        return;
      }

      const message = error?.payload?.message || error.message || 'Server Error. Please try again.';
      alert(`❌ ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (itemId, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };

          if (field === 'product' && value) {
            const newSizes = {};
            const availableSizes = sizeConfig[value] || [];
            availableSizes.forEach(size => {
              newSizes[size] = { quantity: 0, price: 0 };
            });
            updatedItem.sizes = newSizes;
            updatedItem.details = {};
          }

          return updatedItem;
        }
        return item;
      })
    }));
  };

  const handleSizeChange = (itemId, size, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId
          ? {
              ...item,
              sizes: {
                ...item.sizes,
                [size]: {
                  ...item.sizes[size],
                  [field]: field === 'quantity' ? parseInt(value) || 0 : parseFloat(value) || 0
                }
              }
            }
          : item
      )
    }));
  };

  // #4 — Add a custom size to a product (persists via API + updates local config)
  const handleAddSize = async (productName) => {
    const value = (sizeAdd?.value || '').trim();
    if (!value || !productName) {
      setSizeAdd(null);
      return;
    }
    try {
      await ApiService.addProductSize(productName, value);
    } catch (err) {
      console.error('addProductSize failed (continuing locally):', err);
    }
    setSizeConfig(prev => {
      const existing = prev[productName] || [];
      if (existing.includes(value)) return prev;
      return { ...prev, [productName]: [...existing, value] };
    });
    setSizeAdd(null);
  };

  // #3 — Add a custom option to a detail field (persists via API + updates local config)
  const handleAddOption = async (productName, fieldKey) => {
    const value = (optionAdd?.value || '').trim();
    if (!value || !productName) {
      setOptionAdd(null);
      return;
    }
    try {
      await ApiService.addProductOption(productName, fieldKey, value);
    } catch (err) {
      console.error('addProductOption failed (continuing locally):', err);
    }
    setDetailConfig(prev => {
      const fields = (prev[productName] || []).map(f =>
        f.key === fieldKey && !f.options.includes(value)
          ? { ...f, options: [...f.options, value] }
          : f
      );
      return { ...prev, [productName]: fields };
    });
    setOptionAdd(null);
  };

  const addProduct = () => {
    const newId = Math.max(0, ...formData.items.map(item => item.id)) + 1;
    const newItem = {
      id: newId,
      product: '',
      sizes: {},
      details: {}
    };

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeProduct = (itemId) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== itemId)
      }));
    }
  };

  // Sizes shown for an item: configured sizes for the product, plus any extra sizes the item already carries.
  const getCurrentSizes = (item) => {
    const configured = item.product ? (sizeConfig[item.product] || []) : [];
    const extra = Object.keys(item.sizes || {}).filter(s => !configured.includes(s));
    return [...configured, ...extra];
  };

  const calculateRowTotal = (item) => {
    return Object.values(item.sizes || {}).reduce((total, size) => {
      return total + (size.quantity * size.price);
    }, 0);
  };

  const calculateRowPieces = (item) => {
    return Object.values(item.sizes || {}).reduce((total, size) => {
      return total + (size.quantity || 0);
    }, 0);
  };

  const getAllUniqueSizes = () => {
    const allSizes = new Set();
    formData.items.forEach(item => {
      getCurrentSizes(item).forEach(size => allSizes.add(size));
    });
    return Array.from(allSizes);
  };

  const calculateGrandTotal = () => {
    return formData.items.reduce((total, item) => {
      return total + calculateRowTotal(item);
    }, 0);
  };

  const calculateGrandPieces = () => {
    return formData.items.reduce((total, item) => {
      return total + calculateRowPieces(item);
    }, 0);
  };

  const handleProductDetailsChange = (itemId, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId
          ? {
              ...item,
              details: {
                ...item.details,
                [field]: value
              }
            }
          : item
      )
    }));
  };

  const handleGeneratePDF = () => {
    const { customer, dueDate, items, orderDescription } = formData;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Order Summary', 14, 20);

    doc.setFontSize(12);
    doc.text(`Customer Name: ${customer}`, 14, 30);
    doc.text(`Due Date: ${dueDate}`, 14, 38);
    if (orderDescription) {
      doc.text(`Description: ${orderDescription}`, 14, 46);
    }

    let y = orderDescription ? 56 : 48;

    doc.text('Order Items:', 14, y);
    y += 10;

    items.forEach((item, idx) => {
      doc.text(`${idx + 1}. Product: ${item.product}`, 14, y);
      y += 7;

      const orderedSizes = Object.entries(item.sizes).filter(
        ([_, data]) => data.quantity > 0
      );

      if (orderedSizes.length === 0) {
        doc.text('   - No quantities ordered.', 14, y);
        y += 6;
      } else {
        orderedSizes.forEach(([size, data]) => {
          doc.text(
            `   - Size: ${size} | Qty: ${data.quantity} | Price: ₹${data.price} | Total: ₹${(data.quantity * data.price).toFixed(2)}`,
            14,
            y
          );
          y += 6;
        });
      }

      if (item.details) {
        Object.entries(item.details).forEach(([key, val]) => {
          if (!key.includes('Image')) {
            doc.text(`   - ${key}: ${val}`, 14, y);
            y += 6;
          }
        });
      }

      y += 5;
    });

    doc.setFontSize(14);
    doc.text(`Grand Total: ₹${calculateGrandTotal()}`, 14, y);

    doc.save(`Order_${customer}.pdf`);
  };

  const renderDetailFields = (item, fields) => (
    <div className="w-full px-2 py-2 border-t border-gray-200">
      <div className="flex flex-wrap items-start gap-6 w-full">
        {fields.map((field) => {
          const isAdding = optionAdd && optionAdd.itemId === item.id && optionAdd.fieldKey === field.key;
          return (
            <div key={field.key} className="flex flex-col space-y-2 w-48">
              <label className="text-xs font-medium text-gray-700">{field.label}</label>
              <div className="flex items-center space-x-2">
                <select
                  value={item.details?.[field.key] || ''}
                  onChange={(e) => handleProductDetailsChange(item.id, field.key, e.target.value)}
                  className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                >
                  <option value="">Select</option>
                  {field.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>

                <label className="w-8 h-8 flex items-center justify-center border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors group">
                  <Upload className="h-4 w-4 text-gray-400 group-hover:text-blue-500" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          handleProductDetailsChange(item.id, `${field.key}Image`, reader.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>

              {/* #3 — Add a custom option to this field */}
              {isAdding ? (
                <div className="flex items-center space-x-1">
                  <input
                    type="text"
                    autoFocus
                    value={optionAdd.value}
                    onChange={(e) => setOptionAdd({ ...optionAdd, value: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddOption(item.product, field.key);
                      if (e.key === 'Escape') setOptionAdd(null);
                    }}
                    placeholder={`New ${field.label}`}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-400"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddOption(item.product, field.key)}
                    className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setOptionAdd(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setOptionAdd({ itemId: item.id, fieldKey: field.key, value: '' })}
                  className="text-xs text-blue-600 hover:text-blue-800 text-left inline-flex items-center"
                >
                  <Plus className="h-3 w-3 mr-1" /> Add {field.label}
                </button>
              )}

              {item.details?.[`${field.key}Image`] && (
                <div className="relative mt-1 w-20 h-20 group">
                  <img
                    src={item.details[`${field.key}Image`]}
                    alt={`${field.label} preview`}
                    className="w-20 h-20 object-cover rounded-md border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleProductDetailsChange(item.id, `${field.key}Image`, '')}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md transition-all opacity-0 group-hover:opacity-100"
                    title="Remove image"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const handlePrintPage = () => {
    window.print();
  };

  return (
    <div className=" mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Edit Order' : 'Create New Order'}
        </h2>
        {/* #6 — Live date & time */}
        <div className="text-sm text-gray-600 text-right">
          <div className="font-medium text-gray-800">
            {currentDateTime.toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
          </div>
          <div>{currentDateTime.toLocaleTimeString('en-IN')}</div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Customer Information Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Order Information</h3>

          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name *
              </label>
              <input
                type="text"
                name="customer"
                list="customer-suggestions"
                value={formData.customer}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <datalist id="customer-suggestions">
                {customerSuggestions.map(name => (
                  <option key={name} value={name} />
                ))}
              </datalist>
            </div>

            {/* #1 — Order Date (read-only) */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Date
              </label>
              <p className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm">
                {orderDateDisplay.toLocaleDateString('en-IN')}
              </p>
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date *
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Image
              </label>
              <div className="relative">
                <label className="flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                    className="hidden"
                  />
                  {orderImage ? (
                    <div className="flex items-center space-x-2">
                      <ImageIcon className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-gray-700 truncate max-w-[150px]">{orderImage.name}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleImageChange(null);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Upload className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-500">Upload Image</span>
                    </div>
                  )}
                </label>
                {/* #2 — Image preview (new file or existing image in edit mode) */}
                {(imagePreview || existingImageUrl) && (
                  <img
                    src={imagePreview || existingImageUrl}
                    alt="Order preview"
                    className="mt-2 w-24 h-24 object-cover rounded-md border border-gray-200"
                  />
                )}
              </div>
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <input
                type="text"
                name="orderDescription"
                value={formData.orderDescription}
                onChange={handleChange}
                placeholder="Order notes..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Order Items Matrix */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
            <button
              type="button"
              onClick={addProduct}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Product
            </button>
          </div>

          {formData.items.map((item) => (
            <div key={item.id} className="mb-4 rounded-lg border border-gray-200 overflow-hidden">
              {/* Product Header */}
              <div className="bg-white px-4 py-3 flex justify-between items-center">
                <select
                  value={item.product}
                  onChange={(e) => handleItemChange(item.id, 'product', e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm w-64 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Product</option>
                  {products.map(product => (
                    <option key={product} value={product}>{product}</option>
                  ))}
                </select>

                <div className="flex items-center space-x-4">
                  <span className="text-gray-500 text-sm">
                    Pieces: {calculateRowPieces(item)}
                  </span>
                  <span className="text-gray-700 font-bold text-sm">
                    Total: ₹{calculateRowTotal(item)}
                  </span>
                  <button onClick={() => removeProduct(item.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Size Matrix */}
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700 bg-blue-50">SIZE</th>
                      {getCurrentSizes(item).map(size => (
                        <th key={`${item.id}-${size}`} className="px-2 py-2 text-center font-semibold text-gray-700">
                          {size}
                        </th>
                      ))}
                      {/* #4 — Add custom size */}
                      {item.product && (
                        <th className="px-2 py-2 text-center">
                          {sizeAdd && sizeAdd.itemId === item.id ? (
                            <div className="flex items-center space-x-1">
                              <input
                                type="text"
                                autoFocus
                                value={sizeAdd.value}
                                onChange={(e) => setSizeAdd({ ...sizeAdd, value: e.target.value })}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleAddSize(item.product);
                                  if (e.key === 'Escape') setSizeAdd(null);
                                }}
                                placeholder="Size"
                                className="w-16 border border-gray-300 rounded px-1 py-0.5 text-center"
                              />
                              <button type="button" onClick={() => handleAddSize(item.product)} className="text-green-600 hover:text-green-800" title="Add">
                                <Save className="w-3.5 h-3.5" />
                              </button>
                              <button type="button" onClick={() => setSizeAdd(null)} className="text-red-500 hover:text-red-700" title="Cancel">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setSizeAdd({ itemId: item.id, value: '' })}
                              className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                              title="Add size"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          )}
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50">
                      <td className="px-2 py-2 text-center text-xs font-medium text-gray-700 bg-blue-50">QTY</td>
                      {getCurrentSizes(item).map(size => (
                        <td key={`${item.id}-${size}-qty`} className="px-1 py-1 text-center">
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={item.sizes[size]?.quantity || 0}
                            onChange={(e) => handleSizeChange(item.id, size, 'quantity', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-2 py-1 text-center focus:ring-2 focus:ring-blue-400"
                          />
                        </td>
                      ))}
                      {item.product && <td className="px-1 py-1"></td>}
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-2 py-2 text-center text-xs font-medium text-gray-700 bg-blue-50">PRICE</td>
                      {getCurrentSizes(item).map(size => (
                        <td key={`${item.id}-${size}-price`} className="px-1 py-1 text-center">
                          <input
                            type="text"
                            inputMode="decimal"
                            pattern="[0-9]*"
                            value={item.sizes[size]?.price || 0}
                            onChange={(e) => handleSizeChange(item.id, size, 'price', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-2 py-1 text-center focus:ring-2 focus:ring-green-400"
                          />
                        </td>
                      ))}
                      {item.product && <td className="px-1 py-1"></td>}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Product Details */}
              {item.product && (detailConfig[item.product]?.length > 0) && (
                <div className="p-2 bg-gray-50">
                  {renderDetailFields(item, detailConfig[item.product])}
                </div>
              )}
            </div>
          ))}

          {/* Grand Total */}
          <div className="flex justify-end border-t border-gray-200 pt-4 mt-4">
            <div className="flex space-x-8 text-right">
              <div>
                <div className="text-sm text-gray-600">Total Pieces:</div>
                <div className="text-xl font-semibold text-gray-800">{calculateGrandPieces()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Grand Total:</div>
                <div className="text-2xl font-bold text-gray-900">₹{calculateGrandTotal()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/orders')}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors inline-flex items-center"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-flex items-center disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isEdit ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isEdit ? 'Update Order' : 'Create Order'}
              </>
            )}
          </button>

          <button onClick={handlePrintPage} className="px-4 py-2 bg-green-600 text-white rounded">
            Print / Save as PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
