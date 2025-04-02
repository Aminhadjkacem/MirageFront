// src/utils/authUtils.ts
import type { UserType } from '../types/user';  

export const getStoredUser = (): UserType | null => {
  const storedUser = localStorage.getItem('user');
  return storedUser ? JSON.parse(storedUser) : null;
};

export const isAuthenticated = (): boolean => {
  return !!getStoredUser();
};

export const clearUser = () => {
  localStorage.removeItem('user');
};