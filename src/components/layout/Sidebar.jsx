import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Package, 
  ClipboardList, 
  BarChart, 
  QrCode, 
  Settings,
  LogOut,
  X
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import './Sidebar.css'; // Import the CSS file

const SidebarLink = ({ to, icon, label, active }) => {
  return (
    <Link
      to={to}
      className={`sidebar-link ${active ? 'active' : ''}`}
    >
      <span className="sidebar-link-icon">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const location = useLocation();
  const { userRole, logout } = useAuthStore();
  
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  const navigationItems = [
    { to: '/dashboard', icon: <Home size={18} />, label: 'Dashboard', showFor: ['management', 'storekeeper', 'trainer'] },
    { to: '/inventory', icon: <Package size={18} />, label: 'Inventory', showFor: ['management', 'storekeeper'] },
    { to: '/rooms', icon: <ClipboardList size={18} />, label: 'Room Equipment', showFor: ['trainer'] },
    { to: '/reports', icon: <BarChart size={18} />, label: 'Reports', showFor: ['management'] },
    { to: '/qrcode', icon: <QrCode size={18} />, label: 'QR Code', showFor: ['management', 'storekeeper', 'trainer'] },
    { to: '/profile', icon: <Settings size={18} />, label: 'Settings', showFor: ['management', 'storekeeper', 'trainer'] },
  ];
  
  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="mobile-overlay"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}
      >
        <div className="sidebar-container">
          {/* Sidebar Header */}
          <div className="sidebar-header">
            <Link to="/dashboard" className="sidebar-brand">
              <span className="sidebar-brand-icon">
                <Package size={20} />
              </span>
              <span className="sidebar-brand-text">EduInventory</span>
            </Link>
            <button
              onClick={onCloseMobile}
              className="sidebar-close-button"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Navigation Links */}
          <nav className="sidebar-nav">
            {navigationItems
              .filter(item => item.showFor.includes(userRole))
              .map((item) => (
                <SidebarLink
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  active={isActive(item.to)}
                />
              ))}
          </nav>
          
          {/* Sidebar Footer */}
          <div className="sidebar-footer">
            <button
              onClick={logout}
              className="logout-button"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;