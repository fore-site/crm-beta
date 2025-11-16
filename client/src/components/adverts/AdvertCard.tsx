
import React from 'react';
import { Advert } from '../../types';
import Card from '../ui/Card';

interface AdvertCardProps {
  advert: Advert;
  onEdit?: (advert: Advert) => void;
  onDelete?: (advertId: string) => void;
}

const statusClasses: Record<Advert['status'], string> = {
    Sent: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    Scheduled: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    Draft: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
};

const AdvertCard: React.FC<AdvertCardProps> = ({ advert, onEdit, onDelete }) => {
  const canEditOrDelete = advert.status === 'Scheduled' || advert.status === 'Draft';
  
  return (
    <Card className="flex flex-col">
      {advert.imageUrl && advert.channel === 'Email' && <img src={advert.imageUrl} alt={advert.title} className="w-full h-40 object-cover" />}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">{advert.title}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[advert.status]}`}>{advert.status}</span>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{advert.channel}</p>
        <p className="text-sm text-slate-600 dark:text-slate-300 flex-grow mb-4">{advert.message}</p>
        {advert.status === 'Scheduled' && advert.scheduledAt &&
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-auto">Scheduled for: {new Date(advert.scheduledAt).toLocaleDateString()}</p>
        }
        {(onEdit || onDelete) && canEditOrDelete && (
             <div className="mt-4 border-t border-slate-200 dark:border-slate-700 pt-3 flex justify-end space-x-2">
                {onEdit && <button onClick={() => onEdit && onEdit(advert)} className="text-sm text-blue-600 hover:underline">Edit</button>}
                {onDelete && <button onClick={() => onDelete && onDelete(advert.id)} className="text-sm text-red-600 hover:underline">Delete</button>}
             </div>
        )}
      </div>
    </Card>
  );
};

export default AdvertCard;