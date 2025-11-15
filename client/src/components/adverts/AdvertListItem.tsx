
import React from 'react';
import { Advert } from '../../types';

interface AdvertListItemProps {
  advert: Advert;
  onEdit?: (advert: Advert) => void;
  onDelete?: (advertId: string) => void;
}

const statusClasses: Record<Advert['status'], string> = {
    Sent: 'bg-green-100 text-green-800',
    Scheduled: 'bg-yellow-100 text-yellow-800',
    Draft: 'bg-gray-100 text-gray-800',
};

const AdvertListItem: React.FC<AdvertListItemProps> = ({ advert, onEdit, onDelete }) => {
  const canEditOrDelete = advert.status === 'Scheduled' || advert.status === 'Draft';

  return (
    <div className="flex items-center p-4 hover:bg-gray-50">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <div>
          <p className="font-semibold text-gray-900">{advert.title}</p>
          <p className="text-sm text-gray-500">{advert.channel}</p>
        </div>
        <p className="text-sm text-gray-600 md:col-span-2">{advert.message}</p>
        <div className="flex flex-col md:flex-row md:items-center justify-end space-y-2 md:space-y-0 md:space-x-4">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[advert.status]} w-max`}>{advert.status}</span>
          {(onEdit || onDelete) && canEditOrDelete && (
            <div className="flex space-x-2">
                {onEdit && <button onClick={() => onEdit(advert)} className="text-sm font-medium text-blue-600 hover:text-blue-800">Edit</button>}
                {onDelete && <button onClick={() => onDelete(advert.id)} className="text-sm font-medium text-red-600 hover:text-red-800">Delete</button>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvertListItem;