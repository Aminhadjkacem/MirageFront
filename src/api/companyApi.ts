import axios from 'axios';
import { CompanyClient } from '../types/client';
// Define the API base URL
const API_BASE_URL = 'https://localhost:7060/api'; // Base URL for your API

// Axios instance for making requests
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Define an interface for Company Client Data (based on expected structure)
export interface CompanyApiData {
  id?: string;
  companyName: string;
  address: string;
  ville: string;
  email: string;
  matriculeFiscal: string;
  contact1Name: string;
  contact1Phone: string;
  contact2Name: string;
  contact2Phone: string;
  contact3Name: string;
  contact3Phone: string;
}



// Function to get all company clients
export const getCompanyClients = async (): Promise<CompanyApiData[]> => {
    try {
      const response = await axiosInstance.get('/CompanyCustomer');
      console.log('Fetched data:', response.data); // Debugging
      return response.data;
    } catch (error) {
      console.error('Error fetching company clients:', error);
      throw error;
    }
  };
  

// Function to get a specific company client by tax registration number
export const getCompanyClientByTaxNumber = async (taxNumber: string): Promise<CompanyApiData> => {
  try {
    const response = await axiosInstance.get(`/CompanyCustomer/${taxNumber}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching company client:', error);
    throw error;
  }
};

// Function to create a new company client
export const createCompanyClient = async (companyData: CompanyApiData): Promise<CompanyApiData> => {
  try {
    const response = await axiosInstance.post('/CompanyCustomer', companyData);
    return response.data;
  } catch (error) {
    console.error('Error creating company client:', error);
    throw error;
  }
};

// Function to update an existing company client
export const updateCompanyClient = async (taxNumber: string, companyData: CompanyApiData): Promise<CompanyApiData> => {
  try {
    const response = await axiosInstance.patch(`/CompanyCustomer/${taxNumber}`, companyData);
    console.log('Updated company client:', response.data); // Debugging
    return response.data;
  } catch (error) {
    console.error('Error updating company client:', error);
    throw error;
  }
};

// Function to delete a company client
export const deleteCompanyClient = async (matriculeFiscal: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/CompanyCustomer/${matriculeFiscal}`);
  } catch (error) {
    console.error('Error deleting company client:', error);
    throw error;
  }
};

// Helper function to map API data to our company client interface
export const mapApiDataToCompanyClient = (apiData: CompanyApiData): CompanyClient => {
  return {
    companyName: apiData.companyName,
    address: apiData.address,
    city: apiData.ville,
    email: apiData.email,
    matriculeFiscal: apiData.matriculeFiscal,
    contact1Name: apiData.contact1Name || '',
    contact1Phone: apiData.contact1Phone || '',
    contact2Name: apiData.contact2Name || '',
    contact2Phone: apiData.contact2Phone || '',
    contact3Name: apiData.contact3Name || '',
    contact3Phone: apiData.contact3Phone || ''
  };
};

// Helper function to map our company client interface to API data
export const mapCompanyClientToApiData = (client: CompanyClient): CompanyApiData => {
  return {
    companyName: client.companyName,
    address: client.address, 
    ville: client.city,
    email: client.email,
    matriculeFiscal: client.matriculeFiscal,
    contact1Name: client.contact1Name || '',
    contact1Phone: client.contact1Phone || '',
    contact2Name: client.contact2Name || '',
    contact2Phone: client.contact2Phone || '',
    contact3Name: client.contact3Name || '',
    contact3Phone: client.contact3Phone || ''
  };
};