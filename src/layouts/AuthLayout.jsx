import React from 'react';
import { Outlet } from 'react-router-dom';
import { Package } from 'lucide-react';
import './AuthLayout.css';

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <div className="auth-header">
        <div className="auth-logo">
          <div className="logo-icon">
            <Package size={32} />
          </div>
        </div>
        <h2 className="auth-title">EduInventory</h2>
        <p className="auth-subtitle">
          Equipment Management System for Educational Institutions
        </p>
      </div>

      <div className="auth-form-container">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;