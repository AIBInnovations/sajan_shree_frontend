// utils/constants.js
export const ORDER_STATUS = {
  RECEIVED: 'received',
  IN_PRODUCTION: 'in-production',
  READY: 'ready',
  DISPATCHED: 'dispatched',
  DELIVERED: 'delivered'
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PARTIAL: 'partial',
  PAID: 'paid',
  OVERDUE: 'overdue'
};

export const USER_ROLES = {
  ADMIN: 'Admin',
  ORDER_MANAGER: 'Order Manager',
  INVENTORY_MANAGER: 'Inventory Manager',
  PRODUCTION_STAFF: 'Production Staff',
  ACCOUNTANT: 'Accountant'
};

export const PRODUCT_CATEGORIES = [
  'Shirts',
  'Pants',
  'T-Shirts',
  'Trousers',
  'Skirts'
];

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const COLORS = ['White', 'Black', 'Blue', 'Red', 'Green', 'Yellow', 'Gray'];