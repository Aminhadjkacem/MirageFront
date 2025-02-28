import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import type { NormalClient } from '../types/client';
import { createNormalClient, mapNormalClientToApiData } from '../api/clientApi';

type NormalClientFormProps = {
  client?: NormalClient;
  onSubmit: (client: Omit<NormalClient, 'id'>) => void;
  onCancel: () => void;
};

export default function NormalClientForm({ client, onSubmit, onCancel }: NormalClientFormProps) {
  const [formData, setFormData] = useState({
    fullName: client?.fullName || '',
    phoneNumber: client?.phoneNumber || '',
    address: client?.address || '',
    email: client?.email || '',
    identityCardNumber: client?.identityCardNumber || '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.identityCardNumber.trim()) {
      newErrors.identityCardNumber = 'Identity card number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setApiError(null);
    
    try {
      if (!client) {
        // This is a new client, so create it
        const apiData = mapNormalClientToApiData(formData);
        await createNormalClient(apiData);
      }
      
      // Call the parent's onSubmit handler
      onSubmit(formData);
    } catch (error) {
      console.error('Error creating client:', error);
      setApiError('Failed to create client. Please try again.');
      // Don't call onSubmit if there was an error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    
    // Clear error for this field when user types
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {apiError && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md flex items-center space-x-2">
          <AlertCircle className="h-5 w-5" />
          <span>{apiError}</span>
        </div>
      )}
      
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
          Full Name *
        </label>
        <input
          type="text"
          id="fullName"
          required
          value={formData.fullName}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            errors.fullName ? 'border-red-300' : 'border-gray-300'
          }`}
          disabled={isSubmitting}
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
        )}
      </div>

      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
          Phone Number *
        </label>
        <input
          type="tel"
          id="phoneNumber"
          required
          value={formData.phoneNumber}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            errors.phoneNumber ? 'border-red-300' : 'border-gray-300'
          }`}
          disabled={isSubmitting || !!client} // Disable if editing existing client
        />
        {errors.phoneNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
        )}
        {client && (
          <p className="mt-1 text-xs text-gray-500">Phone number cannot be changed for existing clients.</p>
        )}
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Address *
        </label>
        <input
          type="text"
          id="address"
          required
          value={formData.address}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            errors.address ? 'border-red-300' : 'border-gray-300'
          }`}
          disabled={isSubmitting}
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email (Optional)
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            errors.email ? 'border-red-300' : 'border-gray-300'
          }`}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="identityCardNumber" className="block text-sm font-medium text-gray-700">
          Identity Card Number *
        </label>
        <input
          type="text"
          id="identityCardNumber"
          required
          value={formData.identityCardNumber}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            errors.identityCardNumber ? 'border-red-300' : 'border-gray-300'
          }`}
          disabled={isSubmitting}
        />
        {errors.identityCardNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.identityCardNumber}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : client ? 'Update Client' : 'Create Client'}
        </button>
      </div>
    </form>
  );
}