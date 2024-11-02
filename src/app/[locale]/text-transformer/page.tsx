'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import ShareButton from '../components/share-button'
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTheme } from "next-themes"
import { Home, HelpCircle, Copy, Check, Moon, Sun, ArrowDownUp } from 'lucide-react'
import { useTranslations } from 'next-intl'
import DOMPurify from 'dompurify'

type Mode = 'reverse' | 'scramble' | 'swap'
type ReverseMode = 'characters' | 'words' | 'sentences'
type CaseMode = 'preserve' | 'upper' | 'lower'

export default function TextTransformer() {
  const [inputText, setInputText] = useState('')
  const [resultText, setResultText] = useState('')
  const [mode, setMode] = useState<Mode>('reverse')
  const [reverseMode, setReverseMode] = useState<ReverseMode>('characters')
  const [preserveWhitespace, setPreserveWhitespace] = useState(true)
  const [isCopied, setIsCopied] = useState(false)
  const [fullRandomize, setFullRandomize] = useState(false)
  const [caseMode, setCaseMode] = useState<CaseMode>('preserve')
  const { theme, setTheme } = useTheme()
  const t = useTranslations('TextTransformer')
  const pathname = usePathname()

  const locale = pathname ? pathname.split("/")[1] : "en";
  const shareUrl = `https://fastfreetools.com/${locale}/text-transformer`
  const shareTitle = t('shareTitle')

  const transformText = useCallback(() => {
    let transformed = ''

    const applyTransformation = (text: string) => {
      if (mode === 'reverse') {
        if (reverseMode === 'characters') {
          return preserveWhitespace
            ? text.split('').reverse().join('')
            : text.replace(/\s+/g, '').split('').reverse().join('')
        } else if (reverseMode === 'words') {
          return text.split(' ').reverse().join(' ')
        } else if (reverseMode === 'sentences') {
          return text.match(/[^.!?]+[.!?]+/g)?.reverse().join(' ') || ''
        }
      } else if (mode === 'scramble') {
        return text.split(' ').map(word => {
          if (word.length <= 3 || fullRandomize) {
            return shuffleString(word)
          } else {
            const middle = word.slice(1, -1)
            return word[0] + shuffleString(middle) + word[word.length - 1]
          }
        }).join(' ')
      } else if (mode === 'swap') {
        return text.split(' ').map(word => {
          return word.split('').map((char, index, arr) => {
            if (index % 2 === 0 && index < arr.length - 1) {
              return arr[index + 1]
            } else if (index % 2 === 1) {
              return arr[index - 1]
            }
            return char
          }).join('')
        }).join(' ')
      }
      return text
    }

    transformed = applyTransformation(inputText)

    if (caseMode === 'upper') {
      transformed = transformed.toUpperCase()
    } else if (caseMode === 'lower') {
      transformed = transformed.toLowerCase()
    }

    setResultText(DOMPurify.sanitize(transformed))
  }, [inputText, mode, reverseMode, preserveWhitespace, fullRandomize, caseMode])

  useEffect(() => {
    transformText()
  }, [transformText])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const sanitizedInput = DOMPurify.sanitize(e.target.value)
    setInputText(sanitizedInput)
  }

  const shuffleString = (str: string) => {
    return str.split('').sort(() => Math.random() - 0.5).join('')
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const handleSwap = () => {
    setInputText(resultText)
    setResultText(inputText)
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
        <meta name="author" content="Fast Free Tools" />
        <meta property="og:title" content={t('ogTitle')} />
        <meta
          property="og:description"
          content={t('ogDescription')}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:image" content="https://www.fastfreetools.com/twitter-card.png" />
        <meta name="twitter:image" content="https://fastfreetools.com/twitter-card.png" />
        <meta property="og:site_name" content="Fast Free Tools" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('twitterTitle')} />
        <meta
          name="twitter:description"
          content={t('twitterDescription')}
        />
        <link rel="canonical" href={shareUrl} />
        <meta property="og:image" content="https://www.fastfreetools.com/twitter-card.png" />
        <meta name="twitter:image" content="https://fastfreetools.com/twitter-card.png" />
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="alternate" hrefLang="en" href="https://fastfreetools.com/en/text-transformer" />
        <link rel="alternate" hrefLang="es" href="https://fastfreetools.com/es/text-transformer" />
        <link rel="alternate" hrefLang="fr" href="https://fastfreetools.com/fr/text-transformer" />
        <link rel="alternate" hrefLang="de" href="https://fastfreetools.com/de/text-transformer" />
        <link rel="alternate" hrefLang="x-default" href="https://fastfreetools.com/text-transformer" />
      </Head>

      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-900 dark:to-red-900 p-4 sm:p-6">
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-[1.02]">
            <header className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 text-white p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t('headerTitle')}</h1>
                  <p className="text-blue-100 dark:text-blue-200">
                    {t('headerSubtitle')}
                  </p>
                </div>
                <nav className="flex flex-wrap items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" aria-label={t('helpButtonAriaLabel')} className="bg-white/10 hover:bg-white/20 text-white">
                            <HelpCircle className="h-5 w-5" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{t('aboutDialogTitle')}</DialogTitle>
                            <DialogDescription>
                              <p><strong>{t('aboutDialogWhat')}</strong> {t('aboutDialogWhatContent')}</p>
                              <p><strong>{t('aboutDialogHow')}</strong> {t('aboutDialogHowContent')}</p>
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('helpTooltip')}</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" asChild className="bg-white/10 hover:bg-white/20 text-white">
                        <Link href={`/${locale}`} aria-label={t('homeButtonAriaLabel')}>
                          <Home className="h-4 w-4" />
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
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
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

            <main className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="input-text" className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('inputLabel')}</Label>
                  <Textarea
                    id="input-text"
                    value={inputText}
                    onChange={handleInputChange}
                    placeholder={t('inputPlaceholder')}
                    rows={5}
                    aria-label={t('inputAriaLabel')}
                    className="w-full p-3 text-lg border-2 border-purple-300 dark:border-purple-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ease-in-out"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('characterCount', { count: inputText.length })}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900 dark:to-purple-900 p-4 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="transform-mode" className="text-gray-700 dark:text-gray-300">{t('transformModeLabel')}</Label>
                    <Select value={mode} onValueChange={(value: Mode) => setMode(value)}>
                      <SelectTrigger className="w-full bg-white dark:bg-gray-700" id="transform-mode">
                        <SelectValue placeholder={t('selectModePlaceholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reverse">{t('reverseMode')}</SelectItem>
                        <SelectItem value="scramble">{t('scrambleMode')}</SelectItem>
                        <SelectItem value="swap">{t('swapMode')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {mode === 'reverse' && (
                    <div className="space-y-2">
                      <Label htmlFor="reverse-mode" className="text-gray-700 dark:text-gray-300">{t('reverseByLabel')}</Label>
                      <Select value={reverseMode} onValueChange={(value: ReverseMode) => setReverseMode(value)}>
                        <SelectTrigger className="w-full bg-white dark:bg-gray-700" id="reverse-mode">
                          <SelectValue placeholder={t('selectModePlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="characters">{t('charactersOption')}</SelectItem>
                          <SelectItem value="words">{t('wordsOption')}</SelectItem>
                          <SelectItem value="sentences">{t('sentencesOption')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {mode === 'scramble' && (
                    <div className="flex items-center  space-x-2">
                      <Switch
                        id="full-randomize"
                        checked={fullRandomize}
                        onCheckedChange={setFullRandomize}
                        aria-label={t('fullRandomizeAriaLabel')}
                      />
                      <Label htmlFor="full-randomize" className="text-gray-700 dark:text-gray-300">{t('fullRandomizeLabel')}</Label>
                    </div>
                  )}
                  {mode === 'reverse' && reverseMode === 'characters' && (
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="preserve-whitespace"
                        checked={preserveWhitespace}
                        onCheckedChange={setPreserveWhitespace}
                        aria-label={t('preserveWhitespaceAriaLabel')}
                      />
                      <Label htmlFor="preserve-whitespace" className="text-gray-700 dark:text-gray-300">{t('preserveWhitespaceLabel')}</Label>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900 p-4 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="case-mode" className="text-gray-700 dark:text-gray-300">{t('caseLabel')}</Label>
                    <Select value={caseMode} onValueChange={(value: CaseMode) => setCaseMode(value)}>
                      <SelectTrigger className="w-full bg-white dark:bg-gray-700" id="case-mode">
                        <SelectValue placeholder={t('selectCasePlaceholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="preserve">{t('preserveCase')}</SelectItem>
                        <SelectItem value="upper">{t('uppercaseCase')}</SelectItem>
                        <SelectItem value="lower">{t('lowercaseCase')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <Label htmlFor="result-text" className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('resultLabel')}</Label>
                    <div className="flex flex-wrap gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSwap}
                            aria-label={t('swapButtonAriaLabel')}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            <ArrowDownUp className="h-4 w-4 mr-2" />
                            {t('swapButtonText')}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t('swapTooltip')}</p>
                        </TooltipContent>
                      </Tooltip>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(resultText)}
                        disabled={!resultText}
                        aria-label={t('copyResultAriaLabel')}
                        className="bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-400"
                      >
                        {isCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                        {isCopied ? t('copiedButtonText') : t('copyButtonText')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(`${t('originalLabel')}: ${inputText}\n${t('transformedLabel')}: ${resultText}`)}
                        disabled={!inputText || !resultText}
                        aria-label={t('copyBothAriaLabel')}
                        className="bg-purple-500 hover:bg-purple-600 text-white disabled:bg-gray-400"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        {t('copyBothButtonText')}
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    id="result-text"
                    value={resultText}
                    readOnly
                    rows={5}
                    aria-label={t('resultAriaLabel')}
                    className="w-full p-3 text-lg bg-gray-100 dark:bg-gray-700 border-2 border-blue-300 dark:border-blue-600 rounded-md transition-all duration-300 ease-in-out"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('characterCount', { count: resultText.length })}</p>
                </div>
              </div>
            </main>
          </div>
        </div>
      </TooltipProvider>
    </>
  )
}