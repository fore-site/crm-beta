
import React from 'react';
import { Client } from '../../types';

interface ClientListItemProps {
  client: Client;
  onEdit: (client: Client) => void;
}

const ClientListItem: React.FC<ClientListItemProps> = ({ client, onEdit }) => {
  return (
    <div className="flex items-center p-4 hover:bg-gray-50">
      <img src={client.avatarUrl} alt={client.name} className="w-12 h-12 rounded-full mr-4" />
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div>
          <p className="font-semibold text-gray-900">{client.name}</p>
          <p className="text-sm text-gray-500">{client.company}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">{client.email}</p>
          <p className="text-sm text-gray-600">{client.phone}</p>
        </div>
        <div className="text-right">
          <button onClick={() => onEdit(client)} className="text-sm font-medium text-primary hover:text-primary-dark">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientListItem;