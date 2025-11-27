
import React, { useContext, useMemo, useState, lazy, Suspense } from 'react';
import { AppContext } from '../App';
import Card from '../components/ui/Card';
import { Advert, ChartData, ViewType } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import AdvertCard from '../components/adverts/AdvertCard';
import AdvertListItem from '../components/adverts/AdvertListItem';
import Modal from '../components/ui/Modal';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const AdvertDetailView = lazy(() => import('../components/adverts/AdvertDetailView'));

// Clean, white StatCard design
const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactElement<{ className?: string }>; onClick?: () => void; delay?: string }> = ({ title, value, icon, onClick, delay = '' }) => (
  <Card className={`p-6 flex flex-col justify-between h-full group animate-fade-in opacity-0 fill-mode-forwards ${delay}`} onClick={onClick}>
    <div className="flex justify-between items-start mb-4">
        {/* Icon Container - Primary Color */}
        <div className="p-3 bg-primary/10 rounded-2xl text-primary transition-colors">
            {React.cloneElement(icon, { className: "w-6 h-6" })}
        </div>
        
        {onClick && (
             <div className="text-slate-300 group-hover:text-primary transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </div>
        )}
    </div>
    
    <div>
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide">{title}</h3>
        <p className="text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">{value}</p>
    </div>

    <div className="mt-4 pt-4 border-t border-slate-100">
        <p className="text-xs font-medium text-slate-400">
            As of {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
    </div>
  </Card>
);

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string | number }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-slate-100 rounded-2xl shadow-xl">
        <p className="font-bold text-slate-900 mb-1">{label}</p>
        <p className="text-primary font-bold">{`Value: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const Dashboard: React.FC = () => {
  const { clients, adverts, convertCurrency, navigateTo } = useContext(AppContext);
  const [advertView, setAdvertView] = useState<ViewType>('grid');
  const [selectedAdvert, setSelectedAdvert] = useState<Advert | null>(null);
  
  const tickColor = '#94a3b8';
  const gridColor = '#f1f5f9';

  const totalAdSpend = useMemo(() => {
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
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 animate-fade-in">
        <div>
            <h1 className="text-4xl font-extrabold text-primary tracking-tight">Dashboard</h1>
            <p className="text-slate-500 mt-2 text-lg">Overview of your campaign performance.</p>
        </div>
        <div className="text-sm font-bold text-primary bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Clients" value={clients.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} onClick={() => navigateTo({ page: 'Clients' })} delay="animation-delay-75" />
        <StatCard title="Total Adverts" value={adverts.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} onClick={() => navigateTo({ page: 'Adverts' })} delay="animation-delay-150" />
        <StatCard title="Total Ad Spend" value={convertCurrency(totalAdSpend)} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>} onClick={() => navigateTo({ page: 'Analytics' })} delay="animation-delay-200" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3 p-8 animate-slide-in animation-delay-300 opacity-0 fill-mode-forwards">
          <h2 className="text-xl font-bold text-slate-900 mb-8">Client Growth</h2>
           <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={clientGrowthData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                        <XAxis dataKey="name" stroke={tickColor} axisLine={false} tickLine={false} dy={10} />
                        <YAxis stroke={tickColor} axisLine={false} tickLine={false} dx={-10} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey="clients" stroke="#4B2E83" strokeWidth={4} dot={{ r: 4, fill: '#4B2E83', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8, fill: '#2ECC71' }} />
                    </LineChart>
                </ResponsiveContainer>
           </div>
        </Card>
        <Card className="lg:col-span-2 p-8 animate-slide-in animation-delay-400 opacity-0 fill-mode-forwards">
          <h2 className="text-xl font-bold text-slate-900 mb-8">Advert Status</h2>
           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={advertStatusData} layout="vertical" margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor}/>
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} stroke={tickColor} width={80} style={{ fontSize: '12px', fontWeight: '500' }}/>
                      <Tooltip cursor={{fill: 'transparent'}} content={<CustomTooltip />}/>
                      <Bar dataKey="value" fill="#2ECC71" barSize={32} radius={[0, 8, 8, 0]} />
                  </BarChart>
              </ResponsiveContainer>
           </div>
        </Card>
      </div>

      <div className="animate-slide-in animation-delay-500 opacity-0 fill-mode-forwards">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Recent Adverts</h2>
          <div className="flex items-center p-1 bg-white rounded-xl shadow-sm border border-slate-100">
              <button onClick={() => setAdvertView('grid')} className={`p-2 rounded-lg transition-all ${advertView === 'grid' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg></button>
              <button onClick={() => setAdvertView('list')} className={`p-2 rounded-lg transition-all ${advertView === 'list' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg></button>
          </div>
        </div>
        {advertView === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {recentAdverts.map(advert => <AdvertCard key={advert.id} advert={advert} onClick={handleOpenAdvertModal} />)}
          </div>
        ) : (
          <Card className="overflow-hidden p-0">
            <div className="divide-y divide-slate-100">
              {recentAdverts.map(advert => <AdvertListItem key={advert.id} advert={advert} onClick={handleOpenAdvertModal} />)}
            </div>
          </Card>
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