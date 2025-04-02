// src/utils/authUtils.ts
export type UserType = {
    id: number;
    firstName: string | null;
    lastName: string | null;
    email: string | null;  // Changed from Email to email to match backend, but we'll map it
    token: string;
  };
  
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