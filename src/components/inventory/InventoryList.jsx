// components/inventory/InventoryList.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, AlertTriangle, TrendingDown } from 'lucide-react';
import SearchBar from '../common/SearchBar';
import LowStockAlert from './LowStockAlert';

const InventoryList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('finished');

  const finishedGoods = [
    { id: 1, name: 'Classic White Shirt', sku: 'SHT-001', stock: 45, minStock: 10, value: 40455 },
    { id: 2, name: 'Blue Denim Jeans', sku: 'PNT-001', stock: 30, minStock: 15, value: 38970 },
    { id: 3, name: 'Cotton T-Shirt', sku: 'TSH-001', stock: 8, minStock: 20, value: 3992 },
    { id: 4, name: 'Formal Trousers', sku: 'TRS-001', stock: 25, minStock: 10, value: 39975 },
    { id: 5, name: 'Pleated Skirt', sku: 'SKT-001', stock: 5, minStock: 10, value: 4995 }
  ];

  const rawMaterials = [
    { id: 1, name: 'White Cotton Fabric', unit: 'meters', stock: 150, minStock: 100, value: 22500 },
    { id: 2, name: 'Denim Fabric', unit: 'meters', stock: 80, minStock: 50, value: 16000 },
    { id: 3, name: 'Buttons (White)', unit: 'pieces', stock: 500, minStock: 1000, value: 2500 },
    { id: 4, name: 'Zippers', unit: 'pieces', stock: 200, minStock: 150, value: 4000 },
    { id: 5, name: 'Thread (Black)', unit: 'spools', stock: 20, minStock: 30, value: 1000 }
  ];

  const items = activeTab === 'finished' ? finishedGoods : rawMaterials;
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.sku && item.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const lowStockItems = items.filter(item => item.stock <= item.minStock);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Inventory</h2>
        <Link
          to="/inventory/adjust"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Package className="w-4 h-4 mr-2" />
          Stock Adjustment
        </Link>
      </div>

      {lowStockItems.length > 0 && <LowStockAlert items={lowStockItems} />}

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('finished')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'finished'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Finished Goods
            </button>
            <button
              onClick={() => setActiveTab('raw')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'raw'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Raw Materials
            </button>
          </nav>
        </div>

        <div className="p-4">
          <SearchBar
            placeholder={`Search ${activeTab === 'finished' ? 'products' : 'materials'}...`}
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                {activeTab === 'finished' && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                )}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Min Stock
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Value
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.name}
                  </td>
                  {activeTab === 'finished' && (
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.sku}
                    </td>
                  )}
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.stock} {item.unit || 'units'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.minStock} {item.unit || 'units'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{item.value}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {item.stock <= item.minStock ? (
                      <span className="inline-flex items-center text-xs font-medium text-red-800">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        Low Stock
                      </span>
                    ) : item.stock <= item.minStock * 1.5 ? (
                      <span className="inline-flex items-center text-xs font-medium text-yellow-800">
                        <TrendingDown className="w-4 h-4 mr-1" />
                        Running Low
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-green-800">
                        In Stock
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryList;