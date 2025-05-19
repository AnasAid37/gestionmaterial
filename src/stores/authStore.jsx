import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  isAuthenticated: true, // Auto-login for demo purposes
  user: {
    id: '1',
    name: 'Demo User',
    email: 'demo@example.com',
    role: 'management',
  },
  userRole: 'management',

  login: async (email, password) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Determine role based on email (just for demo)
    let role = 'management';
    if (email.includes('trainer')) {
      role = 'trainer';
    } else if (email.includes('store')) {
      role = 'storekeeper';
    }

    set({
      isAuthenticated: true,
      user: {
        id: '1',
        name: email.split('@')[0],
        email,
        role,
      },
      userRole: role,
    });
  },

  logout: () => {
    set({
      isAuthenticated: false,
      user: null,
      userRole: 'management',
    });
  },
}));
