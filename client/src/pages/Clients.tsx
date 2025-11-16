
import React, { useContext, useState, useMemo, lazy, Suspense, useEffect } from 'react';
import { AppContext } from '../App';
import { ViewType, Client } from '../types';
import Button from '../components/ui/Button';
import ClientCard from '../components/clients/ClientCard';
import ClientListItem from '../components/clients/ClientListItem';
import Pagination from '../components/ui/Pagination';
import Modal from '../components/ui/Modal';
import ClientForm from '../components/clients/ClientForm';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

const ClientDetailPage = lazy(() => import('./ClientDetail'));

interface ClientsPageProps {
  selectedClientId: string | null | undefined;
}

const ClientsPage: React.FC<ClientsPageProps> = ({ selectedClientId }) => {
  const { clients, addClient, updateClient, navigateTo } = useContext(AppContext);
  const [view, setView] = useState<ViewType>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ company: 'All', sortBy: 'newest' });

  const ITEMS_PER_PAGE = view === 'grid' ? 6 : 10;

  const selectedClient = useMemo(() => {
    if (!selectedClientId) return null;
    return clients.find(c => c.id === selectedClientId) || null;
  }, [clients, selectedClientId]);

  const uniqueCompanies = useMemo(() => {
    const companies = new Set(clients.map(c => c.company));
    return ['All', ...Array.from(companies).sort()];
  }, [clients]);

  const filteredAndSortedClients = useMemo(() => {
    let result = [...clients];

    // Filter by company
    if (filters.company !== 'All') {
      result = result.filter(client => client.company === filters.company);
    }

    // Filter by search query
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      result = result.filter(client =>
        client.name.toLowerCase().includes(lowercasedQuery) ||
        client.email.toLowerCase().includes(lowercasedQuery) ||
        client.company.toLowerCase().includes(lowercasedQuery)
      );
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return filters.sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [clients, searchQuery, filters]);

  const paginatedClients = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSortedClients.slice(startIndex, endIndex);
  }, [filteredAndSortedClients, currentPage, ITEMS_PER_PAGE]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredAndSortedClients.length, ITEMS_PER_PAGE, filters, searchQuery]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const clearFilters = () => {
      setSearchQuery('');
      setFilters({ company: 'All', sortBy: 'newest' });
  };

  const handleViewChange = (newView: ViewType) => {
    if (view !== newView) {
      setView(newView);
      setCurrentPage(1);
    }
  };

  const handleAddClient = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleSelectClient = (clientId: string) => {
    navigateTo({ page: 'Clients', detailId: clientId });
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
    alert('Import functionality not implemented in this demo.');
  };

  if (selectedClient) {
    return (
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><LoadingSpinner /></div>}>
            <ClientDetailPage client={selectedClient} onEdit={handleEditClient} />
        </Suspense>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Clients</h1>
        <div className="flex items-center space-x-2">
            <div className="hidden md:flex items-center space-x-1 p-1 bg-slate-200 dark:bg-slate-700 rounded-lg">
              <button onClick={() => handleViewChange('grid')} className={`p-2 rounded-md ${view === 'grid' ? 'bg-white dark:bg-slate-800 shadow' : ''}`} aria-label="Grid view"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg></button>
              <button onClick={() => handleViewChange('list')} className={`p-2 rounded-md ${view === 'list' ? 'bg-white dark:bg-slate-800 shadow' : ''}`} aria-label="List view"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg></button>
            </div>
            <Button variant="ghost" onClick={handleImport}>Import CSV</Button>
            <Button onClick={handleAddClient} leftIcon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110 2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>}>Add Client</Button>
        </div>
      </div>

      <div className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg space-y-4">
        <Input 
            type="text"
            placeholder="Search by name, email, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
                <label htmlFor="company" className="sr-only">Filter by Company</label>
                <Select name="company" id="company" value={filters.company} onChange={handleFilterChange}>
                    {uniqueCompanies.map(c => <option key={c} value={c}>{c === 'All' ? 'All Companies' : c}</option>)}
                </Select>
            </div>
            <div className="flex-1">
                <label htmlFor="sortBy" className="sr-only">Sort by</label>
                <Select name="sortBy" id="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                </Select>
            </div>
            <Button variant="ghost" onClick={clearFilters}>Clear All</Button>
        </div>
      </div>
      
      {filteredAndSortedClients.length === 0 ? (
         <div className="text-center py-16">
          <p className="text-slate-500 dark:text-slate-400">No clients found for the selected filters.</p>
        </div>
      ) : (
        <>
            {/* Mobile view: Always list */}
            <div className="md:hidden">
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-none dark:border dark:border-slate-700 overflow-hidden">
                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                  {paginatedClients.map(client => <ClientListItem key={client.id} client={client} onEdit={handleEditClient} onSelect={handleSelectClient}/>)}
                </div>
              </div>
            </div>

            {/* Tablet and Desktop view: Conditional grid/list */}
            <div className="hidden md:block">
              {view === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedClients.map(client => <ClientCard key={client.id} client={client} onEdit={handleEditClient} onSelect={handleSelectClient} />)}
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-none dark:border dark:border-slate-700 overflow-hidden">
                  <div className="divide-y divide-slate-200 dark:divide-slate-700">
                    {paginatedClients.map(client => <ClientListItem key={client.id} client={client} onEdit={handleEditClient} onSelect={handleSelectClient}/>)}
                  </div>
                </div>
              )}
            </div>
            
            <Pagination
              currentPage={currentPage}
              totalItems={filteredAndSortedClients.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
            />
        </>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingClient ? 'Edit Client' : 'Add New Client'}>
        <ClientForm client={editingClient} onSave={handleSaveClient} onCancel={handleCloseModal} />
      </Modal>
    </div>
  );
};

export default ClientsPage;
