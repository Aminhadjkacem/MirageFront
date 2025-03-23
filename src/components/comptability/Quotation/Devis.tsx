import { useState, useEffect } from 'react';
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
      console.error('Error fetching data:', error);
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
      console.error('Failed to fetch quotations:', error);
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
    } catch (error) {
      console.error('Failed to create quotation:', error);
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

      console.log('Update request payload:', JSON.stringify(updateRequest, null, 2));
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
            CIN: 'cin' in client ? client.cin as string | undefined : undefined, // Type cast to fix
            MatriculeFiscal: 'matriculeFiscal' in client ? client.matriculeFiscal : undefined,
          }
        : {
            id: updatedDevis.CustomerId,
            FullName: updatedDevis.CustomerType === 'NORMAL' ? 'Unknown Client' : undefined,
            CompanyName: updatedDevis.CustomerType === 'COMPANY' ? 'Unknown Company' : undefined,
          };

      const enrichedQuotation: Quotation = {
        ...updatedDevis,
        CustomerDetails: enrichedCustomerDetails,
      };

      setDevis(devis.map(q => (q.Id === enrichedQuotation.Id ? enrichedQuotation : q)));
      setFilteredDevis(filteredDevis.map(q => (q.Id === enrichedQuotation.Id ? enrichedQuotation : q)));
      console.log('Quotation updated:', enrichedQuotation);
      setSelectedQuotation(null);
    } catch (error) {
      console.error('Failed to update quotation:', error);
      throw error;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteQuotation(id);
      setDevis(devis.filter((item) => item.Id !== id));
      setFilteredDevis(filteredDevis.filter((item) => item.Id !== id));
      if (selectedQuotation?.item.Id === id) setSelectedQuotation(null);
    } catch (error) {
      console.error('Error deleting quotation:', error);
    }
  };

  const exportToPDF = () => {
    console.log('Exporting to PDF...');
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
            console.log('New Quotation clicked, setting showForm to true');
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
              console.log('Cancel clicked, setting showForm to false');
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
    </div>
  );
}