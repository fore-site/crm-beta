
import React, { useState, useCallback, useEffect, lazy, Suspense, useMemo } from 'react';
import { Page, Client, Advert, Currency, Notification, NavigationState } from './types';
import Layout from './components/layout/Layout';
import NotificationContainer from './components/ui/NotificationContainer';
import { NGN_TO_USD_RATE } from './constants';
import LoadingSpinner from './components/ui/LoadingSpinner';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const ClientsPage = lazy(() => import('./pages/Clients'));
const AdvertsPage = lazy(() => import('./pages/Adverts'));
const AnalyticsPage = lazy(() => import('./pages/Analytics'));


export const AppContext = React.createContext<{
  clients: Client[];
  adverts: Advert[];
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'avatarUrl'>) => void;
  updateClient: (client: Client) => void;
  addAdvert: (advert: Omit<Advert, 'id' | 'createdAt'>) => void;
  updateAdvert: (advert: Advert) => void;
  deleteAdvert: (advertId: string) => void;
  addNotification: (message: string, type: Notification['type']) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convertCurrency: (amount: number) => string;
  navigateTo: (state: NavigationState) => void;
  handleBack: () => void;
  navigationHistory: NavigationState[];
  currentPage: Page;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}>({
  clients: [],
  adverts: [],
  addClient: () => {},
  updateClient: () => {},
  addAdvert: () => {},
  updateAdvert: () => {},
  deleteAdvert: () => {},
  addNotification: () => {},
  currency: 'USD',
  setCurrency: () => {},
  convertCurrency: () => '',
  navigateTo: () => {},
  handleBack: () => {},
  navigationHistory: [],
  currentPage: 'Dashboard',
  isSidebarCollapsed: false,
  toggleSidebar: () => {},
  theme: 'light',
  toggleTheme: () => {},
});

