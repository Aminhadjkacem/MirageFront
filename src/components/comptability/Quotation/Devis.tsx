import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QuotationModal } from './QuotationModal';
import { DevisHeader } from './DevisHeader';
import { QuotationForm } from './QuotationForm';
import { QuotationTable } from './QuotationTable';
import { QuotationSearchFilter } from './QuotationSearchFilter';
import {
  createQuotation,
  deleteQuotation,
  updateQuotation,
  getAllQuotations,
  Quotation,
  QuotationRequest,
  QuotationUpdateRequest,
  CustomerDetails,
} from '../../../api/quotationApi';
import productsApi from '../../../api/products';
import { getNormalClients, mapApiDataToNormal } from '../../../api/clientApi';
import { getCompanyClients, mapApiDataToCompanyClient } from '../../../api/companyApi';
import { NormalClient, CompanyClient } from '../../../types/client';
import { Product } from '../../../types/product';
import { AxiosError } from 'axios';

export default function Devis() {
  const [devis, setDevis] = useState<Quotation[]>([]);
  const [filteredDevis, setFilteredDevis] = useState<Quotation[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [normalClients, setNormalClients] = useState<NormalClient[]>([]);
  const [companyClients, setCompanyClients] = useState<CompanyClient[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<{ item: Quotation; editMode: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [productList, normalClientsList, companyClientsList] = await Promise.all([
        productsApi.getAll(),
        getNormalClients(),
        getCompanyClients(),
      ]);

      const mappedNormalClients = normalClientsList.map(mapApiDataToNormal);
      const mappedCompanyClients = companyClientsList.map(mapApiDataToCompanyClient);

      setProducts(productList || []);
      setNormalClients(mappedNormalClients || []);
      setCompanyClients(mappedCompanyClients || []);

      const quotations = await getAllQuotations();
      setDevis(quotations || []);
      setFilteredDevis(quotations || []);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast.error('Échec du chargement des données initiales.');
      setDevis([]);
      setFilteredDevis([]);
      setProducts([]);
      setNormalClients([]);
      setCompanyClients([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchQuotations = async () => {
    try {
      setIsLoading(true);
      const quotations = await getAllQuotations();
      setDevis(quotations || []);
      setFilteredDevis(quotations || []);
    } catch (error) {
      console.error('Échec du chargement des devis:', error);
      toast.error('Échec de l’actualisation des devis.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (quotationRequest: QuotationRequest) => {
    try {
      const newQuotation = await createQuotation(quotationRequest);
      setDevis([...devis, newQuotation]);
      setFilteredDevis([...filteredDevis, newQuotation]);
      setShowForm(false);
      toast.success('Devis créé avec succès !');
    } catch (error) {
      const axiosError = error as AxiosError;
      console.log('Erreur Axios brute:', axiosError); // Translated debug log
      console.log('Données de la réponse:', axiosError.response?.data); // Translated debug log
      const errorMessage = axiosError.response?.data
        ? String(axiosError.response.data) // e.g., "Stock insuffisant..."
        : 'Échec de la création du devis en raison d’une erreur inconnue.';
      console.error('Échec de la création du devis:', axiosError);
      toast.error(errorMessage); // Show detailed backend message
    }
  };

  const handleUpdateQuotation = async (updatedDevis: Quotation) => {
    try {
      const updateRequest: QuotationUpdateRequest = {
        Id: updatedDevis.Id,
        ProjectName: updatedDevis.ProjectName,
        Designations: updatedDevis.Designations.map(d => ({
          Id: d.Id || 0,
          Name: d.Name,
          Products: d.Products.map(p => ({
            ProductId: p.ProductId,
            Quantity: p.Quantity,
          })),
        })),
        CustomerType: updatedDevis.CustomerType,
        CustomerId: updatedDevis.CustomerId,
      };

      console.log('Charge utile de la requête de mise à jour:', JSON.stringify(updateRequest, null, 2)); // Translated debug log
      await updateQuotation(updatedDevis.Id, updateRequest);

      const client =
        updatedDevis.CustomerType === 'NORMAL'
          ? normalClients.find(c => c.id === updatedDevis.CustomerId)
          : companyClients.find(c => c.id === updatedDevis.CustomerId);

      const enrichedCustomerDetails: CustomerDetails = client
        ? {
            id: client.id ?? 0,
            FullName: 'fullName' in client ? client.fullName : undefined,
            CompanyName: 'companyName' in client ? client.companyName : undefined,
            Address: client.address,
            Email: client.email,
            PhoneNumber: 'phoneNumber' in client ? client.phoneNumber : undefined,
            CIN: 'cin' in client ? client.cin as string | undefined : undefined,
            MatriculeFiscal: 'matriculeFiscal' in client ? client.matriculeFiscal : undefined,
          }
        : {
            id: updatedDevis.CustomerId,
            FullName: updatedDevis.CustomerType === 'NORMAL' ? 'Client inconnu' : undefined,
            CompanyName: updatedDevis.CustomerType === 'COMPANY' ? 'Entreprise inconnue' : undefined,
          };

      const enrichedQuotation: Quotation = {
        ...updatedDevis,
        CustomerDetails: enrichedCustomerDetails,
      };

      setDevis(devis.map(q => (q.Id === enrichedQuotation.Id ? enrichedQuotation : q)));
      setFilteredDevis(filteredDevis.map(q => (q.Id === enrichedQuotation.Id ? enrichedQuotation : q)));
      console.log('Devis mis à jour:', enrichedQuotation); // Translated debug log
      setSelectedQuotation(null);
      toast.success('Devis mis à jour avec succès !');
    } catch (error) {
      console.error('Échec de la mise à jour du devis:', error);
      toast.error('Échec de la mise à jour du devis.');
      throw error;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteQuotation(id);
      setDevis(devis.filter((item) => item.Id !== id));
      setFilteredDevis(filteredDevis.filter((item) => item.Id !== id));
      if (selectedQuotation?.item.Id === id) setSelectedQuotation(null);
      toast.success('Devis supprimé avec succès !');
    } catch (error) {
      console.error('Erreur lors de la suppression du devis:', error);
      toast.error('Échec de la suppression du devis.');
    }
  };

  const exportToPDF = () => {
    console.log('Exportation en PDF...'); // Translated debug log
    toast.info('Exportation PDF déclenchée (non implémentée pour l’instant).');
  };

  const showQuotation = (devisItem: Quotation) => {
    setSelectedQuotation({ item: devisItem, editMode: false });
  };

  const editQuotation = (devisItem: Quotation) => {
    setSelectedQuotation({ item: devisItem, editMode: true });
  };

  const handleFilterChange = (filtered: Quotation[]) => {
    setFilteredDevis(filtered);
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <DevisHeader
          onNewQuotationClick={() => {
            console.log('Nouveau devis cliqué, activation du formulaire'); // Translated debug log
            setShowForm(true);
          }}
        />
        {showForm ? (
          <QuotationForm
            normalClients={normalClients}
            companyClients={companyClients}
            products={products}
            onSubmit={handleSubmit}
            onCancel={() => {
              console.log('Annuler cliqué, désactivation du formulaire'); // Translated debug log
              setShowForm(false);
            }}
          />
        ) : null}
        <QuotationSearchFilter devis={devis} onFilterChange={handleFilterChange} />
        <QuotationTable
          devis={filteredDevis}
          isLoading={isLoading}
          onShowQuotation={showQuotation}
          onEditQuotation={editQuotation}
          onDeleteQuotation={handleDelete}
          refreshQuotations={fetchQuotations}
        />
        {selectedQuotation && (
          <QuotationModal
            devisItem={selectedQuotation.item}
            products={products}
            normalClients={normalClients}
            companyClients={companyClients}
            onClose={() => setSelectedQuotation(null)}
            onExportPDF={exportToPDF}
            onDelete={handleDelete}
            onUpdate={handleUpdateQuotation}
            initialEditMode={selectedQuotation.editMode}
            refreshQuotations={fetchQuotations}
          />
        )}
      </div>
      <ToastContainer />
    </div>
  );
}