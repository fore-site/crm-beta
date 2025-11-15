
import React from 'react';
import { Notification } from '../../types';
import NotificationToast from './NotificationToast';

interface NotificationContainerProps {
  notifications: Notification[];
  removeNotification: (id: number) => void;
}

const NotificationContainer: React.FC<NotificationContainerProps> = ({ notifications, removeNotification }) => {
  return (
    <div className="fixed top-5 right-5 z-[100] w-full max-w-sm space-y-3">
      {notifications.map((notification) => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onDismiss={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;