"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "next-themes";
import { Home, HelpCircle, Copy, Check, Moon, Sun, RotateCcw, ArrowDownUp } from 'lucide-react';
import DOMPurify from 'dompurify';

export default function TextReverter() {
  const [inputText, setInputText] = useState('');
  const [resultText, setResultText] = useState('');
  const [reverseMode, setReverseMode] = useState('characters');
  const [preserveWhitespace, setPreserveWhitespace] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    handleReverse();
  }, [inputText, reverseMode, preserveWhitespace]);

  const handleInputChange = (e) => {
    const sanitizedInput = DOMPurify.sanitize(e.target.value);
    setInputText(sanitizedInput);
  };

  const handleReverse = () => {
    let reversed;
    if (reverseMode === 'characters') {
      reversed = preserveWhitespace
        ? inputText.split('').reverse().join('')
        : inputText.replace(/\s+/g, '').split('').reverse().join('');
    } else if (reverseMode === 'words') {
      reversed = inputText.split(/\s+/).reverse().join(' ');
    } else if (reverseMode === 'sentences') {
      reversed = inputText.match(/[^.!?]+[.!?]+/g)?.reverse().join(' ') || '';
    }
    setResultText(DOMPurify.sanitize(reversed));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resultText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleSwap = () => {
    setInputText(resultText);
    setResultText(inputText);
  };

  return (
    <>
      <meta name="description" content="Reverse text by characters, words, or sentences with the Text Reverser tool. Includes whitespace preservation, instant reversal, and copy-to-clipboard functionality." />
      <meta name="keywords" content="Text Reverser, Reverse text, Text manipulation, Reverse characters, Reverse words, Reverse sentences, Text tool, Text utility, Whitespace preservation" />
      <meta name="author" content="Your Name" />
      <meta property="og:title" content="Text Reverser - Reverse Text Instantly" />
      <meta property="og:description" content="Easily reverse your text by characters, words, or sentences. Preserve whitespace, swap input and output, and copy the result with one click." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://yourwebsite.com/text-reverser" />
      <meta property="og:image" content="https://yourwebsite.com/images/text-reverser-preview.png" />
      <meta property="og:site_name" content="Your Website Name" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Text Reverser - Reverse Text Instantly" />
      <meta name="twitter:description" content="Reverse text by characters, words, or sentences instantly. Includes whitespace preservation and copy-to-clipboard functionality." />
      <meta name="twitter:image" content="https://yourwebsite.com/images/text-reverser-preview.png" />

      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-900 dark:to-red-900 p-4 sm:p-6">
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-[1.02]">
            <header className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 text-white p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2">Text Reverser</h1>
                  <p className="text-blue-100 dark:text-blue-200">
                    Transform your text in magical ways!
                  </p>
                </div>
                <nav className="flex items-center space-x-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" aria-label="Open Help" className="bg-white/10 hover:bg-white/20 text-white">
                            <HelpCircle className="h-5 w-5" />
                            <span className="sr-only">Help</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>About Text Reverser</DialogTitle>
                            <DialogDescription>
                              <p><strong>What:</strong> Reverse text by characters, words, or sentences.</p>
                              <p><strong>How:</strong> Enter text, choose reversal mode, and see instant results.</p>
                              <p><strong>Features:</strong></p>
                              <ul className="list-disc pl-5">
                                <li>Multiple reversal modes</li>
                                <li>Whitespace preservation option</li>
                                <li>Instant reversal</li>
                                <li>Swap input/output</li>
                                <li>Copy to clipboard</li>
                              </ul>
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Get help and information about the Text Reverser</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" asChild>
                        <Link href="/" aria-label="Home">
                          <Home className="h-4 w-4" />
                          <span className="sr-only">Home</span>
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Return to the home page</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        aria-label="Toggle dark mode"
                        className="bg-white/10 hover:bg-white/20 text-white"
                      >
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Switch between light and dark mode</p>
                    </TooltipContent>
                  </Tooltip>
                </nav>
              </div>
            </header>

            <main className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="input-text" className="text-lg font-semibold text-gray-700 dark:text-gray-300">Input</Label>
                  <Textarea
                    id="input-text"
                    value={inputText}
                    onChange={handleInputChange}
                    placeholder="Enter your text here..."
                    rows={5}
                    aria-label="Input text to reverse"
                    className="w-full p-3 text-lg border-2 border-purple-300 dark:border-purple-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ease-in-out"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Character count: {inputText.length}</p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900 dark:to-purple-900 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="reverse-mode" className="text-gray-700 dark:text-gray-300">Reverse by:</Label>
                    <Select value={reverseMode} onValueChange={setReverseMode}>
                      <SelectTrigger className="w-[180px] bg-white dark:bg-gray-700" id="reverse-mode">
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="characters">Characters</SelectItem>
                        <SelectItem value="words">Words</SelectItem>
                        <SelectItem value="sentences">Sentences</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="preserve-whitespace"
                      checked={preserveWhitespace}
                      onCheckedChange={setPreserveWhitespace}
                      aria-label="Preserve whitespace"
                    />
                    <Label htmlFor="preserve-whitespace" className="text-gray-700 dark:text-gray-300">Preserve whitespace</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="result-text" className="text-lg font-semibold text-gray-700 dark:text-gray-300">Result</Label>
                    <div className="space-x-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSwap}
                            aria-label="Swap input and result"
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            <ArrowDownUp className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Swap input and result</p>
                        </TooltipContent>
                      </Tooltip>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopy}
                        disabled={!resultText}
                        aria-label="Copy result text"
                        className="bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-400"
                      >
                        {isCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                        {isCopied ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    id="result-text"
                    value={resultText}
                    readOnly
                    rows={5}
                    aria-label="Resulting reversed text"
                    className="w-full p-3 text-lg bg-gray-100 dark:bg-gray-700 border-2 border-blue-300 dark:border-blue-600 rounded-md transition-all duration-300 ease-in-out"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Character count: {resultText.length}</p>
                </div>
              </div>
            </main>
          </div>
        </div>
      </TooltipProvider>
    </>
  );
}
