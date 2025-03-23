// src/components/comptability/InvoiceTable.tsx
import { useState, useEffect } from 'react';
import { Eye, FileDown, Trash } from 'lucide-react';
import { Quotation, QuotationStatus } from '../../../api/quotationApi';
import { Product } from '../../../types/product';
import { NormalClient, CompanyClient } from '../../../types/client';
import { ConfirmationModal } from './ConfirmationModal';
import { getAllQuotations, deleteQuotation } from '../../../api/quotationApi';
import { InvoiceModal } from './InvoiceModal';
import { InvoiceSearchFilter } from './InvoiceSearchFilter';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface InvoiceTableProps {
  devis?: Quotation[];
  isLoading?: boolean;
  onShowInvoice?: (devisItem: Quotation) => void;
  onDeleteInvoice?: (id: number) => void;
  products?: Product[];
  normalClients?: NormalClient[];
  companyClients?: CompanyClient[];
  refreshInvoices?: () => void;
}

const exportToPDF = function () {
  console.log('Exporting invoice to PDF...');
};

export function InvoiceTable({
  devis: propDevis,
  isLoading: propIsLoading,
  onShowInvoice = (item) => console.log('Show Invoice:', item),
  onDeleteInvoice = async (id) => await deleteQuotation(id),
  products = [],
  refreshInvoices: parentRefreshInvoices,
}: InvoiceTableProps) {
  const [devis, setDevis] = useState<Quotation[]>(propDevis || []);
  const [filteredDevis, setFilteredDevis] = useState<Quotation[]>([]);
  const [isLoading, setIsLoading] = useState(propIsLoading || false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Quotation | null>(null);

  useEffect(() => {
    if (!propDevis) {
      fetchInvoices();
    } else {
      setDevis(propDevis);
      setFilteredDevis(propDevis); // Initialize filteredDevis with propDevis
    }
  }, [propDevis]);

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const data = await getAllQuotations();
      setDevis(data || []);
      setFilteredDevis(data || []); // Initialize filteredDevis with fetched data
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
      setDevis([]);
      setFilteredDevis([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filtered: Quotation[]) => {
    setFilteredDevis(filtered);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setShowConfirmDelete(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteId !== null) {
      try {
        await onDeleteInvoice(deleteId);
        toast.success(`Invoice ${deleteId} deleted successfully!`, {
          position: "top-right",
          autoClose: 3000,
        });
        setDevis((prevDevis) => prevDevis.filter((item) => item.Id !== deleteId));
        setFilteredDevis((prevFiltered) => prevFiltered.filter((item) => item.Id !== deleteId));
        if (parentRefreshInvoices) {
          parentRefreshInvoices();
        }
        setDeleteId(null);
      } catch (error) {
        console.error(`Failed to delete invoice ${deleteId}:`, error);
        toast.error(`Failed to delete Invoice ${deleteId}.`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
      setShowConfirmDelete(false);
    }
  };

  const handleShowInvoice = (devisItem: Quotation) => {
    setSelectedInvoice(devisItem);
    onShowInvoice(devisItem);
  };

  const getClientName = (devisItem: Quotation): string => {
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

  if (isLoading) {
    return <p>Loading invoices...</p>;
  }

  const approvedDevis = filteredDevis.filter((devisItem) => devisItem.Status === QuotationStatus.APPROVED);

  if (approvedDevis.length === 0) {
    return (
      <>
        <InvoiceSearchFilter devis={devis} onFilterChange={handleFilterChange} />
        <p>No approved invoices available.</p>
      </>
    );
  }

  return (
    <>
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
      <h2 className="text-xl font-semibold text-gray-900">Facture</h2>
      <br></br>
      <InvoiceSearchFilter devis={devis} onFilterChange={handleFilterChange} />
      <div className="mt-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-200 sticky top-0">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300">
                Client / Project
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300">
                Designations
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300">
                Products
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300">
                Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300">
                Total Price
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300">
                Status
              </th>
              <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {approvedDevis.map((devisItem) => (
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
                      <div key={index} className="font-medium text-gray-900">
                        {designation.Name}
                      </div>
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
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {devisItem.Status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => handleShowInvoice(devisItem)}
                      className="text-green-600 hover:text-green-900 hover:scale-110 transition-transform duration-150"
                      title="View Invoice"
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
                      onClick={() => handleDeleteClick(devisItem.Id)}
                      className="text-red-600 hover:text-red-900 hover:scale-110 transition-transform duration-150"
                      title="Delete Invoice"
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
        message={`Are you sure you want to delete Invoice #${deleteId}? This action cannot be undone.`}
      />

      {selectedInvoice && (
        <InvoiceModal
          invoiceItem={selectedInvoice}
          products={products}
          onClose={() => setSelectedInvoice(null)}
          onExportPDF={exportToPDF}
          onDelete={onDeleteInvoice}
          refreshInvoices={parentRefreshInvoices || fetchInvoices}
        />
      )}</div></div>
    </>
  );
}