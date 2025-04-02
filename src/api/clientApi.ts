import axios from 'axios';
import { NormalClient } from '../types/client';

const API_BASE_URL = 'https://localhost:7060/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('user'); // Retrieve token from local storage (or another storage method)
  console.log(token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export interface ClientData {
  Id?: number;
  FullName: string;
  PhoneNumber: string;
  Address: string;
  Email: string | null;
  CIN: string;
}

export const getNormalClients = async (): Promise<ClientData[]> => {
  try {
    const response = await axiosInstance.get('/NormalCustomer');
    console.log('Fetched normal clients:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching normal clients:', error);
    throw error;
  }
};

export const getNormalClientById = async (id: number): Promise<ClientData> => {
  try {
    const response = await axiosInstance.get(`/NormalCustomer/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching normal client:', error);
    throw error;
  }
};

export const createNormalClient = async (clientData: ClientData): Promise<ClientData> => {
  try {
    // Exclude Id from the payload without assigning it to a variable
    const payload = { ...clientData, Id: undefined };
    delete payload.Id; // Ensure Id is removed
    console.log('Sending from clientApi:', JSON.stringify(payload, null, 2));
    
    const response = await axiosInstance.post('/NormalCustomer', payload);
    console.log('API response:', response.status, JSON.stringify(response.data, null, 2));
    
    return response.data; // Return full ClientData
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 500) {
      const responseData = error.response.data as ClientData;
      if (responseData && 'Id' in responseData) {
        console.log('Data saved despite 500:', responseData);
        return responseData; // Trust the 500 response data
      }
    }
    console.error('Error creating normal client:', error);
    throw error;
  }
};
export const updateNormalClient = async (phoneNumber: string, clientData: ClientData): Promise<ClientData> => {
  try {
    const response = await axiosInstance.patch(`/NormalCustomer/${phoneNumber}`, clientData);
    return response.data;
  } catch (error) {
    console.error('Error updating normal client:', error);
    throw error;
  }
};

export const deleteNormalClient = async (phoneNumber: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/NormalCustomer/${phoneNumber}`);
  } catch (error) {
    console.error('Error deleting normal client:', error);
    throw error;
  }
};

export const mapApiDataToNormalClient = (apiData: ClientData): NormalClient => {
  return {
    id: apiData.Id,
    fullName: apiData.FullName,
    phoneNumber: apiData.PhoneNumber,
    address: apiData.Address,
    email: apiData.Email ?? '',
    identityCardNumber: apiData.CIN,
  };
};

export const mapNormalClientToApiData = (client: NormalClient): ClientData => {
  return {
    Id: client.id,
    FullName: client.fullName,
    PhoneNumber: client.phoneNumber,
    Address: client.address,
    Email: client.email || null,
    CIN: client.identityCardNumber,
  };
};
export const mapApiDataToNormal = (apiData: ClientData): NormalClient => {
  return {
    id: apiData.Id,
    fullName: apiData.FullName, // Fix casing
    phoneNumber: apiData.PhoneNumber,
    address: apiData.Address,
    email: apiData.Email|| '', // Ensure proper mapping
    identityCardNumber: apiData.CIN // Ensure proper mapping
  };
};