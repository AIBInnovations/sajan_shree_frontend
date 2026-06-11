// components/customers/CustomerDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Building2,
  ShoppingCart,
  FileText,
} from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import ConfirmDialog from '../common/ConfirmDialog';
import ApiService from '../../services/api';

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [customerData, ordersData] = await Promise.all([
          ApiService.getCustomer(id),
          ApiService.getCustomerOrders(id).catch(() => []),
        ]);
        setCustomer(customerData);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setError(null);
      } catch (err) {
        console.error('Error fetching customer:', err);
        setError('Failed to load customer details.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await ApiService.deleteCustomer(id);
      navigate('/customers');
    } catch (err) {
      console.error('Error deleting customer:', err);
      alert(`Error: ${err?.payload?.message || err.message}`);
      setDeleting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error || !customer)
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error || 'Customer not found'}</p>
      </div>
    );

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
        <div className="flex items-center space-x-3">
          <Link
            to={`/customers/edit/${customer._id}`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Link>
          <button
            onClick={() => setConfirmDelete(true)}
            className="inline-flex items-center px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
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
                <p className="text-sm text-gray-500">Company</p>
                <p className="font-medium">{customer.companyName || 'N/A'}</p>
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
                <span>{customer.email || 'N/A'}</span>
              </div>
              {customer.companyName && (
                <div className="flex items-center">
                  <Building2 className="w-5 h-5 text-gray-400 mr-3" />
                  <span>{customer.companyName}</span>
                </div>
              )}
              {customer.address && (
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <span>{customer.address}</span>
                </div>
              )}
              {customer.notes && (
                <div className="flex items-start">
                  <FileText className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <span>{customer.notes}</span>
                </div>
              )}
            </div>
          </div>

          {/* Orders */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Orders</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-2 text-sm font-medium text-gray-700">
                      Order ID
                    </th>
                    <th className="text-left py-2 text-sm font-medium text-gray-700">
                      Date
                    </th>
                    <th className="text-left py-2 text-sm font-medium text-gray-700">
                      Delivery
                    </th>
                    <th className="text-left py-2 text-sm font-medium text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="py-4 text-center text-sm text-gray-500"
                      >
                        No orders for this customer
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order._id}>
                        <td className="py-3 text-sm">
                          <Link
                            to={`/orders/${order._id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            {order.orderId || order._id}
                          </Link>
                        </td>
                        <td className="py-3 text-sm">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString('en-IN')
                            : 'N/A'}
                        </td>
                        <td className="py-3 text-sm">
                          {order.deliveryDate
                            ? new Date(order.deliveryDate).toLocaleDateString('en-IN')
                            : 'N/A'}
                        </td>
                        <td className="py-3 text-sm">{order.status}</td>
                      </tr>
                    ))
                  )}
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
                <span className="font-medium">{orders.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Customer Since</span>
                <span className="font-medium">
                  {customer.createdAt
                    ? new Date(customer.createdAt).toLocaleDateString('en-IN')
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <Link
              to="/orders/new"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Create New Order
            </Link>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDelete}
        onClose={() => {
          if (!deleting) setConfirmDelete(false);
        }}
        onConfirm={handleDelete}
        title="Delete Customer"
        message={`Are you sure you want to delete ${customer.name}? This cannot be undone.`}
      />
    </div>
  );
};

export default CustomerDetail;
