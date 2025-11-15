import React, { useContext, useMemo } from 'react';
import { AppContext } from '../App';
import Card from '../components/ui/Card';
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Legend,
    CartesianGrid,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
} from 'recharts';
import { AdvertChannel, AdvertStatus } from '../types';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-2 border border-gray-200 rounded-lg shadow-sm">
                <p className="font-bold">{`${payload[0].name} : ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

const AnalyticsPage: React.FC = () => {
    const { clients, adverts } = useContext(AppContext);

    const advertChannelData = useMemo(() => {
        const counts = adverts.reduce((acc: any, ad: any) => {
            acc[ad.channel] = (acc[ad.channel] || 0) + 1;
            return acc;
        }, {} as Record<AdvertChannel, number>);
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [adverts]);

    const advertStatusData = useMemo(() => {
        const counts = adverts.reduce((acc: any, ad: any) => {
            acc[ad.status] = (acc[ad.status] || 0) + 1;
            return acc;
        }, {} as Record<AdvertStatus, number>);
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [adverts]);

    const activityByMonthData = useMemo(() => {
        const data: { [key: string]: { clients: number; adverts: number } } =
            {};
        [...clients, ...adverts].forEach((item) => {
            const month = new Date(item.createdAt).toLocaleString('default', {
                month: 'short',
                year: '2-digit',
            });
            if (!data[month]) data[month] = { clients: 0, adverts: 0 };
            if ('company' in item) data[month].clients++;
            else data[month].adverts++;
        });

        return Object.entries(data)
            .map(([name, values]) => ({ name, ...values }))
            .sort(
                (a, b) =>
                    new Date(a.name).getTime() - new Date(b.name).getTime()
            );
    }, [clients, adverts]);

    const advertPerformanceData = useMemo(() => {
        const data: { [key: string]: { sent: number; scheduled: number } } = {};
        adverts.forEach((ad: any) => {
            const day = new Date(ad.createdAt).toLocaleString('default', {
                weekday: 'short',
            });
            if (!data[day]) data[day] = { sent: 0, scheduled: 0 };
            if (ad.status === 'Sent') data[day].sent++;
            if (ad.status === 'Scheduled') data[day].scheduled++;
        });
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return weekdays.map((day) => ({
            day,
            ...(data[day] || { sent: 0, scheduled: 0 }),
        }));
    }, [adverts]);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Advert Channels
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={advertChannelData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                            >
                                {advertChannelData.map((_, index: number) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
                <Card className="p-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Advert Status Distribution
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={advertStatusData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                label
                            >
                                {advertStatusData.map((_, index: number) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            <Card className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Monthly Activity (New Clients vs Adverts)
                </h2>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={activityByMonthData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                            dataKey="clients"
                            fill="#4F46E5"
                            name="New Clients"
                        />
                        <Bar
                            dataKey="adverts"
                            fill="#10B981"
                            name="Adverts Created"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            <Card className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Advert Performance by Day
                </h2>
                <ResponsiveContainer width="100%" height={400}>
                    <RadarChart
                        cx="50%"
                        cy="50%"
                        outerRadius="80%"
                        data={advertPerformanceData}
                    >
                        <PolarGrid />
                        <PolarAngleAxis dataKey="day" />
                        <PolarRadiusAxis />
                        <Tooltip />
                        <Legend />
                        <Radar
                            name="Sent"
                            dataKey="sent"
                            stroke="#4F46E5"
                            fill="#4F46E5"
                            fillOpacity={0.6}
                        />
                        <Radar
                            name="Scheduled"
                            dataKey="scheduled"
                            stroke="#10B981"
                            fill="#10B981"
                            fillOpacity={0.6}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
};

export default AnalyticsPage;
