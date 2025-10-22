import React from 'react';

export default function AnalyticsPage() {
    return (
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Analytics (Placeholder)
            </h2>
            <p className="text-sm text-gray-500 mb-6">
                This is a placeholder for interactive charts (Recharts can be
                added later).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-neutral-50 rounded-lg h-60 flex items-center justify-center">
                    Chart A Placeholder
                </div>
                <div className="p-4 bg-neutral-50 rounded-lg h-60 flex items-center justify-center">
                    Chart B Placeholder
                </div>
            </div>
        </div>
    );
}
