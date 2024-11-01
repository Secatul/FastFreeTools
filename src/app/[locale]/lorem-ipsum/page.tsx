'use client'

import React, { useState, useEffect } from "react"
import Head from "next/head"
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useTheme } from "next-themes"
import { Home, HelpCircle, Moon, Sun, Copy, Check, Download, RefreshCw, Type, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import DOMPurify from "isomorphic-dompurify"
import { useTranslations } from 'next-intl'
import ShareButton from "../components/share-button"

const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`

interface Stats {
  characters: number
  words: number
  sentences: number
  paragraphs: number
}

export default function LoremIpsumGenerator() {
  const [generatedText, setGeneratedText] = useState("")
  const [amount, setAmount] = useState(1)
  const [unit, setUnit] = useState("paragraphs")
  const [startWithLoremIpsum, setStartWithLoremIpsum] = useState(true)
  const [customWords, setCustomWords] = useState("")
  const [isCopied, setIsCopied] = useState(false)
  const [clearDialogOpen, setClearDialogOpen] = useState(false)
  const [stats, setStats] = useState<Stats>({
    characters: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
  })
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const t = useTranslations('LoremIpsumGenerator')
  const pathname = usePathname()

  const locale = pathname ? pathname.split("/")[1] : "en"; 
  const shareUrl = `https://fastfreetools.com/${locale}/lorem-ipsum-generator`
  const shareTitle = t('shareTitle')

  useEffect(() => {
    updateStats(generatedText)
  }, [generatedText])

  const sanitizeAmount = (input: string) => {
    const sanitizedValue = Math.min(100, Math.max(1, parseInt(input) || 1))
    setAmount(sanitizedValue)
  }

  const generateLoremIpsum = () => {
    let result = ""
    const words = customWords
      ? customWords.split(",").map((word) => word.trim()).filter(word => word !== "")
      : loremIpsum.split(" ")

    if (unit === "words") {
      while (result.split(/\s+/).filter(word => word.length > 0).length < amount) {
        result += words[Math.floor(Math.random() * words.length)] + " "
      }
      result = result.trim().split(/\s+/).slice(0, amount).join(" ")
    } else if (unit === "sentences") {
      for (let i = 0; i < amount; i++) {
        let sentence = ""
        while (sentence.split(/\s+/).filter(word => word.length > 0).length < 5) {
          sentence += words[Math.floor(Math.random() * words.length)] + " "
        }
        result += sentence.trim().charAt(0).toUpperCase() + sentence.trim().slice(1) + ". "
      }
    } else {
      for (let i = 0; i < amount; i++) {
        let paragraph = ""
        for (let j = 0; j < 3; j++) {
          let sentence = ""
          while (sentence.split(/\s+/).filter(word => word.length > 0).length < 5) {
            sentence += words[Math.floor(Math.random() * words.length)] + " "
          }
          paragraph += sentence.trim().charAt(0).toUpperCase() + sentence.trim().slice(1) + ". "
        }
        result += paragraph + (i < amount - 1 ? "\n\n" : "")
      }
    }

    if (startWithLoremIpsum && unit !== "words") {
      result = "Lorem ipsum " + result.charAt(0).toLowerCase() + result.slice(1)
    }

    setGeneratedText(DOMPurify.sanitize(result))
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedText)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
      toast({
        title: t('textCopiedTitle'),
        description: t('textCopiedDescription'),
      })
    } catch (err) {
      console.error("Failed to copy text: ", err)
      toast({
        title: t('copyFailedTitle'),
        description: t('copyFailedDescription'),
        variant: "destructive",
      })
    }
  }

  const handleDownload = () => {
    const blob = new Blob([generatedText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "lorem_ipsum.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast({
      title: t('textDownloadedTitle'),
      description: t('textDownloadedDescription'),
    })
  }

  const updateStats = (text: string) => {
    setStats({
      characters: text.length,
      words: text.split(/\s+/).filter(word => word.length > 0).length,
      sentences: text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length,
      paragraphs: text.split(/\n\n+/).filter(para => para.trim().length > 0).length,
    })
  }

  const handleClearInput = () => {
    setGeneratedText("")
    setCustomWords("")
    setClearDialogOpen(false)
    toast({
      title: t('inputClearedTitle'),
      description: t('inputClearedDescription'),
    })
  }

  return (
    <>
      <Head>
        <title>{t('pageTitle')}</title>
        <meta
          name="description"
          content={t('pageDescription')}
        />
        <meta
          name="keywords"
          content={t('pageKeywords')}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={shareUrl} />
        <meta property="og:title" content={t('pageTitle')} />
        <meta
          property="og:description"
          content={t('pageDescription')}
        />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('pageTitle')} />
        <meta
          name="twitter:description"
          content={t('pageDescription')}
        />
        <meta charSet="UTF-8" />
        <link rel="alternate" hrefLang="en" href="https://fastfreetools.com/en/lorem-ipsum-generator" />
        <link rel="alternate" hrefLang="es" href="https://fastfreetools.com/es/lorem-ipsum-generator" />
        <link rel="alternate" hrefLang="fr" href="https://fastfreetools.com/fr/lorem-ipsum-generator" />
        <link rel="alternate" hrefLang="de" href="https://fastfreetools.com/de/lorem-ipsum-generator" />
        <link rel="alternate" hrefLang="x-default" href="https://fastfreetools.com/lorem-ipsum-generator" />
      </Head>
      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-900 dark:to-red-900 p-4 sm:p-6">
          <main className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-in-out">
            <header className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 text-white p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl sm:text-4xl font-bold">{t('headerTitle')}</h1>
                <nav className="flex items-center space-x-2">
                  <Dialog>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" aria-label={t('helpButtonAriaLabel')} className="bg-white/10 hover:bg-white/20 text-white">
                            <HelpCircle className="h-5 w-5" />
                          </Button>
                        </DialogTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('helpTooltip')}</p>
                      </TooltipContent>
                    </Tooltip>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t('aboutDialogTitle')}</DialogTitle>
                        <DialogDescription>
                          <p className="mt-2">
                            <strong>{t('aboutDialogWhy')}</strong> {t('aboutDialogWhyContent')}
                          </p>
                          <p className="mt-2">
                            <strong>{t('aboutDialogWhat')}</strong> {t('aboutDialogWhatContent')}
                          </p>
                          <p className="mt-2">
                            <strong>{t('aboutDialogHow')}</strong> {t('aboutDialogHowContent')}
                          </p>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" asChild className="bg-white/10 hover:bg-white/20 text-white">
                        <Link href={`/${locale}`} aria-label={t('homeButtonAriaLabel')}>
                          <Home className="h-5 w-5" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('homeTooltip')}</p>
                    </TooltipContent>
                  </Tooltip>

                  <ShareButton shareUrl={shareUrl} shareTitle={shareTitle} tooltipText={t('shareTooltip')} />

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        aria-label={t('themeToggleAriaLabel')}
                        className="bg-white/10 hover:bg-white/20 text-white"
                      >
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('themeTooltip')}</p>
                    </TooltipContent>
                  </Tooltip>
                </nav>
              </div>
            </header>

            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="w-full sm:w-1/3">
                    <Label htmlFor="amount">{t('amountLabel')}</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="1"
                      max="100"
                      value={amount}
                      onChange={(e) => sanitizeAmount(e.target.value)}
                      className="mt-1"
                      aria-label={t('amountAriaLabel')}
                    />
                  </div>
                  <div className="w-full sm:w-1/3">
                    <Label htmlFor="unit">{t('unitLabel')}</Label>
                    <Select
                      value={unit}
                      onValueChange={(value) => setUnit(value)}
                      aria-label={t('unitAriaLabel')}
                    >
                      <SelectTrigger id="unit" className="mt-1">
                        <SelectValue placeholder={t('selectUnitPlaceholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paragraphs">{t('paragraphsOption')}</SelectItem>
                        <SelectItem value="sentences">{t('sentencesOption')}</SelectItem>
                        <SelectItem value="words">{t('wordsOption')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full sm:w-1/3 flex items-center space-x-2">
                    <Switch
                      
                      id="start-with-lorem"
                      checked={startWithLoremIpsum}
                      onCheckedChange={setStartWithLoremIpsum}
                      aria-label={t('startWithLoremAriaLabel')}
                      className="data-[state=checked]:bg-blue-500 dark:data-[state=checked]:bg-blue-400"
                    />
                    <Label htmlFor="start-with-lorem">{t('startWithLoremLabel')}</Label>
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="custom-words">{t('customWordsLabel')}</Label>
                  <Input
                    id="custom-words"
                    type="text"
                    value={customWords}
                    onChange={(e) => setCustomWords(e.target.value)}
                    placeholder={t('customWordsPlaceholder')}
                    className="mt-1"
                    aria-label={t('customWordsAriaLabel')}
                  />
                </div>
                <Button 
                  onClick={generateLoremIpsum} 
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700" 
                  aria-label={t('generateButtonAriaLabel')}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t('generateButtonText')}
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row justify-between  items-start sm:items-center gap-2">
                  <Label htmlFor="generated-text" className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    {t('generatedTextLabel')}
                  </Label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t('charactersLabel')}: {stats.characters} | {t('wordsLabel')}: {stats.words}
                    </p>
                    <Dialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 border-red-500 hover:bg-red-100 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-900"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {t('clearButtonText')}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{t('clearDialogTitle')}</DialogTitle>
                          <DialogDescription>
                            {t('clearDialogDescription')}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end space-x-2">
                          <Button onClick={() => setClearDialogOpen(false)} variant="secondary">
                            {t('cancelButtonText')}
                          </Button>
                          <Button onClick={handleClearInput} variant="destructive">
                            {t('clearButtonText')}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                <div className="relative">
                  <Textarea
                    id="generated-text"
                    value={generatedText}
                    readOnly
                    rows={10}
                    className="w-full p-2 font-serif text-sm bg-gray-100 dark:bg-gray-700 border-2 border-blue-300 dark:border-blue-600 rounded-md transition-all duration-300 ease-in-out"
                    aria-label={t('generatedTextAriaLabel')}
                  />
                </div>
                <div className="flex justify-end space-x-2 mt-2">
                  <Button onClick={handleCopy} disabled={!generatedText} className="bg-blue-500 hover:bg-blue-600 text-white">
                    {isCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {isCopied ? t('copiedButtonText') : t('copyButtonText')}
                  </Button>
                  <Button onClick={handleDownload} disabled={!generatedText} className="bg-green-500 hover:bg-green-600 text-white">
                    <Download className="h-4 w-4 mr-2" />
                    {t('downloadButtonText')}
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="stats">
                <TabsList className="grid w-full grid-cols-1 bg-purple-100 dark:bg-purple-900">
                  <TabsTrigger value="stats" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                    <Type className="h-4 w-4 mr-2" />
                    {t('textStatisticsTabLabel')}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="stats" className="p-4 bg-white dark:bg-gray-800 rounded-b-lg shadow-md">
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">{t('charactersLabel')}</TableCell>
                        <TableCell>{stats.characters}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">{t('wordsLabel')}</TableCell>
                        <TableCell>{stats.words}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">{t('sentencesLabel')}</TableCell>
                        <TableCell>{stats.sentences}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">{t('paragraphsLabel')}</TableCell>
                        <TableCell>{stats.paragraphs}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </TooltipProvider>
    </>
  )
}