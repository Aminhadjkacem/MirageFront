import axios from 'axios';
import { NormalClient } from '../types/client';

// Define the API base URL
const API_BASE_URL = 'https://localhost:7060/api'; // Base URL for your API

// Axios instance for making requests
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Define an interface for Client Data (based on expected structure)
interface ClientData {
  Id?: number;
  FullName: string;
  PhoneNumber: string;
  Address: string;
  Email: string;
  CIN: string;
}

// Function to get all normal clients
export const getNormalClients = async (): Promise<ClientData[]> => {
  try {
    const response = await axiosInstance.get('/NormalCustomer');
    console.log(response.data); // Debugging
    return response.data;
  } catch (error) {
    console.error('Error fetching normal clients:', error);
    throw error;
  }
};

// Function to get a specific normal client by ID
export const getNormalClientById = async (id: string): Promise<ClientData> => {
  try {
    const response = await axiosInstance.get(`/NormalCustomer/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching normal client:', error);
    throw error;
  }
};

// Function to create a new normal client
export const createNormalClient = async (clientData: ClientData): Promise<ClientData> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { Id: _, ...dataWithoutId } = clientData; // Rename Id to _ to indicate it's unused
    const response = await axiosInstance.post('/NormalCustomer', dataWithoutId);
    return response.data;
  } catch (error) {
    console.error('Error creating normal client:', error);
    throw error;
  }
};
// Function to update an existing normal client
export const updateNormalClient = async (phoneNumber: string, clientData: ClientData): Promise<ClientData> => {
  try {
    const response = await axiosInstance.patch(`/NormalCustomer/${phoneNumber}`, clientData);
    return response.data;
  } catch (error) {
    console.error('Error updating normal client:', error);
    throw error;
  }
};

// Function to delete a normal client
export const deleteNormalClient = async (phoneNumber: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/NormalCustomer/${phoneNumber}`);
  } catch (error) {
    console.error('Error deleting normal client:', error);
    throw error;
  }
};

// Helper function to map API data to our client interface
export const mapApiDataToNormalClient = (apiData: ClientData): NormalClient => {
  return {
    id: apiData.Id,
    fullName: apiData.FullName, // Ensure correct casing
    phoneNumber: apiData.PhoneNumber,
    address: apiData.Address,
    email: apiData.Email,
    identityCardNumber: apiData.CIN
  };
};


// Helper function to map our client interface to API data
export const mapNormalClientToApiData = (client: NormalClient): ClientData => {
  return {
    Id: client.id, // client.id is number | undefined, but Id must be number
    FullName: client.fullName,
    PhoneNumber: client.phoneNumber,
    Address: client.address,
    Email: client.email,
    CIN: client.identityCardNumber
  };
};
export const mapApiDataToNormal = (apiData: ClientData): NormalClient => {
  return {
    id: apiData.Id,
    fullName: apiData.FullName, // Fix casing
    phoneNumber: apiData.PhoneNumber,
    address: apiData.Address,
    email: apiData.Email,
    identityCardNumber: apiData.CIN // Ensure proper mapping
  };
};
