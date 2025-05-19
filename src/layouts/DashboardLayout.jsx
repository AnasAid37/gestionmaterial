import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';

const DashboardLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();

  // Generate page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return 'Dashboard';
    if (path.startsWith('/inventory')) {
      if (path === '/inventory/add') return 'Add New Item';
      if (path.includes('/inventory/')) return 'Item Details';
      return 'Inventory';
    }
    if (path.startsWith('/rooms')) {
      if (path.includes('/rooms/')) return 'Room Details';
      return 'Room Equipment';
    }
    if (path === '/reports') return 'Reports';
    if (path === '/qrcode') return 'QR Code Generator';
    if (path === '/profile') return 'Settings';
    return '';
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          title={getPageTitle()}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
