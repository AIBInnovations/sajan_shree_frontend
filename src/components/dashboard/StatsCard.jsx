import React from 'react';
import Card from '../ui/Card';

const StatsCard = ({ title, value, change, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    red: 'bg-red-50 text-red-600'
  };

  return (
    <Card className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-baseline flex-wrap gap-x-2">
        <span className="text-2xl font-bold text-foreground">{value}</span>
        <span className={`text-sm font-medium ${change.startsWith('+') ? 'text-green-600' : 'text-muted-foreground'}`}>
          {change}
        </span>
      </div>
    </Card>
  );
};

export default StatsCard;