const App: React.FC = () => {
  const [navigationHistory, setNavigationHistory] = useState<NavigationState[]>(() => {
    try {
      const savedHistory = localStorage.getItem('navigationHistory');
      return savedHistory ? JSON.parse(savedHistory) : [{ page: 'Dashboard' }];
    } catch (error) {
      console.error('Failed to parse navigation history:', error);
      return [{ page: 'Dashboard' }];
    }
  });

  const [clients, setClients] = useState<Client[]>([]);
  const [adverts, setAdverts] = useState<Advert[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const currentState = navigationHistory[navigationHistory.length - 1];
  const currentPage = currentState.page;

  useEffect(() => {
    localStorage.setItem('navigationHistory', JSON.stringify(navigationHistory));
  }, [navigationHistory]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed(prev => !prev);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
        const newTheme = prev === 'light' ? 'dark' : 'light';
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        return newTheme;
    });
  }, []);

  const navigateTo = useCallback((state: NavigationState) => {
    setNavigationHistory(prev => {
        const lastState = prev[prev.length - 1];
        if (lastState.page === state.page && (lastState.detailId || null) === (state.detailId || null)) {
            return prev;
        }
        return [...prev, state];
    });
  }, []);

  const handleBack = useCallback(() => {
      setNavigationHistory(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  useEffect(() => {
    // Generate mock data on initial load
    const generateMockClients = () => {
      const mockClients: Client[] = Array.from({ length: 25 }, (_, i) => ({
        id: `client-${i + 1}`,
        name: `Client ${i + 1}`,
        email: `client${i + 1}@example.com`,
        phone: `+1-202-555-01${i < 10 ? '0' : ''}${i}`,
        company: `Company ${String.fromCharCode(65 + (i % 26))}`,
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${`Client ${i + 1}`}`,
        createdAt: new Date(Date.now() - (25 - i) * 24 * 60 * 60 * 1000).toISOString(),
      }));
      setClients(mockClients);
    };

    const generateMockAdverts = () => {
      const mockAdverts: Advert[] = [
        { id: 'ad-1', title: 'Summer Sale', message: 'Get 50% off!', channel: 'Email', status: 'Sent', scheduledAt: null, createdAt: new Date().toISOString(), imageUrl: 'https://picsum.photos/600/300' },
        { id: 'ad-2', title: 'New Product Launch', message: 'Check out our new gadget.', channel: 'SMS', status: 'Scheduled', scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'ad-3', title: 'Holiday Greetings', message: 'Happy holidays from us!', channel: 'Email', status: 'Draft', scheduledAt: null, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'ad-4', title: 'Flash Deal', message: 'Limited time offer!', channel: 'SMS', status: 'Sent', scheduledAt: null, createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
      ];
      setAdverts(mockAdverts);
    };

    generateMockClients();
    generateMockAdverts();
  }, []);

  const addNotification = useCallback((message: string, type: Notification['type']) => {
    const newNotification: Notification = {
      id: Date.now(),
      message,
      type,
    };
    setNotifications(prev => [...prev, newNotification]);
  }, []);

  const removeNotification = useCallback((id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);
  
  const addClient = useCallback((clientData: Omit<Client, 'id' | 'createdAt' | 'avatarUrl'>) => {
    const newClient: Client = {
      ...clientData,
      id: `client-${Date.now()}`,
      createdAt: new Date().toISOString(),
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${clientData.name}`,
    };
    setClients(prev => [newClient, ...prev]);
    addNotification('Client added successfully!', 'success');
  }, [addNotification]);
  
  const updateClient = useCallback((updatedClient: Client) => {
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
    addNotification('Client updated successfully!', 'success');
  }, [addNotification]);

  const addAdvert = useCallback((advertData: Omit<Advert, 'id' | 'createdAt'>) => {
    const newAdvert: Advert = {
      ...advertData,
      id: `advert-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setAdverts(prev => [newAdvert, ...prev]);
    const message = advertData.status === 'Draft' ? 'Advert saved to drafts!' : advertData.status === 'Scheduled' ? 'Advert scheduled successfully!' : 'Advert sent successfully!';
    addNotification(message, 'success');
  }, [addNotification]);

  const updateAdvert = useCallback((updatedAdvert: Advert) => {
    setAdverts(prev => prev.map(a => a.id === updatedAdvert.id ? updatedAdvert : a));
    addNotification('Advert updated successfully!', 'success');
  }, [addNotification]);

  const deleteAdvert = useCallback((advertId: string) => {
    setAdverts(prev => prev.filter(a => a.id !== advertId));
    addNotification('Advert deleted successfully!', 'info');
  }, [addNotification]);

  const convertCurrency = useCallback((amount: number) => {
    if (currency === 'NGN') {
      return `₦${(amount / NGN_TO_USD_RATE).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, [currency]);
  
  const renderPage = () => {
    const key = `${currentState.page}-${currentState.detailId || 'list'}`;
    switch (currentPage) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Clients':
        return <ClientsPage key={key} selectedClientId={currentState.detailId} />;
      case 'Adverts':
        return <AdvertsPage />;
      case 'Analytics':
        return <AnalyticsPage />;
      default:
        return <Dashboard />;
    }
  };

  const contextValue = useMemo(() => ({
    clients, adverts, addClient, updateClient, addAdvert, updateAdvert, deleteAdvert, addNotification, currency, setCurrency, convertCurrency, navigateTo, handleBack, navigationHistory, currentPage, isSidebarCollapsed, toggleSidebar, theme, toggleTheme
  }), [clients, adverts, addClient, updateClient, addAdvert, updateAdvert, deleteAdvert, addNotification, currency, convertCurrency, navigateTo, handleBack, navigationHistory, currentPage, isSidebarCollapsed, toggleSidebar, theme, toggleTheme]);

  return (
    <AppContext.Provider value={contextValue}>
      <div className="flex flex-col min-h-screen bg-transparent text-slate-800 font-sans selection:bg-indigo-500/20">
        <Layout>
          <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><LoadingSpinner /></div>}>
            {renderPage()}
          </Suspense>
        </Layout>
        <NotificationContainer notifications={notifications} removeNotification={removeNotification} />
      </div>
    </AppContext.Provider>
  );
};

export default App;
