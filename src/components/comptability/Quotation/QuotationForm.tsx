import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import Select from 'react-select';
import { NormalClient, CompanyClient } from '../../../types/client';
import { Product } from '../../../types/product';
import { QuotationRequest } from '../../../api/quotationApi';

interface QuotationFormProps {
  normalClients: NormalClient[];
  companyClients: CompanyClient[];
  products: Product[];
  onSubmit: (quotationRequest: QuotationRequest) => Promise<void>;
  onCancel: () => void;
}

export function QuotationForm({
  normalClients,
  companyClients,
  products,
  onSubmit,
  onCancel,
}: QuotationFormProps) {
  const [formData, setFormData] = useState<{
    projectName: string;
    customerName: string;
    customerId: string;
    clientType: 'NORMAL' | 'COMPANY';
    designations: Array<{
      name: string;
      products: Array<{ productId: number; quantity: number; productName?: string }>;
    }>;
  }>({
    projectName: '',
    customerName: '',
    customerId: '',
    clientType: 'NORMAL',
    designations: [{ name: '', products: [{ productId: 0, quantity: 1, productName: '' }] }],
  });

  const clientOptions = formData.clientType === 'NORMAL'
    ? normalClients.map(client => ({ value: client.id?.toString() || '', label: client.fullName }))
    : companyClients.map(client => ({ value: client.id?.toString() || '', label: client.companyName }));

  const productOptions = products.map(product => ({ value: product, label: product.name }));

  const addNewDesignation = () => {
    setFormData({
      ...formData,
      designations: [
        ...formData.designations,
        { name: '', products: [{ productId: 0, quantity: 1, productName: '' }] },
      ],
    });
  };

  const addNewProduct = (designationIndex: number) => {
    const newDesignations = [...formData.designations];
    newDesignations[designationIndex].products.push({ productId: 0, quantity: 1, productName: '' });
    setFormData({ ...formData, designations: newDesignations });
  };

  const removeProduct = (designationIndex: number, productIndex: number) => {
    if (formData.designations[designationIndex].products.length > 1) {
      const newDesignations = [...formData.designations];
      newDesignations[designationIndex].products = newDesignations[designationIndex].products.filter((_, i) => i !== productIndex);
      setFormData({ ...formData, designations: newDesignations });
    }
  };

  const removeDesignation = (index: number) => {
    if (formData.designations.length > 1) {
      setFormData({
        ...formData,
        designations: formData.designations.filter((_, i) => i !== index),
      });
    }
  };

  const updateDesignation = (index: number, name: string) => {
    const newDesignations = [...formData.designations];
    newDesignations[index].name = name;
    setFormData({ ...formData, designations: newDesignations });
  };

  const updateProduct = (designationIndex: number, productIndex: number, field: 'productId' | 'quantity', value: number | Product) => {
    const newDesignations = [...formData.designations];
    if (field === 'productId') {
      const product = value as Product;
      newDesignations[designationIndex].products[productIndex].productId = product.id;
      newDesignations[designationIndex].products[productIndex].productName = product.name;
    } else if (field === 'quantity') {
      newDesignations[designationIndex].products[productIndex].quantity = value as number;
    }
    setFormData({ ...formData, designations: newDesignations });
  };

  const updateProjectName = (projectName: string) => {
    setFormData({ ...formData, projectName });
  };

  const updateClient = (selectedOption: { label: string; value: string } | null) => {
    setFormData({
      ...formData,
      customerName: selectedOption ? selectedOption.label : '',
      customerId: selectedOption ? selectedOption.value : '',
    });
  };

  const updateClientType = (clientType: 'NORMAL' | 'COMPANY') => {
    setFormData({ ...formData, clientType, customerName: '', customerId: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!formData.projectName.trim() || !formData.customerId) {
      console.error('Project name and customer ID are required');
      return;
    }
    for (const designation of formData.designations) {
      if (!designation.name.trim() || designation.products.some(p => p.productId === 0 || p.quantity <= 0)) {
        console.error('Invalid designation or product data');
        return;
      }
    }
  
    try {
      const quotationRequest: QuotationRequest = {
        ProjectName: formData.projectName,
        CustomerType: formData.clientType,
        CustomerId: Number(formData.customerId),
        Designations: formData.designations.map(d => ({
          Name: d.name, // Explicitly exclude Id
          Products: d.products.map(p => ({
            ProductId: p.productId,
            Quantity: p.quantity,
          })),
        })),
      };
      console.log('Sending quotation request:', JSON.stringify(quotationRequest, null, 2));
      await onSubmit(quotationRequest);
      onCancel();
    } catch (error) {
      console.error('Error creating quotation:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 p-4 rounded-md space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
          <Select
            options={clientOptions}
            value={clientOptions.find(option => option.value === formData.customerId) || null}
            onChange={updateClient}
            placeholder="Type to search clients..."
            isClearable
            className="block w-full"
            classNamePrefix="react-select"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Client Type</label>
          <select
            value={formData.clientType}
            onChange={(e) => updateClientType(e.target.value as 'NORMAL' | 'COMPANY')}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="NORMAL">Normal</option>
            <option value="COMPANY">Company</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
        <input
          type="text"
          value={formData.projectName}
          onChange={(e) => updateProjectName(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      {formData.designations.map((designation, designationIndex) => (
        <div key={designationIndex} className="border border-gray-200 rounded-md p-4 relative">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={designation.name}
                onChange={(e) => updateDesignation(designationIndex, e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
              {formData.designations.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeDesignation(designationIndex)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Products</label>
            {designation.products.map((product, productIndex) => (
              <div key={productIndex} className="flex items-center gap-2">
                <Select
                  options={productOptions}
                  value={productOptions.find(option => option.value.id === product.productId) || null}
                  onChange={(selected) => updateProduct(designationIndex, productIndex, 'productId', selected?.value || { id: 0, name: '', description: '', price: 0, stock: 0, category: '' })}
                  placeholder="Type to search products..."
                  isClearable
                  className="block w-2/3"
                  classNamePrefix="react-select"
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={product.quantity}
                  min="1"
                  onChange={(e) => updateProduct(designationIndex, productIndex, 'quantity', Number(e.target.value))}
                  className="block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                {designation.products.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProduct(designationIndex, productIndex)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addNewProduct(designationIndex)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </button>
          </div>
        </div>
      ))}

      <div className="mt-4">
        <button
          type="button"
          onClick={addNewDesignation}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another Designation
        </button>
      </div>

      <div className="mt-4 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </form>
  );
}