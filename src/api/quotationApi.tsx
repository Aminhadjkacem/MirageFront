import axios, { AxiosError } from 'axios';

const API_BASE_URL = 'https://localhost:7060/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Define possible status values as an enum
export enum QuotationStatus {
  PENDING = 'PENDING',
  APPROVED = 'VALIDATED',
}

export interface QuotationProduct {
  ProductId: number;
  Quantity: number;
  ProductName?: string; // Optional, included in response
}

export interface DesignationRequest {
  Name: string;
  Products: QuotationProduct[];
}

export interface DesignationUpdateRequest {
  Id: number; // Required for update
  Name: string;
  Products: QuotationProduct[];
}

export interface Designation {
  Id?: number; // Optional, included in response
  Name: string;
  Products: QuotationProduct[];
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

interface RawQuotationResponse {
  Id: number;
  ProjectName: string;
  CreatedAt: string;
  CustomerType: 'NORMAL' | 'COMPANY';
  CustomerDetails: CustomerDetails | string | null;
  Designations: Designation[];
  TotalPrice: number;
  TotalPriceHT:number;
  Status: QuotationStatus;
}

export interface QuotationRequest {
  Id?: number;
  ProjectName: string;
  CustomerType: 'NORMAL' | 'COMPANY';
  CustomerId: number;
  Designations: DesignationRequest[];
}

export interface QuotationUpdateRequest {
  Id: number;
  ProjectName: string;
  Designations: DesignationUpdateRequest[];
  CustomerType: 'NORMAL' | 'COMPANY';
  CustomerId: number;
}

export interface Quotation {
  Id: number;
  ProjectName: string;
  CustomerType: 'NORMAL' | 'COMPANY';
  CustomerId: number;
  CustomerDetails: CustomerDetails;
  CreatedAt: string;
  Designations: Designation[];
  TotalPrice: number;
  TotalPriceHT: number;
  Status: QuotationStatus;
}

export const createQuotation = async (quotation: QuotationRequest): Promise<Quotation> => {
  try {
    console.log('Sending create quotation request:', JSON.stringify(quotation, null, 2));
    const response = await apiClient.post('/Quotations', quotation);
    const raw = response.data as RawQuotationResponse;
    return {
      Id: raw.Id,
      ProjectName: raw.ProjectName,
      CustomerType: raw.CustomerType,
      CustomerId: typeof raw.CustomerDetails === 'string' || raw.CustomerDetails === null ? 0 : raw.CustomerDetails.id,
      CustomerDetails: typeof raw.CustomerDetails === 'string'
        ? { id: 0, FullName: raw.CustomerDetails }
        : raw.CustomerDetails === null
        ? { id: 0, FullName: 'Unknown Client' }
        : raw.CustomerDetails,
      CreatedAt: raw.CreatedAt,
      Designations: raw.Designations,
      TotalPrice: raw.TotalPrice,
      TotalPriceHT:raw.TotalPriceHT,
      Status: raw.Status,
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error creating quotation:', axiosError);
    throw axiosError; // Throw the raw AxiosError instead of wrapping it
  }
};

// Rest of the file remains unchanged
export const updateQuotation = async (id: number, quotation: QuotationUpdateRequest): Promise<void> => {
  try {
    const payload: QuotationUpdateRequest = {
      Id: id,
      ProjectName: quotation.ProjectName,
      Designations: quotation.Designations.map(d => ({
        Id: d.Id || 0,
        Name: d.Name,
        Products: d.Products.map(p => ({
          ProductId: p.ProductId,
          Quantity: p.Quantity,
        })),
      })),
      CustomerType: quotation.CustomerType,
      CustomerId: quotation.CustomerId,
    };

    console.log('Sending update quotation request:', JSON.stringify(payload, null, 2));
    const response = await apiClient.put('/Quotations', payload);

    if (response.status === 204) {
      return;
    } else {
      throw new Error(`Unexpected status code: ${response.status}`);
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error updating quotation:', axiosError.response?.data || axiosError.message);
    throw axiosError;
  }
};

export const deleteQuotation = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/Quotations/${id}`);
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error deleting quotation:', axiosError);
    throw axiosError;
  }
};

export const getAllQuotations = async (): Promise<Quotation[]> => {
  try {
    const response = await apiClient.get('/Quotations');
    console.log('GET /Quotations response:', response.data);
    return response.data.map((raw: RawQuotationResponse) => {
      const isCustomerDetailsString = typeof raw.CustomerDetails === 'string';
      const isCustomerDetailsNull = raw.CustomerDetails === null || raw.CustomerDetails === undefined;

      return {
        Id: raw.Id,
        ProjectName: raw.ProjectName,
        CustomerType: raw.CustomerType,
        CustomerId: isCustomerDetailsString || isCustomerDetailsNull ? 0 : (raw.CustomerDetails as CustomerDetails).id,
        CustomerDetails: isCustomerDetailsString
          ? { id: 0, FullName: raw.CustomerDetails as string }
          : isCustomerDetailsNull
          ? { id: 0, FullName: 'Unknown Client' }
          : raw.CustomerDetails as CustomerDetails,
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
        TotalPriceHT:raw.TotalPriceHT,
        Status: raw.Status,
      };
    });
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error fetching quotations:', axiosError);
    throw axiosError;
  }
};