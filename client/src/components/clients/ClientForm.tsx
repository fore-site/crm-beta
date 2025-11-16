
import React, { useState, useEffect } from 'react';
import { Client } from '../../types';
import Button from '../ui/Button';

interface ClientFormProps {
  client: Client | null;
  onSave: (clientData: Omit<Client, 'id' | 'createdAt' | 'avatarUrl'>) => void;
  onCancel: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ client, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
  });

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        email: client.email,
        phone: client.phone,
        company: client.company,
      });
    } else {
       setFormData({ name: '', email: '', phone: '', company: '' });
    }
  }, [client]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const inputClasses = "mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white";
  const labelClasses = "block text-sm font-medium text-slate-700 dark:text-slate-300";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className={labelClasses}>Name</label>
        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className={inputClasses} />
      </div>
      <div>
        <label htmlFor="email" className={labelClasses}>Email</label>
        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className={inputClasses} />
      </div>
       <div>
        <label htmlFor="phone" className={labelClasses}>Phone</label>
        <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} required className={inputClasses} />
      </div>
       <div>
        <label htmlFor="company" className={labelClasses}>Company</label>
        <input type="text" name="company" id="company" value={formData.company} onChange={handleChange} required className={inputClasses} />
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Client</Button>
      </div>
    </form>
  );
};

export default ClientForm;