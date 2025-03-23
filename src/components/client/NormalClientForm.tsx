import React, { useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import type { NormalClient } from '../../types/client';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type NormalClientFormProps = {
  client?: NormalClient;
  onSubmit: (client: Omit<NormalClient, 'id'>) => void;
  onCancel: () => void;
};

export default function NormalClientForm({ client, onSubmit, onCancel }: NormalClientFormProps) {
  const [formData, setFormData] = useState({
    fullName: client?.fullName || '',
    phoneNumber: client?.phoneNumber || '+216',
    address: client?.address || '',
    email: client?.email || '',
    identityCardNumber: client?.identityCardNumber || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required.';
    } else if (!/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number.';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required.';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email address.';
    if (!formData.identityCardNumber.trim()) newErrors.identityCardNumber = 'Identity card number is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      await onSubmit(formData); // Let handleFormSubmit handle the API call
      toast.success(`Client ${formData.fullName} ${client ? 'updated' : 'added'} successfully!`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      onCancel();
    } catch (error) {
      console.error('Error submitting form:', error);
      setApiError('Failed to save client. Please try again.');
      toast.error('Failed to save client. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (value.trim() && errors[id]) {
      setErrors(prev => ({ ...prev, [id]: '' }));
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {apiError && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <span>{apiError}</span>
          </div>
        )}

        <div className="border-b pb-4">
          <h4 className="text-lg font-medium text-gray-800 mb-3">Personal Information</h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className={`block w-full rounded-md border ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                } shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3`}
                placeholder="e.g., John Doe"
                disabled={isSubmitting}
              />
              {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`block w-full rounded-md border ${
                  errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                } shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3`}
                placeholder="e.g., +21612345678"
                disabled={isSubmitting || !!client}
              />
              {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
              {client && (
                <p className="mt-1 text-xs text-gray-500">Phone number cannot be changed for existing clients.</p>
              )}
            </div>
          </div>
        </div>

        <div className="border-b pb-4">
          <h4 className="text-lg font-medium text-gray-800 mb-3">Contact Information</h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email (Optional)
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className={`block w-full rounded-md border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3`}
                placeholder="e.g., john.doe@example.com"
                disabled={isSubmitting}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="address"
                required
                value={formData.address}
                onChange={handleChange}
                className={`block w-full rounded-md border ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                } shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3`}
                placeholder="e.g., 123 Main St, City"
                disabled={isSubmitting}
              />
              {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-medium text-gray-800 mb-3">Identification</h4>
          <div>
            <label htmlFor="identityCardNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Identity Card Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="identityCardNumber"
              required
              value={formData.identityCardNumber}
              onChange={handleChange}
              className={`block w-full rounded-md border ${
                errors.identityCardNumber ? 'border-red-500' : 'border-gray-300'
              } shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3`}
              placeholder="e.g., 12345678"
              disabled={isSubmitting}
            />
            {errors.identityCardNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.identityCardNumber}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
            disabled={isSubmitting}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Processing...' : client ? 'Update Client' : 'Create Client'}
          </button>
        </div>
      </form>
      <ToastContainer />
    </>
  );
}