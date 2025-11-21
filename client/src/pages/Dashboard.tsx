
import React, { useContext, useMemo, useState, lazy, Suspense } from 'react';
import { AppContext } from '../App';
import Card from '../components/ui/Card';
import { Advert, ChartData, ViewType } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend, CartesianGrid } from 'recharts';
import AdvertCard from '../components/adverts/AdvertCard';
import AdvertListItem from '../components/adverts/AdvertListItem';
import Modal from '../components/ui/Modal';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const AdvertDetailView = lazy(() => import('../components/adverts/AdvertDetailView'));

// Fix: Replaced JSX.Element with React.ReactElement to resolve namespace issue.
const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactElement; color: string; onClick?: () => void }> = ({ title, value, icon, color, onClick }) => (
  <Card className="p-6 flex items-center" onClick={onClick}>
    <div className={`p-3 rounded-full mr-4 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
    </div>
  </Card>
);

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string | number }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm p-2 border border-slate-200 dark:border-slate-600 rounded-lg shadow-sm">
        <p className="font-bold text-slate-800 dark:text-slate-100">{label}</p>
        <p className="text-primary dark:text-indigo-400">{`Value: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const Dashboard: React.FC = () => {
  const { clients, adverts, convertCurrency, navigateTo, theme } = useContext(AppContext);
  const [advertView, setAdvertView] = useState<ViewType>('grid');
  const [selectedAdvert, setSelectedAdvert] = useState<Advert | null>(null);
  
  const tickColor = theme === 'dark' ? '#94a3b8' : '#6b7280';
  const gridColor = theme === 'dark' ? '#334155' : '#e5e7eb';

  const totalAdSpend = useMemo(() => {
    // Mock ad spend for demonstration
    return adverts.length * 150;
  }, [adverts]);

  const advertStatusData: ChartData[] = useMemo(() => {
    const counts = adverts.reduce((acc, ad) => {
      acc[ad.status] = (acc[ad.status] || 0) + 1;
      return acc;
    }, {} as Record<Advert['status'], number>);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [adverts]);

  const clientGrowthData = useMemo(() => {
    const sortedClients = [...clients].sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    const data: {name: string; clients: number}[] = [];
    let cumulativeClients = 0;
    const monthMap = new Map<string, number>();

    sortedClients.forEach(client => {
      const month = new Date(client.createdAt).toLocaleString('default', { month: 'short', year: '2-digit' });
      monthMap.set(month, (monthMap.get(month) || 0) + 1);
    });
    
    // Create cumulative data
    const sortedMonths = Array.from(monthMap.keys()).sort((a, b) => {
        const [aMon, aYr] = a.split(' ');
        const [bMon, bYr] = b.split(' ');
        if (aYr !== bYr) return parseInt(aYr, 10) - parseInt(bYr, 10);
        return new Date(Date.parse(aMon +" 1, 2012")).getMonth() - new Date(Date.parse(bMon +" 1, 2012")).getMonth();
    });

    sortedMonths.forEach(month => {
      cumulativeClients += monthMap.get(month) || 0;
      data.push({ name: month, clients: cumulativeClients });
    });

    return data;
  }, [clients]);

  const recentAdverts = adverts.slice(0, 4);
  
  const handleOpenAdvertModal = (advert: Advert) => {
    setSelectedAdvert(advert);
  };
  
  const handleCloseAdvertModal = () => {
    setSelectedAdvert(null);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Clients" value={clients.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} color="bg-blue-500" onClick={() => navigateTo({ page: 'Clients' })} />
        <StatCard title="Total Adverts" value={adverts.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} color="bg-green-500" onClick={() => navigateTo({ page: 'Adverts' })} />
        <StatCard title="Total Ad Spend" value={convertCurrency(totalAdSpend)} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>} color="bg-purple-500" onClick={() => navigateTo({ page: 'Analytics' })} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3 p-4">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Client Growth</h2>
           <ResponsiveContainer width="100%" height={300}>
                <LineChart data={clientGrowthData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="name" stroke={tickColor} />
                    <YAxis stroke={tickColor} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="clients" stroke="#4F46E5" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </Card>
        <Card className="lg:col-span-2 p-4">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Advert Status</h2>
          <ResponsiveContainer width="100%" height={300}>
              <BarChart data={advertStatusData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor}/>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} stroke={tickColor}/>
                  <Tooltip cursor={{fill: 'rgba(71, 85, 105, 0.2)'}} content={<CustomTooltip />}/>
                  <Bar dataKey="value" fill="#4F46E5" barSize={20} radius={[0, 10, 10, 0]} />
              </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Recent Adverts</h2>
          <div className="flex items-center space-x-2 p-1 bg-slate-200 dark:bg-slate-700 rounded-lg">
              <button onClick={() => setAdvertView('grid')} className={`px-3 py-1 text-sm rounded-md ${advertView === 'grid' ? 'bg-white dark:bg-slate-800 shadow' : ''}`}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg></button>
              <button onClick={() => setAdvertView('list')} className={`px-3 py-1 text-sm rounded-md ${advertView === 'list' ? 'bg-white dark:bg-slate-800 shadow' : ''}`}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg></button>
          </div>
        </div>
        {advertView === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {recentAdverts.map(advert => <AdvertCard key={advert.id} advert={advert} onClick={handleOpenAdvertModal} />)}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-none dark:border dark:border-slate-700 overflow-hidden">
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {recentAdverts.map(advert => <AdvertListItem key={advert.id} advert={advert} onClick={handleOpenAdvertModal} />)}
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={!!selectedAdvert} onClose={handleCloseAdvertModal} title={selectedAdvert?.title || 'Advert Details'}>
        <Suspense fallback={<div className="p-8"><LoadingSpinner /></div>}>
          {selectedAdvert && <AdvertDetailView advert={selectedAdvert} />}
        </Suspense>
      </Modal>
    </div>
  );
};

export default Dashboard;
