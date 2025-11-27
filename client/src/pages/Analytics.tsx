import React, { useContext, useMemo } from 'react';
import { AppContext } from '../App';
import Card from '../components/ui/Card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, Legend, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { AdvertChannel, AdvertStatus } from '../types';

// Palette: Deep Purple, Bright Green, Lavender, Darker Green
const COLORS = ['#4B2E83', '#2ECC71', '#E6E6FA', '#27AE60'];
// Dark mode palette
const DARK_COLORS = ['#6544a3', '#58d68d', '#a78bfa', '#2ecc71'];


const PieChartTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white dark:bg-[#1e1b2e] p-3 border border-slate-100 dark:border-white/5 rounded-2xl shadow-xl text-sm">
        <p className="font-bold text-slate-900 dark:text-white mb-1">{data.name}</p>
        <p className="text-slate-500 dark:text-slate-400">Value: {data.value}</p>
        <p className="text-primary dark:text-accent font-bold">{(data.percent * 100).toFixed(1)}%</p>
      </div>
    );
  }
  return null;
};

const MultiDataTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#1e1b2e] p-3 border border-slate-100 dark:border-white/5 rounded-2xl shadow-xl text-sm">
        <p className="font-bold text-slate-900 dark:text-white mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }} className="font-bold">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AnalyticsPage: React.FC = () => {
  const { clients, adverts, theme } = useContext(AppContext);

  const tickColor = theme === 'dark' ? '#94a3b8' : '#64748b';
  const gridColor = theme === 'dark' ? '#334155' : '#e2e8f0';
  const chartColors = theme === 'dark' ? DARK_COLORS : COLORS;

  const advertChannelData = useMemo(() => {
    const counts = adverts.reduce((acc, ad) => {
      acc[ad.channel] = (acc[ad.channel] || 0) + 1;
      return acc;
    }, {} as Record<AdvertChannel, number>);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [adverts]);

  const advertStatusData = useMemo(() => {
    const counts = adverts.reduce((acc, ad) => {
      acc[ad.status] = (acc[ad.status] || 0) + 1;
      return acc;
    }, {} as Record<AdvertStatus, number>);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [adverts]);

  const activityByMonthData = useMemo(() => {
    const data: { [key: string]: { clients: number, adverts: number } } = {};
    [...clients, ...adverts].forEach(item => {
        const month = new Date(item.createdAt).toLocaleString('default', { month: 'short', year: '2-digit' });
        if (!data[month]) data[month] = { clients: 0, adverts: 0 };
        if ('company' in item) data[month].clients++;
        else data[month].adverts++;
    });

    return Object.entries(data).map(([name, values]) => ({ name, ...values })).sort((a,b) => new Date(a.name).getTime() - new Date(b.name).getTime());
  }, [clients, adverts]);
  
  const advertPerformanceData = useMemo(() => {
    const data: {[key: string]: {sent: number, scheduled: number}} = {};
    adverts.forEach(ad => {
        const day = new Date(ad.createdAt).toLocaleString('default', { weekday: 'short' });
        if (!data[day]) data[day] = { sent: 0, scheduled: 0 };
        if (ad.status === 'Sent') data[day].sent++;
        if (ad.status === 'Scheduled') data[day].scheduled++;
    });
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return weekdays.map(day => ({ day, ... (data[day] || {sent: 0, scheduled: 0})}));

  }, [adverts]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div className="animate-fade-in">
        <h1 className="text-4xl font-extrabold text-primary dark:text-white tracking-tight">Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Deep dive into your performance metrics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-8 animate-slide-in animation-delay-100 opacity-0 fill-mode-forwards">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8">Advert Channels</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={advertChannelData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={60} stroke="none">
                {advertChannelData.map((_, index: number) => <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />)}
              </Pie>
              <Tooltip content={<PieChartTooltip />} />
              <Legend wrapperStyle={{ color: tickColor, paddingTop: '20px' }} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-8 animate-slide-in animation-delay-200 opacity-0 fill-mode-forwards">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8">Advert Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={advertStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} stroke="none" cornerRadius={8}>
                 {advertStatusData.map((_, index: number) => <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />)}
              </Pie>
              <Tooltip content={<PieChartTooltip />} />
               <Legend wrapperStyle={{ color: tickColor, paddingTop: '20px' }} iconType="circle"/>
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
      
      <Card className="p-8 animate-slide-in animation-delay-300 opacity-0 fill-mode-forwards">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8">Monthly Activity</h2>
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={activityByMonthData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false}/>
                <XAxis dataKey="name" stroke={tickColor} axisLine={false} tickLine={false} dy={10} style={{ fontWeight: '600' }}/>
                <YAxis stroke={tickColor} axisLine={false} tickLine={false} dx={-10}/>
                <Tooltip cursor={{ fill: 'rgba(75, 46, 131, 0.05)' }} content={<MultiDataTooltip />} />
                <Legend wrapperStyle={{ color: tickColor, paddingTop: '20px' }} iconType="circle"/>
                <Bar dataKey="clients" fill={chartColors[0]} name="New Clients" radius={[8, 8, 0, 0]} barSize={40}/>
                <Bar dataKey="adverts" fill={chartColors[1]} name="Adverts Created" radius={[8, 8, 0, 0]} barSize={40}/>
            </BarChart>
        </ResponsiveContainer>
      </Card>
      
       <Card className="p-8 animate-slide-in animation-delay-400 opacity-0 fill-mode-forwards">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8">Advert Performance by Day</h2>
        <ResponsiveContainer width="100%" height={400}>
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={advertPerformanceData}>
                <PolarGrid stroke={gridColor} />
                <PolarAngleAxis dataKey="day" stroke={tickColor} tick={{ fill: tickColor, fontWeight: '600' }} />
                <PolarRadiusAxis stroke={tickColor} angle={30} domain={[0, 'auto']} />
                <Tooltip content={<MultiDataTooltip />} />
                <Legend wrapperStyle={{ color: tickColor, paddingTop: '20px' }} iconType="circle"/>
                <Radar name="Sent" dataKey="sent" stroke={chartColors[0]} fill={chartColors[0]} fillOpacity={0.4} />
                <Radar name="Scheduled" dataKey="scheduled" stroke={chartColors[1]} fill={chartColors[1]} fillOpacity={0.4} />
            </RadarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default AnalyticsPage;