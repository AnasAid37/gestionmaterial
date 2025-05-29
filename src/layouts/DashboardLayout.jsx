import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();

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
    <div className="dashboard-layout">
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <div className="dashboard-main">
        <Header
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          title={getPageTitle()}
        />

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;