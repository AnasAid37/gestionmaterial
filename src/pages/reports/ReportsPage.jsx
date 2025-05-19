import React, { useState } from 'react';
import { useInventoryStore, ItemStatus } from '../../stores/inventoryStore';
import { BarChart2, Download, Filter, Printer, List, PieChart } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import * as XLSX from 'xlsx';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

const ReportsPage = () => {
  const { items } = useInventoryStore();
  const [reportType, setReportType] = useState('inventory');
  const [timeFrame, setTimeFrame] = useState('all');
  const printRef = React.useRef(null);
  
  // Generate report data based on selected report type
  const getReportData = () => {
    switch (reportType) {
      case 'inventory':
        return items;
      case 'status':
        return getStatusReport();
      case 'category':
        return getCategoryReport();
      case 'location':
        return getLocationReport();
      default:
        return items;
    }
  };
  
  // Get status distribution report
  const getStatusReport = () => {
    const statusCounts = {
      'available': 0,
      'in-use': 0,
      'maintenance': 0,
      'retired': 0,
    };
    
    items.forEach(item => {
      statusCounts[item.status]++;
    });
    
    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      percentage: Math.round((count / items.length) * 100),
    }));
  };
  
  // Get category distribution report
  const getCategoryReport = () => {
    const categoryCounts = {};
    
    items.forEach(item => {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    });
    
    return Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count / items.length) * 100),
    }));
  };
  
  // Get location distribution report
  const getLocationReport = () => {
    const locationCounts = {};
    
    items.forEach(item => {
      locationCounts[item.location] = (locationCounts[item.location] || 0) + 1;
    });
    
    return Object.entries(locationCounts).map(([location, count]) => ({
      location,
      count,
      percentage: Math.round((count / items.length) * 100),
    }));
  };
  
  // Handle Excel export
  const handleExport = () => {
    const reportData = getReportData();
    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    XLSX.writeFile(workbook, `${reportType}_report.xlsx`);
  };
  
  // Handle print function
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  
  const renderReportContent = () => {
    switch (reportType) {
      case 'inventory':
        return renderInventoryReport();
      case 'status':
        return renderStatusReport();
      case 'category':
        return renderCategoryReport();
      case 'location':
        return renderLocationReport();
      default:
        return null;
    }
  };
  
  const renderInventoryReport = () => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Serial Number
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acquisition Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.serialNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${item.status === 'available' ? 'bg-green-100 text-green-800' : 
                    item.status === 'in-use' ? 'bg-blue-100 text-blue-800' : 
                    item.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-gray-100 text-gray-800'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(item.acquisitionDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  const renderStatusReport = () => {
    const statusData = getStatusReport();
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {statusData.map((status) => (
            <Card key={status.status} className="bg-gray-50">
              <CardContent className="p-4 text-center">
                <h3 className="text-lg font-medium capitalize">{status.status}</h3>
                <p className="text-3xl font-bold mt-2">{status.count}</p>
                <p className="text-sm text-gray-500 mt-1">{status.percentage}% of total</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="space-y-3">
          {statusData.map((status) => (
            <div key={status.status}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium capitalize">{status.status}</span>
                <span className="text-sm font-medium">{status.count} items ({status.percentage}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    status.status === 'available' ? 'bg-green-600' : 
                    status.status === 'in-use' ? 'bg-blue-600' : 
                    status.status === 'maintenance' ? 'bg-yellow-500' : 
                    'bg-gray-500'
                  }`} 
                  style={{ width: `${status.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const renderCategoryReport = () => {
    const categoryData = getCategoryReport();
    
    return (
      <div className="space-y-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Count
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categoryData.map((category) => (
                <tr key={category.category}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {category.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category.count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category.percentage}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="space-y-3">
          {categoryData.map((category, index) => {
            // Generate colors programmatically
            const hue = (index * 137) % 360; // Golden ratio to distribute colors
            const color = `hsl(${hue}, 70%, 60%)`;
            
            return (
              <div key={category.category}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{category.category}</span>
                  <span className="text-sm font-medium">{category.count} items ({category.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="h-2.5 rounded-full" 
                    style={{ width: `${category.percentage}%`, backgroundColor: color }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  const renderLocationReport = () => {
    const locationData = getLocationReport();
    
    return (
      <div className="space-y-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Count
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {locationData.map((location) => (
                <tr key={location.location}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {location.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {location.count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {location.percentage}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <BarChart2 size={24} />
          Reports
        </h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            icon={<Printer size={18} />}
            onClick={handlePrint}
          >
            Print Report
          </Button>
          <Button
            variant="outline"
            icon={<Download size={18} />}
            onClick={handleExport}
          >
            Export to Excel
          </Button>
        </div>
      </div>
      
      {/* Report Configuration */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Report Type"
              options={[
                { value: 'inventory', label: 'Inventory List' },
                { value: 'status', label: 'Status Distribution' },
                { value: 'category', label: 'Category Distribution' },
                { value: 'location', label: 'Location Distribution' },
              ]}
              value={reportType}
              onChange={setReportType}
            />
            
            <Select
              label="Time Frame"
              options={[
                { value: 'all', label: 'All Time' },
                { value: 'month', label: 'Last Month' },
                { value: 'quarter', label: 'Last Quarter' },
                { value: 'year', label: 'Last Year' },
              ]}
              value={timeFrame}
              onChange={setTimeFrame}
            />
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                icon={<Filter size={18} />}
                className="w-full"
                onClick={() => {
                  setReportType('inventory');
                  setTimeFrame('all');
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Report Content */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <CardTitle className="flex items-center gap-2">
            {reportType === 'inventory' && <List size={18} />}
            {reportType === 'status' && <PieChart size={18} />}
            {reportType === 'category' && <PieChart size={18} />}
            {reportType === 'location' && <PieChart size={18} />}
            {reportType === 'inventory' && 'Inventory List Report'}
            {reportType === 'status' && 'Status Distribution Report'}
            {reportType === 'category' && 'Category Distribution Report'}
            {reportType === 'location' && 'Location Distribution Report'}
          </CardTitle>
          <p className="text-sm text-gray-500">
            Total Items: {items.length}
          </p>
        </CardHeader>
        <CardContent ref={printRef} className="p-6">
          {renderReportContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;