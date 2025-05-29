// components/reports/InventoryReport.jsx
import React from 'react';
import { Download, AlertTriangle, TrendingUp, Package } from 'lucide-react';

const InventoryReport = () => {
  const inventoryData = {
    summary: {
      totalItems: 253,
      totalValue: 128382,
      lowStockItems: 8,
      outOfStock: 2
    },
    stockMovement: [
      { product: 'Classic White Shirt', opening: 50, added: 20, sold: 25, closing: 45 },
      { product: 'Blue Denim Jeans', opening: 40, added: 10, sold: 20, closing: 30 },
      { product: 'Cotton T-Shirt', opening: 15, added: 0, sold: 7, closing: 8 },
      { product: 'Formal Trousers', opening: 30, added: 5, sold: 10, closing: 25 },
      { product: 'Pleated Skirt', opening: 10, added: 0, sold: 5, closing: 5 }
    ],
    stockAlerts: [
      { item: 'Cotton T-Shirt', current: 8, required: 20, status: 'critical' },
      { item: 'Pleated Skirt', current: 5, required: 10, status: 'low' },
      { item: 'Buttons (White)', current: 500, required: 1000, status: 'critical' },
      { item: 'Thread (Black)', current: 20, required: 30, status: 'low' }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Inventory Report</h3>
          <p className="text-sm text-gray-500">Monitor your stock levels and movements</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
          <Download className="w-4 h-4 mr-2" />
          Export
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{inventoryData.summary.totalItems}</p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Stock Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{inventoryData.summary.totalValue.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-600">{inventoryData.summary.lowStockItems}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{inventoryData.summary.outOfStock}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Stock Movement Table */}
      <div>
        <h4 className="text-md font-semibold mb-4">Stock Movement</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Opening
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Added
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sold
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Closing
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventoryData.stockMovement.map((item) => (
                <tr key={item.product}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.product}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.opening}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600">
                    +{item.added}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-red-600">
                    -{item.sold}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.closing}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Alerts */}
      <div>
        <h4 className="text-md font-semibold mb-4">Stock Alerts</h4>
        <div className="space-y-2">
          {inventoryData.stockAlerts.map((alert, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg ${
                alert.status === 'critical' ? 'bg-red-50' : 'bg-yellow-50'
              }`}
            >
              <div className="flex items-center">
                <AlertTriangle className={`w-5 h-5 mr-3 ${
                  alert.status === 'critical' ? 'text-red-600' : 'text-yellow-600'
                }`} />
                <div>
                  <p className="font-medium text-gray-900">{alert.item}</p>
                  <p className="text-sm text-gray-500">
                    Current: {alert.current} | Required: {alert.required}
                  </p>
                </div>
              </div>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                Reorder
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InventoryReport;