import React, { useState, useEffect } from 'react';
import { CompanyClient } from '../../types/client';
import { createCompanyClient, mapCompanyClientToApiData } from '../../api/companyApi';

interface CompanyClientFormProps {
  client?: CompanyClient;
  onSubmit: (client: CompanyClient) => void;
  onCancel: () => void;
}

export default function CompanyClientForm({ client, onSubmit, onCancel }: CompanyClientFormProps) {
  const [formData, setFormData] = useState<CompanyClient>({
    companyName: '',
    address: '',
    city: '',
    email: '',
    matriculeFiscal: '',
    contact1Name: '',
    contact1Phone: '',
    contact2Name: '',
    contact2Phone: '',
    contact3Name: '',
    contact3Phone: ''
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
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.matriculeFiscal.trim()) {
      newErrors.matriculeFiscal = 'Tax registration number is required';
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      if (!client) {
        // Creating a new company client
        const apiData = mapCompanyClientToApiData(formData);
        await createCompanyClient(apiData);
      }
      
      onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors(prev => ({ ...prev, form: 'Failed to save company. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.form && (
        <div className="p-3 bg-red-100 text-red-800 rounded-lg">
          {errors.form}
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
            Company Name*
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className={`w-full p-2 border rounded-lg ${
              errors.companyName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.companyName && (
            <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="matriculeFiscal" className="block text-sm font-medium text-gray-700 mb-1">
            Tax Registration Number*
          </label>
          <input
            type="text"
            id="matriculeFiscal"
            name="matriculeFiscal"
            value={formData.matriculeFiscal
            }
            onChange={handleChange}
            className={`w-full p-2 border rounded-lg ${
              errors.matriculeFiscal
              ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.matriculeFiscal
 && (
            <p className="mt-1 text-sm text-red-600">{errors.matriculeFiscal}</p>
          )}
        </div>
      </div>
      
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
          Address*
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className={`w-full p-2 border rounded-lg ${
            errors.address ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address}</p>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            City*
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={`w-full p-2 border rounded-lg ${
              errors.city ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-600">{errors.city}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-2 border rounded-lg ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-md font-medium text-gray-700 mb-3">Contact Information</h4>
        
        <div className="space-y-4">
          {/* Contact 1 */}
          <div className="grid grid-cols-2 gap-4">
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
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="contact1Phone" className="block text-sm font-medium text-gray-700 mb-1">
                Contact 1 Phone
              </label>
              <input
                type="text"
                id="contact1Phone"
                name="contact1Phone"
                value={formData.contact1Phone}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          
          {/* Contact 2 */}
          <div className="grid grid-cols-2 gap-4">
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
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="contact2Phone" className="block text-sm font-medium text-gray-700 mb-1">
                Contact 2 Phone
              </label>
              <input
                type="text"
                id="contact2Phone"
                name="contact2Phone"
                value={formData.contact2Phone}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          
          {/* Contact 3 */}
          <div className="grid grid-cols-2 gap-4">
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
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="contact3Phone" className="block text-sm font-medium text-gray-700 mb-1">
                Contact 3 Phone
              </label>
              <input
                type="text"
                id="contact3Phone"
                name="contact3Phone"
                value={formData.contact3Phone}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : client ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}