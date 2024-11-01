"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme } from "next-themes";
import { Home, HelpCircle, Copy, Check, Moon, Sun, RefreshCw } from "lucide-react";
import Head from "next/head";
import DOMPurify from "dompurify";
import ShareButton from "../components/share-button";
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

const BinaryTextConverter: React.FC = () => {
  const t = useTranslations('BinaryTextConverter');
  const pathname = usePathname();
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [mode, setMode] = useState<"textToBinary" | "binaryToText">("textToBinary"); // Default set to 'textToBinary'
  const [error, setError] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();

  const locale = pathname ? pathname.split("/")[1] : "en";
  const shareUrl = `https://fastfreetools.com/${locale}/binary-text-converter`;
  const shareTitle = t('Share_Title');

  const binaryToText = (binaryStr: string): string => {
    return binaryStr.split(" ").map(bin => String.fromCharCode(parseInt(bin, 2))).join("");
  };

  const textToBinary = (text: string): string => {
    return text.split("").map(char => char.charCodeAt(0).toString(2).padStart(8, "0")).join(" ");
  };

  const handleConvert = (): void => {
    setError("");
    setOutput("");
    try {
      const sanitizedInput = DOMPurify.sanitize(input);
      if (mode === "binaryToText") {
        const cleanedInput = sanitizedInput.replace(/[^01\s]/g, "");
        if (cleanedInput !== sanitizedInput) {
          setError(t('Invalid_Characters_Removed'));
        }
        setOutput(binaryToText(cleanedInput));
      } else {
        setOutput(textToBinary(sanitizedInput));
      }
    } catch (error) {
      setError(t('Invalid_Input'));
    }
  };

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(output);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const toggleMode = (): void => {
    setMode(mode === "binaryToText" ? "textToBinary" : "binaryToText");
    setInput("");
    setOutput("");
    setError("");
  };

  const hreflangs = [
    { locale: 'en', href: "https://fastfreetools.com/en/binary-text-converter" },
    { locale: 'es', href: "https://fastfreetools.com/es/binary-text-converter" },
    { locale: 'pt-br', href: "https://fastfreetools.com/pt-br/binary-text-converter" },
    { locale: 'de', href: "https://fastfreetools.com/de/binary-text-converter" },
    { locale: 'fr', href: "https://fastfreetools.com/fr/binary-text-converter" },
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
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={`https://fastfreetools.com/${locale}/binary-text-converter`} />

        {/* Adicionar as tags hreflang */}
        {hreflangs.map(({ href, locale }) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}

        <meta property="og:title" content={t('Page_Title')} />
        <meta
          property="og:description"
          content={t('Page_Description')}
        />
        <meta property="og:image" content="https://www.fastfreetools.com/twitter-card.png" />
        <meta name="twitter:image" content="https://fastfreetools.com/twitter-card.png" />
        <meta property="og:url" content={`https://fastfreetools.com/${locale}/binary-text-converter`} />
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
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-[1.02]">
            <header className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 text-white p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl sm:text-4xl font-bold">{t('Title')}</h1>
                <nav className="flex items-center space-x-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" aria-label={t('Open_Help')} className="bg-white/10 hover:bg-white/20 text-white">
                            <HelpCircle className="h-5 w-5" />
                            <span className="sr-only">{t('Open_Help')}</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{t('About_Title')}</DialogTitle>
                            <DialogDescription>
                              <p className="mt-2">
                                <strong>{t('Why_Title')}:</strong> {t('Why_Text')}
                              </p>
                              <p className="mt-2">
                                <strong>{t('What_Title')}:</strong> {t('What_Text')}
                              </p>
                              <p className="mt-2">
                                <strong>{t('How_Title')}:</strong> {t('How_Text')}
                              </p>
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
                        <Link href={`/${locale}`} aria-label="Home">
                          <Home className="h-5 w-5" />
                          <span className="sr-only">{t('Home')}</span>
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

            <main className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="input" className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    {mode === "binaryToText" ? t('Binary_Input') : t('Text_Input')}
                  </Label>
                  <Textarea
                    id="input"
                    value={input}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
                    placeholder={mode === "binaryToText" ? t('Binary_Placeholder') : t('Text_Placeholder')}
                    rows={5}
                    aria-label={t('Input_Label')}
                    className="w-full p-3 text-lg border-2 border-purple-300 dark:border-purple-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ease-in-out dark:bg-gray-700 dark:text-white"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('Character_Count')}: {input.length}</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <Button
                    onClick={toggleMode}
                    variant="outline"
                    className="w-full sm:w-auto bg-pink-100 hover:bg-pink-200 text-pink-800 dark:bg-pink-900 dark:hover:bg-pink-800 dark:text-pink-100"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {mode === "binaryToText" ? t('Switch_Text_To_Binary') : t('Switch_Binary_To_Text')}
                  </Button>
                  <Button
                    onClick={handleConvert}
                    aria-label={t('Convert_Aria')}
                    className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    {t('Convert')}
                  </Button>
                </div>

                {error && (
                  <p className="text-red-500 dark:text-red-400 font-semibold" role="status" aria-live="polite">
                    {error}
                  </p>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="output" className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('Result')}</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      disabled={!output}
                      aria-label={t('Copy_Result')}
                      className="bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-400"
                    >
                      {isCopied ? (
                        <Check className="h-4 w-4 mr-2" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
                      {isCopied ? t('Copied') : t('Copy')}
                    </Button>
                  </div>
                  <Textarea
                    id="output"
                    value={output}
                    readOnly
                    rows={5}
                    aria-label={t('Output_Label')}
                    className="w-full p-3 text-lg bg-gray-100 dark:bg-gray-700 border-2 border-blue-300 dark:border-blue-600 rounded-md transition-all duration-300 ease-in-out dark:text-white"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('Character_Count')}: {output.length}</p>
                </div>
              </div>
            </main>
          </div>
        </div>
      </TooltipProvider>
    </>
  );
};

export default BinaryTextConverter;
