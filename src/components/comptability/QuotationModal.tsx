// QuotationModal.tsx (unchanged from previous version)
import { useState } from 'react';
import { FileDown, ArrowRight, Pencil, Trash, X } from 'lucide-react';

type Product = {
  name: string;
  quantity: number;
};

type DevisItem = {
  id: number;
  projectName: string;
  customerName: string;
  clientType: 'Normal' | 'Company';
  designations: Array<{
    title: string;
    products: Product[];
  }>;
  createdAt: string;
};

interface QuotationModalProps {
  devisItem: DevisItem;
  onClose: () => void;
  onExportPDF: () => void;
  onConvertToFacture: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdate: (updatedDevis: DevisItem) => void;
  initialEditMode?: boolean; // New prop to control initial edit state
}

export function QuotationModal({
  devisItem,
  onClose,
  onExportPDF,
  onConvertToFacture,
  onDelete,
  onUpdate,
  initialEditMode = false,
}: QuotationModalProps) {
  const [isEditing, setIsEditing] = useState(initialEditMode);
  const [editedData, setEditedData] = useState<DevisItem>({ ...devisItem });

  const handleInputChange = (field: keyof DevisItem, value: string) => {
    setEditedData({ ...editedData, [field]: value });
  };

  const handleDesignationChange = (index: number, value: string) => {
    const newDesignations = [...editedData.designations];
    newDesignations[index].title = value;
    setEditedData({ ...editedData, designations: newDesignations });
  };

  const handleProductChange = (designationIndex: number, productIndex: number, field: 'name' | 'quantity', value: string) => {
    const newDesignations = [...editedData.designations];
    if (field === 'name') {
      newDesignations[designationIndex].products[productIndex].name = value;
    } else {
      newDesignations[designationIndex].products[productIndex].quantity = parseInt(value) || 1;
    }
    setEditedData({ ...editedData, designations: newDesignations });
  };

  const handleSave = () => {
    onUpdate(editedData);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Quotation #{devisItem.id}</h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700">Client Information</h4>
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={editedData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <select
                  value={editedData.clientType}
                  onChange={(e) => handleInputChange('clientType', e.target.value as 'Normal' | 'Company')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="Normal">Normal</option>
                  <option value="Company">Company</option>
                </select>
              </>
            ) : (
              <>
                <p className="text-gray-900">{devisItem.customerName}</p>
                <p className="text-gray-600">Type: {devisItem.clientType}</p>
              </>
            )}
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700">Project</h4>
            {isEditing ? (
              <input
                type="text"
                value={editedData.projectName}
                onChange={(e) => handleInputChange('projectName', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{devisItem.projectName}</p>
            )}
            <p className="text-gray-600">Date: {devisItem.createdAt}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700">Designations & Products</h4>
            {editedData.designations.map((designation, index) => (
              <div key={index} className="mt-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={designation.title}
                    onChange={(e) => handleDesignationChange(index, e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : (
                  <p className="font-medium text-gray-900">{designation.title}</p>
                )}
                <ul className="ml-4 list-disc text-gray-600">
                  {designation.products.map((product, productIndex) => (
                    <li key={productIndex}>
                      {isEditing ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={product.name}
                            onChange={(e) => handleProductChange(index, productIndex, 'name', e.target.value)}
                            className="block w-2/3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                          <input
                            type="number"
                            value={product.quantity}
                            onChange={(e) => handleProductChange(index, productIndex, 'quantity', e.target.value)}
                            className="block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            min="1"
                          />
                        </div>
                      ) : (
                        `${product.name} - Quantity: ${product.quantity}`
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
                onClick={() => onConvertToFacture(devisItem.id)}
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
                onClick={() => onDelete(devisItem.id)}
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
  );
}