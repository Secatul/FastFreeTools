'use client'

import Head from 'next/head';
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import ShareButton from '../components/share-button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTheme } from "next-themes";
import { Home, HelpCircle, Moon, Sun, Copy, Download } from "lucide-react";
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import TurndownService from "turndown";
import Prism from "prismjs";
import DOMPurify from 'isomorphic-dompurify';
import "prismjs/components/prism-markup";
import "prismjs/components/prism-markdown";
import "prismjs/themes/prism.css";

const HTMLToMarkdownConverter: React.FC = () => {
  const t = useTranslations('HTMLToMarkdown');
  const pathname = usePathname();
  const [html, setHtml] = useState<string>("");
  const [cleanHtml, setCleanHtml] = useState<string>("");
  const [markdown, setMarkdown] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [showRenderedHtml, setShowRenderedHtml] = useState<boolean>(true);
  const [showCleanHtml, setShowCleanHtml] = useState<boolean>(true);
  const [showMarkdown, setShowMarkdown] = useState<boolean>(true);
  const { theme, setTheme } = useTheme();
  
  if (!pathname) return null;
  const locale = pathname.split('/')[1];

  const turndownService = new TurndownService();

  const shareUrl = `https://fastfreetools.com/${locale}/html-to-markdown`;
  const shareTitle = t('Share_Title');

  const convertHtml = useCallback((input: string) => {
    try {
      const sanitizedInput = sanitizeHtmlInput(input);
      const cleanedHtml = cleanHtmlContent(sanitizedInput);
      setCleanHtml(cleanedHtml);

      const result = turndownService.turndown(cleanedHtml);
      setMarkdown(result);
      setError("");
    } catch (err) {
      setError(t('Error_Message'));
      setCleanHtml("");
      setMarkdown("");
    }
  }, [t]);

  useEffect(() => {
    convertHtml(html);
  }, [html, convertHtml]);

  useEffect(() => {
    Prism.highlightAll();
  }, [cleanHtml, markdown]);

  const sanitizeHtmlInput = (input: string) => DOMPurify.sanitize(input);

  const cleanHtmlContent = (input: string) => {
    let cleaned = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
    cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");
    cleaned = cleaned.replace(/<([a-z][a-z0-9]*)[^>]*?(href|src)="[^"]*"[^>]*>/gi, (match, p1, p2) => {
      const attr = match.match(new RegExp(`${p2}="[^"]*"`, "i"));
      return `<${p1}${attr ? " " + attr[0] : ""}>`;
    });
    return cleaned;
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error(t('Copy_Failed'), err);
    }
  };

  const handleDownload = (content: string, filename: string) => {
    const sanitizedContent = DOMPurify.sanitize(content);
    const blob = new Blob([sanitizedContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const hreflangs = [
    { locale: 'en', href: "https://fastfreetools.com/en/html-to-markdown" },
    { locale: 'es', href: "https://fastfreetools.com/es/html-to-markdown" },
    { locale: 'pt-br', href: "https://fastfreetools.com/pt-br/html-to-markdown" },
    { locale: 'fr', href: "https://fastfreetools.com/fr/html-to-markdown" },
    { locale: 'de', href: "https://fastfreetools.com/de/html-to-markdown" },
  ];

  return (
    <>
      <Head>
        <title>{t('Page_Title')}</title>
        <meta
          name="description"
          content={t('Page_Description')}
        />
        <meta
          name="keywords"
          content={t('Page_Keywords')}
        />
        <meta name="author" content="Fast Free Tools" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={`https://fastfreetools.com/${locale}/html-to-markdown`} />
        {hreflangs.map(({ locale, href }) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}
        <meta property="og:title" content={t('Page_Title')} />
        <meta
          property="og:description"
          content={t('OG_Description')}
        />
        <meta property="og:image" content="https://fastfreetools.com/preview-image.jpg" />
        <meta property="og:url" content={`https://fastfreetools.com/${locale}/html-to-markdown`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('Page_Title')} />
        <meta
          name="twitter:description"
          content={t('OG_Description')}
        />
        <meta name="twitter:image" content="https://fastfreetools.com/preview-image.jpg" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta charSet="UTF-8" />
      </Head>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{t('Title')}</h1>
          <div className="space-x-2 flex items-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" aria-label={t('Help_Aria_Label')}>
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('About_Tool')}</DialogTitle>
                  <DialogDescription>
                    <p className="mt-2">
                      <strong>{t('Why_Title')}</strong> {t('Why_Text')}
                    </p>
                    <p className="mt-2">
                      <strong>{t('What_Title')}</strong> {t('What_Text')}
                    </p>
                    <p className="mt-2">
                      <strong>{t('How_Title')}</strong> {t('How_Text')}
                    </p>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>

            <Button variant="outline" size="icon" asChild>
              <Link href="/" aria-label={t('Home')}>
                <Home className="h-4 w-4" />
                <span className="sr-only">{t('Home')}</span>
              </Link>
            </Button>

            <ShareButton shareUrl={shareUrl} shareTitle={shareTitle} tooltipText={t('Share_Tool')} />

            <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">{t('Toggle_Theme')}</span>
            </Button>
          </div>
        </header>

        <main>
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

          {error && <p className="text-destructive">{error}</p>}

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="show-rendered-html" checked={showRenderedHtml} onCheckedChange={setShowRenderedHtml} aria-label={t('Show_Rendered_HTML')} />
              <Label htmlFor="show-rendered-html">{t('Show_Rendered_HTML')}</Label>
            </div>
            {showRenderedHtml && <div className="border p-4 rounded-md" dangerouslySetInnerHTML={{ __html: sanitizeHtmlInput(html) }} />}
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="show-clean-html" checked={showCleanHtml} onCheckedChange={setShowCleanHtml} aria-label={t('Show_Clean_HTML')} />
              <Label htmlFor="show-clean-html">{t('Show_Clean_HTML')}</Label>
            </div>
            {showCleanHtml && (
              <div className="relative">
                <pre className="language-markup">
                  <code>{cleanHtml}</code>
                </pre>
                <Button variant="outline" size="sm" className="absolute top-2 right-2" onClick={() => handleCopy(cleanHtml)} aria-label={t('Copy_Clean_HTML')}>
                  <Copy className="h-4 w-4 mr-2" />
                  {t('Copy')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-24"
                  onClick={() => handleDownload(cleanHtml, "clean_html.html")}
                  aria-label={t('Download_Clean_HTML')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {t('Download')}
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="show-markdown" checked={showMarkdown} onCheckedChange={setShowMarkdown} aria-label={t('Show_Markdown')} />
              <Label htmlFor="show-markdown">{t('Show_Markdown')}</Label>
            </div>
            {showMarkdown && (
              <div className="relative">
                <pre className="language-markdown">
                  <code>{markdown}</code>
                </pre>
                <Button variant="outline" size="sm" className="absolute top-2 right-2" onClick={() => handleCopy(markdown)} aria-label={t('Copy_Markdown')}>
                  <Copy className="h-4 w-4 mr-2" />
                  {t('Copy')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-24"
                  onClick={() => handleDownload(markdown, "converted_markdown.md")}
                  aria-label={t('Download_Markdown')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {t('Download')}
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default HTMLToMarkdownConverter;
