import { Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { FileText, Receipt, Truck as TruckDelivery, ArrowLeft } from 'lucide-react';
import Devis from './Quotation/Devis';

export default function Comptability() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === `/comptability${path}` || (path === '/devis' && location.pathname === '/comptability')
      ? 'border-blue-500 text-blue-600'
      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate('/dashboard')}
              className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              aria-label="Return to dashboard"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex space-x-8">
              <Link
                to="/comptability/devis"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/devis')}`}
              >
                <FileText className="h-4 w-4 mr-2" />
                Devis
              </Link>
              <Link
                to="/comptability/factures"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/factures')}`}
              >
                <Receipt className="h-4 w-4 mr-2" />
                Factures
              </Link>
              <Link
                to="/comptability/bon-livraison"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/bon-livraison')}`}
              >
                <TruckDelivery className="h-4 w-4 mr-2" />
                Bon de livraison
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route index element={<Navigate to="/comptability/devis" replace />} />
          <Route path="devis" element={<Devis />} />
          <Route path="factures" element={<div>Factures Component (Coming Soon)</div>} />
          <Route path="bon-livraison" element={<div>Bon de livraison Component (Coming Soon)</div>} />
        </Routes>
      </div>
    </div>
  );
}