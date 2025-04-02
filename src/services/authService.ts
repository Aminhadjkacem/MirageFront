// src/services/authService.ts
import axios from 'axios';
import { UserType } from '../types/user';

const API_BASE_URL = 'https://localhost:7060';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const signUp = async (
  FirstName: string,
  LastName: string,
  mail: string,
  password: string
): Promise<UserType> => {
  try {
    const response = await axiosInstance.post<UserType>('/Users/register', {
      FirstName: FirstName,
      LastName: LastName,
      mail,
      password,
    });

    const userData: UserType = {
      id: response.data.id,
      FirstName: response.data.FirstName,
      LastName: response.data.LastName,
      mail: response.data.mail,
      Token: response.data.Token
    };

    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.message || 'Échec de l’inscription');
    }
    throw new Error('Une erreur s’est produite lors de l’inscription');
  }
};
export const login = async (
    username: string,
    password: string
  ): Promise<UserType> => {
    try {
      const response = await axiosInstance.post<UserType>('Users/authenticate', {
        username,
        password,
      });
  
      const userData: UserType = {
        id: response.data.id,
        FirstName: response.data.FirstName,
        LastName: response.data.LastName,
        mail: response.data.mail,
        Token: response.data.Token
      };
  
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.message || 'Nom d’utilisateur ou mot de passe incorrect');
      }
      throw new Error('Échec de la connexion');
    }
  };