import React from 'react'

export const Search = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="flex items-center justify-center max-w-md mx-auto">
      <input
        type="text"
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search for a tool..."
        className="w-full px-4 py-2 text-gray-200 bg-gray-800 border border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
      />
      <button className="px-6 py-2 text-gray-200 bg-blue-600 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-300">
        Search
      </button>
    </div>
  )
}