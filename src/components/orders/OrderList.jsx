// components/orders/OrderList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Eye, Pencil, Trash2, X } from 'lucide-react';
import SearchBar from '../common/SearchBar';
import FilterOptions from '../common/FilterOptions';
import OrderStatusBadge from './OrderStatusBadge';
import ApiService from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import ConfirmDialog from '../common/ConfirmDialog';

const OrderList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [productFilter, setProductFilter] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');
  const [colorFilter, setColorFilter] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [dueFrom, setDueFrom] = useState('');
  const [dueTo, setDueTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const statuses = ['all', 'Pending', 'Processing', 'Completed', 'Shipped'];

  // Build unique, sorted option lists from the loaded orders
  const uniqueSorted = (values) => Array.from(new Set(values.filter(Boolean))).sort((a, b) => String(a).localeCompare(String(b)));
  const productOptions = uniqueSorted(orders.flatMap(o => (o.items || []).map(i => i.product)));
  const customerOptions = uniqueSorted(orders.map(o => o.customerName));
  const colorOptions = uniqueSorted(orders.flatMap(o => (o.items || []).map(i => i.details?.color)));
  const sizeOptions = uniqueSorted(
    orders.flatMap(o => (o.items || []).flatMap(i =>
      Object.entries(i.sizes || {}).filter(([, v]) => (v?.quantity || 0) > 0).map(([s]) => s)
    ))
  );

  const activeFilterCount = [productFilter, sizeFilter, colorFilter, customerFilter, dueFrom, dueTo]
    .filter(Boolean).length + (statusFilter !== 'all' ? 1 : 0);

  const clearFilters = () => {
    setStatusFilter('all');
    setProductFilter('');
    setSizeFilter('');
    setColorFilter('');
    setCustomerFilter('');
    setDueFrom('');
    setDueTo('');
    setSearchTerm('');
  };

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;
    try {
      setDeleting(true);
      await ApiService.deleteOrder(orderToDelete._id || orderToDelete.orderId);
      setOrders(prev => prev.filter(o => (o._id || o.orderId) !== (orderToDelete._id || orderToDelete.orderId)));
      setOrderToDelete(null);
    } catch (err) {
      console.error('Error deleting order:', err);
      alert(`❌ ${err?.payload?.message || err.message || 'Failed to delete order.'}`);
    } finally {
      setDeleting(false);
    }
  };

  // Calculate total for an order
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

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const ordersData = await ApiService.getOrders();
        setOrders(ordersData);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const items = order.items || [];
    const matchesSearch = (order.orderId || order._id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (order.customerName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesProduct = !productFilter || items.some(i => i.product === productFilter);
    const matchesSize = !sizeFilter || items.some(i =>
      Object.entries(i.sizes || {}).some(([s, v]) => s === sizeFilter && (v?.quantity || 0) > 0)
    );
    const matchesColor = !colorFilter || items.some(i => i.details?.color === colorFilter);
    const matchesCustomer = !customerFilter || order.customerName === customerFilter;
    const due = order.deliveryDate ? new Date(order.deliveryDate) : null;
    const matchesDueFrom = !dueFrom || (due && due >= new Date(dueFrom));
    const matchesDueTo = !dueTo || (due && due <= new Date(`${dueTo}T23:59:59`));
    return matchesSearch && matchesStatus && matchesProduct && matchesSize &&
           matchesColor && matchesCustomer && matchesDueFrom && matchesDueTo;
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
        <Link
          to="/orders/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Order
        </Link>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchBar
            placeholder="Search orders..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
          <FilterOptions
            options={statuses}
            selected={statusFilter}
            onChange={setStatusFilter}
            label="Status"
          />
          <button
            type="button"
            onClick={() => setShowFilters(v => !v)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors text-sm"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="bg-white rounded-lg shadow p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Product</label>
                <select
                  value={productFilter}
                  onChange={(e) => setProductFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">All Products</option>
                  {productOptions.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Size</label>
                <select
                  value={sizeFilter}
                  onChange={(e) => setSizeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">All Sizes</option>
                  {sizeOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Color</label>
                <select
                  value={colorFilter}
                  onChange={(e) => setColorFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">All Colors</option>
                  {colorOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Customer</label>
                <select
                  value={customerFilter}
                  onChange={(e) => setCustomerFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">All Customers</option>
                  {customerOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Due From</label>
                <input
                  type="date"
                  value={dueFrom}
                  onChange={(e) => setDueFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Due To</label>
                <input
                  type="date"
                  value={dueTo}
                  onChange={(e) => setDueTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center"
              >
                <X className="w-4 h-4 mr-1" />
                Clear All
              </button>
            </div>
          </div>
        )}

        <div className="text-sm text-gray-500">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id || order.orderId}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.orderId || order._id}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.customerName}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt || order.orderDate).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.deliveryDate).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{calculateOrderTotal(order).toFixed(2)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-4">
                        <Link
                          to={`/orders/${order._id || order.orderId}`}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Link>
                        <Link
                          to={`/orders/edit/${order._id || order.orderId}`}
                          className="text-gray-600 hover:text-gray-900 inline-flex items-center"
                        >
                          <Pencil className="w-4 h-4 mr-1" />
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => setOrderToDelete(order)}
                          className="text-red-600 hover:text-red-900 inline-flex items-center"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!orderToDelete}
        onClose={() => { if (!deleting) setOrderToDelete(null); }}
        onConfirm={handleDeleteOrder}
        title="Delete Order"
        message={`Are you sure you want to delete order ${orderToDelete?.orderId || orderToDelete?._id || ''}? This action cannot be undone.`}
      />
    </div>
  );
};

export default OrderList;