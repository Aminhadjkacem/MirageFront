import { useState, useEffect } from 'react';
import { Product, ProductFormData } from '../../types/product';
import ProductHeader from './ProductHeader';
import SearchBar from './SearchBar';
import ProductGrid from './ProductGrid';
import ProductForm from './ProductForm';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import productsApi from '../../api/products';
import { AxiosError } from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{ id: number; name: string } | null>(null);
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
      setProducts(data);
      setError(null);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error fetching products:', axiosError);
      if (axiosError.response?.status !== 400) {
        setError(
          axiosError.response?.status === 404
            ? 'Products endpoint not found. Check the server URL.'
            : 'Failed to load products. Please try again.'
        );
        toast.error('Failed to load products.');
      }
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
        await productsApi.patch(currentProduct.id, productData);
        toast.success(`Product "${productData.name}" updated successfully!`);
        await fetchProducts();
      } else {
        const newProduct = await productsApi.create(productData);
        setProducts(prev => [...prev, newProduct]);
        toast.success(`Product "${newProduct.name}" created successfully!`);
        await fetchProducts();
      }

      handleCloseModal();
      setError(null);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error saving product:', axiosError);
      const errorMessage =
        axiosError.response?.status === 400
          ? 'Invalid product data. Please check your input.'
          : axiosError.response?.status === 404
          ? 'Product not found.'
          : 'Failed to save product. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
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

  const handleDelete = (id: number) => {
    const product = products.find(p => p.id === id);
    if (product) {
      setProductToDelete({ id, name: product.name });
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await productsApi.delete(productToDelete.id);
      setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
      toast.success(`Product "${productToDelete.name}" deleted successfully!`);
      setError(null);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error deleting product:', axiosError);
      setError('Failed to delete product. Please try again.');
      toast.error('Failed to delete product.');
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="py-8 px-4 sm:px-6 lg:px-8 flex-grow-0">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          <ProductHeader onAddProduct={() => setIsModalOpen(true)} />
          <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
        </div>
      </div>
      <div className="flex-grow px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full">
          {products.length === 0 && !error ? (
            <div className="text-center py-8 text-gray-500">No products found</div>
          ) : (
            <ProductGrid products={filteredProducts} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </div>
      </div>
      <ProductForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        isEditing={!!currentProduct}
      />
      {isDeleteModalOpen && productToDelete && (
        <DeleteConfirmationModal
          type="product"
          itemName={productToDelete.name}
          onCancel={() => {
            setIsDeleteModalOpen(false);
            setProductToDelete(null);
          }}
          onConfirm={confirmDelete}
          isLoading={isDeleting}
        />
      )}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
}