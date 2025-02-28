import { CheckCircle, AlertCircle } from 'lucide-react';

interface NotificationProps {
  notification: {
    message: string;
    type: 'success' | 'error';
  } | null;
}

export default function Notification({ notification }: NotificationProps) {
  if (!notification) return null;
  
  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 ${
      notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      {notification.type === 'success' ? (
        <CheckCircle className="h-5 w-5" />
      ) : (
        <AlertCircle className="h-5 w-5" />
      )}
      <span>{notification.message}</span>
    </div>
  );
}