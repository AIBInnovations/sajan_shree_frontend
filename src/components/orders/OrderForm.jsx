import React, { useState } from 'react';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';


const OrderForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
  customer: '',
  phone: '',
  address: '',
  dueDate: '',
  orderType: 'walk-in',
  advancePayments: [
    {
      amount: 0,
      date: new Date().toISOString()
    }
  ],
  items: [
    { 
      id: 1, 
      product: 'Pant Elastic',
      sizes: {
        '20': { quantity: 0, price: 299 },
        '22': { quantity: 0, price: 309 },
        '24': { quantity: 0, price: 319 },
        '26': { quantity: 0, price: 329 },
        '28': { quantity: 0, price: 339 },
        '30': { quantity: 0, price: 349 },
        '32': { quantity: 0, price: 359 },
        '34': { quantity: 0, price: 369 },
        '36': { quantity: 0, price: 379 },
        '38': { quantity: 0, price: 389 },
        '40': { quantity: 0, price: 399 },
        '42': { quantity: 0, price: 409 },
        '44': { quantity: 0, price: 419 }
      }
    }
  ]
});


  const productSizeMapping = {
    'Pant Elastic': ['20', '22', '24', '26', '28', '30', '32', '34', '36', '38', '40', '42', '44'],
    'Pant Belt': ['26', '28', '30', '32', '34', '36', '38/26', '38/28', '40/28', '40/30', '40/32', '40/34', '42/28', '42/30', '42/32', '42/34', '42/36', '42/38', '42/40'],
    'Skirt': ['14', '16', '18', '20', '22', '24', '26/28', '26/30', '26/32', '26/34', '26/36'],
    'Tunick': ['20', '22', '24', '26', '28', '30', '32', '34', '36', '38', '40', '42', '44'],
    'Blazer': ['20', '22', '24', '26', '28', '30', '32', '34', '36', '38', '40', '42', '44'],
    'Shirt': ['20', '22', '24', '26', '28', '30', '32', '34', '36', '38', '40', '42', '44']
  };

  const products = Object.keys(productSizeMapping);

  const handleAdvanceChange = (amount) => {
  const newEntry = {
    amount: parseFloat(amount) || 0,
    date: new Date().toISOString()
  };
  setFormData(prev => ({
    ...prev,
    advancePayments: [...prev.advancePayments, newEntry]
  }));
};


  const handleSubmit = async () => {
    try {
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NmQwN2E4OWIwZGI3MzVlOTM1Yjg0OCIsInJvbGUiOiJBZG1pbiIsImlhdCI6MTc1MTk3NjI4MywiZXhwIjoxNzUyMDYyNjgzfQ.Yy5wBb9OvnSvMkvbm3_JkoCK8ImTL-fSWoNp4QAWQRA";
      if (!token) {
        alert("Please login first.");
        return;
      }

      const payload = {
        customerName: formData.customer,
        phone: formData.phone,
        address: formData.address,
        deliveryDate: formData.dueDate,
        orderType: formData.orderType,
        advancePayments: formData.advancePayments,
        items: formData.items.map(item => ({
          product: item.product,
          sizes: item.sizes
        }))
      };


      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Order created successfully!");
      } else {
        alert(`❌ Failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Create order error:", error);
      alert("❌ Server Error. Please try again.");
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
            const availableSizes = productSizeMapping[value] || [];
            availableSizes.forEach(size => {
              newSizes[size] = { quantity: 0, price: 0 };
            });
            updatedItem.sizes = newSizes;
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

  const addProduct = () => {
    const newId = Math.max(...formData.items.map(item => item.id)) + 1;
    const newItem = {
      id: newId,
      product: '',
      sizes: {}
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

  const getCurrentSizes = (item) => {
    if (!item.product) return [];
    return productSizeMapping[item.product] || [];
  };

  const calculateRowTotal = (item) => {
    return Object.values(item.sizes).reduce((total, size) => {
      return total + (size.quantity * size.price);
    }, 0);
  };

  const getAllUniqueSizes = () => {
    const allSizes = new Set();
    formData.items.forEach(item => {
      if (item.product) {
        const sizes = productSizeMapping[item.product] || [];
        sizes.forEach(size => allSizes.add(size));
      }
    });
    return Array.from(allSizes);
  };

  const calculateGrandTotal = () => {
    return formData.items.reduce((total, item) => {
      return total + calculateRowTotal(item);
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
      const { customer, phone, address, dueDate, orderType, items, advancePayments } = formData;
      const doc = new jsPDF();

      doc.setFontSize(16);
      doc.text('Order Summary', 14, 20);

      doc.setFontSize(12);
      doc.text(`Customer Name: ${customer}`, 14, 30);
      doc.text(`Address: ${address}`, 14, 38);
      doc.text(`Phone: ${phone}`, 14, 46);
      doc.text(`Order Type: ${orderType}`, 14, 54);
      doc.text(`Due Date: ${dueDate}`, 14, 62);

      doc.text('Advance Payments:', 14, 72);
      advancePayments.forEach((p, idx) => {
        doc.text(`• ₹${p.amount} on ${new Date(p.date).toLocaleDateString()}`, 20, 80 + (idx * 8));
      });

      let y = 90 + (advancePayments.length * 8);

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
          doc.text(`   - ${key}: ${val}`, 14, y);
          y += 6;
        });
      }

      y += 5;
    });


      doc.setFontSize(14);
      doc.text(`Grand Total: ₹${calculateGrandTotal()}`, 14, y);

      doc.save(`Order_${customer}.pdf`);
    };

  return (
    <div className=" mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Create New Order</h2>
      </div>

      <div className="space-y-6">
        {/* Customer Information Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>

          <div className="grid grid-cols-4 gap-4">
            {/* First Row */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name *
              </label>
              <input
                type="text"
                name="customer"
                value={formData.customer}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div className="col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Second Row */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d{0,10}$/.test(val)) {
                    handleChange(e);
                  }
                }}
                required
                maxLength="10"
                inputMode="numeric"
                pattern="\d*"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Type
              </label>
              <select
                name="orderType"
                value={formData.orderType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="walk-in">Walk-in</option>
                <option value="phone">Phone</option>
                <option value="online">Online</option>
              </select>
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
                Advance Paid (₹)
              </label>
              <input
                type="text"
                inputMode="decimal"
                pattern="[0-9]*"
                onBlur={(e) => handleAdvanceChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Enter Amount"
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
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Product Details */}
            {item.product && (
              <div className="p-2 bg-gray-50">
                <tr>
                        <td colSpan={getAllUniqueSizes().length + 4} className="p-2 bg-gray-50">
                          {item.product === 'Shirt' && (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Cloth Type</label>
                                <input
                                  type="text"
                                  value={item.details?.clothType || ''}
                                  onChange={(e) => handleProductDetailsChange(item.id, 'clothType', e.target.value)}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Collar Type</label>
                                <input
                                  type="text"
                                  value={item.details?.collarType || ''}
                                  onChange={(e) => handleProductDetailsChange(item.id, 'collarType', e.target.value)}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Sleeve Type</label>
                                <input
                                  type="text"
                                  value={item.details?.sleeveType || ''}
                                  onChange={(e) => handleProductDetailsChange(item.id, 'sleeveType', e.target.value)}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Pocket</label>
                                <select
                                  value={item.details?.pocket || ''}
                                  onChange={(e) => handleProductDetailsChange(item.id, 'pocket', e.target.value)}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                                >
                                  <option value="">Select</option>
                                  <option value="Yes">Yes</option>
                                  <option value="No">No</option>
                                </select>
                              </div>
                            </div>
                          )}

                          {item.product === 'Skirt' && (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Cloth Type</label>
                                  <input
                                    type="text"
                                    value={item.details?.clothType || ''}
                                    onChange={(e) => handleProductDetailsChange(item.id, 'clothType', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Length Type</label>
                                  <input
                                    type="text"
                                    value={item.details?.lengthType || ''}
                                    onChange={(e) => handleProductDetailsChange(item.id, 'lengthType', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Style</label>
                                  <input
                                    type="text"
                                    value={item.details?.style || ''}
                                    onChange={(e) => handleProductDetailsChange(item.id, 'style', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                                  />
                                </div>
                              </div>
                            )}
                            {item.product === 'Blazer' && (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Cloth Type</label>
                                  <input
                                    type="text"
                                    value={item.details?.clothType || ''}
                                    onChange={(e) => handleProductDetailsChange(item.id, 'clothType', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Button Style</label>
                                  <input
                                    type="text"
                                    value={item.details?.buttonStyle || ''}
                                    onChange={(e) => handleProductDetailsChange(item.id, 'buttonStyle', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Lining Type</label>
                                  <input
                                    type="text"
                                    value={item.details?.liningType || ''}
                                    onChange={(e) => handleProductDetailsChange(item.id, 'liningType', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                                  />
                                </div>
                              </div>
                            )}
                            {item.product === 'Pant Elastic' && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Elastic Type</label>
                                  <input
                                    type="text"
                                    value={item.details?.elasticType || ''}
                                    onChange={(e) => handleProductDetailsChange(item.id, 'elasticType', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Color</label>
                                  <input
                                    type="text"
                                    value={item.details?.color || ''}
                                    onChange={(e) => handleProductDetailsChange(item.id, 'color', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                                  />
                                </div>
                              </div>
                            )}
                            {item.product === 'Pant Belt' && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Material</label>
                                  <input
                                    type="text"
                                    value={item.details?.material || ''}
                                    onChange={(e) => handleProductDetailsChange(item.id, 'material', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Buckle Type</label>
                                  <input
                                    type="text"
                                    value={item.details?.buckleType || ''}
                                    onChange={(e) => handleProductDetailsChange(item.id, 'buckleType', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                                  />
                                </div>
                              </div>
                            )}
                        </td>
                      </tr>
                </div>
              )}
            </div>
          ))}

          {/* Grand Total */}
          <div className="flex justify-end border-t border-gray-200 pt-4 mt-4">
            <div className="text-right">
              <div className="text-sm text-gray-600">Grand Total:</div>
              <div className="text-2xl font-bold text-gray-900">₹{calculateGrandTotal()}</div>
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
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Create Order
          </button>
          <button
  onClick={handleGeneratePDF}
  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
>
  Generate PDF
</button>

        </div>
      </div>
    </div>
  );
};

export default OrderForm;