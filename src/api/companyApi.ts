import axios from 'axios';
import { CompanyClient } from '../types/client';

const API_BASE_URL = 'https://localhost:7060/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('user'); // Retrieve token from local storage (or another storage method)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
export interface CompanyApiData {
  Id?: number;
  CompanyName: string;
  Address: string;
  Ville: string;
  Email: string;
  MatriculeFiscal: string;
  Contact1Name: string;
  Contact1Phone: string;
  Contact2Name: string;
  Contact2Phone: string;
  Contact3Name: string;
  Contact3Phone: string;
}

export const getCompanyClients = async (): Promise<CompanyApiData[]> => {
  try {
    const response = await axiosInstance.get('/CompanyCustomer');
    console.log('Fetched data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching company clients:', error);
    throw error;
  }
};

export const getCompanyClientByTaxNumber = async (taxNumber: string): Promise<CompanyApiData> => {
  try {
    const response = await axiosInstance.get(`/CompanyCustomer/${taxNumber}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching company client:', error);
    throw error;
  }
};

export const createCompanyClient = async (companyData: CompanyApiData): Promise<CompanyApiData> => {
  console.log('Sending payload:', JSON.stringify(companyData, null, 2));
  try {
    const response = await axiosInstance.post('/CompanyCustomer', companyData);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 500) {
      const responseData = error.response.data;
      if (typeof responseData === 'object' && responseData !== null && 'Id' in responseData) {
        console.log('Data saved successfully despite 500 response:', responseData);
        return responseData as CompanyApiData;
      }
    }
    console.error('Error creating company client:', error);
    throw error;
  }
};

export const updateCompanyClient = async (taxNumber: string, companyData: CompanyApiData): Promise<CompanyApiData> => {
  try {
    const response = await axiosInstance.patch(`/CompanyCustomer/${taxNumber}`, companyData);
    console.log('Updated company client:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating company client:', error);
    throw error;
  }
};

export const deleteCompanyClient = async (matriculeFiscal: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/CompanyCustomer/${matriculeFiscal}`);
  } catch (error) {
    console.error('Error deleting company client:', error);
    throw error;
  }
};

export const mapApiDataToCompanyClient = (apiData: CompanyApiData): CompanyClient => {
  return {
    id: apiData.Id,
    companyName: apiData.CompanyName,
    address: apiData.Address,
    city: apiData.Ville,
    email: apiData.Email,
    matriculeFiscal: apiData.MatriculeFiscal,
    contact1Name: apiData.Contact1Name || '',
    contact1Phone: apiData.Contact1Phone || '',
    contact2Name: apiData.Contact2Name || '',
    contact2Phone: apiData.Contact2Phone || '',
    contact3Name: apiData.Contact3Name || '',
    contact3Phone: apiData.Contact3Phone || '',
  };
};

export const mapCompanyClientToApiData = (client: CompanyClient): CompanyApiData => {
  return {
    CompanyName: client.companyName,
    Address: client.address,
    Ville: client.city,
    Email: client.email,
    MatriculeFiscal: client.matriculeFiscal,
    Contact1Name: client.contact1Name || '',
    Contact1Phone: client.contact1Phone || '',
    Contact2Name: client.contact2Name || '',
    Contact2Phone: client.contact2Phone || '',
    Contact3Name: client.contact3Name || '',
    Contact3Phone: client.contact3Phone || '',
  };
};