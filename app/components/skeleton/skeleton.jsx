import React from 'react';
import './skeleton.css';

export const Skeleton = () => {
  return (
    <div className="skeleton-card p-6 bg-gray-200 animate-pulse rounded-md">
      <div className="flex items-center justify-between mb-4">
        <div className="skeleton-icon h-12 w-12 bg-gray-300 rounded-full"></div>
        <div className="skeleton-badge h-6 w-20 bg-gray-300 rounded"></div>
      </div>
      <div className="skeleton-text h-4 w-3/4 bg-gray-300 rounded mb-2"></div>
      <div className="skeleton-text h-4 w-1/2 bg-gray-300 rounded"></div>
    </div>
  );
};
