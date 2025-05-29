import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import { useInventoryStore } from '../../stores/inventoryStore';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/Card';
import './AddItemPage.css';

const AddItemPage = () => {
  const navigate = useNavigate();
  const { addItem } = useInventoryStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    serialNumber: '',
    acquisitionDate: new Date().toISOString().split('T')[0],
    status: 'available',
    condition: 'new',
    location: '',
    assignedTo: '',
    lastMaintenance: null,
    nextMaintenance: null,
    notes: '',
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addItem(formData);
      navigate('/inventory');
    } catch (error) {
      console.error('Error adding item:', error);
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="add-item-container">
      <div className="add-item-header">
        <h1>Add New Item</h1>
        <Button
          variant="outline"
          icon={<X size={18} />}
          onClick={() => navigate('/inventory')}
        >
          Cancel
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Item Information</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="form-content">
            <div className="form-grid">
              <Input
                label="Item Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              
              <Select
                label="Category"
                name="category"
                options={[
                  { value: 'Laptop', label: 'Laptop' },
                  { value: 'Desktop', label: 'Desktop' },
                  { value: 'Tablet', label: 'Tablet' },
                  { value: 'Projector', label: 'Projector' },
                  { value: 'Printer', label: 'Printer' },
                  { value: 'Furniture', label: 'Furniture' },
                  { value: 'Classroom Equipment', label: 'Classroom Equipment' },
                  { value: 'Lab Equipment', label: 'Lab Equipment' },
                  { value: 'Other', label: 'Other' },
                ]}
                value={formData.category}
                onChange={(value) => handleSelectChange('category', value)}
                required
              />
              
              <div className="form-textarea">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
              
              <Input
                label="Serial Number"
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleChange}
                required
              />
              
              <Input
                label="Acquisition Date"
                name="acquisitionDate"
                type="date"
                value={formData.acquisitionDate}
                onChange={handleChange}
                required
              />
              
              <Select
                label="Status"
                name="status"
                options={[
                  { value: 'available', label: 'Available' },
                  { value: 'in-use', label: 'In Use' },
                  { value: 'maintenance', label: 'Maintenance' },
                  { value: 'retired', label: 'Retired' },
                ]}
                value={formData.status}
                onChange={(value) => handleSelectChange('status', value)}
                required
              />
              
              <Select
                label="Condition"
                name="condition"
                options={[
                  { value: 'new', label: 'New' },
                  { value: 'good', label: 'Good' },
                  { value: 'fair', label: 'Fair' },
                  { value: 'poor', label: 'Poor' },
                ]}
                value={formData.condition}
                onChange={(value) => handleSelectChange('condition', value)}
                required
              />
              
              <Input
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
              
              <Input
                label="Assigned To"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                hint="Leave empty if not assigned"
              />
              
              <Input
                label="Last Maintenance Date"
                name="lastMaintenance"
                type="date"
                value={formData.lastMaintenance || ''}
                onChange={handleChange}
              />
              
              <Input
                label="Next Maintenance Date"
                name="nextMaintenance"
                type="date"
                value={formData.nextMaintenance || ''}
                onChange={handleChange}
              />
              
              <div className="form-textarea">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="form-footer">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/inventory')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              icon={<Save size={18} />}
            >
              Save Item
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddItemPage;