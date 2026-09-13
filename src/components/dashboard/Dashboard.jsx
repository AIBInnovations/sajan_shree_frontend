import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsCard from './StatsCard';
import RecentActivity from './RecentActivity';
import LoadingSpinner from '../common/LoadingSpinner';
import ApiService from '../../services/api';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Package, ShoppingCart, ClipboardList, TrendingUp, Clock, FileText } from 'lucide-react';

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

// Temporarily showing only orders-related dashboard content; other widgets stay in the code, just hidden.
const ORDERS_ONLY_MODE = true;

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
        <p className="text-destructive">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
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
    { title: 'Total Orders', value: String(totalOrders), change: ORDERS_ONLY_MODE ? 'All time' : `${productsCount} products`, icon: ShoppingCart, color: 'blue' },
    { title: 'Pending Orders', value: String(pendingCount), change: 'Awaiting', icon: Clock, color: 'red' },
    { title: 'Revenue', value: formatCurrency(revenue), change: 'All orders', icon: TrendingUp, color: 'purple' },
    { title: 'Due This Week', value: String(dueThisWeek), change: 'Next 7 days', icon: Package, color: 'green' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Activity and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <Card>
          <h3 className="text-lg font-semibold text-foreground mb-4">Order Status Overview</h3>
          {totalOrders === 0 ? (
            <p className="text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {STATUS_META.map((s) => {
                const count = statusCounts[s.key] || 0;
                const pct = totalOrders > 0 ? Math.round((count / totalOrders) * 100) : 0;
                return (
                  <div key={s.key} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{s.label}</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-muted rounded-full h-2 mr-2">
                        <div className={`${s.color} h-2 rounded-full`} style={{ width: `${pct}%` }}></div>
                      </div>
                      <span className="text-sm font-medium w-8 text-right text-foreground">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <RecentActivity orders={orders} />
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/orders/new')}
            className="p-4 text-center border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-primary" />
            <span className="text-sm font-medium text-foreground">New Order</span>
          </button>
          {!ORDERS_ONLY_MODE && (
            <button
              onClick={() => navigate('/products/new')}
              className="p-4 text-center border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <Package className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <span className="text-sm font-medium text-foreground">Add Product</span>
            </button>
          )}
          <button
            onClick={() => navigate('/orders')}
            className="p-4 text-center border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <ClipboardList className="w-8 h-8 mx-auto mb-2 text-primary" />
            <span className="text-sm font-medium text-foreground">View Orders</span>
          </button>
          {!ORDERS_ONLY_MODE && (
            <button
              onClick={() => navigate('/reports')}
              className="p-4 text-center border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <FileText className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <span className="text-sm font-medium text-foreground">View Reports</span>
            </button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;