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
  phone?: string;
  passwordHash?: string;
  /** Last delivery address, filled in at checkout or on the account page. */
  savedAddress?: SavedAddress;
}

interface Registration {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

interface UserStore {
  currentUser: UserProfile | null;
  users: UserProfile[];
  isLoggedIn: boolean;
  logout: () => void;
  register: (registration: Registration) => Promise<UserProfile>;
  signIn: (email: string, password: string) => Promise<UserProfile>;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [],
      isLoggedIn: false,

      logout: () => set({ currentUser: null, isLoggedIn: false }),

      register: async ({ name, email: rawEmail, phone, password }) => {
        const email = rawEmail.trim().toLowerCase();
        if (get().users.some((u) => u.email.toLowerCase() === email)) {
          throw new Error('Já existe uma conta com este email');
        }

        const newUser: UserProfile = {
          id: Date.now().toString(),
          name,
          email,
          phone: phone || '',
          passwordHash: await digest(email, password),
        };

        set((state) => ({
          users: [...state.users, newUser],
          currentUser: newUser,
          isLoggedIn: true,
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
        set({
          currentUser: updatedUser,
          users: users.map((u) => (u.id === currentUser.id ? updatedUser : u)),
        });
      },
    }),
    {
      name: 'rhulany-tech-users',
      partialize: (state) => ({
        users: state.users,
        currentUser: state.currentUser,
        isLoggedIn: state.isLoggedIn,
      }),
    },
  ),
);
