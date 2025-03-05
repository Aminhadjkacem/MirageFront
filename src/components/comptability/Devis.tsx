import { useState } from 'react';
import { Plus, FileDown, ArrowRight, Pencil, Trash, X } from 'lucide-react';

type DevisItem = {
  id: number;
  items: Array<{
    designation: string;
    price: number;
  }>;
  totalPrice: number;
  createdAt: string;
};

export default function Devis() {
  const [devis, setDevis] = useState<DevisItem[]>([
    {
      id: 1,
      items: [
        { designation: "Product A", price: 1000 },
        { designation: "Product B", price: 500 }
      ],
      totalPrice: 1500,
      createdAt: "2024-03-15"
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formItems, setFormItems] = useState([{ designation: '', price: '' }]);

  const addNewItem = () => {
    setFormItems([...formItems, { designation: '', price: '' }]);
  };

  const removeItem = (index: number) => {
    if (formItems.length > 1) {
      setFormItems(formItems.filter((_, i) => i !== index));
    }
  };

  const updateFormItem = (index: number, field: 'designation' | 'price', value: string) => {
    const newItems = [...formItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormItems(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalPrice = formItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
    
    const newDevis: DevisItem = {
      id: devis.length + 1,
      items: formItems.map(item => ({
        designation: item.designation,
        price: parseFloat(item.price) || 0
      })),
      totalPrice,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setDevis([...devis, newDevis]);
    setShowForm(false);
    setFormItems([{ designation: '', price: '' }]);
  };

  const handleDelete = (id: number) => {
    setDevis(devis.filter(item => item.id !== id));
  };

  const exportToPDF = () => {
    console.log('Exporting to PDF...');
  };

  const convertToFacture = (id: number) => {
    console.log('Converting to facture...', id);
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Devis</h2>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Devis
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 p-4 rounded-md">
            {formItems.map((item, index) => (
              <div key={index} className="mb-4 relative">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor={`designation-${index}`} className="block text-sm font-medium text-gray-700">
                      Designation
                    </label>
                    <input
                      type="text"
                      id={`designation-${index}`}
                      value={item.designation}
                      onChange={(e) => updateFormItem(index, 'designation', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="relative">
                    <label htmlFor={`quantity-${index}`} className="block text-sm font-medium text-gray-700">
                      Quantity
                    </label>
                    <input
                      type="number"
                      id={`quantity-${index}`}
                      value={item.price}
                      onChange={(e) => updateFormItem(index, 'price', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                    {formItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="absolute right-0 top-0 text-red-600 hover:text-red-800"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            <div className="mt-4">
              <button
                type="button"
                onClick={addNewItem}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un produit
              </button>
            </div>

            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormItems([{ designation: '', price: '' }]);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                Sauvegarder
              </button>
            </div>
          </form>
        )}

        <div className="mt-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Designation
                </th>
                <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix Total
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {devis.map((devisItem) => (
                <tr key={devisItem.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="space-y-1">
                      {devisItem.items.map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{item.designation}</span>
                          <span className="text-gray-500">{item.price.toLocaleString()} TND</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-semibold">
                    {devisItem.totalPrice.toLocaleString()} TND
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {devisItem.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => exportToPDF()}
                        className="text-gray-600 hover:text-gray-900"
                        title="Export PDF"
                      >
                        <FileDown className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => convertToFacture(devisItem.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Convert to Facture"
                      >
                        <ArrowRight className="h-5 w-5" />
                      </button>
                      <button className="text-yellow-600 hover:text-yellow-900" title="Edit">
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(devisItem.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}