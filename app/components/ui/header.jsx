import React from 'react'

export const Header = ({title, description}) => {
  return (
    <header className="text-center">
      <h1 className="text-4xl font-bold dark:text-gray-100 mb-2">{title}</h1>
      <h2 className="text-xl dark:text-gray-400">✨ {description} ✨</h2>
    </header>
  )
}