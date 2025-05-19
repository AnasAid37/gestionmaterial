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

const StatCard = ({ title, value, icon, description, color }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            {icon}
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-4">{description}</p>
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
    <div className="flex items-start gap-4 py-3 border-b border-gray-100 last:border-0">
      <div className={`p-2 rounded-full ${iconColor} shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="font-medium text-gray-900 truncate">{title}</p>
          <p className="text-xs text-gray-500">{timestamp}</p>
        </div>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
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
  
  // Calculate statistics
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
    <div className="animate-fade-in space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Equipment"
          value={totalItems}
          icon={<Package className="h-6 w-6 text-white" />}
          description="Total items in the inventory system"
          color="bg-primary-600"
        />
        <StatCard
          title="Available"
          value={availableItems}
          icon={<CheckCircle className="h-6 w-6 text-white" />}
          description="Items ready for use or assignment"
          color="bg-success-600"
        />
        <StatCard
          title="In Use"
          value={inUseItems}
          icon={<Clock className="h-6 w-6 text-white" />}
          description="Items currently assigned or in use"
          color="bg-accent-500"
        />
        <StatCard
          title="Maintenance"
          value={maintenanceItems}
          icon={<AlertTriangle className="h-6 w-6 text-white" />}
          description="Items under repair or maintenance"
          color="bg-warning-500"
        />
      </div>
      
      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(userRole === 'management' || userRole === 'storekeeper') && (
              <Button
                icon={<Plus size={18} />}
                className="w-full justify-start"
                as={Link}
                to="/inventory/add"
              >
                Add New Item
              </Button>
            )}
            
            {userRole === 'trainer' && (
              <Button
                icon={<Repeat size={18} />}
                className="w-full justify-start"
                as={Link}
                to="/rooms"
              >
                Update Room Status
              </Button>
            )}
            
            <Button
              variant="outline"
              icon={<Package size={18} />}
              className="w-full justify-start"
              as={Link}
              to={userRole === 'trainer' ? '/rooms' : '/inventory'}
            >
              View {userRole === 'trainer' ? 'Room Equipment' : 'Inventory'}
            </Button>
            
            {userRole === 'management' && (
              <Button
                variant="outline"
                icon={<BarChart2 size={18} />}
                className="w-full justify-start"
                as={Link}
                to="/reports"
              >
                Generate Reports
              </Button>
            )}
            
            <Button
              variant="outline"
              icon={<QrCode size={18} />}
              className="w-full justify-start"
              as={Link}
              to="/qrcode"
            >
              Generate QR Codes
            </Button>
          </CardContent>
        </Card>
        
        {/* Status Distribution */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Equipment Status</CardTitle>
            <Button variant="ghost" size="sm" as={Link} to="/inventory" icon={<ArrowRight size={16} />}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Chart would go here in a real implementation */}
              {/* For now, showing a simple visualization with bars */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Available</span>
                    <span className="text-sm font-medium">{statusDistribution.available} items</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-success-600 h-2.5 rounded-full" 
                      style={{ width: `${(statusDistribution.available / totalItems) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">In Use</span>
                    <span className="text-sm font-medium">{statusDistribution['in-use']} items</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-accent-500 h-2.5 rounded-full" 
                      style={{ width: `${(statusDistribution['in-use'] / totalItems) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Maintenance</span>
                    <span className="text-sm font-medium">{statusDistribution.maintenance} items</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-warning-500 h-2.5 rounded-full" 
                      style={{ width: `${(statusDistribution.maintenance / totalItems) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Retired</span>
                    <span className="text-sm font-medium">{statusDistribution.retired} items</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-gray-500 h-2.5 rounded-full" 
                      style={{ width: `${(statusDistribution.retired / totalItems) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Total Categories</p>
                  <p className="text-2xl font-semibold mt-1">4</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Total Locations</p>
                  <p className="text-2xl font-semibold mt-1">6</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Activity */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              <RecentActivityItem
                icon={<Plus size={18} className="text-white" />}
                iconColor="bg-success-600"
                title="New Laptop Added"
                timestamp="Today, 10:30 AM"
                description="Dell XPS 15 was added to inventory by Admin"
              />
              <RecentActivityItem
                icon={<Repeat size={18} className="text-white" />}
                iconColor="bg-accent-500"
                title="Status Change"
                timestamp="Yesterday, 2:45 PM"
                description="Projector #EP-X49-002 changed from Available to In Use"
              />
              <RecentActivityItem
                icon={<AlertTriangle size={18} className="text-white" />}
                iconColor="bg-warning-500"
                title="Maintenance Required"
                timestamp="Oct 15, 9:20 AM"
                description="HP LaserJet Pro M404dn reported for paper jam issue"
              />
              <RecentActivityItem
                icon={<CheckCircle size={18} className="text-white" />}
                iconColor="bg-primary-600"
                title="Equipment Assigned"
                timestamp="Oct 14, 11:05 AM"
                description="Office Desk assigned to Dr. Smith in Faculty Office"
              />
              <RecentActivityItem
                icon={<Package size={18} className="text-white" />}
                iconColor="bg-secondary-600"
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