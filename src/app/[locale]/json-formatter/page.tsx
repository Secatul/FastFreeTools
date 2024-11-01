'use client'

import React, { useState } from "react"
import Head from "next/head"
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import ShareButton from "../components/share-button"
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
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useTheme } from "next-themes"
import { Home, HelpCircle, Moon, Sun, Copy, Check, Download, ArrowDownAZ, Code, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DOMPurify from "isomorphic-dompurify"
import { useTranslations } from 'next-intl'

interface Stats {
  inputLength: number
  outputLength: number
  inputLines: number
  outputLines: number
}

export default function JsonFormatter() {
  const [inputText, setInputText] = useState("")
  const [resultText, setResultText] = useState("")
  const [error, setError] = useState("")
  const [isCopied, setIsCopied] = useState(false)
  const [clearDialogOpen, setClearDialogOpen] = useState(false)
  const [stats, setStats] = useState<Stats>({
    inputLength: 0,
    outputLength: 0,
    inputLines: 0,
    outputLines: 0,
  })
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const t = useTranslations('JsonFormatter')
  const pathname = usePathname()

  const locale = pathname ? pathname.split("/")[1] : "en"; 
  const shareUrl = `https://fastfreetools.com/${locale}/json-formatter`
  const shareTitle = t('shareTitle')

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const sanitizedInput = DOMPurify.sanitize(e.target.value)
    setInputText(sanitizedInput)
    updateStats(sanitizedInput, resultText)
  }

  const handleFormat = () => {
    try {
      const json = JSON.parse(inputText)
      const formatted = JSON.stringify(json, null, 2)
      setResultText(formatted)
      setError("")
      updateStats(inputText, formatted)
    } catch (err) {
      setError(t('invalidJsonError'))
      setResultText("")
      updateStats(inputText, "")
    }
  }

  const handleMinify = () => {
    try {
      const json = JSON.parse(inputText)
      const minified = JSON.stringify(json)
      setResultText(minified)
      setError("")
      updateStats(inputText, minified)
    } catch (err) {
      setError(t('invalidJsonError'))
      setResultText("")
      updateStats(inputText, "")
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resultText)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
      toast({
        title: t('jsonCopiedTitle'),
        description: t('jsonCopiedDescription'),
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
    const blob = new Blob([resultText], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "formatted_json.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast({
      title: t('jsonDownloadedTitle'),
      description: t('jsonDownloadedDescription'),
    })
  }

  const updateStats = (input: string, output: string) => {
    setStats({
      inputLength: input.length,
      outputLength: output.length,
      inputLines: input.split("\n").length,
      outputLines: output.split("\n").length,
    })
  }

  const handleGenerateFakeJson = () => {
    const fakeJson = {
      name: "John Doe",
      age: 28,
      address: {
        street: "123 Main St",
        city: "New York",
        zip: "10001",
      },
      hobbies: ["reading", "coding", "hiking"],
    }

    const formattedFakeJson = JSON.stringify(fakeJson, null, 2)
    setInputText(formattedFakeJson)
    setError("")
    updateStats(formattedFakeJson, resultText)
  }

  const handleClearInput = () => {
    setInputText("")
    setResultText("")
    setError("")
    updateStats("", "")
    setClearDialogOpen(false)
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
        <link rel="alternate" hrefLang="en" href="https://fastfreetools.com/en/json-formatter" />
        <link rel="alternate" hrefLang="es" href="https://fastfreetools.com/es/json-formatter" />
        <link rel="alternate" hrefLang="fr" href="https://fastfreetools.com/fr/json-formatter" />
        <link rel="alternate" hrefLang="de" href="https://fastfreetools.com/de/json-formatter" />
        <link rel="alternate" hrefLang="x-default" href="https://fastfreetools.com/json-formatter" />
      </Head>
      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-900 dark:to-red-900 p-4 sm:p-6">
          <main className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-in-out">
            <header className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 text-white p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">{t('headerTitle')}</h1>
                <nav className="flex flex-wrap items-center gap-2">
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
                    <DialogContent className="sm:max-w-[425px]">
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
                        <Link href="/" aria-label={t('homeButtonAriaLabel')}>
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

            <div className="p-4 sm:p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="input-json" className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  {t('inputLabel')}
                </Label>
                <Textarea
                  id="input-json"
                  value={inputText}
                  onChange={handleInputChange}
                  placeholder={t('inputPlaceholder')}
                  rows={10}
                  className="w-full p-2 border-2 border-purple-300 dark:border-purple-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  aria-label={t('inputAriaLabel')}
                />
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('charactersLabel')}: {stats.inputLength} | {t('linesLabel')}: {stats.inputLines}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={handleGenerateFakeJson} className="bg-gray-500 hover:bg-gray-600 text-white">
                      {t('generateFakeJsonButton')}
                    </Button>
                    <Dialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="destructive" className="bg-red-500 hover:bg-red-600 text-white">
                          <Trash2 className="h-4 w-4 mr-2" />
                          {t('clearInputButton')}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>{t('clearInputDialogTitle')}</DialogTitle>
                          <DialogDescription>
                            {t('clearInputDialogDescription')}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setClearDialogOpen(false)}>
                            {t('cancelButton')}
                          </Button>
                          <Button variant="destructive" onClick={handleClearInput}>
                            {t('clearButton')}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button onClick={handleFormat} className="bg-blue-500 hover:bg-blue-600 text-white">
                  <Code className="h-4 w-4 mr-2" />
                  {t('formatJsonButton')}
                </Button>
                <Button onClick={handleMinify} className="bg-green-500 hover:bg-green-600 text-white">
                  <ArrowDownAZ className="h-4 w-4 mr-2" />
                  {t('minifyJsonButton')}
                </Button>
              </div>

              {error && <p className="text-red-500 dark:text-red-400">{error}</p>}

              <div className="space-y-2">
                <Label htmlFor="result-json" className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  {t('resultLabel')}
                </Label>
                <div className="relative">
                  <Textarea
                    id="result-json"
                    value={resultText}
                    readOnly
                    rows={10}
                    className="w-full p-2 bg-gray-100 dark:bg-gray-700 border-2 border-blue-300 dark:border-blue-600 rounded-md transition-all duration-300 ease-in-out"
                    aria-label={t('resultAriaLabel')}
                  />
                  <div className="absolute top-2 right-2 flex flex-wrap gap-2">
                    <Button onClick={handleCopy} disabled={!resultText} className="bg-blue-500 hover:bg-blue-600 text-white">
                      {isCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                      {isCopied ? t('copiedButton') : t('copyButton')}
                    </Button>
                
                    <Button onClick={handleDownload} disabled={!resultText} className="bg-green-500 hover:bg-green-600 text-white">
                      <Download className="h-4 w-4 mr-2" />
                      {t('downloadButton')}
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('charactersLabel')}: {stats.outputLength} | {t('linesLabel')}: {stats.outputLines}
                </p>
              </div>

              <Tabs defaultValue="stats">
                <TabsList className="grid w-full grid-cols-1 bg-purple-100 dark:bg-purple-900">
                  <TabsTrigger value="stats" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                    {t('jsonStatisticsTab')}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="stats" className="p-4 bg-white dark:bg-gray-800 rounded-b-lg shadow-md overflow-x-auto">
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">{t('inputLengthLabel')}</TableCell>
                        <TableCell>{stats.inputLength} {t('charactersLabel')}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">{t('outputLengthLabel')}</TableCell>
                        <TableCell>{stats.outputLength} {t('charactersLabel')}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">{t('inputLinesLabel')}</TableCell>
                        <TableCell>{stats.inputLines}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">{t('outputLinesLabel')}</TableCell>
                        <TableCell>{stats.outputLines}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">{t('sizeDifferenceLabel')}</TableCell>
                        <TableCell>{stats.outputLength - stats.inputLength} {t('charactersLabel')}</TableCell>
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