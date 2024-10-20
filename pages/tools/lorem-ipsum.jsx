"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useTheme } from "next-themes"
import { Home, HelpCircle, Copy, Check, Moon, Sun, RefreshCw } from 'lucide-react'

const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`

export default function LoremIpsumGenerator() {
  const [generatedText, setGeneratedText] = useState('')
  const [amount, setAmount] = useState(1)
  const [unit, setUnit] = useState('paragraphs') // Removed TypeScript annotation
  const [startWithLoremIpsum, setStartWithLoremIpsum] = useState(true)
  const [isCopied, setIsCopied] = useState(false)
  const { theme, setTheme } = useTheme()

  const generateLoremIpsum = () => {
    let result = ''
    const words = loremIpsum.split(' ')
    
    if (unit === 'words') {
      result = words.slice(0, amount).join(' ')
    } else if (unit === 'sentences') {
      const sentences = loremIpsum.split('.')
      result = sentences.slice(0, amount).join('. ') + '.'
    } else {
      for (let i = 0; i < amount; i++) {
        result += loremIpsum + (i < amount - 1 ? '\n\n' : '')
      }
    }

    if (!startWithLoremIpsum && unit !== 'words') {
      result = result.replace('Lorem ipsum ', '')
    }

    setGeneratedText(result)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedText)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Lorem Ipsum Generator</h1>
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
                <DialogTitle>About Lorem Ipsum Generator</DialogTitle>
                <DialogDescription>
                  <p className="mt-2">
                    <strong>Why:</strong> Lorem Ipsum is commonly used as placeholder text in design and publishing.
                  </p>
                  <p className="mt-2">
                    <strong>What:</strong> This tool generates Lorem Ipsum text based on your specifications.
                  </p>
                  <p className="mt-2">
                    <strong>How:</strong> Choose the amount and unit of text you want, then click "Generate" to create your Lorem Ipsum text.
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

      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              min="1"
              max="100"
              value={amount}
              onChange={(e) => setAmount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="unit">Unit</Label>
            <Select value={unit} onValueChange={(value) => setUnit(value)}>
              <SelectTrigger id="unit">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paragraphs">Paragraphs</SelectItem>
                <SelectItem value="sentences">Sentences</SelectItem>
                <SelectItem value="words">Words</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="start-with-lorem"
            checked={startWithLoremIpsum}
            onCheckedChange={setStartWithLoremIpsum}
          />
          <Label htmlFor="start-with-lorem">Start with "Lorem ipsum"</Label>
        </div>
        <Button onClick={generateLoremIpsum} className="w-full">
          <RefreshCw className="h-4 w-4 mr-2" />
          Generate Lorem Ipsum
        </Button>
      </div>

      {generatedText && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="generated-text">Generated Lorem Ipsum</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={!generatedText}
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
            id="generated-text"
            value={generatedText}
            readOnly
            rows={10}
            className="w-full p-2 font-serif text-sm"
          />
        </div>
      )}
    </div>
  )
}
