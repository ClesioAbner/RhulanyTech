import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Accounts live on this device until a server is connected. Passwords are never stored in clear:
// only a SHA-256 digest of the email and password.
const digest = async (email: string, password: string) => {
  const data = new TextEncoder().encode(`rhulany:${email.trim().toLowerCase()}:${password}`);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
};

export interface SavedAddress {
  province: string;
  city: string;
  neighbourhood: string;
  street: string;
  reference: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone?: string;
  address?: string;
  passwordHash?: string;
  savedAddress?: SavedAddress;
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
  register: (userData: Partial<UserProfile> & { password?: string }) => Promise<UserProfile>;
  signIn: (email: string, password: string) => Promise<UserProfile>;
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
        const email = (userData.email || '').trim().toLowerCase();
        if (email && users.some((u) => u.email.toLowerCase() === email)) {
          throw new Error('Já existe uma conta com este email');
        }

        const newUser: UserProfile = {
          id: Date.now().toString(),
          name: userData.name || '',
          email,
          passwordHash: userData.password ? await digest(email, userData.password) : undefined,
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

      signIn: async (email, password) => {
        const { users } = get();
        const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
        if (!user) throw new Error('Não encontrámos uma conta com este email');
        const hash = await digest(email, password);
        // Accounts created before passwords existed take the first password used.
        if (user.passwordHash && user.passwordHash !== hash) throw new Error('A palavra-passe não está correcta');
        const signedIn = user.passwordHash ? user : { ...user, passwordHash: hash };
        set({
          currentUser: signedIn,
          isLoggedIn: true,
          users: users.map((u) => (u.id === signedIn.id ? signedIn : u)),
        });
        return signedIn;
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