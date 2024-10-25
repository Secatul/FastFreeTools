"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme } from "next-themes";
import { Home, HelpCircle, Moon, Sun, Copy, Check, Download, RefreshCw, Type, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import DOMPurify from "isomorphic-dompurify";

const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`;

export default function LoremIpsumGenerator() {
  const [generatedText, setGeneratedText] = useState("");
  const [amount, setAmount] = useState(1);
  const [unit, setUnit] = useState("paragraphs");
  const [startWithLoremIpsum, setStartWithLoremIpsum] = useState(true);
  const [customWords, setCustomWords] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [stats, setStats] = useState({
    characters: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
  });
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const shareUrl = "https://fastfreetools.com/lorem-ipsum-generator";
  const shareTitle = "Check out this Lorem Ipsum Generator Tool!";

  useEffect(() => {
    updateStats(generatedText);
  }, [generatedText]);

  const sanitizeAmount = (input) => {
    const sanitizedValue = Math.min(100, Math.max(1, parseInt(input) || 1));
    setAmount(sanitizedValue);
  };

  const generateLoremIpsum = () => {
    let result = "";
    const words = customWords
      ? customWords.split(",").map((word) => word.trim()).filter(word => word !== "")
      : loremIpsum.split(" ");

    if (unit === "words") {
      while (result.split(/\s+/).filter(word => word.length > 0).length < amount) {
        result += words[Math.floor(Math.random() * words.length)] + " ";
      }
      result = result.trim().split(/\s+/).slice(0, amount).join(" ");
    } else if (unit === "sentences") {
      for (let i = 0; i < amount; i++) {
        let sentence = "";
        while (sentence.split(/\s+/).filter(word => word.length > 0).length < 5) {
          sentence += words[Math.floor(Math.random() * words.length)] + " ";
        }
        result += sentence.trim().charAt(0).toUpperCase() + sentence.trim().slice(1) + ". ";
      }
    } else {
      for (let i = 0; i < amount; i++) {
        let paragraph = "";
        for (let j = 0; j < 3; j++) {
          let sentence = "";
          while (sentence.split(/\s+/).filter(word => word.length > 0).length < 5) {
            sentence += words[Math.floor(Math.random() * words.length)] + " ";
          }
          paragraph += sentence.trim().charAt(0).toUpperCase() + sentence.trim().slice(1) + ". ";
        }
        result += paragraph + (i < amount - 1 ? "\n\n" : "");
      }
    }

    if (startWithLoremIpsum && unit !== "words") {
      result = "Lorem ipsum " + result.charAt(0).toLowerCase() + result.slice(1);
    }

    setGeneratedText(DOMPurify.sanitize(result));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({
        title: "Text Copied",
        description: "The generated Lorem Ipsum has been copied to your clipboard.",
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
    const blob = new Blob([generatedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lorem_ipsum.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Text Downloaded",
      description: "Your Lorem Ipsum text file has been downloaded.",
    });
  };

  const updateStats = (text) => {
    setStats({
      characters: text.length,
      words: text.split(/\s+/).filter(word => word.length > 0).length,
      sentences: text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length,
      paragraphs: text.split(/\n\n+/).filter(para => para.trim().length > 0).length,
    });
  };

  const handleClearInput = () => {
    setGeneratedText("");
    setCustomWords("");
    setClearDialogOpen(false);
    toast({
      title: "Input Cleared",
      description: "The input has been cleared.",
    });
  };

  return (
    <>
      <Head>
        <title>Lorem Ipsum Generator | Fast Free Tools</title>
        <meta
          name="description"
          content="Generate Lorem Ipsum placeholder text for your designs and projects. Choose the amount and unit of text to fit your needs."
        />
        <meta
          name="keywords"
          content="Lorem Ipsum generator, placeholder text generator, design placeholder, text generator"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://fastfreetools.com/lorem-ipsum-generator" />
        <meta property="og:title" content="Lorem Ipsum Generator | Fast Free Tools" />
        <meta
          property="og:description"
          content="Easily generate Lorem Ipsum placeholder text for your designs, websites, or projects. Choose between words, sentences, or paragraphs."
        />
        <meta property="og:url" content="https://fastfreetools.com/lorem-ipsum-generator" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Lorem Ipsum Generator | Fast Free Tools" />
        <meta
          name="twitter:description"
          content="Generate placeholder Lorem Ipsum text for your projects. Choose the amount of words, sentences, or paragraphs you need."
        />
        <meta charSet="UTF-8" />
      </Head>
      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-900 dark:to-red-900 p-4 sm:p-6">
          <main className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-in-out">
            <header className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 text-white p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl sm:text-4xl font-bold">Lorem Ipsum Generator</h1>
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
                        <p>Get help and information about the Lorem Ipsum Generator</p>
                      </TooltipContent>
                    </Tooltip>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>About Lorem Ipsum Generator</DialogTitle>
                        <DialogDescription>
                          <p className="mt-2">
                            <strong>Why:</strong> Lorem Ipsum is commonly used as placeholder text in design and publishing.
                          </p>
                          <p className="mt-2">
                            <strong>What:</strong> This tool generates Lorem Ipsum text based on your specifications.
                          </p>
                          <p className="mt-2">
                            <strong>How:</strong> Choose the amount and unit of text you want, then click "Generate" to create your Lorem Ipsum text.
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

                  <ShareButton shareUrl={shareUrl} shareTitle={shareTitle} tooltipText="Share the Lorem Ipsum Generator" />

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
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="w-full sm:w-1/3">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="1"
                      max="100"
                      value={amount}
                      onChange={(e) => sanitizeAmount(e.target.value)}
                      className="mt-1"
                      aria-label="Amount of Lorem Ipsum"
                    />
                  </div>
                  <div className="w-full sm:w-1/3">
                    <Label htmlFor="unit">Unit</Label>
                    <Select
                      value={unit}
                      onValueChange={(value) => setUnit(value)}
                      aria-label="Select unit for Lorem Ipsum"
                    >
                      <SelectTrigger id="unit" className="mt-1">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paragraphs">Paragraphs</SelectItem>
                        <SelectItem value="sentences">Sentences</SelectItem>
                        <SelectItem value="words">Words</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full sm:w-1/3 flex items-center space-x-2">
                    <Switch
                      id="start-with-lorem"
                      checked={startWithLoremIpsum}
                      onCheckedChange={setStartWithLoremIpsum}
                      aria-label='Toggle "Start with Lorem Ipsum"'
                      className="data-[state=checked]:bg-blue-500 dark:data-[state=checked]:bg-blue-400"
                    />
                    <Label htmlFor="start-with-lorem">Start with "Lorem ipsum"</Label>
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="custom-words">Custom Words (comma-separated)</Label>
                  <Input
                    id="custom-words"
                    type="text"
                    value={customWords}
                    onChange={(e) => setCustomWords(e.target.value)}
                    placeholder="e.g., apple, banana, orange"
                    className="mt-1"
                    aria-label="Custom words for Lorem Ipsum"
                  />
                </div>
                <Button 
                  onClick={generateLoremIpsum} 
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700" 
                  aria-label="Generate Lorem Ipsum"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate Lorem Ipsum
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row justify-between  items-start sm:items-center gap-2">
                  <Label htmlFor="generated-text" className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Generated Lorem Ipsum
                  </Label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Characters: {stats.characters} | Words: {stats.words}
                    </p>
                    <Dialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 border-red-500 hover:bg-red-100 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-900"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Clear
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm Clear Input</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to clear the input? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end space-x-2">
                          <Button onClick={() => setClearDialogOpen(false)} variant="secondary">
                            Cancel
                          </Button>
                          <Button onClick={handleClearInput} variant="destructive">
                            Clear
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                <div className="relative">
                  <Textarea
                    id="generated-text"
                    value={generatedText}
                    readOnly
                    rows={10}
                    className="w-full p-2 font-serif text-sm bg-gray-100 dark:bg-gray-700 border-2 border-blue-300 dark:border-blue-600 rounded-md transition-all duration-300 ease-in-out"
                    aria-label="Generated Lorem Ipsum"
                  />
                </div>
                <div className="flex justify-end space-x-2 mt-2">
                  <Button onClick={handleCopy} disabled={!generatedText} className="bg-blue-500 hover:bg-blue-600 text-white">
                    {isCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {isCopied ? "Copied!" : "Copy"}
                  </Button>
                  <Button onClick={handleDownload} disabled={!generatedText} className="bg-green-500 hover:bg-green-600 text-white">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="stats">
                <TabsList className="grid w-full grid-cols-1 bg-purple-100 dark:bg-purple-900">
                  <TabsTrigger value="stats" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                    <Type className="h-4 w-4 mr-2" />
                    Text Statistics
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="stats" className="p-4 bg-white dark:bg-gray-800 rounded-b-lg shadow-md">
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Characters</TableCell>
                        <TableCell>{stats.characters}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Words</TableCell>
                        <TableCell>{stats.words}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Sentences</TableCell>
                        <TableCell>{stats.sentences}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Paragraphs</TableCell>
                        <TableCell>{stats.paragraphs}</TableCell>
                      </TableRow>
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