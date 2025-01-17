'use client'

import React, { useState, useEffect, useCallback } from "react"
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import Head from 'next/head'
import Link from "next/link"
import { useTheme } from "next-themes"
import TurndownService from "turndown"
import Prism from "prismjs"
import DOMPurify from 'isomorphic-dompurify'
import "prismjs/components/prism-markup"
import "prismjs/components/prism-markdown"
import "prismjs/themes/prism.css"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
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
import { Home, HelpCircle, Moon, Sun, Copy, Download, Share2 } from 'lucide-react'
import ShareButton from "../components/share-button"
import HTMLToMarkdownHelper from './html-to-markdown-helper'

export default function HTMLToMarkdownConverter() {
  const t = useTranslations('HTMLToMarkdown')
  const pathname = usePathname()
  const [html, setHtml] = useState<string>("")
  const [cleanHtml, setCleanHtml] = useState<string>("")
  const [markdown, setMarkdown] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [isCopied, setIsCopied] = useState<boolean>(false)
  const [showRenderedHtml, setShowRenderedHtml] = useState<boolean>(true)
  const [showCleanHtml, setShowCleanHtml] = useState<boolean>(true)
  const [showMarkdown, setShowMarkdown] = useState<boolean>(true)
  const { theme, setTheme } = useTheme()

  const locale = pathname ? pathname.split("/")[1] : "en"
  const turndownService = new TurndownService()

  const shareUrl = `https://fastfreetools.com/${locale}/html-to-markdown`
  const shareTitle = t('Share_Title')

  const convertHtml = useCallback((input: string) => {
    try {
      const sanitizedInput = sanitizeHtmlInput(input)
      const cleanedHtml = cleanHtmlContent(sanitizedInput)
      setCleanHtml(cleanedHtml)

      const result = turndownService.turndown(cleanedHtml)
      setMarkdown(result)
      setError("")
    } catch (err) {
      setError(t('Error_Message'))
      setCleanHtml("")
      setMarkdown("")
    }
  }, [t])

  useEffect(() => {
    convertHtml(html)
  }, [html, convertHtml])

  useEffect(() => {
    Prism.highlightAll()
  }, [cleanHtml, markdown])

  const sanitizeHtmlInput = (input: string) => DOMPurify.sanitize(input)

  const cleanHtmlContent = (input: string) => {
    let cleaned = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    cleaned = cleaned.replace(/<([a-z][a-z0-9]*)[^>]*?(href|src)="[^"]*"[^>]*>/gi, (match, p1, p2) => {
      const attr = match.match(new RegExp(`${p2}="[^"]*"`, "i"))
      return `<${p1}${attr ? " " + attr[0] : ""}>`
    })
    return cleaned
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error(t('Copy_Failed'), err)
    }
  }

  const handleDownload = (content: string, filename: string) => {
    const sanitizedContent = DOMPurify.sanitize(content)
    const blob = new Blob([sanitizedContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <Head>
        <title>{t('Page_Title')}</title>
        <meta name="description" content={t('Page_Description')} />
        <meta name="keywords" content={t('Page_Keywords')} />
        <meta name="author" content="Fast Free Tools" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={`https://fastfreetools.com/${locale}/html-to-markdown`} />
        <meta property="og:title" content={t('Page_Title')} />
        <meta property="og:description" content={t('OG_Description')} />
        <meta property="og:image" content="https://www.fastfreetools.com/opengraph-image.png" />
        <meta name="twitter:image" content="https://fastfreetools.com/opengraph-image.png" />
        <meta property="og:url" content={`https://fastfreetools.com/${locale}/html-to-markdown`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('Page_Title')} />
        <meta name="twitter:description" content={t('OG_Description')} />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
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
                          <Button variant="outline" size="icon" className="bg-white/10 hover:bg-white/20 text-white">
                            <HelpCircle className="h-5 w-5" />
                          </Button>
                        </DialogTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('Help_Tooltip')}</p>
                      </TooltipContent>
                    </Tooltip>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t('About_Title')}</DialogTitle>
                        <DialogDescription>
                          <p className="mt-2">{t('About_Description')}</p>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" asChild className="bg-white/10 hover:bg-white/20 text-white">
                        <Link href={`/${locale}`}>
                          <Home className="h-5 w-5" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('Home')}</p>
                    </TooltipContent>
                  </Tooltip>

                  <ShareButton shareUrl={shareUrl} shareTitle={shareTitle} tooltipText={t('Share_Tool')} />

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="bg-white/10 hover:bg-white/20 text-white"
                      >
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('Toggle_Theme')}</p>
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
              <div className="space-y-2">
                <Label htmlFor="html-input">{t('HTML_Input')}</Label>
                <Textarea
                  id="html-input"
                  value={html}
                  onChange={(e) => setHtml(sanitizeHtmlInput(e.target.value))}
                  placeholder={t('Text_Input_Placeholder')}
                  rows={10}
                  className="font-mono"
                  aria-label={t('HTML_Input_Label')}
                />
              </div>

              {error && (
                <p className="text-red-500 bg-red-100 dark:bg-red-900 p-3 rounded-md">{error}</p>
              )}

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-rendered-html"
                    checked={showRenderedHtml}
                    onCheckedChange={setShowRenderedHtml}
                    className="data-[state=checked]:bg-blue-500"
                  />
                  <Label htmlFor="show-rendered-html">{t('Show_Rendered_HTML')}</Label>
                </div>
                {showRenderedHtml && (
                  <div className="border p-4 rounded-md bg-white dark:bg-gray-900">
                    <div dangerouslySetInnerHTML={{ __html: sanitizeHtmlInput(html) }} />
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-clean-html"
                    checked={showCleanHtml}
                    onCheckedChange={setShowCleanHtml}
                    className="data-[state=checked]:bg-blue-500"
                  />
                  <Label htmlFor="show-clean-html">{t('Show_Clean_HTML')}</Label>
                </div>
                {showCleanHtml && (
                  <div className="relative">
                    <pre className="language-markup bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-x-auto">
                      <code className="text-sm">{cleanHtml}</code>
                    </pre>
                    <div className="absolute top-2 right-2 space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(cleanHtml)}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        {t('Copy')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(cleanHtml, "clean_html.html")}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {t('Download')}
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-markdown"
                    checked={showMarkdown}
                    onCheckedChange={setShowMarkdown}
                    className="data-[state=checked]:bg-blue-500"
                  />
                  <Label htmlFor="show-markdown">{t('Show_Markdown')}</Label>
                </div>
                {showMarkdown && (
                  <div className="relative">
                    <pre className="language-markdown bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-x-auto">
                      <code className="text-sm">{markdown}</code>
                    </pre>
                    <div className="absolute top-2 right-2 space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(markdown)}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        {t('Copy')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(markdown, "converted.md")}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {t('Download')}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </TooltipProvider>
    </>
  )
}

