
import React from 'react';
import { Client } from '../../types';
import Card from '../ui/Card';

interface ClientCardProps {
  client: Client;
  onEdit: (client: Client) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onEdit }) => {
  return (
    <Card className="p-4 flex flex-col items-center text-center">
      <img src={client.avatarUrl} alt={client.name} className="w-20 h-20 rounded-full mb-4 border-2 border-primary" />
      <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
      <p className="text-sm text-gray-500">{client.company}</p>
      <p className="text-sm text-gray-600 mt-2">{client.email}</p>
      <p className="text-sm text-gray-600">{client.phone}</p>
      <div className="mt-4">
        <button onClick={() => onEdit(client)} className="text-sm text-primary hover:underline">
          Edit
        </button>
      </div>
    </Card>
  );
};

export default ClientCard;