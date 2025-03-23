import React, { useEffect, useRef } from 'react';
import { X, CheckCircle, Loader2 } from 'lucide-react';
import { ProductFormData } from '../../types/product';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
  isEditing: boolean;
}

export default function ProductForm({
  isOpen,
  onClose,
  formData,
  setFormData,
  isEditing,
  onSubmit,
}: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<Partial<ProductFormData>>({});
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus name field when modal opens
  useEffect(() => {
    if (isOpen && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isOpen]);

  // Close modal with Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isSubmitting, onClose]);

  const validateForm = () => {
    const newErrors: Partial<ProductFormData> = {};
    if (!formData.name.trim()) newErrors.name = 'Le nom est requis';
    if (!formData.description.trim()) newErrors.description = 'La description est requise';
    if (!formData.price || parseFloat(formData.price) < 0) newErrors.price = 'Le prix doit être supérieur ou égal à 0';
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'Le stock doit être supérieur ou égal à 0';
    if (!formData.category.trim()) newErrors.category = 'La catégorie est requise';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await onSubmit(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {isEditing ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
            disabled={isSubmitting}
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom <span className="text-red-500">*</span>
            </label>
            <input
              ref={nameInputRef}
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3 ${
                errors.name ? 'border-red-300' : ''
              }`}
              placeholder="ex. : iPhone 14"
              disabled={isSubmitting}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3 ${
                errors.description ? 'border-red-300' : ''
              }`}
              placeholder="ex. : Dernier smartphone avec des fonctionnalités avancées"
              rows={3}
              disabled={isSubmitting}
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prix (TND) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3 ${
                  errors.price ? 'border-red-300' : ''
                }`}
                placeholder="ex. : 999.99"
                disabled={isSubmitting}
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3 ${
                  errors.stock ? 'border-red-300' : ''
                }`}
                placeholder="ex. : 50"
                disabled={isSubmitting}
              />
              {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3 ${
                errors.category ? 'border-red-300' : ''
              }`}
              placeholder="ex. : Électronique"
              disabled={isSubmitting}
            />
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
            disabled={isSubmitting}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            {isSubmitting ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
}