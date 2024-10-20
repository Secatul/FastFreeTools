"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useTheme } from "next-themes"
import { Home, HelpCircle, Copy, Check, Moon, Sun } from 'lucide-react'

export default function CaseConverter() {
  const [inputText, setInputText] = useState('')
  const [convertedText, setConvertedText] = useState('')
  const [conversionType, setConversionType] = useState('uppercase')
  const [isCopied, setIsCopied] = useState(false)
  const [copyFeedback, setCopyFeedback] = useState('')
  const { theme, setTheme } = useTheme()

  const handleTextChange = (e) => {
    setInputText(e.target.value)
  }

  const handleConversionTypeChange = (value) => {
    setConversionType(value)
  }

  const convertText = (text, type) => {
    switch (type) {
      case 'uppercase':
        return text.toUpperCase()
      case 'lowercase':
        return text.toLowerCase()
      case 'capitalize':
        return text.replace(/\b\w/g, (char) => char.toUpperCase())
      case 'camelcase':
        return text
          .replace(/\s(.)/g, (match) => match.toUpperCase())
          .replace(/\s/g, '')
          .replace(/^(.)/, (match) => match.toLowerCase())
      case 'snakecase':
        return text.toLowerCase().replace(/\s+/g, '_')
      case 'pascalcase':
        return text
          .replace(/\w+/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
          .replace(/\s/g, '')
      default:
        return text
    }
  }

  const handleConvert = () => {
    const result = convertText(inputText, conversionType)
    setConvertedText(result)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(convertedText)
      setIsCopied(true)
      setCopyFeedback('Copied!')
      setTimeout(() => {
        setIsCopied(false)
        setCopyFeedback('')
      }, 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
      setCopyFeedback('Failed to copy')
      setTimeout(() => setCopyFeedback(''), 2000)
    }
  }

  useEffect(() => {
    setIsCopied(false)
    setCopyFeedback('')
  }, [convertedText])

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Case Converter</h1>
        <div className="space-x-2 flex items-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <HelpCircle className="h-4 w-4" />
                <span className="sr-only">Help</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>About Case Converter</DialogTitle>
                <DialogDescription>
                  <p className="mt-2">
                    <strong>Why:</strong> The Case Converter tool helps you quickly transform text into different case styles, saving time and ensuring consistency in your writing or coding.
                  </p>
                  <p className="mt-2">
                    <strong>What:</strong> It converts text between various case styles, including uppercase, lowercase, title case, camelCase, snake_case, and PascalCase.
                  </p>
                  <p className="mt-2">
                    <strong>How:</strong> Simply enter your text, choose a conversion type, and click "Convert". The tool will instantly transform your text to the selected case style.
                  </p>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="icon" asChild>
            <a href="/">
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </a>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="input-text">Input</Label>
        <Textarea
          id="input-text"
          value={inputText}
          onChange={handleTextChange}
          placeholder="Enter your text here..."
          rows={5}
        />
        <p className="text-sm text-muted-foreground">
          Character count: {inputText.length}
        </p>
      </div>

      <div className="flex items-center space-x-4">
        <Select value={conversionType} onValueChange={handleConversionTypeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select case" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="uppercase">Uppercase</SelectItem>
            <SelectItem value="lowercase">Lowercase</SelectItem>
            <SelectItem value="capitalize">Capitalize Each Word</SelectItem>
            <SelectItem value="camelcase">camelCase</SelectItem>
            <SelectItem value="snakecase">snake_case</SelectItem>
            <SelectItem value="pascalcase">PascalCase</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleConvert}>Convert</Button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="result-text">Result</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={!convertedText}
          >
            {isCopied ? (
              <Check className="h-4 w-4 mr-2" />
            ) : (
              <Copy className="h-4 w-4 mr-2" />
            )}
            {isCopied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
        <Textarea
          id="result-text"
          value={convertedText}
          readOnly
          rows={5}
        />
        <p className="text-sm text-muted-foreground">
          Character count: {convertedText.length}
        </p>
      </div>
    </div>
  )
}