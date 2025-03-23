import { useState } from 'react';
import { Plus, X, CheckCircle } from 'lucide-react';
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

  const [errors, setErrors] = useState<{ projectName?: string; customer?: string; designations?: string }>({});

  const clientOptions =
    formData.clientType === 'NORMAL'
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
      newDesignations[designationIndex].products = newDesignations[designationIndex].products.filter(
        (_, i) => i !== productIndex
      );
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

  const updateProduct = (
    designationIndex: number,
    productIndex: number,
    field: 'productId' | 'quantity',
    value: number | Product
  ) => {
    const newDesignations = [...formData.designations];
    if (field === 'productId') {
      const product = value as Product;
      newDesignations[designationIndex].products[productIndex].productId = product.id;
      newDesignations[designationIndex].products[productIndex].productName = product.name;
    } else if (field === 'quantity') {
      newDesignations[designationIndex].products[productIndex].quantity = Math.max(1, value as number); // Ensure min 1
    }
    setFormData({ ...formData, designations: newDesignations });
  };

  const updateProjectName = (projectName: string) => {
    setFormData({ ...formData, projectName });
    if (projectName.trim()) setErrors({ ...errors, projectName: undefined });
  };

  const updateClient = (selectedOption: { label: string; value: string } | null) => {
    setFormData({
      ...formData,
      customerName: selectedOption ? selectedOption.label : '',
      customerId: selectedOption ? selectedOption.value : '',
    });
    if (selectedOption) setErrors({ ...errors, customer: undefined });
  };

  const updateClientType = (clientType: 'NORMAL' | 'COMPANY') => {
    setFormData({ ...formData, clientType, customerName: '', customerId: '' });
    setErrors({ ...errors, customer: undefined });
  };

  const validateForm = () => {
    const newErrors: { projectName?: string; customer?: string; designations?: string } = {};
    if (!formData.projectName.trim()) newErrors.projectName = 'Le nom du projet est requis.';
    if (!formData.customerId) newErrors.customer = 'Veuillez sélectionner un client.';
    for (const designation of formData.designations) {
      if (!designation.name.trim() || designation.products.some(p => p.productId === 0 || p.quantity <= 0)) {
        newErrors.designations = 'Toutes les désignations doivent avoir un nom et des produits valides.';
        break;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const quotationRequest: QuotationRequest = {
        ProjectName: formData.projectName,
        CustomerType: formData.clientType,
        CustomerId: Number(formData.customerId),
        Designations: formData.designations.map(d => ({
          Name: d.name,
          Products: d.products.map(p => ({
            ProductId: p.productId,
            Quantity: p.quantity,
          })),
        })),
      };
      console.log('Envoi de la requête de devis:', JSON.stringify(quotationRequest, null, 2)); // Translated console log
      await onSubmit(quotationRequest);
      // Success toast and form close handled by Devis.tsx
    } catch (error) {
      console.error('Erreur lors de la création du devis:', error); // Translated console log
      // No toast or onCancel here—let Devis.tsx handle it
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-white p-6 rounded-lg shadow-md space-y-6">
      {/* Client Section */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations sur le client</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom du client <span className="text-red-500">*</span>
            </label>
            <Select
              options={clientOptions}
              value={clientOptions.find(option => option.value === formData.customerId) || null}
              onChange={updateClient}
              placeholder="Rechercher un client..."
              isClearable
              className="block w-full"
              classNamePrefix="react-select"
            />
            {errors.customer && <p className="mt-1 text-sm text-red-600">{errors.customer}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type de client</label>
            <select
              value={formData.clientType}
              onChange={e => updateClientType(e.target.value as 'NORMAL' | 'COMPANY')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3"
            >
              <option value="NORMAL">Individuel</option>
              <option value="COMPANY">Entreprise</option>
            </select>
          </div>
        </div>
      </div>

      {/* Project Section */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Détails du projet</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom du projet <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.projectName}
            onChange={e => updateProjectName(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3"
            placeholder="ex. : Rénovation de bureau"
            required
          />
          {errors.projectName && <p className="mt-1 text-sm text-red-600">{errors.projectName}</p>}
        </div>
      </div>

      {/* Designations Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Articles et désignations</h3>
        {formData.designations.map((designation, designationIndex) => (
          <div
            key={designationIndex}
            className="border border-gray-200 rounded-md p-4 mb-4 bg-gray-50 relative"
          >
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de la désignation <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={designation.name}
                  onChange={e => updateDesignation(designationIndex, e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3"
                  placeholder="ex. : Travaux électriques"
                  required
                />
                {formData.designations.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDesignation(designationIndex)}
                    className="text-red-600 hover:text-red-800"
                    title="Supprimer la désignation"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Produits</label>
              {designation.products.map((product, productIndex) => (
                <div key={productIndex} className="flex items-center gap-3">
                  <Select
                    options={productOptions}
                    value={productOptions.find(option => option.value.id === product.productId) || null}
                    onChange={selected =>
                      updateProduct(designationIndex, productIndex, 'productId', selected?.value || {
                        id: 0,
                        name: '',
                        description: '',
                        price: 0,
                        stock: 0,
                        category: '',
                      })
                    }
                    placeholder="Sélectionner un produit..."
                    isClearable
                    className="w-2/3"
                    classNamePrefix="react-select"
                  />
                  <input
                    type="number"
                    value={product.quantity}
                    min="1"
                    onChange={e => updateProduct(designationIndex, productIndex, 'quantity', Number(e.target.value))}
                    className="w-1/4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3"
                    placeholder="Qté"
                    required
                  />
                  {designation.products.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProduct(designationIndex, productIndex)}
                      className="text-red-600 hover:text-red-800"
                      title="Supprimer le produit"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addNewProduct(designationIndex)}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un produit
              </button>
            </div>
          </div>
        ))}
        {errors.designations && <p className="mt-1 text-sm text-red-600">{errors.designations}</p>}
        <button
          type="button"
          onClick={addNewDesignation}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une autre désignation
        </button>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Créer le devis
        </button>
      </div>
    </form>
  );
}