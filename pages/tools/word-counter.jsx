'use client'

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'next-i18next'  // Importa o hook de tradução
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
  
  const { t } = useTranslation('common') // Usa o hook de tradução

  useEffect(() => {
    analyzeText(text)
  }, [text])

  const analyzeText = (input) => {
    const words = input.trim().split(/\s+/).filter(word => word.length > 0)
    const characters = input.length
    const charactersNoSpaces = input.replace(/\s/g, '').length
    const sentences = input.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0)
    const paragraphs = input.split(/\n+/).filter(para => para.trim().length > 0)
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
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('title')}</h1> {/* Traduz o título */}
        <div className="space-x-2 flex items-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <HelpCircle className="h-4 w-4" />
                <span className="sr-only">{t('buttons.help')}</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('help.title')}</DialogTitle> {/* Traduz o título do diálogo */}
                <DialogDescription>
                  <p className="mt-2">
                    <strong>{t('help.why')}</strong>
                  </p>
                  <p className="mt-2">
                    <strong>{t('help.what')}</strong>
                  </p>
                  <p className="mt-2">
                    <strong>{t('help.how')}</strong>
                  </p>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="icon" asChild>
            <a href="/">
              <Home className="h-4 w-4" />
              <span className="sr-only">{t('buttons.home')}</span> {/* Traduz o texto do botão */}
            </a>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">{t('buttons.toggleTheme')}</span> {/* Traduz o texto do botão */}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="text-input">{t('input.label')}</Label> {/* Traduz o label do textarea */}
        <Textarea
          id="text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('input.placeholder')}
          rows={10}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{t('analysis.title')}</h2> {/* Traduz o título da análise */}
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">{t('analysis.words')}</TableCell>
              <TableCell>{stats.words}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">{t('analysis.charactersWithSpaces')}</TableCell>
              <TableCell>{stats.characters}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">{t('analysis.charactersWithoutSpaces')}</TableCell>
              <TableCell>{stats.charactersNoSpaces}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">{t('analysis.sentences')}</TableCell>
              <TableCell>{stats.sentences}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">{t('analysis.paragraphs')}</TableCell>
              <TableCell>{stats.paragraphs}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">{t('analysis.readingTime')}</TableCell>
              <TableCell>{stats.readingTime} {t('time.minute')}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">{t('analysis.speakingTime')}</TableCell>
              <TableCell>{stats.speakingTime} {t('time.minute')}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <h2 className="text-xl font-semibold">{t('keywordDensity.title')}</h2> {/* Traduz o título da densidade de palavras-chave */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('keywordDensity.keyword')}</TableHead>
              <TableHead>{t('keywordDensity.density')}</TableHead>
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
  )
}
