"use client"

import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useTheme } from "next-themes"
import { Home, HelpCircle, Moon, Sun, Copy, Save, Trash2, FileText } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import DOMPurify from 'dompurify'

import ShareButton from '@/app/components/share-button';

function sanitizeInput(input) {
  return DOMPurify.sanitize(input)
}

function getReadabilityScore(text) {
  const words = text.trim().split(/\s+/).length
  const sentences = text.split(/[.!?]+/).length
  const avgWordsPerSentence = words / sentences
  const score = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * (words / sentences)
  return Math.max(0, Math.min(100, Math.round(score)))
}

function getSentiment(text) {
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'happy', 'love']
  const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'poor', 'disappointing', 'sad', 'hate']

  const words = text.toLowerCase().match(/\b(\w+)\b/g) || []
  const positiveCount = words.filter(word => positiveWords.includes(word)).length
  const negativeCount = words.filter(word => negativeWords.includes(word)).length

  if (positiveCount > negativeCount) return 'Positive'
  if (negativeCount > positiveCount) return 'Negative'
  return 'Neutral'
}

export default function CaseConverter() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [conversionType, setConversionType] = useState('uppercase')
  const [savedSnippets, setSavedSnippets] = useState([])
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  // Defina o URL de compartilhamento e o título do compartilhamento
  const shareUrl = "https://fastfreetools.com/case-converter";
  const shareTitle = "Check out this Case Converter Tool!";

  useEffect(() => {
    const savedSnippets = localStorage.getItem('savedSnippets')
    if (savedSnippets) {
      setSavedSnippets(JSON.parse(savedSnippets))
    }
  }, [])

  useEffect(() => {
    convertText(inputText, conversionType)
  }, [inputText, conversionType])

  const convertText = (text, type) => {
    const sanitizedText = sanitizeInput(text)
    let result = sanitizedText
    switch (type) {
      case 'uppercase':
        result = sanitizedText.toUpperCase()
        break
      case 'lowercase':
        result = sanitizedText.toLowerCase()
        break
      case 'capitalize':
        result = sanitizedText.replace(/\b\w/g, l => l.toUpperCase())
        break
      case 'alternating':
        result = sanitizedText.split('').map((char, index) =>
          index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
        ).join('')
        break
      case 'title':
        result = sanitizedText.replace(/\b\w+/g, word =>
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        break
      case 'sentence':
        result = sanitizedText.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase())
        break
      default:
        break
    }
    setOutputText(result)
  }

  const handleInputChange = (e) => {
    setInputText(e.target.value)
  }

  const handleConversionTypeChange = (type) => {
    setConversionType(type)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "The converted text has been copied to your clipboard.",
    })
  }

  const saveSnippet = () => {
    if (inputText.trim()) {
      const newSnippet = { input: inputText, output: outputText, type: conversionType }
      const updatedSnippets = [...savedSnippets, newSnippet]
      setSavedSnippets(updatedSnippets)
      localStorage.setItem('savedSnippets', JSON.stringify(updatedSnippets))
      toast({
        title: "Snippet saved",
        description: "Your text snippet has been saved.",
      })
    }
  }

  const loadSnippet = (snippet) => {
    setInputText(snippet.input)
    setConversionType(snippet.type)
    toast({
      title: "Snippet loaded",
      description: "The selected text snippet has been loaded.",
    })
  }

  const deleteSnippet = (index) => {
    const updatedSnippets = savedSnippets.filter((_, i) => i !== index)
    setSavedSnippets(updatedSnippets)
    localStorage.setItem('savedSnippets', JSON.stringify(updatedSnippets))
    toast({
      title: "Snippet deleted",
      description: "The selected text snippet has been deleted.",
      variant: "destructive"
    })
  }

  return (
    <>
      <Head>
        <title>Case Converter | Fast Free Tools</title>
        <meta
          name="description"
          content="Convert text case with our powerful Case Converter tool. Features include multiple conversion types, real-time conversion, and text analysis."
        />
        <meta
          name="keywords"
          content="case converter, text case, uppercase, lowercase, title case, sentence case"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://fastfreetools.com/case-converter" />
        <meta property="og:title" content="Case Converter | Fast Task" />
        <meta
          property="og:description"
          content="Convert text case with our powerful Case Converter tool. Features include multiple conversion types, real-time conversion, and text analysis."
        />
        <meta property="og:url" content="https://fastfreetools.com/case-converter" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Case Converter | Fast Task" />
        <meta
          name="twitter:description"
          content="Convert text case with our powerful Case Converter tool. Features include multiple conversion types, real-time conversion, and text analysis."
        />
        <meta charSet="UTF-8" />
      </Head>

      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-900 dark:to-red-900 p-4 sm:p-6">
          <main className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-in-out">
            <header className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 text-white p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl sm:text-4xl font-bold">Case Converter</h1>
                <nav className="flex items-center space-x-2">
                  <Dialog>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" aria-label="Help" className="bg-white/10 hover:bg-white/20 text-white">
                            <HelpCircle className="h-5 w-5" />
                          </Button>
                        </DialogTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Get help and information about the Case Converter</p>
                      </TooltipContent>
                    </Tooltip>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>About Case Converter</DialogTitle>
                        <DialogDescription>
                          <p className="mt-2">
                            <strong>Why:</strong> This tool helps you convert text between different cases.
                          </p>
                          <p className="mt-2">
                            <strong>What:</strong> You can convert text to uppercase, lowercase, title case, and more.
                          </p>
                          <p className="mt-2">
                            <strong>How:</strong> Enter your text, choose a conversion type, and see the result in real-time.
                          </p>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" asChild className="bg-white/10 hover:bg-white/20 text-white">
                        <Link href="/" aria-label="Home">
                          <Home className="h-5 w-5" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Return to the home page</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Adicionando o botão de compartilhamento */}
                  <ShareButton shareUrl={shareUrl} shareTitle={shareTitle} tooltipText="Share the Case Converter" />

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        aria-label="Toggle theme"
                        className="bg-white/10 hover:bg-white/20 text-white"
                      >
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Switch between light and dark mode</p>
                    </TooltipContent>
                  </Tooltip>
                </nav>
              </div>
            </header>

            <div className="p-6 space-y-6">
              <section className="space-y-4">
                <div>
                  <Label htmlFor="input-text" className="text-lg font-semibold text-gray-700 dark:text-gray-300">Input Text</Label>
                  <Textarea
                    id="input-text"
                    value={inputText}
                    onChange={handleInputChange}
                    className="mt-1 w-full border-2 border-purple-300 dark:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your text here..."
                    rows={5}
                  />
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Characters: {inputText.length} | Words: {inputText.trim().split(/\s+/).length}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {['uppercase', 'lowercase', 'capitalize', 'alternating', 'title', 'sentence'].map((type) => (
                    <Button
                      key={type}
                      onClick={() => handleConversionTypeChange(type)}
                      className={`${conversionType === type ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800'} hover:bg-purple-500 hover:text-white`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Button>
                  ))}
                </div>

                <div>
                  <Label htmlFor="output-text" className="text-lg font-semibold text-gray-700 dark:text-gray-300">Output Text</Label>
                  <div className="relative">
                    <Textarea
                      id="output-text"
                      value={outputText}
                      readOnly
                      className="mt-1 w-full bg-gray-100 dark:bg-gray-700 border-2 border-blue-300 dark:border-blue-600 rounded-md transition-all duration-300 ease-in-out"
                      rows={5}
                    />
                    <Button
                      onClick={() => copyToClipboard(outputText)}
                      className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Characters: {outputText.length} | Words: {outputText.trim().split(/\s+/).length}
                  </p>
                </div>

                <div className="flex justify-between">
                  <Button onClick={saveSnippet} className="bg-green-500 hover:bg-green-600 text-white">
                    <Save className="h-4 w-4 mr-2" />
                    Save Snippet
                  </Button>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Text Analysis</h2>
                <Tabs defaultValue="readability">
                  <TabsList className="grid w-full grid-cols-2 bg-purple-100 dark:bg-purple-900">
                    <TabsTrigger value="readability" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">Readability</TabsTrigger>
                    <TabsTrigger value="sentiment" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">Sentiment</TabsTrigger>
                  </TabsList>
                  <TabsContent value="readability" className="p-4 bg-white dark:bg-gray-800 rounded-b-lg shadow-md">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold mb-2">Readability Score</h3>
                      <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                        {getReadabilityScore(inputText)}
                      </div>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        0-30: Very Difficult | 30-50: Difficult | 50-60: Fairly Difficult |
                        60-70: Standard | 70-80: Fairly Easy | 80-90: Easy | 90-100: Very Easy
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="sentiment" className="p-4 bg-white dark:bg-gray-800 rounded-b-lg shadow-md">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold mb-2">Sentiment Analysis</h3>
                      <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                        {getSentiment(inputText)}
                      </div>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        This is a simple sentiment analysis based on common positive and negative words.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </section>

              {savedSnippets.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Saved Snippets</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedSnippets.map((snippet, index) => (
                      <div key={index} className="border border-purple-300 dark:border-purple-600 p-4 rounded-lg space-y-2 bg-white dark:bg-gray-800 shadow-md">
                        <p className="font-mono text-sm text-gray-700 dark:text-gray-300 truncate">{snippet.input}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Type: {snippet.type}</p>
                        <div className="flex justify-between">
                          <Button onClick={() => loadSnippet(snippet)} className="bg-blue-500 hover:bg-blue-600 text-white">
                            <FileText className="h-4 w-4 mr-2" />
                            Load
                          </Button>
                          <Button variant="destructive" onClick={() => deleteSnippet(index)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </main>
        </div>
      </TooltipProvider>
    </>
  )
}