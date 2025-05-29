// components/reports/Reports.jsx
import React, { useState } from 'react';
import { BarChart, TrendingUp, Package, Users, FileText, Download } from 'lucide-react';
import SalesReport from './SalesReport';
import InventoryReport from './InventoryReport';

const Reports = () => {
  const [activeReport, setActiveReport] = useState('sales');

  const reports = [
    { id: 'sales', name: 'Sales Report', icon: TrendingUp },
    { id: 'inventory', name: 'Inventory Report', icon: Package },
    { id: 'production', name: 'Production Report', icon: BarChart },
    { id: 'customer', name: 'Customer Report', icon: Users },
    { id: 'financial', name: 'Financial Report', icon: FileText }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Reports</h2>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {reports.map((report) => {
              const Icon = report.icon;
              return (
                <button
                  key={report.id}
                  onClick={() => setActiveReport(report.id)}
                  className={`flex items-center px-6 py-3 text-sm font-medium ${
                    activeReport === report.id
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {report.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeReport === 'sales' && <SalesReport />}
          {activeReport === 'inventory' && <InventoryReport />}
          {activeReport === 'production' && (
            <div className="text-center py-12 text-gray-500">
              Production Report - Coming Soon
            </div>
          )}
          {activeReport === 'customer' && (
            <div className="text-center py-12 text-gray-500">
              Customer Report - Coming Soon
            </div>
          )}
          {activeReport === 'financial' && (
            <div className="text-center py-12 text-gray-500">
              Financial Report - Coming Soon
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;