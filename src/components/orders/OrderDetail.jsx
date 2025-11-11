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

  // Get all unique sizes from all items
  const getAllUniqueSizes = () => {
    const allSizes = new Set();
    if (order.items) {
      order.items.forEach(item => {
        if (item.sizes) {
          Object.keys(item.sizes).forEach(size => allSizes.add(size));
        }
      });
    }
    return Array.from(allSizes).sort((a, b) => {
      const numA = parseInt(a.split('/')[0]);
      const numB = parseInt(b.split('/')[0]);
      return numA - numB;
    });
  };

  // Calculate pieces for a single item
  const calculateItemPieces = (item) => {
    if (!item.sizes) return 0;
    return Object.values(item.sizes).reduce((total, size) => {
      return total + (size.quantity || 0);
    }, 0);
  };

  // Calculate total for a single item
  const calculateItemTotal = (item) => {
    if (!item.sizes) return 0;
    return Object.values(item.sizes).reduce((total, size) => {
      return total + ((size.quantity || 0) * (size.price || 0));
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Customer Information Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-2 gap-2 items-center mb-4">
          <div className="row-span-2 h-full">
            <h3 className="text-lg font-medium text-gray-900">Customer Information</h3>
          </div>
          <div className="text-sm text-gray-600 text-right">
            <span className="font-semibold">Order ID:</span> {order.orderId || order._id}
          </div>
          <div className="text-sm text-gray-600 text-right">
            <span className="font-semibold">Order Date:</span> {new Date(order.createdAt || order.orderDate).toLocaleString('en-IN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true
            })}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {/* First Row */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name
            </label>
            <p className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm">
              {order.customerName}
            </p>
          </div>

          <div className="col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <p className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm">
              {order.address || 'N/A'}
            </p>
          </div>

          {/* Second Row */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <p className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm">
              {order.mobileNumber || order.phone || 'N/A'}
            </p>
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <p className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm">
              {order.email || 'N/A'}
            </p>
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order Type
            </label>
            <p className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm capitalize">
              {order.orderType}
            </p>
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <p className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm">
              {new Date(order.deliveryDate).toLocaleDateString('en-IN')}
            </p>
          </div>
        </div>
      </div>

      {/* Order Items Matrix */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Status: <OrderStatusBadge status={status} />
            </span>
          </div>
        </div>

        {order.items && order.items.map((item, index) => (
          <div key={index} className="mb-4 rounded-lg border border-gray-200 overflow-hidden">
            {/* Product Header */}
            <div className="bg-white px-4 py-3 flex justify-between items-center">
              <div className="font-medium text-gray-900">{item.product || item.category}</div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-500 text-sm">
                  Pieces: {calculateItemPieces(item)}
                </span>
                <span className="text-gray-700 font-bold text-sm">
                  Total: ₹{calculateItemTotal(item).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Size Matrix */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700 bg-blue-50">SIZE</th>
                    {item.sizes && Object.keys(item.sizes).sort((a, b) => {
                      const numA = parseInt(a.split('/')[0]);
                      const numB = parseInt(b.split('/')[0]);
                      return numA - numB;
                    }).map(size => (
                      <th key={`${index}-${size}`} className="px-2 py-2 text-center font-semibold text-gray-700">
                        {size}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="px-2 py-2 text-center text-xs font-medium text-gray-700 bg-blue-50">QTY</td>
                    {item.sizes && Object.keys(item.sizes).sort((a, b) => {
                      const numA = parseInt(a.split('/')[0]);
                      const numB = parseInt(b.split('/')[0]);
                      return numA - numB;
                    }).map(size => (
                      <td key={`${index}-${size}-qty`} className="px-2 py-2 text-center font-medium">
                        {item.sizes[size]?.quantity || 0}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-2 py-2 text-center text-xs font-medium text-gray-700 bg-blue-50">PRICE</td>
                    {item.sizes && Object.keys(item.sizes).sort((a, b) => {
                      const numA = parseInt(a.split('/')[0]);
                      const numB = parseInt(b.split('/')[0]);
                      return numA - numB;
                    }).map(size => (
                      <td key={`${index}-${size}-price`} className="px-2 py-2 text-center font-medium">
                        ₹{item.sizes[size]?.price || 0}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Product Details if available */}
            {item.details && Object.keys(item.details).length > 0 && (
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Product Details</h4>
                <div className="grid grid-cols-4 gap-4">
                  {Object.entries(item.details).map(([key, value]) => {
                    // Skip image fields
                    if (key.includes('Image')) return null;
                    return (
                      <div key={key} className="text-xs">
                        <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <span className="ml-2 font-medium text-gray-900">{value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Grand Total */}
        <div className="flex justify-end border-t border-gray-200 pt-4 mt-4">
          <div className="flex space-x-8 text-right">
            <div>
              <div className="text-sm text-gray-600">Total Pieces:</div>
              <div className="text-xl font-semibold text-gray-800">{calculateItemsCount(order)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Grand Total:</div>
              <div className="text-2xl font-bold text-gray-900">₹{calculateOrderTotal(order).toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-gray-600 mb-1">Total Amount</div>
            <div className="text-xl font-bold text-gray-900">₹{calculateOrderTotal(order).toFixed(2)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Advance Paid</div>
            <div className="text-xl font-bold text-green-600">
              ₹{order.advancePayments ? order.advancePayments.reduce((total, payment) => total + (payment.amount || 0), 0).toFixed(2) : '0.00'}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Due Amount</div>
            <div className="text-xl font-bold text-red-600">
              ₹{(calculateOrderTotal(order) - (order.advancePayments ? order.advancePayments.reduce((total, payment) => total + (payment.amount || 0), 0) : 0)).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Advance Payments List */}
        {order.advancePayments && order.advancePayments.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Payment History</h4>
            <div className="space-y-2">
              {order.advancePayments.map((payment, index) => (
                <div key={index} className="flex justify-between items-center px-3 py-2 bg-gray-50 rounded-md">
                  <span className="text-sm font-medium text-gray-900">₹{payment.amount?.toFixed(2) || '0.00'}</span>
                  <span className="text-sm text-gray-600">{new Date(payment.date).toLocaleDateString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-between items-center">
          <select
            value={status}
            onChange={(e) => updateStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statuses.map(s => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}
              </option>
            ))}
          </select>

          <button className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            Record Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;

