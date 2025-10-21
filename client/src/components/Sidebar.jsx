import React from 'react';

export default function Sidebar({
    page,
    selectedContact,
    setPage,
    setSelectedContact,
    setIsModalOpen,
}) {
    return (
        <aside className="w-64 bg-white p-6 border-r border-gray-100 flex flex-col">
            <div className="flex items-center mb-6">
                <div className="h-10 w-10 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center font-semibold">RA</div>
                <div className="ml-3">
                    <h3 className="font-semibold text-gray-800">Roware Admin</h3>
                    <p className="text-xs text-gray-500">admin@roware.xyz</p>
                </div>
            </div>

            <nav className="flex-1">
                <ul className="space-y-2">
                    {[
                        { key: 'Dashboard', label: 'Dashboard' },
                        { key: 'Summary', label: 'Sales Center' },
                        { key: 'List', label: 'Contacts / Leads' },
                        { key: 'Campaigns', label: 'Campaigns' },
                    ].map((item) => (
                        <li key={item.key}>
                            <button
                                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                    page === item.key ? 'bg-emerald-50 font-semibold text-emerald-700' : 'hover:bg-gray-50 text-gray-700'
                                } focus:outline-none focus:ring-2 focus:ring-emerald-100`}
                                onClick={() => {
                                    setPage(item.key);
                                    setSelectedContact(null);
                                }}
                            >
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="mt-6">
                <button
                    className="w-full px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-colors"
                    onClick={() => setIsModalOpen(true)}
                >
                    New Contact
                </button>
            </div>
        </aside>
    );
}
