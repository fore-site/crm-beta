
import React from 'react';
import { Client } from '../../types';
import Card from '../ui/Card';

interface ClientCardProps {
  client: Client;
  onEdit: (client: Client) => void;
  onSelect: (clientId: string) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onEdit, onSelect }) => {
  return (
    <Card className="p-4 flex flex-col items-center text-center" onClick={() => onSelect(client.id)}>
      <img src={client.avatarUrl} alt={client.name} className="w-20 h-20 rounded-full mb-4 border-2 border-primary" />
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{client.name}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">{client.company}</p>
      <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{client.email}</p>
      <p className="text-sm text-slate-600 dark:text-slate-300">{client.phone}</p>
      <div className="mt-4">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onEdit(client);
          }} 
          className="text-sm text-primary hover:underline"
        >
          Edit
        </button>
      </div>
    </Card>
  );
};

export default ClientCard;