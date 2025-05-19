import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
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

const SidebarLink = ({ to, icon, label, active }) => {
  return (
    <Link
      to={to}
      className={twMerge(
        'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
        active 
          ? 'bg-primary-100 text-primary-900' 
          : 'text-gray-700 hover:bg-gray-100'
      )}
    >
      <span className="flex-shrink-0 w-5 h-5">{icon}</span>
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
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={twMerge(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <Link to="/dashboard" className="flex items-center gap-2">
              <span className="bg-primary-600 text-white p-1 rounded">
                <Package size={20} />
              </span>
              <span className="font-semibold text-xl">EduInventory</span>
            </Link>
            <button
              onClick={onCloseMobile}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
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
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={logout}
              className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
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
