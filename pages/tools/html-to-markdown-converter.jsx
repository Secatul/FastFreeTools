"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useTheme } from "next-themes"
import { Home, HelpCircle, Moon, Sun, Copy, Check, Download } from 'lucide-react'

// You'll need to install these packages:
// npm install turndown prismjs
import TurndownService from 'turndown'
import Prism from 'prismjs'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-markdown'
import 'prismjs/themes/prism.css'

export default function HTMLToMarkdownConverter() {
  const [html, setHtml] = useState('')
  const [cleanHtml, setCleanHtml] = useState('')
  const [markdown, setMarkdown] = useState('')
  const [error, setError] = useState('')
  const [isCopied, setIsCopied] = useState(false)
  const [showRenderedHtml, setShowRenderedHtml] = useState(true)
  const [showCleanHtml, setShowCleanHtml] = useState(true)
  const [showMarkdown, setShowMarkdown] = useState(true)
  const { theme, setTheme } = useTheme()

  const turndownService = new TurndownService()

  useEffect(() => {
    convertHtml(html)
  }, [html])

  useEffect(() => {
    Prism.highlightAll()
  }, [cleanHtml, markdown])

  const cleanHtmlContent = (input) => {
    // Remove scripts
    let cleaned = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    
    // Remove styles
    cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    
    // Remove most attributes, keeping only href and src
    cleaned = cleaned.replace(/<([a-z][a-z0-9]*)[^>]*?(href|src)="[^"]*"[^>]*>/gi, (match, p1, p2) => {
      const attr = match.match(new RegExp(`${p2}="[^"]*"`, 'i'))
      return `<${p1}${attr ? ' ' + attr[0] : ''}>`
    })

    return cleaned
  }

  const convertHtml = (input) => {
    try {
      const cleanedHtml = cleanHtmlContent(input)
      setCleanHtml(cleanedHtml)

      const result = turndownService.turndown(cleanedHtml)
      setMarkdown(result)
      setError('')
    } catch (err) {
      setError('Invalid HTML input. Please check your HTML and try again.')
      setCleanHtml('')
      setMarkdown('')
    }
  }

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const handleDownload = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">HTML to Markdown Converter</h1>
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
                <DialogTitle>About HTML to Markdown Converter</DialogTitle>
                <DialogDescription>
                  <p className="mt-2">
                    <strong>Why:</strong> This tool helps you convert HTML content to Markdown format while providing additional views.
                  </p>
                  <p className="mt-2">
                    <strong>What:</strong> It takes HTML input and generates a rendered preview, cleaned HTML (without CSS and JavaScript), and equivalent Markdown.
                  </p>
                  <p className="mt-2">
                    <strong>How:</strong> Paste your HTML into the input area. The tool will process it and display the results in real-time. You can toggle different views and copy or download the results.
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
        <Label htmlFor="html-input">HTML Input</Label>
        <Textarea
          id="html-input"
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          placeholder="Paste your HTML here..."
          rows={10}
        />
      </div>

      {error && <p className="text-destructive">{error}</p>}

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="show-rendered-html"
            checked={showRenderedHtml}
            onCheckedChange={setShowRenderedHtml}
          />
          <Label htmlFor="show-rendered-html">Show Rendered HTML</Label>
        </div>
        {showRenderedHtml && (
          <div className="border p-4 rounded-md">
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="show-clean-html"
            checked={showCleanHtml}
            onCheckedChange={setShowCleanHtml}
          />
          <Label htmlFor="show-clean-html">Show Clean HTML</Label>
        </div>
        {showCleanHtml && (
          <div className="relative">
            <pre className="language-markup">
              <code>{cleanHtml}</code>
            </pre>
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => handleCopy(cleanHtml)}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-24"
              onClick={() => handleDownload(cleanHtml, 'clean_html.html')}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="show-markdown"
            checked={showMarkdown}
            onCheckedChange={setShowMarkdown}
          />
          <Label htmlFor="show-markdown">Show Markdown</Label>
        </div>
        {showMarkdown && (
          <div className="relative">
            <pre className="language-markdown">
              <code>{markdown}</code>
            </pre>
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => handleCopy(markdown)}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-24"
              onClick={() => handleDownload(markdown, 'converted_markdown.md')}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
