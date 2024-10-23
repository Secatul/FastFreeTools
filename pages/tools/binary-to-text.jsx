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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTheme } from "next-themes";
import { Home, HelpCircle, Copy, Check, Moon, Sun, RefreshCw } from 'lucide-react';
import Head from 'next/head';
import DOMPurify from 'dompurify';  // Import DOMPurify for sanitization

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
      // Sanitize input using DOMPurify
      const sanitizedInput = DOMPurify.sanitize(input);
      if (mode === 'binaryToText') {
        const cleanedInput = sanitizedInput.replace(/[^01\s]/g, ''); // Remove non-binary characters
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
        <div className="max-w-2xl mx-auto p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Binary ⇄ Text Converter</h1>
            <div className="space-x-2 flex items-center">
              <Dialog>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" aria-label="Open Help">
                        <HelpCircle className="h-4 w-4" />
                        <span className="sr-only">Help</span>
                      </Button>
                    </DialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Get help and information about the Binary ⇄ Text Converter</p>
                  </TooltipContent>
                </Tooltip>
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
                        <p className="mt-2">
                          <strong>How:</strong> Enter your input, choose the conversion direction, and click &quot;Convert&quot;. The result will be displayed below.
                        </p>

                      </p>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" asChild>
                    <a href="/" aria-label="Home">
                      <Home className="h-4 w-4" />
                      <span className="sr-only">Home</span>
                    </a>
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
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="input">
              {mode === 'binaryToText' ? 'Binary Input' : 'Text Input'}
            </Label>
            <Textarea
              id="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'binaryToText' ? 'Enter binary (e.g., 01001000 01100101 01101100 01101100 01101111)' : 'Enter text to convert to binary'}
              rows={5}
              aria-label="Input for binary or text conversion"
            />
            <p className="text-sm text-muted-foreground">
              Character count: {input.length}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <Button onClick={toggleMode} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Switch to {mode === 'binaryToText' ? 'Text to Binary' : 'Binary to Text'}
            </Button>
            <Button onClick={handleConvert} aria-label="Convert binary or text">
              Convert
            </Button>
          </div>

          {error && (
            <p className="text-destructive" role="status" aria-live="polite">
              {error}
            </p>
          )}

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="output">Result</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                disabled={!output}
                aria-label="Copy result"
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
            />
            <p className="text-sm text-muted-foreground">
              Character count: {output.length}
            </p>
          </div>
        </div>
      </TooltipProvider>
    </>
  );
}