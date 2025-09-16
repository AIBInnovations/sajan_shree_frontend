// components/orders/OrderDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Printer, FileText } from 'lucide-react';
import OrderStatusBadge from './OrderStatusBadge';
import ApiService from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('Pending');

  const statuses = ['Pending', 'Processing', 'Completed', 'Shipped'];

  // Calculate order total
  const calculateOrderTotal = (order) => {
    if (!order.items || !Array.isArray(order.items)) return 0;
    
    return order.items.reduce((total, item) => {
      if (!item.sizes) return total;
      
      return total + Object.values(item.sizes).reduce((itemTotal, size) => {
        return itemTotal + (size.quantity * size.price);
      }, 0);
    }, 0);
  };

  // Calculate total items count
  const calculateItemsCount = (order) => {
    if (!order.items || !Array.isArray(order.items)) return 0;
    
    return order.items.reduce((total, item) => {
      if (!item.sizes) return total;
      
      return total + Object.values(item.sizes).reduce((itemTotal, size) => {
        return itemTotal + (size.quantity || 0);
      }, 0);
    }, 0);
  };

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const orderData = await ApiService.getOrder(id);
        setOrder(orderData);
        setStatus(orderData.status);
        setError(null);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  const updateStatus = async (newStatus) => {
    try {
      setStatus(newStatus);
      // TODO: Add API call to update status
      console.log('Updating status to:', newStatus);
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => navigate('/orders')} 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Order not found</p>
        <button 
          onClick={() => navigate('/orders')} 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Orders
        </button>
      </div>
    );
  }

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
                <p className="font-medium">{order.orderId || order._id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Type</p>
                <p className="font-medium capitalize">{order.orderType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-medium">{new Date(order.createdAt || order.orderDate).toLocaleDateString('en-IN')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Due Date</p>
                <p className="font-medium">{new Date(order.deliveryDate).toLocaleDateString('en-IN')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Product</p>
                <p className="font-medium">{order.product}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Items</p>
                <p className="font-medium">{calculateItemsCount(order)} pieces</p>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Customer Details</h3>
            <div className="space-y-2">
              <p className="font-medium">{order.customerName}</p>
              <p className="text-sm text-gray-600">{order.mobileNumber}</p>
              {order.email && <p className="text-sm text-gray-600">{order.email}</p>}
              {order.address && <p className="text-sm text-gray-600">{order.address}</p>}
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
                    <th className="text-left py-2 text-sm font-medium text-gray-700">Quantity</th>
                    <th className="text-right py-2 text-sm font-medium text-gray-700">Price</th>
                    <th className="text-right py-2 text-sm font-medium text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {order.items && order.items.map((item, index) => {
                    if (!item.sizes) return null;
                    
                    return Object.entries(item.sizes).map(([size, sizeData]) => {
                      if (sizeData.quantity === 0) return null;
                      
                      return (
                        <tr key={`${index}-${size}`}>
                          <td className="py-3 text-sm">{item.product || item.category}</td>
                          <td className="py-3 text-sm">{size}</td>
                          <td className="py-3 text-sm">{sizeData.quantity}</td>
                          <td className="py-3 text-sm text-right">₹{sizeData.price}</td>
                          <td className="py-3 text-sm text-right">₹{(sizeData.quantity * sizeData.price).toFixed(2)}</td>
                        </tr>
                      );
                    });
                  })}
                </tbody>
                <tfoot className="border-t">
                  <tr>
                    <td colSpan="4" className="py-3 text-sm font-medium text-right">Total:</td>
                    <td className="py-3 text-sm font-bold text-right">₹{calculateOrderTotal(order).toFixed(2)}</td>
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
                <span className="font-medium">₹{calculateOrderTotal(order).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Advance Paid</span>
                <span className="font-medium text-green-600">
                  ₹{order.advancePayments ? order.advancePayments.reduce((total, payment) => total + (payment.amount || 0), 0).toFixed(2) : '0.00'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Due Amount</span>
                <span className="font-medium text-red-600">
                  ₹{(calculateOrderTotal(order) - (order.advancePayments ? order.advancePayments.reduce((total, payment) => total + (payment.amount || 0), 0) : 0)).toFixed(2)}
                </span>
              </div>
            </div>
            
            {/* Advance Payments List */}
            {order.advancePayments && order.advancePayments.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Advance Payments</h4>
                <div className="space-y-1">
                  {order.advancePayments.map((payment, index) => (
                    <div key={index} className="flex justify-between text-xs text-gray-600">
                      <span>₹{payment.amount?.toFixed(2) || '0.00'}</span>
                      <span>{new Date(payment.date).toLocaleDateString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
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

