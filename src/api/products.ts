// api/products.ts
import axios, { AxiosError } from 'axios';
import { Product, ProductInput } from '../types/product';

// Define the raw API response type
interface RawProductResponse {
  Id: number;
  Name: string | null; // Allow null since we provide fallbacks
  Description: string | null;
  Price: number | null;
  Stock: number | null;
  Category: string | null;
}

const API_BASE_URL = 'https://localhost:7060/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const productsApi = {
  getAll: async (): Promise<Product[]> => {
    try {
      const response = await apiClient.get('/Product');
      console.log('GET /Product response:', response.data);
      // Use RawProductResponse instead of any
      return response.data.map((p: RawProductResponse) => ({
        id: p.Id, // No fallback needed since Id is required
        name: p.Name || '',
        description: p.Description || '',
        price: p.Price || 0,
        stock: p.Stock || 0,
        category: p.Category || '',
      }));
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('GET /Product error:', axiosError);
      throw axiosError;
    }
  },

  getByName: async (name: string): Promise<Product> => {
    try {
      const response = await apiClient.get(`/Product/${name}`);
      const p = response.data as RawProductResponse; // Type the response
      return {
        id: p.Id,
        name: p.Name || '',
        description: p.Description || '',
        price: p.Price || 0,
        stock: p.Stock || 0,
        category: p.Category || '',
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`GET /Product/${name} error:`, axiosError);
      throw axiosError;
    }
  },

  create: async (product: ProductInput): Promise<Product> => {
    try {
      const response = await apiClient.post('/Product', product);
      const p = response.data as RawProductResponse;
      return {
        id: p.Id,
        name: p.Name || '',
        description: p.Description || '',
        price: p.Price || 0,
        stock: p.Stock || 0,
        category: p.Category || '',
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('POST /Product error:', axiosError);
      throw axiosError;
    }
  },

  update: async (name: string, product: ProductInput): Promise<Product> => {
    try {
      const response = await apiClient.put(`/Product/${name}`, product);
      const p = response.data as RawProductResponse;
      return {
        id: p.Id,
        name: p.Name || '',
        description: p.Description || '',
        price: p.Price || 0,
        stock: p.Stock || 0,
        category: p.Category || '',
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`PUT /Product/${name} error:`, axiosError);
      throw axiosError;
    }
  },

  delete: async (name: string): Promise<void> => {
    try {
      await apiClient.delete(`/Product/${name}`);
      console.log(`DELETE /Product/${name} successful`);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`DELETE /Product/${name} error:`, axiosError);
      throw axiosError;
    }
  },
};

export default productsApi;