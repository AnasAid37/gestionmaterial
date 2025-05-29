import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Save, QrCode, Calendar, MapPin, User, PenTool as Tool, Info } from 'lucide-react';
import { useInventoryStore } from '../../stores/inventoryStore';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import './ItemDetailsPage.css';

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
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }
  
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
  
  const qrCodeUrl = `${window.location.origin}/inventory/${id}`;
  
  return (
    <div className="item-details-container">
      <div className="item-header">
        <div className="header-left">
          <Button 
            variant="outline" 
            size="sm"
            icon={<ArrowLeft size={16} />} 
            onClick={() => navigate('/inventory')}
          />
          <h1>{item.name}</h1>
          <StatusBadge status={item.status} />
        </div>
        
        <div className="header-actions">
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
                className="delete-button"
              >
                Delete
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div className="item-content-grid">
        <div className="main-content">
          {/* Item Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="card-title">
                <Info size={18} />
                <span>Item Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="form-grid">
                  <div className="form-group">
                    <label>Item Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editedItem.name || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      name="category"
                      value={editedItem.category || ''}
                      onChange={handleInputChange}
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
                  
                  <div className="form-group full-width">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={editedItem.description || ''}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Serial Number</label>
                    <input
                      type="text"
                      name="serialNumber"
                      value={editedItem.serialNumber || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Acquisition Date</label>
                    <input
                      type="date"
                      name="acquisitionDate"
                      value={editedItem.acquisitionDate || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              ) : (
                <div className="details-grid">
                  <div className="detail-item">
                    <h3>Item Name</h3>
                    <p>{item.name}</p>
                  </div>
                  
                  <div className="detail-item">
                    <h3>Category</h3>
                    <p>{item.category}</p>
                  </div>
                  
                  <div className="detail-item full-width">
                    <h3>Description</h3>
                    <p>{item.description || 'No description provided'}</p>
                  </div>
                  
                  <div className="detail-item">
                    <h3>Serial Number</h3>
                    <p>{item.serialNumber}</p>
                  </div>
                  
                  <div className="detail-item">
                    <h3>Acquisition Date</h3>
                    <p>{new Date(item.acquisitionDate).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Status & Location Card */}
          <Card>
            <CardHeader>
              <CardTitle className="card-title">
                <MapPin size={18} />
                <span>Status & Location</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="form-grid">
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      name="status"
                      value={editedItem.status || ''}
                      onChange={handleInputChange}
                    >
                      <option value="available">Available</option>
                      <option value="in-use">In Use</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="retired">Retired</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Condition</label>
                    <select
                      name="condition"
                      value={editedItem.condition || ''}
                      onChange={handleInputChange}
                    >
                      <option value="new">New</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="poor">Poor</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      name="location"
                      value={editedItem.location || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Assigned To</label>
                    <input
                      type="text"
                      name="assignedTo"
                      value={editedItem.assignedTo || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              ) : (
                <div className="details-grid">
                  <div className="detail-item">
                    <h3>Status</h3>
                    <StatusBadge status={item.status} />
                  </div>
                  
                  <div className="detail-item">
                    <h3>Condition</h3>
                    <p className="capitalize">{item.condition}</p>
                  </div>
                  
                  <div className="detail-item">
                    <h3>Location</h3>
                    <p>{item.location}</p>
                  </div>
                  
                  <div className="detail-item">
                    <h3>Assigned To</h3>
                    <p>{item.assignedTo || 'Not assigned'}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Maintenance Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="card-title">
                <Tool size={18} />
                <span>Maintenance Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="form-grid">
                  <div className="form-group">
                    <label>Last Maintenance Date</label>
                    <input
                      type="date"
                      name="lastMaintenance"
                      value={editedItem.lastMaintenance || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Next Maintenance Date</label>
                    <input
                      type="date"
                      name="nextMaintenance"
                      value={editedItem.nextMaintenance || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-group full-width">
                    <label>Notes</label>
                    <textarea
                      name="notes"
                      value={editedItem.notes || ''}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>
                </div>
              ) : (
                <div className="details-grid">
                  <div className="detail-item">
                    <h3>Last Maintenance Date</h3>
                    <p>
                      {item.lastMaintenance 
                        ? new Date(item.lastMaintenance).toLocaleDateString() 
                        : 'No maintenance record'}
                    </p>
                  </div>
                  
                  <div className="detail-item">
                    <h3>Next Maintenance Date</h3>
                    <p>
                      {item.nextMaintenance 
                        ? new Date(item.nextMaintenance).toLocaleDateString() 
                        : 'Not scheduled'}
                    </p>
                  </div>
                  
                  <div className="detail-item full-width">
                    <h3>Notes</h3>
                    <p>{item.notes || 'No notes'}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* QR Code and History Card */}
        <div className="sidebar-content">
          <Card>
            <CardHeader>
              <CardTitle className="card-title">
                <QrCode size={18} />
                <span>QR Code</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="qr-card-content">
              <div className="qr-code-container">
                <QRCode value={qrCodeUrl} size={200} />
              </div>
              <p className="qr-description">
                Scan this QR code to quickly access this item's details
              </p>
              <Button
                variant="outline"
                className="qr-button"
              >
                Print QR Code
              </Button>
            </CardContent>
          </Card>
          
          {/* Item History Card */}
          <Card>
            <CardHeader>
              <CardTitle className="card-title">
                <Calendar size={18} />
                <span>Item History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="history-timeline">
                <div className="timeline-item">
                  <div className="timeline-dot primary"></div>
                  <p className="timeline-title">Created</p>
                  <p className="timeline-date">{new Date(item.createdAt).toLocaleString()}</p>
                </div>
                
                <div className="timeline-item">
                  <div className="timeline-dot gray"></div>
                  <p className="timeline-title">Last Updated</p>
                  <p className="timeline-date">{new Date(item.updatedAt).toLocaleString()}</p>
                </div>
                
                {item.lastMaintenance && (
                  <div className="timeline-item">
                    <div className="timeline-dot warning"></div>
                    <p className="timeline-title">Maintenance Performed</p>
                    <p className="timeline-date">{new Date(item.lastMaintenance).toLocaleString()}</p>
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