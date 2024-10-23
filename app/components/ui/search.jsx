import React from 'react'
import { Search as SearchIcon } from 'lucide-react'

export const Search = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="relative w-full max-w-sm">
      <input
        type="text"
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search for a tool..."
        className="w-full pl-10 pr-4 py-2 text-sm bg-background border-b border-input focus:border-primary transition-colors duration-200 focus:outline-none"
      />
      <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
    </div>
  )
}