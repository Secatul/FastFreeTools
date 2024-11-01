'use client'

import React, { useState, useEffect } from "react"
import Head from "next/head"
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { useTranslations } from 'next-intl'

export default function EnhancedUUIDGenerator() {
  const [uuids, setUuids] = useState<string[]>([])
  const [quantity, setQuantity] = useState(1)
  const [version, setVersion] = useState("4")
  const [uppercase, setUppercase] = useState(false)
  const [removeDashes, setRemoveDashes] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [clearDialogOpen, setClearDialogOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const t = useTranslations('UUIDGenerator')
  const pathname = usePathname()


  const locale = pathname ? pathname.split("/")[1] : "en"; 
  const shareUrl = `https://fastfreetools.com/${locale}/uuid-generator`
  const shareTitle = t('shareTitle')

  useEffect(() => {
    generateUUIDs()
  }, [])

  const generateUUID = (version: string) => {
    let d = new Date().getTime()
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      let r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
    
    if (version === "1") {
      uuid = uuid.substr(0, 8) + '-1' + uuid.substr(9)
    }
    
    return uuid
  }

  const generateUUIDs = () => {
    const newUUIDs = Array(quantity).fill(null).map(() => {
      let uuid = generateUUID(version)
      if (uppercase) uuid = uuid.toUpperCase()
      if (removeDashes) uuid = uuid.replace(/-/g, '')
      return uuid
    })
    setUuids(newUUIDs)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(uuids.join("\n"))
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
      toast({
        title: t('uuidsCopiedTitle'),
        description: t('uuidsCopiedDescription'),
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
    const blob = new Blob([uuids.join("\n")], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "generated_uuids.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast({
      title: t('uuidsDownloadedTitle'),
      description: t('uuidsDownloadedDescription'),
    })
  }

  const handleClearUUIDs = () => {
    setUuids([])
    setClearDialogOpen(false)
    toast({
      title: t('uuidsClearedTitle'),
      description: t('uuidsClearedDescription'),
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
        <meta property="og:title" content={t('ogTitle')} />
        <meta
          property="og:description"
          content={t('ogDescription')}
        />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('twitterTitle')} />
        <meta
          name="twitter:description"
          content={t('twitterDescription')}
        />
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="alternate" hrefLang="en" href="https://fastfreetools.com/en/uuid-generator" />
        <link rel="alternate" hrefLang="es" href="https://fastfreetools.com/es/uuid-generator" />
        <link rel="alternate" hrefLang="fr" href="https://fastfreetools.com/fr/uuid-generator" />
        <link rel="alternate" hrefLang="de" href="https://fastfreetools.com/de/uuid-generator" />
        <link rel="alternate" hrefLang="x-default" href="https://fastfreetools.com/uuid-generator" />
      </Head>
      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 p-4 sm:p-6">
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
                  <div className="w-full sm:w-1/4">
                    <Label htmlFor="quantity">{t('quantityLabel')}</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      max="100"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                      className="mt-1"
                      aria-label={t('quantityAriaLabel')}
                    />
                  </div>
                  <div className="w-full sm:w-1/4">
                    <Label htmlFor="version">{t('versionLabel')}</Label>
                    <Select value={version} onValueChange={(value) => setVersion(value)}>
                      <SelectTrigger id="version" className="mt-1">
                        <SelectValue placeholder={t('selectVersionPlaceholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">{t('version1Option')}</SelectItem>
                        <SelectItem value="4">{t('version4Option')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full sm:w-1/4 flex items-center space-x-2">
                    <Switch
                      id="uppercase"
                      checked={uppercase}
                      onCheckedChange={setUppercase}
                      aria-label={t('uppercaseAriaLabel')}
                    />
                    <Label htmlFor="uppercase">{t('uppercaseLabel')}</Label>
                  </div>
                  <div className="w-full sm:w-1/4 flex items-center space-x-2">
                    <Switch
                      id="remove-dashes"
                      checked={removeDashes}
                      onCheckedChange={setRemoveDashes}
                      aria-label={t('removeDashesAriaLabel')}
                    />
                    <Label htmlFor="remove-dashes">{t('removeDashesLabel')}</Label>
                  </div>
                </div>
                <Button 
                  onClick={generateUUIDs} 
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700" 
                  aria-label={t('generateButtonAriaLabel')}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t('generateButtonText')}
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <Label htmlFor="generated-uuids" className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    {t('generatedUUIDsLabel')}
                  </Label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
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
                          <Button onClick={handleClearUUIDs} variant="destructive">
                            {t('clearButtonText')}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                <div className="relative">
                  <Textarea
                    id="generated-uuids"
                    value={uuids.join("\n")}
                    readOnly
                    rows={10}
                    className="w-full p-2 font-mono text-sm bg-gray-100 dark:bg-gray-700 border-2 border-blue-300 dark:border-blue-600 rounded-md transition-all duration-300 ease-in-out"
                    aria-label={t('generatedUUIDsAriaLabel')}
                  />
                </div>
                <div className="flex justify-end space-x-2 mt-2">
                  <Button onClick={handleCopy} disabled={uuids.length === 0} className="bg-blue-500 hover:bg-blue-600 text-white">
                    {isCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {isCopied ? t('copiedButtonText') : t('copyButtonText')}
                  </Button>
                  <Button onClick={handleDownload} disabled={uuids.length === 0} className="bg-green-500 hover:bg-green-600 text-white">
                    <Download className="h-4 w-4 mr-2" />
                    {t('downloadButtonText')}
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="info">
                <TabsList className="grid w-full grid-cols-1 bg-blue-100 dark:bg-blue-900">
                  <TabsTrigger value="info" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                    <Type className="h-4 w-4 mr-2" />
                    {t('uuidInfoTabLabel')}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="info" className="p-4 bg-white dark:bg-gray-800 rounded-b-lg shadow-md">
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">{t('version1UUIDLabel')}</TableCell>
                        <TableCell>{t('version1UUIDDescription')}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">{t('version4UUIDLabel')}</TableCell>
                        <TableCell>{t('version4UUIDDescription')}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">{t('uuidFormatLabel')}</TableCell>
                        <TableCell>{t('uuidFormatDescription')}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">{t('uuidLengthLabel')}</TableCell>
                        <TableCell>{t('uuidLengthDescription')}</TableCell>
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