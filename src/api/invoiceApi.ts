// invoiceApi.ts
import axios, { AxiosError } from 'axios';
import { Quotation, QuotationStatus } from './quotationApi'; // Import types from quotationApi

const API_BASE_URL = 'https://localhost:7060/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
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
  CreatedAt: string;
  CustomerType: 'NORMAL' | 'COMPANY';
  CustomerDetails: CustomerDetails; // Could be string or CustomerDetails object
  Designations: {
    Id: number;
    Name: string;
    Products: {
      ProductId: number;
      ProductName?: string;
      Quantity: number;
    }[];
  }[];
  TotalPrice: number;
  Status: QuotationStatus;
}

// Get all quotations (unfiltered here, filtered in component)
export const getAllQuotations = async (): Promise<Quotation[]> => {
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
      CreatedAt: raw.CreatedAt,
      Designations: raw.Designations.map(d => ({
        Id: d.Id,
        Name: d.Name,
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