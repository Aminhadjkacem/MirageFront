import { useState } from 'react';
import { Product, FormData } from '../../types/product';
import ProductHeader from './ProductHeader';
import SearchBar from './SearchBar';
import ProductGrid from './ProductGrid';
import ProductForm from './ProductForm';
import DeleteConfirmationModal from './DeleteConfirmationModal';

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct = {
      id: currentProduct?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      category: formData.category
    };

    if (currentProduct) {
      setProducts(products.map(p => p.id === currentProduct.id ? newProduct : p));
    } else {
      setProducts([...products, newProduct]);
    }

    handleCloseModal();
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setProductToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    setIsDeleting(true);
    try {
      setProducts(products.filter(p => p.id !== productToDelete));
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentProduct(null);
    setFormData({ name: '', description: '', price: '', stock: '', category: '' });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <ProductHeader onAddProduct={() => setIsModalOpen(true)} />
        <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
        <ProductGrid
          products={filteredProducts}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <ProductForm
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
          isEditing={!!currentProduct}
        />

        {isDeleteModalOpen && (
          <DeleteConfirmationModal
            type="product"
            onCancel={() => {
              setIsDeleteModalOpen(false);
              setProductToDelete(null);
            }}
            onConfirm={confirmDelete}
            isLoading={isDeleting}
          />
        )}
      </div>
    </div>
  );
}