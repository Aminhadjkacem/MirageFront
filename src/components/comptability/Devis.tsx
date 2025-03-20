import { useState } from 'react';
import { Plus, FileDown, ArrowRight, Pencil, Trash, X } from 'lucide-react';

type Product = {
  name: string;
  quantity: number;
};

type DevisItem = {
  id: number;
  projectName: string; // Added projectName field
  designations: Array<{
    title: string;
    products: Product[];
  }>;
  createdAt: string;
};

export default function Devis() {
  const [devis, setDevis] = useState<DevisItem[]>([
    {
      id: 1,
      projectName: "Initial Project", // Added projectName to initial data
      designations: [
        {
          title: "Project A",
          products: [
            { name: "Product 1", quantity: 1 },
            { name: "Product 2", quantity: 2 }
          ]
        }
      ],
      createdAt: "2024-03-15"
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<{
    projectName: string; // Added projectName to formData
    designations: Array<{
      title: string;
      products: Array<{ name: string; quantity: number }>;
    }>;
  }>({
    projectName: '',
    designations: [
      {
        title: '',
        products: [{ name: '', quantity: 1 }]
      }
    ]
  });

  const addNewDesignation = () => {
    setFormData({
      ...formData,
      designations: [
        ...formData.designations,
        {
          title: '',
          products: [{ name: '', quantity: 1 }]
        }
      ]
    });
  };

  const addNewProduct = (designationIndex: number) => {
    const newDesignations = [...formData.designations];
    newDesignations[designationIndex].products.push({ name: '', quantity: 1 });
    setFormData({ ...formData, designations: newDesignations });
  };

  const removeProduct = (designationIndex: number, productIndex: number) => {
    if (formData.designations[designationIndex].products.length > 1) {
      const newDesignations = [...formData.designations];
      newDesignations[designationIndex].products = newDesignations[designationIndex].products
        .filter((_, i) => i !== productIndex);
      setFormData({ ...formData, designations: newDesignations });
    }
  };

  const removeDesignation = (index: number) => {
    if (formData.designations.length > 1) {
      setFormData({
        ...formData,
        designations: formData.designations.filter((_, i) => i !== index)
      });
    }
  };

  const updateDesignation = (index: number, title: string) => {
    const newDesignations = [...formData.designations];
    newDesignations[index].title = title;
    setFormData({ ...formData, designations: newDesignations });
  };

  const updateProduct = (designationIndex: number, productIndex: number, field: 'name' | 'quantity', value: string | number) => {
    const newDesignations = [...formData.designations];
    if (field === 'name') {
      newDesignations[designationIndex].products[productIndex].name = value as string;
    } else {
      newDesignations[designationIndex].products[productIndex].quantity = Number(value);
    }
    setFormData({ ...formData, designations: newDesignations });
  };

  const updateProjectName = (projectName: string) => {
    setFormData({ ...formData, projectName });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newDevis: DevisItem = {
      id: devis.length + 1,
      projectName: formData.projectName, // Include projectName in new devis
      designations: formData.designations.map(designation => ({
        title: designation.title,
        products: designation.products.map(product => ({
          name: product.name,
          quantity: product.quantity
        }))
      })),
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setDevis([...devis, newDevis]);
    setShowForm(false);
    setFormData({
      projectName: '', // Reset projectName
      designations: [
        {
          title: '',
          products: [{ name: '', quantity: 1 }]
        }
      ]
    });
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
          <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 p-4 rounded-md space-y-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name
              </label>
              <input
                type="text"
                value={formData.projectName}
                onChange={(e) => updateProjectName(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            {formData.designations.map((designation, designationIndex) => (
              <div key={designationIndex} className="border border-gray-200 rounded-md p-4 relative">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Designation
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={designation.title}
                      onChange={(e) => updateDesignation(designationIndex, e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                    {formData.designations.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDesignation(designationIndex)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Products
                  </label>
                  {designation.products.map((product, productIndex) => (
                    <div key={productIndex} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Product name"
                        value={product.name}
                        onChange={(e) => updateProduct(designationIndex, productIndex, 'name', e.target.value)}
                        className="block w-2/3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Quantity"
                        value={product.quantity}
                        min="1"
                        onChange={(e) => updateProduct(designationIndex, productIndex, 'quantity', e.target.value)}
                        className="block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                      {designation.products.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeProduct(designationIndex, productIndex)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={() => addNewProduct(designationIndex)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-4">
              <button
                type="button"
                onClick={addNewDesignation}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Designation
              </button>
            </div>

            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData({
                    projectName: '',
                    designations: [
                      {
                        title: '',
                        products: [{ name: '', quantity: 1 }]
                      }
                    ]
                  });
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        )}

        <div className="mt-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project / Designations / Products
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
                    <div className="space-y-4">
                      <div className="font-bold text-gray-900 mb-2">{devisItem.projectName}</div>
                      {devisItem.designations.map((designation, index) => (
                        <div key={index} className="ml-4">
                          <div className="font-medium text-gray-900 mb-2">{designation.title}</div>
                          <div className="pl-4 space-y-1">
                            {designation.products.map((product, productIndex) => (
                              <div key={productIndex} className="text-gray-600">
                                {product.name} (Qty: {product.quantity})
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
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