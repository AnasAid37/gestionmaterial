import React from 'react';
import { Bell, Menu, Search } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import Button from '../ui/Button';
import './Header.css'; // Import the CSS file

const Header = ({ onOpenMobileSidebar, title }) => {
  const { user } = useAuthStore();
  
  return (
    <header className="header">
      <div className="header-left">
        <button
          onClick={onOpenMobileSidebar}
          className="mobile-menu-button"
        >
          <Menu size={24} />
        </button>
        
        {title && <h1 className="header-title">{title}</h1>}
      </div>
      
      <div className="header-right">
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="search"
            placeholder="Search..."
            className="search-input"
          />
        </div>
        
        <Button
          variant="ghost"
          className="notification-button"
          size="sm"
        >
          <Bell size={20} />
          <span className="notification-badge"></span>
        </Button>
        
        <div className="user-profile">
          <div className="user-info">
            <p className="user-name">{user?.name}</p>
            <p className="user-role">{user?.role}</p>
          </div>
          <div className="user-avatar">
            {user?.name?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;