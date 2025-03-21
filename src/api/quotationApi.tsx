// api/quotationApi.ts
import axios, { AxiosError } from 'axios';

const API_BASE_URL = 'https://localhost:7060/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
  [key: string]: unknown;
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
}

export interface Quotation {
  Id: number;
  ProjectName: string;
  CustomerType: 'NORMAL' | 'COMPANY';
  CustomerId: number;
  CustomerDetails: CustomerDetails;
  CreatedAt: string;
  Designations: Designation[];
}

export const getAllQuotations = async (): Promise<Quotation[]> => {
  try {
    const response = await apiClient.get('/Quotations');
    console.log('GET /Quotations response:', response.data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error fetching quotations:', axiosError);
    throw axiosError;
  }
};

export const createQuotation = async (quotation: QuotationRequest): Promise<Quotation> => {
  try {
    console.log('Sending create quotation request:', JSON.stringify(quotation, null, 2));
    const response = await apiClient.post('/Quotations', quotation);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error creating quotation:', axiosError);
    throw axiosError;
  }
};

export const updateQuotation = async (id: number, quotation: QuotationUpdateRequest): Promise<Quotation> => {
  try {
    console.log('Sending update quotation request:', JSON.stringify(quotation, null, 2));
    const response = await apiClient.put(`/Quotations/${id}`, quotation);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error updating quotation:', axiosError);
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