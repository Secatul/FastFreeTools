"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
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

export default function JsonFormatter() {
  const [inputText, setInputText] = useState('')
  const [resultText, setResultText] = useState('')
  const [error, setError] = useState('')
  const [isCopied, setIsCopied] = useState(false)
  const { theme, setTheme } = useTheme()

  const handleInputChange = (e) => {
    setInputText(e.target.value)
  }

  const handleFormat = () => {
    try {
      const json = JSON.parse(inputText)
      setResultText(JSON.stringify(json, null, 2))
      setError('')
    } catch (err) {
      setError('Invalid JSON format. Please check your input.')
      setResultText('')
    }
  }

  const handleMinify = () => {
    try {
      const json = JSON.parse(inputText)
      setResultText(JSON.stringify(json))
      setError('')
    } catch (err) {
      setError('Invalid JSON format. Please check your input.')
      setResultText('')
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resultText)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">JSON Formatter</h1>
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
                <DialogTitle>About JSON Formatter</DialogTitle>
                <DialogDescription>
                  <p className="mt-2">
                    <strong>Why:</strong> The JSON Formatter tool helps you quickly format and minify JSON data, making it easier to read and work with.
                  </p>
                  <p className="mt-2">
                    <strong>What:</strong> It can format JSON with proper indentation or minify it by removing all unnecessary whitespace.
                  </p>
                  <p className="mt-2">
                    <strong>How:</strong> Simply paste your JSON into the input area, then click "Format JSON" or "Minify JSON". The tool will process your input and display the result.
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
        <Label htmlFor="input-json">Input JSON</Label>
        <Textarea
          id="input-json"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Enter your JSON here..."
          rows={8}
        />
        <p className="text-sm text-muted-foreground">
          Character count: {inputText.length}
        </p>
      </div>

      <div className="flex items-center space-x-4">
        <Button onClick={handleFormat}>Format JSON</Button>
        <Button onClick={handleMinify} variant="secondary">Minify JSON</Button>
      </div>

      {error && <p className="text-destructive">{error}</p>}

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="result-json">Result</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={!resultText}
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
          id="result-json"
          value={resultText}
          readOnly
          rows={8}
        />
        <p className="text-sm text-muted-foreground">
          Character count: {resultText.length}
        </p>
      </div>
    </div>
  )
}