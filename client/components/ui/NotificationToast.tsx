import React, { useEffect } from 'react';
import { Notification, NotificationType } from '../../types';

interface NotificationToastProps {
  notification: Notification;
  onDismiss: () => void;
}

// Fix: Replaced JSX.Element with React.ReactElement to resolve namespace issue.
const ICONS: Record<NotificationType, React.ReactElement> = {
    success: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    error: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    info: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
};

const BG_COLORS: Record<NotificationType, string> = {
    success: 'bg-green-50 border-green-400',
    error: 'bg-red-50 border-red-400',
    info: 'bg-blue-50 border-blue-400',
};

const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className={`flex items-start p-4 w-full bg-white rounded-lg shadow-lg border-l-4 animate-slide-in ${BG_COLORS[notification.type]}`}>
      <div className="flex-shrink-0">
        {ICONS[notification.type]}
      </div>
      <div className="ml-3 w-0 flex-1 pt-0.5">
        <p className="text-sm font-medium text-gray-900">{notification.message}</p>
      </div>
      <div className="ml-4 flex-shrink-0 flex">
        <button onClick={onDismiss} className="inline-flex text-gray-400 hover:text-gray-500">
          <span className="sr-only">Close</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        </button>
      </div>
    </div>
  );
};

export default NotificationToast;