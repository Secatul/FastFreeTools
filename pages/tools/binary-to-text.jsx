"use client";

import React, { useState } from 'react';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTheme } from "next-themes";
import { Home, HelpCircle, Copy, Check, Moon, Sun, RefreshCw } from 'lucide-react';
import Head from 'next/head';
import DOMPurify from 'dompurify';

export default function BinaryTextConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('binaryToText');
  const [error, setError] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const { theme, setTheme } = useTheme();

  const binaryToText = (binaryStr) => {
    return binaryStr.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
  };

  const textToBinary = (text) => {
    return text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
  };

  const handleConvert = () => {
    setError('');
    setOutput('');
    try {
      const sanitizedInput = DOMPurify.sanitize(input);
      if (mode === 'binaryToText') {
        const cleanedInput = sanitizedInput.replace(/[^01\s]/g, '');
        if (cleanedInput !== sanitizedInput) {
          setError('Invalid characters removed from input.');
        }
        setOutput(binaryToText(cleanedInput));
      } else {
        setOutput(textToBinary(sanitizedInput));
      }
    } catch (error) {
      setError('Invalid input. Please check and try again.');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'binaryToText' ? 'textToBinary' : 'binaryToText');
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <>
      <Head>
        <title>Binary ⇄ Text Converter | Your Tool Name</title>
        <meta name="description" content="Easily convert between binary and text formats with this online tool." />
        <meta name="keywords" content="Binary to Text, Text to Binary, Binary Converter, Encoding, Decoding" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-900 dark:to-red-900 p-4 sm:p-6">
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-[1.02]">
            <header className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 text-white p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl sm:text-4xl font-bold">Binary ⇄ Text Converter</h1>
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
                            <DialogTitle>About Binary ⇄ Text Converter</DialogTitle>
                            <DialogDescription>
                              <p className="mt-2">
                                <strong>Why:</strong> This tool allows you to convert between binary and text formats easily.
                              </p>
                              <p className="mt-2">
                                <strong>What:</strong> It can convert binary to text and vice versa, which is useful for encoding and decoding binary data.
                              </p>
                              <p className="mt-2">
                                <strong>How:</strong> Enter your input, choose the conversion direction, and click "Convert". The result will be displayed below.
                              </p>
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Get help and information about the Binary ⇄ Text Converter</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" asChild className="bg-white/10 hover:bg-white/20 text-white">
                        <Link href="/" aria-label="Home">
                          <Home className="h-5 w-5" />
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
                  <Label htmlFor="input" className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    {mode === 'binaryToText' ? 'Binary Input' : 'Text Input'}
                  </Label>
                  <Textarea
                    id="input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={mode === 'binaryToText' ? 'Enter binary (e.g., 01001000 01100101 01101100 01101100 01101111)' : 'Enter text to convert to binary'}
                    rows={5}
                    aria-label="Input for binary or text conversion"
                    className="w-full p-3 text-lg border-2 border-purple-300 dark:border-purple-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ease-in-out dark:bg-gray-700 dark:text-white"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Character count: {input.length}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <Button 
                    onClick={toggleMode} 
                    variant="outline"
                    className="w-full sm:w-auto bg-pink-100 hover:bg-pink-200 text-pink-800 dark:bg-pink-900 dark:hover:bg-pink-800 dark:text-pink-100"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Switch to {mode === 'binaryToText' ? 'Text to Binary' : 'Binary to Text'}
                  </Button>
                  <Button 
                    onClick={handleConvert} 
                    aria-label="Convert binary or text"
                    className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Convert
                  </Button>
                </div>

                {error && (
                  <p className="text-red-500 dark:text-red-400 font-semibold" role="status" aria-live="polite">
                    {error}
                  </p>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="output" className="text-lg font-semibold text-gray-700 dark:text-gray-300">Result</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      disabled={!output}
                      aria-label="Copy result"
                      className="bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-400"
                    >
                      {isCopied ? (
                        <Check className="h-4 w-4 mr-2" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
                      {isCopied ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                  <Textarea
                    id="output"
                    value={output}
                    readOnly
                    rows={5}
                    aria-label="Conversion result"
                    className="w-full p-3 text-lg bg-gray-100 dark:bg-gray-700 border-2 border-blue-300 dark:border-blue-600 rounded-md transition-all duration-300 ease-in-out dark:text-white"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Character count: {output.length}
                  </p>
                </div>
              </div>
            </main>
          </div>
        </div>
      </TooltipProvider>
    </>
  );
}