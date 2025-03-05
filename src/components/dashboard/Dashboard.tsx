import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Users, Truck, User, LogOut, ChevronDown, Calculator, Users2, Package } from 'lucide-react';
import type { UserType } from '../../App';

type DashboardProps = {
  user: UserType;
  onLogout: () => void;
};

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="logo.png" alt="DHP Manager Logo" className="h-10 w-10" />
            <h1 className="text-2xl font-semibold text-gray-900">DHP Manager</h1>
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center space-x-3 focus:outline-none">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <span className="text-gray-700 font-medium">{user?.firstName}</span>
              <ChevronDown className="h-5 w-5 text-gray-500" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <button onClick={onLogout} className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Clients Button */}
          <Link to="/clients" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <span className="text-lg font-medium text-gray-900">Clients</span>
          </Link>

          {/* Products Button */}
          <Link to="/products" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
              <Package className="h-8 w-8 text-indigo-600" />
            </div>
            <span className="text-lg font-medium text-gray-900">Products</span>
          </Link>

          {/* Fournisseur Button */}
          <button className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <Truck className="h-8 w-8 text-green-600" />
            </div>
            <span className="text-lg font-medium text-gray-900">Fournisseur</span>
          </button>

          {/* Comptabilité Button */}
          <Link to="/comptability" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <Calculator className="h-8 w-8 text-red-600" />
            </div>
            <span className="text-lg font-medium text-gray-900">Comptabilité</span>
          </Link>

          {/* RH Button */}
          <button className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center">
              <Users2 className="h-8 w-8 text-teal-600" />
            </div>
            <span className="text-lg font-medium text-gray-900">RH</span>
          </button>
        </div>
      </main>
    </div>
  );
}