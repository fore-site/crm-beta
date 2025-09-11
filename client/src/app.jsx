import React, { useState, useEffect } from 'react';

// Define the base URL for API calls. Use an empty string for relative paths
const API_BASE_URL = 'https://crm-backend-theta-three.vercel.app';

// Main App component
export default function App() {
  const [clients, setClients] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(true);

  // Scroll logic for the mobile banner
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsBannerVisible(false);
      } else {
        setIsBannerVisible(true);
      }
      lastScrollY = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientsRes = await fetch(`${API_BASE_URL}/api/clients`);
        const clientsData = await clientsRes.json();
        setClients(clientsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

        const campaignsRes = await fetch(`${API_BASE_URL}/api/campaigns`);
        const campaignsData = await campaignsRes.json();
        setCampaigns(campaignsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white font-['Roboto']">
        <p className="text-xl animate-pulse">Loading CRM...</p>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard clients={clients} campaigns={campaigns} />;
      case 'clients':
        return <Clients clients={clients} setClients={setClients} />;
      case 'campaigns':
        return <Campaigns clients={clients} campaigns={campaigns} setCampaigns={setCampaigns} />;
      default:
        return <Dashboard clients={clients} campaigns={campaigns} />;
    }
  };

  const NavButton = ({ page, label, icon }) => (
    <button
      onClick={() => {
        setCurrentPage(page);
        setIsSidebarOpen(false);
      }}
      className={`flex items-center w-full px-6 py-4 rounded-xl font-medium transition-all duration-300 transform
        ${currentPage === page
          ? 'bg-blue-600 text-white shadow-lg scale-105'
          : 'text-gray-400 hover:bg-gray-700 hover:text-gray-100'
        }`}
    >
      <span className="mr-4 text-xl">{icon}</span>
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen font-['Roboto'] antialiased bg-gray-100 text-gray-800">
      {/* Fixed Header Banner for Mobile */}
      <header className={`md:hidden fixed top-0 left-0 right-0 z-40 bg-white shadow-md p-4 flex justify-between items-center transition-transform duration-300 ${isBannerVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-600">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
        <div className="text-2xl font-extrabold text-blue-600">Roware</div>
      </header>
      
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-70 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 transform md:relative md:translate-x-0 w-72 bg-gray-900 text-white p-8 shadow-2xl transition-transform duration-500 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-12">
          <div className="hidden md:block text-3xl font-extrabold text-blue-500 tracking-wider">
            <span className="font-light text-white">Roware.</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <nav className="flex flex-col space-y-4 pt-10 md:pt-0">
          <NavButton page="dashboard" label="Dashboard" icon="📈" />
          <NavButton page="clients" label="Clients" icon="👥" />
          <NavButton page="campaigns" label="Campaigns" icon="📧" />
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 transition-all duration-300 mt-16 md:mt-0">
        <header className="flex items-center justify-between mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}
          </h1>
        </header>
        {renderPage()}
      </main>
    </div>
  );
}

const Dashboard = ({ clients, campaigns }) => {
  const recentCampaigns = campaigns.slice(0, 5);

  const StatCard = ({ title, value }) => (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
      <h3 className="text-xl font-semibold text-gray-600">{title}</h3>
      <p className="mt-2 text-5xl font-bold text-gray-900">{value}</p>
    </div>
  );

  const CampaignItem = ({ campaign }) => (
    <li className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-200">
      <div className="flex-1">
        <p className="text-xl font-semibold text-gray-800">{campaign.campaignName}</p>
        <p className="text-sm text-gray-500 mt-1">Created: {new Date(campaign.createdAt).toLocaleDateString()}</p>
      </div>
      <span className={`px-4 py-2 text-xs font-bold rounded-full uppercase tracking-wider ${campaign.status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
        {campaign.status}
      </span>
    </li>
  );

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <StatCard title="Total Clients" value={clients.length} />
        <StatCard title="Total Campaigns" value={campaigns.length} />
        <StatCard title="Sent Campaigns" value={campaigns.filter(c => c.status === 'sent').length} />
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Recent Campaigns</h3>
        {recentCampaigns.length > 0 ? (
          <ul className="space-y-4">
            {recentCampaigns.map((campaign, index) => (
              <CampaignItem key={index} campaign={campaign} />
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-lg">No recent campaigns. Start creating one!</p>
        )}
      </div>
    </div>
  );
};

const Clients = ({ clients, setClients }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [editingClientId, setEditingClientId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDeleteId, setClientToDeleteId] = useState(null);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      setMessage('Please fill in all fields.');
      return;
    }
    if (!validateEmail(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    try {
      const payload = { name, email, phone };
      const res = await fetch(`${API_BASE_URL}/api/clients${editingClientId ? `/${editingClientId}` : ''}`, {
        method: editingClientId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to submit client data.');
      const clientData = await res.json();
      
      if (editingClientId) {
        setClients(prevClients => prevClients.map(c => c._id === clientData._id ? clientData : c));
        setMessage('Client updated successfully!');
      } else {
        setClients(prevClients => [clientData, ...prevClients]);
        setMessage('Client added successfully!');
      }
      resetForm();
    } catch (error) {
      console.error("Error submitting client data:", error);
      setMessage(`Failed to ${editingClientId ? 'update' : 'add'} client.`);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target.result;
      const fileType = file.name.split('.').pop().toLowerCase();
      let clientsToUpload = [];

      try {
        if (fileType === 'json') {
          clientsToUpload = JSON.parse(content);
        } else if (fileType === 'csv') {
          const lines = content.split('\n').filter(line => line.trim() !== '');
          const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            const client = {};
            headers.forEach((header, index) => { client[header] = values[index]; });
            clientsToUpload.push(client);
          }
        } else {
          setMessage('Unsupported file type.');
          return;
        }

        const uploadPromises = clientsToUpload.map(client =>
          fetch(`${API_BASE_URL}/api/clients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(client)
          })
        );
        const results = await Promise.allSettled(uploadPromises);
        const successfulUploads = results.filter(res => res.status === 'fulfilled' && res.value.ok).length;
        setMessage(`${successfulUploads} out of ${clientsToUpload.length} clients uploaded successfully.`);
        const res = await fetch(`${API_BASE_URL}/api/clients`);
        const updatedClientsData = await res.json();
        setClients(updatedClientsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (error) {
        console.error("Error uploading clients:", error);
        setMessage('Failed to upload clients. Please check file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleEditClick = (client) => {
    setName(client.name);
    setEmail(client.email);
    setPhone(client.phone);
    setEditingClientId(client._id);
  };

  const handleDeleteClick = (clientId) => {
    setClientToDeleteId(clientId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/clients/${clientToDeleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete client.');
      setClients(prevClients => prevClients.filter(c => c._id !== clientToDeleteId));
      setMessage('Client deleted successfully!');
      setShowDeleteModal(false);
      setClientToDeleteId(null);
    } catch (error) {
      console.error("Error deleting client:", error);
      setMessage('Failed to delete client.');
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setEditingClientId(null);
  };

  const ClientItem = ({ client }) => (
    <li className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-200">
      <div className="flex-1">
        <p className="text-lg font-semibold text-gray-800">{client.name}</p>
        <p className="text-sm text-gray-500 mt-1">Email: {client.email}</p>
        <p className="text-sm text-gray-500">Phone: {client.phone}</p>
      </div>
      <div className="flex space-x-2 mt-4 sm:mt-0">
        <button
          onClick={() => handleEditClick(client)}
          className="px-4 py-2 text-sm rounded-full font-semibold bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => handleDeleteClick(client._id)}
          className="px-4 py-2 text-sm rounded-full font-semibold bg-white text-red-600 border border-red-600 hover:bg-red-50 transition-colors"
        >
          Delete
        </button>
      </div>
    </li>
  );

  return (
    <div className="space-y-12">
      {message && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 p-6 rounded-2xl shadow-md" role="alert">
          <p>{message}</p>
        </div>
      )}

      {showDeleteModal && (
        <Modal
          title="Confirm Delete"
          message="Are you sure you want to delete this client? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">{editingClientId ? 'Edit Client' : 'Add Client Manually'}</h3>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
          <input
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              type="submit"
              className="flex-1 bg-white text-blue-600 border border-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors shadow-md"
            >
              {editingClientId ? 'Update Client' : 'Add Client'}
            </button>
            {editingClientId && (
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-white text-gray-600 border border-gray-400 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Upload Clients (JSON or CSV)</h3>
        <input
          type="file"
          accept=".json, .csv"
          onChange={handleFileUpload}
          className="w-full text-gray-700 border border-gray-300 rounded-xl p-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
        />
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">All Clients</h3>
        {clients.length > 0 ? (
          <ul className="space-y-4">
            {clients.map(client => <ClientItem key={client._id} client={client} />)}
          </ul>
        ) : (
          <p className="text-gray-500 text-lg">No clients found. Add one above!</p>
        )}
      </div>
    </div>
  );
};

const Campaigns = ({ clients, campaigns, setCampaigns }) => {
  const [campaignName, setCampaignName] = useState('');
  const [advertTitle, setAdvertTitle] = useState('');
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [campaignMessage, setCampaignMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [editingCampaignId, setEditingCampaignId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [campaignToDeleteId, setCampaignToDeleteId] = useState(null);
  const [emailPreview, setEmailPreview] = useState(null);
  const [smsPreview, setSmsPreview] = useState(null);
  const [telegramPreview, setTelegramPreview] = useState(null);
  const [sendConfirmation, setSendConfirmation] = useState(null);

  // Automatically generate previews when relevant state changes
  useEffect(() => {
    if (advertTitle.trim() !== '' || message.trim() !== '' || imageUrl.trim() !== '') {
      generatePreviews();
    } else {
      // Clear previews if fields are empty
      setEmailPreview(null);
      setSmsPreview(null);
      setTelegramPreview(null);
    }
  }, [advertTitle, message, imageUrl]);

  const generatePreviews = () => {
    setEmailPreview(
      <div className="bg-gray-100 p-6 rounded-lg border border-gray-200">
        <h4 className="text-xl font-bold text-gray-800 mb-2">{advertTitle}</h4>
        {imageUrl && <img src={imageUrl} alt="Advert" className="w-full h-auto object-cover rounded-lg mb-4" />}
        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{message}</p>
      </div>
    );
    setSmsPreview(
      <div className="bg-gray-100 p-6 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{advertTitle}</p>
        <p className="text-xs text-gray-500 whitespace-pre-wrap">{message}</p>
        <p className="text-xs text-red-500 mt-2">Note: Images cannot be sent via SMS.</p>
      </div>
    );
    setTelegramPreview(
      <div className="bg-gray-100 p-6 rounded-lg border border-gray-200">
        {imageUrl && <img src={imageUrl} alt="Advert" className="w-full h-auto object-cover rounded-lg mb-2" />}
        <h4 className="font-bold text-gray-800">{advertTitle}</h4>
        <p className="text-gray-700 whitespace-pre-wrap">{message}</p>
      </div>
    );
  };

  const resetForm = () => {
    setCampaignName('');
    setAdvertTitle('');
    setMessage('');
    setImageUrl('');
    setEmailPreview(null);
    setSmsPreview(null);
    setTelegramPreview(null);
    setEditingCampaignId(null);
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    if (!campaignName || !advertTitle || !message) {
      setCampaignMessage('Please fill in all required fields.');
      return;
    }
    try {
      const payload = { campaignName, advertTitle, message, imageUrl };
      const res = await fetch(`${API_BASE_URL}/api/campaigns${editingCampaignId ? `/${editingCampaignId}` : ''}`, {
        method: editingCampaignId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to submit campaign.');
      const campaignData = await res.json();
      if (editingCampaignId) {
        setCampaigns(prev => prev.map(c => c._id === campaignData._id ? campaignData : c));
        setCampaignMessage('Campaign updated successfully!');
      } else {
        setCampaigns(prev => [campaignData, ...prev]);
        setCampaignMessage('Campaign created successfully!');
      }
      resetForm();
    } catch (error) {
      console.error("Error submitting campaign:", error);
      setCampaignMessage(`Failed to ${editingCampaignId ? 'update' : 'create'} campaign.`);
    }
  };

  const handleEditClick = (campaign) => {
    setEditingCampaignId(campaign._id);
    setCampaignName(campaign.campaignName);
    setAdvertTitle(campaign.advertTitle);
    setMessage(campaign.message);
    setImageUrl(campaign.imageUrl);
    generatePreviews();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (campaignId) => {
    setCampaignToDeleteId(campaignId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/campaigns/${campaignToDeleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete campaign.');
      setCampaigns(prev => prev.filter(c => c._id !== campaignToDeleteId));
      setCampaignMessage('Campaign deleted successfully!');
      setShowDeleteModal(false);
      setCampaignToDeleteId(null);
    } catch (error) {
      console.error("Error deleting campaign:", error);
      setCampaignMessage('Failed to delete campaign.');
    }
  };

  const handleSendAd = async (campaign) => {
    if (clients.length === 0) {
      setSendConfirmation({ message: "Cannot send. There are no clients to send to." });
      return;
    }
    setIsSending(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/send/ad`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId: campaign._id })
      });
      if (!res.ok) throw new Error('Failed to send campaign.');
      const updatedCampaignData = await res.json();
      setCampaigns(prev => prev.map(c => c._id === updatedCampaignData.campaign._id ? updatedCampaignData.campaign : c));
      setSendConfirmation({ message: `Campaign "${campaign.campaignName}" successfully sent to all clients.` });
    } catch (error) {
      console.error("Error sending campaign:", error);
      setSendConfirmation({ message: "An error occurred while sending the campaign." });
    } finally {
      setIsSending(false);
    }
  };

  const CampaignItem = ({ campaign }) => (
    <li className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-200">
      <div className="flex-1">
        <p className="text-lg font-semibold text-gray-800">{campaign.campaignName}</p>
        <p className="text-sm text-gray-500 mt-1">
          Created: {new Date(campaign.createdAt).toLocaleDateString()}
          {campaign.status === 'sent' && campaign.sentAt && ` | Sent: ${new Date(campaign.sentAt).toLocaleDateString()}`}
        </p>
        <p className={`text-sm font-semibold mt-2 ${campaign.status === 'sent' ? 'text-green-700' : 'text-orange-700'}`}>
          Status: {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
        </p>
      </div>
      <div className="flex space-x-2 mt-4 sm:mt-0">
        <button
          onClick={() => handleEditClick(campaign)}
          className="px-2 py-1 text-xs rounded-xl font-semibold bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => handleDeleteClick(campaign._id)}
          className="px-2 py-1 text-xs rounded-xl font-semibold bg-white text-red-600 border border-red-600 hover:bg-red-50 transition-colors"
        >
          Delete
        </button>
        <button
          onClick={() => handleSendAd(campaign)}
          disabled={isSending || campaign.status === 'sent'}
          className={`px-2 py-1 text-xs rounded-xl font-semibold transition-colors ${
            isSending || campaign.status === 'sent'
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
          }`}
        >
          {isSending ? 'Sending...' : 'Send Ad'}
        </button>
      </div>
    </li>
  );

  return (
    <div className="space-y-12">
      {campaignMessage && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 p-6 rounded-2xl shadow-md" role="alert">
          <p>{campaignMessage}</p>
        </div>
      )}

      {sendConfirmation && (
        <Modal
          title="Campaign Status"
          message={sendConfirmation.message}
          onConfirm={() => setSendConfirmation(null)}
          confirmText="Close"
        />
      )}

      {showDeleteModal && (
        <Modal
          title="Confirm Delete"
          message="Are you sure you want to delete this campaign? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">{editingCampaignId ? 'Edit Campaign' : 'Create a New Campaign'}</h3>
        <form onSubmit={handleCreateCampaign} className="space-y-6">
          <input
            type="text"
            placeholder="Campaign Name"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
          <input
            type="text"
            placeholder="Advert Title"
            value={advertTitle}
            onChange={(e) => setAdvertTitle(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
          <textarea
            placeholder="Advert Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="5"
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          ></textarea>
          <input
            type="url"
            placeholder="Image URL (e.g., https://example.com/image.jpg)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              type="submit"
              className="flex-1 bg-white text-blue-600 border border-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors shadow-md"
            >
              {editingCampaignId ? 'Update Campaign' : 'Create Campaign'}
            </button>
          </div>
          {editingCampaignId && (
            <button
              type="button"
              onClick={resetForm}
              className="w-full mt-4 bg-white text-gray-600 border border-gray-400 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {(emailPreview || smsPreview || telegramPreview) && (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 space-y-8">
          <h3 className="text-2xl font-bold text-gray-800">Advert Previews</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xl font-semibold mb-4">Email Preview</h4>
              {emailPreview}
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4">SMS Preview</h4>
              {smsPreview}
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4">Telegram Preview</h4>
              {telegramPreview}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Saved Campaigns</h3>
        {campaigns.length > 0 ? (
          <ul className="space-y-4">
            {campaigns.map(campaign => <CampaignItem key={campaign._id} campaign={campaign} />)}
          </ul>
        ) : (
          <p className="text-gray-500 text-lg">No campaigns found. Create a new one above!</p>
        )}
      </div>
    </div>
  );
};

const Modal = ({ title, message, onConfirm, onCancel, confirmText = 'Confirm' }) => (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center p-4 z-50">
    <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      <div className="flex justify-center space-x-4">
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-6 py-3 rounded-full font-semibold bg-white text-gray-700 border border-gray-400 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          onClick={onConfirm}
          className={`px-6 py-3 rounded-full font-semibold ${onCancel ? 'bg-white text-red-600 border border-red-600 hover:bg-red-50' : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'} transition-colors`}
        >
          {confirmText}
        </button>
      </div>
    </div>
  </div>
);
