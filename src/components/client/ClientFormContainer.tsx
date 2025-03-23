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
  onCancel,
}: ClientFormContainerProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        {isEditing ? 'Modifier' : 'Ajouter un nouveau'} {activeTab === 'normal' ? 'client individuel' : 'client entreprise'}
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