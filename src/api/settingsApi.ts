import axios, { AxiosError } from 'axios';

// Base URL for the API
const API_BASE_URL = 'https://localhost:7060/api';

// Axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
axiosInstance.interceptors.request.use((config) => {
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
// Define the Settings interface based on the GET response
interface Settings {
  ProfitMargin: number;
  TVAMargin: number;
  DroitDuTimbrePrice: number;
  CompanyTel: string;
  CompanyFiscal: string;
  BankRib: string; // Added
  BankName: string;   // Added
  FactureId: number;
}

// Settings API object
const settingsApi = {
  // GET all settings
  getAllSettings: async (): Promise<Settings> => {
    try {
      const response = await axiosInstance.get('/Settings/all-settings');
      console.log('GET /Settings/all-settings response:', response.status, JSON.stringify(response.data, null, 2));
      return response.data as Settings;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error fetching settings:', axiosError);
      throw axiosError;
    }
  },

  // PUT profit-margin (204 No Content)
  updateProfitMargin: async (value: string): Promise<void> => {
    try {
      const response = await axiosInstance.put('/Settings/profit-margin', `"${value}"`);
      console.log(`PUT /Settings/profit-margin with "${value}" succeeded with status: ${response.status} (No Content)`);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`Error updating profit margin with "${value}":`, axiosError);
      throw axiosError;
    }
  },

  // PUT tva-margin (204 No Content)
  updateTVAMargin: async (value: string): Promise<void> => {
    try {
      const response = await axiosInstance.put('/Settings/tva-margin', `"${value}"`);
      console.log(`PUT /Settings/tva-margin with "${value}" succeeded with status: ${response.status} (No Content)`);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`Error updating TVA margin with "${value}":`, axiosError);
      throw axiosError;
    }
  },

  // PUT droit-de-timbre (204 No Content)
  updateDroitDuTimbre: async (value: string): Promise<void> => {
    try {
      const response = await axiosInstance.put('/Settings/droit-du-timbre', `"${value}"`);
      console.log(`PUT /Settings/droit-du-timbre with "${value}" succeeded with status: ${response.status} (No Content)`);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`Error updating droit du timbre with "${value}":`, axiosError);
      throw axiosError;
    }
  },

  // PUT company-tel (204 No Content)
  updateCompanyTel: async (value: string): Promise<void> => {
    try {
      const response = await axiosInstance.put('/Settings/company-tel', `"${value}"`);
      console.log(`PUT /Settings/company-tel with "${value}" succeeded with status: ${response.status} (No Content)`);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`Error updating company tel with "${value}":`, axiosError);
      throw axiosError;
    }
  },

  // PUT company-fiscal (204 No Content)
  updateCompanyFiscal: async (value: string): Promise<void> => {
    try {
      const response = await axiosInstance.put('/Settings/company-fiscal', `"${value}"`);
      console.log(`PUT /Settings/company-fiscal with "${value}" succeeded with status: ${response.status} (No Content)`);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`Error updating company fiscal with "${value}":`, axiosError);
      throw axiosError;
    }
  },

  // PUT company-rib (204 No Content)
  updateCompanyRib: async (value: string): Promise<void> => {
    try {
      const response = await axiosInstance.put('/Settings/company-rib', `"${value}"`);
      console.log(`PUT /Settings/company-rib with "${value}" succeeded with status: ${response.status} (No Content)`);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`Error updating company RIB with "${value}":`, axiosError);
      throw axiosError;
    }
  },

  // PUT bank-name (204 No Content)
  updateBankName: async (value: string): Promise<void> => {
    try {
      const response = await axiosInstance.put('/Settings/bank-name', `"${value}"`);
      console.log(`PUT /Settings/bank-name with "${value}" succeeded with status: ${response.status} (No Content)`);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`Error updating bank name with "${value}":`, axiosError);
      throw axiosError;
    }
  },
};

export default settingsApi;