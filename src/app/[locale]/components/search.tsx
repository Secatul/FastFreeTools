import React from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface SearchProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Search: React.FC<SearchProps> = ({ searchQuery, onSearchChange }) => {
  const t = useTranslations('Search');

  return (
    <div className="relative">
      <input
        type="text"
        value={searchQuery}
        onChange={onSearchChange}
        placeholder={t('Placeholder')} // Placeholder traduzido
        className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:border-transparent focus:outline-none transition-colors"
      />
      <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-5 h-5" />
    </div>
  );
};
