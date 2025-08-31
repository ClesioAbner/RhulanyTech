import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone?: string;
  address?: string;
  gamePreferences: string[];
  purchaseHistory: PurchaseRecord[];
  registrationMethod: 'email' | 'google' | 'steam' | 'discord';
  createdAt: Date;
  totalSpent: number;
  favoriteCategories: string[];
  loyaltyPoints: number;
  preferences: {
    budget: string;
    usage: string;
    experience: string;
    notifications: boolean;
    newsletter: boolean;
  };
}

export interface PurchaseRecord {
  id: string;
  orderNumber: string;
  date: Date;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  total: number;
  paymentMethod: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
}

interface UserStore {
  currentUser: UserProfile | null;
  users: UserProfile[];
  isLoggedIn: boolean;
  login: (user: UserProfile) => void;
  logout: () => void;
  register: (userData: Partial<UserProfile>) => Promise<UserProfile>;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addPurchase: (purchase: PurchaseRecord) => void;
  checkEmailExists: (email: string) => boolean;
  getUserByEmail: (email: string) => UserProfile | null;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [],
      isLoggedIn: false,

      login: (user) => set({ currentUser: user, isLoggedIn: true }),

      logout: () => set({ currentUser: null, isLoggedIn: false }),

      register: async (userData) => {
        const { users } = get();
        
        // Verificar se email já existe
        if (userData.email && users.some(u => u.email === userData.email)) {
          throw new Error('Este email já está cadastrado');
        }

        const newUser: UserProfile = {
          id: Date.now().toString(),
          name: userData.name || '',
          email: userData.email || '',
          avatar: userData.avatar || '',
          phone: userData.phone || '',
          address: userData.address || '',
          gamePreferences: userData.gamePreferences || [],
          purchaseHistory: [],
          registrationMethod: userData.registrationMethod || 'email',
          createdAt: new Date(),
          totalSpent: 0,
          favoriteCategories: [],
          loyaltyPoints: 100, // Pontos de boas-vindas
          preferences: {
            budget: userData.preferences?.budget || '',
            usage: userData.preferences?.usage || '',
            experience: userData.preferences?.experience || '',
            notifications: true,
            newsletter: true,
          }
        };

        set(state => ({
          users: [...state.users, newUser],
          currentUser: newUser,
          isLoggedIn: true
        }));

        return newUser;
      },

      updateProfile: (updates) => {
        const { currentUser, users } = get();
        if (!currentUser) return;

        const updatedUser = { ...currentUser, ...updates };
        const updatedUsers = users.map(u => 
          u.id === currentUser.id ? updatedUser : u
        );

        set({
          currentUser: updatedUser,
          users: updatedUsers
        });
      },

      addPurchase: (purchase) => {
        const { currentUser } = get();
        if (!currentUser) return;

        const updatedUser = {
          ...currentUser,
          purchaseHistory: [...currentUser.purchaseHistory, purchase],
          totalSpent: currentUser.totalSpent + purchase.total,
          loyaltyPoints: currentUser.loyaltyPoints + Math.floor(purchase.total / 1000) // 1 ponto por 1000 MT
        };

        get().updateProfile(updatedUser);
      },

      checkEmailExists: (email) => {
        const { users } = get();
        return users.some(u => u.email === email);
      },

      getUserByEmail: (email) => {
        const { users } = get();
        return users.find(u => u.email === email) || null;
      }
    }),
    {
      name: 'rhulany-tech-users',
      partialize: (state) => ({
        users: state.users,
        currentUser: state.currentUser,
        isLoggedIn: state.isLoggedIn
      })
    }
  )
);