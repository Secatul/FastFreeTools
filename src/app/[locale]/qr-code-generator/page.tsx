'use client'

import React, { useState, useEffect } from "react"
import Head from "next/head"
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import ShareButton from "../components/share-button"
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
import { Home, HelpCircle, Moon, Sun, Download, Save, Trash2, Upload, RefreshCw } from "lucide-react"
import { QRCodeCanvas } from "qrcode.react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DOMPurify from 'isomorphic-dompurify'
import { useTranslations } from 'next-intl'

function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input)
}

interface SavedQRCode {
  id: string
  label: string
  value: string
  fgColor: string
  bgColor: string
  errorCorrectionLevel: string
  size: number
}

export default function QRCodeGenerator() {
  const [qrValue, setQrValue] = useState("https://example.com")
  const [qrSize, setQrSize] = useState(256)
  const [fgColor, setFgColor] = useState("#000000")
  const [bgColor, setBgColor] = useState("#ffffff")
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState("M")
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [savedQRCodes, setSavedQRCodes] = useState<SavedQRCode[]>([])
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const t = useTranslations('QRCodeGenerator')
  const pathname = usePathname()

  if (!pathname) {
    return null
  }

  const locale = pathname.split("/")[1]
  const shareUrl = `https://fastfreetools.com/${locale}/qr-code-generator`
  const shareTitle = t('shareTitle')

  useEffect(() => {
    const savedCodes = localStorage.getItem('savedQRCodes')
    if (savedCodes) {
      setSavedQRCodes(JSON.parse(savedCodes))
    }
  }, [])

  useEffect(() => {
    if (logoFile) {
      const reader = new FileReader()
      reader.onload = (e) => setLogoUrl(e.target?.result as string)
      reader.readAsDataURL(logoFile)
    }
  }, [logoFile])

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && ["image/png", "image/jpeg", "image/gif"].includes(file.type)) {
      setLogoFile(file)
    } else {
      toast({
        title: t('invalidFileTypeTitle'),
        description: t('invalidFileTypeDescription'),
        variant: "destructive",
      })
    }
  }

  const downloadQRCode = (format: 'png' | 'jpg') => {
    const canvas = document.getElementById("qr-code") as HTMLCanvasElement
    if (canvas) {
      const dataUrl = canvas.toDataURL(`image/${format}`)
      const link = document.createElement("a")
      link.download = `qrcode.${format}`
      link.href = dataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast({
        title: t('qrCodeDownloadedTitle'),
        description: t('qrCodeDownloadedDescription', { format: format.toUpperCase() }),
      })
    }
  }

  const MAX_SNIPPETS = 30;

  const saveQRCode = () => {
    if (savedQRCodes.length >= MAX_SNIPPETS) {
      toast({
        title: t('toastLimitReachedTitle'),
        description: t('toastLimitReachedDescription', { max: MAX_SNIPPETS }),
        variant: "destructive",
      });
      return;
    }

    const newQRCode: SavedQRCode = {
      id: Date.now().toString(),
      label: qrValue,
      value: qrValue,
      fgColor,
      bgColor,
      errorCorrectionLevel,
      size: qrSize,
    };
    const updatedQRCodes = [...savedQRCodes, newQRCode];
    setSavedQRCodes(updatedQRCodes);
    localStorage.setItem('savedQRCodes', JSON.stringify(updatedQRCodes));
    toast({
      title: t('qrCodeSavedTitle'),
      description: t('qrCodeSavedDescription'),
    });
  };


  const deleteSavedQRCode = (id: string) => {
    const updatedQRCodes = savedQRCodes.filter((qr) => qr.id !== id)
    setSavedQRCodes(updatedQRCodes)
    localStorage.setItem('savedQRCodes', JSON.stringify(updatedQRCodes))
    toast({
      title: t('qrCodeDeletedTitle'),
      description: t('qrCodeDeletedDescription'),
      variant: "destructive",
    })
  }

  const loadSavedQRCode = (qrCode: SavedQRCode) => {
    setQrValue(qrCode.value)
    setFgColor(qrCode.fgColor)
    setBgColor(qrCode.bgColor)
    setErrorCorrectionLevel(qrCode.errorCorrectionLevel)
    setQrSize(qrCode.size)
    toast({
      title: t('qrCodeLoadedTitle'),
      description: t('qrCodeLoadedDescription'),
    })
  }

  const generateRandomQRCode = () => {
    const randomValue = `https://example.com/${Math.random().toString(36).substring(7)}`
    setQrValue(randomValue)
    setFgColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    setBgColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
    setErrorCorrectionLevel(['L', 'M', 'Q', 'H'][Math.floor(Math.random() * 4)] as 'L' | 'M' | 'Q' | 'H')
    setQrSize(Math.floor(Math.random() * (512 - 128 + 1) + 128))
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
        <link rel="alternate" hrefLang="en" href="https://fastfreetools.com/en/qr-code-generator" />
        <link rel="alternate" hrefLang="es" href="https://fastfreetools.com/es/qr-code-generator" />
        <link rel="alternate" hrefLang="fr" href="https://fastfreetools.com/fr/qr-code-generator" />
        <link rel="alternate" hrefLang="de" href="https://fastfreetools.com/de/qr-code-generator" />
        <link rel="alternate" hrefLang="x-default" href="https://fastfreetools.com/qr-code-generator" />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="qr-value" className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('qrContentLabel')}</Label>
                    <Input
                      id="qr-value"
                      value={qrValue}
                      onChange={(e) => setQrValue(sanitizeInput(e.target.value))}
                      placeholder={t('qrContentPlaceholder')}
                      className="border-2 border-purple-300 dark:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="qr-size" className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('qrSizeLabel')}</Label>
                    <Input
                      id="qr-size"
                      type="number"
                      value={qrSize}
                      onChange={(e) => setQrSize(Number(e.target.value))}
                      min={128}
                      max={1024}
                      className="border-2 border-purple-300 dark:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fg-color" className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('foregroundColorLabel')}</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="fg-color"
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="w-12 h-12 p-1 rounded-md"
                      />
                      <Input
                        type="text"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="flex-grow border-2 border-purple-300 dark:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bg-color" className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('backgroundColorLabel')}</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="bg-color"
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-12 h-12 p-1 rounded-md"
                      />
                      <Input
                        type="text"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="flex-grow border-2 border-purple-300 dark:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="error-correction" className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('errorCorrectionLabel')}</Label>
                    <Select value={errorCorrectionLevel} onValueChange={setErrorCorrectionLevel}>
                      <SelectTrigger id="error-correction" className="border-2 border-purple-300 dark:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                        <SelectValue placeholder={t('selectErrorCorrectionPlaceholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="L">{t('errorCorrectionLow')}</SelectItem>
                        <SelectItem value="M">{t('errorCorrectionMedium')}</SelectItem>
                        <SelectItem value="Q">{t('errorCorrectionQuartile')}</SelectItem>
                        <SelectItem value="H">{t('errorCorrectionHigh')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logo-upload" className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('uploadLogoLabel')}</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="logo-upload"
                        type="file"
                        onChange={handleLogoUpload}
                        accept="image/*"
                        className="border-2 border-purple-300 dark:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      {logoUrl && (
                        <img src={logoUrl} alt={t('uploadedLogoAlt')} className="w-10 h-10 object-contain" />
                      )}
                    </div>
                  </div>
                  <Button onClick={generateRandomQRCode} className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {t('generateRandomQRCodeButton')}
                  </Button>
                </section>

                <section className="space-y-4">
                  <div className="flex justify-center items-center bg-white dark:bg-gray-700 p-4 rounded-lg shadow-inner">
                    <QRCodeCanvas
                      id="qr-code"
                      value={qrValue}
                      size={qrSize}
                      fgColor={fgColor}
                      bgColor={bgColor}
                      level={errorCorrectionLevel as "L" | "M" | "Q" | "H"}
                      imageSettings={
                        logoUrl
                          ? {
                            src: logoUrl,
                            x: undefined,
                            y: undefined,
                            height: 24,
                            width: 24,
                            excavate: true,
                          }
                          : undefined
                      }
                    />
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Button onClick={() => downloadQRCode("png")} className="bg-blue-500 hover:bg-blue-600 text-white">
                      <Download className="h-4 w-4 mr-2" />
                      {t('downloadPNGButton')}
                    </Button>
                    <Button onClick={saveQRCode} className="bg-purple-500 hover:bg-purple-600 text-white">
                      <Save className="h-4 w-4 mr-2" />
                      {t('saveQRCodeButton')}
                    </Button>
                  </div>
                </section>
              </div>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('qrCodeAnalysisTitle')}</h2>
                <Tabs defaultValue="info">
                  <TabsList className="grid w-full grid-cols-2 bg-purple-100 dark:bg-purple-900">
                    <TabsTrigger value="info" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">{t('informationTab')}</TabsTrigger>
                    <TabsTrigger value="compatibility" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">{t('compatibilityTab')}</TabsTrigger>
                  </TabsList>
                  <TabsContent value="info" className="p-4 bg-white dark:bg-gray-800 rounded-b-lg shadow-md">
                    <div className="space-y-2">
                      <p><strong>{t('contentTypeLabel')}:</strong> {qrValue.startsWith('http') ? t('contentTypeURL') : t('contentTypeText')}</p>
                      <p><strong>{t('characterCountLabel')}:</strong> {qrValue.length}</p>
                      <p><strong>{t('errorCorrectionLabel')}:</strong> {errorCorrectionLevel === 'L' ? t('errorCorrectionLow') : errorCorrectionLevel === 'M' ? t('errorCorrectionMedium') : errorCorrectionLevel === 'Q' ? t('errorCorrectionQuartile') : t('errorCorrectionHigh')}</p>
                      <p><strong>{t('estimatedScanDistanceLabel')}:</strong> {t('estimatedScanDistanceValue', { distance: Math.round(qrSize / 10) })}</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="compatibility" className="p-4 bg-white dark:bg-gray-800 rounded-b-lg shadow-md">
                    <div className="space-y-2">
                      <p><strong>{t('smartphoneCompatibilityLabel')}:</strong> {t('smartphoneCompatibilityValue')}</p>
                      <p><strong>{t('desktopWebcamCompatibilityLabel')}:</strong> {t('desktopWebcamCompatibilityValue')}</p>
                      <p><strong>{t('printCompatibilityLabel')}:</strong> {t('printCompatibilityValue')}</p>
                      <p><strong>{t('scanSpeedLabel')}:</strong> {t('scanSpeedValue')}</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </section>

              {savedQRCodes.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('savedQRCodesTitle')}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {savedQRCodes.map((qrCode) => (
                      <div key={qrCode.id} className="border border-purple-300 dark:border-purple-600 p-4 rounded-lg space-y-2 bg-white dark:bg-gray-800 shadow-md">
                        <QRCodeCanvas
                          value={qrCode.value}
                          size={128}
                          fgColor={qrCode.fgColor}
                          bgColor={qrCode.bgColor}
                          level={qrCode.errorCorrectionLevel as "L" | "M" | "Q" | "H"}
                        />
                        <p className="text-sm truncate">{qrCode.label}</p>
                        <div className="flex justify-between">
                          <Button size="sm" onClick={() => loadSavedQRCode(qrCode)} className="bg-blue-500 hover:bg-blue-600 text-white">
                            <Upload className="h-4 w-4 mr-2" />
                            {t('loadButton')}
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteSavedQRCode(qrCode.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            {t('deleteButton')}
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