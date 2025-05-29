// components/customers/CustomerList.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Phone, Mail, Eye } from 'lucide-react';
import SearchBar from '../common/SearchBar';

const CustomerList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const customers = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      email: 'rajesh@example.com',
      totalOrders: 12,
      totalSpent: 45000,
      lastOrder: '2024-01-15'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      phone: '+91 98765 43211',
      email: 'priya@example.com',
      totalOrders: 8,
      totalSpent: 32000,
      lastOrder: '2024-01-14'
    },
    {
      id: 3,
      name: 'Amit Patel',
      phone: '+91 98765 43212',
      email: 'amit@example.com',
      totalOrders: 15,
      totalSpent: 67000,
      lastOrder: '2024-01-13'
    }
  ];

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Customers</h2>
        <Link
          to="/customers/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Link>
      </div>

      <SearchBar
        placeholder="Search customers..."
        value={searchTerm}
        onChange={setSearchTerm}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map(customer => (
          <div key={customer.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
              <Link
                to={`/customers/${customer.id}`}
                className="text-blue-600 hover:text-blue-900"
              >
                <Eye className="w-5 h-5" />
              </Link>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                {customer.phone}
              </div>
              <div className="flex items-center text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                {customer.email}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Total Orders</p>
                <p className="font-semibold">{customer.totalOrders}</p>
              </div>
              <div>
                <p className="text-gray-500">Total Spent</p>
                <p className="font-semibold">₹{customer.totalSpent}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerList;