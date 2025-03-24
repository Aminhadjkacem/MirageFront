import { useState, MouseEvent } from 'react';
import { FileDown, ArrowRight, Pencil, Trash, X, Plus } from 'lucide-react';
import { Quotation, QuotationProduct, QuotationStatus } from '../../../api/quotationApi';
import { Product } from '../../../types/product';
import { NormalClient, CompanyClient } from '../../../types/client';
import Select from 'react-select';
import { ConfirmationModal } from './ConfirmationModal';
import { validateQuotation } from '../../../api/invoiceApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface QuotationModalProps {
  devisItem: Quotation;
  products: Product[];
  normalClients: NormalClient[];
  companyClients: CompanyClient[];
  onClose: () => void;
  onExportPDF: () => void;
  onDelete: (id: number) => void;
  onUpdate: (updatedDevis: Quotation) => void;
  initialEditMode?: boolean;
  refreshQuotations?: () => void;
}

export function QuotationModal({
  devisItem,
  products,
  normalClients,
  companyClients,
  onClose,
  onExportPDF,
  onDelete,
  onUpdate,
  initialEditMode = false,
  refreshQuotations,
}: QuotationModalProps) {
  const [isEditing, setIsEditing] = useState(initialEditMode);
  const [editedData, setEditedData] = useState<Quotation>({ ...devisItem });
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showConfirmValidate, setShowConfirmValidate] = useState(false);

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
    value: string | number
  ) => {
    const newDesignations = [...editedData.Designations];
    if (field === 'Quantity') {
      newDesignations[designationIndex].Products[productIndex][field] = parseInt(value as string) || 1;
    } else if (field === 'ProductId') {
      newDesignations[designationIndex].Products[productIndex][field] = value as number;
    }
    setEditedData({ ...editedData, Designations: newDesignations });
  };

  const addNewDesignation = () => {
    setEditedData({
      ...editedData,
      Designations: [
        ...editedData.Designations,
        { Id: 0, Name: '', Products: [{ ProductId: 0, Quantity: 1 }] }, // Id: 0 for new designations
      ],
    });
  };

  const addNewProduct = (designationIndex: number) => {
    const newDesignations = [...editedData.Designations];
    newDesignations[designationIndex].Products.push({ ProductId: 0, Quantity: 1 });
    setEditedData({ ...editedData, Designations: newDesignations });
  };

  const removeDesignation = (index: number) => {
    if (editedData.Designations.length > 1) {
      setEditedData({
        ...editedData,
        Designations: editedData.Designations.filter((_, i) => i !== index),
      });
    }
  };

  const removeProduct = (designationIndex: number, productIndex: number) => {
    const newDesignations = [...editedData.Designations];
    if (newDesignations[designationIndex].Products.length > 1) {
      newDesignations[designationIndex].Products = newDesignations[designationIndex].Products.filter(
        (_, i) => i !== productIndex
      );
      setEditedData({ ...editedData, Designations: newDesignations });
    }
  };

  const handleSave = async () => {
    try {
      // Validate data before saving
      if (!editedData.ProjectName.trim()) {
        toast.error('Le nom du projet est requis.', { position: 'top-right', autoClose: 3000 });
        return;
      }
      for (const designation of editedData.Designations) {
        if (!designation.Name.trim() || designation.Products.some(p => p.ProductId === 0 || p.Quantity <= 0)) {
          toast.error('Toutes les désignations et produits doivent être valides.', { position: 'top-right', autoClose: 3000 });
          return;
        }
      }

      await onUpdate(editedData);
      toast.success(`Devis #${devisItem.Id} mis à jour avec succès !`, {
        position: 'top-right',
        autoClose: 3000,
      });
      setIsEditing(false);
    } catch (error) {
      console.error(`Échec de la mise à jour du devis ${devisItem.Id}:`, error); // Translated console log
      toast.error(`Échec de la mise à jour du devis #${devisItem.Id}.`, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await onDelete(devisItem.Id);
      toast.success(`Devis #${devisItem.Id} supprimé avec succès !`, {
        position: 'top-right',
        autoClose: 3000,
      });
      onClose();
    } catch (error) {
      console.error(`Échec de la suppression du devis ${devisItem.Id}:`, error); // Translated console log
      toast.error(`Échec de la suppression du devis #${devisItem.Id}.`, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleValidateClick = () => {
    setShowConfirmValidate(true);
  };

  const handleValidateConfirm = async () => {
    try {
      await validateQuotation(devisItem.Id);
      toast.success(`Devis #${devisItem.Id} validé avec succès !`, {
        position: 'top-right',
        autoClose: 3000,
      });
      if (refreshQuotations) refreshQuotations();
      onClose();
    } catch (error) {
      console.error(`Échec de la validation du devis ${devisItem.Id}:`, error); // Translated console log
      toast.error(`Échec de la validation du devis #${devisItem.Id}.`, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
    setShowConfirmValidate(false);
  };

  const getProductName = (productId: number) => {
    return (
      products.find(p => p.id === productId)?.name ||
      devisItem.Designations.flatMap(d => d.Products).find(p => p.ProductId === productId)?.ProductName ||
      'Produit inconnu'
    );
  };

  const getClientName = () => {
    return editedData.CustomerType === 'NORMAL'
      ? editedData.CustomerDetails.FullName || 'Client inconnu'
      : editedData.CustomerDetails.CompanyName || 'Entreprise inconnue';
  };

  const clientOptions =
    editedData.CustomerType === 'NORMAL'
      ? normalClients.map(client => ({ value: client.id?.toString() || '', label: client.fullName }))
      : companyClients.map(client => ({ value: client.id?.toString() || '', label: client.companyName }));

  const productOptions = products.map(product => ({ value: product.id, label: product.name }));

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

  const translateStatus = (status: QuotationStatus) => {
    switch (status) {
      case QuotationStatus.PENDING:
        return 'En attente';
      case QuotationStatus.APPROVED:
        return 'Approuvé';
      default:
        return status; // Fallback to original if untranslated
    }
  };

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
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
              <h3 className="text-xl font-semibold text-gray-900">Devis #{devisItem.Id}</h3>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                  devisItem.Status
                )}`}
              >
                {translateStatus(devisItem.Status)}
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
              {isEditing ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Select
                    options={clientOptions}
                    value={clientOptions.find(option => option.value === editedData.CustomerId?.toString()) || null}
                    onChange={handleCustomerIdChange}
                    placeholder="Sélectionner un client..."
                    className="text-sm"
                    classNamePrefix="react-select"
                  />
                  <select
                    value={editedData.CustomerType}
                    onChange={(e) => handleInputChange('CustomerType', e.target.value)}
                    className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="NORMAL">Individuel</option>
                    <option value="COMPANY">Entreprise</option>
                  </select>
                </div>
              ) : (
                <div className="text-gray-900">
                  <p className="font-medium">{getClientName()}</p>
                  <p className="text-sm text-gray-600">
                    Type : {editedData.CustomerType === 'NORMAL' ? 'client individuel' : 'entreprise'}
                  </p>
                </div>
              )}
            </section>

            {/* Project Information */}
            <section className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Informations sur le projet</h4>
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.ProjectName}
                  onChange={(e) => handleInputChange('ProjectName', e.target.value)}
                  className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Nom du projet"
                />
              ) : (
                <p className="text-gray-900 font-medium">{devisItem.ProjectName}</p>
              )}
              <p className="text-sm text-gray-600 mt-1">
                Créé le : {new Date(devisItem.CreatedAt).toLocaleDateString('fr-FR')}
              </p>
            </section>

            {/* Designations & Products */}
            <section className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Désignations et produits</h4>
              <div className="space-y-4">
                {editedData.Designations.map((designation, index) => (
                  <div key={index} className="border-b pb-4 last:border-b-0 relative">
                    {isEditing ? (
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={designation.Name}
                          onChange={(e) => handleDesignationChange(index, e.target.value)}
                          className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder="Nom de la désignation"
                        />
                        {editedData.Designations.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDesignation(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <p className="font-medium text-gray-900">{designation.Name}</p>
                    )}
                    <div className="mt-2 space-y-2">
                      {designation.Products.map((product, productIndex) => (
                        <div key={productIndex} className="flex items-center justify-between gap-2">
                          {isEditing ? (
                            <>
                              <Select
                                options={productOptions}
                                value={productOptions.find(option => option.value === product.ProductId) || null}
                                onChange={(selected) =>
                                  handleProductChange(index, productIndex, 'ProductId', selected?.value || 0)
                                }
                                placeholder="Sélectionner un produit..."
                                className="w-2/3 text-sm"
                                classNamePrefix="react-select"
                              />
                              <input
                                type="number"
                                value={product.Quantity}
                                onChange={(e) => handleProductChange(index, productIndex, 'Quantity', e.target.value)}
                                className="w-20 p-1 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                min="1"
                              />
                              {designation.Products.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeProduct(index, productIndex)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <X className="h-5 w-5" />
                                </button>
                              )}
                            </>
                          ) : (
                            <>
                              <span className="text-gray-700 text-sm">{getProductName(product.ProductId)}</span>
                              <span className="text-gray-600 text-sm">Qté : {product.Quantity}</span>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => addNewProduct(index)}
                        className="mt-2 inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter un produit
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {isEditing && (
                <button
                  type="button"
                  onClick={addNewDesignation}
                  className="mt-4 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une autre désignation
                </button>
              )}
            </section>

            {/* Total Price */}
            <section className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Total</h4>
              <p className="text-lg font-semibold text-gray-900">{devisItem.TotalPriceHT.toFixed(2)} TND</p>
            </section>
          </div>

          {/* Footer with Buttons */}
          <div className="p-6 border-t border-gray-200">
            {isEditing ? (
              <div className="flex justify-start space-x-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Enregistrer les modifications
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex space-x-4">
                  <button
                    onClick={onExportPDF}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center transition-colors"
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    Exporter en PDF
                  </button>
                  <button
                    onClick={handleValidateClick}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center transition-colors"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Convertir en facture
                  </button>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-sm font-medium text-yellow-600 bg-yellow-100 rounded-md hover:bg-yellow-200 flex items-center transition-colors"
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Modifier
                  </button>
                  <button
                    onClick={() => setShowConfirmDelete(true)}
                    className="px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200 flex items-center transition-colors"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Supprimer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer le devis #${devisItem.Id} ? Cette action ne peut pas être annulée.`}
      />

      <ConfirmationModal
        isOpen={showConfirmValidate}
        onClose={() => setShowConfirmValidate(false)}
        onConfirm={handleValidateConfirm}
        title="Confirmer la validation"
        message={`Êtes-vous sûr de vouloir convertir le devis #${devisItem.Id} en facture ? Cela le marquera comme APPROUVÉ.`}
      />
    </>
  );
}