import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import type { NormalClient, CompanyClient } from '../../types/client';
import ClientList from './ClientList';
import ClientDetails from './ClientDetails';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import ClientManagementHeader from './ClientManagementHeader';
import ClientTabs from './ClientTabs';
import ClientFormContainer from './ClientFormContainer';
import EmptyClientState from './EmptyClientState';
import Notification from './Notification';
import ErrorMessage from './ErrorMessage';
import { 
  getNormalClients, 
  updateNormalClient, 
  createNormalClient,
  deleteNormalClient,
  mapApiDataToNormalClient,
  mapNormalClientToApiData,
  ClientData, // Import ClientData
} from '../../api/clientApi';
import {
  getCompanyClients,
  updateCompanyClient,
  deleteCompanyClient,
  createCompanyClient,
  mapApiDataToCompanyClient,
  mapCompanyClientToApiData,
  CompanyApiData, // Import CompanyApiData
} from '../../api/companyApi';

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
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  
  const detailsContainerRef = useRef<HTMLDivElement>(null);

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
          console.log('Company clients set:', mappedCompanies);
        }
      } catch (err) {
        setError(`Failed to fetch ${activeTab === 'normal' ? 'clients' : 'companies'}. Please try again later.`);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClients();
    setSelectedClient(null);
    setShowForm(false);
    setIsEditing(false);
  }, [activeTab]);

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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedClient, showForm, showDeleteConfirm]);

  const handleSearch = (term: string) => setSearchTerm(term);

  const filteredNormalClients = normalClients.filter(client =>
    (client.fullName?.toLowerCase()?.includes(searchTerm.toLowerCase()) ?? false) ||
    (client.phoneNumber?.includes(searchTerm) ?? false)
  );

  const filteredCompanyClients = companyClients.filter(client =>
    (client.companyName?.toLowerCase()?.includes(searchTerm.toLowerCase()) ?? false) ||
    (client.matriculeFiscal?.includes(searchTerm) ?? false)
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

  const handleDeleteConfirm = () => setShowDeleteConfirm(true);

  const handleDelete = async () => {
    if (!selectedClient) return;
    setIsLoading(true);
    setError(null);
    try {
      if (activeTab === 'normal') {
        const client = selectedClient as NormalClient;
        await deleteNormalClient(client.phoneNumber);
        setNormalClients(normalClients.filter(c => c.id !== client.id));
        showNotification('Client deleted successfully', 'success');
      } else {
        const company = selectedClient as CompanyClient;
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
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    
    try {
      if (activeTab === 'normal') {
        const normalClientData = clientData as Omit<NormalClient, 'id'>;
        if (selectedClient) {
          const apiData = mapNormalClientToApiData({ ...normalClientData, id: (selectedClient as NormalClient).id });
          await updateNormalClient(normalClientData.phoneNumber, apiData);
          setNormalClients(prevClients => 
            prevClients.map(client =>
              client.phoneNumber === normalClientData.phoneNumber ? { ...normalClientData, id: (selectedClient as NormalClient).id } : client
            )
          );
          showNotification('Client updated successfully', 'success');
        } else {
          const apiData = mapNormalClientToApiData(normalClientData as NormalClient);
          console.log('Submitting new normal client:', apiData);
          const newClient = await createNormalClient(apiData);
          console.log('New client returned:', newClient);
          setNormalClients(prevClients => [...prevClients, mapApiDataToNormalClient(newClient)]);
          showNotification('Client created successfully', 'success');
        }
      } else {
        const companyClientData = clientData as Omit<CompanyClient, 'id'>;
        if (selectedClient) {
          const apiData = mapCompanyClientToApiData({ ...companyClientData, id: (selectedClient as CompanyClient).id });
          await updateCompanyClient(companyClientData.matriculeFiscal, apiData);
          setCompanyClients(prevCompanies =>
            prevCompanies.map(company =>
              company.matriculeFiscal === (selectedClient as CompanyClient).matriculeFiscal
                ? { ...companyClientData, id: (selectedClient as CompanyClient).id }
                : company
            )
          );
          showNotification('Company updated successfully', 'success');
        } else {
          const apiData = mapCompanyClientToApiData(companyClientData as CompanyClient);
          console.log('Submitting new company:', apiData);
          const newCompany = await createCompanyClient(apiData);
          console.log('New company returned:', newCompany);
          setCompanyClients(prevCompanies => [...prevCompanies, mapApiDataToCompanyClient(newCompany)]);
          showNotification('Company created successfully', 'success');
        }
      }
      setShowForm(false);
      setSelectedClient(null);
    } catch (err: unknown) {
      console.error('Form submission error:', err);
      if (axios.isAxiosError(err) && err.response?.status === 500) {
        const responseData = err.response.data;
        if (typeof responseData === 'object' && responseData !== null && 'Id' in responseData) {
          console.log('Using 500 response data:', responseData);
          if (activeTab === 'normal') {
            setNormalClients(prevClients => {
              const alreadyExists = prevClients.some(client => client.id === responseData.Id);
              if (!alreadyExists) {
                return [...prevClients, mapApiDataToNormalClient(responseData as ClientData)];
              }
              return prevClients;
            });
            showNotification('Client created successfully', 'success');
          } else {
            setCompanyClients(prevCompanies => {
              const alreadyExists = prevCompanies.some(company => company.id === responseData.Id);
              if (!alreadyExists) {
                return [...prevCompanies, mapApiDataToCompanyClient(responseData as CompanyApiData)];
              }
              return prevCompanies;
            });
            showNotification('Company created successfully', 'success');
          }
          setShowForm(false);
          setSelectedClient(null);
          return;
        }
      }
      setError(`Failed to save ${activeTab === 'normal' ? 'client' : 'company'}. Please try again.`);
      showNotification(`Failed to save ${activeTab === 'normal' ? 'client' : 'company'}`, 'error');
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
    setTimeout(() => setNotification(null), 3000);
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
            <div className="col-span-7" ref={detailsContainerRef}>
              {showForm ? (
                <ClientFormContainer
                  activeTab={activeTab}
                  isEditing={isEditing}
                  selectedClient={selectedClient}
                  onSubmit={handleFormSubmit}
                  onCancel={handleFormCancel}
                />
              ) : selectedClient ? (
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
              )}
            </div>
          </div>
        </div>
      </div>
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