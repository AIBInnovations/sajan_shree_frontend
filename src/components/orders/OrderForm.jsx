import React, { useState } from 'react';
import { Save, X, Plus, Trash2 } from 'lucide-react';

const OrderForm = () => {
  const [formData, setFormData] = useState({
    customer: '',
    phone: '',
    email: '',
    dueDate: '',
    orderType: 'walk-in',
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
        email: formData.email,
        deliveryDate: formData.dueDate,
        orderType: formData.orderType,
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

  return (
    <div className="max-w-full mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Create New Order</h2>
      </div>

      <div className="space-y-6">
        {/* Customer Information Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name *
              </label>
              <input
                type="text"
                name="customer"
                value={formData.customer}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date *
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
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
          </div>
        </div>

        {/* Order Items Matrix */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
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
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300 min-w-48">
                    Product
                  </th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                    
                  </th>
                  {getAllUniqueSizes().map(size => (
                    <th key={size} className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300 min-w-20">
                      {size}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300">
                    Total
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {formData.items.map((item, itemIndex) => (
                  <React.Fragment key={item.id}>
                    {/* Product Row */}
                    <tr className="border-b border-gray-200">
                      <td className="sticky left-0 z-10 bg-white px-4 py-3 border-r border-gray-300" rowSpan="2">
                        <select
                          value={item.product}
                          onChange={(e) => handleItemChange(item.id, 'product', e.target.value)}
                          className="w-full px-2 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="">Select Product</option>
                          {products.map(product => (
                            <option key={product} value={product}>{product}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-2 py-2 text-xs font-medium text-gray-600 border-r border-gray-300 bg-blue-50">
                        QTY
                      </td>
                      {getAllUniqueSizes().map(size => {
                        const itemSizes = getCurrentSizes(item);
                        const hasSize = itemSizes.includes(size);
                        return (
                          <td key={`${item.id}-${size}-qty`} className="px-1 py-2 border-r border-gray-300">
                            {hasSize ? (
                              <input
                                type="number"
                                value={item.sizes[size]?.quantity || 0}
                                onChange={(e) => handleSizeChange(item.id, size, 'quantity', e.target.value)}
                                min="0"
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            ) : (
                              <div className="w-full px-2 py-1 text-center text-gray-300">-</div>
                            )}
                          </td>
                        );
                      })}
                      <td className="px-4 py-2 text-sm font-medium text-gray-900 text-center border-r border-gray-300" rowSpan="2">
                        ₹{calculateRowTotal(item)}
                      </td>
                      <td className="px-4 py-2 text-center" rowSpan="2">
                        <button
                          type="button"
                          onClick={() => removeProduct(item.id)}
                          disabled={formData.items.length <= 1}
                          className="text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                    {/* Price Row */}
                    <tr className="border-b-2 border-gray-300">
                      <td className="px-2 py-2 text-xs font-medium text-gray-600 border-r border-gray-300 bg-green-50">
                        PRICE
                      </td>
                      {getAllUniqueSizes().map(size => {
                        const itemSizes = getCurrentSizes(item);
                        const hasSize = itemSizes.includes(size);
                        return (
                          <td key={`${item.id}-${size}-price`} className="px-1 py-2 border-r border-gray-300">
                            {hasSize ? (
                              <input
                                type="number"
                                value={item.sizes[size]?.price || 0}
                                onChange={(e) => handleSizeChange(item.id, size, 'price', e.target.value)}
                                min="0"
                                step="0.01"
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            ) : (
                              <div className="w-full px-2 py-1 text-center text-gray-300">-</div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Grand Total */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-end">
              <div className="text-right">
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
        </div>
      </div>
    </div>
  );
};

export default OrderForm;