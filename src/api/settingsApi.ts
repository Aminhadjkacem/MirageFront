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

// Define the Settings interface based on the GET response
interface Settings {
  ProfitMargin: number;
  TVAMargin: number;
  DroitDuTimbrePrice: number;
  CompanyTel: string;
  CompanyFiscal: string;
  factureId: number;
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
      const response = await axiosInstance.put('/Settings/droit-de-timbre', `"${value}"`);
      console.log(`PUT /Settings/droit-de-timbre with "${value}" succeeded with status: ${response.status} (No Content)`);
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
};

export default settingsApi;