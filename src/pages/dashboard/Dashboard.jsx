import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  Plus,
  BarChart2,
  Repeat,
  QrCode
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useInventoryStore } from '../../stores/inventoryStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import './Dashboard.css';

const StatCard = ({ title, value, icon, description, color }) => {
  return (
    <Card className="stat-card">
      <CardContent className="stat-card-content">
        <div className="stat-card-header">
          <div>
            <p className="stat-card-title">{title}</p>
            <p className="stat-card-value">{value}</p>
          </div>
          <div className={`stat-card-icon ${color}`}>
            {icon}
          </div>
        </div>
        <p className="stat-card-description">{description}</p>
      </CardContent>
    </Card>
  );
};

const RecentActivityItem = ({
  icon,
  iconColor,
  title,
  timestamp,
  description,
}) => {
  return (
    <div className="activity-item">
      <div className={`activity-icon ${iconColor}`}>
        {icon}
      </div>
      <div className="activity-content">
        <div className="activity-header">
          <p className="activity-title">{title}</p>
          <p className="activity-timestamp">{timestamp}</p>
        </div>
        <p className="activity-description">{description}</p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { userRole } = useAuthStore();
  const { items, fetchItems } = useInventoryStore();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchItems();
      setIsLoading(false);
    };
    
    loadData();
  }, [fetchItems]);
  
  const totalItems = items.length;
  const availableItems = items.filter(item => item.status === 'available').length;
  const maintenanceItems = items.filter(item => item.status === 'maintenance').length;
  const inUseItems = items.filter(item => item.status === 'in-use').length;
  
  const getStatusDistribution = () => {
    const statusCounts = {
      'available': 0,
      'in-use': 0,
      'maintenance': 0,
      'retired': 0,
    };
    
    items.forEach(item => {
      statusCounts[item.status]++;
    });
    
    return statusCounts;
  };
  
  const statusDistribution = getStatusDistribution();
  
  return (
    <div className="dashboard-container">
      {/* Stats Overview */}
      <div className="stats-grid">
        <StatCard
          title="Total Equipment"
          value={totalItems}
          icon={<Package className="stat-icon" />}
          description="Total items in the inventory system"
          color="bg-primary"
        />
        <StatCard
          title="Available"
          value={availableItems}
          icon={<CheckCircle className="stat-icon" />}
          description="Items ready for use or assignment"
          color="bg-success"
        />
        <StatCard
          title="In Use"
          value={inUseItems}
          icon={<Clock className="stat-icon" />}
          description="Items currently assigned or in use"
          color="bg-accent"
        />
        <StatCard
          title="Maintenance"
          value={maintenanceItems}
          icon={<AlertTriangle className="stat-icon" />}
          description="Items under repair or maintenance"
          color="bg-warning"
        />
      </div>
      
      {/* Main Dashboard Content */}
      <div className="dashboard-content">
        {/* Quick Actions */}
        <Card className="quick-actions-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="quick-actions-content">
            {(userRole === 'management' || userRole === 'storekeeper') && (
              <Button
                icon={<Plus size={18} />}
                className="quick-action-button"
                as={Link}
                to="/inventory/add"
              >
                Add New Item
              </Button>
            )}
            
            {userRole === 'trainer' && (
              <Button
                icon={<Repeat size={18} />}
                className="quick-action-button"
                as={Link}
                to="/rooms"
              >
                Update Room Status
              </Button>
            )}
            
            <Button
              variant="outline"
              icon={<Package size={18} />}
              className="quick-action-button"
              as={Link}
              to={userRole === 'trainer' ? '/rooms' : '/inventory'}
            >
              View {userRole === 'trainer' ? 'Room Equipment' : 'Inventory'}
            </Button>
            
            {userRole === 'management' && (
              <Button
                variant="outline"
                icon={<BarChart2 size={18} />}
                className="quick-action-button"
                as={Link}
                to="/reports"
              >
                Generate Reports
              </Button>
            )}
            
            <Button
              variant="outline"
              icon={<QrCode size={18} />}
              className="quick-action-button"
              as={Link}
              to="/qrcode"
            >
              Generate QR Codes
            </Button>
          </CardContent>
        </Card>
        
        {/* Status Distribution */}
        <Card className="status-card">
          <CardHeader className="status-card-header">
            <CardTitle>Equipment Status</CardTitle>
            <Button variant="ghost" size="sm" as={Link} to="/inventory" icon={<ArrowRight size={16} />}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="status-content">
              <div className="status-bars">
                <div className="status-bar">
                  <div className="status-bar-header">
                    <span>Available</span>
                    <span>{statusDistribution.available} items</span>
                  </div>
                  <div className="status-bar-track">
                    <div 
                      className="status-bar-progress bg-success" 
                      style={{ width: `${(statusDistribution.available / totalItems) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="status-bar">
                  <div className="status-bar-header">
                    <span>In Use</span>
                    <span>{statusDistribution['in-use']} items</span>
                  </div>
                  <div className="status-bar-track">
                    <div 
                      className="status-bar-progress bg-accent" 
                      style={{ width: `${(statusDistribution['in-use'] / totalItems) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="status-bar">
                  <div className="status-bar-header">
                    <span>Maintenance</span>
                    <span>{statusDistribution.maintenance} items</span>
                  </div>
                  <div className="status-bar-track">
                    <div 
                      className="status-bar-progress bg-warning" 
                      style={{ width: `${(statusDistribution.maintenance / totalItems) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="status-bar">
                  <div className="status-bar-header">
                    <span>Retired</span>
                    <span>{statusDistribution.retired} items</span>
                  </div>
                  <div className="status-bar-track">
                    <div 
                      className="status-bar-progress bg-gray" 
                      style={{ width: `${(statusDistribution.retired / totalItems) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="status-stats">
                <div className="stat-box">
                  <p>Total Categories</p>
                  <p>4</p>
                </div>
                <div className="stat-box">
                  <p>Total Locations</p>
                  <p>6</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Activity */}
        <Card className="activity-card">
          <CardHeader className="activity-card-header">
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="activity-list">
              <RecentActivityItem
                icon={<Plus size={18} className="activity-item-icon" />}
                iconColor="bg-success"
                title="New Laptop Added"
                timestamp="Today, 10:30 AM"
                description="Dell XPS 15 was added to inventory by Admin"
              />
              <RecentActivityItem
                icon={<Repeat size={18} className="activity-item-icon" />}
                iconColor="bg-accent"
                title="Status Change"
                timestamp="Yesterday, 2:45 PM"
                description="Projector #EP-X49-002 changed from Available to In Use"
              />
              <RecentActivityItem
                icon={<AlertTriangle size={18} className="activity-item-icon" />}
                iconColor="bg-warning"
                title="Maintenance Required"
                timestamp="Oct 15, 9:20 AM"
                description="HP LaserJet Pro M404dn reported for paper jam issue"
              />
              <RecentActivityItem
                icon={<CheckCircle size={18} className="activity-item-icon" />}
                iconColor="bg-primary"
                title="Equipment Assigned"
                timestamp="Oct 14, 11:05 AM"
                description="Office Desk assigned to Dr. Smith in Faculty Office"
              />
              <RecentActivityItem
                icon={<Package size={18} className="activity-item-icon" />}
                iconColor="bg-secondary"
                title="Inventory Audit"
                timestamp="Oct 10, 3:30 PM"
                description="Quarterly inventory audit completed by Storekeeper"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;