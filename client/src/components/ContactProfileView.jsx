import React, { useMemo } from 'react';
import {
    ArrowLeft,
    X,
    Mail,
    MessageSquare,
    Phone,
    ClipboardList,
    CalendarCheck,
} from 'lucide-react';

const LastContactedCard = ({ date }) => {
    const displayValue = date ? new Date(date).toLocaleDateString() : 'Never';
    const subText = date ? 'Last contacted' : 'No contact recorded';

    return (
        <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 min-h-[120px] w-full">
            <div className="flex items-center text-emerald-600 mb-2">
                <CalendarCheck className="w-5 h-5 mr-2" />
                <h3 className="font-bold text-sm uppercase tracking-wider">Last Contacted</h3>
            </div>
            <p className={`text-2xl font-extrabold ${date ? 'text-gray-900' : 'text-orange-500'}`}>
                {displayValue}
            </p>
            <p className="text-xs text-gray-500 mt-1">{subText}</p>
        </div>
    );
};

const ActionButton = ({ icon: Icon, label, onClick }) => (
    <button
        onClick={onClick}
        className="flex items-center justify-center p-3 text-sm font-semibold transition-all duration-200 bg-white border border-gray-200 rounded-lg hover:bg-emerald-50 hover:border-emerald-200 text-gray-700 shadow-sm flex-1 min-w-[120px]"
        aria-label={`Action: ${label}`}
    >
        <Icon className="w-5 h-5 mr-2 text-emerald-500" />
        {label}
    </button>
);

export default function ContactProfileView({ contact, onClose }) {
    const detailedData = useMemo(
        () => ({
            name: contact.name,
            email: contact.email || 'N/A',
            phone: contact.phone || 'N/A',
            lastContactDate: contact.lastContactDate || null,
            category: contact.category || 'Contact',
            notes: contact.notes || 'No notes available for this contact.',
            campaignHistory: contact.campaignHistory || [
                { id: 1, name: 'Q4 2024 Newsletter', date: 'Dec 1, 2024', status: 'Opened' },
                { id: 2, name: 'Service Announcement', date: 'Oct 15, 2024', status: 'Bounced' },
            ],
        }),
        [contact]
    );

    const statusBadgeClass =
        detailedData.category === 'Lead' ? 'bg-yellow-100 text-yellow-800' : 'bg-emerald-100 text-emerald-800';

    return (
        <div className="p-6 bg-gray-50 min-h-[80vh] rounded-2xl shadow-xl w-full">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <button
                        onClick={onClose}
                        className="p-2 mr-3 rounded-full hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-100"
                        aria-label="Go back to previous page"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    {detailedData.name} Profile
                </h1>
                <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-100 rounded-full p-1">
                    <X size={24} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <LastContactedCard date={detailedData.lastContactDate} />

                <div className="md:col-span-2 flex space-x-4">
                    <ActionButton icon={Mail} label="E-mail" onClick={() => console.log(`ACTION: Emailing ${detailedData.name}`)} />
                    <ActionButton icon={MessageSquare} label="SMS" onClick={() => console.log(`ACTION: SMSing ${detailedData.name}`)} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Info</h2>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusBadgeClass}`}>{detailedData.category}</span>

                    <div className="flex items-start pt-3">
                        <Mail className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
                        <div className="ml-3 min-w-0">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</p>
                            <p className="text-base font-semibold text-gray-800 truncate">{detailedData.email}</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <Phone className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
                        <div className="ml-3">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</p>
                            <p className="text-base font-semibold text-gray-800">{detailedData.phone}</p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                            <ClipboardList className="w-5 h-5 mr-2 text-gray-600" />
                            Internal Notes
                        </h2>
                        <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200 h-32 overflow-y-auto">
                            <div className="border-l-4 border-amber-400 pl-3">
                                <p className="text-xs text-gray-500 font-medium">Jan 1, 2025</p>
                                <p className="text-sm text-gray-900">{detailedData.notes}</p>
                            </div>
                        </div>
                        <textarea placeholder="Add a new note..." rows="3" className="w-full mt-3 p-3 border border-gray-300 rounded-lg focus:ring-emerald-200 focus:border-emerald-300 transition duration-150"></textarea>
                    </div>

                    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
                        <h2 className="text-2xl font-bold text-[#130F0F] mb-4">Campaign History</h2>
                        <ul className="space-y-3">
                            {detailedData.campaignHistory.map((campaign) => (
                                <li key={campaign.id} className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                                    <span className="font-medium text-[#130F0F]">{campaign.name}</span>
                                    <div className="text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${campaign.status === 'Opened' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{campaign.status}</span>
                                        <span className="ml-3 text-gray-500">{campaign.date}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
