import React, { useState, useMemo } from 'react';
import ContactCard from './components/ContactCard.jsx';
import ContactProfileView from './components/ContactProfileView.jsx';
import CampaignsPage from './components/CampaignsPage.jsx';

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
      { id: 3, name: 'Emily Davis', category: 'Contact', date: 'Jan 7, 2025', email: 'e.davis@webco.org', phone: '555-1013', lastContactDate: '2024-11-15', notes: 'Recently closed a deal.' },
      { id: 4, name: 'Mandevo', category: 'Contact', date: 'Jan 5, 2025', email: 'm.dev@test.dev', phone: '555-1014', lastContactDate: '2024-12-01' },
      { id: 5, name: 'Mike Wong', category: 'Contact', date: 'Jan 5, 2025', email: 'mike.wong@mail.com', phone: '555-1015', lastContactDate: '2024-12-15' },
      { id: 6, name: 'New Lead Z', category: 'Contact', date: 'Jan 5, 2025', email: 'new@example.com', phone: '555-0000', lastContactDate: null },
    ],
    []
  );

  const allLeads = useMemo(
    () => [
      { id: 101, name: 'John Doe', category: 'Lead', date: 'Dec 15, 2024', email: 'john@lead.io', phone: '555-2001', lastContactDate: '2024-12-28' },
      { id: 102, name: 'Jane Smith', category: 'Lead', date: 'Dec 16, 2024', email: 'jane@lead.io', phone: '555-2002' },
    ],
    []
  );

  const dataToDisplay = activeCategory === 'Contacts' ? allContacts : allLeads;
  const totalPages = Math.max(1, Math.ceil(dataToDisplay.length / contactsPerPage));
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

  // Small UI helper components used inline for readability
  const Sidebar = () => (
    <aside className="w-64 bg-white p-6 border-r border-gray-200 flex flex-col">
      <div className="flex items-center mb-6">
        <div className="h-10 w-10 bg-gray-100 rounded-full" />
        <div className="ml-3">
          <h3 className="font-semibold">Roware Admin</h3>
          <p className="text-xs text-gray-500">admin@roware.xyz</p>
        </div>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <button
              className={`w-full text-left px-3 py-2 rounded-lg ${page === 'Dashboard' && !selectedContact ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}`}
              onClick={() => {
                setPage('Dashboard');
                setSelectedContact(null);
              }}
            >
              Dashboard
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left px-3 py-2 rounded-lg ${page === 'Summary' ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}`}
              onClick={() => setPage('Summary')}
            >
              Sales Center
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left px-3 py-2 rounded-lg ${page === 'List' ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}`}
              onClick={() => setPage('List')}
            >
              Contacts / Leads
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left px-3 py-2 rounded-lg ${page === 'Campaigns' ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}`}
              onClick={() => setPage('Campaigns')}
            >
              Campaigns
            </button>
          </li>
        </ul>
      </nav>

      <div className="mt-6">
        <button className="w-full px-3 py-2 bg-[#26A248] text-white rounded-lg" onClick={() => setIsModalOpen(true)}>
          New Contact
        </button>
      </div>
    </aside>
  );

  // Simplified SummaryCard (kept inline to avoid many small files)
  const SummaryCard = ({ title, count, description, onClick }) => (
    <div className="p-4 bg-white rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold">{title}</h4>
          <p className="text-2xl font-bold mt-2">{count}</p>
        </div>
        <div>
          <button onClick={onClick} className="text-sm text-gray-500 hover:text-gray-700">View</button>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2">{description}</p>
    </div>
  );

  // NewContactModal (compact and functional)
  const NewContactModal = ({ isOpen, onClose }) => {
    const [form, setForm] = useState({ name: '', email: '', phone: '' });

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-40">
        <div className="bg-white rounded-lg p-6 w-full max-w-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Add New Contact</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">Close</button>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log('Create contact', form);
              onClose();
            }}
          >
            <label className="block text-sm">Full name</label>
            <input className="w-full p-2 border rounded mb-3" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <label className="block text-sm">Email</label>
            <input className="w-full p-2 border rounded mb-3" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <label className="block text-sm">Phone</label>
            <input className="w-full p-2 border rounded mb-3" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <div className="flex justify-end">
              <button type="button" onClick={onClose} className="mr-2 px-4 py-2 rounded border">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded bg-[#26A248] text-white">Add</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Render helpers for pages
  const renderDashboard = () => (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-500">Key business metrics and quick actions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard title="Total Contacts" count={allContacts.length} description="People in your CRM" onClick={() => { setActiveCategory('Contacts'); setPage('List'); }} />
        <SummaryCard title="Leads" count={allLeads.length} description="Active leads in campaigns" onClick={() => { setActiveCategory('Leads'); setPage('List'); }} />
        <SummaryCard title="Campaigns" count={12} description="Total campaigns defined" onClick={() => setPage('Campaigns')} />
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-3">Recently Added</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {allContacts.slice(0, 6).map((c) => (
            <ContactCard key={c.id} contact={c} onClick={openProfile} />
          ))}
        </div>
      </div>
    </div>
  );

  const renderSalesCenterSummary = () => (
    <div>
      <h1 className="text-2xl font-bold mb-3">Sales Center</h1>
      <p className="text-sm text-gray-500 mb-6">Manage contacts, leads and pipeline.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SummaryCard title="Total Contacts" count={allContacts.length} description="All individuals and organizations." />
        <SummaryCard title="Active Leads" count={allLeads.length} description="Leads to qualify and contact." />
      </div>
    </div>
  );

  const renderContactsLeadsList = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-3">
          <button className={`px-3 py-2 rounded ${activeCategory === 'Contacts' ? 'bg-[#26A248] text-white' : 'bg-white border'}`} onClick={() => setActiveCategory('Contacts')}>Contacts</button>
          <button className={`px-3 py-2 rounded ${activeCategory === 'Leads' ? 'bg-[#26A248] text-white' : 'bg-white border'}`} onClick={() => setActiveCategory('Leads')}>Leads</button>
        </div>

        <div className="flex items-center space-x-3">
          <select value={viewMode} onChange={(e) => setViewMode(e.target.value)} className="border rounded p-2">
            <option value="recents">Recents</option>
            <option value="all">All</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {viewMode === 'recents' ? (
          (activeCategory === 'Contacts' ? allContacts : allLeads).slice(0, 12).map((c) => (
            <ContactCard key={c.id} contact={c} onClick={openProfile} />
          ))
        ) : (
          paginatedData.map((c) => <ContactCard key={c.id} contact={c} onClick={openProfile} />)
        )}
      </div>

      {viewMode === 'all' && (
        <div className="flex justify-center mt-6 space-x-2">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} className="px-3 py-2 border rounded">Prev</button>
          <div className="px-3 py-2">{currentPage} / {totalPages}</div>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} className="px-3 py-2 border rounded">Next</button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 text-[#130F0F]">
      <Sidebar />

      <main className="flex-1 p-8">
        {/* Header / breadcrumbs */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm text-gray-500">{selectedContact ? `${selectedContact.name} Profile` : page}</h2>
          </div>
        </div>

        <div className="space-y-6">
          {selectedContact ? (
            <ContactProfileView contact={selectedContact} onClose={closeProfile} />
          ) : page === 'Dashboard' ? (
            renderDashboard()
          ) : page === 'Summary' ? (
            renderSalesCenterSummary()
          ) : page === 'List' ? (
            renderContactsLeadsList()
          ) : page === 'Campaigns' ? (
            <CampaignsPage allContacts={[...allContacts, ...allLeads]} />
          ) : (
            <div />
          )}
        </div>

        <NewContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </main>
    </div>
  );
}
