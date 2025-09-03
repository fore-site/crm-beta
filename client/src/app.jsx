// File: src/App.jsx
// This is the main application component. Place this in a file named `App.jsx` inside a `src` folder.

import React, { useState, useEffect } from 'react';

// Define the base URL for API calls. Use an empty string for relative paths
// which work when the frontend and backend are on the same domain.
const API_BASE_URL = '';

// Main App component
export default function App() {
    // State for application data
    const [clients, setClients] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    // State for UI navigation
    const [currentPage, setCurrentPage] = useState('dashboard');

    // Data fetching from backend API
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch clients data from the backend API
                const clientsRes = await fetch(
                    `https://crm-backend-theta-three.vercel.app/api/clients`
                );
                const clientsData = await clientsRes.json();
                // Sort clients by creation date in descending order
                setClients(
                    clientsData.sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    )
                );

                // Fetch campaigns data from the backend API
                const campaignsRes = await fetch(
                    `https://crm-backend-theta-three.vercel.app/api/campaigns`
                );
                const campaignsData = await campaignsRes.json();
                // Sort campaigns by creation date in descending order
                setCampaigns(
                    campaignsData.sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    )
                );

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // If data is still loading, show a loading message
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50 p-8">
                <p className="text-gray-600 text-lg">Loading CRM...</p>
            </div>
        );
    }

    // Helper function to render the current page based on state
    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <Dashboard clients={clients} campaigns={campaigns} />;
            case 'clients':
                return <Clients clients={clients} setClients={setClients} />;
            case 'campaigns':
                return (
                    <Campaigns
                        clients={clients}
                        campaigns={campaigns}
                        setCampaigns={setCampaigns}
                    />
                );
            default:
                return <Dashboard clients={clients} campaigns={campaigns} />;
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen font-sans antialiased text-gray-800 p-6">
            {/* Navigation bar */}
            <nav className="flex items-center justify-between bg-white shadow-lg rounded-xl p-6 mb-8">
                <h1 className="text-3xl font-extrabold text-indigo-700 tracking-tight">
                    Ad CRM
                </h1>
                <div className="flex space-x-2 sm:space-x-4">
                    <button
                        onClick={() => setCurrentPage('dashboard')}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                            currentPage === 'dashboard'
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'text-gray-600 hover:bg-slate-100 hover:text-indigo-600'
                        }`}
                    >
                        Dashboard
                    </button>
                    <button
                        onClick={() => setCurrentPage('clients')}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                            currentPage === 'clients'
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'text-gray-600 hover:bg-slate-100 hover:text-indigo-600'
                        }`}
                    >
                        Clients
                    </button>
                    <button
                        onClick={() => setCurrentPage('campaigns')}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                            currentPage === 'campaigns'
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'text-gray-600 hover:bg-slate-100 hover:text-indigo-600'
                        }`}
                    >
                        Campaigns
                    </button>
                </div>
            </nav>

            {/* Main content area */}
            <main className="container mx-auto">{renderPage()}</main>
        </div>
    );
}

// Dashboard Page Component
const Dashboard = ({ clients, campaigns }) => {
    const recentCampaigns = campaigns.slice(0, 5); // Show up to 5 recent campaigns

    return (
        <div className="space-y-10">
            <h2 className="text-4xl font-bold text-gray-700 mb-6">Overview</h2>

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <h3 className="text-xl font-semibold text-gray-600">
                        Total Clients
                    </h3>
                    <p className="mt-2 text-5xl font-extrabold text-indigo-600">
                        {clients.length}
                    </p>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <h3 className="text-xl font-semibold text-gray-600">
                        Total Campaigns
                    </h3>
                    <p className="mt-2 text-5xl font-extrabold text-teal-600">
                        {campaigns.length}
                    </p>
                </div>
            </div>

            {/* Recent Campaigns section */}
            <div className="bg-white p-10 rounded-xl shadow-lg">
                <h3 className="text-2xl font-semibold text-gray-700 mb-6">
                    Recent Campaigns
                </h3>
                {recentCampaigns.length > 0 ? (
                    <ul className="space-y-4">
                        {recentCampaigns.map((campaign, index) => (
                            <li
                                key={index}
                                className="border-b border-gray-200 pb-4 last:border-b-0"
                            >
                                <p className="text-lg font-medium text-gray-700">
                                    {campaign.campaignName}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Created:{' '}
                                    {new Date(
                                        campaign.createdAt
                                    ).toLocaleDateString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">
                        No recent campaigns. Create a new one!
                    </p>
                )}
            </div>
        </div>
    );
};

// Clients Page Component
const Clients = ({ clients, setClients }) => {
    // State for managing add and edit form
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [editingClientId, setEditingClientId] = useState(null);

    // State for delete confirmation modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [clientToDeleteId, setClientToDeleteId] = useState(null);

    // Helper function to validate email
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // Function to handle form submission (Add or Update)
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email || !phone) {
            setMessage('Please fill in all fields: Name, Email, and Phone.');
            return;
        }
        if (!validateEmail(email)) {
            setMessage('Please enter a valid email address.');
            return;
        }

        try {
            if (editingClientId) {
                // Handle update logic
                const res = await fetch(
                    `https://crm-backend-theta-three.vercel.app/api/clients/${editingClientId}`,
                    {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name, email, phone }),
                    }
                );
                if (!res.ok) throw new Error('Failed to update client.');
                const updatedClient = await res.json();
                setClients((prevClients) =>
                    prevClients.map((c) =>
                        c._id === updatedClient._id ? updatedClient : c
                    )
                );
                setMessage('Client updated successfully!');
            } else {
                // Handle add logic
                const res = await fetch(
                    `https://crm-backend-theta-three.vercel.app/api/clients`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name, email, phone }),
                    }
                );
                if (!res.ok) throw new Error('Failed to add client.');
                const newClient = await res.json();
                setClients((prevClients) => [newClient, ...prevClients]);
                setMessage('Client added successfully!');
            }
            // Reset the form
            resetForm();
        } catch (error) {
            console.error('Error submitting client data: ', error);
            setMessage('Failed to submit client data.');
        }
    };

    // Function to handle file upload (JSON or CSV)
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
                    const lines = content
                        .split('\n')
                        .filter((line) => line.trim() !== '');
                    const headers = lines[0]
                        .split(',')
                        .map((h) => h.trim().toLowerCase());
                    for (let i = 1; i < lines.length; i++) {
                        const values = lines[i].split(',').map((v) => v.trim());
                        const client = {};
                        headers.forEach((header, index) => {
                            client[header] = values[index];
                        });
                        clientsToUpload.push(client);
                    }
                } else {
                    setMessage(
                        'Unsupported file type. Please upload a JSON or CSV file.'
                    );
                    return;
                }

                for (const client of clientsToUpload) {
                    if (!client.name || !client.email || !client.phone) {
                        setMessage(
                            `File upload failed: Client data must include name, email, and phone.`
                        );
                        return;
                    }
                    if (!validateEmail(client.email)) {
                        setMessage(
                            `File upload failed: Invalid email format for client "${client.name}".`
                        );
                        return;
                    }
                }

                const uploadPromises = clientsToUpload.map((client) =>
                    fetch(
                        `https://crm-backend-theta-three.vercel.app/api/clients`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(client),
                        }
                    )
                );
                const results = await Promise.allSettled(uploadPromises);
                const successfulUploads = results.filter(
                    (res) => res.status === 'fulfilled' && res.value.ok
                ).length;

                setMessage(
                    `${successfulUploads} out of ${clientsToUpload.length} clients uploaded successfully!`
                );

                // Re-fetch all clients to update the list
                const res = await fetch(
                    `https://crm-backend-theta-three.vercel.app/api/clients`
                );
                const updatedClientsData = await res.json();
                setClients(
                    updatedClientsData.sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    )
                );
            } catch (error) {
                console.error('Error uploading clients: ', error);
                setMessage(
                    'Failed to upload clients. Please check file format and data.'
                );
            }
        };
        reader.readAsText(file);
    };

    // Function to set up the form for editing
    const handleEditClick = (client) => {
        setName(client.name);
        setEmail(client.email);
        setPhone(client.phone);
        setEditingClientId(client._id);
    };

    // Function to delete a client
    const handleDeleteClick = (clientId) => {
        setClientToDeleteId(clientId);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            const res = await fetch(
                `https://crm-backend-theta-three.vercel.app/api/clients/${clientToDeleteId}`,
                {
                    method: 'DELETE',
                }
            );
            if (!res.ok) throw new Error('Failed to delete client.');

            setClients((prevClients) =>
                prevClients.filter((c) => c._id !== clientToDeleteId)
            );
            setMessage('Client deleted successfully!');
            setShowDeleteModal(false);
            setClientToDeleteId(null);
        } catch (error) {
            console.error('Error deleting client:', error);
            setMessage('Failed to delete client.');
        }
    };

    // Function to reset the form
    const resetForm = () => {
        setName('');
        setEmail('');
        setPhone('');
        setEditingClientId(null);
    };

    return (
        <div className="space-y-10">
            <h2 className="text-4xl font-bold text-gray-700 mb-6">
                {editingClientId ? 'Edit Client' : 'Add Client'}
            </h2>

            {message && (
                <div
                    className="bg-indigo-100 border-l-4 border-indigo-500 text-indigo-700 p-4 rounded-lg"
                    role="alert"
                >
                    <p>{message}</p>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm mx-auto transform scale-95 md:scale-100 transition-all duration-300">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            Confirm Delete
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this client? This
                            action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-6 py-3 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Manual Add/Edit Client Form */}
            <div className="bg-white p-10 rounded-xl shadow-lg">
                <h3 className="text-2xl font-semibold text-gray-700 mb-6">
                    {editingClientId ? 'Edit Client' : 'Add Client Manually'}
                </h3>
                <form onSubmit={handleFormSubmit} className="space-y-6">
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                    />
                    <input
                        type="tel"
                        placeholder="Phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                    />
                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            className="flex-1 bg-indigo-600 text-white p-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
                        >
                            {editingClientId ? 'Update Client' : 'Add Client'}
                        </button>
                        {editingClientId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="flex-1 bg-gray-400 text-white p-4 rounded-lg font-semibold hover:bg-gray-500 transition-colors shadow-md hover:shadow-lg"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* File Upload Section */}
            <div className="bg-white p-10 rounded-xl shadow-lg">
                <h3 className="text-2xl font-semibold text-gray-700 mb-6">
                    Upload Clients (JSON or CSV)
                </h3>
                <input
                    type="file"
                    accept=".json, .csv"
                    onChange={handleFileUpload}
                    className="w-full text-gray-700 border border-gray-300 rounded-lg p-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-colors"
                />
            </div>

            {/* All Clients List */}
            <div className="bg-white p-10 rounded-xl shadow-lg">
                <h3 className="text-2xl font-semibold text-gray-700 mb-6">
                    All Clients
                </h3>
                {clients.length > 0 ? (
                    <ul className="space-y-4">
                        {clients.map((client) => (
                            <li
                                key={client._id}
                                className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-slate-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                            >
                                <div className="flex-1">
                                    <p className="text-lg font-medium text-gray-700">
                                        {client.name}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Email: {client.email}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Phone: {client.phone}
                                    </p>
                                </div>
                                <div className="flex space-x-2 mt-4 md:mt-0">
                                    <button
                                        onClick={() => handleEditClick(client)}
                                        className="px-4 py-2 text-sm rounded-lg font-semibold text-indigo-600 bg-indigo-100 hover:bg-indigo-200 transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDeleteClick(client._id)
                                        }
                                        className="px-4 py-2 text-sm rounded-lg font-semibold text-red-600 bg-red-100 hover:bg-red-200 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">
                        No clients found. Add one above!
                    </p>
                )}
            </div>
        </div>
    );
};

// Campaigns Page Component
const Campaigns = ({ clients, campaigns, setCampaigns }) => {
    // State for creating a new campaign
    const [campaignName, setCampaignName] = useState('');
    const [advertTitle, setAdvertTitle] = useState('');
    const [message, setMessage] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [campaignMessage, setCampaignMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    // States for editing an existing campaign
    const [editingCampaignId, setEditingCampaignId] = useState(null);

    // States for delete confirmation
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [campaignToDeleteId, setCampaignToDeleteId] = useState(null);

    // State for preview content
    const [emailPreview, setEmailPreview] = useState(null);
    const [smsPreview, setSmsPreview] = useState(null);
    const [telegramPreview, setTelegramPreview] = useState(null);

    // State for send confirmation message box
    const [sendConfirmation, setSendConfirmation] = useState(null);

    // Function to generate and display previews
    const generatePreviews = () => {
        // Email Preview (HTML)
        setEmailPreview(
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="text-xl font-bold text-gray-800 mb-2">
                    {advertTitle}
                </h4>
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt="Advert"
                        className="w-full h-auto object-cover rounded-lg mb-4"
                    />
                )}
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {message}
                </p>
            </div>
        );

        // SMS Preview (Plain Text)
        setSmsPreview(
            <div className="bg-slate-50 p-6 rounded-lg shadow-md">
                <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {advertTitle}
                    </p>
                    <p className="text-xs text-gray-500 whitespace-pre-wrap">
                        {message}
                    </p>
                    <p className="text-xs text-red-500 mt-2">
                        Note: Images cannot be sent via SMS.
                    </p>
                </div>
            </div>
        );

        // Telegram Preview (with image and rich text)
        setTelegramPreview(
            <div className="bg-white p-6 rounded-lg shadow-md">
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt="Advert"
                        className="w-full h-auto object-cover rounded-lg mb-2"
                    />
                )}
                <h4 className="font-bold text-gray-800">{advertTitle}</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{message}</p>
            </div>
        );
    };

    // Function to reset the form after creating or updating a campaign
    const resetForm = () => {
        setCampaignName('');
        setAdvertTitle('');
        setMessage('');
        setImageUrl('');
        setEmailPreview(null);
        setSmsPreview(null);
        setTelegramPreview(null);
        setEditingCampaignId(null); // Clear editing state
    };

    // Function to save the campaign
    const handleCreateCampaign = async (e) => {
        e.preventDefault();
        if (!campaignName || !advertTitle || !message) {
            setCampaignMessage('Please fill in all required fields.');
            return;
        }

        try {
            if (editingCampaignId) {
                // Update existing campaign
                const res = await fetch(
                    `https://crm-backend-theta-three.vercel.app/api/campaigns/${editingCampaignId}`,
                    {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            campaignName,
                            advertTitle,
                            message,
                            imageUrl,
                        }),
                    }
                );
                if (!res.ok) throw new Error('Failed to update campaign.');

                const updatedCampaign = await res.json();
                setCampaigns((prev) =>
                    prev.map((c) =>
                        c._id === updatedCampaign._id ? updatedCampaign : c
                    )
                );
                setCampaignMessage('Campaign updated successfully!');
            } else {
                // Create new campaign
                const res = await fetch(
                    `https://crm-backend-theta-three.vercel.app/api/campaigns`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            campaignName,
                            advertTitle,
                            message,
                            imageUrl,
                        }),
                    }
                );
                if (!res.ok) throw new Error('Failed to create campaign.');

                const newCampaign = await res.json();
                setCampaigns((prev) => [newCampaign, ...prev]);
                setCampaignMessage('Campaign created successfully!');
            }
            resetForm();
        } catch (error) {
            console.error('Error creating/updating campaign:', error);
            setCampaignMessage(
                `Failed to ${editingCampaignId ? 'update' : 'create'} campaign.`
            );
        }
    };

    // Function to handle editing a campaign
    const handleEditClick = (campaign) => {
        setEditingCampaignId(campaign._id);
        setCampaignName(campaign.campaignName);
        setAdvertTitle(campaign.advertTitle);
        setMessage(campaign.message);
        setImageUrl(campaign.imageUrl);
        generatePreviews(); // Re-generate previews for the existing data
        // Scroll to the top of the form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Function to handle deleting a campaign
    const handleDeleteClick = (campaignId) => {
        setCampaignToDeleteId(campaignId);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            const res = await fetch(
                `https://crm-backend-theta-three.vercel.app/api/campaigns/${campaignToDeleteId}`,
                {
                    method: 'DELETE',
                }
            );
            if (!res.ok) throw new Error('Failed to delete campaign.');

            setCampaigns((prev) =>
                prev.filter((c) => c._id !== campaignToDeleteId)
            );
            setCampaignMessage('Campaign deleted successfully!');
            setShowDeleteModal(false);
            setCampaignToDeleteId(null);
        } catch (error) {
            console.error('Error deleting campaign:', error);
            setCampaignMessage('Failed to delete campaign.');
        }
    };

    // Function to send the advert to clients
    const handleSendAd = async (campaign) => {
        // Check if there are clients to send to
        if (clients.length === 0) {
            setSendConfirmation({
                campaignName: campaign.campaignName,
                message:
                    'Cannot send. There are no clients to send to. Please add clients first.',
            });
            return;
        }

        setIsSending(true);

        try {
            const res = await fetch(
                `https://crm-backend-theta-three.vercel.app/api/send/ad`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ campaignId: campaign._id }),
                }
            );

            if (!res.ok) throw new Error('Failed to send campaign.');

            const updatedCampaign = await res.json();
            setCampaigns((prev) =>
                prev.map((c) =>
                    c._id === updatedCampaign.campaign._id
                        ? updatedCampaign.campaign
                        : c
                )
            );

            // Show the confirmation modal
            setSendConfirmation({
                campaignName: campaign.campaignName,
                message: `Your campaign "${campaign.campaignName}" has been successfully sent to all clients via Email, SMS, and Telegram.`,
            });
        } catch (error) {
            console.error('Error sending campaign:', error);
            setSendConfirmation({
                campaignName: campaign.campaignName,
                message:
                    'An error occurred while sending the campaign. Please check the console for details.',
            });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="space-y-10">
            <h2 className="text-4xl font-bold text-gray-700 mb-6">
                {editingCampaignId ? 'Edit Campaign' : 'Create Campaign'}
            </h2>
            {campaignMessage && (
                <div
                    className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg"
                    role="alert"
                >
                    <p>{campaignMessage}</p>
                </div>
            )}

            {/* Modal for send confirmation */}
            {sendConfirmation && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm mx-auto transform scale-95 md:scale-100 transition-all duration-300">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            Campaign Status
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {sendConfirmation.message}
                        </p>
                        <button
                            onClick={() => setSendConfirmation(null)}
                            className="w-full bg-indigo-600 text-white p-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Modal for delete confirmation */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm mx-auto transform scale-95 md:scale-100 transition-all duration-300">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            Confirm Delete
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this campaign? This
                            action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-6 py-3 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Campaign Form */}
            <div className="bg-white p-10 rounded-xl shadow-lg">
                <h3 className="text-2xl font-semibold text-gray-700 mb-6">
                    {editingCampaignId ? 'Edit Campaign' : 'Create Campaign'}
                </h3>
                <form onSubmit={handleCreateCampaign} className="space-y-6">
                    <input
                        type="text"
                        placeholder="Campaign Name"
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                    />
                    <input
                        type="text"
                        placeholder="Advert Title"
                        value={advertTitle}
                        onChange={(e) => setAdvertTitle(e.target.value)}
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                    />
                    <textarea
                        placeholder="Advert Message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows="5"
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                    ></textarea>

                    {/* Image URL input */}
                    <p className="text-gray-500 text-sm">
                        Paste a public image URL here for best results in
                        emails.
                    </p>
                    <input
                        type="url"
                        placeholder="Image URL (e.g., https://example.com/image.jpg)"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                    />

                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                        <button
                            type="button"
                            onClick={generatePreviews}
                            className="flex-1 bg-gray-500 text-white p-4 rounded-lg font-semibold hover:bg-gray-600 transition-colors shadow-md hover:shadow-lg"
                        >
                            Show Previews
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-indigo-600 text-white p-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
                        >
                            {editingCampaignId
                                ? 'Update Campaign'
                                : 'Create Campaign'}
                        </button>
                    </div>
                    {editingCampaignId && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="w-full mt-4 bg-gray-400 text-white p-4 rounded-lg font-semibold hover:bg-gray-500 transition-colors shadow-md hover:shadow-lg"
                        >
                            Cancel Edit
                        </button>
                    )}
                </form>
            </div>

            {/* Previews Section */}
            {(emailPreview || smsPreview || telegramPreview) && (
                <div className="space-y-6">
                    <h3 className="text-2xl font-semibold text-gray-700">
                        Advert Previews
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-8 rounded-xl shadow-lg">
                            <h4 className="text-xl font-semibold mb-4">
                                Email Preview
                            </h4>
                            {emailPreview}
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-lg">
                            <h4 className="text-xl font-semibold mb-4">
                                SMS Preview
                            </h4>
                            {smsPreview}
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-lg">
                            <h4 className="text-xl font-semibold mb-4">
                                Telegram Preview
                            </h4>
                            {telegramPreview}
                        </div>
                    </div>
                </div>
            )}

            {/* Campaigns List Section */}
            <div className="bg-white p-10 rounded-xl shadow-lg">
                <h3 className="text-2xl font-semibold text-gray-700 mb-6">
                    Saved Campaigns
                </h3>
                {campaigns.length > 0 ? (
                    <ul className="space-y-4">
                        {campaigns.map((campaign) => (
                            <li
                                key={campaign._id}
                                className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-slate-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                            >
                                <div className="flex-1">
                                    <p className="text-lg font-medium text-gray-700">
                                        {campaign.campaignName}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Created:{' '}
                                        {new Date(
                                            campaign.createdAt
                                        ).toLocaleDateString()}
                                        {campaign.status === 'sent' &&
                                            campaign.sentAt &&
                                            ` | Sent: ${new Date(
                                                campaign.sentAt
                                            ).toLocaleDateString()}`}
                                    </p>
                                    <p
                                        className={`text-sm font-semibold mt-2 ${
                                            campaign.status === 'sent'
                                                ? 'text-teal-600'
                                                : 'text-orange-500'
                                        }`}
                                    >
                                        Status:{' '}
                                        {campaign.status
                                            .charAt(0)
                                            .toUpperCase() +
                                            campaign.status.slice(1)}
                                    </p>
                                </div>
                                <div className="flex space-x-2 mt-4 md:mt-0">
                                    <button
                                        onClick={() =>
                                            handleEditClick(campaign)
                                        }
                                        className="px-4 py-2 text-sm rounded-lg font-semibold text-indigo-600 bg-indigo-100 hover:bg-indigo-200 transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDeleteClick(campaign._id)
                                        }
                                        className="px-4 py-2 text-sm rounded-lg font-semibold text-red-600 bg-red-100 hover:bg-red-200 transition-colors"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => handleSendAd(campaign)}
                                        disabled={
                                            isSending ||
                                            campaign.status === 'sent'
                                        }
                                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                                            isSending ||
                                            campaign.status === 'sent'
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        }`}
                                    >
                                        {isSending
                                            ? 'Sending...'
                                            : 'Send Ad to Clients'}
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">
                        No campaigns found. Create a new one above!
                    </p>
                )}
            </div>
        </div>
    );
};
