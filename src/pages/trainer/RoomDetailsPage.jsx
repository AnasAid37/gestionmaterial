import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clipboard, 
  Save, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Search
} from 'lucide-react';
import { useInventoryStore } from '../../stores/inventoryStore';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Input from '../../components/ui/Input';

// Mock room data
const mockRooms = {
  '1': {
    id: '1',
    name: 'Room 101',
    building: 'Main Building',
    floor: '1st Floor',
    description: 'Regular classroom with projector and whiteboard',
    capacity: 30,
    lastChecked: '2023-10-12T09:30:00Z',
  },
  '2': {
    id: '2',
    name: 'Computer Lab A',
    building: 'Technology Block',
    floor: 'Ground Floor',
    description: 'Computer lab with 30 workstations and teaching station',
    capacity: 30,
    lastChecked: '2023-10-10T14:15:00Z',
  },
  '3': {
    id: '3',
    name: 'Lecture Hall B',
    building: 'Science Block',
    floor: '2nd Floor',
    description: 'Large lecture hall with tiered seating',
    capacity: 100,
    lastChecked: '2023-10-08T11:45:00Z',
  },
  '4': {
    id: '4',
    name: 'Room 203',
    building: 'Main Building',
    floor: '2nd Floor',
    description: 'Small tutorial room',
    capacity: 15,
    lastChecked: '2023-10-14T08:20:00Z',
  },
  '5': {
    id: '5',
    name: 'Physics Lab',
    building: 'Science Block',
    floor: '1st Floor',
    description: 'Specialized lab with equipment for physics experiments',
    capacity: 25,
    lastChecked: '2023-10-05T10:00:00Z',
  },
};

const RoomDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, updateItem } = useInventoryStore();
  
  const [room, setRoom] = useState(null);
  const [roomItems, setRoomItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusUpdates, setStatusUpdates] = useState({});
  
  useEffect(() => {
    if (id && mockRooms[id]) {
      setRoom(mockRooms[id]);
      
      // Filter items that belong to this room
      const filtered = items.filter(item => 
        item.assignedTo === mockRooms[id].name || 
        item.location === mockRooms[id].name
      );
      setRoomItems(filtered);
      
      // Initialize status updates with current values
      const updates = {};
      filtered.forEach(item => {
        updates[item.id] = {
          status: item.status,
          condition: item.condition,
          notes: item.notes
        };
      });
      setStatusUpdates(updates);
    }
  }, [id, items]);
  
  const filteredItems = roomItems.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.name.toLowerCase().includes(searchLower) ||
      item.serialNumber.toLowerCase().includes(searchLower) ||
      item.category.toLowerCase().includes(searchLower)
    );
  });
  
  const handleStatusChange = (itemId, field, value) => {
    setStatusUpdates(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value
      }
    }));
  };
  
  const handleSaveUpdates = async () => {
    setIsUpdating(true);
    
    try {
      // Update each item with new status
      const updatePromises = Object.entries(statusUpdates).map(([itemId, updates]) => {
        return updateItem(itemId, updates);
      });
      
      await Promise.all(updatePromises);
      
      // Update room's lastChecked date
      if (room) {
        mockRooms[room.id] = {
          ...mockRooms[room.id],
          lastChecked: new Date().toISOString()
        };
        setRoom(mockRooms[room.id]);
      }
      
      alert('Room status updated successfully!');
    } catch (error) {
      console.error('Error updating items:', error);
      alert('Failed to update room status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };
  
  if (!room) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            icon={<ArrowLeft size={16} />} 
            onClick={() => navigate('/rooms')}
          />
          <h1 className="text-2xl font-semibold">{room.name}</h1>
        </div>
        
        <Button
          icon={<Save size={18} />}
          onClick={handleSaveUpdates}
          isLoading={isUpdating}
        >
          Save Updates
        </Button>
      </div>
      
      {/* Room Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Room Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Building</h3>
              <p className="mt-1">{room.building}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Floor</h3>
              <p className="mt-1">{room.floor}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Capacity</h3>
              <p className="mt-1">{room.capacity} people</p>
            </div>
            
            <div className="md:col-span-3">
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <p className="mt-1">{room.description}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Last Checked</h3>
              <p className="mt-1">{new Date(room.lastChecked).toLocaleDateString()}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Equipment Count</h3>
              <p className="mt-1">{roomItems.length} items</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Issues Found</h3>
              <p className="mt-1">
                {roomItems.filter(item => item.status === 'maintenance').length} items
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Equipment Status */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">Room Equipment Status</h2>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search equipment..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
        </div>
        
        {filteredItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No equipment found in this room.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg overflow-hidden shadow">
            <ul className="divide-y divide-gray-200">
              {filteredItems.map(item => (
                <li key={item.id} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.category} • SN: {item.serialNumber}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 md:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          value={statusUpdates[item.id]?.status || item.status}
                          onChange={e => handleStatusChange(item.id, 'status', e.target.value)}
                          className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        >
                          <option value="available">Available</option>
                          <option value="in-use">In Use</option>
                          <option value="maintenance">Maintenance Needed</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Condition
                        </label>
                        <select
                          value={statusUpdates[item.id]?.condition || item.condition}
                          onChange={e => handleStatusChange(item.id, 'condition', e.target.value)}
                          className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        >
                          <option value="new">New</option>
                          <option value="good">Good</option>
                          <option value="fair">Fair</option>
                          <option value="poor">Poor</option>
                        </select>
                      </div>
                      
                      <div className="w-full md:w-auto md:flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Notes
                        </label>
                        <input
                          type="text"
                          value={statusUpdates[item.id]?.notes || item.notes}
                          onChange={e => handleStatusChange(item.id, 'notes', e.target.value)}
                          placeholder="Add notes about this item"
                          className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {statusUpdates[item.id]?.status === 'maintenance' && (
                    <div className="mt-4 p-3 bg-warning-50 border border-warning-200 rounded-md flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-warning-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-warning-800">Maintenance Needed</p>
                        <p className="text-sm text-warning-700 mt-1">
                          Please provide detailed notes about the issue to help the maintenance team.
                        </p>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomDetailsPage;