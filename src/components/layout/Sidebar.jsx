import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home, Package, ShoppingCart, Boxes, Factory,
  Users, Truck, FileText, BarChart, UserCheck, X
} from 'lucide-react';

const Sidebar = ({ expanded, mobile, onClose }) => {
  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: Home },
    { path: '/products', name: 'Products', icon: Package },
    { path: '/orders', name: 'Orders', icon: ShoppingCart },
    { path: '/inventory', name: 'Inventory', icon: Boxes },
    { path: '/production', name: 'Production', icon: Factory },
    { path: '/customers', name: 'Customers', icon: Users },
    { path: '/suppliers', name: 'Suppliers', icon: Truck },
    { path: '/invoices', name: 'Invoicing', icon: FileText },
    { path: '/reports', name: 'Reports', icon: BarChart },
    { path: '/users', name: 'Users', icon: UserCheck },
  ];

  return (
    <div
      className={`flex flex-col border-r border-gray-200 bg-white h-full overflow-hidden transition-[width] duration-300 ${
        mobile ? 'w-64' : expanded ? 'w-64' : 'w-16'
      }`}
    >
      <div className="flex items-center justify-between h-16 border-b border-gray-200 px-4">
        {expanded || mobile ? (
          <h2 className="text-xl font-bold text-gray-800">Sajan Shree</h2>
        ) : (
          <h2 className="text-xl font-bold text-gray-800 text-center w-full">S</h2>
        )}
        {mobile && (
          <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={mobile ? onClose : undefined}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-300 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <div className="w-6 flex justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`ml-2 whitespace-nowrap transition-all duration-300 ${
                  expanded || mobile
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-2 pointer-events-none'
                }`}
              >
                {item.name}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
