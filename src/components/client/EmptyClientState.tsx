interface EmptyClientStateProps {
  activeTab: 'normal' | 'company';
  onAddNew: () => void;
}

export default function EmptyClientState({ activeTab, onAddNew }: EmptyClientStateProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 h-full flex items-center justify-center">
      <div className="text-center text-gray-500">
        <p className="mb-2">Sélectionnez un {activeTab === 'normal' ? 'client' : 'entreprise'} pour voir les détails</p>
        <p>ou</p>
        <button 
          onClick={onAddNew}
          className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          Ajouter un nouveau {activeTab === 'normal' ? 'client' : 'entreprise'}
        </button>
      </div>
    </div>
  );
}