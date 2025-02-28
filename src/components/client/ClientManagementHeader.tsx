import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ClientManagementHeaderProps {
  activeTab: 'normal' | 'company';
  onAddNew: () => void;
  isLoading: boolean;
}

export default function ClientManagementHeader({ 
  activeTab, 
  onAddNew, 
  isLoading 
}: ClientManagementHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="mb-8 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Client Management</h2>
      </div>
      <button
        onClick={onAddNew}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        disabled={isLoading}
      >
        <Plus className="h-5 w-5" />
        <span>Add New {activeTab === 'normal' ? 'Client' : 'Company'}</span>
      </button>
    </div>
  );
}