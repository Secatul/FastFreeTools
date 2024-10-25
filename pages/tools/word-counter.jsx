"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ShareButton from "@/app/components/share-button";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme } from "next-themes";
import { Home, HelpCircle, Moon, Sun, Copy, Check, Download, BarChart2, Clock, Book } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DOMPurify from "isomorphic-dompurify";

export default function WordCounter() {
  const [text, setText] = useState("");
  const [stats, setStats] = useState({
    words: 0,
    characters: 0,
    charactersNoSpaces: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
    speakingTime: 0,
    averageWordLength: 0,
    longestWord: "",
  });
  const [keywordDensity, setKeywordDensity] = useState([]);
  const [readabilityScore, setReadabilityScore] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const shareUrl = "https://fastfreetools.com/word-counter";
  const shareTitle = "Check out this Word Counter tool!";


  useEffect(() => {
    analyzeText(text);
  }, [text]);

  const analyzeText = (input) => {
    const sanitizedInput = DOMPurify.sanitize(input);

    const words = sanitizedInput.trim().split(/\s+/).filter((word) => word.length > 0);
    const characters = sanitizedInput.length;
    const charactersNoSpaces = sanitizedInput.replace(/\s/g, "").length;
    const sentences = sanitizedInput.split(/[.!?]+/).filter((sentence) => sentence.trim().length > 0);
    const paragraphs = sanitizedInput.split(/\n+/).filter((para) => para.trim().length > 0);
    const readingTime = Math.ceil(words.length / 200);
    const speakingTime = Math.ceil(words.length / 130);
    const averageWordLength = words.length > 0 ? charactersNoSpaces / words.length : 0;
    const longestWord = words.reduce((longest, current) => (current.length > longest.length ? current : longest), "");

    setStats({
      words: words.length,
      characters,
      charactersNoSpaces,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      readingTime,
      speakingTime,
      averageWordLength: Number(averageWordLength.toFixed(2)),
      longestWord,
    });

    const wordFrequency = {};
    words.forEach((word) => {
      const lowercaseWord = word.toLowerCase();
      if (lowercaseWord.length > 3) {
        wordFrequency[lowercaseWord] = (wordFrequency[lowercaseWord] || 0) + 1;
      }
    });

    const sortedKeywords = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => [word, Math.round((count / words.length) * 100)]);

    setKeywordDensity(sortedKeywords);

    const totalSyllables = words.reduce((sum, word) => sum + countSyllables(word), 0);
    const readabilityScore = 0.39 * (words.length / sentences.length) + 11.8 * (totalSyllables / words.length) - 15.59;
    setReadabilityScore(Number(readabilityScore.toFixed(2)));
  };

  const countSyllables = (word) => {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
    word = word.replace(/^y/, "");
    const syllables = word.match(/[aeiouy]{1,2}/g);
    return syllables ? syllables.length : 1;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({
        title: "Text Copied",
        description: "The text has been copied to your clipboard.",
      });
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast({
        title: "Copy Failed",
        description: "Failed to copy the text. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "analyzed_text.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Text Downloaded",
      description: "Your text file has been downloaded.",
    });
  };

  return (
    <>
      <Head>
        <title>Word Counter Tool | Fast Free Tools</title>
        <meta
          name="description"
          content="Analyze your text with our advanced Word Counter Tool. Get detailed statistics on word count, character count, readability, keyword density, and more."
        />
        <meta
          name="keywords"
          content="word counter, text analysis, character count, keyword density, readability score, reading time, speaking time"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://fastfreetools.com/word-counter" />
        <meta property="og:title" content="Word Counter Tool | Fast Free Tools" />
        <meta
          property="og:description"
          content="Analyze your text with our advanced Word Counter Tool. Get detailed statistics on word count, character count, readability, keyword density, and more."
        />
        <meta property="og:url" content="https://fastfreetools.com/word-counter" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Word Counter Tool | Fast Free Tools" />
        <meta
          name="twitter:description"
          content="Analyze your text with our advanced Word Counter Tool. Get detailed statistics on word count, character count, readability, keyword density, and more."
        />
        <meta charSet="UTF-8" />

      </Head>
      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-900 dark:to-red-900 p-4 sm:p-6">
          <main className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-in-out">
            <header className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 text-white p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl sm:text-4xl font-bold">Word Counter Tool</h1>
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
                        <p>Get help and information about the Word Counter Tool</p>
                      </TooltipContent>
                    </Tooltip>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>About Word Counter Tool</DialogTitle>
                        <DialogDescription>
                          <p className="mt-2">
                            <strong>Why:</strong> This tool helps you analyze your text, providing comprehensive insights into its structure and complexity.
                          </p>
                          <p className="mt-2">
                            <strong>What:</strong> It offers detailed statistics including word count, character count, readability score, keyword density, and more.
                          </p>
                          <p className="mt-2">
                            <strong>How:</strong> Simply paste or type your text into the input area, and the tool will automatically analyze it for you in real-time.
                          </p>
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
                      <p>Return to the home page</p>
                    </TooltipContent>
                  </Tooltip>

                  <ShareButton shareUrl={shareUrl} shareTitle={shareTitle} tooltipText="Share the Word Counter Tool" />

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        aria-label="Toggle theme"
                        className="bg-white/10 hover:bg-white/20 text-white"
                      >
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Switch between light and dark mode</p>
                    </TooltipContent>
                  </Tooltip>
                </nav>
              </div>
            </header>

            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="text-input" className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Enter Your Text
                </Label>
                <Textarea
                  id="text-input"
                  value={text}
                  onChange={(e) => setText(DOMPurify.sanitize(e.target.value))}
                  placeholder="Paste or type your text here..."
                  rows={10}
                  className="w-full p-2 border-2 border-purple-300 dark:border-purple-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  aria-label="Text input for analysis"
                />
                <div className="flex justify-end space-x-2">
                  <Button onClick={handleCopy} disabled={!text} className="bg-blue-500 hover:bg-blue-600 text-white">
                    {isCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {isCopied ? "Copied!" : "Copy"}
                  </Button>
                  <Button onClick={handleDownload} disabled={!text} className="bg-green-500 hover:bg-green-600 text-white">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="basic-stats">
                <TabsList className="grid w-full grid-cols-3 bg-purple-100 dark:bg-purple-900">
                  <TabsTrigger value="basic-stats" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                    <BarChart2 className="h-4 w-4 mr-2" />
                    Basic Stats
                  </TabsTrigger>
                  <TabsTrigger value="readability" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                    <Book className="h-4 w-4 mr-2" />
                    Readability
                  </TabsTrigger>
                  <TabsTrigger value="keyword-density" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                    <Clock className="h-4 w-4 mr-2" />
                    Keyword Density
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="basic-stats" className="p-4 bg-white dark:bg-gray-800 rounded-b-lg shadow-md">
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Words</TableCell>
                        <TableCell>{stats.words}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Characters (with spaces)</TableCell>
                        <TableCell>{stats.characters}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Characters (without spaces)</TableCell>
                        <TableCell>{stats.charactersNoSpaces}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Sentences</TableCell>
                        <TableCell>{stats.sentences}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Paragraphs</TableCell>
                        <TableCell>{stats.paragraphs}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Average Word Length</TableCell>
                        <TableCell>{stats.averageWordLength} characters</TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell className="font-medium">Longest Word</TableCell>
                        <TableCell>{stats.longestWord}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TabsContent>
                <TabsContent value="readability" className="p-4 bg-white dark:bg-gray-800 rounded-b-lg shadow-md">
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Readability Score (Flesch-Kincaid)</TableCell>
                        <TableCell>{readabilityScore}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Estimated Reading Time</TableCell>
                        <TableCell>{stats.readingTime} minute(s)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Estimated Speaking Time</TableCell>
                        <TableCell>{stats.speakingTime} minute(s)</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Readability Guide</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>90-100: Very Easy</li>
                      <li>80-89: Easy</li>
                      <li>70-79: Fairly Easy</li>
                      <li>60-69: Standard</li>
                      <li>50-59: Fairly Difficult</li>
                      <li>30-49: Difficult</li>
                      <li>0-29: Very Confusing</li>
                    </ul>
                  </div>
                </TabsContent>
                <TabsContent value="keyword-density" className="p-4 bg-white dark:bg-gray-800 rounded-b-lg shadow-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Keyword</TableHead>
                        <TableHead>Occurrences</TableHead>
                        <TableHead>Density (%)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {keywordDensity.map(([word, density]) => (
                        <TableRow key={word}>
                          <TableCell>{word}</TableCell>
                          <TableCell>{Math.round((density / 100) * stats.words)}</TableCell>
                          <TableCell>{density}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </TooltipProvider>
    </>
  );
}
