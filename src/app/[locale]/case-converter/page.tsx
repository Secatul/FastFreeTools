"use client";

import React, { useState, useEffect, ChangeEvent } from 'react';
import Head from 'next/head';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTheme } from "next-themes";
import { useTranslations } from 'next-intl';
import { Home, HelpCircle, Moon, Sun, Copy, Save, Trash2, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import DOMPurify from 'dompurify';
import ShareButton from '../components/share-button';
import { usePathname } from "next/navigation";

interface Snippet {
  id: number;
  input: string;
  output: string;
  type: string;
}

function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input);
}

function toCamelCase(text: string): string {
  return text
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
      index === 0 ? match.toLowerCase() : match.toUpperCase()
    )
    .replace(/\s+/g, '');
}

function toSnakeCase(text: string): string {
  return text
    .replace(/\W+/g, ' ')
    .split(/ |\B(?=[A-Z])/)
    .map(word => word.toLowerCase())
    .join('_');
}

function toPascalCase(text: string): string {
  return text
    .replace(/(\w)(\w*)/g, (match, firstChar, rest) =>
      firstChar.toUpperCase() + rest.toLowerCase()
    )
    .replace(/\W+/g, '');
}

const MAX_SNIPPETS = 30;

const CaseConverter: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [conversionType, setConversionType] = useState<string>('uppercase');
  const [savedSnippets, setSavedSnippets] = useState<Snippet[]>([]);
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const pathname = usePathname();
  const t = useTranslations('CaseConverter');

  if (!pathname) {
    return null;
  }

  const locale = pathname.split("/")[1];

  const shareUrl = `https://fastfreetools.com/${locale}/case-converter`;

  useEffect(() => {
    const savedSnippets = localStorage.getItem('savedSnippets');
    if (savedSnippets) {
      setSavedSnippets(JSON.parse(savedSnippets));
    }
  }, []);

  useEffect(() => {
    convertText(inputText, conversionType);
  }, [inputText, conversionType]);

  const convertText = (text: string, type: string) => {
    const sanitizedText = sanitizeInput(text);
    let result = sanitizedText;
    switch (type) {
      case 'uppercase':
        result = sanitizedText.toUpperCase();
        break;
      case 'lowercase':
        result = sanitizedText.toLowerCase();
        break;
      case 'capitalize':
        result = sanitizedText.replace(/\b\w/g, l => l.toUpperCase());
        break;
      case 'alternating':
        result = sanitizedText
          .split('')
          .map((char, index) => (index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()))
          .join('');
        break;
      case 'title':
        result = sanitizedText.replace(/\b\w+/g, word =>
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        );
        break;
      case 'sentence':
        result = sanitizedText
          .toLowerCase()
          .replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
        break;
      case 'camelcase':
        result = toCamelCase(sanitizedText);
        break;
      case 'snakecase':
        result = toSnakeCase(sanitizedText);
        break;
      case 'pascalcase':
        result = toPascalCase(sanitizedText);
        break;
      default:
        break;
    }
    setOutputText(result);
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handleConversionTypeChange = (type: string) => {
    setConversionType(type);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: t('Toast.Copied_Title'),
      description: t('Toast.Copied_Description'),
    });
  };

  const saveSnippet = () => {
    if (savedSnippets.length >= MAX_SNIPPETS) {
      toast({
        title: t('Toast.Limit_Reached_Title'),
        description: t('Toast.Limit_Reached_Description', { max: MAX_SNIPPETS }),
        variant: "destructive",
      });
      return;
    }

    if (inputText.trim()) {
      const newSnippet: Snippet = {
        id: Date.now(),
        input: inputText,
        output: outputText,
        type: conversionType,
      };
      const updatedSnippets = [...savedSnippets, newSnippet];
      setSavedSnippets(updatedSnippets);
      localStorage.setItem('savedSnippets', JSON.stringify(updatedSnippets));
      toast({
        title: t('Toast.Snippet_Saved'),
        description: t('Toast.Snippet_Description'),
      });
    }
  };

  const loadSnippet = (snippet: Snippet) => {
    setInputText(snippet.input);
    setConversionType(snippet.type);
    toast({
      title: t('Toast.Snippet_Loaded'),
      description: t('Toast.Snippet_Loaded_Description'),
    });
  };

  const deleteSnippet = (id: number) => {
    const updatedSnippets = savedSnippets.filter(snippet => snippet.id !== id);
    setSavedSnippets(updatedSnippets);
    localStorage.setItem('savedSnippets', JSON.stringify(updatedSnippets));
    toast({
      title: t('Toast.Snippet_Deleted'),
      description: t('Toast.Snippet_Deleted_Description'),
      variant: "destructive",
    });
  };

  const hreflangs = [
    { locale: 'en', href: "https://fastfreetools.com/en/case-converter" },
    { locale: 'es', href: "https://fastfreetools.com/es/case-converter" },
    { locale: 'pt-br', href: "https://fastfreetools.com/pt-br/case-converter" },
    { locale: 'de', href: "https://fastfreetools.com/de/case-converter" },
    { locale: 'fr', href: "https://fastfreetools.com/fr/case-converter" },
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
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('Page_Title')} />
        <meta
          name="twitter:description"
          content={t('Page_Description')}
        />
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
                        <Link href="/" aria-label="Home">
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

            <div className="p-6 space-y-6">
              <section className="space-y-4">
                <div>
                  <Label htmlFor="input-text" className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('Input_Text')}</Label>
                  <Textarea
                    id="input-text"
                    value={inputText}
                    onChange={handleInputChange}
                    className="mt-1 w-full border-2 border-purple-300 dark:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder={t('Text_Input_Placeholder')}
                    rows={5}
                  />
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {t('Characters')}: {inputText.length} | {t('Words')}: {inputText.trim().split(/\s+/).filter(Boolean).length}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {['uppercase', 'lowercase', 'capitalize', 'alternating', 'title', 'sentence', 'camelcase', 'snakecase', 'pascalcase'].map((type) => (
                    <Button
                      key={type}
                      onClick={() => handleConversionTypeChange(type)}
                      className={`${conversionType === type ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800'} hover:bg-purple-500 hover:text-white`}
                    >
                      {t(type)}
                    </Button>
                  ))}
                </div>

                <div>
                  <Label htmlFor="output-text" className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('Output_Text')}</Label>
                  <div className="relative">
                    <Textarea
                      id="output-text"
                      value={outputText}
                      readOnly
                      className="mt-1 w-full bg-gray-100 dark:bg-gray-700 border-2 border-blue-300 dark:border-blue-600 rounded-md transition-all duration-300 ease-in-out"
                      rows={5}
                    />
                    <Button
                      onClick={() => copyToClipboard(outputText)}
                      className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      {t('Copy')}
                    </Button>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {t('Characters')}: {outputText.length} | {t('Words')}: {outputText.trim().split(/\s+/).filter(Boolean).length}
                  </p>
                </div>

                <div className="flex justify-between">
                  <Button onClick={saveSnippet} className="bg-green-500 hover:bg-green-600 text-white">
                    <Save className="h-4 w-4 mr-2" />
                    {t('Save_Snippet')}
                  </Button>
                </div>
              </section>

              {savedSnippets.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('Saved_Snippets')}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedSnippets.map((snippet) => (
                      <div key={snippet.id} className="border border-purple-300 dark:border-purple-600 p-4 rounded-lg space-y-2 bg-white dark:bg-gray-800 shadow-md">
                        <p className="font-mono text-sm text-gray-700 dark:text-gray-300 truncate">{snippet.input}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('Type')}: {t(snippet.type)}</p>
                        <div className="flex justify-between">
                          <Button onClick={() => loadSnippet(snippet)} className="bg-blue-500 hover:bg-blue-600 text-white">
                            <FileText className="h-4 w-4 mr-2" />
                            {t('Load')}
                          </Button>
                          <Button variant="destructive" onClick={() => deleteSnippet(snippet.id)}>
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
  );
};

export default CaseConverter;
