"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import DOMPurify from "dompurify";
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
        <meta property="og:url" content="https://example.com/base64-converter" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://example.com/image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Base64 Converter" />
        <meta
          name="twitter:description"
          content="A quick and easy way to encode and decode text using Base64 encoding."
        />
        <meta name="twitter:image" content="https://example.com/image.jpg" />
      </Head>

      <TooltipProvider>
        <div className="max-w-2xl mx-auto p-6 space-y-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold">Base64 Converter</h1>
              <p className="text-muted-foreground">
                Easily encode or decode text using Base64 format.
              </p>
            </div>
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
                    <p>Get help and information about the Base64 Converter</p>
                  </TooltipContent>
                </Tooltip>
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
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
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

          <main>
            <div className="space-y-2">
              <Label htmlFor="input-text">Input</Label>
              <Textarea
                id="input-text"
                value={inputText}
                onChange={handleInputChange}
                placeholder="Enter your text here..."
                rows={5}
                aria-label="Input text to encode or decode"
              />
              <p className="text-sm text-muted-foreground">Character count: {inputText.length}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="encoding-mode"
                  checked={isEncoding}
                  onCheckedChange={toggleEncoding}
                  aria-label="Toggle between encoding and decoding"
                />
                <Label htmlFor="encoding-mode">{isEncoding ? "Encoding" : "Decoding"}</Label>
              </div>
              <Button onClick={handleConvert} aria-label={`Convert text to ${isEncoding ? "Base64" : "plain text"}`}>
                {isEncoding ? "Encode to Base64" : "Decode from Base64"}
              </Button>
            </div>

            {error && (
              <p className="text-destructive" role="status" aria-live="polite">
                {error}
              </p>
            )}

            <div>
              <div className="flex justify-between items-center py-2">
                <Label htmlFor="result-text">Result</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  disabled={!resultText}
                  aria-label="Copy result text"
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
              />
              <p className="text-sm text-muted-foreground">Character count: {resultText.length}</p>
            </div>
          </main>
        </div>
      </TooltipProvider>
    </>
  );
}
