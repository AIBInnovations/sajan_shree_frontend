// components/orders/OrderStatusBadge.jsx
import React from 'react';

const OrderStatusBadge = ({ status }) => {
  const statusConfig = {
    'received': { color: 'bg-gray-100 text-gray-800', label: 'Received' },
    'in-production': { color: 'bg-blue-100 text-blue-800', label: 'In Production' },
    'ready': { color: 'bg-yellow-100 text-yellow-800', label: 'Ready' },
    'dispatched': { color: 'bg-purple-100 text-purple-800', label: 'Dispatched' },
    'delivered': { color: 'bg-green-100 text-green-800', label: 'Delivered' }
  };

  const config = statusConfig[status] || statusConfig['received'];

  return (
    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${config.color}`}>
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;