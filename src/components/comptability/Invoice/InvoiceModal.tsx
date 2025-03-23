import { useState, MouseEvent } from 'react';
import { FileDown, Trash, X } from 'lucide-react';
import { Quotation, QuotationStatus } from '../../../api/quotationApi';
import { Product } from '../../../types/product';
import { ConfirmationModal } from './ConfirmationModal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface InvoiceModalProps {
  invoiceItem: Quotation;
  products: Product[];
  onClose: () => void;
  onExportPDF: () => void;
  onDelete: (id: number) => void;
  refreshInvoices?: () => void;
}

export function InvoiceModal({
  invoiceItem,
  products,
  onClose,
  onExportPDF,
  onDelete,
  refreshInvoices,
}: InvoiceModalProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleDeleteConfirm = async () => {
    try {
      await onDelete(invoiceItem.Id);
      toast.success(`Facture ${invoiceItem.Id} supprimée avec succès !`, {
        position: "top-right",
        autoClose: 3000,
      });
      if (refreshInvoices) {
        refreshInvoices(); // Trigger table refresh
      }
      onClose();
    } catch (error) {
      console.error(`Échec de la suppression de la facture ${invoiceItem.Id}:`, error); // Translated console log
      toast.error(`Échec de la suppression de la facture ${invoiceItem.Id}.`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    setShowConfirmDelete(false);
  };

  const getProductName = (productId: number) => {
    return (
      products.find(p => p.id === productId)?.name ||
      invoiceItem.Designations.flatMap(d => d.Products).find(p => p.ProductId === productId)?.ProductName ||
      'Produit inconnu'
    );
  };

  const getClientName = () => {
    return invoiceItem.CustomerType === 'NORMAL'
      ? invoiceItem.CustomerDetails.FullName || 'Client inconnu'
      : invoiceItem.CustomerDetails.CompanyName || 'Entreprise inconnue';
  };

  // Function to determine status badge styling
  const getStatusBadgeClass = (status: QuotationStatus) => {
    switch (status) {
      case QuotationStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case QuotationStatus.APPROVED:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle click outside to close the modal
  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Translate status dynamically
  const translateStatus = (status: QuotationStatus) => {
    switch (status) {
      case QuotationStatus.PENDING:
        return 'En attente';
      case QuotationStatus.APPROVED:
        return 'Approuvée';
      default:
        return status; // Fallback to original if untranslated
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto"
        onClick={handleOverlayClick}
      >
        <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-semibold text-gray-900">Facture #{invoiceItem.Id}</h3>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                  invoiceItem.Status
                )}`}
              >
                {translateStatus(invoiceItem.Status)}
              </span>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Client Information */}
            <section className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Informations sur le client</h4>
              <div className="text-gray-900">
                <p className="font-medium">{getClientName()}</p>
                <p className="text-sm text-gray-600">
                  Type : {invoiceItem.CustomerType === 'NORMAL' ? 'client individuel' : 'entreprise'}
                </p>
              </div>
            </section>

            {/* Project Information */}
            <section className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Informations sur le projet</h4>
              <p className="text-gray-900 font-medium">{invoiceItem.ProjectName}</p>
              <p className="text-sm text-gray-600 mt-1">
                Créée le : {new Date(invoiceItem.CreatedAt).toLocaleDateString('fr-FR')}
              </p>
            </section>

            {/* Designations & Products */}
            <section className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Désignations et produits</h4>
              <div className="space-y-4">
                {invoiceItem.Designations.map((designation, index) => (
                  <div key={index} className="border-b pb-4 last:border-b-0">
                    <p className="font-medium text-gray-900">{designation.Name}</p>
                    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {designation.Products.map((product, productIndex) => (
                        <div key={productIndex} className="flex items-center justify-between">
                          <span className="text-gray-700 text-sm">{getProductName(product.ProductId)}</span>
                          <span className="text-gray-600 text-sm">Qté : {product.Quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Total Price */}
            <section className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Total</h4>
              <p className="text-lg font-semibold text-gray-900">{invoiceItem.TotalPrice.toFixed(2)} TND</p>
            </section>
          </div>

          {/* Footer with Buttons */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex space-x-4">
                <button
                  onClick={onExportPDF}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center transition-colors"
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  Exporter en PDF
                </button>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowConfirmDelete(true)}
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200 flex items-center transition-colors"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer la facture #${invoiceItem.Id} ? Cette action ne peut pas être annulée.`}
      />
    </>
  );
}