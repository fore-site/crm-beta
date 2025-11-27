
import React from 'react';
import { Advert } from '../../types';

interface AdvertListItemProps {
  advert: Advert;
  onEdit?: (advert: Advert) => void;
  onDelete?: (advertId: string) => void;
  onClick?: (advert: Advert) => void;
}

const statusClasses: Record<Advert['status'], string> = {
    Sent: 'bg-green-100 text-green-800',
    Scheduled: 'bg-yellow-100 text-yellow-800',
    Draft: 'bg-slate-100 text-slate-800',
};

const AdvertListItem: React.FC<AdvertListItemProps> = ({ advert, onEdit, onDelete, onClick }) => {
  const canEditOrDelete = advert.status === 'Scheduled' || advert.status === 'Draft';
  const isClickable = !!onClick;

  const handleClick = () => {
    if (onClick) {
      onClick(advert);
    }
  };

  return (
    <div
      className={`flex items-center p-4 hover:bg-slate-50 ${isClickable ? 'cursor-pointer' : ''}`}
      onClick={handleClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <div>
          <p className="font-semibold text-slate-900">{advert.title}</p>
          <p className="text-sm text-slate-500">{advert.channel}</p>
        </div>
        <p className="text-sm text-slate-600 md:col-span-2 truncate">{advert.message}</p>
        <div className="flex flex-col md:flex-row md:items-center justify-end space-y-2 md:space-y-0 md:space-x-4">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[advert.status]} w-max`}>{advert.status}</span>
          {(onEdit || onDelete) && canEditOrDelete && (
            <div className="flex space-x-2">
                {onEdit && <button onClick={(e) => { e.stopPropagation(); onEdit(advert); }} className="text-sm font-medium text-blue-600 hover:text-blue-800">Edit</button>}
                {onDelete && <button onClick={(e) => { e.stopPropagation(); onDelete(advert.id); }} className="text-sm font-medium text-red-600 hover:text-red-800">Delete</button>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvertListItem;