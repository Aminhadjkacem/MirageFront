import { Plus } from 'lucide-react';

interface DevisHeaderProps {
  onNewQuotationClick: () => void;
}

export function DevisHeader({ onNewQuotationClick }: DevisHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-gray-900">Devis</h2>
      <button
        onClick={onNewQuotationClick}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
      >
        <Plus className="h-4 w-4 mr-2" />
        Nouveau Devis
      </button>
    </div>
  );
}