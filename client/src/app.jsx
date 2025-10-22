import React, { useState, useMemo } from 'react';
import ContactCard from './components/ContactCard.jsx';
import ContactProfileView from './components/ContactProfileView.jsx';
import CampaignsPage from './components/CampaignsPage.jsx';
import AnalyticsPage from './components/AnalyticsPage.jsx';
import ClientsPage from './components/ClientsPage.jsx';
import Sidebar from './components/Sidebar.jsx';
import SummaryCard from './components/SummaryCard.jsx';
import NewContactModal from './components/NewContactModal.jsx';

// Re-expanded App: sidebar, dashboard, list, summary, and new-contact modal.
// Small UI improvements: consistent button styles, compact cards, and
// clearer action affordances.
export default function App() {
    // Navigation & view state
    const [page, setPage] = useState('Dashboard'); // 'Dashboard' | 'Summary' | 'List' | 'Campaigns'
    const [selectedContact, setSelectedContact] = useState(null);

    // List view state
    const [activeCategory, setActiveCategory] = useState('Contacts'); // 'Contacts' | 'Leads'
    const [viewMode, setViewMode] = useState('recents'); // 'recents' | 'all'
    const [currentPage, setCurrentPage] = useState(1);
    const contactsPerPage = 12;

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeCampaign, setActiveCampaign] = useState(null);

    // Minimal mock data preserved from original file
    const allContacts = useMemo(
        () => [
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
            {
                id: 3,
                name: 'Emily Davis',
                category: 'Contact',
                date: 'Jan 7, 2025',
                email: 'e.davis@webco.org',
                phone: '555-1013',
                lastContactDate: '2024-11-15',
                notes: 'Recently closed a deal.',
            },
            {
                id: 4,
                name: 'Mandevo',
                category: 'Contact',
                date: 'Jan 5, 2025',
                email: 'm.dev@test.dev',
                phone: '555-1014',
                lastContactDate: '2024-12-01',
            },
            {
                id: 5,
                name: 'Mike Wong',
                category: 'Contact',
                date: 'Jan 5, 2025',
                email: 'mike.wong@mail.com',
                phone: '555-1015',
                lastContactDate: '2024-12-15',
            },
            {
                id: 6,
                name: 'New Lead Z',
                category: 'Contact',
                date: 'Jan 5, 2025',
                email: 'new@example.com',
                phone: '555-0000',
                lastContactDate: null,
            },
        ],
        []
    );

    const allLeads = useMemo(
        () => [
            {
                id: 101,
                name: 'John Doe',
                category: 'Lead',
                date: 'Dec 15, 2024',
                email: 'john@lead.io',
                phone: '555-2001',
                lastContactDate: '2024-12-28',
            },
            {
                id: 102,
                name: 'Jane Smith',
                category: 'Lead',
                date: 'Dec 16, 2024',
                email: 'jane@lead.io',
                phone: '555-2002',
            },
        ],
        []
    );

    const dataToDisplay =
        activeCategory === 'Contacts' ? allContacts : allLeads;
    const totalPages = Math.max(
        1,
        Math.ceil(dataToDisplay.length / contactsPerPage)
    );
    const startIndex = (currentPage - 1) * contactsPerPage;
    const endIndex = startIndex + contactsPerPage;
    const paginatedData = dataToDisplay.slice(startIndex, endIndex);

    // Navigation helpers
    const openProfile = (contact) => {
        setSelectedContact(contact);
        setPage(null);
    };

    const closeProfile = () => {
        setSelectedContact(null);
        setPage('Dashboard');
    };

    // Sidebar, SummaryCard, and NewContactModal were extracted into components

    // Render helpers for pages
    const renderDashboard = () => (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold">Dashboard</h1>
                    <p className="text-sm text-gray-500">
                        Key business metrics and quick actions
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="px-4 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition">
                        Add Campaign
                    </button>
                    <button className="px-4 py-2 rounded-lg border border-gray-200">
                        Export
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SummaryCard
                    title="Total Contacts"
                    count={allContacts.length}
                    description="People in your CRM"
                    onClick={() => {
                        setActiveCategory('Contacts');
                        setPage('List');
                    }}
                />
                <SummaryCard
                    title="Leads"
                    count={allLeads.length}
                    description="Active leads in campaigns"
                    onClick={() => {
                        setActiveCategory('Leads');
                        setPage('List');
                    }}
                />
                <SummaryCard
                    title="Campaigns"
                    count={12}
                    description="Total campaigns defined"
                    onClick={() => setPage('Campaigns')}
                />
            </div>

            <div className="mt-8">
                <h2 className="text-lg font-semibold mb-3">Recently Added</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {allContacts.slice(0, 6).map((c) => (
                        <ContactCard
                            key={c.id}
                            contact={c}
                            onClick={openProfile}
                        />
                    ))}
                </div>
            </div>
        </div>
    );

    const renderSalesCenterSummary = () => (
        <div>
            <h1 className="text-2xl font-bold mb-3">Sales Center</h1>
            <p className="text-sm text-gray-500 mb-6">
                Manage contacts, leads and pipeline.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SummaryCard
                    title="Total Contacts"
                    count={allContacts.length}
                    description="All individuals and organizations."
                />
                <SummaryCard
                    title="Active Leads"
                    count={allLeads.length}
                    description="Leads to qualify and contact."
                />
            </div>
        </div>
    );

    const renderContactsLeadsList = () => (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-3">
                    <button
                        className={`px-3 py-2 rounded ${
                            activeCategory === 'Contacts'
                                ? 'bg-brand text-white'
                                : 'bg-white border'
                        }`}
                        onClick={() => setActiveCategory('Contacts')}
                    >
                        Contacts
                    </button>
                    <button
                        className={`px-3 py-2 rounded ${
                            activeCategory === 'Leads'
                                ? 'bg-brand text-white'
                                : 'bg-white border'
                        }`}
                        onClick={() => setActiveCategory('Leads')}
                    >
                        Leads
                    </button>
                </div>

                <div className="flex items-center space-x-3">
                    <select
                        value={viewMode}
                        onChange={(e) => setViewMode(e.target.value)}
                        className="border rounded p-2"
                    >
                        <option value="recents">Recents</option>
                        <option value="all">All</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {viewMode === 'recents'
                    ? (activeCategory === 'Contacts' ? allContacts : allLeads)
                          .slice(0, 12)
                          .map((c) => (
                              <ContactCard
                                  key={c.id}
                                  contact={c}
                                  onClick={openProfile}
                              />
                          ))
                    : paginatedData.map((c) => (
                          <ContactCard
                              key={c.id}
                              contact={c}
                              onClick={openProfile}
                          />
                      ))}
            </div>

            {viewMode === 'all' && (
                <div className="flex justify-center mt-6 space-x-2">
                    <button
                        disabled={currentPage === 1}
                        onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        className="px-3 py-2 border rounded"
                    >
                        Prev
                    </button>
                    <div className="px-3 py-2">
                        {currentPage} / {totalPages}
                    </div>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() =>
                            setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        className="px-3 py-2 border rounded"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <div className="flex min-h-screen bg-neutral-50 text-gray-900">
            <Sidebar
                page={page}
                selectedContact={selectedContact}
                setPage={setPage}
                setSelectedContact={setSelectedContact}
                setIsModalOpen={setIsModalOpen}
            />

            <main className="flex-1 p-8">
                {/* Header / breadcrumbs */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-sm text-gray-500">
                            {selectedContact
                                ? `${selectedContact.name} Profile`
                                : page}
                        </h2>
                    </div>
                </div>

                <div className="space-y-6 container mx-auto max-w-7xl">
                    {selectedContact ? (
                        <ContactProfileView
                            contact={selectedContact}
                            onClose={closeProfile}
                        />
                    ) : page === 'Dashboard' ? (
                        renderDashboard()
                    ) : page === 'Summary' ? (
                        renderSalesCenterSummary()
                    ) : page === 'List' ? (
                        <ClientsPage
                            contacts={[...allContacts, ...allLeads]}
                            onOpenProfile={openProfile}
                        />
                    ) : page === 'Campaigns' ? (
                        <CampaignsPage
                            allContacts={[...allContacts, ...allLeads]}
                            onOpenAnalytics={(c) => {
                                setActiveCampaign(c);
                                setPage('Analytics');
                            }}
                        />
                    ) : page === 'Analytics' ? (
                        <AnalyticsPage activeCampaign={activeCampaign} />
                    ) : (
                        <div />
                    )}
                </div>

                <NewContactModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            </main>
        </div>
    );
}
