import React, { useState, useRef, useMemo } from 'react';
import {
    Clock,
    Users,
    Send,
    ListChecks,
    DollarSign,
    Calendar,
    X,
    ArrowLeft,
    Mail,
    MessageSquare,
    Phone,
    CalendarCheck,
    User,
    ClipboardList,
} from 'lucide-react';

// --- Helper Component: Last Contacted Status Card ---
const LastContactedCard = ({ date }) => {
    // Logic based on user request: show date or "No campaign yet"
    const displayValue = date
        ? new Date(date).toLocaleDateString()
        : 'No campaign yet';
    const subText = date
        ? `Last outreach was on ${displayValue}.`
        : `This contact has not yet been targeted by a campaign.`;

    return (
        <div className="p-4 bg-white rounded-xl shadow-lg border border-gray-100 min-h-[120px] w-full">
            <div className="flex items-center text-indigo-600 mb-2">
                <CalendarCheck className="w-5 h-5 mr-2" />
                <h3 className="font-bold text-sm uppercase tracking-wider">
                    Last Contacted
                </h3>
            </div>
            {/* FONT SIZE CHANGED FROM text-3xl to text-2xl */}
            <p
                className={`text-2xl font-extrabold ${
                    date ? 'text-gray-900' : 'text-orange-500'
                }`}
            >
                {displayValue}
            </p>
            <p className="text-xs text-gray-500 mt-1">{subText}</p>
        </div>
    );
};

// --- Helper Component: Follow-up Action Button ---
const ActionButton = ({ icon: Icon, label, onClick }) => (
    <button
        onClick={onClick}
        className="flex items-center justify-center p-3 text-sm font-semibold transition-all duration-200 bg-white border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-400 text-gray-700 shadow-sm flex-1 min-w-[120px]"
        aria-label={`Action: ${label}`}
    >
        <Icon className="w-5 h-5 mr-2 text-indigo-500" />
        {label}
    </button>
);

