// components/orders/OrderDetail.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Printer, FileText } from 'lucide-react';
import OrderStatusBadge from './OrderStatusBadge';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('in-production');

  // Mock data - replace with actual API call
  const order = {
    id: 'ORD-001',
    customer: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    email: 'rajesh@example.com',
    date: '2024-01-15',
    dueDate: '2024-01-20',
    status: status,
    orderType: 'walk-in',
    items: [
      { product: 'Classic White Shirt', size: 'L', color: 'White', quantity: 2, price: 899 },
      { product: 'Blue Denim Jeans', size: '32', color: 'Blue', quantity: 1, price: 1299 }
    ],
    payment: {
      total: 3097,
      paid: 1500,
      due: 1597
    }
  };

  const statuses = ['received', 'in-production', 'ready', 'dispatched', 'delivered'];

  const updateStatus = (newStatus) => {
    setStatus(newStatus);
    // API call to update status
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/orders')}
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
        </div>
        <div className="flex space-x-2">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            <FileText className="w-4 h-4 mr-2" />
            Invoice
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Order Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-medium">{order.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Type</p>
                <p className="font-medium capitalize">{order.orderType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-medium">{order.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Due Date</p>
                <p className="font-medium">{order.dueDate}</p>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Customer Details</h3>
            <div className="space-y-2">
              <p className="font-medium">{order.customer}</p>
              <p className="text-sm text-gray-600">{order.phone}</p>
              <p className="text-sm text-gray-600">{order.email}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Order Items</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-2 text-sm font-medium text-gray-700">Product</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-700">Size</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-700">Color</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-700">Qty</th>
                    <th className="text-right py-2 text-sm font-medium text-gray-700">Price</th>
                    <th className="text-right py-2 text-sm font-medium text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td className="py-3 text-sm">{item.product}</td>
                      <td className="py-3 text-sm">{item.size}</td>
                      <td className="py-3 text-sm">{item.color}</td>
                      <td className="py-3 text-sm">{item.quantity}</td>
                      <td className="py-3 text-sm text-right">₹{item.price}</td>
                      <td className="py-3 text-sm text-right">₹{item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t">
                  <tr>
                    <td colSpan="5" className="py-3 text-sm font-medium text-right">Total:</td>
                    <td className="py-3 text-sm font-bold text-right">₹{order.payment.total}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Status Update */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Order Status</h3>
            <div className="mb-4">
              <OrderStatusBadge status={status} />
            </div>
            <select
              value={status}
              onChange={(e) => updateStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statuses.map(s => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Payment Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Amount</span>
                <span className="font-medium">₹{order.payment.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Paid Amount</span>
                <span className="font-medium text-green-600">₹{order.payment.paid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Due Amount</span>
                <span className="font-medium text-red-600">₹{order.payment.due}</span>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Record Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;