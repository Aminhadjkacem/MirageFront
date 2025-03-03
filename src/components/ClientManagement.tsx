import { useState, useEffect, useRef } from 'react';
import type { NormalClient, CompanyClient } from '../types/client';
import ClientList from '../components/client/ClientList';
import ClientDetails from '../components/client/ClientDetails';
import DeleteConfirmationModal from '../components/client/DeleteConfirmationModal';
import ClientManagementHeader from '../components/client/ClientManagementHeader';
import ClientTabs from '../components/client/ClientTabs';
import ClientFormContainer from '../components/client/ClientFormContainer';
import EmptyClientState from '../components/client/EmptyClientState';
import Notification from '../components/client/Notification';
import ErrorMessage from '../components/client/ErrorMessage';
import { 
  getNormalClients, 
  updateNormalClient, 
  deleteNormalClient,
  mapApiDataToNormalClient,
  mapNormalClientToApiData,
} from '../api/clientApi';
import {
  getCompanyClients,
  updateCompanyClient,
  deleteCompanyClient,
  mapApiDataToCompanyClient,
  mapCompanyClientToApiData,
} from '../api/companyApi';


export default function ClientManagement() {
  const [activeTab, setActiveTab] = useState<'normal' | 'company'>('normal');
  const [normalClients, setNormalClients] = useState<NormalClient[]>([]);
  const [companyClients, setCompanyClients] = useState<CompanyClient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<NormalClient | CompanyClient | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  // Ref for the details container to detect clicks outside
  const detailsContainerRef = useRef<HTMLDivElement>(null);

  // Fetch clients on component mount or tab change
  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (activeTab === 'normal') {
          const apiClients = await getNormalClients();
          const mappedClients = apiClients.map(client => mapApiDataToNormalClient(client));
          setNormalClients(mappedClients);
        } else {
          const apiCompanies = await getCompanyClients();
          const mappedCompanies = apiCompanies.map(company => mapApiDataToCompanyClient(company));
          setCompanyClients(mappedCompanies);
        }
      } catch (err) {
        setError(`Failed to fetch ${activeTab === 'normal' ? 'clients' : 'companies'}. Please try again later.`);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
    
    // Reset selected client when switching tabs
    setSelectedClient(null);
    setShowForm(false);
    setIsEditing(false);
  }, [activeTab]);

  // Handle clicks outside the details container
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        detailsContainerRef.current && 
        !detailsContainerRef.current.contains(event.target as Node) && 
        selectedClient !== null && 
        !showForm && 
        !showDeleteConfirm
      ) {
        setSelectedClient(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedClient, showForm, showDeleteConfirm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const filteredNormalClients = normalClients.filter(client =>
    client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phoneNumber.includes(searchTerm)
  );

  const filteredCompanyClients = companyClients.filter(client =>
    (client.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    client.matriculeFiscal?.includes(searchTerm))
  );

  const handleSelectClient = (client: NormalClient | CompanyClient) => {
    setSelectedClient(client);
    setIsEditing(false);
    setShowForm(false);
  };

  const handleAddNew = () => {
    setSelectedClient(null);
    setShowForm(true);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDeleteConfirm = () => {
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!selectedClient) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      if (activeTab === 'normal') {
        const client = selectedClient as NormalClient;
        await deleteNormalClient(client.phoneNumber);
        setNormalClients(normalClients.filter(c => c.phoneNumber !== client.phoneNumber));
        showNotification('Client deleted successfully', 'success');
      } else {
        const company = selectedClient as CompanyClient;
        // For company clients, we use the id for deletion according to the API
        await deleteCompanyClient(company.matriculeFiscal || '');
        setCompanyClients(companyClients.filter(c => c.id !== company.id));
        showNotification('Company deleted successfully', 'success');
      }
      setSelectedClient(null);
    } catch (err) {
      setError(`Failed to delete ${activeTab === 'normal' ? 'client' : 'company'}. Please try again.`);
      showNotification(`Failed to delete ${activeTab === 'normal' ? 'client' : 'company'}`, 'error');
      console.error(err);
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleFormSubmit = async (clientData: Omit<NormalClient | CompanyClient, 'id'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (activeTab === 'normal') {
        const normalClientData = clientData as NormalClient;
        
        if (selectedClient) {
          // Update existing client
          const apiData = mapNormalClientToApiData(normalClientData);
          await updateNormalClient(normalClientData.phoneNumber, apiData);
          
          // Update local state
          setNormalClients(prevClients => 
            prevClients.map(client =>
              client.phoneNumber === normalClientData.phoneNumber ? normalClientData : client
            )
          );
          
          showNotification('Client updated successfully', 'success');
        } else {
          // Add new client will be handled in the form component
          // Just update local state for now
          setNormalClients(prevClients => [...prevClients, normalClientData]);
          showNotification('Client created successfully', 'success');
        }
      } else {
        const companyClientData = clientData as CompanyClient;
        
        if (selectedClient) {
          // Update existing company
          const apiData = mapCompanyClientToApiData(companyClientData);
          await updateCompanyClient(companyClientData.matriculeFiscal, apiData);
          
          // Update local state with functional update to ensure we're working with the latest state
          setCompanyClients(prevCompanies => {
            return prevCompanies.map(company => {
              if (company.matriculeFiscal === (selectedClient as CompanyClient).matriculeFiscal) {
                // Create a new object with the updated data and preserve the id
                return { 
                  ...companyClientData, 
                  id: (selectedClient as CompanyClient).id 
                } as CompanyClient;
              }
              return company;
            });
          });
          
          showNotification('Company updated successfully', 'success');
        } else {
          // Add new company will be handled in the form component
          // Just update local state with a temporary ID using functional update
          const newCompany = { 
            ...companyClientData, 
            id: `temp-${Date.now()}` 
          } as CompanyClient;
          
          setCompanyClients(prevCompanies => [...prevCompanies, newCompany]);
          showNotification('Company created successfully', 'success');
        }
      }
      
      setShowForm(false);
      setSelectedClient(null);
    } catch (err) {
      setError(`Failed to save ${activeTab === 'normal' ? 'client' : 'company'}. Please try again.`);
      showNotification(`Failed to save ${activeTab === 'normal' ? 'client' : 'company'}`, 'error');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setIsEditing(false);
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Notification notification={notification} />
        <ClientManagementHeader 
          activeTab={activeTab} 
          onAddNew={handleAddNew} 
          isLoading={isLoading} 
        />
        <ErrorMessage error={error} />

        <div className="bg-white rounded-xl shadow-sm">
          <ClientTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="grid grid-cols-12 gap-6 p-6">
            {/* Left side - Client List */}
            <div className="col-span-5">
              <ClientList 
                activeTab={activeTab}
                searchTerm={searchTerm}
                onSearch={handleSearch}
                normalClients={filteredNormalClients}
                companyClients={filteredCompanyClients}
                selectedClient={selectedClient}
                onSelectClient={handleSelectClient}
                isLoading={isLoading}
              />
            </div>

            {/* Right side - Client Details/Form */}
            <div className="col-span-7" ref={detailsContainerRef}>
              {showForm ? (
                <ClientFormContainer
                  activeTab={activeTab}
                  isEditing={isEditing}
                  selectedClient={selectedClient}
                  onSubmit={handleFormSubmit}
                  onCancel={handleFormCancel}
                />
              ) : (
                selectedClient ? (
                  <ClientDetails
                    activeTab={activeTab}
                    selectedClient={selectedClient}
                    onEdit={handleEdit}
                    onDelete={handleDeleteConfirm}
                    isLoading={isLoading}
                  />
                ) : (
                  <EmptyClientState 
                    activeTab={activeTab} 
                    onAddNew={handleAddNew} 
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <DeleteConfirmationModal
          activeTab={activeTab}
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}