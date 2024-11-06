'use client';

import React, { useState } from 'react';
import Head from 'next/head';
import DOMPurify from 'dompurify';
import validator from 'validator';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ShareButton from '../components/share-button';
import { Label } from "@/components/ui/label";
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from 'next-themes';
import {
  Home,
  Moon,
  Sun,
  Search,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useMediaQuery } from 'react-responsive'; // Import do hook useMediaQuery

interface MetaTags {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
}

export default function SEOMetaTagAnalyzer() {
  const [url, setUrl] = useState('');
  const [metaTags, setMetaTags] = useState<MetaTags | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('general'); // Estado para o seletor

  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const pathname = usePathname();
  const t = useTranslations('SEOMetaTagAnalyzer');

  const locale = pathname ? pathname.split("/")[1] : "en";
  const shareUrl = `https://fastfreetools.com/${locale}/seo-meta-tag-analyzer`;

  const hreflangs = [
    { locale: 'en', href: 'https://fastfreetools.com/en/seo-meta-tag-analyzer' },
    { locale: 'es', href: 'https://fastfreetools.com/es/seo-meta-tag-analyzer' },
    { locale: 'fr', href: 'https://fastfreetools.com/fr/seo-meta-tag-analyzer' },
    { locale: 'pt-br', href: 'https://fastfreetools.com/pt-br/seo-meta-tag-analyzer' },
    { locale: 'de', href: 'https://fastfreetools.com/de/seo-meta-tag-analyzer' },
    { locale: 'x-default', href: 'https://fastfreetools.com/seo-meta-tag-analyzer' },
  ];

  const sanitizeInput = (input: string) => {
    return DOMPurify.sanitize(input);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedInput = sanitizeInput(e.target.value);
    setUrl(sanitizedInput);
  };

  const analyzeSEO = async () => {
    if (!validator.isURL(url, { require_protocol: true })) {
      toast({
        title: t('Invalid_URL'),
        description: t('Please_enter_a_valid_URL_with_protocol'),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/analyze-seo?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch meta tags');
      }
      const data = await response.json();
      setMetaTags(data);
    } catch (error) {
      console.error('Error analyzing SEO:', error);
      toast({
        title: t('Analysis_Failed'),
        description: t('Analysis_Failed_Description'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderEffectivenessIcon = (isEffective: boolean) => {
    return isEffective ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <AlertTriangle className="h-5 w-5 text-yellow-500" />
    );
  };

  // Hook para detectar se a tela é pequena (mobile)
  const isMobile = useMediaQuery({ maxWidth: 640 }); // 640px é o breakpoint para sm

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
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t('Title')}</h1>
                </div>

                <nav className="flex flex-wrap items-center space-x-2 mt-2 sm:mt-0">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        asChild
                        className="bg-white/10 hover:bg-white/20 text-white"
                      >
                        <Link href={`/${locale}`} aria-label={t('Home')}>
                          <Home className="h-5 w-5" />
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
              <div className="space-y-2">
                <Label
                  htmlFor="url-input"
                  className="text-lg font-semibold text-gray-700 dark:text-gray-300"
                >
                  {t('Enter_Website_URL')}
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="url-input"
                    value={url}
                    onChange={handleUrlChange}
                    placeholder="https://example.com"
                    className="flex-grow"
                  />
                  <Button onClick={analyzeSEO} disabled={isLoading || !url}>
                    {isLoading ? t('Analyzing') : t('Analyze')}
                    <Search className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>

              {metaTags && (
                <>
                  {isMobile ? (
                    // Versão Mobile com Select
                    <div className="mt-4">
                      <Label htmlFor="tab-select" className="sr-only">
                        {t('Select_Tab')}
                      </Label>
                      <select
                        id="tab-select"
                        value={selectedTab}
                        onChange={(e) => setSelectedTab(e.target.value)}
                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                      >
                        <option value="general">{t('General')}</option>
                        <option value="opengraph">{t('Open_Graph')}</option>
                        <option value="twitter">{t('Twitter_Cards')}</option>
                      </select>
                    </div>
                  ) : (
                    // Versão Desktop com Tabs
                    <Tabs
                      defaultValue="general"
                      value={selectedTab}
                      onValueChange={(value) => setSelectedTab(value)}
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 bg-purple-100 dark:bg-purple-900">
                        <TabsTrigger value="general">{t('General')}</TabsTrigger>
                        <TabsTrigger value="opengraph">{t('Open_Graph')}</TabsTrigger>
                        <TabsTrigger value="twitter">{t('Twitter_Cards')}</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  )}

                  {/* Conteúdo das Abas ou Select */}
                  {selectedTab === 'general' && (
                    <div className="mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>{t('General_Meta_Tags')}</CardTitle>
                          <CardDescription>{t('General_Meta_Tags_Description')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableBody>
                              <TableRow>
                                <TableCell className="font-medium">{t('Title_Tag')}</TableCell>
                                <TableCell>{metaTags.title}</TableCell>
                                <TableCell>{renderEffectivenessIcon(metaTags.title.length > 0 && metaTags.title.length <= 60)}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">{t('Description_Tag')}</TableCell>
                                <TableCell>{metaTags.description}</TableCell>
                                <TableCell>{renderEffectivenessIcon(metaTags.description.length > 0 && metaTags.description.length <= 160)}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">{t('Keywords_Tag')}</TableCell>
                                <TableCell>{metaTags.keywords.join(', ')}</TableCell>
                                <TableCell>{renderEffectivenessIcon(metaTags.keywords.length > 0 && metaTags.keywords.length <= 10)}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {selectedTab === 'opengraph' && (
                    <div className="mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>{t('Open_Graph_Tags')}</CardTitle>
                          <CardDescription>{t('Open_Graph_Tags_Description')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableBody>
                              <TableRow>
                                <TableCell className="font-medium">{t('OG_Title')}</TableCell>
                                <TableCell>{metaTags.ogTitle}</TableCell>
                                <TableCell>{renderEffectivenessIcon(metaTags.ogTitle.length > 0)}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">{t('OG_Description')}</TableCell>
                                <TableCell>{metaTags.ogDescription}</TableCell>
                                <TableCell>{renderEffectivenessIcon(metaTags.ogDescription.length > 0)}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">{t('OG_Image')}</TableCell>
                                <TableCell>{metaTags.ogImage}</TableCell>
                                <TableCell>{renderEffectivenessIcon(metaTags.ogImage.length > 0)}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {selectedTab === 'twitter' && (
                    <div className="mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>{t('Twitter_Card_Tags')}</CardTitle>
                          <CardDescription>{t('Twitter_Card_Tags_Description')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableBody>
                              <TableRow>
                                <TableCell className="font-medium">{t('Twitter_Card')}</TableCell>
                                <TableCell>{metaTags.twitterCard}</TableCell>
                                <TableCell>{renderEffectivenessIcon(metaTags.twitterCard.length > 0)}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">{t('Twitter_Title')}</TableCell>
                                <TableCell>{metaTags.twitterTitle}</TableCell>
                                <TableCell>{renderEffectivenessIcon(metaTags.twitterTitle.length > 0)}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">{t('Twitter_Description')}</TableCell>
                                <TableCell>{metaTags.twitterDescription}</TableCell>
                                <TableCell>{renderEffectivenessIcon(metaTags.twitterDescription.length > 0)}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">{t('Twitter_Image')}</TableCell>
                                <TableCell>{metaTags.twitterImage}</TableCell>
                                <TableCell>{renderEffectivenessIcon(metaTags.twitterImage.length > 0)}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Relatório de Efetividade SEO */}
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>{t('SEO_Effectiveness_Report')}</CardTitle>
                      <CardDescription>{t('SEO_Effectiveness_Report_Description')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-2">
                        {metaTags.title.length === 0 && (
                          <li>{t('Suggestion_Add_Title')}</li>
                        )}
                        {metaTags.title.length > 60 && (
                          <li>{t('Suggestion_Short_Title')}</li>
                        )}
                        {metaTags.description.length === 0 && (
                          <li>{t('Suggestion_Add_Description')}</li>
                        )}
                        {metaTags.description.length > 160 && (
                          <li>{t('Suggestion_Short_Description')}</li>
                        )}
                        {metaTags.keywords.length === 0 && (
                          <li>{t('Suggestion_Add_Keywords')}</li>
                        )}
                        {metaTags.keywords.length > 10 && (
                          <li>{t('Suggestion_Reduce_Keywords')}</li>
                        )}
                        {!metaTags.ogTitle && (
                          <li>{t('Suggestion_Add_OG_Title')}</li>
                        )}
                        {!metaTags.ogDescription && (
                          <li>{t('Suggestion_Add_OG_Description')}</li>
                        )}
                        {!metaTags.ogImage && (
                          <li>{t('Suggestion_Add_OG_Image')}</li>
                        )}
                        {!metaTags.twitterCard && (
                          <li>{t('Suggestion_Add_Twitter_Card')}</li>
                        )}
                        {!metaTags.twitterTitle && (
                          <li>{t('Suggestion_Add_Twitter_Title')}</li>
                        )}
                        {!metaTags.twitterDescription && (
                          <li>{t('Suggestion_Add_Twitter_Description')}</li>
                        )}
                        {!metaTags.twitterImage && (
                          <li>{t('Suggestion_Add_Twitter_Image')}</li>
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </main>
        </div>
      </TooltipProvider>
    </>
  );
}
