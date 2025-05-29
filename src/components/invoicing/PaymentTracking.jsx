// components/invoicing/PaymentTracking.jsx
import React, { useState } from 'react';
import { DollarSign, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

const PaymentTracking = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const payments = [
    {
      id: 1,
      invoiceId: 'INV-001',
      customer: 'Rajesh Kumar',
      amount: 4500,
      paidAmount: 0,
      dueDate: '2024-01-30',
      status: 'pending'
    },
    {
      id: 2,
      invoiceId: 'INV-002',
      customer: 'Priya Sharma',
      amount: 2800,
      paidAmount: 1500,
      dueDate: '2024-01-29',
      status: 'partial'
    },
    {
      id: 3,
      invoiceId: 'INV-003',
      customer: 'Amit Patel',
      amount: 6200,
      paidAmount: 6200,
      dueDate: '2024-01-28',
      status: 'paid'
    },
    {
      id: 4,
      invoiceId: 'INV-004',
      customer: 'Sunita Devi',
      amount: 3500,
      paidAmount: 0,
      dueDate: '2024-01-15',
      status: 'overdue'
    }
  ];

  const filteredPayments = payments.filter(payment =>
    payment.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusConfig = (status) => {
    const configs = {
      pending: { color: 'text-yellow-600', bg: 'bg-yellow-50', icon: AlertCircle },
      partial: { color: 'text-blue-600', bg: 'bg-blue-50', icon: DollarSign },
      paid: { color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle },
      overdue: { color: 'text-red-600', bg: 'bg-red-50', icon: AlertCircle }
    };
    return configs[status] || configs.pending;
  };

  const totalDue = filteredPayments.reduce((sum, p) => sum + (p.amount - p.paidAmount), 0);
  const totalPaid = filteredPayments.reduce((sum, p) => sum + p.paidAmount, 0);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Payment Tracking</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Outstanding</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalDue}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Paid</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalPaid}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Overdue Payments</p>
              <p className="text-2xl font-bold text-gray-900">
                {payments.filter(p => p.status === 'overdue').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            placeholder="Search by invoice or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paid Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => {
                const config = getStatusConfig(payment.status);
                const Icon = config.icon;
                return (
                  <tr key={payment.id}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {payment.invoiceId}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.customer}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{payment.amount}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{payment.paidAmount}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{payment.amount - payment.paidAmount}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.dueDate}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                        <Icon className="w-4 h-4 mr-1" />
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {payment.status !== 'paid' && (
                        <button className="text-blue-600 hover:text-blue-900 font-medium">
                          Record Payment
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentTracking;