import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Users, Truck, User, LogOut, ChevronDown, Users2, Package, ShoppingCart, Settings } from 'lucide-react';
import type { UserType } from '../../types/user'; // Adjust the import path as necessary

type DashboardProps = {
  user: UserType;
  onLogout: () => void;
};

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  console.log(user);

  // Enhanced logout handler to clear localStorage
  const handleLogout = () => {
    localStorage.removeItem('user'); // Remove 'user' from localStorage
    onLogout(); // Call the parent-provided logout function
    setShowProfileMenu(false); // Close the profile menu
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="LogoMirage.png" alt="Logo DHP Manager" className="h-10 w-10" />
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
              <span className="font-['Playfair_Display'] text-3xl tracking-wide bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent drop-shadow-md">irage</span>
            </h1>          
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 focus:outline-none"
            >
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <span className="text-gray-700 font-medium">{user?.FirstName}</span>
              <ChevronDown className="h-5 w-5 text-gray-500" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <button
                  onClick={handleLogout} // Updated to use the new handler
                  className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Déconnexion</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        {/* Welcome Message */}
        <div className="mb-6 text-center">
          <h3 className="text-lg font-medium text-gray-900 leading-snug">
            <span className="font-normal text-gray-700">Bienvenue</span>  
            <span className="mx-1 text-[#DD2A1B]">{user?.FirstName}</span>  
            <span className="font-normal text-gray-700">chez</span>  
            <span className="text-[#4B0082] font-medium"> Dynamique Habitat Publicité</span>
            <span className="font-normal text-gray-700"> Management</span>  
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Clients Button */}
          <Link
            to="/clients"
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col items-center space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <span className="text-lg font-medium text-gray-900">Clients</span>
          </Link>

          {/* Products Button */}
          <Link
            to="/products"
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col items-center space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
              <Package className="h-8 w-8 text-indigo-600" />
            </div>
            <span className="text-lg font-medium text-gray-900">Produits</span>
          </Link>

          {/* Fournisseur Button */}
          <button className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <Truck className="h-8 w-8 text-green-600" />
            </div>
            <span className="text-lg font-medium text-gray-900">Fournisseurs</span>
          </button>

          {/* Comptabilité Button */}
          <Link
            to="/AchatVente"
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col items-center space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <ShoppingCart className="h-8 w-8 text-red-600" />
            </div>
            <span className="text-lg font-medium text-gray-900">Achat/Vente</span>
          </Link>

          {/* RH Button */}
          <button className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center">
              <Users2 className="h-8 w-8 text-teal-600" />
            </div>
            <span className="text-lg font-medium text-gray-900">Ressources humaines</span>
          </button>

          {/* Settings Button */}
          <Link
            to="/settings"
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col items-center space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
              <Settings className="h-8 w-8 text-purple-600" />
            </div>
            <span className="text-lg font-medium text-gray-900">Paramètres</span>
          </Link>
        </div>
      </main>

      {/* Footer with Copyright */}
      <footer className="bg-white shadow-inner py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Mirage. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}