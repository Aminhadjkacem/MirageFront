import { LogIn, UserPlus } from 'lucide-react';
import axios from 'axios';
import type { UserType } from '../../App';
import { useState } from 'react';

const API_BASE_URL = 'https://localhost:7060';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

type LoginProps = {
  onLogin: (user: UserType) => void;
  onSwitchToSignUp: () => void;
};

export default function Login({ onLogin, onSwitchToSignUp }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axiosInstance.post('Users/authenticate', { username, password });
      onLogin(response.data);
    } catch (err) {
      console.error('Login failed:', err);
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="flex flex-col items-center">
          <img src="logo.png" alt="DHP Manager Logo" className="h-16 w-16 mb-4" />
          <h2 className="text-center text-3xl font-extrabold text-gray-900">DHP Manager</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Please sign in to your account</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-lg block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-lg block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LogIn className="h-5 w-5 text-blue-500 group-hover:text-blue-400" />
              </span>
              Sign in
            </button>
          </div>
        </form>
        <div className="text-center">
          <button
            onClick={onSwitchToSignUp}
            className="text-sm text-blue-600 hover:text-blue-500 flex items-center justify-center gap-2 w-full"
          >
            <UserPlus className="h-4 w-4" />
            Create new account
          </button>
        </div>
      </div>
    </div>
  );
}
