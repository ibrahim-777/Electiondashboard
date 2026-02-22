import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface PagePermission {
  id: string;
  name: string;
  path: string;
  enabled: boolean;
}

export interface UserAccount {
  id: string;
  username: string;
  password: string;
  name: string;
  role: string;
  permissions: string[]; // Array of page IDs that user can access
  createdAt: string;
}

interface AuthContextType {
  currentUser: UserAccount | null;
  accounts: UserAccount[];
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addAccount: (account: Omit<UserAccount, 'id' | 'createdAt'>) => void;
  updateAccount: (id: string, account: Partial<UserAccount>) => void;
  deleteAccount: (id: string) => void;
  hasPermission: (pageId: string) => boolean;
  availablePages: PagePermission[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AVAILABLE_PAGES: PagePermission[] = [
  { id: 'dashboard', name: 'لوحة النتائج', path: '/', enabled: true },
  { id: 'counting-results', name: 'نتائج الفرز', path: '/counting-results', enabled: true },
  { id: 'voters', name: 'متابعة الإقتراع', path: '/voters', enabled: true },
  { id: 'edit', name: 'إدخال الأصوات', path: '/edit', enabled: true },
  { id: 'manage', name: 'إدارة القوائم', path: '/manage', enabled: true },
  { id: 'mandubin', name: 'إدارة المندوبين', path: '/mandubin', enabled: true },
  { id: 'mandubin-tracking', name: 'متابعة المندوبين', path: '/mandubin-tracking', enabled: true },
  { id: 'cars', name: 'إدارة السيارات', path: '/cars', enabled: true },
  { id: 'voter-data', name: 'بيانات الناخبين', path: '/voter-data', enabled: true },
  { id: 'green-list', name: 'القائمة الخضراء', path: '/green-list', enabled: true },
  { id: 'accounts', name: 'إدارة الحسابات', path: '/accounts', enabled: true },
];

const DEFAULT_ACCOUNTS: UserAccount[] = [
  {
    id: '1',
    username: 'hajarwbashar',
    password: '051220219',
    name: 'المسؤول الرئيسي',
    role: 'مدير النظام',
    permissions: AVAILABLE_PAGES.map(p => p.id), // Full access
    createdAt: new Date().toISOString(),
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [accounts, setAccounts] = useState<UserAccount[]>(() => {
    const stored = localStorage.getItem('userAccounts');
    return stored ? JSON.parse(stored) : DEFAULT_ACCOUNTS;
  });

  useEffect(() => {
    localStorage.setItem('userAccounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      // Find the account to get latest permissions
      const account = accounts.find(acc => acc.id === user.id);
      if (account) {
        setCurrentUser(account);
      }
    }
  }, [accounts]);

  const login = (username: string, password: string): boolean => {
    const account = accounts.find(
      acc => acc.username === username && acc.password === password
    );
    
    if (account) {
      setCurrentUser(account);
      localStorage.setItem('currentUser', JSON.stringify(account));
      localStorage.setItem('isAuthenticated', 'true');
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
  };

  const addAccount = (accountData: Omit<UserAccount, 'id' | 'createdAt'>) => {
    const newAccount: UserAccount = {
      ...accountData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setAccounts([...accounts, newAccount]);
  };

  const updateAccount = (id: string, accountData: Partial<UserAccount>) => {
    setAccounts(accounts.map(acc => 
      acc.id === id ? { ...acc, ...accountData } : acc
    ));
  };

  const deleteAccount = (id: string) => {
    // Prevent deleting the main admin account
    if (id === '1') return;
    setAccounts(accounts.filter(acc => acc.id !== id));
  };

  const hasPermission = (pageId: string): boolean => {
    if (!currentUser) return false;
    return currentUser.permissions.includes(pageId);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        accounts,
        login,
        logout,
        addAccount,
        updateAccount,
        deleteAccount,
        hasPermission,
        availablePages: AVAILABLE_PAGES,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
