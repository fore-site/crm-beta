import React from 'react';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    BarChart,
    Bar,
    Legend,
} from 'recharts';

const visitsData = [
    { date: '2025-10-01', visits: 420 },
    { date: '2025-10-02', visits: 512 },
    { date: '2025-10-03', visits: 389 },
    { date: '2025-10-04', visits: 610 },
    { date: '2025-10-05', visits: 720 },
    { date: '2025-10-06', visits: 680 },
    { date: '2025-10-07', visits: 750 },
];

const revenueData = [
    { source: 'Organic', revenue: 4200 },
    { source: 'Ads', revenue: 8200 },
    { source: 'Referrals', revenue: 3100 },
    { source: 'Email', revenue: 2700 },
];

export default function AnalyticsPage() {
    return (
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Analytics
            </h2>
            <p className="text-sm text-gray-500 mb-6">
                Interactive charts powered by Recharts. Data shown is
                sample/demo data.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-4 bg-neutral-50 rounded-lg h-72">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Site Visits (last 7 days)
                    </h3>
                    <ResponsiveContainer width="100%" height={160}>
                        <LineChart
                            data={visitsData}
                            margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#F3F4F6"
                            />
                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="visits"
                                stroke="#0EA5A3"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="p-4 bg-neutral-50 rounded-lg h-72">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Revenue by Channel
                    </h3>
                    <ResponsiveContainer width="100%" height={160}>
                        <BarChart
                            data={revenueData}
                            margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#F3F4F6"
                            />
                            <XAxis dataKey="source" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="revenue" fill="#2563EB" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
