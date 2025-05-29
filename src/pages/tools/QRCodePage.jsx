import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useInventoryStore } from '../../stores/inventoryStore';
import { QrCode, Download, Printer, Search } from 'lucide-react';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import './QRCodePage.css';

const QRCodeItem = ({ id, name, serialNumber, category }) => {
  const qrCodeUrl = `${window.location.origin}/inventory/${id}`;
  
  return (
    <div className="qr-item">
      <QRCode value={qrCodeUrl} size={150} />
      <div className="qr-item-info">
        <h3>{name}</h3>
        <p className="qr-category">{category}</p>
        <p className="qr-serial">{serialNumber}</p>
      </div>
    </div>
  );
};

const QRCodePage = () => {
  const { items } = useInventoryStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const printRef = useRef(null);
  
  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const categories = Array.from(new Set(items.map(item => item.category)));
  
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  
  return (
    <div className="qr-page">
      <div className="qr-header">
        <h1>
          <QrCode size={24} />
          <span>QR Code Generator</span>
        </h1>
        <div className="qr-actions">
          <Button
            variant="outline"
            icon={<Printer size={18} />}
            onClick={handlePrint}
          >
            Print QR Codes
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <Card className="qr-filters">
        <CardContent className="filters-content">
          <div className="filters-grid">
            <div className="search-container">
              <Search className="search-icon" />
              <Input
                placeholder="Search by name or serial number..."
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
            
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* QR Codes Grid */}
      <div ref={printRef} className="qr-codes-container">
        <h2>QR Codes for Inventory Items</h2>
        
        {filteredItems.length === 0 ? (
          <div className="qr-empty">
            <p>No items found matching your criteria</p>
          </div>
        ) : (
          <div className="qr-grid">
            {filteredItems.map(item => (
              <QRCodeItem
                key={item.id}
                id={item.id}
                name={item.name}
                serialNumber={item.serialNumber}
                category={item.category}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QRCodePage;