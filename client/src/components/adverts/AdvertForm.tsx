
import React, { useState, useEffect } from 'react';
import { Advert, AdvertChannel } from '../../types';
import Button from '../ui/Button';
import AdvertPreview from './AdvertPreview';

interface AdvertFormProps {
  advert: Advert | null;
  onSave: (advertData: Omit<Advert, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const AdvertForm: React.FC<AdvertFormProps> = ({ advert, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [channel, setChannel] = useState<AdvertChannel>('Email');
  const [image, setImage] = useState<string | null>(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [errors, setErrors] = useState<{title?: string, message?: string}>({});

  useEffect(() => {
    if (advert) {
      setTitle(advert.title);
      setMessage(advert.message);
      setChannel(advert.channel);
      setImage(advert.imageUrl || null);
      setScheduleDate(advert.scheduledAt ? new Date(advert.scheduledAt).toISOString().substring(0, 16) : '');
    } else {
      setTitle('');
      setMessage('');
      setChannel('Email');
      setImage(null);
      setScheduleDate('');
    }
  }, [advert]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const validate = () => {
      const newErrors: {title?: string, message?: string} = {};
      if (!title.trim()) newErrors.title = "Title is required.";
      if (!message.trim()) newErrors.message = "Message is required.";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  }

  const handleAction = (status: 'Sent' | 'Scheduled' | 'Draft') => {
    if (status !== 'Draft' && !validate()) return;
    
    let scheduledAt: string | null = null;
    if(status === 'Scheduled' && scheduleDate) {
        scheduledAt = new Date(scheduleDate).toISOString();
    } else if (status === 'Sent') {
        // If sending now, we treat it as not scheduled for a future date
        scheduledAt = null;
    } else if (advert?.status === 'Scheduled' && !scheduleDate) {
        // preserve schedule date if it exists and we're just saving draft
        scheduledAt = advert.scheduledAt;
    }

    onSave({
        title,
        message,
        channel,
        status,
        scheduledAt,
        imageUrl: channel === 'Email' ? image : null,
    });
  };

  const inputBaseClasses = "mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white";
  const labelClasses = "block text-sm font-medium text-slate-700 dark:text-slate-300";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <form className="space-y-4">
        <div>
          <label htmlFor="title" className={labelClasses}>Title</label>
          <input type="text" name="title" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className={`${inputBaseClasses} ${errors.title ? 'border-red-500' : 'border-slate-300'}`} />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>
        <div>
          <label htmlFor="message" className={labelClasses}>Message</label>
          <textarea name="message" id="message" value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className={`${inputBaseClasses} ${errors.message ? 'border-red-500' : 'border-slate-300'}`}></textarea>
          {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
        </div>
        <div>
          <label className={labelClasses}>Channel</label>
          <div className="flex space-x-4 mt-1">
            <label className="flex items-center"><input type="radio" name="channel" value="Email" checked={channel === 'Email'} onChange={() => setChannel('Email')} className="focus:ring-primary h-4 w-4 text-primary border-slate-300 dark:bg-slate-700 dark:border-slate-600"/> <span className="ml-2">Email</span></label>
            <label className="flex items-center"><input type="radio" name="channel" value="SMS" checked={channel === 'SMS'} onChange={() => setChannel('SMS')} className="focus:ring-primary h-4 w-4 text-primary border-slate-300 dark:bg-slate-700 dark:border-slate-600"/> <span className="ml-2">SMS</span></label>
          </div>
        </div>
        {channel === 'Email' && (
          <div>
            <label htmlFor="image" className={labelClasses}>Image</label>
            <input type="file" name="image" id="image" accept="image/*" onChange={handleImageUpload} className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-primary hover:file:bg-violet-100 dark:file:bg-slate-600 dark:file:text-slate-200 dark:hover:file:bg-slate-500"/>
          </div>
        )}
        <div>
          <label htmlFor="scheduleDate" className={labelClasses}>Schedule Date (Optional)</label>
          <input type="datetime-local" name="scheduleDate" id="scheduleDate" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className={`${inputBaseClasses} border-slate-300`} />
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button type="button" variant="ghost" onClick={() => handleAction('Draft')}>Save Draft</Button>
          {scheduleDate 
            ? <Button type="button" variant="secondary" onClick={() => handleAction('Scheduled')}>Schedule</Button>
            : <Button type="button" onClick={() => handleAction('Sent')}>Send Now</Button>
          }
        </div>
      </form>
      <div>
        <h4 className="text-lg font-semibold mb-2">Preview</h4>
        <AdvertPreview title={title} message={message} channel={channel} imageUrl={image} />
      </div>
    </div>
  );
};

export default AdvertForm;