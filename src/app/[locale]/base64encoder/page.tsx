"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import DOMPurify from "isomorphic-dompurify";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "next-themes";
import { Home, HelpCircle, Copy, Check, Moon, Sun } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import ShareButton from "../components/share-button";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";

const Base64Converter: React.FC = () => {
  const [inputText, setInputText] = useState<string>("");
  const [resultText, setResultText] = useState<string>("");
  const [isEncoding, setIsEncoding] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();
  const t = useTranslations('Base64Converter');

  const pathname = usePathname();

  const locale = pathname ? pathname.split("/")[1] : "en";

  const shareUrl = `https://fastfreetools.com/${locale}/base64-converter`;
  const shareTitle = t('Share_Title');

  useEffect(() => {
    setResultText("");
    setError("");
  }, [isEncoding]);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const sanitizedQuery = DOMPurify.sanitize(e.target.value);
    setInputText(sanitizedQuery);
  };

  const toggleEncoding = () => {
    setIsEncoding(!isEncoding);
  };

  const handleConvert = () => {
    try {
      let result;
      if (isEncoding) {
        result = btoa(inputText);
      } else {
        result = atob(inputText);
      }
      setResultText(DOMPurify.sanitize(result));
      setError("");
    } catch (err) {
      setError(t('Error_Invalid_Base64'));
      setResultText("");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resultText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const hreflangs = [
    { locale: 'en', href: "https://fastfreetools.com/en/base64-converter" },
    { locale: 'es', href: "https://fastfreetools.com/es/base64-converter" },
    { locale: 'pt-br', href: "https://fastfreetools.com/pt-br/base64-converter" },
    { locale: 'de', href: "https://fastfreetools.com/de/base64-converter" },
    { locale: 'fr', href: "https://fastfreetools.com/fr/base64-converter" },
  ];

  return (
    <>
      <Head>
        <title>{t('Page_Title')}</title>
        <meta
          name="description"
          content={t('Page_Description')}
        />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={shareUrl} />

        {hreflangs.map(({ href, locale }) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}

        <meta property="og:title" content={t('Page_Title')} />
        <meta
          property="og:description"
          content={t('Page_Description')}
        />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.fastfreetools.com/opengraph-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('Page_Title')} />
        <meta
          name="twitter:description"
          content={t('Page_Description')}
        />
        <meta name="twitter:image" content="https://fastfreetools.com/opengraph-image.png" />
      </Head>

      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-900 dark:to-red-900 p-4 sm:p-6">
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-[1.02]">
            <header className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 text-white p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t('Header_Title')}</h1>
                  <p className="text-blue-100 dark:text-blue-200">
                    {t('Header_Subtitle')}
                  </p>
                </div>
                <nav className="flex items-center space-x-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" aria-label={t('Help_Aria')} className="bg-white/10 hover:bg-white/20 text-white">
                            <HelpCircle className="h-5 w-5" />
                            <span className="sr-only">{t('Help')}</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{t('Help_Title')}</DialogTitle>
                            <DialogDescription>
                              <div>
                                <strong>{t('Help_Why')}</strong> {t('Help_Why_Description')}
                              </div>
                              <div>
                                <strong>{t('Help_What')}</strong> {t('Help_What_Description')}
                              </div>
                              <div>
                                <strong>{t('Help_How')}</strong> {t('Help_How_Description')}
                              </div>
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('Help_Tooltip')}</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" asChild className="bg-white/10 hover:bg-white/20 text-white">
                        <Link href={`/${locale}`} aria-label={t('Home_Aria')}>
                          <Home className="h-5 w-5" />
                          <span className="sr-only">{t('Home')}</span>
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('Home_Tooltip')}</p>
                    </TooltipContent>
                  </Tooltip>

                  <ShareButton shareUrl={shareUrl} shareTitle={shareTitle} tooltipText={t('Share_Tooltip')} />

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        aria-label={t('Theme_Toggle_Aria')}
                        className="bg-white/10 hover:bg-white/20 text-white"
                      >
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">{t('Theme_Toggle')}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('Theme_Toggle_Tooltip')}</p>
                    </TooltipContent>
                  </Tooltip>
                </nav>
              </div>
            </header>

            <main className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="input-text" className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('Input_Label')}</Label>
                  <Textarea
                    id="input-text"
                    value={inputText}
                    onChange={handleInputChange}
                    placeholder={t('Input_Placeholder')}
                    rows={5}
                    aria-label={t('Input_Aria')}
                    className="w-full p-3 text-lg border-2 border-purple-300 dark:border-purple-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ease-in-out dark:bg-gray-700 dark:text-white"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('Character_Count', { count: inputText.length })}</p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900 dark:to-purple-900 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="encoding-mode"
                      checked={isEncoding}
                      onCheckedChange={toggleEncoding}
                      aria-label={t('Toggle_Encoding_Aria')}
                    />
                    <Label htmlFor="encoding-mode" className="text-gray-700 dark:text-gray-300">{isEncoding ? t('Encoding') : t('Decoding')}</Label>
                  </div>
                  <Button
                    onClick={handleConvert}
                    aria-label={t('Convert_Button_Aria', { mode: isEncoding ? t('Encoding') : t('Decoding') })}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    {isEncoding ? t('Encode_Button') : t('Decode_Button')}
                  </Button>
                </div>

                {error && (
                  <p className="text-red-500 dark:text-red-400 font-semibold" role="status" aria-live="polite">
                    {error}
                  </p>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="result-text" className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('Result_Label')}</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      disabled={!resultText}
                      aria-label={t('Copy_Button_Aria')}
                      className="bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-400"
                    >
                      {isCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                      {isCopied ? t('Copied_Button') : t('Copy_Button')}
                    </Button>
                  </div>
                  <Textarea
                    id="result-text"
                    value={resultText}
                    readOnly
                    rows={5}
                    aria-label={t('Result_Aria')}
                    className="w-full p-3 text-lg bg-gray-100 dark:bg-gray-700 border-2 border-blue-300 dark:border-blue-600 rounded-md transition-all duration-300 ease-in-out dark:text-white"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('Character_Count', { count: resultText.length })}</p>
                </div>
              </div>
            </main>
          </div>
        </div>
      </TooltipProvider>
    </>
  );
};

export default Base64Converter;
