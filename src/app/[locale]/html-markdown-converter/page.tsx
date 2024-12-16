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

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <header className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-lg shadow-md mb-6">
          <h1 className="text-3xl font-bold">{t('Title')}</h1>
          <p className="text-purple-100 mt-2">{t('Subtitle')}</p>
          <div className="mt-4 space-x-2 flex items-center">
            <HTMLToMarkdownHelper t={t} />

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="bg-purple-500 hover:bg-purple-600 text-white" asChild>
                    <Link href={`/${locale}`} aria-label={t('Home')}>
                      <Home className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('Home')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <ShareButton shareUrl={shareUrl} shareTitle={shareTitle} tooltipText={t('Share_Tool')} />

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="bg-purple-500 hover:bg-purple-600 text-white">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">{t('Toggle_Theme')}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('Toggle_Theme')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </header>

        <main className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="space-y-2">
            <Label htmlFor="html-input">{t('HTML_Input')}</Label>
            <Textarea
              id="html-input"
              value={html}
              onChange={(e) => setHtml(sanitizeHtmlInput(e.target.value))}
              placeholder={t('Text_Input_Placeholder')}
              rows={10}
              aria-label={t('HTML_Input_Label')}
            />
          </div>

          {error && <p className="text-red-500 bg-red-100 dark:bg-red-900 p-3 rounded-md">{error}</p>}

          <div className="space-y-2 mt-4">
            <div className="flex items-center space-x-2">
              <Switch id="show-rendered-html" checked={showRenderedHtml} onCheckedChange={setShowRenderedHtml} className="data-[state=checked]:bg-purple-500" aria-label={t('Show_Rendered_HTML')} />
              <Label htmlFor="show-rendered-html">{t('Show_Rendered_HTML')}</Label>
            </div>
            {showRenderedHtml && <div className="border p-4 rounded-md" dangerouslySetInnerHTML={{ __html: sanitizeHtmlInput(html) }} />}
          </div>

          <div className="space-y-2 mt-4">
            <div className="flex items-center space-x-2">
              <Switch id="show-clean-html" checked={showCleanHtml} onCheckedChange={setShowCleanHtml} className="data-[state=checked]:bg-purple-500" aria-label={t('Show_Clean_HTML')} />
              <Label htmlFor="show-clean-html">{t('Show_Clean_HTML')}</Label>
            </div>
            {showCleanHtml && (
              <div className="relative">
                <pre className="language-markup bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                  <code className="text-sm">{cleanHtml}</code>
                </pre>
                <div className="absolute top-2 right-2 space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleCopy(cleanHtml)} className="bg-purple-500 hover:bg-purple-600 text-white" aria-label={t('Copy_Clean_HTML')}>
                    <Copy className="h-4 w-4 mr-2" />
                    {t('Copy')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(cleanHtml, "clean_html.html")}
                    className="bg-purple-500 hover:bg-purple-600 text-white"
                    aria-label={t('Download_Clean_HTML')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {t('Download')}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2 mt-4">
            <div className="flex items-center space-x-2">
              <Switch id="show-markdown" checked={showMarkdown} onCheckedChange={setShowMarkdown} className="data-[state=checked]:bg-purple-500" aria-label={t('Show_Markdown')} />
              <Label htmlFor="show-markdown">{t('Show_Markdown')}</Label>
            </div>
            {showMarkdown && (
              <div className="relative">
                <pre className="language-markdown bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                  <code className="text-sm">{markdown}</code>
                </pre>
                <div className="absolute top-2 right-2 space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleCopy(markdown)} className="bg-purple-500 hover:bg-purple-600 text-white" aria-label={t('Copy_Markdown')}>
                    <Copy className="h-4 w-4 mr-2" />
                    {t('Copy')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(markdown, "converted_markdown.md")}
                    className="bg-purple-500 hover:bg-purple-600 text-white"
                    aria-label={t('Download_Markdown')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {t('Download')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  )
}

