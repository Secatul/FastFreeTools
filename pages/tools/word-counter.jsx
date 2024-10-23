'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Head from 'next/head'
import { Label } from "@/components/ui/label"
import DOMPurify from 'dompurify'
import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useTheme } from "next-themes"
import { Home, HelpCircle, Moon, Sun } from 'lucide-react'

export default function WordCounter() {
  const [text, setText] = useState('')
  const [stats, setStats] = useState({
    words: 0,
    characters: 0,
    charactersNoSpaces: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
    speakingTime: 0,
  })
  const [keywordDensity, setKeywordDensity] = useState([])
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    analyzeText(text)
  }, [text])

  const analyzeText = (input) => {
    const sanitizedInput = DOMPurify.sanitize(input)

    const words = sanitizedInput.trim().split(/\s+/).filter(word => word.length > 0)
    const characters = sanitizedInput.length
    const charactersNoSpaces = sanitizedInput.replace(/\s/g, '').length
    const sentences = sanitizedInput.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0)
    const paragraphs = sanitizedInput.split(/\n+/).filter(para => para.trim().length > 0)
    const readingTime = Math.ceil(words.length / 200)
    const speakingTime = Math.ceil(words.length / 130)

    setStats({
      words: words.length,
      characters,
      charactersNoSpaces,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      readingTime,
      speakingTime,
    })

    const wordFrequency = {}
    words.forEach(word => {
      const lowercaseWord = word.toLowerCase()
      if (lowercaseWord.length > 3) {
        wordFrequency[lowercaseWord] = (wordFrequency[lowercaseWord] || 0) + 1
      }
    })

    const sortedKeywords = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word, count]) => [word, Math.round((count / words.length) * 100)])

    setKeywordDensity(sortedKeywords)
  }

  return (
    <>
      <Head>
        <title>Word Counter Tool</title>
        <meta
          name="description"
          content="Analyze your text with our Word Counter Tool. Get detailed statistics on word count, character count, sentence count, paragraph count, reading time, speaking time, and keyword density."
        />
        <meta
          name="keywords"
          content="word counter, character count, keyword density, reading time, speaking time, text analysis"
        />
        <meta name="author" content="Your Name or Company" />
        <meta property="og:title" content="Word Counter Tool" />
        <meta
          property="og:description"
          content="Easily analyze text with our Word Counter Tool. Discover word count, character count, sentence count, reading time, and more."
        />
        <meta property="og:image" content="https://example.com/og-image.jpg" />
        <meta property="og:url" content="https://example.com/word-counter" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Word Counter Tool" />
        <meta
          name="twitter:description"
          content="Analyze your text with our Word Counter Tool. Get insights into word count, reading time, and keyword density."
        />
        <meta name="twitter:image" content="https://example.com/twitter-image.jpg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Word Counter Tool</h1>
          <div className="space-x-2 flex items-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Help">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>About Word Counter Tool</DialogTitle>
                  <DialogDescription>
                    <p className="mt-2">
                      <strong>Why:</strong> This tool helps you analyze your text, providing word and character counts, reading and speaking time estimates, and keyword density.
                    </p>
                    <p className="mt-2">
                      <strong>What:</strong> It provides detailed insights into your text, helping you better understand its structure and complexity.
                    </p>
                    <p className="mt-2">
                      <strong>How:</strong> Simply paste or type your text into the input area, and the tool will automatically analyze it for you.
                    </p>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="icon" asChild>
              <Link href="/" aria-label="Home">
                <Home className="h-4 w-4" />
                <span className="sr-only">Home</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="text-input">Enter Your Text</Label>
          <Textarea
            id="text-input"
            value={text}
            onChange={(e) => setText(DOMPurify.sanitize(e.target.value))}
            placeholder="Paste or type your text here..."
            rows={10}
            aria-label="Text input"
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Text Analysis</h2>
          <Table className="table-auto w-full">
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Words</TableCell>
                <TableCell>{stats.words}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Characters (including spaces)</TableCell>
                <TableCell>{stats.characters}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Characters (excluding spaces)</TableCell>
                <TableCell>{stats.charactersNoSpaces}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Sentences</TableCell>
                <TableCell>{stats.sentences}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Paragraphs</TableCell>
                <TableCell>{stats.paragraphs}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Estimated Reading Time</TableCell>
                <TableCell>{stats.readingTime} minute(s)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Estimated Speaking Time</TableCell>
                <TableCell>{stats.speakingTime} minute(s)</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <h2 className="text-xl font-semibold">Keyword Density</h2>
          <Table className="table-auto w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Keyword</TableHead>
                <TableHead>Density (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keywordDensity.map(([word, density]) => (
                <TableRow key={word}>
                  <TableCell>{word}</TableCell>
                  <TableCell>{density}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  )
}
