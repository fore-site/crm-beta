import React, { useState } from 'react';

export default function NewContactModal({ isOpen, onClose }) {
    const [form, setForm] = useState({ name: '', email: '', phone: '' });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-40">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Add New Contact</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 rounded">Close</button>
                </div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        console.log('Create contact', form);
                        onClose();
                    }}
                >
                    <label className="block text-sm text-gray-700">Full name</label>
                    <input className="w-full p-3 border border-gray-200 rounded-lg mb-3 focus:ring-emerald-200 focus:border-emerald-300" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

                    <label className="block text-sm text-gray-700">Email</label>
                    <input className="w-full p-3 border border-gray-200 rounded-lg mb-3 focus:ring-emerald-200 focus:border-emerald-300" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />

                    <label className="block text-sm text-gray-700">Phone</label>
                    <input className="w-full p-3 border border-gray-200 rounded-lg mb-3 focus:ring-emerald-200 focus:border-emerald-300" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />

                    <div className="flex justify-end">
                        <button type="button" onClick={onClose} className="mr-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-200">Add</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
