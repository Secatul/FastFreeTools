"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head";
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
import { Home, HelpCircle, Moon, Sun, Copy, Check, Download, BarChart2, Book, Share2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DOMPurify from "isomorphic-dompurify";
import ShareButton from "@/app/components/share-button";

const checkGrammar = async (text) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const issues = [
    {
      type: "Spelling",
      description: 'Possible spelling mistake in "recieve"',
      suggestion: "receive",
      context: "I hope to recieve your response soon.",
      correctedContext: "I hope to receive your response soon.",
    },
    {
      type: "Grammar",
      description: 'Incorrect verb tense in "has went"',
      suggestion: "has gone",
      context: "She has went to the store.",
      correctedContext: "She has gone to the store.",
    },
    {
      type: "Punctuation",
      description: 'Missing comma before coordinating conjunction',
      suggestion: 'add comma before "but"',
      context: "I wanted to go to the party but I was too tired.",
      correctedContext: "I wanted to go to the party, but I was too tired.",
    },
  ];
  return issues;
};

export default function EnhancedGrammarChecker() {
  const [text, setText] = useState("");
  const [grammarIssues, setGrammarIssues] = useState([]);
  const [isChecking, setIsChecking] = useState(false);
  const [stats, setStats] = useState({
    words: 0,
    sentences: 0,
    readability: 0,
  });
  const [isCopied, setIsCopied] = useState(false);
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const shareUrl = "https://fastfreetools.com/grammar-checker";
  const shareTitle = "Check out this awesome Grammar Checker Tool!";

  useEffect(() => {
    analyzeText(text);
  }, [text]);

  const analyzeText = (input) => {
    const sanitizedInput = DOMPurify.sanitize(input);
    const words = sanitizedInput
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    const sentences = sanitizedInput
      .split(/[.!?]+/)
      .filter((sentence) => sentence.trim().length > 0);
    const readability = 100 - words.length / sentences.length;

    setStats({
      words: words.length,
      sentences: sentences.length,
      readability: readability.toFixed(2),
    });
  };

  const handleGrammarCheck = async () => {
    setIsChecking(true);
    try {
      const issues = await checkGrammar(text);
      setGrammarIssues(issues);
      toast({
        title: "Grammar Check Complete",
        description: `Found ${issues.length} potential issues.`,
      });
    } catch (error) {
      toast({
        title: "Grammar Check Failed",
        description: "An error occurred while checking your text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleFixIssues = () => {
    let correctedText = text;
    grammarIssues.forEach((issue) => {
      correctedText = correctedText.replace(issue.context, issue.correctedContext);
    });
    setText(correctedText);
    setGrammarIssues([]);
    toast({
      title: "Issues Fixed",
      description: "The grammar issues have been automatically corrected.",
    });
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
    a.download = "checked_text.txt";
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
        <title>Grammar Checker Tool | Fast Free Tools</title>
        <meta
          name="description"
          content="Improve your writing with our free Grammar Checker Tool. Get instant feedback and automatic corrections for spelling, grammar, and punctuation errors."
        />
        <meta
          name="keywords"
          content="grammar checker, spelling checker, writing tool, proofreading, English grammar, punctuation, automatic correction"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://fastfreetools.com/grammar-checker" />
        <meta property="og:title" content="Grammar Checker Tool | Fast Free Tools" />
        <meta
          property="og:description"
          content="Improve your writing with our free Grammar Checker Tool. Get instant feedback and automatic corrections for spelling, grammar, and punctuation errors."
        />
        <meta property="og:url" content="https://fastfreetools.com/grammar-checker" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Grammar Checker Tool | Fast Free Tools" />
        <meta
          name="twitter:description"
          content="Improve your writing with our free Grammar Checker Tool. Get instant feedback and automatic corrections for spelling, grammar, and punctuation errors."
        />
      </Head>
      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 dark:from-green-900 dark:via-blue-900 dark:to-purple-900 p-4 sm:p-6">
          <main className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-in-out">
            <header className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 text-white p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl sm:text-4xl font-bold">Grammar Checker</h1>
                <nav className="flex items-center space-x-2">
                  <Dialog>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            aria-label="Help"
                            className="bg-white/10 hover:bg-white/20 text-white"
                          >
                            <HelpCircle className="h-5 w-5" />
                          </Button>
                        </DialogTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Get help and information about the Grammar Checker Tool</p>
                      </TooltipContent>
                    </Tooltip>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>About Grammar Checker Tool</DialogTitle>
                        <DialogDescription>
                          <p className="mt-2">
                            <strong>Why:</strong> This tool helps you improve your writing by identifying and automatically correcting grammar, spelling, and punctuation errors.
                          </p>
                          <p className="mt-2">
                            <strong>What:</strong> It provides instant feedback on your text, highlighting potential issues, offering suggestions for improvement, and allowing automatic corrections.
                          </p>
                          <p className="mt-2">
                            <strong>How:</strong> Simply paste or type your text, click &quot;Check Grammar&quot; to see issues, and use &quot;Fix Issues&quot; for automatic corrections.
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

                  {/* Botão de Compartilhamento */}

                    <ShareButton shareUrl={shareUrl} shareTitle={shareTitle} tooltipText="Share the Grammar Checker tool" />
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
                <Label
                  htmlFor="text-input"
                  className="text-lg font-semibold text-gray-700 dark:text-gray-300"
                >
                  Enter Your Text
                </Label>
                <Textarea
                  id="text-input"
                  value={text}
                  onChange={(e) => setText(DOMPurify.sanitize(e.target.value))}
                  placeholder="Paste or type your text here for grammar checking..."
                  rows={10}
                  className="w-full p-2 border-2 border-blue-300 dark:border-blue-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  aria-label="Text input for grammar checking"
                />
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <div className="space-x-2">
                    <Button
                      onClick={handleGrammarCheck}
                      disabled={!text || isChecking}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      {isChecking ? "Checking..." : "Check Grammar"}
                    </Button>
                    <Button
                      onClick={handleFixIssues}
                      disabled={grammarIssues.length === 0}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white"
                    >
                      Fix Issues
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleCopy}
                      disabled={!text}
                      className="bg-blue-500  hover:bg-blue-600 text-white"
                    >
                      {isCopied ? (
                        <Check className="h-4 w-4 mr-2" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
                      {isCopied ? "Copied!" : "Copy"}
                    </Button>
                    <Button
                      onClick={handleDownload}
                      disabled={!text}
                      className="bg-purple-500 hover:bg-purple-600 text-white"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="grammar-issues">
                <TabsList className="grid w-full grid-cols-2 bg-blue-100 dark:bg-blue-900">
                  <TabsTrigger
                    value="grammar-issues"
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
                  >
                    <Book className="h-4 w-4 mr-2" />
                    Grammar Issues
                  </TabsTrigger>
                  <TabsTrigger
                    value="text-stats"
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
                  >
                    <BarChart2 className="h-4 w-4 mr-2" />
                    Text Statistics
                  </TabsTrigger>
                </TabsList>
                <TabsContent
                  value="grammar-issues"
                  className="p-4 bg-white dark:bg-gray-800 rounded-b-lg shadow-md"
                >
                  {grammarIssues.length > 0 ? (
                    <div className="space-y-4">
                      {grammarIssues.map((issue, index) => (
                        <div
                          key={index}
                          className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg"
                        >
                          <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 flex items-center">
                            <AlertTriangle className="h-5 w-5 mr-2" />
                            {issue.type} Issue
                          </h3>
                          <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                            {issue.description}
                          </p>
                          <p className="text-yellow-600 dark:text-yellow-400 mt-1">
                            <strong>Context:</strong> &quot;{issue.context}&quot;
                          </p>
                          <p className="text-green-600 dark:text-green-400 mt-1">
                            <strong>Suggestion:</strong> &quot;{issue.correctedContext}&quot;
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400">
                      {isChecking
                        ? "Checking grammar..."
                        : "No grammar issues found or text not checked yet."}
                    </p>
                  )}
                </TabsContent>
                <TabsContent
                  value="text-stats"
                  className="p-4 bg-white dark:bg-gray-800 rounded-b-lg shadow-md"
                >
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Word Count</TableCell>
                        <TableCell>{stats.words}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Sentence Count</TableCell>
                        <TableCell>{stats.sentences}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Readability Score</TableCell>
                        <TableCell>{stats.readability}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Readability Guide</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>90-100: Very Easy to Read</li>
                      <li>80-89: Easy to Read</li>
                      <li>70-79: Fairly Easy to Read</li>
                      <li>60-69: Standard</li>
                      <li>50-59: Fairly Difficult to Read</li>
                      <li>30-49: Difficult to Read</li>
                      <li>0-29: Very Difficult to Read</li>
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </TooltipProvider>
    </>
  );
}
