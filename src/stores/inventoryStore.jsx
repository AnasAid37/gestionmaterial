import { create } from 'zustand';

// Mock data for demonstration
const mockItems = [
  {
    id: '1',
    name: 'Dell Latitude 5420',
    category: 'Laptop',
    description: 'Business laptop with 14" display, Intel Core i5, 16GB RAM',
    serialNumber: 'DL-5420-001',
    acquisitionDate: '2023-01-15',
    status: 'available',
    condition: 'new',
    location: 'IT Lab',
    assignedTo: '',
    lastMaintenance: null,
    nextMaintenance: '2024-01-15',
    notes: 'New acquisition for the IT department',
    createdAt: '2023-01-15T10:30:00Z',
    updatedAt: '2023-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'EPSON EB-X49',
    category: 'Projector',
    description: 'Portable XGA 3LCD projector with 3600 lumens',
    serialNumber: 'EP-X49-002',
    acquisitionDate: '2022-11-20',
    status: 'in-use',
    condition: 'good',
    location: 'Lecture Hall A',
    assignedTo: 'Room 101',
    lastMaintenance: '2023-05-10',
    nextMaintenance: '2023-11-10',
    notes: 'Lamp hours: 120',
    createdAt: '2022-11-20T14:15:00Z',
    updatedAt: '2023-05-10T09:45:00Z',
  },
  {
    id: '3',
    name: 'Office Desk',
    category: 'Furniture',
    description: 'Standard office desk 120x60cm with drawers',
    serialNumber: 'FRN-DSK-003',
    acquisitionDate: '2022-08-05',
    status: 'in-use',
    condition: 'good',
    location: 'Faculty Office',
    assignedTo: 'Dr. Smith',
    lastMaintenance: null,
    nextMaintenance: null,
    notes: '',
    createdAt: '2022-08-05T11:20:00Z',
    updatedAt: '2022-08-05T11:20:00Z',
  },
  {
    id: '4',
    name: 'Whiteboard',
    category: 'Classroom Equipment',
    description: '240x120cm magnetic whiteboard',
    serialNumber: 'WB-240-004',
    acquisitionDate: '2023-02-10',
    status: 'in-use',
    condition: 'good',
    location: 'Room 203',
    assignedTo: 'Room 203',
    lastMaintenance: null,
    nextMaintenance: null,
    notes: 'Mounted on north wall',
    createdAt: '2023-02-10T13:40:00Z',
    updatedAt: '2023-02-10T13:40:00Z',
  },
  {
    id: '5',
    name: 'HP LaserJet Pro M404dn',
    category: 'Printer',
    description: 'Monochrome laser printer with duplex printing',
    serialNumber: 'HP-M404-005',
    acquisitionDate: '2023-03-25',
    status: 'maintenance',
    condition: 'fair',
    location: 'Admin Office',
    assignedTo: 'Admin Department',
    lastMaintenance: '2023-08-12',
    nextMaintenance: '2023-11-12',
    notes: 'Paper jam issue reported on 2023-08-10',
    createdAt: '2023-03-25T09:10:00Z',
    updatedAt: '2023-08-12T16:20:00Z',
  },
];

export const useInventoryStore = create((set, get) => ({
  items: mockItems,
  isLoading: false,
  error: null,
  
  fetchItems: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ items: mockItems, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch inventory items', isLoading: false });
    }
  },
  
  addItem: async (item) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newItem = {
        ...item,
        id: Math.random().toString(36).substring(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      set(state => ({ 
        items: [...state.items, newItem],
        isLoading: false,
      }));
      
      return newItem;
    } catch (error) {
      set({ error: 'Failed to add item', isLoading: false });
      throw error;
    }
  },
  
  updateItem: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let updatedItem;
      
      set(state => {
        const updatedItems = state.items.map(item => {
          if (item.id === id) {
            updatedItem = {
              ...item,
              ...updates,
              updatedAt: new Date().toISOString(),
            };
            return updatedItem;
          }
          return item;
        });
        
        return { items: updatedItems, isLoading: false };
      });
      
      if (!updatedItem) {
        throw new Error('Item not found');
      }
      
      return updatedItem;
    } catch (error) {
      set({ error: 'Failed to update item', isLoading: false });
      throw error;
    }
  },
  
  deleteItem: async (id) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set(state => ({
        items: state.items.filter(item => item.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to delete item', isLoading: false });
      throw error;
    }
  },
  
  getItemById: (id) => {
    return get().items.find(item => item.id === id);
  },
}));