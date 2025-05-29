// components/production/ProductionJobs.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import SearchBar from '../common/SearchBar';
import JobCard from './JobCard';

const ProductionJobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const jobs = [
    {
      id: 'JOB-001',
      orderId: 'ORD-001',
      customer: 'Rajesh Kumar',
      products: ['Classic White Shirt x2', 'Blue Denim Jeans x1'],
      assignedTo: 'Team A',
      startDate: '2024-01-15',
      dueDate: '2024-01-18',
      status: 'in-progress',
      progress: 65
    },
    {
      id: 'JOB-002',
      orderId: 'ORD-002',
      customer: 'Priya Sharma',
      products: ['Cotton T-Shirt x3'],
      assignedTo: 'Team B',
      startDate: '2024-01-14',
      dueDate: '2024-01-17',
      status: 'completed',
      progress: 100
    },
    {
      id: 'JOB-003',
      orderId: 'ORD-004',
      customer: 'Sunita Devi',
      products: ['Formal Trousers x2'],
      assignedTo: 'Team A',
      startDate: '2024-01-16',
      dueDate: '2024-01-19',
      status: 'pending',
      progress: 0
    }
  ];

  const statuses = ['all', 'pending', 'in-progress', 'completed'];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Production Jobs</h2>
        <Link
          to="/production/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Job
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {statuses.map(status => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredJobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default ProductionJobs;