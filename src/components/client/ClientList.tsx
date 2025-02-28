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
  isLoading
}: ClientListProps) {
  return (
    <>
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search clients..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {isLoading && ((activeTab === 'normal' && normalClients.length === 0) || 
                     (activeTab === 'company' && companyClients.length === 0)) ? (
        <div className="flex justify-center py-8">
          <div className="animate-pulse text-gray-500">Loading {activeTab === 'normal' ? 'clients' : 'companies'}...</div>
        </div>
      ) : (
        <div className="space-y-2">
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
    </>
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
        No clients found
      </div>
    );
  }

  return (
    <>
      {clients.map(client => (
        <button
          key={client.phoneNumber}
          onClick={() => onSelectClient(client)}
          className={`w-full p-4 text-left rounded-lg border ${
            selectedClient?.phoneNumber === client.phoneNumber
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:bg-gray-50'
          }`}
        >
          <h3 className="font-medium text-gray-900">{client.fullName}</h3>
          <p className="text-sm text-gray-500">{client.phoneNumber}</p>
        </button>
      ))}
    </>
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
        No companies found
      </div>
    );
  }

  return (
    <>
      {clients.map(client => {
        // Check if this client is selected by comparing relevant properties
        let isSelected = false;
        
        if (selectedClient) {
          // If client has an id, check if it matches the selected client's id
          if (client.id && selectedClient.id) {
            isSelected = client.id === selectedClient.id;
          }
          // If client has a matriculeFiscal, check if it matches the selected client's matriculeFiscal
          else if (client.matriculeFiscal && selectedClient.matriculeFiscal) {
            isSelected = client.matriculeFiscal === selectedClient.matriculeFiscal;
          }
          // If no id or matriculeFiscal, compare company names as a fallback
          else if (client.companyName && selectedClient.companyName) {
            isSelected = client.companyName === selectedClient.companyName;
          }
        }
        
        // Use a more reliable key that combines multiple unique identifiers
        // This is important for React to correctly identify each item in the list
        
        return (
          <button
            key={client.matriculeFiscal}
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
    </>
  );
}