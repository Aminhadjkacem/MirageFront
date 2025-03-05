import { Pencil, Trash2 } from 'lucide-react';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
};

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export default function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(product)}
            className="text-gray-400 hover:text-blue-600"
          >
            <Pencil className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="text-gray-400 hover:text-red-600"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
      <p className="text-gray-600 mb-4">{product.description}</p>
      <div className="flex justify-between items-center text-sm">
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
          {product.category}
        </span>
        <div className="space-x-4">
          <span className="text-gray-600">Stock: {product.stock}</span>
          <span className="font-semibold text-gray-900">{product.price}TND</span>
        </div>
      </div>
    </div>
  );
}