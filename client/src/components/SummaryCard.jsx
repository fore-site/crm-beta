import React from 'react';

export default function SummaryCard({ title, count, description, onClick }) {
    return (
        <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-sm font-semibold text-gray-700">{title}</h4>
                    <p className="text-3xl font-extrabold text-gray-900 mt-2">{count}</p>
                </div>
                <div>
                    <button
                        onClick={onClick}
                        className="text-sm text-emerald-600 hover:text-emerald-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-200 rounded"
                    >
                        View
                    </button>
                </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">{description}</p>
        </div>
    );
}
