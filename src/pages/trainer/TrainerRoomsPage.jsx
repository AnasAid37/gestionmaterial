import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clipboard, Search, ChevronRight, Check, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';

// Mock data for rooms
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
  {
    id: '2',
    name: 'Computer Lab A',
    building: 'Technology Block',
    floor: 'Ground Floor',
    equipmentCount: 30,
    maintenanceNeeded: 2,
    lastChecked: '2023-10-10T14:15:00Z',
  },
  {
    id: '3',
    name: 'Lecture Hall B',
    building: 'Science Block',
    floor: '2nd Floor',
    equipmentCount: 15,
    maintenanceNeeded: 1,
    lastChecked: '2023-10-08T11:45:00Z',
  },
  {
    id: '4',
    name: 'Room 203',
    building: 'Main Building',
    floor: '2nd Floor',
    equipmentCount: 8,
    maintenanceNeeded: 0,
    lastChecked: '2023-10-14T08:20:00Z',
  },
  {
    id: '5',
    name: 'Physics Lab',
    building: 'Science Block',
    floor: '1st Floor',
    equipmentCount: 25,
    maintenanceNeeded: 3,
    lastChecked: '2023-10-05T10:00:00Z',
  },
];

const TrainerRoomsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [rooms] = useState(mockRooms);
  
  // Filter rooms based on search term
  const filteredRooms = rooms.filter(room => {
    const searchLower = searchTerm.toLowerCase();
    return (
      room.name.toLowerCase().includes(searchLower) ||
      room.building.toLowerCase().includes(searchLower)
    );
  });
  
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold">My Assigned Rooms</h1>
      </div>
      
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          placeholder="Search rooms..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {/* Rooms Grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredRooms.map(room => (
          <Link to={`/rooms/${room.id}`} key={room.id}>
            <Card className="hover:shadow-md transition-all duration-200 h-full">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold">{room.name}</h2>
                    <p className="text-gray-500 text-sm mt-1">{room.building}, {room.floor}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
                
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Equipment</span>
                    <span className="font-medium">{room.equipmentCount} items</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Maintenance Needed</span>
                    <div className="flex items-center gap-1">
                      {room.maintenanceNeeded > 0 ? (
                        <>
                          <AlertTriangle className="h-4 w-4 text-warning-500" />
                          <Badge variant="warning">{room.maintenanceNeeded} items</Badge>
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 text-success-500" />
                          <Badge variant="success">All Good</Badge>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Last Checked</span>
                    <span className="text-sm">
                      {new Date(room.lastChecked).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button
                    as="div"
                    variant="outline"
                    className="w-full"
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
        <div className="text-center py-12">
          <p className="text-gray-500">No rooms found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default TrainerRoomsPage;