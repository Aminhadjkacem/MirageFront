import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { CompanyClient } from '../../types/client';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface CompanyClientFormProps {
  client?: CompanyClient;
  onSubmit: (client: Omit<CompanyClient, 'id'>) => void; // Match ClientManagement.tsx expectation
  onCancel: () => void;
}

export default function CompanyClientForm({ client, onSubmit, onCancel }: CompanyClientFormProps) {
  const [formData, setFormData] = useState<CompanyClient>({
    companyName: client?.companyName || '',
    address: client?.address || '',
    city: client?.city || '',
    email: client?.email || '',
    matriculeFiscal: client?.matriculeFiscal || '',
    contact1Name: client?.contact1Name || '',
    contact1Phone: client?.contact1Phone || '',
    contact2Name: client?.contact2Name || '',
    contact2Phone: client?.contact2Phone || '',
    contact3Name: client?.contact3Name || '',
    contact3Phone: client?.contact3Phone || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (client) {
      setFormData(client);
    }
  }, [client]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (value.trim() && errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required.';
    if (!formData.address.trim()) newErrors.address = 'Address is required.';
    if (!formData.city.trim()) newErrors.city = 'City is required.';
    if (!formData.matriculeFiscal.trim()) newErrors.matriculeFiscal = 'Tax registration number is required.';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // Remove direct API call; let handleFormSubmit handle it
      await onSubmit({
        companyName: formData.companyName,
        address: formData.address,
        city: formData.city,
        email: formData.email,
        matriculeFiscal: formData.matriculeFiscal,
        contact1Name: formData.contact1Name,
        contact1Phone: formData.contact1Phone,
        contact2Name: formData.contact2Name,
        contact2Phone: formData.contact2Phone,
        contact3Name: formData.contact3Name,
        contact3Phone: formData.contact3Phone,
      });
      toast.success(`Company ${formData.companyName} ${client ? 'updated' : 'added'} successfully!`, {
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
      toast.error('Failed to save company. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border-b pb-4">
          <h4 className="text-lg font-medium text-gray-800 mb-4">Company Information</h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className={`block w-full rounded-md border ${
                  errors.companyName ? 'border-red-500' : 'border-gray-300'
                } shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3`}
                placeholder="e.g., ABC Corp"
                required
                disabled={isSubmitting}
              />
              {errors.companyName && <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>}
            </div>
            <div>
              <label htmlFor="matriculeFiscal" className="block text-sm font-medium text-gray-700 mb-1">
                Tax Registration Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="matriculeFiscal"
                name="matriculeFiscal"
                value={formData.matriculeFiscal}
                onChange={handleChange}
                className={`block w-full rounded-md border ${
                  errors.matriculeFiscal ? 'border-red-500' : 'border-gray-300'
                } shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3`}
                placeholder="e.g., MF123456"
                required
                disabled={isSubmitting || !!client} // Disable for existing clients
              />
              {errors.matriculeFiscal && (
                <p className="mt-1 text-sm text-red-600">{errors.matriculeFiscal}</p>
              )}
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`block w-full rounded-md border ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                } shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3`}
                placeholder="e.g., 123 Business St"
                required
                disabled={isSubmitting}
              />
              {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`block w-full rounded-md border ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                } shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3`}
                placeholder="e.g., New York"
                required
                disabled={isSubmitting}
              />
              {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`block w-full rounded-md border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3`}
                placeholder="e.g., contact@abccorp.com"
                disabled={isSubmitting}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-medium text-gray-800 mb-4">Contact Information</h4>
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="contact1Name" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact 1 Name
                </label>
                <input
                  type="text"
                  id="contact1Name"
                  name="contact1Name"
                  value={formData.contact1Name}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3"
                  placeholder="e.g., Jane Doe"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="contact1Phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact 1 Phone
                </label>
                <input
                  type="tel"
                  id="contact1Phone"
                  name="contact1Phone"
                  value={formData.contact1Phone}
                  onChange={handleChange}
                  className={`block w-full rounded-md border ${
                    errors.contact1Phone ? 'border-red-500' : 'border-gray-300'
                  } shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3`}
                  placeholder="e.g., +1234567890"
                  disabled={isSubmitting}
                />
                {errors.contact1Phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.contact1Phone}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="contact2Name" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact 2 Name
                </label>
                <input
                  type="text"
                  id="contact2Name"
                  name="contact2Name"
                  value={formData.contact2Name}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3"
                  placeholder="e.g., John Smith"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="contact2Phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact 2 Phone
                </label>
                <input
                  type="tel"
                  id="contact2Phone"
                  name="contact2Phone"
                  value={formData.contact2Phone}
                  onChange={handleChange}
                  className={`block w-full rounded-md border ${
                    errors.contact2Phone ? 'border-red-500' : 'border-gray-300'
                  } shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3`}
                  placeholder="e.g., +1234567890"
                  disabled={isSubmitting}
                />
                {errors.contact2Phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.contact2Phone}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="contact3Name" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact 3 Name
                </label>
                <input
                  type="text"
                  id="contact3Name"
                  name="contact3Name"
                  value={formData.contact3Name}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3"
                  placeholder="e.g., Alice Brown"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="contact3Phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact 3 Phone
                </label>
                <input
                  type="tel"
                  id="contact3Phone"
                  name="contact3Phone"
                  value={formData.contact3Phone}
                  onChange={handleChange}
                  className={`block w-full rounded-md border ${
                    errors.contact3Phone ? 'border-red-500' : 'border-gray-300'
                  } shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3`}
                  placeholder="e.g., +1234567890"
                  disabled={isSubmitting}
                />
                {errors.contact3Phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.contact3Phone}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
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
            {isSubmitting ? 'Saving...' : client ? 'Update Company' : 'Create Company'}
          </button>
        </div>
      </form>
      <ToastContainer />
    </>
  );
}