// --- Updated Detailed Contact Profile View ---
const ContactProfileView = ({ contact, onClose }) => {
    // Mock detailed data setup based on the passed contact object
    const detailedData = useMemo(
        () => ({
            name: contact.name,
            email: contact.email || 'N/A',
            phone: contact.phone || 'N/A',
            lastContactDate: contact.lastContactDate || null,
            category: contact.category || 'Contact',
            notes: contact.notes || 'No notes available for this contact.',
            campaignHistory: [
                {
                    id: 1,
                    name: 'Q4 2024 Newsletter',
                    date: 'Dec 1, 2024',
                    status: 'Opened',
                },
                {
                    id: 2,
                    name: 'Service Announcement',
                    date: 'Oct 15, 2024',
                    status: 'Bounced',
                },
            ],
        }),
        [contact]
    );

    const statusBadgeClass =
        detailedData.category === 'Lead'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-indigo-100 text-indigo-800';

    return (
        <div className="p-6 bg-gray-50 min-h-[80vh] rounded-2xl shadow-xl w-full">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
                <h1 className="text-3xl font-bold text-[#130F0F] flex items-center">
                    <button
                        onClick={onClose}
                        className="p-2 mr-3 rounded-full hover:bg-gray-200 transition-colors"
                        aria-label="Go back to dashboard"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    {detailedData.name} Profile
                </h1>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Status and Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Last Contacted Card (only one card now) */}
                <LastContactedCard date={detailedData.lastContactDate} />

                {/* Follow-up Actions (E-mail and SMS) */}
                <div className="md:col-span-2 flex space-x-4">
                    <ActionButton
                        icon={Mail}
                        label="E-mail"
                        onClick={() =>
                            console.log(`ACTION: Emailing ${detailedData.name}`)
                        }
                    />
                    <ActionButton
                        icon={MessageSquare}
                        label="SMS"
                        onClick={() =>
                            console.log(`ACTION: SMSing ${detailedData.name}`)
                        }
                    />
                </div>
            </div>

            {/* Contact Details & Notes/History */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-4 p-6 bg-white rounded-xl shadow-md border border-gray-100">
                    <h2 className="text-2xl font-bold text-[#130F0F] mb-4">
                        Contact Info
                    </h2>
                    <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${statusBadgeClass}`}
                    >
                        {detailedData.category}
                    </span>

                    {/* Email */}
                    <div className="flex items-start pt-3">
                        <Mail className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
                        <div className="ml-3 min-w-0">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </p>
                            <p className="text-base font-semibold text-indigo-600 truncate">
                                {detailedData.email}
                            </p>
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start">
                        <Phone className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
                        <div className="ml-3">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Phone
                            </p>
                            <p className="text-base font-semibold text-gray-700">
                                {detailedData.phone}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Notes and History */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Notes */}
                    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
                        <h2 className="text-2xl font-bold text-[#130F0F] mb-4 flex items-center">
                            <ClipboardList className="w-5 h-5 mr-2" />
                            Internal Notes
                        </h2>
                        <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200 h-32 overflow-y-auto">
                            <div className="border-l-4 border-yellow-500 pl-3">
                                <p className="text-xs text-gray-500 font-medium">
                                    Jan 1, 2025
                                </p>
                                <p className="text-sm text-[#130F0F]">
                                    {detailedData.notes}
                                </p>
                            </div>
                        </div>
                        <textarea
                            placeholder="Add a new note..."
                            rows="3"
                            className="w-full mt-3 p-3 border border-gray-300 rounded-lg focus:ring-[#26A248] focus:border-[#26A248] transition duration-150"
                        ></textarea>
                    </div>

                    {/* Campaign History */}
                    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
                        <h2 className="text-2xl font-bold text-[#130F0F] mb-4">
                            Campaign History
                        </h2>
                        <ul className="space-y-3">
                            {detailedData.campaignHistory.map((campaign) => (
                                <li
                                    key={campaign.id}
                                    className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg shadow-sm"
                                >
                                    <span className="font-medium text-[#130F0F]">
                                        {campaign.name}
                                    </span>
                                    <div className="text-sm">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                campaign.status === 'Opened'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}
                                        >
                                            {campaign.status}
                                        </span>
                                        <span className="ml-3 text-gray-500">
                                            {campaign.date}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Reusable Contact Card component (used in list view)
const ContactCard = ({ contact, onClick }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Determine last contact status for display
    const lastContactDisplay = contact.lastContactDate
        ? `Last Contact: ${new Date(
              contact.lastContactDate
          ).toLocaleDateString()}`
        : 'No campaign yet';

    const contactTextColor = contact.lastContactDate
        ? 'text-[#868281]'
        : 'text-orange-500 font-semibold';

    // Simple click-outside handler
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuRef]);

    const handleEdit = () => {
        console.log(`ACTION: Opening edit modal for: ${contact.name}`);
        setIsMenuOpen(false);
    };

    const handleDelete = () => {
        // In a real application, this would open a custom confirmation modal
        console.log(
            `ACTION: Request to delete contact: ${contact.name}. (Confirmation step skipped for demo)`
        );
        setIsMenuOpen(false);
    };

    return (
        <div
            className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 flex items-start relative border border-[#DEE2E6] cursor-pointer"
            onClick={() => onClick(contact)} // Make the whole card clickable to view profile
        >
            <div
                className="flex justify-end absolute top-2 right-2 z-10"
                ref={menuRef}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="p-1 rounded-full text-[#868281] hover:bg-[#E7F7EB] transition-colors"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Contact actions menu"
                >
                    <svg
                        className="h-6 w-6"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                </button>
                {isMenuOpen && (
                    <div className="absolute z-20 right-0 mt-8 w-40 rounded-lg shadow-2xl bg-white ring-1 ring-black ring-opacity-5">
                        <div className="py-1">
                            <button
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                onClick={handleEdit}
                            >
                                Edit Details
                            </button>
                            <button
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                onClick={handleDelete}
                            >
                                Delete Contact
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Contact Content */}
            <div className="h-10 w-10 bg-[#DEE2E6] rounded-full flex-shrink-0 mr-3 mt-1"></div>
            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[#130F0F]">{contact.name}</h3>
                <p className={`text-xs ${contactTextColor} flex items-center`}>
                    <Clock size={12} className="mr-1" />
                    {lastContactDisplay}
                </p>
                <div className="mt-2 text-sm text-[#868281] space-y-1">
                    {/* Phone */}
                    <div className="flex items-start">
                        <svg
                            className="h-4 w-4 flex-shrink-0 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-3.961a18.06 18.06 0 01-13.486-13.486V5a2 2 0 012-2z"
                            />
                        </svg>
                        <p className="flex-1 min-w-0 break-words">
                            {contact.phone || 'N/A'}
                        </p>
                    </div>
                    {/* Email */}
                    <div className="flex items-start">
                        <svg
                            className="h-4 w-4 flex-shrink-0 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-17 4v7a2 2 0 002 2h14a2 2 0 002-2v-7"
                            />
                        </svg>
                        <p className="flex-1 min-w-0 break-words">
                            {contact.email || 'N/A'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Reusable Summary Card component (used in summary view)
const SummaryCard = ({ title, count, description, onClick }) => (
    <div
        className="bg-white p-6 rounded-2xl shadow-lg border border-[#DEE2E6] hover:shadow-xl transition-all duration-300 w-full cursor-pointer transform hover:scale-[1.02]"
        onClick={onClick}
    >
        <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-[#130F0F]">{title}</h2>
            <div className="text-3xl font-extrabold text-[#26A248] bg-[#E7F7EB] px-4 py-2 rounded-xl shadow-inner min-w-16 text-center">
                {count}
            </div>
        </div>
        <p className="text-sm text-[#868281] mt-2">{description}</p>
        <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
            <span className="text-sm font-medium text-[#26A248] hover:text-[#1F813A] transition-colors">
                View Details &rarr;
            </span>
        </div>
    </div>
);

// --- Quick Action Card Component (Updated to handle action prop) ---
const QuickActionCard = ({
    title,
    subtitle,
    items,
    icon,
    colorClass,
    handleAction,
}) => (
    <div
        className={`p-6 rounded-2xl shadow-xl border-l-4 ${colorClass} bg-white transition-all duration-300 hover:shadow-2xl`}
    >
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
                <div className="mr-3">{icon}</div>
                <div>
                    <h3 className="text-xl font-extrabold text-[#130F0F]">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-500">{subtitle}</p>
                </div>
            </div>
            <span className="text-2xl font-extrabold text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">
                {items.length}
            </span>
        </div>

        <ul className="space-y-3 mt-4">
            {items.map((item, index) => (
                <li
                    key={index}
                    className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleAction && handleAction(item)} // Handle click on the list item itself
                >
                    <div className="min-w-0 flex-1 mr-3">
                        <p className="font-semibold text-sm truncate text-[#130F0F]">
                            {item.title || item.name}
                        </p>
                        {item.lastContact && (
                            <p className="text-xs text-red-500 flex items-center mt-1">
                                <Clock size={12} className="mr-1" />
                                Last contact: {item.lastContact}
                            </p>
                        )}
                        {item.campaign && (
                            <p className="text-xs text-gray-500 mt-1">
                                Campaign:{' '}
                                <span className="font-medium text-gray-700">
                                    {item.campaign}
                                </span>
                            </p>
                        )}
                    </div>
                    {/* The button is now a secondary click target, or we can remove it */}
                    <button
                        className="text-sm text-[#26A248] hover:text-[#1F813A] font-medium flex-shrink-0"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAction && handleAction(item);
                        }}
                    >
                        Go &rarr;
                    </button>
                </li>
            ))}
            {items.length === 0 && (
                <li className="text-center py-4 text-gray-500 italic text-sm">
                    All clear! No urgent actions needed.
                </li>
            )}
        </ul>
    </div>
);

// --- Chart Component (Enhanced) ---
const PerformanceChart = ({ data }) => {
    const chartHeight = 220; // Fixed height for chart area
    const max = Math.max(...data.map((item) => item.value), 0);
    // Calculate scale factor, ensuring it's not divided by zero
    const scale = max > 0 ? chartHeight / max : 0;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 w-full transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-xl font-extrabold text-[#130F0F] mb-2">
                Campaigns Sent Over Last 7 Days
            </h3>
            <p className="text-sm text-gray-500 mb-6">
                Tracking outreach efficiency by volume.
            </p>

            {/* Chart Area Container */}
            <div
                className="flex items-end justify-between space-x-3 p-2 bg-gradient-to-t from-gray-50 to-white rounded-xl relative"
                style={{ height: `${chartHeight}px` }}
            >
                {/* Helper Line (Max Value) */}
                <div
                    className="absolute top-0 left-0 right-0 h-[1px] bg-red-400/50 dashed border-t border-dashed"
                    style={{ marginTop: '10px' }}
                >
                    <span className="absolute -left-10 text-xs text-red-500 font-bold -top-2">
                        Max: {max}
                    </span>
                </div>

                {data.map((item, index) => {
                    // Calculate bar height, minimum 5px for visibility if value > 0
                    const barHeight = item.value * scale;
                    const actualHeight = Math.max(0, barHeight);

                    return (
                        <div
                            key={index}
                            className="flex flex-col items-center justify-end h-full flex-grow group relative"
                        >
                            {/* Bar Container and Animation */}
                            <div
                                className="w-full rounded-t-xl transition-all duration-700 ease-out 
                            bg-gradient-to-t from-[#26A248] to-[#60D394] 
                            hover:from-[#1F813A] hover:to-[#50B880] 
                            cursor-pointer shadow-lg transform hover:scale-y-[1.05] hover:shadow-xl"
                                style={{
                                    height: `${actualHeight}px`,
                                    minHeight: actualHeight > 0 ? '5px' : '0',
                                }}
                                title={`${item.label}: ${item.value}`}
                            ></div>

                            {/* Tooltip for value */}
                            <span className="absolute top-0 mt-[-25px] p-1 px-2 bg-[#130F0F] text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-xl">
                                {item.value} Sent
                            </span>

                            {/* Label */}
                            <span className="text-sm text-gray-700 mt-2 font-medium">
                                {item.label}
                            </span>
                        </div>
                    );
                })}
            </div>
            <div className="border-t border-gray-200 mt-8 pt-4 text-center">
                <p className="text-xs text-gray-500">
                    Historical view: {data.length} data points.
                </p>
            </div>
        </div>
    );
};

// Main App component
export default function App() {
    // Page state: 'Dashboard' (new default), 'Summary' (Sales Center Summary), or 'List'
    const [page, setPage] = useState('Dashboard');
    // State for showing the detailed profile view
    const [selectedContact, setSelectedContact] = useState(null);

    // List states
    const [activeCategory, setActiveCategory] = useState('Contacts');
    const [viewMode, setViewMode] = useState('recents');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for New Contact Modal
    const contactsPerPage = 13;

    // Handler for viewing a detailed contact profile
    const handleViewContact = (contact) => {
        // A simplified contact object from the Quick Action card might need to be resolved
        // to the full contact object for the detailed view.
        const fullContact =
            [...allContacts, ...allLeads].find((c) => c.id === contact.id) ||
            contact;

        setSelectedContact(fullContact);
        setPage(null); // Clear the page state when viewing a profile
    };

    // Handler to close the contact profile view and return to the dashboard
    const handleCloseProfile = () => {
        setSelectedContact(null);
        setPage('Dashboard');
    };

    // Modal handlers
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // --- Unified Rich Mock Data ---
    const allContacts = [
        // Contacts requiring follow-up (id 1, 2)
        {
            id: 1,
            name: 'Jessica Smith',
            category: 'Contact',
            date: 'Jan 6, 2025',
            email: 'j.smith@corp.com',
            phone: '555-1011',
            lastContactDate: '2024-10-20',
            notes: 'Was unresponsive to Q4 email follow-up. Try SMS outreach next week.',
        },
        {
            id: 2,
            name: 'David Johnson',
            category: 'Contact',
            date: 'Jan 6, 2025',
            email: 'd.johnson@example.net',
            phone: '555-1012',
            lastContactDate: '2024-09-25',
            notes: 'High priority client. Overdue follow-up (90 days). Needs an urgent call logged.',
        },
        // Regular contacts
        {
            id: 3,
            name: 'Emily Davis',
            category: 'Contact',
            date: 'Jan 7, 2025',
            email: 'e.davis@webco.org',
            phone: '555-1013',
            lastContactDate: '2024-11-15',
            notes: 'Recently closed a deal. Mark for 6-month check-in.',
        },
        {
            id: 4,
            name: 'Mandevo',
            category: 'Contact',
            date: 'Jan 5, 2025',
            email: 'm.dev@test.dev',
            phone: '555-1014',
            lastContactDate: '2024-12-01',
            notes: 'Standard client.',
        },
        {
            id: 5,
            name: 'Mike Wong',
            category: 'Contact',
            date: 'Jan 5, 2025',
            email: 'mike.wong@mail.com',
            phone: '555-1015',
            lastContactDate: '2024-12-15',
            notes: 'Standard client.',
        },
        {
            id: 6,
            name: 'New Lead Z',
            category: 'Contact',
            date: 'Jan 5, 2025',
            email: 'new@example.com',
            phone: '555-0000',
            lastContactDate: null,
            notes: 'New inbound contact from website, no initial outreach yet.',
        },
        {
            id: 7,
            name: 'Esther Howard',
            category: 'Contact',
            date: 'Jan 5, 2025',
            email: 'esther.h@mail.com',
            phone: '555-1016',
            lastContactDate: '2024-12-24',
            notes: 'Standard client.',
        },
        {
            id: 8,
            name: 'Mark Henry',
            category: 'Contact',
            date: 'Jan 5, 2025',
            email: 'mark.h@mail.com',
            phone: '555-1017',
            lastContactDate: '2024-12-25',
            notes: 'Standard client.',
        },
        {
            id: 9,
            name: 'Peter Klaven',
            category: 'Contact',
            date: 'Jan 5, 2025',
            email: 'peter.k@mail.com',
            phone: '555-1018',
            lastContactDate: '2024-12-26',
            notes: 'Standard client.',
        },
        {
            id: 10,
            name: 'Blemix Koko',
            category: 'Contact',
            date: 'Jan 5, 2025',
            email: 'blemix.k@mail.com',
            phone: '555-1019',
            lastContactDate: '2024-12-27',
            notes: 'Standard client.',
        },
        {
            id: 11,
            name: 'Anita Capul',
            category: 'Contact',
            date: 'Jan 5, 2025',
            email: 'anita.c@mail.com',
            phone: '555-1020',
            lastContactDate: '2024-12-28',
            notes: 'Standard client.',
        },
    ];
    const totalContacts = allContacts.length;

    const allLeads = [
        {
            id: 101,
            name: 'John Doe',
            category: 'Lead',
            date: 'Dec 15, 2024',
            email: 'john@lead.io',
            phone: '555-2001',
            lastContactDate: '2024-12-28',
            notes: 'Clicked through on Holiday Promo ad. Low-mid qualification score.',
        },
        {
            id: 102,
            name: 'Jane Smith',
            category: 'Lead',
            date: 'Dec 16, 2024',
            email: 'jane@lead.io',
            phone: '555-2002',
            lastContactDate: null,
            notes: 'Website form submission. Needs qualification.',
        },
        {
            id: 103,
            name: 'Bob Johnson',
            category: 'Lead',
            date: 'Dec 17, 2024',
            email: 'bob@lead.io',
            phone: '555-2003',
            lastContactDate: '2025-01-01',
            notes: 'Engaged with LinkedIn content.',
        },
        {
            id: 104,
            name: 'Alice Williams',
            category: 'Lead',
            date: 'Dec 18, 2024',
            email: 'alice@lead.io',
            phone: '555-2004',
            lastContactDate: '2025-01-02',
            notes: 'Responded to cold email.',
        },
    ];
    const totalLeads = allLeads.length;

    const totalCampaigns = 12;
    const sentCampaigns = 9;

    // --- Quick Action Dummy Data (Uses rich data IDs) ---
    const contactsNeedingFollowUp = [
        // Contacts untouched for 60+ days (simulated data) - using IDs to reference rich data
        {
            id: 1,
            name: 'Jessica Smith',
            lastContact: 'Oct 20, 2024',
            daysOverdue: 65,
            type: 'contact',
        },
        {
            id: 2,
            name: 'David Johnson',
            lastContact: 'Sep 25, 2024',
            daysOverdue: 90,
            type: 'contact',
        },
    ];

    const pendingCampaignTasks = [
        // Tasks related to open campaigns
        {
            id: 101,
            title: 'Review Q1 Newsletter Draft',
            campaign: 'Q1 Newsletter',
            priority: 'High',
        },
        {
            id: 102,
            title: 'Finalize A/B Test Landing Page',
            campaign: 'Holiday Promo',
            priority: 'Medium',
        },
        {
            id: 103,
            title: 'Approve 5 new Lead submissions',
            campaign: 'LinkedIn Ad',
            priority: 'High',
        },
    ];
    // --- END Quick Action Dummy Data ---

    // --- DYNAMIC CHART DATA ---
    const campaignChartData = [
        { label: 'Sun', value: 45 },
        { label: 'Mon', value: 78 },
        { label: 'Tue', value: 121 },
        { label: 'Wed', value: 92 },
        { label: 'Thu', value: 165 }, // Highest value
        { label: 'Fri', value: 60 },
        { label: 'Sat', value: 33 },
    ];

    // --- Helper Functions for List View ---

    const dataToDisplay =
        activeCategory === 'Contacts' ? allContacts : allLeads;
    const totalPages = Math.ceil(dataToDisplay.length / contactsPerPage);
    const startIndex = (currentPage - 1) * contactsPerPage;
    const endIndex = startIndex + contactsPerPage;
    const paginatedData = dataToDisplay.slice(startIndex, endIndex);

    const handleDropdownSelect = (option) => {
        setViewMode(option);
        setIsDropdownOpen(false);
        if (option === 'all') {
            setCurrentPage(1); // Reset to first page when switching to 'All' view
        }
    };

    // --- Context/Title Logic ---

    const getPageContext = () => {
        if (page === 'Dashboard') {
            return {
                title: 'Dashboard',
                description: 'Key business metrics and campaign overview.',
                breadcrumb: 'Dashboard',
            };
        }

        if (page === 'Summary') {
            return {
                title: 'Sales Center',
                description: 'Contacts and Leads management center',
                breadcrumb: 'Sales Center',
            };
        }

        // List view context (page === 'List')
        const categoryContent =
            activeCategory === 'Contacts'
                ? {
                      title: 'Contacts',
                      description:
                          'List of people or organizations for communication',
                  }
                : {
                      title: 'Leads',
                      description:
                          'List of people or organizations that have been targeted for advertising',
                  };

        return {
            title: categoryContent.title,
            description: categoryContent.description,
            breadcrumb: `${categoryContent.title}`,
        };
    };

    const { title, description, breadcrumb } = getPageContext();

    // --- Render Functions for different pages ---

    const renderDashboard = () => (
        <>
            {/* Title/Description for Dashboard Page */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-1">{title}</h1>
                <p className="text-md text-[#2F2F2F]">{description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                <SummaryCard
                    title="Total Contacts"
                    count={totalContacts}
                    description="All individuals and organizations in your communication network."
                    onClick={() => {
                        setActiveCategory('Contacts');
                        setPage('List');
                        setViewMode('all');
                    }}
                />
                <SummaryCard
                    title="Active Leads"
                    count={totalLeads}
                    description="Potential customers targeted by ongoing marketing campaigns."
                    onClick={() => {
                        setActiveCategory('Leads');
                        setPage('List');
                        setViewMode('all');
                    }}
                />
                <SummaryCard
                    title="Total Campaigns"
                    count={totalCampaigns}
                    description="The total number of marketing initiatives defined and tracked."
                    onClick={() => console.log('ACTION: View Total Campaigns')}
                />
                <SummaryCard
                    title="Sent Campaigns"
                    count={sentCampaigns}
                    description="Campaigns that have been deployed and delivered to customers/leads."
                    onClick={() => console.log('ACTION: View Sent Campaigns')}
                />
            </div>

            {/* Quick Action / Follow-up Tasks (NEW SECTION) */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <QuickActionCard
                    title="Contacts Requiring Follow-up"
                    subtitle="Untouched for 60+ days (Critical Priority)"
                    items={contactsNeedingFollowUp}
                    icon={<Users className="h-6 w-6 text-red-500" />}
                    colorClass="border-red-400 bg-red-50"
                    handleAction={handleViewContact} // <-- Handler to open profile
                />
                <QuickActionCard
                    title="Pending Campaign Tasks"
                    subtitle="Urgent actions for open campaigns"
                    items={pendingCampaignTasks}
                    icon={<ListChecks className="h-6 w-6 text-indigo-500" />}
                    colorClass="border-indigo-400 bg-indigo-50"
                    handleAction={(item) =>
                        console.log(
                            `ACTION: Navigating to Campaign Task: ${item.title}`
                        )
                    }
                />
            </div>

            {/* Performance Chart */}
            <div className="mt-10">{/* Passed chart data */}</div>

            {/* Recent Activity Feed Placeholder */}
            <div className="mt-10 p-6 bg-gray-100 rounded-2xl shadow-inner border border-gray-200">
                <h2 className="text-xl font-bold text-[#130F0F] mb-3">
                    Recent Activity Feed
                </h2>
                <p className="text-gray-500 text-sm italic">
                    [Activity items would appear here, showing recent contact
                    additions, campaign sends, and pipeline changes.]
                </p>
            </div>
            <PerformanceChart data={campaignChartData} />
        </>
    );

    const renderSalesCenterSummary = () => (
        <>
            {/* Title/Description for Summary Page */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-1">{title}</h1>
                <p className="text-md text-[#2F2F2F]">{description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                <SummaryCard
                    title="Total Contacts"
                    count={totalContacts}
                    description="All individuals and organizations currently in your communication network."
                    onClick={() => {
                        setActiveCategory('Contacts');
                        setPage('List');
                        setViewMode('all');
                    }}
                />
                <SummaryCard
                    title="Active Leads"
                    count={totalLeads}
                    description="Individuals or organizations identified as potential customers targeted by campaigns."
                    onClick={() => {
                        setActiveCategory('Leads');
                        setPage('List');
                        setViewMode('all');
                    }}
                />
            </div>
        </>
    );

    const renderContactsLeadsList = () => (
        <>
            {/* Categories section - Only visible in List view */}
            <div className="flex items-center space-x-4 mt-6 mb-6 text-[#868281] font-medium">
                <div className="flex items-center space-x-2">
                    <a
                        href="#"
                        onClick={() => {
                            setActiveCategory('Contacts');
                            setViewMode('recents');
                        }}
                        className={`font-medium text-lg ${
                            activeCategory === 'Contacts'
                                ? 'text-[#26A248]'
                                : 'text-[#130F0F] hover:text-[#2A2625]'
                        } transition-colors duration-200`}
                    >
                        Contacts
                    </a>
                    <span className="text-sm text-[#868281]">
                        {totalContacts}
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    <a
                        href="#"
                        onClick={() => {
                            setActiveCategory('Leads');
                            setViewMode('recents');
                        }}
                        className={`font-medium text-lg ${
                            activeCategory === 'Leads'
                                ? 'text-[#26A248]'
                                : 'text-[#130F0F] hover:text-[#2A2625]'
                        } transition-colors duration-200`}
                    >
                        Leads
                    </a>
                    <span className="text-sm text-[#868281]">{totalLeads}</span>
                </div>
            </div>
            <div className="border-t border-[#2A2625] mb-6"></div>

            {/* Category Title and Description (moved here from main App component) */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-1">{title}</h1>
                <p className="text-md text-[#2F2F2F]">{description}</p>
            </div>

            {/* Category Controls (Action Buttons) - Positioned to the left */}
            <div className="flex flex-col md:flex-row md:justify-start md:items-center mb-6 space-y-4 md:space-y-0">
                <div className="flex items-center space-x-3">
                    {/* Conditional "New Contact" button with white color, black text, no border */}
                    {activeCategory === 'Contacts' && (
                        <button
                            className="flex items-center p-2 rounded-lg bg-white text-[#130F0F] font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.01]"
                            onClick={openModal}
                        >
                            <svg
                                className="h-5 w-5 mr-1 text-[#26A248]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            New Contact
                        </button>
                    )}

                    {/* Recents/All Dropdown */}
                    <div className="relative">
                        <button
                            className="flex items-center p-2 rounded-lg bg-white border-2 border-[#DEE2E6] text-[#130F0F] shadow-md hover:shadow-lg transition-shadow duration-200"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            {viewMode === 'recents' ? 'Recents' : 'All'}
                            <svg
                                className="h-5 w-5 ml-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute z-10 top-full mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                    <a
                                        href="#"
                                        className={`block px-4 py-2 text-sm ${
                                            viewMode === 'recents'
                                                ? 'bg-gray-100 text-gray-900'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                        onClick={() =>
                                            handleDropdownSelect('recents')
                                        }
                                    >
                                        Recents
                                    </a>
                                    <a
                                        href="#"
                                        className={`block px-4 py-2 text-sm ${
                                            viewMode === 'all'
                                                ? 'bg-gray-100 text-gray-900'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                        onClick={() =>
                                            handleDropdownSelect('all')
                                        }
                                    >
                                        All {activeCategory}
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Conditional View Rendering */}
            {viewMode === 'recents' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* Leads View - New Lead Section */}
                    {activeCategory === 'Leads' && (
                        <div className="bg-[#EBE5E5] rounded-xl p-4">
                            <h2 className="text-lg font-bold mb-4">
                                Recent Leads{' '}
                                <span className="font-normal text-[#868281]">
                                    {allLeads.length}
                                </span>
                            </h2>
                            <div className="space-y-4">
                                {/* Dummy cards for recents - Using rich data */}
                                {allLeads.slice(0, 4).map((contact) => (
                                    <ContactCard
                                        key={contact.id}
                                        contact={contact}
                                        onClick={handleViewContact}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Contacts View - Recently Added Section */}
                    {activeCategory === 'Contacts' && (
                        <div className="bg-[#EBE5E5] rounded-xl p-4">
                            <h2 className="text-lg font-bold mb-4">
                                Recently added{' '}
                                <span className="font-normal text-[#868281]">
                                    {allContacts.length}
                                </span>
                            </h2>
                            <div className="space-y-4">
                                {/* Dummy cards for recents - Using rich data */}
                                {allContacts.slice(0, 4).map((contact) => (
                                    <ContactCard
                                        key={contact.id}
                                        contact={contact}
                                        onClick={handleViewContact}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    {paginatedData.length > 0 ? (
                        <div className="bg-[#EBE5E5] rounded-xl p-6 w-full">
                            <h2 className="text-lg font-bold mb-4">
                                {activeCategory === 'Contacts'
                                    ? 'All contacts'
                                    : 'All leads'}
                                <span className="font-normal text-[#868281]">{` (${dataToDisplay.length})`}</span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {/* Full List - Using rich data */}
                                {paginatedData.map((data, index) => (
                                    <ContactCard
                                        key={data.id}
                                        contact={data}
                                        onClick={handleViewContact}
                                    />
                                ))}
                            </div>
                            <div className="flex justify-center mt-6 space-x-4">
                                <button
                                    className={`px-4 py-2 rounded-lg border-2 border-[#DEE2E6] ${
                                        currentPage === 1
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-white text-[#130F0F] hover:bg-gray-100'
                                    } transition-colors duration-200`}
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.max(prev - 1, 1)
                                        )
                                    }
                                    disabled={currentPage === 1}
                                >
                                    Prev
                                </button>
                                <button
                                    className={`px-4 py-2 rounded-lg border-2 border-[#DEE2E6] ${
                                        currentPage === totalPages
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-white text-[#130F0F] hover:bg-gray-100'
                                    } transition-colors duration-200`}
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.min(prev + 1, totalPages)
                                        )
                                    }
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center p-12 text-[#868281]">
                            <p>No more {activeCategory.toLowerCase()}</p>
                        </div>
                    )}
                </div>
            )}
        </>
    );

    // --- New Contact Modal Component (Unchanged) ---
    const NewContactModal = ({ isOpen, onClose }) => {
        const [tab, setTab] = useState('manual');
        const [contactData, setContactData] = useState({
            name: '',
            email: '',
            phone: '',
        });
        const [bulkFile, setBulkFile] = useState(null);

        if (!isOpen) return null;

        const handleManualChange = (e) => {
            const { name, value } = e.target;
            setContactData((prev) => ({ ...prev, [name]: value }));
        };

        const handleManualSubmit = (e) => {
            e.preventDefault();
            console.log('MANUAL SUBMIT:', contactData);
            // In a real app, logic to save the new contact to Firestore goes here
            onClose();
        };

        const handleFileChange = (e) => {
            setBulkFile(e.target.files[0]);
        };

        const handleBulkUpload = (e) => {
            e.preventDefault();
            if (!bulkFile) {
                console.log('BULK UPLOAD FAILED: Please select a file.');
                return;
            }
            console.log(
                `BULK UPLOAD INITIATED: Processing file ${bulkFile.name} (${bulkFile.type}).`
            );
            // In a real app, file parsing and bulk write to Firestore goes here
            onClose();
        };

        const InputField = ({
            label,
            name,
            type = 'text',
            value,
            onChange,
            placeholder,
        }) => (
            <div className="mb-4">
                <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor={name}
                >
                    {label}
                </label>
                <input
                    type={type}
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#26A248] focus:border-[#26A248] transition duration-150"
                    required={name !== 'phone'} // Phone is optional
                />
            </div>
        );

        const renderManualForm = () => (
            <form onSubmit={handleManualSubmit}>
                <h3 className="text-xl font-semibold text-[#130F0F] mb-4">
                    New Contact Details
                </h3>
                <InputField
                    label="Full Name"
                    name="name"
                    value={contactData.name}
                    onChange={handleManualChange}
                    placeholder="e.g., Jane Doe"
                />
                <InputField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={contactData.email}
                    onChange={handleManualChange}
                    placeholder="e.g., jane@example.com"
                />
                <InputField
                    label="Phone Number (Optional)"
                    name="phone"
                    value={contactData.phone}
                    onChange={handleManualChange}
                    placeholder="e.g., (555) 123-4567"
                />
                <button
                    type="submit"
                    className="w-full mt-4 p-3 bg-[#26A248] text-white font-bold rounded-lg hover:bg-[#1F813A] transition duration-150 shadow-md"
                >
                    Add Contact
                </button>
            </form>
        );

        const renderBulkUpload = () => (
            <form onSubmit={handleBulkUpload}>
                <h3 className="text-xl font-semibold text-[#130F0F] mb-4">
                    Bulk Contact Import
                </h3>
                <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50 mb-4">
                    <input
                        type="file"
                        id="bulk-file-upload"
                        onChange={handleFileChange}
                        accept=".json,.csv"
                        className="hidden"
                    />
                    <label
                        htmlFor="bulk-file-upload"
                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#26A248] hover:bg-[#1F813A]"
                    >
                        <svg
                            className="h-5 w-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                            />
                        </svg>
                        Select JSON or CSV File
                    </label>
                    <p className="mt-3 text-sm text-gray-500">
                        {bulkFile
                            ? bulkFile.name
                            : 'Max 5MB (Requires Name, Email columns/fields)'}
                    </p>
                </div>

                <button
                    type="submit"
                    className={`w-full p-3 font-bold rounded-lg transition duration-150 shadow-md ${
                        bulkFile
                            ? 'bg-[#26A248] text-white hover:bg-[#1F813A]'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={!bulkFile}
                >
                    Import Contacts
                </button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                    *This is a placeholder action. Data will be logged to the
                    console.*
                </p>
            </form>
        );

        return (
            // Modal Backdrop
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                {/* Modal Content */}
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                    <div className="p-6 md:p-8">
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <h2 className="text-2xl font-bold text-[#130F0F]">
                                Add New Contact(s)
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label="Close modal"
                            >
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Tab Navigation */}
                        <div className="flex mb-6 space-x-2 border-b">
                            <button
                                className={`py-2 px-4 text-sm font-medium rounded-t-lg transition-colors ${
                                    tab === 'manual'
                                        ? 'border-b-2 border-[#26A248] text-[#26A248]'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                                onClick={() => setTab('manual')}
                            >
                                Manual Entry
                            </button>
                            <button
                                className={`py-2 px-4 text-sm font-medium rounded-t-lg transition-colors ${
                                    tab === 'bulk'
                                        ? 'border-b-2 border-[#26A248] text-[#26A248]'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                                onClick={() => setTab('bulk')}
                            >
                                Bulk Upload (.json, .csv)
                            </button>
                        </div>

                        {/* Tab Content */}
                        {tab === 'manual'
                            ? renderManualForm()
                            : renderBulkUpload()}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex bg-[#F8F9FA] min-h-screen text-[#130F0F] antialiased font-sans">
            {/* Sidebar (Unchanged) */}
            <aside className="w-64 bg-[#E7E3E2] p-6 flex flex-col justify-between shadow-lg">
                <div>
                    <div className="flex items-center">
                        <div className="h-10 w-10 bg-[#E9ECEF] rounded-full"></div>
                        <div className="ml-3">
                            {/* UPDATED PROFILE INFORMATION */}
                            <h2 className="text-lg font-semibold text-[#130F0F]">
                                Roware Admin
                            </h2>
                            <p className="text-sm text-[#130F0F]">
                                admin@roware.xyz
                            </p>
                        </div>
                    </div>
                    <div className="border-t border-[#B7B1B1] my-6"></div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full p-2 pl-10 rounded-lg border-2 border-[#DEE2E6] bg-white text-[#130F0F] placeholder-[#868281] shadow-md focus:outline-none focus:ring-2 focus:ring-[#868281] transition-shadow duration-200"
                        />
                        <svg
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#868281]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                    <div className="border-t border-[#B7B1B1] my-6"></div>
                    <nav>
                        <h3 className="text-xs font-semibold uppercase text-[#868281] mb-2">
                            Main Menu
                        </h3>
                        <ul className="space-y-1">
                            {/* Dashboard Link - Now sets page to 'Dashboard' */}
                            <li
                                className={`flex items-center p-3 rounded-lg text-[#130F0F] cursor-pointer transition-all duration-200 ${
                                    page === 'Dashboard' &&
                                    selectedContact === null
                                        ? 'border border-[#B7B1B1] bg-white shadow-md'
                                        : 'hover:bg-[#FFFFFF] hover:shadow-md'
                                }`}
                                onClick={() => handleCloseProfile()}
                            >
                                <svg
                                    className="h-5 w-5 mr-3"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                                Dashboard
                            </li>
                            <li className="flex items-center p-3 rounded-lg text-[#130F0F] hover:bg-[#FFFFFF] hover:shadow-md cursor-pointer transition-colors duration-200">
                                <svg
                                    className="h-5 w-5 mr-3"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.5-1.5a2.25 2.25 0 013 3L11.5 21l-4.5 1 1-4.5L18 8.5z"
                                    />
                                </svg>
                                Campaigns
                            </li>
                        </ul>
                        <h3 className="text-xs font-semibold uppercase text-[#868281] mt-6 mb-2">
                            Team Management
                        </h3>
                        <ul className="space-y-1">
                            {/* Sales Center Link - Now sets page to 'Summary' */}
                            <li
                                className={`flex items-center p-3 rounded-lg text-[#130F0F] cursor-pointer transition-all duration-200 ${
                                    page === 'Summary' || page === 'List'
                                        ? 'border border-[#B7B1B1] bg-white shadow-md'
                                        : 'hover:bg-[#FFFFFF] hover:shadow-md'
                                }`}
                                onClick={() => {
                                    setPage('Summary');
                                    setSelectedContact(null);
                                }}
                            >
                                <svg
                                    className="h-5 w-5 mr-3"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 8c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zM12 18h.01M17 7a2 2 0 012 2v11a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2h10z"
                                    />
                                </svg>
                                Sales Center
                            </li>
                            <li className="flex items-center p-3 rounded-lg text-[#130F0F] hover:bg-[#FFFFFF] hover:shadow-md cursor-pointer transition-colors duration-200">
                                <svg
                                    className="h-5 w-5 mr-3"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 19V6l12-3v13M9 19c-3.314 0-6-2.686-6-6s2.686-6 6-6m12 12c-3.314 0-6-2.686-6-6s2.686-6 6-6m-6 6v3"
                                    />
                                </svg>
                                Sales Pipeline
                            </li>
                        </ul>
                    </nav>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-8 bg-[#F8F9FA]">
                {/* Top Navigation Links (Breadcrumbs) - Simplified to handle Dashboard/Sales Center/List */}
                <div className="flex items-center justify-start mb-6 text-[#A4A2A3]">
                    <div className="flex items-center space-x-2 text-sm">
                        {/* Home Icon */}
                        <a
                            href="#"
                            onClick={() => handleCloseProfile()}
                            className="flex items-center hover:text-[#130F0F] transition-colors duration-200"
                        >
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-10l2-2m-2 2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                            </svg>
                        </a>
                        <span className="text-[#A4A2A3]">/</span>

                        {/* Current Page Text */}
                        <span className="text-[#130F0F] font-semibold transition-colors duration-200">
                            {selectedContact
                                ? `${selectedContact.name} Profile`
                                : breadcrumb}
                        </span>
                    </div>
                </div>

                <div className="border-t border-[#2A2625] mb-6"></div>

                {/* Render content based on page state */}
                {selectedContact ? (
                    // If a contact is selected, show the profile view
                    <ContactProfileView
                        contact={selectedContact}
                        onClose={handleCloseProfile}
                    />
                ) : page === 'Dashboard' ? (
                    renderDashboard()
                ) : page === 'Summary' ? (
                    renderSalesCenterSummary()
                ) : (
                    renderContactsLeadsList()
                )}
            </main>

            {/* New Contact Modal */}
            <NewContactModal isOpen={isModalOpen} onClose={closeModal} />
        </div>
    );
}
