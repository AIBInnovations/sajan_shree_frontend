// components/customers/CustomerDetail.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Phone, Mail, MapPin, ShoppingCart } from 'lucide-react';

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data
  const customer = {
    id: 1,
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    email: 'rajesh@example.com',
    address: '123, Main Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    gstNumber: 'GST123456789',
    totalOrders: 12,
    totalSpent: 45000,
    lastOrder: '2024-01-15',
    orders: [
      { id: 'ORD-001', date: '2024-01-15', amount: 4500, status: 'In Production' },
      { id: 'ORD-008', date: '2024-01-10', amount: 3200, status: 'Delivered' },
      { id: 'ORD-015', date: '2024-01-05', amount: 5600, status: 'Delivered' }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/customers')}
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Customer Details</h2>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{customer.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">GST Number</p>
                <p className="font-medium">{customer.gstNumber || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-gray-400 mr-3" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-400 mr-3" />
                <span>{customer.email}</span>
              </div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p>{customer.address}</p>
                  <p>{customer.city}, {customer.state} - {customer.pincode}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-2 text-sm font-medium text-gray-700">Order ID</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-700">Date</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-700">Amount</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {customer.orders.map(order => (
                    <tr key={order.id}>
                      <td className="py-3 text-sm">{order.id}</td>
                      <td className="py-3 text-sm">{order.date}</td>
                      <td className="py-3 text-sm">₹{order.amount}</td>
                      <td className="py-3 text-sm">{order.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Orders</span>
                <span className="font-medium">{customer.totalOrders}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Spent</span>
                <span className="font-medium">₹{customer.totalSpent}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Last Order</span>
                <span className="font-medium">{customer.lastOrder}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Create New Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;