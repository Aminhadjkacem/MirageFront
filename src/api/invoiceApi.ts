// invoiceApi.ts
import axios, { AxiosError } from 'axios';
import { QuotationStatus } from './quotationApi'; // Import types from quotationApi

const API_BASE_URL = 'https://localhost:7060/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
apiClient.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem("user");
  const userData = storedUser ? JSON.parse(storedUser) : null;
  const token = userData?.Token; // Retrieve token from local storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
export interface Invoice {
  Id: number;
  ProjectName: string;
  CustomerType: 'NORMAL' | 'COMPANY';
  CustomerId: number;
  CustomerDetails: CustomerDetails;
  InvoiceCreatedAt: string;
  Designations: Designation[];
  TotalPrice: number;
  TotalPriceHT: number;
  Status: QuotationStatus;
}
export interface Designation {
  Id?: number; // Optional, included in response
  Name: string;
  Quantity: number; // Added quantity field
  Products: QuotationProduct[];
}
export interface QuotationProduct {
  ProductId: number;
  Quantity: number;
  ProductName?: string; // Optional, included in response
}

export interface CustomerDetails {
    id: number;
    FullName?: string;
    CompanyName?: string;
    PhoneNumber?: string;
    Address?: string;
    Email?: string;
    CIN?: string;
    MatriculeFiscal?: string;
    [key: string]: unknown; // Allow extra fields
  }
// Raw response type from the API (same as in quotationApi.ts)
interface RawQuotationResponse {
  Id: number;
  ProjectName: string;
  InvoiceCreatedAt: string;
  CustomerType: 'NORMAL' | 'COMPANY';
  CustomerDetails: CustomerDetails; // Could be string or CustomerDetails object
  quantity: number; // Added quantity field
  Designations: {
    Id: number;
    Name: string;
    Quantity: number; // Added quantity field
    Products: {
      ProductId: number;
      ProductName?: string;
      Quantity: number;
    }[];
  }[];
  TotalPrice: number;
  TotalPriceHT: number;
  Status: QuotationStatus;
}

// Get all quotations (unfiltered here, filtered in component)
export const getAllQuotations = async (): Promise<Invoice[]> => {
  try {
    const response = await apiClient.get('/Quotations');
    console.log('GET /Quotations response:', response.data);
    return response.data.map((raw: RawQuotationResponse) => ({
      Id: raw.Id,
      ProjectName: raw.ProjectName,
      CustomerType: raw.CustomerType,
      CustomerId: typeof raw.CustomerDetails === 'string' ? 0 : raw.CustomerDetails.id,
      CustomerDetails: typeof raw.CustomerDetails === 'string'
        ? { id: 0, FullName: raw.CustomerDetails }
        : raw.CustomerDetails,
      InvoiceCreatedAt: raw.InvoiceCreatedAt,
      quantity: raw.quantity,
      Designations: raw.Designations.map(d => ({
        Id: d.Id,
        Name: d.Name,
        Quantity: d.Quantity,
        Products: d.Products.map(p => ({
          ProductId: p.ProductId,
          ProductName: p.ProductName || '',
          Quantity: p.Quantity,
        })),
      })),
      TotalPrice: raw.TotalPrice,
      Status: raw.Status,
    }));
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error fetching quotations:', axiosError);
    throw axiosError;
  }
};

// Validate quotation (update status to APPROVED)
export const validateQuotation = async (id: number): Promise<void> => {
  try {
    const response = await apiClient.put(`/Quotations/${id}/validate`);
    console.log(`PUT /Quotations/${id}/validate raw response:`, response.data); // Will log undefined for 204
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(`Error validating quotation ${id}:`, axiosError);
    throw axiosError;
  }
};
// Export quotation as PDF
export const exportQuotationAsPdf = async (Invoice: Invoice): Promise<void> => {
  try {
    const response = await apiClient.post(
      '/Invoice/export-quotation',
      {
        Id: Invoice.Id,
        ProjectName: Invoice.ProjectName,
        CustomerType: Invoice.CustomerType,
        CustomerId: Invoice.CustomerId,
        Designations: Invoice.Designations.map(d => ({
          Id: d.Id,
          Name: d.Name,
          Quantity: d.Quantity,
          Products: d.Products.map(p => ({
            ProductId: p.ProductId,
            Quantity: p.Quantity,
          })),
        })),
        TotalPrice: Invoice.TotalPrice,
        TotalPriceHT: Invoice.TotalPriceHT,
        InvoiceCreatedAt: Invoice.InvoiceCreatedAt
      },
      {
        responseType: 'blob', // Important for handling binary data (PDF)
      }
    );

    // Create a URL for the blob and trigger the download
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Invoice_${Invoice.CustomerDetails.FullName}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url); // Clean up
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(`Error exporting Invoice ${Invoice.CustomerDetails.FullName} as PDF:`, axiosError);
    throw axiosError;
  }
};