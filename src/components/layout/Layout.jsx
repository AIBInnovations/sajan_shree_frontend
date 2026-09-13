import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNav from './MobileNav';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className="flex h-screen bg-muted">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar expanded={sidebarExpanded} />
      </div>

      {/* Mobile Sidebar Overlay with Slide-in */}
      <div className={`fixed inset-0 z-50 md:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-opacity-50 backdrop-blur-xs transition-opacity duration-300 ${
            sidebarOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setSidebarOpen(false)}
        />
        {/* Sidebar Sliding In */}
        <div
          className={`absolute inset-y-0 left-0 w-64 transition-transform duration-300 bg-card border-r border-border ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Sidebar mobile onClose={() => setSidebarOpen(false)} />
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300`}
      >
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          sidebarExpanded={sidebarExpanded}
          onToggleSidebar={() => setSidebarExpanded((prev) => !prev)}
        />

        <main className="flex-1 overflow-y-auto bg-muted">
          {/* extra bottom padding on mobile so the fixed MobileNav doesn't cover the last rows */}
          <div className="p-4 md:p-6 pb-24 md:pb-6 mx-auto">
            <Outlet />
          </div>
        </main>

        <MobileNav />
      </div>
    </div>
  );
};

export default Layout;
