import React, { useState } from 'react';
import { UserPlus, LogIn } from 'lucide-react';
import type { UserType } from '../../App';
import axios from 'axios';

const API_BASE_URL = 'https://localhost:7060';
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

type SignUpProps = {
  onSignUp: (user: UserType) => void;
  onSwitchToLogin: () => void;
};

export default function SignUp({ onSignUp, onSwitchToLogin }: SignUpProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
  
    try {
      const response = await axiosInstance.post('/Users/register', {
        firstName,
        lastName,
        mail,
        password,
      });
  
      // Assuming the response contains user data
      const userData = response.data;
      console.log('Données utilisateur:', userData); // Translated console log
      
      // Call the onSignUp function with the user data
      onSignUp({ firstName, lastName, email: mail });
    } catch (err) {
      // If the error is an Axios error, handle it
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Échec de l’inscription');
      } else {
        setError('Une erreur s’est produite lors de l’inscription');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="flex flex-col items-center">
          <img 
            src="logo.png" 
            alt="Logo DHP Manager" 
            className="h-16 w-16 mb-4"
          />
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            DHP Manager
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Créez votre compte
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="firstName" className="sr-only">
                Prénom
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Prénom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="lastName" className="sr-only">
                Nom
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Nom"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="mail" className="sr-only">
                Adresse e-mail
              </label>
              <input
                id="mail"
                name="mail"
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Adresse e-mail"
                value={mail}
                onChange={(e) => setMail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <UserPlus className="h-5 w-5 text-blue-500 group-hover:text-blue-400" />
              </span>
              {isLoading ? 'Inscription en cours...' : 'S’inscrire'}
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            onClick={onSwitchToLogin}
            className="text-sm text-blue-600 hover:text-blue-500 flex items-center justify-center gap-2 w-full"
          >
            <LogIn className="h-4 w-4" />
            Vous avez déjà un compte ? Connectez-vous
          </button>
        </div>
      </div>
    </div>
  );
}