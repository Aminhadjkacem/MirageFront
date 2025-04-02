import axios, { AxiosError } from 'axios';
import { Product, ProductInput } from '../types/product';

interface RawProductResponse {
  Id: number;
  Name: string | null;
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
apiClient.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem("user");
  const userData = storedUser ? JSON.parse(storedUser) : null;
  const token = userData?.Token; // Retrieve token from local storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

const productsApi = {
  getAll: async (): Promise<Product[]> => {
    try {
      const response = await apiClient.get('/Product');
      console.log('GET /Product response:', response.status, response.data);
      const data = response.data || [];
      return data.map((p: RawProductResponse) => ({
        id: p.Id,
        name: p.Name || '',
        description: p.Description || '',
        price: p.Price || 0,
        stock: p.Stock || 0,
        category: p.Category || '',
      }));
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('GET /Product error:', axiosError.response?.status, axiosError.message);
      if (axiosError.response?.status === 400) {
        console.log('Treating 400 as empty product list');
        return [];
      }
      throw axiosError;
    }
  },

  getByName: async (name: string): Promise<Product> => {
    try {
      const response = await apiClient.get(`/Product/${name}`);
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
      console.error(`GET /Product/${name} error:`, axiosError);
      throw axiosError;
    }
  },

  create: async (product: ProductInput): Promise<Product> => {
    try {
      const response = await apiClient.post('/Product', product);
      console.log('POST /Product response:', response.data);
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

  patch: async (id: number, product: ProductInput): Promise<Product> => {
    try {
      const patchUrl = `/Product/${id}`;
      const patchResponse = await apiClient.patch(patchUrl, product);
      const rawProduct = patchResponse.data as RawProductResponse;
  
      console.log(`PATCH ${patchUrl} successful, status: ${patchResponse.status}`);
  
      return {
        id: rawProduct.Id,
        name: rawProduct.Name || '',
        description: rawProduct.Description || '',
        price: rawProduct.Price || 0,
        stock: rawProduct.Stock || 0,
        category: rawProduct.Category || '',
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`PATCH /Product/${id} error:`, axiosError);
      throw axiosError;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/Product/${id}`);
      console.log(`DELETE /Product/${id} successful`);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`DELETE /Product/${id} error:`, axiosError);
      throw axiosError;
    }
  },
};

export default productsApi;