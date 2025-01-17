'use client'

import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useTheme } from 'next-themes'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { useTranslations } from 'next-intl'
import { usePathname } from "next/navigation"
import { Sun, Moon, Copy, Home, HelpCircle, Save, Trash2, FileText } from 'lucide-react'
import ShareButton from '../components/share-button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SavedUserAgent {
  id: number
  userAgent: string
  parsedInfo: {
    browser: string
    os: string
    device: string
  }
}

export default function UserAgentAnalyzer() {
  const [userAgent, setUserAgent] = useState<string>('')
  const [parsedInfo, setParsedInfo] = useState<{
    browser: string
    os: string
    device: string
  }>({ browser: '', os: '', device: '' })
  const [savedUserAgents, setSavedUserAgents] = useState<SavedUserAgent[]>([])
  const [activeTab, setActiveTab] = useState<string>('current')
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const pathname = usePathname()
  const t = useTranslations('UserAgentAnalyzer')

  const locale = pathname ? pathname.split("/")[1] : "en"
  const shareUrl = `https://fastfreetools.com/${locale}/user-agent`

  useEffect(() => {
    setUserAgent(window.navigator.userAgent)
    parseUserAgent(window.navigator.userAgent)
    const savedAgents = localStorage.getItem('savedUserAgents')
    if (savedAgents) {
      setSavedUserAgents(JSON.parse(savedAgents))
    }
  }, [])

  const parseUserAgent = (ua: string) => {
    const browserRegexes = [
      /Firefox\/([0-9.]+)/,
      /Chrome\/([0-9.]+)/,
      /Safari\/([0-9.]+)/,
      /Edge\/([0-9.]+)/,
      /MSIE ([0-9.]+)/,
      /Trident\/.*rv:([0-9.]+)/
    ]
    const osRegexes = [
      /Windows NT ([0-9.]+)/,
      /Mac OS X ([0-9._]+)/,
      /Android ([0-9.]+)/,
      /iOS ([0-9._]+)/,
      /Linux/
    ]

    let browser = 'Unknown'
    let os = 'Unknown'
    let device = 'Desktop'

    for (const regex of browserRegexes) {
      const match = ua.match(regex);
      const sourceMatch = regex.source.match(/([A-Za-z]+)/);
      if (match && sourceMatch) {
        browser = `${sourceMatch[1]} ${match[1]}`;
        break;
      }
    }

    for (const regex of osRegexes) {
      const match = ua.match(regex);
      const sourceMatch = regex.source.match(/([A-Za-z]+)/);
      if (match && sourceMatch) {
        os = `${sourceMatch[1]} ${match[1] || ''}`;
        break;
      }
    }


    if (/Mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
      device = 'Mobile'
    }

    setParsedInfo({ browser, os, device })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: t('Toast.Copied_Title'),
        description: t('Toast.Copied_Description'),
      })
    }, (err) => {
      console.error('Could not copy text: ', err)
    })
  }

  const MAX_SAVED_USER_AGENTS = 30;

  const saveUserAgent = () => {
    if (savedUserAgents.length >= MAX_SAVED_USER_AGENTS) {
      toast({
        title: t('Toast.Limit_Reached_Title'),
        description: t('Toast.Limit_Reached_Description', { max: MAX_SAVED_USER_AGENTS }),
        variant: "destructive",
      });
      return;
    }

    const newSavedAgent: SavedUserAgent = {
      id: Date.now(),
      userAgent,
      parsedInfo
    };
    const updatedSavedAgents = [...savedUserAgents, newSavedAgent];
    setSavedUserAgents(updatedSavedAgents);
    localStorage.setItem('savedUserAgents', JSON.stringify(updatedSavedAgents));
    toast({
      title: t('Toast.UserAgent_Saved'),
      description: t('Toast.UserAgent_Saved_Description'),
    });
  };
  const loadUserAgent = (savedAgent: SavedUserAgent) => {
    setUserAgent(savedAgent.userAgent)
    setParsedInfo(savedAgent.parsedInfo)
    toast({
      title: t('Toast.UserAgent_Loaded'),
      description: t('Toast.UserAgent_Loaded_Description'),
    })
  }

  const deleteUserAgent = (id: number) => {
    const updatedSavedAgents = savedUserAgents.filter(agent => agent.id !== id)
    setSavedUserAgents(updatedSavedAgents)
    localStorage.setItem('savedUserAgents', JSON.stringify(updatedSavedAgents))
    toast({
      title: t('Toast.UserAgent_Deleted'),
      description: t('Toast.UserAgent_Deleted_Description'),
      variant: "destructive",
    })
  }

  const hreflangs = [
    { locale: 'en', href: "https://fastfreetools.com/en/user-agent" },
    { locale: 'es', href: "https://fastfreetools.com/es/user-agent" },
    { locale: 'pt-br', href: "https://fastfreetools.com/pt-br/user-agent" },
    { locale: 'de', href: "https://fastfreetools.com/de/user-agent" },
    { locale: 'fr', href: "https://fastfreetools.com/fr/user-agent" },
  ]

  return (
    <>
      <Head>
        <title>{t('Page_Title')}</title>
        <meta name="description" content={t('Page_Description')} />
        <meta name="keywords" content={t('Page_Keywords')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={shareUrl} />

        {hreflangs.map(({ locale, href }) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}

        <meta property="og:title" content={t('Page_Title')} />
        <meta property="og:description" content={t('Page_Description')} />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('Page_Title')} />
        <meta name="twitter:description" content={t('Page_Description')} />
        <meta property="og:image" content="https://www.fastfreetools.com/opengraph-image.png" />
        <meta name="twitter:image" content="https://fastfreetools.com/opengraph-image.png" />
        <meta charSet="UTF-8" />
      </Head>

      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-900 dark:to-red-900 p-4 sm:p-6">
          <main className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-in-out">
            <header className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 text-white p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl sm:text-4xl font-bold">{t('Title')}</h1>
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
                        <p>{t('Help_Text')}</p>
                      </TooltipContent>
                    </Tooltip>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t('About_Tool')}</DialogTitle>
                        <DialogDescription>
                          <p>{t('Why_Text')}</p>
                          <p>{t('What_Text')}</p>
                          <p>{t('How_Text')}</p>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" asChild className="bg-white/10 hover:bg-white/20 text-white">
                        <Link href={`/${locale}`} aria-label="Home">
                          <Home className="h-5 w-5" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('Home')}</p>
                    </TooltipContent>
                  </Tooltip>

                  <ShareButton shareUrl={shareUrl} shareTitle={t('Share_Title')} tooltipText={t('Share_Tool')} />

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        aria-label={t('Toggle_Theme')}
                        className="bg-white/10 hover:bg-white/20 text-white"
                      >
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('Switch_Mode')}</p>
                    </TooltipContent>
                  </Tooltip>
                </nav>
              </div>
            </header>

            <div className="p-6 bg-purple-50 dark:bg-purple-900/20 border-b border-purple-100 dark:border-purple-800">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('Description_Paragraph1')}
              </p>
              <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('Description_Paragraph2')}
              </p>
              <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('Description_Paragraph3')}
              </p>
            </div>

            <div className="p-6 space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                {/* TabsList for larger screens */}
                <div className="hidden sm:block">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="current">{t('Current_UserAgent')}</TabsTrigger>
                    <TabsTrigger value="custom">{t('Custom_UserAgent')}</TabsTrigger>
                  </TabsList>
                </div>

                {/* Select for mobile devices */}
                <div className="block sm:hidden">
                  <Select value={activeTab} onValueChange={setActiveTab}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('Select_Option')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current">{t('Current_UserAgent')}</SelectItem>
                      <SelectItem value="custom">{t('Custom_UserAgent')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <TabsContent value="current">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('Your_UserAgent')}</CardTitle>
                      <CardDescription>{t('Current_Browser_UserAgent')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="relative">
                        <Textarea
                          value={userAgent}
                          readOnly
                          className="w-full h-24 p-2 text-sm font-mono bg-gray-100 dark:bg-gray-700 border-2 border-purple-300 dark:border-purple-600 rounded-md"
                        />
                        <Button
                          onClick={() => copyToClipboard(userAgent)}
                          className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          {t('Copy')}
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">{t('Parsed_Information')}</h3>
                        <p><strong>{t('Browser')}:</strong> {parsedInfo.browser}</p>
                        <p><strong>{t('Operating_System')}:</strong> {parsedInfo.os}</p>
                        <p><strong>{t('Device_Type')}:</strong> {parsedInfo.device}</p>
                      </div>
                      <Button onClick={saveUserAgent} className="w-full bg-green-500 hover:bg-green-600 text-white">
                        <Save className="h-4 w-4 mr-2" />
                        {t('Save_UserAgent')}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="custom">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('Custom_UserAgent')}</CardTitle>
                      <CardDescription>{t('Enter_Custom_UserAgent')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="custom-user-agent">{t('Custom_UserAgent')}</Label>
                        <Textarea
                          id="custom-user-agent"
                          value={userAgent}
                          onChange={(e) => {
                            setUserAgent(e.target.value)
                            parseUserAgent(e.target.value)
                          }}
                          className="mt-1 w-full border-2 border-purple-300 dark:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder={t('UserAgent_Placeholder')}
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">{t('Parsed_Information')}</h3>
                        <p><strong>{t('Browser')}:</strong> {parsedInfo.browser}</p>
                        <p><strong>{t('Operating_System')}:</strong> {parsedInfo.os}</p>
                        <p><strong>{t('Device_Type')}:</strong> {parsedInfo.device}</p>
                      </div>
                      <Button onClick={saveUserAgent} className="w-full bg-green-500 hover:bg-green-600 text-white">
                        <Save className="h-4 w-4 mr-2" />
                        {t('Save_UserAgent')}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {savedUserAgents.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('Saved_UserAgents')}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedUserAgents.map((savedAgent) => (
                      <div key={savedAgent.id} className="border border-purple-300 dark:border-purple-600 p-4 rounded-lg space-y-2 bg-white dark:bg-gray-800 shadow-md">
                        <p className="font-mono text-sm text-gray-700 dark:text-gray-300 truncate">{savedAgent.userAgent}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('Browser')}: {savedAgent.parsedInfo.browser}</p>
                        <div className="flex justify-between">
                          <Button onClick={() => loadUserAgent(savedAgent)} className="bg-blue-500 hover:bg-blue-600 text-white">
                            <FileText className="h-4 w-4 mr-2" />
                            {t('Load')}
                          </Button>
                          <Button variant="destructive" onClick={() => deleteUserAgent(savedAgent.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            {t('Delete')}
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

