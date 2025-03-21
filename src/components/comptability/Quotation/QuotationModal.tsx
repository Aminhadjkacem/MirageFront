import { useState } from 'react';
import { FileDown, ArrowRight, Pencil, Trash, X } from 'lucide-react';
import { Quotation, QuotationProduct } from '../../../api/quotationApi';
import { Product } from '../../../types/product';
import { NormalClient, CompanyClient } from '../../../types/client';
import Select from 'react-select';
import { ConfirmationModal } from './ConfirmationModal'; // Adjust path as needed

interface QuotationModalProps {
  devisItem: Quotation;
  products: Product[];
  normalClients: NormalClient[];
  companyClients: CompanyClient[];
  onClose: () => void;
  onExportPDF: () => void;
  onConvertToFacture: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdate: (updatedDevis: Quotation) => void;
  initialEditMode?: boolean;
}

export function QuotationModal({
  devisItem,
  products,
  normalClients,
  companyClients,
  onClose,
  onExportPDF,
  onConvertToFacture,
  onDelete,
  onUpdate,
  initialEditMode = false,
}: QuotationModalProps) {
  const [isEditing, setIsEditing] = useState(initialEditMode);
  const [editedData, setEditedData] = useState<Quotation>({ ...devisItem });
  const [showConfirmDelete, setShowConfirmDelete] = useState(false); // State for confirmation modal

  const handleInputChange = (field: keyof Quotation, value: string) => {
    setEditedData({ ...editedData, [field]: value });
  };

  const handleCustomerIdChange = (selectedOption: { value: string; label: string } | null) => {
    setEditedData({
      ...editedData,
      CustomerId: selectedOption ? parseInt(selectedOption.value) : devisItem.CustomerId || 0,
    });
  };

  const handleDesignationChange = (index: number, value: string) => {
    const newDesignations = [...editedData.Designations];
    newDesignations[index].Name = value;
    setEditedData({ ...editedData, Designations: newDesignations });
  };

  const handleProductChange = (
    designationIndex: number,
    productIndex: number,
    field: keyof QuotationProduct,
    value: string
  ) => {
    const newDesignations = [...editedData.Designations];
    if (field === 'Quantity') {
      newDesignations[designationIndex].Products[productIndex][field] = parseInt(value) || 1;
    }
    setEditedData({ ...editedData, Designations: newDesignations });
  };

  const handleSave = () => {
    onUpdate(editedData);
    setIsEditing(false);
  };

  const handleDeleteConfirm = () => {
    onDelete(devisItem.Id);
    onClose(); // Close the main modal after deletion
  };

  const getProductName = (productId: number) => {
    return (
      products.find(p => p.id === productId)?.name ||
      devisItem.Designations.flatMap(d => d.Products).find(p => p.ProductId === productId)?.ProductName ||
      'Unknown Product'
    );
  };

  const getClientName = () => {
    if (devisItem.CustomerType === 'NORMAL') {
      return devisItem.CustomerDetails.FullName || 'Unknown Client';
    } else {
      return devisItem.CustomerDetails.CompanyName || 'Unknown Company';
    }
  };

  const clientOptions =
    editedData.CustomerType === 'NORMAL'
      ? normalClients.map(client => ({ value: client.id?.toString() || '', label: client.fullName }))
      : companyClients.map(client => ({ value: client.id?.toString() || '', label: client.companyName }));

  return (
    <>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Quotation #{devisItem.Id}</h3>
            <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700">Client Information</h4>
              {isEditing ? (
                <>
                  <Select
                    options={clientOptions}
                    value={clientOptions.find(option => option.value === editedData.CustomerId?.toString()) || null}
                    onChange={handleCustomerIdChange}
                    placeholder="Select a client..."
                    className="mt-1 block w-full"
                    classNamePrefix="react-select"
                  />
                  <select
                    value={editedData.CustomerType}
                    onChange={(e) => handleInputChange('CustomerType', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="COMPANY">Company</option>
                  </select>
                </>
              ) : (
                <>
                  <p className="text-gray-900">{getClientName()}</p>
                  <p className="text-gray-600">Type: {devisItem.CustomerType}</p>
                </>
              )}
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700">Project</h4>
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.ProjectName}
                  onChange={(e) => handleInputChange('ProjectName', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900">{devisItem.ProjectName}</p>
              )}
              <p className="text-gray-600">Date: {devisItem.CreatedAt}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700">Designations & Products</h4>
              {editedData.Designations.map((designation, index) => (
                <div key={index} className="mt-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={designation.Name}
                      onChange={(e) => handleDesignationChange(index, e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="font-medium text-gray-900">{designation.Name}</p>
                  )}
                  <ul className="ml-4 list-disc text-gray-600">
                    {designation.Products.map((product, productIndex) => (
                      <li key={productIndex}>
                        {isEditing ? (
                          <div className="flex gap-2">
                            <span className="w-2/3">{getProductName(product.ProductId)}</span>
                            <input
                              type="number"
                              value={product.Quantity}
                              onChange={(e) => handleProductChange(index, productIndex, 'Quantity', e.target.value)}
                              className="block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              min="1"
                            />
                          </div>
                        ) : (
                          `${product.ProductName || getProductName(product.ProductId)} - Quantity: ${product.Quantity}`
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onExportPDF}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  Export PDF
                </button>
                <button
                  onClick={() => onConvertToFacture(devisItem.Id)}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-300 rounded-md hover:bg-blue-50"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Convert to Facture
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-yellow-600 bg-white border border-yellow-300 rounded-md hover:bg-yellow-50"
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => setShowConfirmDelete(true)} // Show confirmation modal
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Deletion"
        message={`Are you sure you want to delete Quotation #${devisItem.Id}? This action cannot be undone.`}
      />
    </>
  );
}