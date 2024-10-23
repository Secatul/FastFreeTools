import Head from 'next/head';
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTheme } from "next-themes";
import { Home, HelpCircle, Moon, Sun, Copy, Download } from "lucide-react";

import TurndownService from "turndown";
import Prism from "prismjs";
import DOMPurify from 'isomorphic-dompurify'
import "prismjs/components/prism-markup";
import "prismjs/components/prism-markdown";
import "prismjs/themes/prism.css";

export default function HTMLToMarkdownConverter() {
  const [html, setHtml] = useState("");
  const [cleanHtml, setCleanHtml] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [error, setError] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [showRenderedHtml, setShowRenderedHtml] = useState(true);
  const [showCleanHtml, setShowCleanHtml] = useState(true);
  const [showMarkdown, setShowMarkdown] = useState(true);
  const { theme, setTheme } = useTheme();

  const turndownService = new TurndownService();

  useEffect(() => {
    convertHtml(html);
  }, [html]);

  useEffect(() => {
    Prism.highlightAll();
  }, [cleanHtml, markdown]);

  const sanitizeHtmlInput = (input) => DOMPurify.sanitize(input);

  const cleanHtmlContent = (input) => {
    let cleaned = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
    cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");
    cleaned = cleaned.replace(/<([a-z][a-z0-9]*)[^>]*?(href|src)="[^"]*"[^>]*>/gi, (match, p1, p2) => {
      const attr = match.match(new RegExp(`${p2}="[^"]*"`, "i"));
      return `<${p1}${attr ? " " + attr[0] : ""}>`;
    });
    return cleaned;
  };

  const convertHtml = (input) => {
    try {
      const sanitizedInput = sanitizeHtmlInput(input);
      const cleanedHtml = cleanHtmlContent(sanitizedInput);
      setCleanHtml(cleanedHtml);

      const result = turndownService.turndown(cleanedHtml);
      setMarkdown(result);
      setError("");
    } catch (err) {
      setError("Invalid HTML input. Please check your HTML and try again.");
      setCleanHtml("");
      setMarkdown("");
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleDownload = (content, filename) => {
    const sanitizedContent = DOMPurify.sanitize(content);
    const blob = new Blob([sanitizedContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Head>
        <title>HTML to Markdown Converter</title>
        <meta
          name="description"
          content="Easily convert your HTML content to Markdown format with this simple and fast HTML to Markdown converter tool. View, clean, copy, or download your results in real-time."
        />
        <meta
          name="keywords"
          content="HTML to Markdown converter, HTML converter, Markdown generator, HTML sanitization, real-time conversion"
        />
        <meta name="author" content="Your Name or Company Name" />

        {/* Open Graph (OG) meta tags for social sharing */}
        <meta property="og:title" content="HTML to Markdown Converter" />
        <meta
          property="og:description"
          content="Easily convert your HTML content to Markdown format with this simple and fast HTML to Markdown converter tool."
        />
        <meta property="og:image" content="https://example.com/preview-image.jpg" />
        <meta property="og:url" content="https://example.com/html-to-markdown" />
        <meta property="og:type" content="website" />

        {/* Twitter Cards meta tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HTML to Markdown Converter" />
        <meta
          name="twitter:description"
          content="Convert your HTML content to Markdown easily and quickly. Real-time results with copy and download functionality."
        />
        <meta name="twitter:image" content="https://example.com/preview-image.jpg" />

        {/* Responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />

        {/* Charset */}
        <meta charSet="UTF-8" />
      </Head>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">HTML to Markdown Converter</h1>
          <div className="space-x-2 flex items-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Toggle help">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>About HTML to Markdown Converter</DialogTitle>
                  <DialogDescription>
                    <p className="mt-2">
                      <strong>Why:</strong> This tool helps you convert HTML content to Markdown format while providing additional views.
                    </p>
                    <p className="mt-2">
                      <strong>What:</strong> It takes HTML input and generates a rendered preview, cleaned HTML (without CSS and JavaScript), and equivalent Markdown.
                    </p>
                    <p className="mt-2">
                      <strong>How:</strong> Paste your HTML into the input area. The tool will process it and display the results in real-time. You can toggle different views and copy or download the results.
                    </p>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="icon" asChild>
              <a href="/" aria-label="Return to home">
                <Home className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </header>

        <main>
          <div className="space-y-2">
            <Label htmlFor="html-input">HTML Input</Label>
            <Textarea
              id="html-input"
              value={html}
              onChange={(e) => setHtml(sanitizeHtmlInput(e.target.value))}
              placeholder="Paste your HTML here..."
              rows={10}
              aria-label="HTML input"
            />
          </div>

          {error && <p className="text-destructive">{error}</p>}

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="show-rendered-html" checked={showRenderedHtml} onCheckedChange={setShowRenderedHtml} aria-label="Show rendered HTML" />
              <Label htmlFor="show-rendered-html">Show Rendered HTML</Label>
            </div>
            {showRenderedHtml && <div className="border p-4 rounded-md" dangerouslySetInnerHTML={{ __html: sanitizeHtmlInput(html) }} />}
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="show-clean-html" checked={showCleanHtml} onCheckedChange={setShowCleanHtml} aria-label="Show clean HTML" />
              <Label htmlFor="show-clean-html">Show Clean HTML</Label>
            </div>
            {showCleanHtml && (
              <div className="relative">
                <pre className="language-markup">
                  <code>{cleanHtml}</code>
                </pre>
                <Button variant="outline" size="sm" className="absolute top-2 right-2" onClick={() => handleCopy(cleanHtml)} aria-label="Copy clean HTML">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-24"
                  onClick={() => handleDownload(cleanHtml, "clean_html.html")}
                  aria-label="Download clean HTML"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="show-markdown" checked={showMarkdown} onCheckedChange={setShowMarkdown} aria-label="Show markdown" />
              <Label htmlFor="show-markdown">Show Markdown</Label>
            </div>
            {showMarkdown && (
              <div className="relative">
                <pre className="language-markdown">
                  <code>{markdown}</code>
                </pre>
                <Button variant="outline" size="sm" className="absolute top-2 right-2" onClick={() => handleCopy(markdown)} aria-label="Copy markdown">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-24"
                  onClick={() => handleDownload(markdown, "converted_markdown.md")}
                  aria-label="Download markdown"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
