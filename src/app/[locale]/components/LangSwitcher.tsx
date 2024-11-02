'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useSelectedLayoutSegments } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Option {
  country: string
  code: string
  flag: string
}

export default function LangSwitcher() {
  const pathname = usePathname() ?? ''
  const urlSegments = useSelectedLayoutSegments() ?? []

  const [isOpen, setIsOpen] = useState(false)

  const options: Option[] = [
    { country: 'English', code: 'en', flag: '🇬🇧' },
    { country: 'Deutsch', code: 'de', flag: '🇩🇪' },
    { country: 'Français', code: 'fr', flag: '🇫🇷' },
    { country: 'Español', code: 'es', flag: '🇪🇸' },
    { country: 'Português (Brasil)', code: 'pt-br', flag: '🇧🇷' }
  ]

  const currentLang = options.find(lang => pathname.startsWith(`/${lang.code}`)) || options[0]

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="default"
          className="relative inline-flex items-center justify-center px-4 py-2 rounded-full bg-gray-700 dark:bg-gray-800 focus:outline-none transition-all duration-300
          border-2 border-transparent hover:border-blue-500 dark:hover:border-yellow-500 text-white dark:text-gray-200"
        >
          <Globe className="w-5 h-5 mr-2 dark:text-blue-400 text-yellow-400" />
          <span className="mr-1">{currentLang.flag}</span>
          <span className="font-medium">{currentLang.code.toUpperCase()}</span>
          <span className="sr-only">Select Language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 mt-2">
        {options.map((lang) => (
          <DropdownMenuItem key={lang.code} asChild>
            <Link
              href={`/${lang.code}/${urlSegments.filter(Boolean).join('/')}`}
              className={`flex items-center space-x-2 px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                pathname.startsWith(`/${lang.code}`)
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                  : 'text-gray-700 dark:text-gray-200'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="flex-grow">{lang.country}</span>
              {pathname.startsWith(`/${lang.code}`) && (
                <span className="text-blue-500 dark:text-yellow-400">✓</span>
              )}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}