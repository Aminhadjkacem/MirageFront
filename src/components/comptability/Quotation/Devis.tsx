import { useState, useEffect } from 'react';
import { QuotationModal } from './QuotationModal';
import { DevisHeader } from './DevisHeader';
import { QuotationForm } from './QuotationForm';
import { QuotationTable } from './QuotationTable';
import { QuotationSearchFilter } from './QuotationSearchFilter'; // Add new component
import { createQuotation, deleteQuotation, updateQuotation, getAllQuotations, Quotation, QuotationRequest, QuotationUpdateRequest } from '../../../api/quotationApi';
import productsApi from '../../../api/products';
import { getNormalClients, mapApiDataToNormal } from '../../../api/clientApi';
import { getCompanyClients, mapApiDataToCompanyClient } from '../../../api/companyApi';
import { NormalClient, CompanyClient } from '../../../types/client';
import { Product } from '../../../types/product';

export default function Devis() {
  const [devis, setDevis] = useState<Quotation[]>([]);
  const [filteredDevis, setFilteredDevis] = useState<Quotation[]>([]); // Add filtered state
  const [products, setProducts] = useState<Product[]>([]);
  const [normalClients, setNormalClients] = useState<NormalClient[]>([]);
  const [companyClients, setCompanyClients] = useState<CompanyClient[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<{ item: Quotation; editMode: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const quotations = await getAllQuotations();
        setDevis(quotations || []);
        setFilteredDevis(quotations || []); // Initialize filteredDevis with full list
        const productList = await productsApi.getAll();
        setProducts(productList || []);
        const normalClientsList = await getNormalClients();
        const mappedNormalClients = normalClientsList.map(mapApiDataToNormal);
        setNormalClients(mappedNormalClients || []);
        const companyClientsList = await getCompanyClients();
        const mappedCompanyClients = companyClientsList.map(mapApiDataToCompanyClient);
        setCompanyClients(mappedCompanyClients || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setDevis([]);
        setFilteredDevis([]); // Reset filteredDevis on error
        setProducts([]);
        setNormalClients([]);
        setCompanyClients([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (quotationRequest: QuotationRequest) => {
    try {
      const newQuotation = await createQuotation(quotationRequest);
      setDevis([...devis, newQuotation]);
      setFilteredDevis([...devis, newQuotation]); // Update filtered list
    } catch (error) {
      console.error('Error creating quotation:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteQuotation(id);
      setDevis(devis.filter(item => item.Id !== id));
      setFilteredDevis(filteredDevis.filter(item => item.Id !== id)); // Update filtered list
      if (selectedQuotation?.item.Id === id) setSelectedQuotation(null);
    } catch (error) {
      console.error('Error deleting quotation:', error);
    }
  };

  const handleUpdate = async (updatedQuotation: Quotation) => {
    try {
      const quotationUpdateRequest: QuotationUpdateRequest = {
        Id: updatedQuotation.Id,
        ProjectName: updatedQuotation.ProjectName,
        Designations: updatedQuotation.Designations.map(d => ({
          Id: d.Id || 0,
          Name: d.Name,
          Products: d.Products.map(p => ({
            ProductId: p.ProductId,
            Quantity: p.Quantity,
          })),
        })),
      };
      const updated = await updateQuotation(updatedQuotation.Id, quotationUpdateRequest);
      setDevis(devis.map(item => (item.Id === updatedQuotation.Id ? updated : item)));
      setFilteredDevis(filteredDevis.map(item => (item.Id === updatedQuotation.Id ? updated : item))); // Update filtered list
      setSelectedQuotation({ item: updated, editMode: false });
    } catch (error) {
      console.error('Error updating quotation:', error);
    }
  };

  const exportToPDF = () => {
    console.log('Exporting to PDF...');
  };

  const convertToFacture = (id: number) => {
    console.log('Converting to facture...', id);
    if (selectedQuotation?.item.Id === id) setSelectedQuotation(null);
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
        <DevisHeader onNewQuotationClick={() => setShowForm(true)} />
        {showForm && (
          <QuotationForm
            normalClients={normalClients}
            companyClients={companyClients}
            products={products}
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        )}
        <QuotationSearchFilter devis={devis} onFilterChange={handleFilterChange} /> {/* Add search/filter component */}
        <QuotationTable
          devis={filteredDevis} // Use filtered list instead of full devis
          isLoading={isLoading}
          onShowQuotation={showQuotation}
          onEditQuotation={editQuotation}
          onDeleteQuotation={handleDelete}
          onConvertToFacture={convertToFacture}
        />
        {selectedQuotation && (
          <QuotationModal
            devisItem={selectedQuotation.item}
            products={products}
            normalClients={normalClients}
            companyClients={companyClients}
            onClose={() => setSelectedQuotation(null)}
            onExportPDF={exportToPDF}
            onConvertToFacture={convertToFacture}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            initialEditMode={selectedQuotation.editMode}
          />
        )}
      </div>
    </div>
  );
}