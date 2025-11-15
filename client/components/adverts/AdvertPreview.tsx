
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
      <div className="w-full max-w-xs mx-auto bg-gray-900 rounded-3xl p-2 border-4 border-gray-700">
        <div className="bg-white h-96 rounded-2xl p-4 flex flex-col">
            <div className="text-center text-sm font-semibold mb-4">New Message</div>
            <div className="bg-gray-200 p-3 rounded-lg self-start max-w-[80%]">
                <p className="text-sm">{message || 'Your message here...'}</p>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="bg-gray-100 p-3 border-b">
        <p className="text-sm text-gray-600">To: All Clients</p>
        <p className="text-sm font-semibold text-gray-800">Subject: {title || '[Your Title Here]'}</p>
      </div>
      <div className="p-4 bg-white">
        {imageUrl && (
            <img src={imageUrl} alt="Advert preview" className="w-full h-auto object-cover rounded mb-4 max-h-48" />
        )}
        <p className="text-base text-gray-700 whitespace-pre-wrap">{message || 'Your message content here...'}</p>
      </div>
    </div>
  );
};

export default AdvertPreview;