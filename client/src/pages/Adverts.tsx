
import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../App';
import { ViewType, Advert, AdvertChannel } from '../types';
import Button from '../components/ui/Button';
import AdvertCard from '../components/adverts/AdvertCard';
import AdvertListItem from '../components/adverts/AdvertListItem';
import Modal from '../components/ui/Modal';
import AdvertForm from '../components/adverts/AdvertForm';
import Input from '../components/ui/Input';

const AdvertsPage: React.FC = () => {
  const { adverts, addAdvert, updateAdvert, deleteAdvert } = useContext(AppContext);
  const [view, setView] = useState<ViewType>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdvert, setEditingAdvert] = useState<Advert | null>(null);
  
  const [statusFilter, setStatusFilter] = useState<'All' | Advert['status']>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState<'All' | AdvertChannel>('All');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const filteredAdverts = useMemo(() => {
    return adverts.filter(ad => {
        if (statusFilter !== 'All' && ad.status !== statusFilter) return false;
        if (channelFilter !== 'All' && ad.channel !== channelFilter) return false;
        
        const adDate = new Date(ad.createdAt);
        adDate.setHours(0,0,0,0);
        if (dateRange.start) {
            const startDate = new Date(dateRange.start);
            if (adDate < startDate) return false;
        }
        if (dateRange.end) {
            const endDate = new Date(dateRange.end);
            if (adDate > endDate) return false;
        }

        if (searchQuery) {
            const lowercasedQuery = searchQuery.toLowerCase();
            if (
                !ad.title.toLowerCase().includes(lowercasedQuery) &&
                !ad.message.toLowerCase().includes(lowercasedQuery)
            ) {
                return false;
            }
        }
        
        return true;
    });
  }, [adverts, statusFilter, channelFilter, dateRange, searchQuery]);

  const handleAddAdvert = () => {
    setEditingAdvert(null);
    setIsModalOpen(true);
  };

  const handleEditAdvert = (advert: Advert) => {
    setEditingAdvert(advert);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAdvert(null);
  };
  
  const handleSaveAdvert = (advertData: Omit<Advert, 'id' | 'createdAt'>) => {
    if(editingAdvert) {
      updateAdvert({ ...editingAdvert, ...advertData });
    } else {
      addAdvert(advertData);
    }
    handleCloseModal();
  };

  const handleDeleteAdvert = (advertId: string) => {
    if (window.confirm('Are you sure you want to delete this advert?')) {
        deleteAdvert(advertId);
    }
  }
  
  const clearAllFilters = () => {
      setSearchQuery('');
      setStatusFilter('All');
      setChannelFilter('All');
      setDateRange({ start: '', end: '' });
  };

  const FilterButton: React.FC<{
    status: 'All' | Advert['status'] | Advert['channel'];
    currentFilter: string;
    setFilter: (value: any) => void;
  }> = ({ status, currentFilter, setFilter }) => (
    <button
      onClick={() => setFilter(status)}
      className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
        currentFilter === status ? 'bg-primary text-white shadow' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600'
      }`}
    >
      {status}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Adverts</h1>
        <div className="flex items-center space-x-2">
            <div className="hidden md:flex items-center space-x-1 p-1 bg-slate-200 dark:bg-slate-700 rounded-lg">
              <button onClick={() => setView('grid')} className={`p-2 rounded-md ${view === 'grid' ? 'bg-white dark:bg-slate-800 shadow' : ''}`} aria-label="Grid view"><svg xmlns="http://www.w.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg></button>
              <button onClick={() => setView('list')} className={`p-2 rounded-md ${view === 'list' ? 'bg-white dark:bg-slate-800 shadow' : ''}`} aria-label="List view"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg></button>
            </div>
            <Button onClick={handleAddAdvert} leftIcon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110 2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>}>New Advert</Button>
        </div>
      </div>
      
      <div className="space-y-4 p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
          <Input 
            type="text"
            placeholder="Search by title or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-1/3"
          />
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold">Status:</span>
                <FilterButton status="All" currentFilter={statusFilter} setFilter={setStatusFilter} />
                <FilterButton status="Sent" currentFilter={statusFilter} setFilter={setStatusFilter} />
                <FilterButton status="Scheduled" currentFilter={statusFilter} setFilter={setStatusFilter} />
                <FilterButton status="Draft" currentFilter={statusFilter} setFilter={setStatusFilter} />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold">Channel:</span>
                <FilterButton status="All" currentFilter={channelFilter} setFilter={setChannelFilter} />
                <FilterButton status="Email" currentFilter={channelFilter} setFilter={setChannelFilter} />
                <FilterButton status="SMS" currentFilter={channelFilter} setFilter={setChannelFilter} />
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
             <div className="flex items-center gap-2">
                 <label htmlFor="startDate" className="text-sm font-semibold">From:</label>
                 <Input type="date" id="startDate" value={dateRange.start} onChange={e => setDateRange(prev => ({...prev, start: e.target.value}))} />
             </div>
             <div className="flex items-center gap-2">
                 <label htmlFor="endDate" className="text-sm font-semibold">To:</label>
                 <Input type="date" id="endDate" value={dateRange.end} onChange={e => setDateRange(prev => ({...prev, end: e.target.value}))} />
             </div>
             <Button variant="ghost" onClick={clearAllFilters}>Clear All</Button>
          </div>
      </div>

      {filteredAdverts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-500 dark:text-slate-400">No adverts found for the selected filters.</p>
        </div>
      ) : (
        <>
          {/* Mobile view: Always list */}
          <div className="md:hidden">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-none dark:border dark:border-slate-700 overflow-hidden">
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredAdverts.map(advert => <AdvertListItem key={advert.id} advert={advert} onEdit={handleEditAdvert} onDelete={handleDeleteAdvert}/>)}
              </div>
            </div>
          </div>

          {/* Tablet and Desktop view: Conditional grid/list */}
          <div className="hidden md:block">
            {view === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAdverts.map(advert => <AdvertCard key={advert.id} advert={advert} onEdit={handleEditAdvert} onDelete={handleDeleteAdvert} />)}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-none dark:border dark:border-slate-700 overflow-hidden">
                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                  {filteredAdverts.map(advert => <AdvertListItem key={advert.id} advert={advert} onEdit={handleEditAdvert} onDelete={handleDeleteAdvert}/>)}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingAdvert ? 'Edit Advert' : 'Create New Advert'}>
        <AdvertForm advert={editingAdvert} onSave={handleSaveAdvert} onCancel={handleCloseModal} />
      </Modal>
    </div>
  );
};

export default AdvertsPage;
