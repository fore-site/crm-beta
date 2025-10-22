import React, { useMemo, useState } from 'react';

export default function ClientsPage({ contacts = [], onOpenProfile }) {
    const [query, setQuery] = useState('');
    const [view, setView] = useState('cards'); // 'cards' | 'table'
    const [sortBy, setSortBy] = useState('name');

    const filtered = useMemo(() => {
        return contacts
            .filter(
                (c) =>
                    (c.name || '')
                        .toLowerCase()
                        .includes(query.toLowerCase()) ||
                    (c.email || '').toLowerCase().includes(query.toLowerCase())
            )
            .sort((a, b) => {
                if (sortBy === 'name')
                    return (a.name || '').localeCompare(b.name || '');
                if (sortBy === 'last')
                    return (b.lastContactDate || '').localeCompare(
                        a.lastContactDate || ''
                    );
                return 0;
            });
    }, [contacts, query, sortBy]);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold">
                        Contacts & Clients
                    </h1>
                    <p className="text-sm text-gray-500">
                        Search, sort, and manage contacts.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by name or email"
                        className="p-2 border border-gray-200 rounded-lg"
                    />
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="p-2 border rounded-lg"
                    >
                        <option value="name">Name</option>
                        <option value="last">Last Contacted</option>
                    </select>
                    <div className="rounded-lg bg-gray-50 p-1">
                        <button
                            onClick={() => setView('cards')}
                            className={`px-2 py-1 ${
                                view === 'cards'
                                    ? 'bg-white rounded'
                                    : 'bg-gray-50'
                            }`}
                        >
                            Cards
                        </button>
                        <button
                            onClick={() => setView('table')}
                            className={`px-2 py-1 ${
                                view === 'table'
                                    ? 'bg-white rounded'
                                    : 'bg-gray-50'
                            }`}
                        >
                            Table
                        </button>
                    </div>
                </div>
            </div>

            {view === 'cards' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {filtered.map((c) => (
                        <div
                            key={c.id}
                            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md"
                            onClick={() => onOpenProfile(c)}
                        >
                            <div className="flex items-start">
                                <div className="h-10 w-10 bg-brand-50 text-brand-700 rounded-full flex items-center justify-center mr-3">
                                    {(c.name || '?').slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">
                                        {c.name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {c.email}
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-3">
                                {c.notes
                                    ? c.notes.slice(0, 80)
                                    : 'No notes yet'}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="overflow-auto bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Last Contact
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filtered.map((c) => (
                                <tr
                                    key={c.id}
                                    className="hover:bg-gray-50 cursor-pointer"
                                    onClick={() => onOpenProfile(c)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {c.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {c.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {c.lastContactDate || 'Never'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {c.category}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
