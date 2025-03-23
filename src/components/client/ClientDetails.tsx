import { Edit2, Trash2, Loader2 } from 'lucide-react';
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
  isLoading,
}: ClientDetailsProps) {
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Loading client details...
      </div>
    );
  }

  if (!selectedClient) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Select a {activeTab === 'normal' ? 'client' : 'company'} to view details
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          {activeTab === 'normal' ? 'Individual Client Details' : 'Company Client Details'}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
            disabled={isLoading}
            title="Edit Client"
          >
            <Edit2 className="h-5 w-5" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
            disabled={isLoading}
            title="Delete Client"
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
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h4 className="text-lg font-medium text-gray-800 mb-3">Personal Information</h4>
        <dl className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6">
          <div>
            <dt className="text-sm font-medium text-gray-700">Full Name</dt>
            <dd className="mt-1 text-gray-900">{client.fullName || '-'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-700">Phone Number</dt>
            <dd className="mt-1 text-gray-900">{client.phoneNumber || '-'}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-700">Address</dt>
            <dd className="mt-1 text-gray-900">{client.address || '-'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-700">Email</dt>
            <dd className="mt-1 text-gray-900">{client.email || '-'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-700">Identity Card Number</dt>
            <dd className="mt-1 text-gray-900">{client.identityCardNumber || '-'}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

interface CompanyClientDetailsProps {
  client: CompanyClient;
}

function CompanyClientDetails({ client }: CompanyClientDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h4 className="text-lg font-medium text-gray-800 mb-3">Company Information</h4>
        <dl className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6">
          <div>
            <dt className="text-sm font-medium text-gray-700">Company Name</dt>
            <dd className="mt-1 text-gray-900">{client.companyName || '-'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-700">Tax Registration Number</dt>
            <dd className="mt-1 text-gray-900">{client.matriculeFiscal || '-'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-700">City</dt>
            <dd className="mt-1 text-gray-900">{client.city || '-'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-700">Email</dt>
            <dd className="mt-1 text-gray-900">{client.email || '-'}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-700">Address</dt>
            <dd className="mt-1 text-gray-900">{client.address || '-'}</dd>
          </div>
        </dl>
      </div>

      <div>
        <h4 className="text-lg font-medium text-gray-800 mb-3">Contact Information</h4>
        <dl className="space-y-4">
          <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6">
            <div>
              <dt className="text-sm font-medium text-gray-700">Contact 1 Name</dt>
              <dd className="mt-1 text-gray-900">{client.contact1Name || '-'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-700">Contact 1 Phone</dt>
              <dd className="mt-1 text-gray-900">{client.contact1Phone || '-'}</dd>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6">
            <div>
              <dt className="text-sm font-medium text-gray-700">Contact 2 Name</dt>
              <dd className="mt-1 text-gray-900">{client.contact2Name || '-'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-700">Contact 2 Phone</dt>
              <dd className="mt-1 text-gray-900">{client.contact2Phone || '-'}</dd>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6">
            <div>
              <dt className="text-sm font-medium text-gray-700">Contact 3 Name</dt>
              <dd className="mt-1 text-gray-900">{client.contact3Name || '-'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-700">Contact 3 Phone</dt>
              <dd className="mt-1 text-gray-900">{client.contact3Phone || '-'}</dd>
            </div>
          </div>
        </dl>
      </div>
    </div>
  );
}