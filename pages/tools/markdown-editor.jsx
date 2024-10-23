
"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import 'github-markdown-css/github-markdown.css';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Head from 'next/head';
import { useTheme } from "next-themes"
import { Home, HelpCircle, Moon, Sun, Bold, Italic, Heading, List, ListOrdered, Link, Image, Code, Download, Upload, Maximize, Minimize } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState('')
  const [isFullScreen, setIsFullScreen] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const savedMarkdown = localStorage.getItem('markdown')
    if (savedMarkdown) {
      setMarkdown(savedMarkdown)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('markdown', markdown)
  }, [markdown])

  const insertText = (before, after = '') => {
    const textarea = document.getElementById('markdown-input')
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    const newText = text.substring(0, start) + before + text.substring(start, end) + after + text.substring(end)
    setMarkdown(newText)
    textarea.focus()
    textarea.setSelectionRange(start + before.length, end + before.length)
  }

  const handleFormatting = (type) => {
    switch (type) {
      case 'bold':
        insertText('**', '**')
        break
      case 'italic':
        insertText('*', '*')
        break
      case 'heading':
        insertText('### ')
        break
      case 'unordered-list':
        insertText('- ')
        break
      case 'ordered-list':
        insertText('1. ')
        break
      case 'link':
        insertText('[', '](url)')
        break
      case 'image':
        insertText('![alt text](', ')')
        break
      case 'code':
        insertText('`', '`')
        break
    }
  }

  const handleFileImport = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setMarkdown(e.target.result)
      reader.readAsText(file)
    }
  }

  const handleFileExport = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'document.md'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const wordCount = markdown.trim().split(/\s+/).length
  const characterCount = markdown.length

  return (

    <>
      <Head>
        <title>Markdown Editor</title>
        <meta
          name="description"
          content="A versatile Markdown editor with real-time preview, file import/export, and support for text formatting. Write, format, and preview Markdown easily."
        />
        <meta
          name="keywords"
          content="Markdown editor, Markdown preview, online Markdown editor, Markdown formatting, Markdown tool"
        />
        <meta name="author" content="Your Name or Company" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Markdown Editor" />
        <meta
          property="og:description"
          content="Create and preview Markdown content in real-time with our Markdown Editor. Import/export files and use handy formatting options."
        />
        <meta property="og:image" content="https://example.com/og-image.jpg" />
        <meta property="og:url" content="https://example.com/markdown-editor" />
        <meta property="og:type" content="website" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Markdown Editor" />
        <meta
          name="twitter:description"
          content="A powerful Markdown editor that allows you to write, format, and preview Markdown content in real-time."
        />
        <meta name="twitter:image" content="https://example.com/twitter-image.jpg" />

        {/* Responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Charset and Favicon */}
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <div className={`p-4 ${isFullScreen ? 'fixed inset-0 z-50 bg-background' : 'max-w-6xl mx-auto'}`}>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Markdown Editor</h1>
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
                  <DialogTitle>About Markdown Editor</DialogTitle>
                  <DialogDescription>
                    <p className="mt-2">
                      <strong>Why:</strong> This tool helps you write and preview Markdown content easily.
                    </p>
                    <p className="mt-2">
                      <strong>What:</strong> You can write Markdown, see a live preview, use formatting buttons, and import/export files.
                    </p>
                    <p className="mt-2">
                      <strong>How:</strong> Type in the left panel to see the rendered output on the right. Use the toolbar for common formatting options.
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

        <div className="flex flex-wrap mb-2 gap-2">
          <Button variant="outline" size="icon" onClick={() => handleFormatting('bold')}>
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => handleFormatting('italic')}>
            <Italic className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => handleFormatting('heading')}>
            <Heading className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => handleFormatting('unordered-list')}>
            <List className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => handleFormatting('ordered-list')}>
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => handleFormatting('link')}>
            <Link className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => handleFormatting('image')}>
            <Image className="h-4 w-4" alt="Insert image" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => handleFormatting('code')}>
            <Code className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleFileExport}>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" component="label">
            <Upload className="h-4 w-4" />
            <input type="file" hidden onChange={handleFileImport} accept=".md,.markdown,text/markdown" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setIsFullScreen(!isFullScreen)}>
            {isFullScreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2">
            <Textarea
              id="markdown-input"
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Type your Markdown here..."
              className="w-full h-[calc(100vh-200px)] font-mono"
            />
          </div>
          <div className="w-full md:w-1/2 border rounded-md p-4 overflow-auto h-[calc(100vh-200px)] markdown-body">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <SyntaxHighlighter
                      {...props}
                      children={String(children).replace(/\n$/, '')}
                      style={tomorrow}
                      language={match[1]}
                      PreTag="div"
                    />
                  ) : (
                    <code {...props} className={className}>
                      {children}
                    </code>
                  )
                }
              }}
            >
              {markdown}
            </ReactMarkdown>
          </div>

        </div>

        <div className="mt-2 text-sm text-muted-foreground">
          Words: {wordCount} | Characters: {characterCount}
        </div>
      </div>
    </>
  )
}