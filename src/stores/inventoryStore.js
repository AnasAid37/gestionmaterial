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
  // ... other mock items ...
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