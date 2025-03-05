import { Search } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearch: (value: string) => void;
}

export default function SearchBar({ searchTerm, onSearch }: SearchBarProps) {
  return (
    <div className="mb-6">
      <div className="relative">
        <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
}