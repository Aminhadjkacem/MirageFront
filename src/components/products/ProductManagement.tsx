// components/products/ProductManagement.tsx
import { useState, useEffect } from 'react';
import { Product, ProductFormData } from '../../types/product';
import ProductHeader from './ProductHeader';
import SearchBar from './SearchBar';
import ProductGrid from './ProductGrid';
import ProductForm from './ProductForm';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import productsApi from '../../api/products';
import { AxiosError } from 'axios';

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  });
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const data = await productsApi.getAll();
      setProducts(data || []);
      setError(null);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error fetching products:', axiosError);
      setError(
        axiosError.response?.status === 404
          ? 'Products endpoint not found. Check the server URL.'
          : 'Failed to load products. Please try again.'
      );
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category,
      };

      if (currentProduct) {
        await productsApi.update(currentProduct.name, productData);
      } else {
        await productsApi.create(productData);
      }

      await fetchProducts();
      handleCloseModal();
      setError(null);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error saving product:', axiosError);
      setError(
        axiosError.response?.status === 400
          ? 'Invalid product data. Please check your input.'
          : 'Failed to save product. Please try again.'
      );
    }
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (name: string) => {
    setProductToDelete(name);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await productsApi.delete(productToDelete);
      await fetchProducts();
      setError(null);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error deleting product:', axiosError);
      setError('Failed to delete product. Please try again.');
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

  const filteredProducts = products.filter((product) =>
    (product.name || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
    (product.description || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
    (product.category || '').toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        <ProductHeader onAddProduct={() => setIsModalOpen(true)} />
        <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
        <ProductGrid products={filteredProducts} onEdit={handleEdit} onDelete={handleDelete} />
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