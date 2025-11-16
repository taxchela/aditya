import React from 'react';
import { CheckCircleIcon, XCircleIcon } from './Icons';

interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error';
}

interface NotificationContainerProps {
  notifications: Notification[];
}

const NotificationToast: React.FC<{ notification: Notification }> = ({ notification }) => {
  const isSuccess = notification.type === 'success';
  const baseClasses = 'flex items-center w-full max-w-xs p-4 text-slate-200 bg-slate-800/80 backdrop-blur-lg rounded-lg shadow-2xl ring-1 ring-white/10 mb-3';
  const typeClasses = isSuccess ? 'text-green-300' : 'text-red-400';
  const iconBgClasses = isSuccess ? 'bg-green-500/20' : 'bg-red-500/20';

  return (
    <div className={`${baseClasses} animate-slide-in-right`} role="alert">
      <div className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 ${typeClasses} ${iconBgClasses} rounded-lg`}>
        {isSuccess ? <CheckCircleIcon className="w-5 h-5" /> : <XCircleIcon className="w-5 h-5" />}
      </div>
      <div className="ml-3 text-sm font-medium">{notification.message}</div>
    </div>
  );
};

const NotificationContainer: React.FC<NotificationContainerProps> = ({ notifications }) => {
  return (
    <div className="fixed top-24 right-4 z-[100]">
      {notifications.map(notification => (
        <NotificationToast key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

export default NotificationContainer;