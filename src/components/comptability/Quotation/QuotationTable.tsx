import { useState } from 'react'; // Add useState import
import { ArrowRight, Pencil, Trash, Eye, FileDown } from 'lucide-react';
import { Quotation } from '../../../api/quotationApi';
import { ConfirmationModal } from './ConfirmationModal'; // Adjust path as needed

interface QuotationTableProps {
  devis: Quotation[];
  isLoading: boolean;
  onShowQuotation: (devisItem: Quotation) => void;
  onEditQuotation: (devisItem: Quotation) => void;
  onDeleteQuotation: (id: number) => void;
  onConvertToFacture: (id: number) => void;
}

const exportToPDF = function () {
  console.log('Exporting to PDF...');
};

export function QuotationTable({
  devis,
  isLoading,
  onShowQuotation,
  onEditQuotation,
  onDeleteQuotation,
  onConvertToFacture,
}: QuotationTableProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false); // State for confirmation modal
  const [deleteId, setDeleteId] = useState<number | null>(null); // Track which quotation to delete

  if (isLoading) {
    return <p>Loading quotations...</p>;
  }

  if (devis.length === 0) {
    return <p>No quotations available.</p>;
  }

  const handleDeleteClick = (id: number) => {
    setDeleteId(id); // Set the ID of the quotation to delete
    setShowConfirmDelete(true); // Show the confirmation modal
  };

  const handleDeleteConfirm = () => {
    if (deleteId !== null) {
      onDeleteQuotation(deleteId); // Call the delete function with the stored ID
      setDeleteId(null); // Reset the ID
    }
    setShowConfirmDelete(false); // Close the modal
  };

  return (
    <>
      <div className="mt-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client / Project
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Designations
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Products
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {devis.map((devisItem) => (
              <tr key={devisItem.Id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="font-bold text-gray-900">
                    {devisItem.CustomerType === 'NORMAL'
                      ? devisItem.CustomerDetails.FullName || 'Unknown Client'
                      : devisItem.CustomerDetails.CompanyName || 'Unknown Company'}
                  </div>
                  <div className="text-gray-600">({devisItem.CustomerType})</div>
                  <div className="mt-2 text-gray-700">Project: {devisItem.ProjectName}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="space-y-2">
                    {devisItem.Designations.map((designation, index) => (
                      <div key={index} className="font-medium text-gray-900">{designation.Name}</div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="space-y-2">
                    {devisItem.Designations.map((designation, index) => (
                      <div key={index}>
                        {designation.Products.map((product, productIndex) => (
                          <div key={productIndex} className="text-gray-600">
                            {product.ProductName || 'Unknown Product'} (Qty: {product.Quantity})
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{devisItem.CreatedAt}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => onShowQuotation(devisItem)}
                      className="text-green-600 hover:text-green-900"
                      title="View Quotation"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={exportToPDF}
                      className="text-gray-600 hover:text-gray-900"
                      title="Export PDF"
                    >
                      <FileDown className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onConvertToFacture(devisItem.Id)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Convert to Facture"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onEditQuotation(devisItem)}
                      className="text-yellow-600 hover:text-yellow-900"
                      title="Edit Quotation"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(devisItem.Id)} // Show confirmation modal instead of direct delete
                      className="text-red-600 hover:text-red-900"
                      title="Delete Quotation"
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Deletion"
        message={`Are you sure you want to delete Quotation #${deleteId}? This action cannot be undone.`}
      />
    </>
  );
}