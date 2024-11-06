'use client'

import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useTheme } from "next-themes"
import { Home, HelpCircle, Moon, Sun, Copy, Save, Trash2, Play, AlertTriangle } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useTranslations } from 'next-intl'
import { useMediaQuery } from 'react-responsive'

interface CommonPattern {
  [key: string]: RegExp
}

const commonPatterns: CommonPattern = {
  "Email": /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  "URL": /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  "Phone Number": /^(\+\d{1,2}\s)?\d{3}[\s.-]?\d{3}[\s.-]?\d{4}$/,
  "Date (YYYY-MM-DD)": /^\d{4}-\d{2}-\d{2}$/,
  "Strong Password": /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
}

function sanitizeInput(input: string): string {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
}

function highlightMatches(text: string, regex: RegExp): React.ReactNode {
  if (!regex) return text
  const parts = text.split(regex)
  const matches = text.match(regex)
  if (!matches) return text
  return parts.reduce((arr: React.ReactNode[], part, i) => {
    arr.push(part)
    if (i < matches.length) {
      arr.push(<mark key={i} className="bg-yellow-200 dark:bg-yellow-700">{matches[i]}</mark>)
    }
    return arr
  }, [])
}

function explainRegex(regex: string): string {
  let explanation = []
  if (regex.startsWith('^')) explanation.push("Starts with")
  if (regex.endsWith('$')) explanation.push("Ends with")
  if (regex.includes('[a-z]')) explanation.push("Lowercase letters")
  if (regex.includes('[A-Z]')) explanation.push("Uppercase letters")
  if (regex.includes('\\d')) explanation.push("Digits")
  if (regex.includes('.')) explanation.push("Any character")
  if (regex.includes('*')) explanation.push("Zero or more occurrences")
  if (regex.includes('+')) explanation.push("One or more occurrences")
  if (regex.includes('?')) explanation.push("Zero or one occurrence")
  return explanation.join(', ')
}

interface SavedPattern {
  regex: string
  flags: string
}

