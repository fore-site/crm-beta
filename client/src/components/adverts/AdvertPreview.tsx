
import React from 'react';
import { AdvertChannel } from '../../types';

interface AdvertPreviewProps {
  title: string;
  message: string;
  channel: AdvertChannel;
  imageUrl?: string | null;
}

const AdvertPreview: React.FC<AdvertPreviewProps> = ({ title, message, channel, imageUrl }) => {
  if (channel === 'SMS') {
    return (
      <div className="w-full max-w-xs mx-auto bg-slate-900 rounded-3xl p-2 border-4 border-slate-700">
        <div className="bg-white h-96 rounded-2xl p-4 flex flex-col">
            <div className="text-center text-sm text-slate-800 font-semibold mb-4">New Message</div>
            <div className="bg-slate-200 p-3 rounded-lg self-start max-w-[80%]">
                <p className="text-sm text-slate-900">{message || 'Your message here...'}</p>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-slate-200 rounded-lg shadow-sm overflow-hidden">
      <div className="bg-slate-100 p-3 border-b border-slate-200">
        <p className="text-sm text-slate-600">To: All Clients</p>
        <p className="text-sm font-semibold text-slate-800">Subject: {title || '[Your Title Here]'}</p>
      </div>
      <div className="p-4 bg-white">
        {imageUrl && (
            <img src={imageUrl} alt="Advert preview" className="w-full h-auto object-cover rounded mb-4 max-h-48" />
        )}
        <p className="text-base text-slate-700 whitespace-pre-wrap">{message || 'Your message content here...'}</p>
      </div>
    </div>
  );
};

export default AdvertPreview;