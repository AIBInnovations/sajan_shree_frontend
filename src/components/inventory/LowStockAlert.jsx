// components/inventory/LowStockAlert.jsx
import React from 'react';
import { AlertTriangle } from 'lucide-react';

const LowStockAlert = ({ items }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            Low Stock Alert
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{items.length} items are running low on stock:</p>
            <ul className="list-disc list-inside mt-1">
              {items.slice(0, 3).map((item, index) => (
                <li key={index}>{item.name} - {item.stock} {item.unit || 'units'} remaining</li>
              ))}
              {items.length > 3 && <li>and {items.length - 3} more...</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LowStockAlert;