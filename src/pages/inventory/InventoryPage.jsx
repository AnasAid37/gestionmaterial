import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { useInventoryStore } from '../../stores/inventoryStore';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { Card } from '../../components/ui/Card';
import * as XLSX from 'xlsx';
import './InventoryPage.css';

const InventoryPage = () => {
  const { items, isLoading, fetchItems, deleteItem } = useInventoryStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);
  
  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === '' || item.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
  
  const sortedItems = [...filteredItems].sort((a, b) => {
    const valueA = a[sortField];
    const valueB = b[sortField];
    
    if (valueA < valueB) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (valueA > valueB) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });
  
  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const categories = Array.from(new Set(items.map(item => item.category)));
  
  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredItems);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory');
    XLSX.writeFile(workbook, 'inventory_export.xlsx');
  };
  
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
  
  const ConditionBadge = ({ condition }) => {
    switch (condition) {
      case 'new':
        return <Badge variant="success">New</Badge>;
      case 'good':
        return <Badge variant="info">Good</Badge>;
      case 'fair':
        return <Badge variant="warning">Fair</Badge>;
      case 'poor':
        return <Badge variant="error">Poor</Badge>;
      default:
        return <Badge>{condition}</Badge>;
    }
  };
  
  const SortIcon = ({ field }) => {
    if (field !== sortField) {
      return <ArrowUpDown size={16} />;
    }
    return sortDirection === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />;
  };
  
  const handleDeleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteItem(id);
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };
  
  return (
    <div className="inventory-container">
      <div className="inventory-header">
        <h1>Inventory Management</h1>
        <div className="header-actions">
          <Button
            variant="outline"
            icon={<Download size={18} />}
            onClick={handleExport}
          >
            Export to Excel
          </Button>
          <Button
            icon={<Plus size={18} />}
            as={Link}
            to="/inventory/add"
          >
            Add New Item
          </Button>
        </div>
      </div>
      
      {/* Filters and Search */}
      <Card className="filters-card">
        <div className="filters-grid">
          <div className="search-container">
            <Search className="search-icon" />
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <Select
            options={[
              { value: '', label: 'All Categories' },
              ...categories.map(category => ({ value: category, label: category }))
            ]}
            value={selectedCategory}
            onChange={setSelectedCategory}
            placeholder="Filter by Category"
          />
          
          <Select
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'available', label: 'Available' },
              { value: 'in-use', label: 'In Use' },
              { value: 'maintenance', label: 'Maintenance' },
              { value: 'retired', label: 'Retired' }
            ]}
            value={selectedStatus}
            onChange={setSelectedStatus}
            placeholder="Filter by Status"
          />
          
          <Button 
            variant="outline" 
            icon={<Filter size={18} />}
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('');
              setSelectedStatus('');
            }}
          >
            Clear Filters
          </Button>
        </div>
      </Card>
      
      {/* Inventory Table */}
      <div className="inventory-table-container">
        <div className="table-wrapper">
          <table className="inventory-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('name')}>
                  <div className="sort-header">
                    Item Name
                    <SortIcon field="name" />
                  </div>
                </th>
                <th onClick={() => handleSort('category')}>
                  <div className="sort-header">
                    Category
                    <SortIcon field="category" />
                  </div>
                </th>
                <th onClick={() => handleSort('serialNumber')}>
                  <div className="sort-header">
                    Serial Number
                    <SortIcon field="serialNumber" />
                  </div>
                </th>
                <th onClick={() => handleSort('status')}>
                  <div className="sort-header">
                    Status
                    <SortIcon field="status" />
                  </div>
                </th>
                <th onClick={() => handleSort('condition')}>
                  <div className="sort-header">
                    Condition
                    <SortIcon field="condition" />
                  </div>
                </th>
                <th onClick={() => handleSort('location')}>
                  <div className="sort-header">
                    Location
                    <SortIcon field="location" />
                  </div>
                </th>
                <th className="actions-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="loading-cell">
                    <div className="spinner"></div>
                    <p>Loading inventory items...</p>
                  </td>
                </tr>
              ) : sortedItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty-cell">
                    <p>No items found. Try adjusting your filters or add a new item.</p>
                  </td>
                </tr>
              ) : (
                sortedItems.map((item) => (
                  <tr key={item.id} className="table-row">
                    <td className="item-name">{item.name}</td>
                    <td className="item-category">{item.category}</td>
                    <td className="item-serial">{item.serialNumber}</td>
                    <td className="item-status">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="item-condition">
                      <ConditionBadge condition={item.condition} />
                    </td>
                    <td className="item-location">{item.location}</td>
                    <td className="item-actions">
                      <div className="action-buttons">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Eye size={16} />}
                          as={Link}
                          to={`/inventory/${item.id}`}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Edit size={16} />}
                          as={Link}
                          to={`/inventory/${item.id}?edit=true`}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Trash2 size={16} />}
                          onClick={() => handleDeleteItem(item.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;