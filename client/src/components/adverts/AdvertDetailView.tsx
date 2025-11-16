
import React from 'react';
import { Advert } from '../../types';

const statusClasses: Record<Advert['status'], string> = {
    Sent: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    Scheduled: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    Draft: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
};

interface AdvertDetailViewProps {
  advert: Advert;
}

const DetailItem: React.FC<{ label: string; value: string | React.ReactNode }> = ({ label, value }) => (
    <div>
        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</h3>
        <p className="mt-1 text-base text-slate-900 dark:text-slate-100">{value}</p>
    </div>
);

const AdvertDetailView: React.FC<AdvertDetailViewProps> = ({ advert }) => {
  return (
    <div className="space-y-6">
      {advert.imageUrl && advert.channel === 'Email' && (
        <img src={advert.imageUrl} alt={advert.title} className="w-full h-auto max-h-64 object-cover rounded-lg" />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DetailItem label="Status" value={<span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[advert.status]}`}>{advert.status}</span>} />
        <DetailItem label="Channel" value={advert.channel} />
        {advert.status === 'Scheduled' && advert.scheduledAt && (
            <DetailItem label="Scheduled For" value={new Date(advert.scheduledAt).toLocaleString()} />
        )}
        <DetailItem label="Created On" value={new Date(advert.createdAt).toLocaleDateString()} />
      </div>

      <div>
        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Message</h3>
        <div className="mt-2 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <p className="text-base text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{advert.message}</p>
        </div>
      </div>
    </div>
  );
};

export default AdvertDetailView;
