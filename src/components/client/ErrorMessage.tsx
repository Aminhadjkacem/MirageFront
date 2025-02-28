import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  error: string | null;
}

export default function ErrorMessage({ error }: ErrorMessageProps) {
  if (!error) return null;
  
  return (
    <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg flex items-center space-x-2">
      <AlertCircle className="h-5 w-5" />
      <span>{error}</span>
    </div>
  );
}