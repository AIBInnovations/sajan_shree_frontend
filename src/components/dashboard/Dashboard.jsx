import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsCard from './StatsCard';
import RecentActivity from './RecentActivity';
import LoadingSpinner from '../common/LoadingSpinner';
import ApiService from '../../services/api';
import { Package, ShoppingCart, TrendingUp, Clock, FileText } from 'lucide-react';

const STATUS_META = [
  { key: 'Pending', label: 'Pending', color: 'bg-yellow-500' },
  { key: 'Processing', label: 'Processing', color: 'bg-blue-500' },
  { key: 'Completed', label: 'Completed', color: 'bg-green-500' },
  { key: 'Shipped', label: 'Shipped', color: 'bg-purple-500' },
];

const orderTotal = (order) => {
  if (!order.items || !Array.isArray(order.items)) return 0;
  return order.items.reduce((total, item) => {
    if (!item.sizes) return total;
    return total + Object.values(item.sizes).reduce((s, size) => s + (size.quantity || 0) * (size.price || 0), 0);
  }, 0);
};

const formatCurrency = (value) => {
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value.toFixed(0)}`;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [productsCount, setProductsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [ordersData, productsData] = await Promise.all([
          ApiService.getOrders(),
          ApiService.getProducts().catch(() => []),
        ]);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setProductsCount(Array.isArray(productsData) ? productsData.length : 0);
        setError(null);
      } catch (err) {
        console.error('Error loading dashboard:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner />;

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

  const totalOrders = orders.length;
  const revenue = orders.reduce((sum, o) => sum + orderTotal(o), 0);

  const statusCounts = STATUS_META.reduce((acc, s) => {
    acc[s.key] = orders.filter(o => o.status === s.key).length;
    return acc;
  }, {});
  const pendingCount = statusCounts['Pending'] || 0;

  const now = new Date();
  const weekAhead = new Date();
  weekAhead.setDate(now.getDate() + 7);
  const dueThisWeek = orders.filter(o => {
    if (!o.deliveryDate) return false;
    const due = new Date(o.deliveryDate);
    const open = o.status !== 'Completed' && o.status !== 'Shipped';
    return open && due >= now && due <= weekAhead;
  }).length;

  const stats = [
    { title: 'Total Orders', value: String(totalOrders), change: `${productsCount} products`, icon: ShoppingCart, color: 'blue' },
    { title: 'Pending Orders', value: String(pendingCount), change: 'Awaiting', icon: Clock, color: 'red' },
    { title: 'Revenue', value: formatCurrency(revenue), change: 'All orders', icon: TrendingUp, color: 'purple' },
    { title: 'Due This Week', value: String(dueThisWeek), change: 'Next 7 days', icon: Package, color: 'green' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Activity and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Order Status Overview</h3>
          {totalOrders === 0 ? (
            <p className="text-sm text-gray-500">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {STATUS_META.map((s) => {
                const count = statusCounts[s.key] || 0;
                const pct = totalOrders > 0 ? Math.round((count / totalOrders) * 100) : 0;
                return (
                  <div key={s.key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{s.label}</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                        <div className={`${s.color} h-2 rounded-full`} style={{ width: `${pct}%` }}></div>
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <RecentActivity orders={orders} />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/orders/new')}
            className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <span className="text-sm font-medium">New Order</span>
          </button>
          <button
            onClick={() => navigate('/products/new')}
            className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Package className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <span className="text-sm font-medium">Add Product</span>
          </button>
          <button
            onClick={() => navigate('/orders')}
            className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-red-600" />
            <span className="text-sm font-medium">View Orders</span>
          </button>
          <button
            onClick={() => navigate('/reports')}
            className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <span className="text-sm font-medium">View Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;