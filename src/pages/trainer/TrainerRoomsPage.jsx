import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clipboard, Search, ChevronRight, Check, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import './TrainerRoomsPage.css';

const mockRooms = [
  {
    id: '1',
    name: 'Room 101',
    building: 'Main Building',
    floor: '1st Floor',
    equipmentCount: 12,
    maintenanceNeeded: 0,
    lastChecked: '2023-10-12T09:30:00Z',
  },
  // ... other mock rooms
];

const TrainerRoomsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [rooms] = useState(mockRooms);
  
  const filteredRooms = rooms.filter(room => {
    const searchLower = searchTerm.toLowerCase();
    return (
      room.name.toLowerCase().includes(searchLower) ||
      room.building.toLowerCase().includes(searchLower)
    );
  });
  
  return (
    <div className="trainer-rooms">
      <div className="rooms-header">
        <h1>My Assigned Rooms</h1>
      </div>
      
      {/* Search Bar */}
      <div className="search-container">
        <Search className="search-icon" />
        <Input
          placeholder="Search rooms..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      
      {/* Rooms Grid */}
      <div className="rooms-grid">
        {filteredRooms.map(room => (
          <Link to={`/rooms/${room.id}`} key={room.id} className="room-link">
            <Card className="room-card">
              <CardContent className="room-content">
                <div className="room-header">
                  <div>
                    <h2>{room.name}</h2>
                    <p>{room.building}, {room.floor}</p>
                  </div>
                  <ChevronRight className="chevron-icon" />
                </div>
                
                <div className="room-details">
                  <div className="detail-item">
                    <span>Equipment</span>
                    <span>{room.equipmentCount} items</span>
                  </div>
                  
                  <div className="detail-item">
                    <span>Maintenance Needed</span>
                    <div className="status">
                      {room.maintenanceNeeded > 0 ? (
                        <>
                          <AlertTriangle className="status-icon warning" />
                          <Badge variant="warning">{room.maintenanceNeeded} items</Badge>
                        </>
                      ) : (
                        <>
                          <Check className="status-icon success" />
                          <Badge variant="success">All Good</Badge>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <span>Last Checked</span>
                    <span>
                      {new Date(room.lastChecked).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="room-button">
                  <Button
                    as="div"
                    variant="outline"
                    className="update-button"
                    icon={<Clipboard size={16} />}
                  >
                    Update Status
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      
      {filteredRooms.length === 0 && (
        <div className="empty-rooms">
          <p>No rooms found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default TrainerRoomsPage;