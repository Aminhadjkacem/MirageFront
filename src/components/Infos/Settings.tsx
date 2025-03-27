import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import settingsApi from '../../api/settingsApi'; // Adjust path
import { toast, ToastContainer } from 'react-toastify'; // Add ToastContainer locally
import 'react-toastify/dist/ReactToastify.css'; // Ensure CSS is imported

interface Settings {
  ProfitMargin: number;
  TVAMargin: number;
  DroitDuTimbrePrice: number;
  CompanyTel: string;
  CompanyFiscal: string;
  factureId: number;
}

export default function Settings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [formData, setFormData] = useState({
    profitMargin: '',
    tvaMargin: '',
    droitDuTimbrePrice: '',
    companyTel: '',
    companyFiscal: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState({
    profitMargin: false,
    tvaMargin: false,
    droitDuTimbrePrice: false,
    companyTel: false,
    companyFiscal: false,
  });

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const data = await settingsApi.getAllSettings();
        setSettings(data);
        setFormData({
          profitMargin: data.ProfitMargin.toString(),
          tvaMargin: data.TVAMargin.toString(),
          droitDuTimbrePrice: data.DroitDuTimbrePrice.toString(),
          companyTel: data.CompanyTel,
          companyFiscal: data.CompanyFiscal,
        });
      } catch {
        toast.error('Échec du chargement des paramètres.');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Handle input changes with toast
  const handleChange = (field: keyof typeof formData, value: string) => {
    console.log(`Modification de ${field} en : ${value}`); // Translated debug log
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      return newData;
    });
  };

  // Handle save for each setting
  const handleSave = async (field: keyof typeof formData) => {
    const value = formData[field];
    if (!value.trim()) {
      toast.error(`${field === 'profitMargin' ? 'Marge bénéficiaire' : field === 'tvaMargin' ? 'Marge TVA' : field === 'droitDuTimbrePrice' ? 'Droit de timbre' : field === 'companyTel' ? 'Téléphone de l’entreprise' : 'Identifiant fiscal de l’entreprise'} ne peut pas être vide.`);
      return;
    }

    setSubmitting((prev) => ({ ...prev, [field]: true }));
    try {
      switch (field) {
        case 'profitMargin':
          await settingsApi.updateProfitMargin(value);
          break;
        case 'tvaMargin':
          await settingsApi.updateTVAMargin(value);
          break;
        case 'droitDuTimbrePrice':
          await settingsApi.updateDroitDuTimbre(value);
          break;
        case 'companyTel':
          await settingsApi.updateCompanyTel(value);
          break;
        case 'companyFiscal':
          await settingsApi.updateCompanyFiscal(value);
          break;
      }
      toast.success(`${field === 'profitMargin' ? 'Marge bénéficiaire' : field === 'tvaMargin' ? 'Marge TVA' : field === 'droitDuTimbrePrice' ? 'Droit de timbre' : field === 'companyTel' ? 'Téléphone de l’entreprise' : 'Identifiant fiscal de l’entreprise'} mis à jour avec succès !`);
      setSettings((prev) => ({
        ...prev!,
        [field.charAt(0).toUpperCase() + field.slice(1)]:
          field.includes('Margin') || field === 'droitDuTimbrePrice' ? parseFloat(value) : value,
      }));
    } catch {
      toast.error(`Échec de la mise à jour de ${field === 'profitMargin' ? 'Marge bénéficiaire' : field === 'tvaMargin' ? 'Marge TVA' : field === 'droitDuTimbrePrice' ? 'Droit de timbre' : field === 'companyTel' ? 'Téléphone de l’entreprise' : 'Identifiant fiscal de l’entreprise'}.`);
    } finally {
      setSubmitting((prev) => ({ ...prev, [field]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="bg-white shadow-sm rounded-xl p-6 mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <SettingsIcon className="h-6 w-6 text-purple-600" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">Paramètres</h1>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au tableau de bord
          </Link>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profit Margin */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">Marge bénéficiaire (%)</label>
            <div className="flex items-center space-x-3">
              <input
                type="number"
                value={formData.profitMargin}
                onChange={(e) => handleChange('profitMargin', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3"
                placeholder="ex. : 30"
                disabled={submitting.profitMargin}
              />
              <button
                onClick={() => handleSave('profitMargin')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={submitting.profitMargin}
              >
                {submitting.profitMargin ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* TVA Margin */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">Marge TVA (%)</label>
            <div className="flex items-center space-x-3">
              <input
                type="number"
                value={formData.tvaMargin}
                onChange={(e) => handleChange('tvaMargin', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3"
                placeholder="ex. : 19"
                disabled={submitting.tvaMargin}
              />
              <button
                onClick={() => handleSave('tvaMargin')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={submitting.tvaMargin}
              >
                {submitting.tvaMargin ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Droit Du Timbre Price */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">Droit de timbre (TND)</label>
            <div className="flex items-center space-x-3">
              <input
                type="number"
                step="0.01"
                value={formData.droitDuTimbrePrice}
                onChange={(e) => handleChange('droitDuTimbrePrice', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3"
                placeholder="ex. : 1"
                disabled={submitting.droitDuTimbrePrice}
              />
              <button
                onClick={() => handleSave('droitDuTimbrePrice')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={submitting.droitDuTimbrePrice}
              >
                {submitting.droitDuTimbrePrice ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Company Tel */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone de l’entreprise</label>
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={formData.companyTel}
                onChange={(e) => handleChange('companyTel', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3"
                placeholder="ex. : +216 58751633"
                disabled={submitting.companyTel}
              />
              <button
                onClick={() => handleSave('companyTel')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={submitting.companyTel}
              >
                {submitting.companyTel ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Company Fiscal */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">Identifiant fiscal de l’entreprise</label>
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={formData.companyFiscal}
                onChange={(e) => handleChange('companyFiscal', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3"
                placeholder="ex. : lotfidhp"
                disabled={submitting.companyFiscal}
              />
              <button
                onClick={() => handleSave('companyFiscal')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={submitting.companyFiscal}
              >
                {submitting.companyFiscal ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Facture ID (Read-Only) */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">Identifiant actuel de facture</label>
            <input
              type="number"
              value={settings?.factureId || 0}
              className="block w-full rounded-md border-gray-300 bg-gray-100 text-sm py-2 px-3"
              disabled
            />
            <p className="mt-2 text-sm text-gray-500">Cet identifiant est incrémenté automatiquement lors de la création d’une facture.</p>
          </div>
        </div>
      </div>
      {/* Local ToastContainer as fallback */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}