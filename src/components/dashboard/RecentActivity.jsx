import React from 'react';
import { Clock, Package, ShoppingCart, User } from 'lucide-react';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'order',
      message: 'New order #1234 received',
      customer: 'Rajesh Kumar',
      time: '5 minutes ago',
      icon: ShoppingCart,
      color: 'blue'
    },
    {
      id: 2,
      type: 'production',
      message: 'Production completed for order #1230',
      customer: 'Priya Sharma',
      time: '1 hour ago',
      icon: Package,
      color: 'green'
    },
    {
      id: 3,
      type: 'customer',
      message: 'New customer registered',
      customer: 'Amit Patel',
      time: '2 hours ago',
      icon: User,
      color: 'purple'
    },
    {
      id: 4,
      type: 'order',
      message: 'Order #1225 delivered',
      customer: 'Sunita Devi',
      time: '3 hours ago',
      icon: ShoppingCart,
      color: 'green'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${colorClasses[activity.color]}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                <p className="text-sm text-gray-500">{activity.customer}</p>
                <div className="flex items-center mt-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3 mr-1" />
                  {activity.time}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;