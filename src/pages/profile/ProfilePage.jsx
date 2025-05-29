import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { User, Mail, Key, Save, Shield } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/Card';
import './ProfilePage.css';

const Badge = ({ 
  variant = 'default', 
  children, 
  className = '' 
}) => {
  return (
    <span className={`badge ${variant} ${className}`}>
      {children}
    </span>
  );
};

const ProfilePage = () => {
  const { user } = useAuthStore();
  
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Profile updated successfully!');
    setIsUpdatingProfile(false);
  };
  
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New password and confirmation do not match');
      return;
    }
    
    setIsUpdatingPassword(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Password updated successfully!');
    setIsUpdatingPassword(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };
  
  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profile Settings</h1>
        <p>Manage your account settings and preferences</p>
      </div>
      
      <div className="profile-grid">
        {/* Sidebar */}
        <div className="profile-sidebar">
          <Card>
            <CardContent className="sidebar-content">
              <div className="user-profile">
                <div className="user-avatar">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <h2>{user?.name}</h2>
                <p className="user-email">{user?.email}</p>
                <div className="user-badge">
                  <Badge variant="info" className="capitalize">{user?.role}</Badge>
                </div>
              </div>
              
              <div className="account-info">
                <p className="info-label">Account created</p>
                <p className="info-value">October 1, 2023</p>
              </div>
              
              <div className="account-info">
                <p className="info-label">Last login</p>
                <p className="info-value">Today, 9:30 AM</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="profile-main">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="card-title">
                <User size={18} />
                <span>Profile Information</span>
              </CardTitle>
            </CardHeader>
            <form onSubmit={handleUpdateProfile}>
              <CardContent className="form-content">
                <Input
                  label="Full Name"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  required
                />
                
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  required
                />
                
                <Input
                  label="Role"
                  value={user?.role}
                  disabled
                />
              </CardContent>
              <CardFooter className="form-footer">
                <Button
                  type="submit"
                  icon={<Save size={18} />}
                  isLoading={isUpdatingProfile}
                >
                  Save Changes
                </Button>
              </CardFooter>
            </form>
          </Card>
          
          {/* Password Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="card-title">
                <Key size={18} />
                <span>Change Password</span>
              </CardTitle>
            </CardHeader>
            <form onSubmit={handleUpdatePassword}>
              <CardContent className="form-content">
                <Input
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
                
                <Input
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
                
                <Input
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </CardContent>
              <CardFooter className="form-footer">
                <Button
                  type="submit"
                  icon={<Key size={18} />}
                  isLoading={isUpdatingPassword}
                >
                  Update Password
                </Button>
              </CardFooter>
            </form>
          </Card>
          
          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="card-title">
                <Mail size={18} />
                <span>Notification Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="notification-content">
              <div className="notification-item">
                <div>
                  <p className="notification-title">Email Notifications</p>
                  <p className="notification-description">Receive email alerts about inventory updates</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" className="toggle-input" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              
              <div className="notification-item">
                <div>
                  <p className="notification-title">Maintenance Alerts</p>
                  <p className="notification-description">Get notified when items need maintenance</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" className="toggle-input" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              
              <div className="notification-item">
                <div>
                  <p className="notification-title">Weekly Reports</p>
                  <p className="notification-description">Receive weekly inventory summary reports</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" className="toggle-input" />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </CardContent>
            <CardFooter className="form-footer">
              <Button>
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;