"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import DOMPurify from "isomorphic-dompurify";
import { Label } from "@/components/ui/label";
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
import { useTheme } from "next-themes";
import { Home, HelpCircle, Copy, Check, Moon, Sun } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import ShareButton from "@/app/components/share-button";

export default function Base64Converter() {
  const [inputText, setInputText] = useState("");
  const [resultText, setResultText] = useState("");
  const [isEncoding, setIsEncoding] = useState(true);
  const [error, setError] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setResultText("");
    setError("");
  }, [isEncoding]);

  const handleInputChange = (e) => {
    const sanitizedQuery = DOMPurify.sanitize(e.target.value);
    setInputText(sanitizedQuery);
  };

  const toggleEncoding = () => {
    setIsEncoding(!isEncoding);
  };

  const handleConvert = () => {
    try {
      let result;
      if (isEncoding) {
        result = btoa(inputText);
      } else {
        result = atob(inputText);
      }
      setResultText(DOMPurify.sanitize(result));
      setError("");
    } catch (err) {
      setError("Invalid Base64 string for decoding.");
      setResultText("");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resultText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // URL e título para compartilhamento
  const shareUrl = "https://fastfreetools.com/base64-converter";
  const shareTitle = "Check out this awesome Base64 Converter Tool!";

  return (
    <>
      <Head>
        <title>Base64 Converter | Encode and Decode Text</title>
        <meta
          name="description"
          content="Easily encode or decode text to Base64 format. This Base64 converter tool allows you to encode or decode text online."
        />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Base64 Converter" />
        <meta
          property="og:description"
          content="Convert text to Base64 or decode Base64 to text effortlessly with our online tool."
        />
        <meta property="og:url" content="https://fastfreetools.com/base64-converter" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://fastfreetools.com/image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Base64 Converter" />
        <meta
          name="twitter:description"
          content="A quick and easy way to encode and decode text using Base64 encoding."
        />
        <meta name="twitter:image" content="https://fastfreetools.com/image.jpg" />
      </Head>

      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-900 dark:to-red-900 p-4 sm:p-6">
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-[1.02]">
            <header className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 text-white p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2">Base64 Converter</h1>
                  <p className="text-blue-100 dark:text-blue-200">
                    Encode or decode text using Base64 format
                  </p>
                </div>
                <nav className="flex items-center space-x-2">


                  {/* Botão de ajuda */}
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
                            <DialogTitle>About Base64 Converter</DialogTitle>
                            <DialogDescription>
                              <div>
                                <strong>Why:</strong> The Base64 Converter tool helps you encode
                                and decode text to and from Base64 format.
                              </div>
                              <div>
                                <strong>What:</strong> Convert plain text to Base64 and vice versa,
                                useful for data encoding and transmission.
                              </div>
                              <div>
                                <strong>How:</strong> Enter your text, choose encoding or decoding,
                                and click convert.
                              </div>
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Get help and information about the Base64 Converter</p>
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

                  <ShareButton shareUrl={shareUrl} shareTitle={shareTitle} tooltipText="Share the Base64 Converter tool" />

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
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
                    aria-label="Input text to encode or decode"
                    className="w-full p-3 text-lg border-2 border-purple-300 dark:border-purple-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ease-in-out dark:bg-gray-700 dark:text-white"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Character count: {inputText.length}</p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900 dark:to-purple-900 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="encoding-mode"
                      checked={isEncoding}
                      onCheckedChange={toggleEncoding}
                      aria-label="Toggle between encoding and decoding"
                    />
                    <Label htmlFor="encoding-mode" className="text-gray-700 dark:text-gray-300">{isEncoding ? "Encoding" : "Decoding"}</Label>
                  </div>
                  <Button
                    onClick={handleConvert}
                    aria-label={`Convert text to ${isEncoding ? "Base64" : "plain text"}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    {isEncoding ? "Encode to Base64" : "Decode from Base64"}
                  </Button>
                </div>

                {error && (
                  <p className="text-red-500 dark:text-red-400 font-semibold" role="status" aria-live="polite">
                    {error}
                  </p>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="result-text" className="text-lg font-semibold text-gray-700 dark:text-gray-300">Result</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      disabled={!resultText}
                      aria-label="Copy result text"
                      className="bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-400"
                    >
                      {isCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                      {isCopied ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                  <Textarea
                    id="result-text"
                    value={resultText}
                    readOnly
                    rows={5}
                    aria-label="Resulting encoded or decoded text"
                    className="w-full p-3 text-lg bg-gray-100 dark:bg-gray-700 border-2 border-blue-300 dark:border-blue-600 rounded-md transition-all duration-300 ease-in-out dark:text-white"
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
