"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { ComponentPropsWithoutRef } from 'react';
import type { Components } from 'react-markdown';
import 'github-markdown-css/github-markdown.css';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Head from 'next/head';
import ShareButton from '../components/share-button';
import { useTheme } from "next-themes";
import { useTranslations } from 'next-intl';
import { Home, HelpCircle, Moon, Sun, Bold, Italic, Heading, List, ListOrdered, Link as LinkIcon, Image, Code, Download, Maximize, Minimize } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import Link from 'next/link';
import { usePathname } from "next/navigation";

interface CodeComponentType extends ComponentPropsWithoutRef<'code'> {
  inline?: boolean;
  className?: string;
}

const MarkdownEditor: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>('');
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const t = useTranslations('MarkdownEditor');


  const locale = pathname ? pathname.split("/")[1] : "en";
  const shareUrl = `https://fastfreetools.com/${locale}/markdown-editor`;

  useEffect(() => {
    const savedMarkdown = localStorage.getItem('markdown');
    if (savedMarkdown) {
      setMarkdown(savedMarkdown);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('markdown', markdown);
  }, [markdown]);

  const insertText = (before: string, after: string = '') => {
    const textarea = document.getElementById('markdown-input') as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const newText = text.substring(0, start) + before + text.substring(start, end) + after + text.substring(end);
    setMarkdown(newText);
    textarea.focus();
    textarea.setSelectionRange(start + before.length, end + before.length);
  };

  const handleFormatting = (type: string) => {
    switch (type) {
      case 'bold':
        insertText('**', '**');
        break;
      case 'italic':
        insertText('*', '*');
        break;
      case 'heading':
        insertText('### ');
        break;
      case 'unordered-list':
        insertText('- ');
        break;
      case 'ordered-list':
        insertText('1. ');
        break;
      case 'link':
        insertText('[', '](url)');
        break;
      case 'image':
        insertText('![alt text](', ')');
        break;
      case 'code':
        insertText('`', '`');
        break;
    }
  };

  // const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => setMarkdown(e.target?.result as string);
  //     reader.readAsText(file);
  //   }
  // };

  const handleFileExport = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const wordCount = markdown.trim().split(/\s+/).length;
  const characterCount = markdown.length;

  const hreflangs = [
    { locale: 'en', href: "https://fastfreetools.com/en/markdown-editor" },
    { locale: 'es', href: "https://fastfreetools.com/es/markdown-editor" },
    { locale: 'pt-br', href: "https://fastfreetools.com/pt-br/markdown-editor" },
    { locale: 'fr', href: "https://fastfreetools.com/fr/markdown-editor" },
    { locale: 'de', href: "https://fastfreetools.com/de/markdown-editor" },
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
        <link rel="canonical" href={shareUrl} />
        {hreflangs.map(({ locale, href }) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}
        <meta property="og:title" content={t('Page_Title')} />
        <meta
          property="og:description"
          content={t('Page_Description')}
        />
        <meta property="og:image" content="https://www.fastfreetools.com/twitter-card.png" />
        <meta name="twitter:image" content="https://fastfreetools.com/twitter-card.png" />
        <meta property="og:url" content="https://fastfreetools.com/markdown-editor" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('Page_Title')} />
        <meta
          name="twitter:description"
          content={t('Page_Description')}
        />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta charSet="UTF-8" />
      </Head>

      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-900 dark:to-red-900 p-4 sm:p-6">
          <div className={`max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-in-out ${isFullScreen ? 'fixed inset-0 z-50' : 'transform hover:scale-[1.02]'}`}>
            <header className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 text-white p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t('name')}</h1>
                  <p className="text-blue-100 dark:text-blue-200">
                    {t('description')}
                  </p>
                </div>
                <nav className="flex flex-wrap items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" aria-label="Open Help" className="bg-white/10 hover:bg-white/20 text-white">
                            <HelpCircle className="h-5 w-5" />
                            <span className="sr-only">{t('Help')}</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{t('About_Tool')}</DialogTitle>
                            <DialogDescription>
                              <p>{t('Why_Text')}</p>
                              <p>{t('How_Text')}</p>
                              <ul className="list-disc pl-5">
                                <li>{t('Features.RealTimePreview')}</li>
                                <li>{t('Features.FormattingToolbar')}</li>
                                <li>{t('Features.FileExport')}</li>
                                <li>{t('Features.SyntaxHighlighting')}</li>
                                <li>{t('Features.WordCharacterCount')}</li>
                                <li>{t('Features.FullScreenMode')}</li>
                                <li>{t('Features.AutoSave')}</li>
                              </ul>
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('Help_Text')}</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" asChild className="bg-white/10 hover:bg-white/20 text-white">
                        <Link href={`/${locale}`} aria-label={t('Home')}>
                          <Home className="h-4 w-4" />
                          <span className="sr-only">{t('Home')}</span>
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('Home')}</p>
                    </TooltipContent>
                  </Tooltip>

                  <ShareButton
                    shareUrl={shareUrl}
                    shareTitle={t('Share_Title')}
                    tooltipText={t('Share_Tool')}
                  />

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
                        <span className="sr-only">{t('Toggle_Theme')}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('Switch_Mode')}</p>
                    </TooltipContent>
                  </Tooltip>
                </nav>
              </div>
            </header>

            <main className="p-6 space-y-4">
              <div className="flex flex-wrap gap-2">
                {/* Botões de formatação com Tooltip */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => handleFormatting('bold')}>
                      <Bold className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t('Bold')}</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => handleFormatting('italic')}>
                      <Italic className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t('Italic')}</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => handleFormatting('heading')}>
                      <Heading className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t('Heading')}</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => handleFormatting('unordered-list')}>
                      <List className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t('Unordered_List')}</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => handleFormatting('ordered-list')}>
                      <ListOrdered className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t('Ordered_List')}</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => handleFormatting('link')}>
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t('Link')}</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => handleFormatting('image')}>
                      <Image className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t('Image')}</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => handleFormatting('code')}>
                      <Code className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t('Code')}</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={handleFileExport}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t('Export_Markdown')}</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    {/* <Button variant="outline" size="icon" component="label">
                      <Upload className="h-4 w-4" />
                      <input type="file" hidden onChange={handleFileImport} accept=".md,.markdown,text/markdown" />
                    </Button> */}
                  </TooltipTrigger>
                  <TooltipContent>{t('Import_Markdown')}</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => setIsFullScreen(!isFullScreen)}>
                      {isFullScreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{isFullScreen ? t('Exit_Full_Screen') : t('Full_Screen')}</TooltipContent>
                </Tooltip>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2">
                  <Textarea
                    id="markdown-input"
                    value={markdown}
                    onChange={(e) => setMarkdown(e.target.value)}
                    placeholder={t('Text_Input_Placeholder')}
                    className="w-full h-[calc(100vh-300px)] font-mono resize-none border-2 border-primary focus:ring-2 focus:ring-primary focus:border-transparent"
                    aria-label={t('Text_Input_Label')}
                  />
                </div>
                <div className="w-full md:w-1/2 border-2 border-primary rounded-md p-4 overflow-auto h-[calc(100vh-300px)] markdown-body bg-white dark:bg-gray-900">
                  <ReactMarkdown
                    components={{
                      code: ({ inline, className, children, ...props }: CodeComponentType) => {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <SyntaxHighlighter
                            {...props}
                            style={tomorrow}
                            language={match[1]}
                            PreTag="div"
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code {...props} className={className}>
                            {children}
                          </code>
                        );
                      }
                    } as Components}
                  >
                    {markdown}
                  </ReactMarkdown>

                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                {t('Words')}: {wordCount} | {t('Characters')}: {characterCount}
              </div>
            </main>

          </div>
        </div>
      </TooltipProvider>
    </>
  );
};

export default MarkdownEditor;
