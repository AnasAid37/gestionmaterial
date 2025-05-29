import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useInventoryStore } from '../../stores/inventoryStore';
import { BarChart2, Download, Filter, Printer, List, PieChart } from 'lucide-react';
import * as XLSX from 'xlsx';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import './ReportsPage.css';

const ReportsPage = () => {
  const { items } = useInventoryStore();
  const [reportType, setReportType] = useState('inventory');
  const [timeFrame, setTimeFrame] = useState('all');
  const printRef = useRef(null);
  
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
  
  const handleExport = () => {
    const reportData = getReportData();
    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    XLSX.writeFile(workbook, `${reportType}_report.xlsx`);
  };
  
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
      <div className="report-table-container">
        <table className="report-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Category</th>
              <th>Serial Number</th>
              <th>Status</th>
              <th>Location</th>
              <th>Acquisition Date</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td className="item-name">{item.name}</td>
                <td className="item-category">{item.category}</td>
                <td className="item-serial">{item.serialNumber}</td>
                <td className="item-status">
                  <span className={`status-badge ${item.status}`}>
                    {item.status}
                  </span>
                </td>
                <td className="item-location">{item.location}</td>
                <td className="item-date">
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
      <div className="status-report">
        <div className="status-cards">
          {statusData.map((status) => (
            <Card key={status.status} className="status-card">
              <CardContent className="status-card-content">
                <h3 className="status-title">{status.status}</h3>
                <p className="status-count">{status.count}</p>
                <p className="status-percentage">{status.percentage}% of total</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="status-bars">
          {statusData.map((status) => (
            <div key={status.status} className="status-bar">
              <div className="bar-header">
                <span className="bar-label">{status.status}</span>
                <span className="bar-value">{status.count} items ({status.percentage}%)</span>
              </div>
              <div className="bar-track">
                <div 
                  className={`bar-progress ${status.status}`} 
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
      <div className="category-report">
        <div className="report-table-container">
          <table className="report-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Count</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {categoryData.map((category) => (
                <tr key={category.category}>
                  <td className="category-name">{category.category}</td>
                  <td className="category-count">{category.count}</td>
                  <td className="category-percentage">{category.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="category-bars">
          {categoryData.map((category, index) => {
            const hue = (index * 137) % 360;
            const color = `hsl(${hue}, 70%, 60%)`;
            
            return (
              <div key={category.category} className="category-bar">
                <div className="bar-header">
                  <span className="bar-label">{category.category}</span>
                  <span className="bar-value">{category.count} items ({category.percentage}%)</span>
                </div>
                <div className="bar-track">
                  <div 
                    className="bar-progress" 
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
      <div className="location-report">
        <div className="report-table-container">
          <table className="report-table">
            <thead>
              <tr>
                <th>Location</th>
                <th>Count</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {locationData.map((location) => (
                <tr key={location.location}>
                  <td className="location-name">{location.location}</td>
                  <td className="location-count">{location.count}</td>
                  <td className="location-percentage">{location.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1>
          <BarChart2 size={24} />
          <span>Reports</span>
        </h1>
        <div className="report-actions">
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
      <Card className="report-config">
        <CardContent className="config-content">
          <div className="config-grid">
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
            
            <div className="config-reset">
              <Button 
                variant="outline" 
                icon={<Filter size={18} />}
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
        <CardHeader className="report-card-header">
          <CardTitle className="report-title">
            {reportType === 'inventory' && <List size={18} />}
            {reportType === 'status' && <PieChart size={18} />}
            {reportType === 'category' && <PieChart size={18} />}
            {reportType === 'location' && <PieChart size={18} />}
            {reportType === 'inventory' && 'Inventory List Report'}
            {reportType === 'status' && 'Status Distribution Report'}
            {reportType === 'category' && 'Category Distribution Report'}
            {reportType === 'location' && 'Location Distribution Report'}
          </CardTitle>
          <p className="report-count">
            Total Items: {items.length}
          </p>
        </CardHeader>
        <CardContent ref={printRef} className="report-content">
          {renderReportContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;