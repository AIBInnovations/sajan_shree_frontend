import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ShoppingCart } from 'lucide-react';

const timeAgo = (date) => {
  if (!date) return '';
  const then = new Date(date).getTime();
  if (Number.isNaN(then)) return '';
  const seconds = Math.floor((Date.now() - then) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? 's' : ''} ago`;
};

const statusColor = (status) => {
  switch (status) {
    case 'Completed':
    case 'Shipped':
      return 'bg-green-100 text-green-600';
    case 'Processing':
      return 'bg-blue-100 text-blue-600';
    default:
      return 'bg-yellow-100 text-yellow-600';
  }
};

const RecentActivity = ({ orders = [] }) => {
  const recent = [...orders]
    .sort((a, b) => new Date(b.createdAt || b.orderDate || 0) - new Date(a.createdAt || a.orderDate || 0))
    .slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      {recent.length === 0 ? (
        <p className="text-sm text-gray-500">No recent orders.</p>
      ) : (
        <div className="space-y-4">
          {recent.map((order) => (
            <Link
              key={order._id || order.orderId}
              to={`/orders/${order._id || order.orderId}`}
              className="flex items-start space-x-3 hover:bg-gray-50 -mx-2 px-2 py-1 rounded-md transition-colors"
            >
              <div className={`p-2 rounded-lg ${statusColor(order.status)}`}>
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Order {order.orderId || order._id} — {order.status}
                </p>
                <p className="text-sm text-gray-500">{order.customerName}</p>
                <div className="flex items-center mt-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3 mr-1" />
                  {timeAgo(order.createdAt || order.orderDate)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
