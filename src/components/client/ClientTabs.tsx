interface ClientTabsProps {
  activeTab: 'normal' | 'company';
  onTabChange: (tab: 'normal' | 'company') => void;
}

export default function ClientTabs({ activeTab, onTabChange }: ClientTabsProps) {
  return (
    <div className="border-b border-gray-200">
      <div className="flex">
        <button
          className={`px-6 py-4 text-sm font-medium ${
            activeTab === 'normal'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => onTabChange('normal')}
        >
          Clients individuels
        </button>
        <button
          className={`px-6 py-4 text-sm font-medium ${
            activeTab === 'company'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => onTabChange('company')}
        >
          Clients entreprises
        </button>
      </div>
    </div>
  );
}