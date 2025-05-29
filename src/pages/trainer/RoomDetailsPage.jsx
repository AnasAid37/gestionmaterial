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
import './RoomDetailsPage.css';

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
  // ... other mock rooms
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
      const filtered = items.filter(item => 
        item.assignedTo === mockRooms[id].name || 
        item.location === mockRooms[id].name
      );
      setRoomItems(filtered);
      
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
      const updatePromises = Object.entries(statusUpdates).map(([itemId, updates]) => {
        return updateItem(itemId, updates);
      });
      
      await Promise.all(updatePromises);
      
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
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }
  
  return (
    <div className="room-details">
      <div className="room-header">
        <div className="header-left">
          <Button 
            variant="outline" 
            size="sm"
            icon={<ArrowLeft size={16} />} 
            onClick={() => navigate('/rooms')}
          />
          <h1>{room.name}</h1>
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
      <Card className="room-info">
        <CardHeader>
          <CardTitle>Room Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="info-grid">
            <div className="info-item">
              <h3>Building</h3>
              <p>{room.building}</p>
            </div>
            
            <div className="info-item">
              <h3>Floor</h3>
              <p>{room.floor}</p>
            </div>
            
            <div className="info-item">
              <h3>Capacity</h3>
              <p>{room.capacity} people</p>
            </div>
            
            <div className="info-item full-width">
              <h3>Description</h3>
              <p>{room.description}</p>
            </div>
            
            <div className="info-item">
              <h3>Last Checked</h3>
              <p>{new Date(room.lastChecked).toLocaleDateString()}</p>
            </div>
            
            <div className="info-item">
              <h3>Equipment Count</h3>
              <p>{roomItems.length} items</p>
            </div>
            
            <div className="info-item">
              <h3>Issues Found</h3>
              <p>
                {roomItems.filter(item => item.status === 'maintenance').length} items
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Equipment Status */}
      <div className="equipment-section">
        <div className="equipment-header">
          <h2>Room Equipment Status</h2>
          
          <div className="search-container">
            <Search className="search-icon" />
            <Input
              placeholder="Search equipment..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        
        {filteredItems.length === 0 ? (
          <div className="empty-equipment">
            <p>No equipment found in this room.</p>
          </div>
        ) : (
          <div className="equipment-list">
            <ul>
              {filteredItems.map(item => (
                <li key={item.id} className="equipment-item">
                  <div className="item-header">
                    <div>
                      <h3>{item.name}</h3>
                      <p>
                        {item.category} • SN: {item.serialNumber}
                      </p>
                    </div>
                    
                    <div className="item-controls">
                      <div className="control-group">
                        <label>Status</label>
                        <select
                          value={statusUpdates[item.id]?.status || item.status}
                          onChange={e => handleStatusChange(item.id, 'status', e.target.value)}
                        >
                          <option value="available">Available</option>
                          <option value="in-use">In Use</option>
                          <option value="maintenance">Maintenance Needed</option>
                        </select>
                      </div>
                      
                      <div className="control-group">
                        <label>Condition</label>
                        <select
                          value={statusUpdates[item.id]?.condition || item.condition}
                          onChange={e => handleStatusChange(item.id, 'condition', e.target.value)}
                        >
                          <option value="new">New</option>
                          <option value="good">Good</option>
                          <option value="fair">Fair</option>
                          <option value="poor">Poor</option>
                        </select>
                      </div>
                      
                      <div className="control-group notes">
                        <label>Notes</label>
                        <input
                          type="text"
                          value={statusUpdates[item.id]?.notes || item.notes}
                          onChange={e => handleStatusChange(item.id, 'notes', e.target.value)}
                          placeholder="Add notes about this item"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {statusUpdates[item.id]?.status === 'maintenance' && (
                    <div className="maintenance-alert">
                      <AlertTriangle className="alert-icon" />
                      <div>
                        <p>Maintenance Needed</p>
                        <p>
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