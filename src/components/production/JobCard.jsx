// components/production/JobCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, AlertCircle, User, Calendar } from 'lucide-react';

const JobCard = ({ job }) => {
  const statusConfig = {
    'pending': { icon: Clock, color: 'text-gray-500', bgColor: 'bg-gray-100' },
    'in-progress': { icon: AlertCircle, color: 'text-blue-500', bgColor: 'bg-blue-100' },
    'completed': { icon: CheckCircle, color: 'text-green-500', bgColor: 'bg-green-100' }
  };

  const config = statusConfig[job.status];
  const Icon = config.icon;

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{job.id}</h3>
          <p className="text-sm text-gray-500">Order: {job.orderId}</p>
        </div>
        <div className={`p-2 rounded-lg ${config.bgColor}`}>
          <Icon className={`w-5 h-5 ${config.color}`} />
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-sm font-medium text-gray-900">{job.customer}</p>
        <div className="text-sm text-gray-600">
          {job.products.map((product, index) => (
            <div key={index}>{product}</div>
          ))}
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center text-gray-600">
          <User className="w-4 h-4 mr-2" />
          {job.assignedTo}
        </div>
        <div className="flex items-center text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          Due: {job.dueDate}
        </div>
      </div>

      {job.status === 'in-progress' && (
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{job.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${job.progress}%` }}
            />
          </div>
        </div>
      )}

      <Link
        to={`/production/edit/${job.id}`}
        className="mt-4 block text-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        View Details
      </Link>
    </div>
  );
};

export default JobCard;