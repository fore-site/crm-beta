
import React from 'react';
import { Client } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

interface ClientDetailProps {
  client: Client;
  onEdit: (client: Client) => void;
}

const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</h3>
        <p className="mt-1 text-lg text-slate-900 dark:text-slate-100">{value}</p>
    </div>
);

const ClientDetailPage: React.FC<ClientDetailProps> = ({ client, onEdit }) => {
  return (
    <div className="animate-fade-in">
        <Card className="p-6 sm:p-8 mt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
                <img src={client.avatarUrl} alt={client.name} className="w-24 h-24 rounded-full mb-4 sm:mb-0 sm:mr-8 border-4 border-slate-200 dark:border-slate-700" />
                <div className="flex-grow">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{client.name}</h2>
                    <p className="text-xl text-slate-500 dark:text-slate-400">{client.company}</p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <Button onClick={() => onEdit(client)} leftIcon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                        </svg>
                    }>
                        Edit Client
                    </Button>
                </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-6">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <DetailItem label="Email Address" value={client.email} />
                    <DetailItem label="Phone Number" value={client.phone} />
                </div>
            </div>
            
             <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-6">Additional Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                   <DetailItem label="Client Since" value={new Date(client.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
                   <DetailItem label="Client ID" value={client.id} />
                </div>
            </div>
        </Card>
    </div>
  );
};

export default ClientDetailPage;
