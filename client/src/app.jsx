import React, { useState } from 'react';
import ContactCard from './components/ContactCard.jsx';
import ContactProfileView from './components/ContactProfileView.jsx';
import CampaignsPage from './components/CampaignsPage.jsx';

// Minimal, clean App — no partially-cut aside/nav fragments remain.
export default function App() {
  const [page, setPage] = useState('Dashboard');
  const [selectedContact, setSelectedContact] = useState(null);

  const allContacts = [
    { id: 1, name: 'Jessica Smith', email: 'j.smith@corp.com', phone: '555-1011' },
    { id: 2, name: 'David Johnson', email: 'd.johnson@example.net', phone: '555-1012' },
    { id: 3, name: 'Emily Davis', email: 'e.davis@webco.org', phone: '555-1013' },
  ];

  const allLeads = [{ id: 101, name: 'John Doe', email: 'john@lead.io', phone: '555-2001' }];

  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setPage(null);
  };

  const handleCloseProfile = () => {
    setSelectedContact(null);
    setPage('Dashboard');
  };

  return (
    <div className="flex bg-[#F8F9FA] min-h-screen text-[#130F0F] antialiased font-sans">
      <main className="flex-1 p-8 bg-[#F8F9FA]">
        {selectedContact ? (
          <ContactProfileView contact={selectedContact} onClose={handleCloseProfile} />
        ) : page === 'Dashboard' ? (
          <div>
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {allContacts.map((c) => (
                <ContactCard key={c.id} contact={c} onClick={handleViewContact} />
              ))}
            </div>

            <div className="mt-8">
              <button
                className="px-4 py-2 bg-[#26A248] text-white rounded-lg"
                onClick={() => setPage('Campaigns')}
              >
                Go to Campaigns
              </button>
            </div>
          </div>
        ) : page === 'Campaigns' ? (
          <CampaignsPage allContacts={[...allContacts, ...allLeads]} />
        ) : (
          <div>Other pages (not implemented)</div>
        )}
      </main>
    </div>
  );
}
