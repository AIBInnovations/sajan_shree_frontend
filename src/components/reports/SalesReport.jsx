// components/reports/SalesReport.jsx
import React, { useState } from 'react';
import { Download, Calendar } from 'lucide-react';

const SalesReport = () => {
  const [dateRange, setDateRange] = useState('month');

  const salesData = {
    summary: {
      totalSales: 245000,
      totalOrders: 156,
      avgOrderValue: 1571,
      topProduct: 'Classic White Shirt'
    },
    dailySales: [
      { date: '2024-01-15', orders: 12, amount: 18500 },
      { date: '2024-01-14', orders: 8, amount: 12300 },
      { date: '2024-01-13', orders: 15, amount: 23400 },
      { date: '2024-01-12', orders: 10, amount: 15600 },
      { date: '2024-01-11', orders: 14, amount: 21800 }
    ],
    categoryBreakdown: [
      { category: 'Shirts', amount: 89000, percentage: 36 },
      { category: 'Pants', amount: 67000, percentage: 27 },
      { category: 'T-Shirts', amount: 45000, percentage: 18 },
      { category: 'Skirts', amount: 28000, percentage: 12 },
      { category: 'Trousers', amount: 16000, percentage: 7 }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Sales Report</h3>
          <p className="text-sm text-gray-500">Track your sales performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">Total Sales</p>
          <p className="text-2xl font-bold text-gray-900">₹{salesData.summary.totalSales.toLocaleString()}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900">{salesData.summary.totalOrders}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">Avg Order Value</p>
          <p className="text-2xl font-bold text-gray-900">₹{salesData.summary.avgOrderValue}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">Top Product</p>
          <p className="text-lg font-bold text-gray-900">{salesData.summary.topProduct}</p>
        </div>
      </div>

      {/* Daily Sales Table */}
      <div>
        <h4 className="text-md font-semibold mb-4">Daily Sales</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {salesData.dailySales.map((day) => (
                <tr key={day.date}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {day.date}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {day.orders}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{day.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Breakdown */}
      <div>
        <h4 className="text-md font-semibold mb-4">Sales by Category</h4>
        <div className="space-y-3">
          {salesData.categoryBreakdown.map((category) => (
            <div key={category.category} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{category.category}</span>
                  <span className="text-sm text-gray-500">₹{category.amount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
              </div>
              <span className="ml-4 text-sm font-medium text-gray-700">{category.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesReport;