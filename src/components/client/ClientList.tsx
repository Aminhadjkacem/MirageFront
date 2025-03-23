import { Search } from 'lucide-react';
import type { NormalClient, CompanyClient } from '../../types/client';

interface ClientListProps {
  activeTab: 'normal' | 'company';
  searchTerm: string;
  onSearch: (term: string) => void;
  normalClients: NormalClient[];
  companyClients: CompanyClient[];
  selectedClient: NormalClient | CompanyClient | null;
  onSelectClient: (client: NormalClient | CompanyClient) => void;
  isLoading: boolean;
}

export default function ClientList({
  activeTab,
  searchTerm,
  onSearch,
  normalClients,
  companyClients,
  selectedClient,
  onSelectClient,
  isLoading,
}: ClientListProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex-shrink-0">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher des clients..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {isLoading && ((activeTab === 'normal' && normalClients.length === 0) || 
                     (activeTab === 'company' && companyClients.length === 0)) ? (
        <div className="flex justify-center py-8 flex-grow">
          <div className="animate-pulse text-gray-500">Chargement des {activeTab === 'normal' ? 'clients' : 'entreprises'}...</div>
        </div>
      ) : (
        <div className="flex-grow overflow-y-auto max-h-[calc(100vh-16rem)]"> {/* Scrollable container */}
          {activeTab === 'normal' ? (
            <NormalClientsList 
              clients={normalClients} 
              selectedClient={selectedClient as NormalClient} 
              onSelectClient={onSelectClient} 
            />
          ) : (
            <CompanyClientsList 
              clients={companyClients} 
              selectedClient={selectedClient as CompanyClient} 
              onSelectClient={onSelectClient} 
            />
          )}
        </div>
      )}
    </div>
  );
}

interface NormalClientsListProps {
  clients: NormalClient[];
  selectedClient: NormalClient | null;
  onSelectClient: (client: NormalClient) => void;
}

function NormalClientsList({ clients, selectedClient, onSelectClient }: NormalClientsListProps) {
  if (clients.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucun client trouvé
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {clients.map(client => (
        <button
          key={client.id}
          onClick={() => onSelectClient(client)}
          className={`w-full p-4 text-left rounded-lg border ${
            selectedClient?.id === client.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:bg-gray-50'
          }`}
        >
          <h3 className="font-medium text-gray-900">{client.fullName}</h3>
          <p className="text-sm text-gray-500">{client.phoneNumber}</p>
        </button>
      ))}
    </div>
  );
}

interface CompanyClientsListProps {
  clients: CompanyClient[];
  selectedClient: CompanyClient | null;
  onSelectClient: (client: CompanyClient) => void;
}

function CompanyClientsList({ clients, selectedClient, onSelectClient }: CompanyClientsListProps) {
  if (clients.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucune entreprise trouvée
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {clients.map(client => {
        const isSelected = selectedClient?.id === client.id;
        return (
          <button
            key={client.id || client.matriculeFiscal} // Fallback to matriculeFiscal if id is undefined
            onClick={() => onSelectClient(client)}
            className={`w-full p-4 text-left rounded-lg border ${
              isSelected
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <h3 className="font-medium text-gray-900">{client.companyName}</h3>
            <div className="text-sm text-gray-500">
              <p>{client.city}</p>
              {client.matriculeFiscal && <p>Matricule Fiscal: {client.matriculeFiscal}</p>}
              {client.contact1Name && <p>Contact: {client.contact1Name} {client.contact1Phone && `(${client.contact1Phone})`}</p>}
            </div>
          </button>
        );
      })}
    </div>
  );
}