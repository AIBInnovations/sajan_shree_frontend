// components/invoicing/InvoiceForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, Plus } from 'lucide-react';

const InvoiceForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    orderId: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    paymentTerms: 'net-15',
    notes: '',
    termsConditions: 'Payment is due within 15 days from the invoice date.'
  });

  const orders = [
    { id: 'ORD-001', customer: 'Rajesh Kumar', amount: 4500 },
    { id: 'ORD-004', customer: 'Sunita Devi', amount: 3500 },
    { id: 'ORD-005', customer: 'Amit Singh', amount: 5200 }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Invoice created:', formData);
    navigate('/invoices');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const selectedOrder = orders.find(o => o.id === formData.orderId);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Create Invoice</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Order
            </label>
            <select
              name="orderId"
              value={formData.orderId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select an order</option>
              {orders.map(order => (
                <option key={order.id} value={order.id}>
                  {order.id} - {order.customer} (₹{order.amount})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Terms
            </label>
            <select
              name="paymentTerms"
              value={formData.paymentTerms}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="immediate">Due on Receipt</option>
              <option value="net-15">Net 15 Days</option>
              <option value="net-30">Net 30 Days</option>
              <option value="net-45">Net 45 Days</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invoice Date
            </label>
            <input
              type="date"
              name="invoiceDate"
              value={formData.invoiceDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {selectedOrder && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Invoice Preview</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Customer:</p>
                <p className="font-medium">{selectedOrder.customer}</p>
              </div>
              <div>
                <p className="text-gray-500">Order ID:</p>
                <p className="font-medium">{selectedOrder.id}</p>
              </div>
              <div>
                <p className="text-gray-500">Subtotal:</p>
                <p className="font-medium">₹{selectedOrder.amount}</p>
              </div>
              <div>
                <p className="text-gray-500">GST (18%):</p>
                <p className="font-medium">₹{(selectedOrder.amount * 0.18).toFixed(2)}</p>
              </div>
              <div className="col-span-2 border-t pt-2">
                <p className="text-gray-500">Total Amount:</p>
                <p className="text-lg font-bold">₹{(selectedOrder.amount * 1.18).toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Terms & Conditions
          </label>
          <textarea
            name="termsConditions"
            value={formData.termsConditions}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end space-x-4">
           <button
            type="button"
            onClick={() => navigate('/invoices')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <X className="w-4 h-4 mr-2 inline" />
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4 mr-2 inline" />
            Create Invoice
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;