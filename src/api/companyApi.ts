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
  Id?: number; // Matches your backend
  CompanyName: string; // PascalCase
  Address: string;
  Ville: string; // Assuming this is 'city' in French
  Email: string;
  MatriculeFiscal: string;
  Contact1Name: string;
  Contact1Phone: string;
  Contact2Name: string;
  Contact2Phone: string;
  Contact3Name: string;
  Contact3Phone: string;
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
    id: apiData.Id, // Map Id to id
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
    contact3Phone: apiData.Contact3Phone || ''
  };
};
// Helper function to map our company client interface to API data
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
    Contact3Phone: client.contact3Phone || ''
  };
};