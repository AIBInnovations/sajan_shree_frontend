import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Package, ShoppingCart, BarChart, Menu } from 'lucide-react';

const MobileNav = () => {
  const navItems = [
    { path: '/dashboard', name: 'Home', icon: Home },
    { path: '/orders', name: 'Orders', icon: ShoppingCart },
    { path: '/products', name: 'Products', icon: Package },
    { path: '/reports', name: 'Reports', icon: BarChart },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center py-2 px-3 text-xs ${
                  isActive ? 'text-blue-600' : 'text-gray-600'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-1" />
              {item.name}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;