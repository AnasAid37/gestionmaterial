import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useInventoryStore } from '../../stores/inventoryStore';
import { QrCode, Download, Printer, Search } from 'lucide-react';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

const QRCodeItem = ({ id, name, serialNumber, category }) => {
  const qrCodeUrl = `${window.location.origin}/inventory/${id}`;
  
  return (
    <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center">
      <QRCode value={qrCodeUrl} size={150} />
      <div className="mt-4 text-center">
        <h3 className="font-medium text-gray-900">{name}</h3>
        <p className="text-sm text-gray-500">{category}</p>
        <p className="text-xs text-gray-500 mt-1">{serialNumber}</p>
      </div>
    </div>
  );
};

const QRCodePage = () => {
  const { items } = useInventoryStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const printRef = useRef(null);
  
  // Filter items based on search term and category
  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Get unique categories for filter
  const categories = Array.from(new Set(items.map(item => item.category)));
  
  // Handle print function
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <QrCode size={24} />
          QR Code Generator
        </h1>
        <div className="flex items-center gap-2">
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
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or serial number..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
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
      <div ref={printRef} className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-6">QR Codes for Inventory Items</h2>
        
        {filteredItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No items found matching your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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