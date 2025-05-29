// components/inventory/StockAdjustment.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X } from 'lucide-react';

const StockAdjustment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: 'finished',
    item: '',
    adjustmentType: 'add',
    quantity: '',
    reason: '',
    notes: ''
  });

  const finishedGoods = [
    { id: 1, name: 'Classic White Shirt' },
    { id: 2, name: 'Blue Denim Jeans' },
    { id: 3, name: 'Cotton T-Shirt' },
    { id: 4, name: 'Formal Trousers' },
    { id: 5, name: 'Pleated Skirt' }
  ];

  const rawMaterials = [
    { id: 1, name: 'White Cotton Fabric' },
    { id: 2, name: 'Denim Fabric' },
    { id: 3, name: 'Buttons (White)' },
    { id: 4, name: 'Zippers' },
    { id: 5, name: 'Thread (Black)' }
  ];

  const reasons = [
    'Production',
    'Damage',
    'Loss',
    'Return',
    'Manual Correction',
    'Other'
  ];

  const items = formData.type === 'finished' ? finishedGoods : rawMaterials;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Stock adjustment:', formData);
    navigate('/inventory');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Stock Adjustment</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Inventory Type
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="finished"
                checked={formData.type === 'finished'}
                onChange={handleChange}
                className="mr-2"
              />
              <span>Finished Goods</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="raw"
                checked={formData.type === 'raw'}
                onChange={handleChange}
                className="mr-2"
              />
              <span>Raw Materials</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Item
          </label>
          <select
            name="item"
            value={formData.item}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select an item</option>
            {items.map(item => (
              <option key={item.id} value={item.name}>{item.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adjustment Type
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="adjustmentType"
                value="add"
                checked={formData.adjustmentType === 'add'}
                onChange={handleChange}
                className="mr-2"
              />
              <span>Add Stock</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="adjustmentType"
                value="remove"
                checked={formData.adjustmentType === 'remove'}
                onChange={handleChange}
                className="mr-2"
              />
              <span>Remove Stock</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason
          </label>
          <select
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select reason</option>
            {reasons.map(reason => (
              <option key={reason} value={reason}>{reason}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/inventory')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <X className="w-4 h-4 mr-2 inline" />
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4 mr-2 inline" />
            Save Adjustment
          </button>
        </div>
      </form>
    </div>
  );
};

export default StockAdjustment;