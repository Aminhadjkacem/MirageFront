import { Edit2, Trash2 } from 'lucide-react';
import type { NormalClient, CompanyClient } from '../../types/client';

interface ClientDetailsProps {
  activeTab: 'normal' | 'company';
  selectedClient: NormalClient | CompanyClient | null;
  onEdit: () => void;
  onDelete: () => void;
  isLoading: boolean;
}

export default function ClientDetails({
  activeTab,
  selectedClient,
  onEdit,
  onDelete,
  isLoading
}: ClientDetailsProps) {
  if (!selectedClient) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Select a {activeTab === 'normal' ? 'client' : 'company'} to view details
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          {activeTab === 'normal' ? 'Client Details' : 'Company Details'}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            disabled={isLoading}
          >
            <Edit2 className="h-5 w-5" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
            disabled={isLoading}
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {activeTab === 'normal' ? (
        <NormalClientDetails client={selectedClient as NormalClient} />
      ) : (
        <CompanyClientDetails client={selectedClient as CompanyClient} />
      )}
    </div>
  );
}

interface NormalClientDetailsProps {
  client: NormalClient;
}

function NormalClientDetails({ client }: NormalClientDetailsProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <p className="mt-1 text-gray-900">{client.fullName}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
        <p className="mt-1 text-gray-900">{client.phoneNumber}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Address</label>
        <p className="mt-1 text-gray-900">{client.address}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <p className="mt-1 text-gray-900">{client.email || '-'}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Identity Card Number</label>
        <p className="mt-1 text-gray-900">{client.identityCardNumber}</p>
      </div>
    </div>
  );
}

interface CompanyClientDetailsProps {
  client: CompanyClient;
}

function CompanyClientDetails({ client }: CompanyClientDetailsProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Company Name</label>
        <p className="mt-1 text-gray-900">{client.companyName}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Address</label>
        <p className="mt-1 text-gray-900">{client.address}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">City</label>
        <p className="mt-1 text-gray-900">{client.city}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <p className="mt-1 text-gray-900">{client.email}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Tax Registration Number</label>
        <p className="mt-1 text-gray-900">{client.matriculeFiscal}</p>
      </div>
      
      {/* Contact Information */}
      {(client.contact1Name || client.contact2Name || client.contact3Name) && (
        <div>
          <h4 className="text-md font-medium text-gray-700 mt-6 mb-3">Contact Information</h4>
          
          {client.contact1Name && (
            <div className="grid grid-cols-2 gap-4 mb-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact 1 Name</label>
                <p className="mt-1 text-gray-900">{client.contact1Name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact 1 Phone</label>
                <p className="mt-1 text-gray-900">{client.contact1Phone || '-'}</p>
              </div>
            </div>
          )}
          
          {client.contact2Name && (
            <div className="grid grid-cols-2 gap-4 mb-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact 2 Name</label>
                <p className="mt-1 text-gray-900">{client.contact2Name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact 2 Phone</label>
                <p className="mt-1 text-gray-900">{client.contact2Phone || '-'}</p>
              </div>
            </div>
          )}
          
          {client.contact3Name && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact 3 Name</label>
                <p className="mt-1 text-gray-900">{client.contact3Name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact 3 Phone</label>
                <p className="mt-1 text-gray-900">{client.contact3Phone || '-'}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}