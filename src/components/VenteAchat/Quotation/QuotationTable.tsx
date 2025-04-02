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
  onExportPDF: (quotation: Quotation) => void; // Add this prop to handle PDF export
  refreshQuotations?: () => void;
}

export function QuotationTable({
  devis,
  isLoading,
  onShowQuotation,
  onEditQuotation,
  onDeleteQuotation,
  onExportPDF, // Destructure the new prop
  refreshQuotations,
}: QuotationTableProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showConfirmValidate, setShowConfirmValidate] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [validateId, setValidateId] = useState<number | null>(null);

  if (isLoading) {
    return <p>Chargement des devis...</p>;
  }

  const pendingDevis = devis.filter((devisItem) => devisItem.Status === QuotationStatus.PENDING);

  if (pendingDevis.length === 0) {
    return <p>Aucun devis en attente disponible.</p>;
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
        toast.success(`Devis ${validateId} validé avec succès !`, {
          position: "top-right",
          autoClose: 3000,
        });
        if (refreshQuotations) {
          refreshQuotations();
        }
      } catch (error) {
        console.error(`Échec de la validation du devis ${validateId}:`, error);
        toast.error(`Échec de la validation du devis ${validateId}.`, {
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
      return devisItem.CustomerType === 'NORMAL' ? 'Client inconnu' : 'Entreprise inconnue';
    }
    if (typeof devisItem.CustomerDetails === 'string') {
      return devisItem.CustomerDetails;
    }
    return devisItem.CustomerType === 'NORMAL'
      ? devisItem.CustomerDetails.FullName || 'Client inconnu'
      : devisItem.CustomerDetails.CompanyName || 'Entreprise inconnue';
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
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
                Client / Projet
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Désignations
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produits
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prix total
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
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
                  <div className="text-gray-600">
                    ({devisItem.CustomerType === 'NORMAL' ? 'Client individuel' : 'Entreprise'})
                  </div>
                  <div className="mt-2 text-gray-700">Projet : {devisItem.ProjectName}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="space-y-2">
                    {devisItem.Designations.map((designation, index) => (
                      <div key={index} className="font-medium text-gray-900">{designation.Name}(Qté : {designation.Quantity})</div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="space-y-2">
                    {devisItem.Designations.map((designation, index) => (
                      <div key={index}>
                        {designation.Products.map((product, productIndex) => (
                          <div key={productIndex} className="text-gray-600">
                            {product.ProductName || 'Produit inconnu'} (Qté : {product.Quantity})
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
                  {devisItem.TotalPriceHT.toFixed(2)} TND
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    En attente
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => onShowQuotation(devisItem)}
                      className="text-green-600 hover:text-green-900 hover:scale-110 transition-transform duration-150"
                      title="Voir le devis"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onExportPDF(devisItem)} // Use the passed prop
                      className="text-gray-600 hover:text-gray-900 hover:scale-110 transition-transform duration-150"
                      title="Exporter en PDF"
                    >
                      <FileDown className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleValidateClick(devisItem.Id)}
                      className="text-blue-600 hover:text-blue-900 hover:scale-110 transition-transform duration-150"
                      title="Convertir en facture"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onEditQuotation(devisItem)}
                      className="text-yellow-600 hover:text-yellow-900 hover:scale-110 transition-transform duration-150"
                      title="Modifier le devis"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(devisItem.Id)}
                      className="text-red-600 hover:text-red-900 hover:scale-110 transition-transform duration-150"
                      title="Supprimer le devis"
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
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer le devis #${deleteId} ? Cette action ne peut pas être annulée.`}
      />

      <ConfirmationModal
        isOpen={showConfirmValidate}
        onClose={() => setShowConfirmValidate(false)}
        onConfirm={handleValidateConfirm}
        title="Confirmer la validation"
        message={`Êtes-vous sûr de vouloir convertir le devis #${validateId} en facture ? Cela le marquera comme APPROUVÉ.`}
      />
    </>
  );
}