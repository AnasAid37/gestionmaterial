import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import { useInventoryStore } from '../../stores/inventoryStore';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/Card';

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
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Add New Item</h1>
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
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
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
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end space-x-4">
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