
import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../App';
import { ViewType, Client } from '../types';
import Button from '../components/ui/Button';
import ClientCard from '../components/clients/ClientCard';
import ClientListItem from '../components/clients/ClientListItem';
import Pagination from '../components/ui/Pagination';
import Modal from '../components/ui/Modal';
import ClientForm from '../components/clients/ClientForm';

const ITEMS_PER_PAGE = 10;

const ClientsPage: React.FC = () => {
  const { clients, addClient, updateClient } = useContext(AppContext);
  const [view, setView] = useState<ViewType>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const paginatedClients = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return clients.slice(startIndex, endIndex);
  }, [clients, currentPage]);

  const handleAddClient = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
  };
  
  const handleSaveClient = (clientData: Omit<Client, 'id' | 'createdAt' | 'avatarUrl'>) => {
    if(editingClient) {
      updateClient({ ...editingClient, ...clientData });
    } else {
      addClient(clientData);
    }
    handleCloseModal();
  };
  
  const handleImport = () => {
    // In a real app, this would trigger a file picker and CSV parsing logic.
    alert('Import functionality not implemented in this demo.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
        <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
        <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 p-1 bg-gray-200 rounded-lg">
              <button onClick={() => setView('grid')} className={`p-2 rounded-md ${view === 'grid' ? 'bg-white shadow' : ''}`} aria-label="Grid view"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg></button>
              <button onClick={() => setView('list')} className={`p-2 rounded-md ${view === 'list' ? 'bg-white shadow' : ''}`} aria-label="List view"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg></button>
            </div>
            <Button variant="ghost" onClick={handleImport}>Import CSV</Button>
            <Button onClick={handleAddClient} leftIcon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110 2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>}>Add Client</Button>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {paginatedClients.map(client => <ClientCard key={client.id} client={client} onEdit={handleEditClient} />)}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="divide-y divide-gray-200">
            {paginatedClients.map(client => <ClientListItem key={client.id} client={client} onEdit={handleEditClient}/>)}
          </div>
        </div>
      )}
      
      <Pagination
        currentPage={currentPage}
        totalItems={clients.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingClient ? 'Edit Client' : 'Add New Client'}>
        <ClientForm client={editingClient} onSave={handleSaveClient} onCancel={handleCloseModal} />
      </Modal>
    </div>
  );
};

export default ClientsPage;