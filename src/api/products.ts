import axios, { AxiosError } from 'axios';
import { Product, ProductInput } from '../types/product';

// Adjust this to your backend's actual URL
const API_BASE_URL = 'https://localhost:7060/api'; // Double-check this!

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // For local dev with self-signed certificates (uncomment if needed)
  // httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false }),
});

const productsApi = {
  getAll: async (): Promise<Product[]> => {
    try {
      console.log(`Fetching from: ${API_BASE_URL}/Product`); // Log the exact URL
      const response = await apiClient.get('/Product');
      console.log('GET /Products response:', response.data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('GET /Products error:', {
        url: `${API_BASE_URL}/Products`,
        message: axiosError.message,
        response: axiosError.response?.data,
        status: axiosError.response?.status,
      });
      throw axiosError;
    }
  },

  getByName: async (name: string): Promise<Product> => {
    try {
      const response = await apiClient.get(`/Product/${name}`);
      console.log(`GET /Products/${name} response:`, response.data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`GET /Product/${name} error:`, {
        url: `${API_BASE_URL}/Products/${name}`,
        message: axiosError.message,
        response: axiosError.response?.data,
        status: axiosError.response?.status,
      });
      throw axiosError;
    }
  },

  create: async (product: ProductInput): Promise<Product> => {
    try {
      const response = await apiClient.post('/Product', product);
      console.log('POST /Products response:', response.data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('POST /Products error:', {
        url: `${API_BASE_URL}/Product`,
        message: axiosError.message,
        response: axiosError.response?.data,
        status: axiosError.response?.status,
      });
      throw axiosError;
    }
  },

  update: async (name: string, product: ProductInput): Promise<Product> => {
    try {
      const response = await apiClient.put(`/Product/${name}`, product);
      console.log(`PUT /Product/${name} response:`, response.data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`PUT /Product/${name} error:`, {
        url: `${API_BASE_URL}/Product/${name}`,
        message: axiosError.message,
        response: axiosError.response?.data,
        status: axiosError.response?.status,
      });
      throw axiosError;
    }
  },

  delete: async (name: string): Promise<void> => {
    try {
      await apiClient.delete(`/Product/${name}`);
      console.log(`DELETE /Product/${name} successful`);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`DELETE /Product/${name} error:`, {
        url: `${API_BASE_URL}/Product/${name}`,
        message: axiosError.message,
        response: axiosError.response?.data,
        status: axiosError.response?.status,
      });
      throw axiosError;
    }
  },
};

export default productsApi;