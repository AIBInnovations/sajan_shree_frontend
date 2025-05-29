// utils/helpers.js
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getStatusColor = (status) => {
  const colors = {
    'pending': 'yellow',
    'in-progress': 'blue',
    'completed': 'green',
    'cancelled': 'red',
    'active': 'green',
    'inactive': 'gray'
  };
  return colors[status] || 'gray';
};

export const calculateDueDate = (orderDate, days = 15) => {
  const date = new Date(orderDate);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

export const generateOrderId = () => {
  const prefix = 'ORD';
  const timestamp = Date.now().toString().slice(-6);
  return `${prefix}-${timestamp}`;
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return re.test(phone);
};