import NormalClientForm from './NormalClientForm';
import CompanyClientForm from './CompanyClientForm';
import type { NormalClient, CompanyClient } from '../../types/client';

interface ClientFormContainerProps {
  activeTab: 'normal' | 'company';
  isEditing: boolean;
  selectedClient: NormalClient | CompanyClient | null;
  onSubmit: (clientData: Omit<NormalClient | CompanyClient, 'id'>) => Promise<void>;
  onCancel: () => void;
}

export default function ClientFormContainer({
  activeTab,
  isEditing,
  selectedClient,
  onSubmit,
  onCancel
}: ClientFormContainerProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        {isEditing ? 'Edit' : 'Add New'} {activeTab === 'normal' ? 'Client' : 'Company'}
      </h3>
      {activeTab === 'normal' ? (
        <NormalClientForm
          client={selectedClient as NormalClient}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      ) : (
        <CompanyClientForm
          client={selectedClient as CompanyClient}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      )}
    </div>
  );
}