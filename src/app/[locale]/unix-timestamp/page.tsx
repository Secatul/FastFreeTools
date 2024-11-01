'use client'

import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useTheme } from "next-themes"
import { Home, HelpCircle, Moon, Sun, RefreshCcw, Calendar, Clock, Globe } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslations } from 'next-intl'

export default function UnixTimestampTool() {
  const [currentTimestamp, setCurrentTimestamp] = useState(Math.floor(Date.now() / 1000))
  const [inputTimestamp, setInputTimestamp] = useState('')
  const [convertedDate, setConvertedDate] = useState('')
  const { theme, setTheme } = useTheme()
  const [funFact, setFunFact] = useState('')
  const [timeZone, setTimeZone] = useState('UTC')
  const t = useTranslations('UnixTimestampTool')
  const pathname = usePathname()

  const locale = pathname ? pathname.split("/")[1] : "en";
  const shareUrl = `https://fastfreetools.com/${locale}/unix-timestamp`
  const shareTitle = t('shareTitle')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    generateFunFact()
  }, [])

  const handleConvert = () => {
    const date = new Date(parseInt(inputTimestamp) * 1000)
    setConvertedDate(date.toLocaleString(undefined, { timeZone }))
  }

  const generateFunFact = () => {
    const facts = [
      t('funFact1'),
      t('funFact2'),
      t('funFact3'),
      t('funFact4'),
      t('funFact5'),
    ]
    setFunFact(facts[Math.floor(Math.random() * facts.length)])
  }

  const calculateTimeDifference = (timestamp1: number, timestamp2: number) => {
    const difference = Math.abs(timestamp1 - timestamp2)
    const days = Math.floor(difference / 86400)
    const hours = Math.floor((difference % 86400) / 3600)
    const minutes = Math.floor((difference % 3600) / 60)
    const seconds = difference % 60
    return t('timeDifference', { days, hours, minutes, seconds })
  }

  return (
    <>
      <Head>
        <title>{t('pageTitle')}</title>
        <meta name="description" content={t('pageDescription')} />
        <meta name="keywords" content={t('pageKeywords')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={shareUrl} />
        <meta property="og:title" content={t('ogTitle')} />
        <meta property="og:description" content={t('ogDescription')} />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="twitter-card" />
        <meta name="twitter:title" content={t('twitterTitle')} />
        <meta name="twitter:description" content={t('twitterDescription')} />
        <meta property="og:image" content="https://www.fastfreetools.com/twitter-card.png" />
        <meta name="twitter:image" content="https://fastfreetools.com/twitter-card.png" />
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="alternate" hrefLang="en" href="https://fastfreetools.com/en/unix-timestamp" />
        <link rel="alternate" hrefLang="es" href="https://fastfreetools.com/es/unix-timestamp" />
        <link rel="alternate" hrefLang="fr" href="https://fastfreetools.com/fr/unix-timestamp" />
        <link rel="alternate" hrefLang="de" href="https://fastfreetools.com/de/unix-timestamp" />
        <link rel="alternate" hrefLang="x-default" href="https://fastfreetools.com/unix-timestamp" />
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
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{t('currentUnixTimestampTitle')}</h2>
                  <div className="text-3xl font-mono">{currentTimestamp}</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('translatesTo', { date: new Date(currentTimestamp * 1000).toLocaleString(undefined, { timeZone }) })}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unix-timestamp" className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    {t('convertUnixTimestampTitle')}
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id="unix-timestamp"
                      type="number"
                      value={inputTimestamp}
                      onChange={(e) => setInputTimestamp(e.target.value)}
                      placeholder={t('enterUnixTimestampPlaceholder')}
                      className="flex-grow"
                    />
                    <Button onClick={handleConvert}>{t('convertButton')}</Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="timezone">{t('timeZoneLabel')}</Label>
                    <select
                      id="timezone"
                      value={timeZone}
                      onChange={(e) => setTimeZone(e.target.value)}
                      className="border rounded p-1"
                    >
                      <option value="UTC">UTC</option>
                      <option value="local">{t('localTimeZone')}</option>
                    </select>
                  </div>
                  {convertedDate && (
                    <p className="text-sm mt-2">
                      {t('convertedDate')}: <span className="font-semibold">{convertedDate}</span>
                    </p>
                  )}
                </div>
              </div>

              <Tabs defaultValue="time-units">
                <TabsList className="grid w-full grid-cols-3 bg-purple-100 dark:bg-purple-900">
                  <TabsTrigger value="time-units" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                    <Clock className="h-4 w-4 mr-2" />
                    {t('timeUnitsTab')}
                  </TabsTrigger>
                  <TabsTrigger value="time-difference" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                    <Calendar className="h-4 w-4 mr-2" />
                    {t('timeDifferenceTab')}
                  </TabsTrigger>
                  <TabsTrigger value="date-to-timestamp" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                    <Globe className="h-4 w-4 mr-2" />
                    {t('dateToTimestampTab')}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="time-units" className="p-4 bg-white dark:bg-gray-800 rounded-b-lg shadow-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('unitColumnHeader')}</TableHead>
                        <TableHead>{t('secondsColumnHeader')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>{t('minute')}</TableCell>
                        <TableCell>60</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{t('hour')}</TableCell>
                        <TableCell>3,600</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{t('day')}</TableCell>
                        <TableCell>86,400</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{t('week')}</TableCell>
                        <TableCell>604,800</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{t('month30Days')}</TableCell>
                        <TableCell>2,592,000</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{t('year365Days')}</TableCell>
                        <TableCell>31,536,000</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TabsContent>
                <TabsContent value="time-difference" className="p-4 bg-white dark:bg-gray-800 rounded-b-lg shadow-md">
                  <div className="space-y-2">
                    <Label htmlFor="timestamp1">{t('firstTimestampLabel')}</Label>
                    <Input
                      id="timestamp1"
                      type="number"
                      placeholder={t('enterFirstUnixTimestampPlaceholder')}
                      onChange={(e) => setInputTimestamp(e.target.value)}
                    />
                    <Label htmlFor="timestamp2">{t('secondTimestampLabel')}</Label>
                    <Input
                      id="timestamp2"
                      type="number"
                      placeholder={t('enterSecondUnixTimestampPlaceholder')}
                      onChange={(e) => {
                        if (inputTimestamp && e.target.value) {
                          const diff = calculateTimeDifference(parseInt(inputTimestamp), parseInt(e.target.value))
                          setConvertedDate(t('difference', { diff }))
                        }
                      }}
                    />
                    {convertedDate && (
                      <p className="text-sm mt-2">
                        {convertedDate}
                      </p>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="date-to-timestamp" className="p-4 bg-white dark:bg-gray-800 rounded-b-lg shadow-md">
                  <div className="space-y-2">
                    <Label htmlFor="date-input">{t('dateToUnixTimestampTitle')}</Label>
                    <Input
                      id="date-input"
                      type="datetime-local"
                      onChange={(e) => {
                        const date = new Date(e.target.value)
                        setInputTimestamp(Math.floor(date.getTime() / 1000).toString())
                      }}
                    />
                    {inputTimestamp && (
                      <p className="text-sm mt-2">
                        {t('unixTimestamp')}: <span className="font-semibold">{inputTimestamp}</span>
                      </p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <div>
                <h2 className="text-xl font-semibold mb-2">{t('funFactTitle')}</h2>
                <p className="text-sm">{funFact}</p>
                <Button variant="outline" size="sm" className="mt-2" onClick={generateFunFact}>
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  {t('newFunFactButton')}
                </Button>
              </div>
            </div>
          </main>
        </div>
      </TooltipProvider>
    </>
  )
}