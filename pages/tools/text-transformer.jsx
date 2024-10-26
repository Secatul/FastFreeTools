"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import ShareButton from '@/app/components/share-button';
import Head from 'next/head';
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
import { Home, HelpCircle, Copy, Check, Moon, Sun, RotateCcw, ArrowDownUp, Shuffle, ArrowUpDown } from 'lucide-react';
import DOMPurify from 'dompurify';

export default function TextTransformer() {
  const [inputText, setInputText] = useState('');
  const [resultText, setResultText] = useState('');
  const [mode, setMode] = useState('reverse');
  const [reverseMode, setReverseMode] = useState('characters');
  const [preserveWhitespace, setPreserveWhitespace] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [fullRandomize, setFullRandomize] = useState(false);
  const [caseMode, setCaseMode] = useState('preserve');
  const { theme, setTheme } = useTheme();

  const shareUrl = "https://fastfreetools.com/text-transformer";
  const shareTitle = "Check out this Text Transformer Tool!";

  const transformText = useCallback(() => {
    let transformed = '';

    const applyTransformation = (text) => {
      if (mode === 'reverse') {
        if (reverseMode === 'characters') {
          return preserveWhitespace
            ? text.split('').reverse().join('')
            : text.replace(/\s+/g, '').split('').reverse().join('');
        } else if (reverseMode === 'words') {
          return text.split(' ').reverse().join(' ');
        } else if (reverseMode === 'sentences') {
          return text.match(/[^.!?]+[.!?]+/g)?.reverse().join(' ') || '';
        }
      } else if (mode === 'scramble') {
        return text.split(' ').map(word => {
          if (word.length <= 3 || fullRandomize) {
            return shuffleString(word);
          } else {
            const middle = word.slice(1, -1);
            return word[0] + shuffleString(middle) + word[word.length - 1];
          }
        }).join(' ');
      } else if (mode === 'swap') {
        return text.split(' ').map(word => {
          return word.split('').map((char, index, arr) => {
            if (index % 2 === 0 && index < arr.length - 1) {
              return arr[index + 1];
            } else if (index % 2 === 1) {
              return arr[index - 1];
            }
            return char;
          }).join('');
        }).join(' ');
      }
      return text;
    };

    transformed = applyTransformation(inputText);

    if (caseMode === 'upper') {
      transformed = transformed.toUpperCase();
    } else if (caseMode === 'lower') {
      transformed = transformed.toLowerCase();
    }

    setResultText(DOMPurify.sanitize(transformed));
  }, [inputText, mode, reverseMode, preserveWhitespace, fullRandomize, caseMode]);

  useEffect(() => {
    transformText();  // Re-transform text immediately on change
  }, [transformText]);

  const handleInputChange = (e) => {
    const sanitizedInput = DOMPurify.sanitize(e.target.value);
    setInputText(sanitizedInput);
  };

  const shuffleString = (str) => {
    return str.split('').sort(() => Math.random() - 0.5).join('');
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
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
      <Head>
        <title>Text Transformer | Fast Free Tools</title>
        <meta
          name="description"
          content="Transform text by reversing, scrambling, or swapping characters. Includes various modes and options for customization."
        />
        <meta
          name="keywords"
          content="Text Transformer, Reverse text, Scramble text, Swap characters, Text manipulation, Text tool, Text utility"
        />
        <meta name="author" content="Fast Free Tools" />
        <meta property="og:title" content="Text Transformer - Manipulate Text Instantly | Fast Free Tools" />
        <meta
          property="og:description"
          content="Easily transform your text with various modes including reverse, scramble, and swap. Customize options and see instant results."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fastfreetools.com/text-transformer" />
        <meta property="og:image" content="https://fastfreetools.com/images/text-transformer-preview.png" />
        <meta property="og:site_name" content="Fast Free Tools" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Text Transformer - Manipulate Text Instantly | Fast Free Tools" />
        <meta
          name="twitter:description"
          content="Transform text by reversing, scrambling, or swapping characters. Includes various modes and options for customization."
        />
        <meta name="twitter:image" content="https://fastfreetools.com/images/text-transformer-preview.png" />
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-900 dark:to-red-900 p-4 sm:p-6">
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-[1.02]">
            {/* Header and Navigation */}
            <header className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 text-white p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2">Text Transformer</h1>
                  <p className="text-blue-100 dark:text-blue-200">
                    Transform your text in magical ways!
                  </p>
                </div>
                <nav className="flex flex-wrap items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" aria-label="Open Help" className="bg-white/10 hover:bg-white/20 text-white">
                            <HelpCircle className="h-5 w-5" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>About Text Transformer</DialogTitle>
                            <DialogDescription>
                              <p><strong>What:</strong> Transform text by reversing, scrambling, or swapping characters.</p>
                              <p><strong>How:</strong> Enter text, choose transformation mode, and see instant results.</p>
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Get help and information about the Text Transformer</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" asChild>
                        <Link href="/" aria-label="Home">
                          <Home className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Return to the home page</p>
                    </TooltipContent>
                  </Tooltip>

                  <ShareButton shareUrl={shareUrl} shareTitle={shareTitle} tooltipText="Share the Text Transformer Tool" />

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
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Switch between light and dark mode</p>
                    </TooltipContent>
                  </Tooltip>
                </nav>
              </div>
            </header>

            {/* Main Section */}
            <main className="p-6 space-y-6">
              {/* Input Section */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="input-text" className="text-lg font-semibold text-gray-700 dark:text-gray-300">Input</Label>
                  <Textarea
                    id="input-text"
                    value={inputText}
                    onChange={handleInputChange}
                    placeholder="Enter your text here..."
                    rows={5}
                    aria-label="Input text to transform"
                    className="w-full p-3 text-lg border-2 border-purple-300 dark:border-purple-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ease-in-out"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Character count: {inputText.length}</p>
                </div>

                {/* Transformation Mode Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900 dark:to-purple-900 p-4 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="transform-mode" className="text-gray-700 dark:text-gray-300">Transform mode:</Label>
                    <Select value={mode} onValueChange={setMode}>
                      <SelectTrigger className="w-full bg-white dark:bg-gray-700" id="transform-mode">
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reverse">Reverse</SelectItem>
                        <SelectItem value="scramble">Scramble</SelectItem>
                        <SelectItem value="swap">Swap Characters</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {mode === 'reverse' && (
                    <div className="space-y-2">
                      <Label htmlFor="reverse-mode" className="text-gray-700 dark:text-gray-300">Reverse by:</Label>
                      <Select value={reverseMode} onValueChange={setReverseMode}>
                        <SelectTrigger className="w-full bg-white dark:bg-gray-700" id="reverse-mode">
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="characters">Characters</SelectItem>
                          <SelectItem value="words">Words</SelectItem>
                          <SelectItem value="sentences">Sentences</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {mode === 'scramble' && (
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="full-randomize"
                        checked={fullRandomize}
                        onCheckedChange={setFullRandomize}
                        aria-label="Full randomize"
                      />
                      <Label htmlFor="full-randomize" className="text-gray-700 dark:text-gray-300">Full randomize</Label>
                    </div>
                  )}
                  {mode === 'reverse' && reverseMode === 'characters' && (
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="preserve-whitespace"
                        checked={preserveWhitespace}
                        onCheckedChange={setPreserveWhitespace}
                        aria-label="Preserve whitespace"
                      />
                      <Label htmlFor="preserve-whitespace" className="text-gray-700 dark:text-gray-300">Preserve whitespace</Label>
                    </div>
                  )}
                </div>

                {/* Case Mode */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900 p-4 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="case-mode" className="text-gray-700 dark:text-gray-300">Case:</Label>
                    <Select value={caseMode} onValueChange={setCaseMode}>
                      <SelectTrigger className="w-full bg-white dark:bg-gray-700" id="case-mode">
                        <SelectValue placeholder="Select case" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="preserve">Preserve</SelectItem>
                        <SelectItem value="upper">UPPERCASE</SelectItem>
                        <SelectItem value="lower">lowercase</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Result Section */}
                <div className="space-y-2">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <Label htmlFor="result-text" className="text-lg font-semibold text-gray-700 dark:text-gray-300">Result</Label>
                    <div className="flex flex-wrap gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSwap}
                            aria-label="Swap input and result"
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            <ArrowDownUp className="h-4 w-4 mr-2" />
                            Swap
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Swap input and result</p>
                        </TooltipContent>
                      </Tooltip>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(resultText)}
                        disabled={!resultText}
                        aria-label="Copy result text"
                        className="bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-400"
                      >
                        {isCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                        {isCopied ? 'Copied!' : 'Copy'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(`Original: ${inputText}\nTransformed: ${resultText}`)}
                        disabled={!inputText || !resultText}
                        aria-label="Copy both original and transformed text"
                        className="bg-purple-500 hover:bg-purple-600 text-white disabled:bg-gray-400"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Both
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    id="result-text"
                    value={resultText}
                    readOnly
                    rows={5}
                    aria-label="Resulting transformed text"
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