export default function RegexTester() {
  const [regex, setRegex] = useState('')
  const [flags, setFlags] = useState('g')
  const [testString, setTestString] = useState('')
  const [multilineInput, setMultilineInput] = useState('')
  const [matches, setMatches] = useState<string[]>([])
  const [savedPatterns, setSavedPatterns] = useState<SavedPattern[]>([])
  const [activeTab, setActiveTab] = useState('common-patterns')
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const t = useTranslations('RegexTester')
  const pathname = usePathname()
  const isMobile = useMediaQuery({ query: '(max-width: 640px)' })


  const locale = pathname ? pathname.split("/")[1] : "en";
  const shareUrl = `https://fastfreetools.com/${locale}/regex-tester`
  const shareTitle = t('shareTitle')

  useEffect(() => {
    const savedPatterns = localStorage.getItem('savedPatterns')
    if (savedPatterns) {
      setSavedPatterns(JSON.parse(savedPatterns))
    }
  }, [])

  useEffect(() => {
    try {
      const sanitizedRegex = sanitizeInput(regex)
      const sanitizedTestString = sanitizeInput(testString)
      const re = new RegExp(sanitizedRegex, flags)
      const newMatches = sanitizedTestString.match(re) || []
      setMatches(newMatches)
    } catch (error) {
      console.error('Invalid regex:', error)
    }
  }, [regex, flags, testString])

  const MAX_SNIPPETS = 30;

  const handleSavePattern = () => {
    if (!regex.trim()) {
      toast({
        title: t('toastEmptySnippetTitle'),
        description: t('toastEmptySnippetDescription'),
        variant: "destructive",
      });
      return;
    }

    if (savedPatterns.length >= MAX_SNIPPETS) {
      toast({
        title: t('toastLimitReachedTitle'),
        description: t('toastLimitReachedDescription', { max: MAX_SNIPPETS }),
        variant: "destructive",
      });
      return;
    }

    const newPattern = { regex, flags };
    const updatedPatterns = [...savedPatterns, newPattern];
    setSavedPatterns(updatedPatterns);
    localStorage.setItem('savedPatterns', JSON.stringify(updatedPatterns));
    toast({
      title: t('patternSavedTitle'),
      description: t('patternSavedDescription'),
    });
  };



  const handleLoadPattern = (pattern: SavedPattern) => {
    setRegex(pattern.regex)
    setFlags(pattern.flags)
    toast({
      title: t('patternLoadedTitle'),
      description: t('patternLoadedDescription'),
    })
  }

  const handleDeletePattern = (index: number) => {
    const updatedPatterns = savedPatterns.filter((_, i) => i !== index)
    setSavedPatterns(updatedPatterns)
    localStorage.setItem('savedPatterns', JSON.stringify(updatedPatterns))
    toast({
      title: t('patternDeletedTitle'),
      description: t('patternDeletedDescription'),
      variant: "destructive"
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: t('copiedToClipboardTitle'),
      description: t('copiedToClipboardDescription'),
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

        <meta property="og:image" content="https://www.fastfreetools.com/opengraph-image.png" />
        <meta name="twitter:image" content="https://fastfreetools.com/opengraph-image.png" />
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="alternate" hrefLang="en" href="https://fastfreetools.com/en/regex-tester" />
        <link rel="alternate" hrefLang="es" href="https://fastfreetools.com/es/regex-tester" />
        <link rel="alternate" hrefLang="fr" href="https://fastfreetools.com/fr/regex-tester" />
        <link rel="alternate" hrefLang="de" href="https://fastfreetools.com/de/regex-tester" />
        <link rel="alternate" hrefLang="x-default" href="https://fastfreetools.com/regex-tester" />
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

            <div className="p-6 space-y-6">
              <section className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-grow">
                    <Label htmlFor="regex-input" className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('regexPatternLabel')}</Label>
                    <div className="flex mt-1">
                      <Input
                        id="regex-input"
                        value={regex}
                        onChange={(e) => setRegex(sanitizeInput(e.target.value))}
                        className="flex-grow border-2 border-purple-300 dark:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder={t('regexPatternPlaceholder')}
                      />
                      <Select value={flags} onValueChange={setFlags}>
                        <SelectTrigger className="w-[180px] ml-2 border-2 border-purple-300 dark:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                          <SelectValue placeholder={t('selectFlagsPlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="g">{t('globalFlag')}</SelectItem>
                          <SelectItem value="i">{t('caseInsensitiveFlag')}</SelectItem>
                          <SelectItem value="m">{t('multilineFlag')}</SelectItem>
                          <SelectItem value="gi">{t('globalCaseInsensitiveFlag')}</SelectItem>
                          <SelectItem value="gm">{t('globalMultilineFlag')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Label className="text-lg  font-semibold text-gray-700 dark:text-gray-300">{t('actionsLabel')}</Label>
                    <div className="flex mt-1 space-x-2">
                      <Button onClick={handleSavePattern} className="bg-green-500 hover:bg-green-600 text-white">
                        <Save className="h-4 w-4 mr-2" />
                        {t('saveButtonText')}
                      </Button>
                      <Button onClick={() => copyToClipboard(regex)} className="bg-blue-500 hover:bg-blue-600 text-white">
                        <Copy className="h-4 w-4 mr-2" />
                        {t('copyButtonText')}
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="test-string" className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('testStringLabel')}</Label>
                  <Textarea
                    id="test-string"
                    value={testString}
                    onChange={(e) => setTestString(sanitizeInput(e.target.value))}
                    className="mt-1 w-full border-2 border-purple-300 dark:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder={t('testStringPlaceholder')}
                    rows={4}
                  />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('matchesLabel')}</h2>
                  <div className="mt-1 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg min-h-[100px]">
                    {highlightMatches(testString, new RegExp(regex, flags))}
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {t('matchesFound', { count: matches.length })}
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('toolsResourcesTitle')}</h2>

                {isMobile ? (
                  <div className="space-y-4">
                    <Select value={activeTab} onValueChange={setActiveTab}>
                      <SelectTrigger className="w-full border-2 border-purple-300 dark:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                        <SelectValue placeholder={t('selectTabPlaceholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="common-patterns">{t('commonPatternsTab')}</SelectItem>
                        <SelectItem value="explanation">{t('explanationTab')}</SelectItem>
                        <SelectItem value="cheat-sheet">{t('cheatSheetTab')}</SelectItem>
                      </SelectContent>
                    </Select>

                    {activeTab === 'common-patterns' && (
                      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(commonPatterns).map(([name, pattern]) => (
                            <Button
                              key={name}
                              onClick={() => setRegex(pattern.toString().slice(1, -1))}
                              className="bg-purple-500 hover:bg-purple-600 text-white"
                            >
                              {t(name as keyof typeof commonPatterns)}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                    {activeTab === 'explanation' && (
                      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        <p className="text-gray-700 dark:text-gray-300">
                          {regex ? explainRegex(regex) : t('enterRegexForExplanation')}
                        </p>
                      </div>
                    )}
                    {activeTab === 'cheat-sheet' && (
                      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        <div className="grid grid-cols-1 gap-2 text-sm">
                          <div><strong>.</strong> - {t('anyCharacter')}</div>
                          <div><strong>\w</strong> - {t('wordCharacter')}</div>
                          <div><strong>\d</strong> - {t('digit')}</div>
                          <div><strong>\s</strong> - {t('whitespaceCharacter')}</div>
                          <div><strong>^</strong> - {t('startOfString')}</div>
                          <div><strong>$</strong> - {t('endOfString')}</div>
                          <div><strong>*</strong> - {t('zeroOrMore')}</div>
                          <div><strong>+</strong> - {t('oneOrMore')}</div>
                          <div><strong>?</strong> - {t('zeroOrOne')}</div>
                          <div><strong>{'{n}'}</strong> - {t('exactlyN')}</div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Tabs defaultValue="common-patterns">
                    <TabsList className="grid w-full grid-cols-3 bg-purple-100 dark:bg-purple-900">
                      <TabsTrigger value="common-patterns" className="data-[state=active]:bg-white  dark:data-[state=active]:bg-gray-800">{t('commonPatternsTab')}</TabsTrigger>
                      <TabsTrigger value="explanation" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">{t('explanationTab')}</TabsTrigger>
                      <TabsTrigger value="cheat-sheet" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">{t('cheatSheetTab')}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="common-patterns" className="p-4 bg-white dark:bg-gray-800 rounded-b-lg shadow-md">
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(commonPatterns).map(([name, pattern]) => (
                          <Button
                            key={name}
                            onClick={() => setRegex(pattern.toString().slice(1, -1))}
                            className="bg-purple-500 hover:bg-purple-600 text-white"
                          >
                            {t(name as keyof typeof commonPatterns)}
                          </Button>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="explanation" className="p-4 bg-white dark:bg-gray-800 rounded-b-lg shadow-md">
                      <p className="text-gray-700 dark:text-gray-300">
                        {regex ? explainRegex(regex) : t('enterRegexForExplanation')}
                      </p>
                    </TabsContent>
                    <TabsContent value="cheat-sheet" className="p-4 bg-white dark:bg-gray-800 rounded-b-lg shadow-md">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><strong>.</strong> - {t('anyCharacter')}</div>
                        <div><strong>\w</strong> - {t('wordCharacter')}</div>
                        <div><strong>\d</strong> - {t('digit')}</div>
                        <div><strong>\s</strong> - {t('whitespaceCharacter')}</div>
                        <div><strong>^</strong> - {t('startOfString')}</div>
                        <div><strong>$</strong> - {t('endOfString')}</div>
                        <div><strong>*</strong> - {t('zeroOrMore')}</div>
                        <div><strong>+</strong> - {t('oneOrMore')}</div>
                        <div><strong>?</strong> - {t('zeroOrOne')}</div>
                        <div><strong>{'{n}'}</strong> - {t('exactlyN')}</div>
                      </div>
                    </TabsContent>
                  </Tabs>
                )}
              </section>

              {savedPatterns.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('savedPatternsTitle')}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedPatterns.map((pattern, index) => (
                      <div key={index} className="border border-purple-300 dark:border-purple-600 p-4 rounded-lg space-y-2 bg-white dark:bg-gray-800 shadow-md">
                        <p className="font-mono text-sm text-gray-700 dark:text-gray-300">{pattern.regex}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('flagsLabel')}: {pattern.flags}</p>
                        <div className="flex justify-between">
                          <Button onClick={() => handleLoadPattern(pattern)} className="bg-blue-500 hover:bg-blue-600 text-white">
                            <Play className="h-4 w-4 mr-2" />
                            {t('loadButtonText')}
                          </Button>
                          <Button variant="destructive" onClick={() => handleDeletePattern(index)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            {t('deleteButtonText')}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section className="space-y-4">
                <h2 className="flex items-center text-2xl font-bold text-gray-800 dark:text-white">{t('multilineTestTitle')}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100">
                        <HelpCircle className="h-5 w-5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t('multilineTestTitle')}</DialogTitle>
                        <DialogDescription>
                          {t('multilineTestTooltip')}
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </h2>
                <Textarea
                  value={multilineInput}
                  onChange={(e) => setMultilineInput(sanitizeInput(e.target.value))}
                  className="w-full border-2 border-purple-300 dark:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder={t('multilineTestPlaceholder')}
                  rows={6}
                />
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  {multilineInput.split('\n').map((line, index) => (
                    <div key={index} className="mb-2">
                      {highlightMatches(line, new RegExp(regex, flags))}
                    </div>
                  ))}
                </div>
              </section>

              <section className="mt-8 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <h2 className="flex items-center text-xl font-bold text-yellow-800 dark:text-yellow-200 mb-2">
                  <AlertTriangle className="h-6 w-6 mr-2" />
                  {t('safetyNoteTitle')}
                </h2>
                <p className="text-yellow-700 dark:text-yellow-300">
                  {t('safetyNoteContent')}
                </p>
              </section>
            </div>
          </main>
        </div>
      </TooltipProvider>
    </>
  )
}
