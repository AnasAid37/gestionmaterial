import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Save, QrCode, Calendar, MapPin, User, PenTool as Tool, Info } from 'lucide-react';
import { useInventoryStore } from '../../stores/inventoryStore';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { QRCodeCanvas as QRCode } from 'qrcode.react';

const ItemDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getItemById, updateItem, deleteItem } = useInventoryStore();
  
  const [item, setItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editedItem, setEditedItem] = useState({});
  
  useEffect(() => {
    if (id) {
      const fetchedItem = getItemById(id);
      if (fetchedItem) {
        setItem(fetchedItem);
        setEditedItem(fetchedItem);
      } else {
        navigate('/inventory');
      }
    }
    
    // Check if we should be in edit mode based on URL query params
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('edit') === 'true') {
      setIsEditing(true);
    }
  }, [id, getItemById, navigate, location.search]);
  
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedItem(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSave = async () => {
    if (!id || !item) return;
    
    setIsLoading(true);
    try {
      const updatedItem = await updateItem(id, editedItem);
      setItem(updatedItem);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating item:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (!id) return;
    
    if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      setIsLoading(true);
      try {
        await deleteItem(id);
        navigate('/inventory');
      } catch (error) {
        console.error('Error deleting item:', error);
        setIsLoading(false);
      }
    }
  };
  
  if (!item) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  // Status badge component
  const StatusBadge = ({ status }) => {
    switch (status) {
      case 'available':
        return <Badge variant="success">Available</Badge>;
      case 'in-use':
        return <Badge variant="info">In Use</Badge>;
      case 'maintenance':
        return <Badge variant="warning">Maintenance</Badge>;
      case 'retired':
        return <Badge variant="default">Retired</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Generate QR code URL
  const qrCodeUrl = `${window.location.origin}/inventory/${id}`;
  
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            icon={<ArrowLeft size={16} />} 
            onClick={() => navigate('/inventory')}
          />
          <h1 className="text-2xl font-semibold">{item.name}</h1>
          <StatusBadge status={item.status} />
        </div>
        
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setEditedItem(item);
                  setIsEditing(false);
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                icon={<Save size={18} />}
                onClick={handleSave}
                isLoading={isLoading}
              >
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                icon={<Edit size={18} />}
                onClick={handleEditToggle}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                icon={<Trash2 size={18} />}
                onClick={handleDelete}
                className="text-error-600 border-error-200 hover:bg-error-50"
              >
                Delete
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Item Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info size={18} />
                Item Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Item Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editedItem.name || ''}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      name="category"
                      value={editedItem.category || ''}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    >
                      <option value="Laptop">Laptop</option>
                      <option value="Desktop">Desktop</option>
                      <option value="Tablet">Tablet</option>
                      <option value="Projector">Projector</option>
                      <option value="Printer">Printer</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Classroom Equipment">Classroom Equipment</option>
                      <option value="Lab Equipment">Lab Equipment</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={editedItem.description || ''}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Serial Number
                    </label>
                    <input
                      type="text"
                      name="serialNumber"
                      value={editedItem.serialNumber || ''}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Acquisition Date
                    </label>
                    <input
                      type="date"
                      name="acquisitionDate"
                      value={editedItem.acquisitionDate || ''}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Item Name</h3>
                    <p className="mt-1">{item.name}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Category</h3>
                    <p className="mt-1">{item.category}</p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-500">Description</h3>
                    <p className="mt-1">{item.description || 'No description provided'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Serial Number</h3>
                    <p className="mt-1">{item.serialNumber}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Acquisition Date</h3>
                    <p className="mt-1">{new Date(item.acquisitionDate).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Status & Location Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin size={18} />
                Status & Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={editedItem.status || ''}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="available">Available</option>
                      <option value="in-use">In Use</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="retired">Retired</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Condition
                    </label>
                    <select
                      name="condition"
                      value={editedItem.condition || ''}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="new">New</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="poor">Poor</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={editedItem.location || ''}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assigned To
                    </label>
                    <input
                      type="text"
                      name="assignedTo"
                      value={editedItem.assignedTo || ''}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <div className="mt-1">
                      <StatusBadge status={item.status} />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Condition</h3>
                    <p className="mt-1 capitalize">{item.condition}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Location</h3>
                    <p className="mt-1">{item.location}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Assigned To</h3>
                    <p className="mt-1">{item.assignedTo || 'Not assigned'}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Maintenance Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tool size={18} />
                Maintenance Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Maintenance Date
                    </label>
                    <input
                      type="date"
                      name="lastMaintenance"
                      value={editedItem.lastMaintenance || ''}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Next Maintenance Date
                    </label>
                    <input
                      type="date"
                      name="nextMaintenance"
                      value={editedItem.nextMaintenance || ''}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={editedItem.notes || ''}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Last Maintenance Date</h3>
                    <p className="mt-1">
                      {item.lastMaintenance 
                        ? new Date(item.lastMaintenance).toLocaleDateString() 
                        : 'No maintenance record'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Next Maintenance Date</h3>
                    <p className="mt-1">
                      {item.nextMaintenance 
                        ? new Date(item.nextMaintenance).toLocaleDateString() 
                        : 'Not scheduled'}
                    </p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                    <p className="mt-1">{item.notes || 'No notes'}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* QR Code and History Card */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode size={18} />
                QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <QRCode value={qrCodeUrl} size={200} />
              </div>
              <p className="text-sm text-gray-500 mt-4 text-center">
                Scan this QR code to quickly access this item's details
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {}}
              >
                Print QR Code
              </Button>
            </CardContent>
          </Card>
          
          {/* Item History Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar size={18} />
                Item History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-l-2 border-gray-200 pl-4 space-y-6">
                <div className="relative">
                  <div className="absolute -left-6 top-0 h-4 w-4 rounded-full bg-primary-600"></div>
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(item.createdAt).toLocaleString()}</p>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-6 top-0 h-4 w-4 rounded-full bg-gray-400"></div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(item.updatedAt).toLocaleString()}</p>
                </div>
                
                {item.lastMaintenance && (
                  <div className="relative">
                    <div className="absolute -left-6 top-0 h-4 w-4 rounded-full bg-warning-500"></div>
                    <p className="text-sm font-medium">Maintenance Performed</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(item.lastMaintenance).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsPage;