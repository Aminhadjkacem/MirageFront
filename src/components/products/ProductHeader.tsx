import { Package, Plus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProductHeaderProps {
  onAddProduct: () => void;
}

export default function ProductHeader({ onAddProduct }: ProductHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>
      <div className="flex items-center space-x-3">
        <Package className="h-8 w-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Gestion des produits</h1>
      </div>
      <button
        onClick={onAddProduct}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Plus className="h-5 w-5 mr-2" />
        Ajouter un produit
      </button>
    </div>
  );
}