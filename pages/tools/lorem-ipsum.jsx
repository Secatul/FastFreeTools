"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTheme } from "next-themes";
import { Home, HelpCircle, Copy, Check, Moon, Sun, RefreshCw } from "lucide-react";

// Placeholder text used for generating Lorem Ipsum content
const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

export default function LoremIpsumGenerator() {
  const [generatedText, setGeneratedText] = useState("");
  const [amount, setAmount] = useState(1);
  const [unit, setUnit] = useState("paragraphs");
  const [startWithLoremIpsum, setStartWithLoremIpsum] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const { theme, setTheme } = useTheme();

  const sanitizeAmount = (input) => {
    const sanitizedValue = Math.min(100, Math.max(1, parseInt(input) || 1)); // Sanitize value between 1 and 100
    setAmount(sanitizedValue);
  };

  const generateLoremIpsum = () => {
    let result = "";
    const words = loremIpsum.split(" ");

    if (unit === "words") {
      result = words.slice(0, amount).join(" ");
    } else if (unit === "sentences") {
      const sentences = loremIpsum.split(".");
      result = sentences.slice(0, amount).join(". ") + ".";
    } else {
      for (let i = 0; i < amount; i++) {
        result += loremIpsum + (i < amount - 1 ? "\n\n" : "");
      }
    }

    if (!startWithLoremIpsum && unit !== "words") {
      result = result.replace("Lorem ipsum ", ""); // Remove "Lorem ipsum" if unchecked
    }

    setGeneratedText(result);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (

    <>

      <Head>
        <title>Lorem Ipsum Generator</title>
        <meta
          name="description"
          content="Generate Lorem Ipsum placeholder text for your designs and projects. Choose the amount and unit of text to fit your needs."
        />
        <meta
          name="keywords"
          content="Lorem Ipsum generator, placeholder text generator, design placeholder, text generator"
        />
        <meta name="author" content="Your Name or Company" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Lorem Ipsum Generator" />
        <meta
          property="og:description"
          content="Easily generate Lorem Ipsum placeholder text for your designs, websites, or projects. Choose between words, sentences, or paragraphs."
        />
        <meta property="og:image" content="https://example.com/og-image.jpg" />
        <meta property="og:url" content="https://example.com/lorem-ipsum-generator" />
        <meta property="og:type" content="website" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Lorem Ipsum Generator" />
        <meta
          name="twitter:description"
          content="Generate placeholder Lorem Ipsum text for your projects. Choose the amount of words, sentences, or paragraphs you need."
        />
        <meta name="twitter:image" content="https://example.com/twitter-image.jpg" />

        {/* Responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Charset and Favicon */}
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Lorem Ipsum Generator</h1>
          <div className="space-x-2 flex items-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Help">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </DialogTrigger>
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
            <Button variant="outline" size="icon" asChild aria-label="Home">
              <a href="/">
                <Home className="h-4 w-4" />
              </a>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </div>
        </header>

        <main>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  max="100"
                  value={amount}
                  onChange={(e) => sanitizeAmount(e.target.value)}
                  aria-label="Amount of Lorem Ipsum"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="unit">Unit</Label>
                <Select
                  value={unit}
                  onValueChange={(value) => setUnit(value)}
                  aria-label="Select unit for Lorem Ipsum"
                >
                  <SelectTrigger id="unit">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paragraphs">Paragraphs</SelectItem>
                    <SelectItem value="sentences">Sentences</SelectItem>
                    <SelectItem value="words">Words</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="start-with-lorem"
                checked={startWithLoremIpsum}
                onCheckedChange={setStartWithLoremIpsum}
                aria-label='Toggle "Start with Lorem Ipsum"'
              />
              <Label htmlFor="start-with-lorem">Start with "Lorem ipsum"</Label>
            </div>
            <Button onClick={generateLoremIpsum} className="w-full" aria-label="Generate Lorem Ipsum">
              <RefreshCw className="h-4 w-4 mr-2" />
              Generate Lorem Ipsum
            </Button>
          </div>

          {generatedText && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="generated-text">Generated Lorem Ipsum</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  disabled={!generatedText}
                  aria-label="Copy Generated Text"
                >
                  {isCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  {isCopied ? "Copied!" : "Copy"}
                </Button>
              </div>
              <Textarea
                id="generated-text"
                value={generatedText}
                readOnly
                rows={10}
                className="w-full p-2 font-serif text-sm"
                aria-label="Generated Lorem Ipsum"
              />
            </div>
          )}
        </main>
      </div>
    </>
  );
}
