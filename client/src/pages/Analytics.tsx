
import React, { useContext, useMemo } from 'react';
import { AppContext } from '../App';
import Card from '../components/ui/Card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, Legend, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { AdvertChannel, AdvertStatus } from '../types';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];
const DARK_COLORS = ['#818cf8', '#34d399', '#f59e0b', '#f87171'];


// Custom tooltip for Pie charts that shows value and percentage
const PieChartTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm p-3 border border-slate-200 dark:border-slate-600 rounded-lg shadow-sm text-sm">
        <p className="font-bold text-slate-800 dark:text-slate-100 mb-1">{data.name}</p>
        <p className="text-slate-600 dark:text-slate-300">Value: {data.value}</p>
        <p className="text-slate-600 dark:text-slate-300">Percent: {(data.percent * 100).toFixed(1)}%</p>
      </div>
    );
  }
  return null;
};

// Custom tooltip for charts with multiple data series (Bar, Radar)
const MultiDataTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm p-3 border border-slate-200 dark:border-slate-600 rounded-lg shadow-sm text-sm">
        <p className="font-bold text-slate-800 dark:text-slate-100 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }} className="font-medium">
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

  const tickColor = theme === 'dark' ? '#94a3b8' : '#6b7280';
  const gridColor = theme === 'dark' ? '#334155' : '#e5e7eb';
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
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Advert Channels</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={advertChannelData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false}>
                {advertChannelData.map((_, index: number) => <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />)}
              </Pie>
              <Tooltip content={<PieChartTooltip />} />
              <Legend wrapperStyle={{ color: tickColor }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-4">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Advert Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={advertStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} labelLine={false}>
                 {advertStatusData.map((_, index: number) => <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />)}
              </Pie>
              <Tooltip content={<PieChartTooltip />} />
               <Legend wrapperStyle={{ color: tickColor }}/>
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
      
      <Card className="p-4">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Monthly Activity (New Clients vs Adverts)</h2>
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={activityByMonthData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor}/>
                <XAxis dataKey="name" stroke={tickColor}/>
                <YAxis stroke={tickColor}/>
                <Tooltip cursor={{ fill: 'rgba(71, 85, 105, 0.1)' }} content={<MultiDataTooltip />} />
                <Legend wrapperStyle={{ color: tickColor }}/>
                <Bar dataKey="clients" fill={chartColors[0]} name="New Clients"/>
                <Bar dataKey="adverts" fill={chartColors[1]} name="Adverts Created"/>
            </BarChart>
        </ResponsiveContainer>
      </Card>
      
       <Card className="p-4">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Advert Performance by Day</h2>
        <ResponsiveContainer width="100%" height={400}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={advertPerformanceData}>
                <PolarGrid stroke={gridColor}/>
                <PolarAngleAxis dataKey="day" stroke={tickColor}/>
                <PolarRadiusAxis stroke={tickColor}/>
                <Tooltip content={<MultiDataTooltip />} />
                <Legend wrapperStyle={{ color: tickColor }}/>
                <Radar name="Sent" dataKey="sent" stroke={chartColors[0]} fill={chartColors[0]} fillOpacity={0.6} />
                <Radar name="Scheduled" dataKey="scheduled" stroke={chartColors[1]} fill={chartColors[1]} fillOpacity={0.6} />
            </RadarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
