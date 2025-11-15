
import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../App';
import { ViewType, Advert } from '../types';
import Button from '../components/ui/Button';
import AdvertCard from '../components/adverts/AdvertCard';
import AdvertListItem from '../components/adverts/AdvertListItem';
import Modal from '../components/ui/Modal';
import AdvertForm from '../components/adverts/AdvertForm';

const AdvertsPage: React.FC = () => {
  const { adverts, addAdvert, updateAdvert, deleteAdvert } = useContext(AppContext);
  const [view, setView] = useState<ViewType>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdvert, setEditingAdvert] = useState<Advert | null>(null);
  
  const [filter, setFilter] = useState<'All' | Advert['status']>('All');

  const filteredAdverts = useMemo(() => {
    if (filter === 'All') return adverts;
    return adverts.filter(ad => ad.status === filter);
  }, [adverts, filter]);

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

  const FilterButton: React.FC<{ status: 'All' | Advert['status'] }> = ({ status }) => (
    <button
      onClick={() => setFilter(status)}
      className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
        filter === status ? 'bg-primary text-white shadow' : 'bg-white text-gray-600 hover:bg-gray-100'
      }`}
    >
      {status}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
        <h1 className="text-3xl font-bold text-gray-900">Adverts</h1>
        <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 p-1 bg-gray-200 rounded-lg">
              <button onClick={() => setView('grid')} className={`p-2 rounded-md ${view === 'grid' ? 'bg-white shadow' : ''}`} aria-label="Grid view"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg></button>
              <button onClick={() => setView('list')} className={`p-2 rounded-md ${view === 'list' ? 'bg-white shadow' : ''}`} aria-label="List view"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg></button>
            </div>
            <Button onClick={handleAddAdvert} leftIcon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110 2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>}>New Advert</Button>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <FilterButton status="All" />
        <FilterButton status="Sent" />
        <FilterButton status="Scheduled" />
        <FilterButton status="Draft" />
      </div>

      {filteredAdverts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500">No adverts found for this filter.</p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filteredAdverts.map(advert => <AdvertCard key={advert.id} advert={advert} onEdit={handleEditAdvert} onDelete={handleDeleteAdvert} />)}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredAdverts.map(advert => <AdvertListItem key={advert.id} advert={advert} onEdit={handleEditAdvert} onDelete={handleDeleteAdvert}/>)}
          </div>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingAdvert ? 'Edit Advert' : 'Create New Advert'}>
        <AdvertForm advert={editingAdvert} onSave={handleSaveAdvert} onCancel={handleCloseModal} />
      </Modal>
    </div>
  );
};

export default AdvertsPage;