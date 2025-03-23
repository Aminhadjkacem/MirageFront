interface DeleteConfirmationModalProps {
  type: string;
  itemName?: string; // Optional: show the name of the item being deleted
  onCancel: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export default function DeleteConfirmationModal({
  type,
  itemName,
  onCancel,
  onConfirm,
  isLoading,
}: DeleteConfirmationModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Confirmer la suppression</h3>
        <p className="text-gray-700 mb-6">
          Êtes-vous sûr de vouloir supprimer {itemName ? `le ${type} "${itemName}"` : `ce ${type}`} ? Cette action ne peut pas être annulée.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            disabled={isLoading}
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Suppression en cours...' : 'Supprimer'}
          </button>
        </div>
      </div>
    </div>
  );
}