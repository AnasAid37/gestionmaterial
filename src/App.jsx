import { useEffect } from 'react';
import './index.css'; // هذا هو السطر المهم

import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';

// Layout components
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import LoginPage from './pages/auth/LoginPage';
import Dashboard from './pages/dashboard/Dashboard';
import InventoryPage from './pages/inventory/InventoryPage';
import ItemDetailsPage from './pages/inventory/ItemDetailsPage';
import AddItemPage from './pages/inventory/AddItemPage';
import TrainerRoomsPage from './pages/trainer/TrainerRoomsPage';
import RoomDetailsPage from './pages/trainer/RoomDetailsPage';
import ReportsPage from './pages/reports/ReportsPage';
import QRCodePage from './pages/tools/QRCodePage';
import ProfilePage from './pages/profile/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const { isAuthenticated, userRole } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle authentication routing
  useEffect(() => {
    if (!isAuthenticated && !location.pathname.includes('/auth')) {
      navigate('/auth/login');
    } else if (isAuthenticated && location.pathname === '/auth/login') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate, location.pathname]);

  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
      </Route>

      {/* Protected routes */}
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Inventory routes */}
        {(userRole === 'management' || userRole === 'storekeeper') && (
          <>
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="inventory/add" element={<AddItemPage />} />
            <Route path="inventory/:id" element={<ItemDetailsPage />} />
          </>
        )}
        
        {/* Room management */}
        {userRole === 'trainer' && (
          <>
            <Route path="rooms" element={<TrainerRoomsPage />} />
            <Route path="rooms/:id" element={<RoomDetailsPage />} />
          </>
        )}
        
        {/* Reports */}
        {userRole === 'management' && (
          <Route path="reports" element={<ReportsPage />} />
        )}
        
        {/* Common routes */}
        <Route path="qrcode" element={<QRCodePage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;