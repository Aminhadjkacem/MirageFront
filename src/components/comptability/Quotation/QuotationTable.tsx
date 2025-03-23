import { useState } from 'react';
import { ArrowRight, Pencil, Trash, Eye, FileDown } from 'lucide-react';
import { Quotation, QuotationStatus } from '../../../api/quotationApi';
import { ConfirmationModal } from './ConfirmationModal';
import { validateQuotation } from '../../../api/invoiceApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface QuotationTableProps {
  devis: Quotation[];
  isLoading: boolean;
  onShowQuotation: (devisItem: Quotation) => void;
  onEditQuotation: (devisItem: Quotation) => void;
  onDeleteQuotation: (id: number) => void;
  refreshQuotations?: () => void;
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
  refreshQuotations,
}: QuotationTableProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showConfirmValidate, setShowConfirmValidate] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [validateId, setValidateId] = useState<number | null>(null);

  if (isLoading) {
    return <p>Loading quotations...</p>;
  }

  const pendingDevis = devis.filter((devisItem) => devisItem.Status === QuotationStatus.PENDING);

  if (pendingDevis.length === 0) {
    return <p>No pending quotations available.</p>;
  }

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setShowConfirmDelete(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteId !== null) {
      onDeleteQuotation(deleteId);
      setDeleteId(null);
    }
    setShowConfirmDelete(false);
  };

  const handleValidateClick = (id: number) => {
    setValidateId(id);
    setShowConfirmValidate(true);
  };

  const handleValidateConfirm = async () => {
    if (validateId !== null) {
      try {
        await validateQuotation(validateId);
        toast.success(`Quotation ${validateId} validated successfully!`, {
          position: "top-right",
          autoClose: 3000,
        });
        if (refreshQuotations) {
          refreshQuotations();
        }
      } catch (error) {
        console.error(`Failed to validate quotation ${validateId}:`, error);
        toast.error(`Failed to validate Quotation ${validateId}.`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
      setValidateId(null);
    }
    setShowConfirmValidate(false);
  };

  const getClientName = (devisItem: Quotation): string => {
    if (!devisItem.CustomerDetails) {
      return devisItem.CustomerType === 'NORMAL' ? 'Unknown Client' : 'Unknown Company';
    }
    if (typeof devisItem.CustomerDetails === 'string') {
      return devisItem.CustomerDetails;
    }
    return devisItem.CustomerType === 'NORMAL'
      ? devisItem.CustomerDetails.FullName || 'Unknown Client'
      : devisItem.CustomerDetails.CompanyName || 'Unknown Company';
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Price
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pendingDevis.map((devisItem) => (
              <tr
                key={devisItem.Id}
                className="hover:bg-gray-100 transition-colors duration-150 ease-in-out"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="font-bold text-gray-900">{getClientName(devisItem)}</div>
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(devisItem.CreatedAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {devisItem.TotalPrice.toFixed(2)} TND
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {devisItem.Status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => onShowQuotation(devisItem)}
                      className="text-green-600 hover:text-green-900 hover:scale-110 transition-transform duration-150"
                      title="View Quotation"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={exportToPDF}
                      className="text-gray-600 hover:text-gray-900 hover:scale-110 transition-transform duration-150"
                      title="Export PDF"
                    >
                      <FileDown className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleValidateClick(devisItem.Id)}
                      className="text-blue-600 hover:text-blue-900 hover:scale-110 transition-transform duration-150"
                      title="Convert to Facture"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onEditQuotation(devisItem)}
                      className="text-yellow-600 hover:text-yellow-900 hover:scale-110 transition-transform duration-150"
                      title="Edit Quotation"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(devisItem.Id)}
                      className="text-red-600 hover:text-red-900 hover:scale-110 transition-transform duration-150"
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

      <ConfirmationModal
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Deletion"
        message={`Are you sure you want to delete Quotation #${deleteId}? This action cannot be undone.`}
      />

      <ConfirmationModal
        isOpen={showConfirmValidate}
        onClose={() => setShowConfirmValidate(false)}
        onConfirm={handleValidateConfirm}
        title="Confirm Validation"
        message={`Are you sure you want to convert Quotation #${validateId} to an invoice? This will mark it as APPROVED.`}
      />
    </>
  );
}