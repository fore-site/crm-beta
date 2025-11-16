
import React, { useState, useCallback, useEffect } from 'react';
import { Page, Client, Advert, Currency, Notification, Theme } from './types';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import ClientsPage from './pages/Clients';
import AdvertsPage from './pages/Adverts';
import AnalyticsPage from './pages/Analytics';
import { NGN_TO_USD_RATE } from './constants';
import NotificationContainer from './components/ui/NotificationContainer';

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
  setCurrentPage: (page: Page) => void;
  theme: Theme;
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
  setCurrentPage: () => {},
  theme: 'light',
  toggleTheme: () => {},
});

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('Dashboard');
  const [clients, setClients] = useState<Client[]>([]);
  const [adverts, setAdverts] = useState<Advert[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

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

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  const addClient = (clientData: Omit<Client, 'id' | 'createdAt' | 'avatarUrl'>) => {
    const newClient: Client = {
      ...clientData,
      id: `client-${Date.now()}`,
      createdAt: new Date().toISOString(),
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${clientData.name}`,
    };
    setClients(prev => [newClient, ...prev]);
    addNotification('Client added successfully!', 'success');
  };
  
  const updateClient = (updatedClient: Client) => {
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
    addNotification('Client updated successfully!', 'success');
  };

  const addAdvert = (advertData: Omit<Advert, 'id' | 'createdAt'>) => {
    const newAdvert: Advert = {
      ...advertData,
      id: `advert-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setAdverts(prev => [newAdvert, ...prev]);
    const message = advertData.status === 'Draft' ? 'Advert saved to drafts!' : advertData.status === 'Scheduled' ? 'Advert scheduled successfully!' : 'Advert sent successfully!';
    addNotification(message, 'success');
  };

  const updateAdvert = (updatedAdvert: Advert) => {
    setAdverts(prev => prev.map(a => a.id === updatedAdvert.id ? updatedAdvert : a));
    addNotification('Advert updated successfully!', 'success');
  };

  const deleteAdvert = (advertId: string) => {
    setAdverts(prev => prev.filter(a => a.id !== advertId));
    addNotification('Advert deleted successfully!', 'info');
  };

  const convertCurrency = (amount: number) => {
    if (currency === 'NGN') {
      return `₦${(amount / NGN_TO_USD_RATE).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  
  const renderPage = () => {
    switch (currentPage) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Clients':
        return <ClientsPage />;
      case 'Adverts':
        return <AdvertsPage />;
      case 'Analytics':
        return <AnalyticsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppContext.Provider value={{ clients, adverts, addClient, updateClient, addAdvert, updateAdvert, deleteAdvert, addNotification, currency, setCurrency, convertCurrency, setCurrentPage, theme, toggleTheme }}>
      <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
        <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
          {renderPage()}
        </Layout>
        <NotificationContainer notifications={notifications} removeNotification={removeNotification} />
      </div>
    </AppContext.Provider>
  );
};

export default App;