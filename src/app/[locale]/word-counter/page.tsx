'use client';

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ShareButton from '../components/share-button';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTheme } from 'next-themes';
import {
  Home,
  Moon,
  Sun,
  Copy,
  Check,
  Download,
  BarChart2,
  Clock,
  Book,
  ArrowDownAZ,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DOMPurify from 'isomorphic-dompurify';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import WordCounterHelper from './word-counter-helper';

interface Stats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingTime: number;
  speakingTime: number;
  averageWordLength: number;
  longestWord: string;
}

export default function WordCounter() {
  const t = useTranslations('WordCounter');
  const pathname = usePathname();
  const [text, setText] = useState<string>('');
  const [stats, setStats] = useState<Stats>({
    words: 0,
    characters: 0,
    charactersNoSpaces: 0,
    sentences: 0,
    paragraphs: 0,
    lines: 0,
    readingTime: 0,
    speakingTime: 0,
    averageWordLength: 0,
    longestWord: '',
  });
  const [keywordDensity, setKeywordDensity] = useState<[string, number][]>([]);
  const [readabilityScore, setReadabilityScore] = useState<number>(0);
  const [isCopied, setIsCopied] = useState(false);
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const locale = pathname ? pathname.split("/")[1] : "en";
  const shareUrl = `https://fastfreetools.com/${locale}/word-counter`;

  useEffect(() => {
    analyzeText(text);
  }, [text]);

  const hreflangs = [
    { locale: 'en', href: 'https://fastfreetools.com/en/word-counter' },
    { locale: 'es', href: 'https://fastfreetools.com/es/word-counter' },
    { locale: 'pt-br', href: 'https://fastfreetools.com/pt-br/word-counter' },
    { locale: 'de', href: 'https://fastfreetools.com/de/word-counter' },
    { locale: 'fr', href: 'https://fastfreetools.com/fr/word-counter' },
  ];

  const analyzeText = (input: string) => {
    const sanitizedInput = DOMPurify.sanitize(input);

    const words = sanitizedInput
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    const characters = sanitizedInput.length;
    const charactersNoSpaces = sanitizedInput.replace(/\s/g, '').length;
    const sentences = sanitizedInput
      .split(/[.!?]+/)
      .filter((sentence) => sentence.trim().length > 0);
    const paragraphs = sanitizedInput
      .split(/\n+/)
      .filter((para) => para.trim().length > 0);
    const lines = sanitizedInput.split(/\n/).length;
    const readingTime = Math.ceil(words.length / 200);
    const speakingTime = Math.ceil(words.length / 130);
    const averageWordLength =
      words.length > 0 ? charactersNoSpaces / words.length : 0;
    const longestWord = words.reduce(
      (longest, current) => (current.length > longest.length ? current : longest),
      ''
    );

    setStats({
      words: words.length,
      characters,
      charactersNoSpaces,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      lines,
      readingTime,
      speakingTime,
      averageWordLength: Number(averageWordLength.toFixed(2)),
      longestWord,
    });

    const wordFrequency: { [key: string]: number } = {};
    words.forEach((word) => {
      const lowercaseWord = word.toLowerCase();
      if (lowercaseWord.length > 3) {
        wordFrequency[lowercaseWord] = (wordFrequency[lowercaseWord] || 0) + 1;
      }
    });

    const sortedKeywords = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(
        ([word, count]) =>
          [word, Math.round((count / words.length) * 100)] as [string, number]
      );

    setKeywordDensity(sortedKeywords);

    const totalSyllables = words.reduce(
      (sum, word) => sum + countSyllables(word),
      0
    );
    const readabilityScore =
      0.39 * (words.length / sentences.length) +
      11.8 * (totalSyllables / words.length) -
      15.59;
    setReadabilityScore(Number(readabilityScore.toFixed(2)));
  };

  const countSyllables = (word: string) => {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const syllables = word.match(/[aeiouy]{1,2}/g);
    return syllables ? syllables.length : 1;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({
        title: t('Text_Copied'),
        description: t('Text_Copied_Description'),
      });
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast({
        title: t('Copy_Failed'),
        description: t('Copy_Failed_Description'),
        variant: 'destructive',
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analyzed_text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: t('Text_Downloaded'),
      description: t('Text_Downloaded_Description'),
    });
  };

  const handleAlphabeticalSort = () => {
    const sortedText = text.split('\n').sort().join('\n');
    setText(sortedText);
    toast({
      title: t('Text_Sorted'),
      description: t('Text_Sorted_Description'),
    });
  };

  return (
    <>
      <Head>
        <title>{t('Page_Title')}</title>
        <meta name="description" content={t('Page_Description')} />
        <meta name="keywords" content={t('Page_Keywords')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://fastfreetools.com/word-counter" />

        {hreflangs.map(({ locale, href }) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}

        <meta property="og:title" content={t('Page_Title')} />
        <meta property="og:description" content={t('Page_Description')} />
        <meta property="og:url" content="https://fastfreetools.com/word-counter" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="twitter-card" />
        <meta name="twitter:title" content={t('Page_Title')} />
        <meta name="twitter:description" content={t('Page_Description')} />

        <meta property="og:image" content="https://www.fastfreetools.com/twitter-card.png" />
        <meta name="twitter:image" content="https://fastfreetools.com/twitter-card.png" />
        <meta charSet="UTF-8" />
      </Head>
      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-900 dark:to-red-900 p-4 sm:p-6">
          <main className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-in-out">
            <header className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 text-white p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t('Page_Title')}</h1>
                </div>

                <nav className="flex flex-wrap items-center space-x-2 mt-2 sm:mt-0">
                  <WordCounterHelper />

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        asChild
                        className="bg-white/10 hover:bg-white/20 text-white"
                      >
                        <Link href={`/${locale}`} aria-label="Home">
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
                  htmlFor="text-input"
                  className="text-lg font-semibold text-gray-700 dark:text-gray-300"
                >
                  {t('Enter_Text')}
                </Label>
                <Textarea
                  id="text-input"
                  value={text}
                  onChange={(e) => setText(DOMPurify.sanitize(e.target.value))}
                  placeholder={t('Text_Input_Placeholder')}
                  rows={10}
                  className="w-full p-2 border-2 border-purple-300 dark:border-purple-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  aria-label={t('Text_Input_Label')}
                />
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
                  <Button
                    onClick={handleCopy}
                    disabled={!text}
                    className="bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-auto"
                  >
                    {isCopied ? (
                      <Check className="h-4 w-4 mr-2" />
                    ) : (
                      <Copy className="h-4 w-4 mr-2" />
                    )}
                    {isCopied ? t('Copied') : t('Copy')}
                  </Button>
                  <Button
                    onClick={handleDownload}
                    disabled={!text}
                    className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {t('Download')}
                  </Button>
                  <Button
                    onClick={handleAlphabeticalSort}
                    disabled={!text}
                    className="bg-purple-500 hover:bg-purple-600 text-white w-full sm:w-auto"
                  >
                    <ArrowDownAZ className="h-4 w-4 mr-2" />
                    {t('Sort_Alphabetically')}
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="basic-stats" className="relative">

                <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 bg-purple-100 dark:bg-purple-900 z-10">
                  <TabsTrigger
                    value="basic-stats"
                    className="flex items-center justify-center px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
                  >
                    <BarChart2 className="h-4 w-4 mr-2" />
                    {t('Basic_Stats')}
                  </TabsTrigger>
                  <TabsTrigger
                    value="readability"
                    className="flex items-center justify-center px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
                  >
                    <Book className="h-4 w-4 mr-2" />
                    {t('Readability')}
                  </TabsTrigger>
                  <TabsTrigger
                    value="keyword-density"
                    className="flex items-center justify-center px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    {t('Keyword_Density')}
                  </TabsTrigger>
                </TabsList>
                <div className="relative z-0">
                  <TabsContent
                    value="basic-stats"
                    className="p-4 bg-white dark:bg-gray-800 rounded-b-lg shadow-md mt-[-1px]"
                  >
                    <div className="overflow-x-auto">
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">{t('Words')}</TableCell>
                            <TableCell>{stats.words}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">
                              {t('Characters_with_Spaces')}
                            </TableCell>
                            <TableCell>{stats.characters}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">
                              {t('Characters_without_Spaces')}
                            </TableCell>
                            <TableCell>{stats.charactersNoSpaces}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">
                              {t('Sentences')}
                            </TableCell>
                            <TableCell>{stats.sentences}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">
                              {t('Paragraphs')}
                            </TableCell>
                            <TableCell>{stats.paragraphs}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">{t('Lines')}</TableCell>
                            <TableCell>{stats.lines}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">
                              {t('Average_Word_Length')}
                            </TableCell>
                            <TableCell>
                              {stats.averageWordLength} {t('Characters')}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">
                              {t('Longest_Word')}
                            </TableCell>
                            <TableCell>{stats.longestWord}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                  <TabsContent
                    value="readability"
                    className="p-4 bg-white dark:bg-gray-800 rounded-b-lg shadow-md mt-[-1px]"
                  >
                    <div className="overflow-x-auto">
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">
                              {t('Readability_Score')}
                            </TableCell>
                            <TableCell>{readabilityScore}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">
                              {t('Estimated_Reading_Time')}
                            </TableCell>
                            <TableCell>
                              {stats.readingTime} {t('Minute')}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">
                              {t('Estimated_Speaking_Time')}
                            </TableCell>
                            <TableCell>
                              {stats.speakingTime} {t('Minute')}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-2">
                        {t('Readability_Guide')}
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>
                          90-100: <span className="font-medium">{t('Very_Easy')}</span>
                        </li>
                        <li>
                          80-89: <span className="font-medium">{t('Easy')}</span>
                        </li>
                        <li>
                          70-79: <span className="font-medium">{t('Fairly_Easy')}</span>
                        </li>
                        <li>
                          60-69: <span className="font-medium">{t('Standard')}</span>
                        </li>
                        <li>
                          50-59: <span className="font-medium">{t('Fairly_Difficult')}</span>
                        </li>
                        <li>
                          30-49: <span className="font-medium">{t('Difficult')}</span>
                        </li>
                        <li>
                          0-29: <span className="font-medium">{t('Very_Confusing')}</span>
                        </li>
                      </ul>
                    </div>
                  </TabsContent>
                  <TabsContent
                    value="keyword-density"
                    className="p-4 bg-white dark:bg-gray-800 rounded-b-lg shadow-md mt-[-1px]"
                  >
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{t('Keyword')}</TableHead>
                            <TableHead>{t('Occurrences')}</TableHead>
                            <TableHead>{t('Density')}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {keywordDensity.map(([word, density]) => (
                            <TableRow key={word}>
                              <TableCell>{word}</TableCell>
                              <TableCell>
                                {Math.round((density / 100) * stats.words)}
                              </TableCell>
                              <TableCell>{density}%</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </main>
        </div>
      </TooltipProvider>
    </>
  );
}