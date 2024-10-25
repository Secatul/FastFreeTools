"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import ShareButton from "@/app/components/share-button";
import Link from "next/link";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Head from "next/head";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTheme } from "next-themes";
import { Home, HelpCircle, Copy, Check, Moon, Sun } from "lucide-react";

// Import DOMPurify for sanitization
import DOMPurify from "dompurify";

export default function LinkGenerator() {
  const [linkURL, setLinkURL] = useState("");
  const [newWindow, setNewWindow] = useState(false);
  const [addRelNoopener, setAddRelNoopener] = useState(false);
  const [addRelNofollow, setAddRelNofollow] = useState(false);
  const [utmSource, setUtmSource] = useState("");
  const [linkType, setLinkType] = useState("text");
  const [linkText, setLinkText] = useState("");
  const [uppercase, setUppercase] = useState(false);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [altText, setAltText] = useState("");
  const [imageWidth, setImageWidth] = useState("");
  const [imageHeight, setImageHeight] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const { theme, setTheme } = useTheme();

  const shareUrl = "https://fastfreetools.com/link-generator";
  const shareTitle = "Check out this Link Generator Tool!";


  // Sanitize the inputs to prevent XSS attacks
  const sanitizeInput = (input) => DOMPurify.sanitize(input);

  const toggleUppercase = () => {
    setLinkText((prevText) =>
      uppercase ? prevText.toLowerCase() : prevText.toUpperCase()
    );
    setUppercase(!uppercase);
  };

  const generateCode = () => {
    let code = `<a href="${linkURL.startsWith("http") ? linkURL : `https://${linkURL}`}"`;

    if (newWindow) code += ' target="_blank"';
    if (addRelNoopener || addRelNofollow) {
      code += ' rel="';
      if (addRelNoopener) code += "noopener noreferrer ";
      if (addRelNofollow) code += "nofollow";
      code += '"';
    }
    if (utmSource) code += ` utm_source="${utmSource}"`;
    code += ">";

    if (linkType === "text") {
      let text = linkText;
      if (bold) text = `<strong>${text}</strong>`;
      if (italic) text = `<em>${text}</em>`;
      code += text;
    } else if (linkType === "image") {
      code += `<img src="${imageURL}" alt="${altText}"`;
      if (imageWidth) code += ` width="${imageWidth}"`;
      if (imageHeight) code += ` height="${imageHeight}"`;
      code += " />";
    }

    code += "</a>";
    setGeneratedCode(sanitizeInput(code)); // Sanitize the generated code
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <>

      <Head>
        <title>Link Generator Tool | Fast Free Tools</title>
        <meta
          name="description"
          content="Generate HTML links easily with our Link Generator tool. Customize attributes like target, rel, and UTM parameters, and preview the generated link."
        />
        <meta
          name="keywords"
          content="Link Generator, HTML link generator, UTM parameters, link attributes, link creation"
        />
        <meta name="author" content="Fast Free Tools" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://fastfreetools.com/link-generator" />
        <meta property="og:title" content="Link Generator Tool | Fast Free Tools" />
        <meta
          property="og:description"
          content="Easily create customized HTML links with attributes such as target, rel, and UTM parameters using the Link Generator."
        />
        <meta property="og:image" content="https://fastfreetools.com/og-image.jpg" />
        <meta property="og:url" content="https://fastfreetools.com/link-generator" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Link Generator Tool | Fast Free Tools" />
        <meta
          name="twitter:description"
          content="Use our Link Generator tool to quickly generate HTML links with customizable attributes."
        />
        <meta name="twitter:image" content="https://fastfreetools.com/twitter-image.jpg" />
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon.ico" />

      </Head>


      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Link Generator</h1>
          <div className="space-x-2 flex items-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Help">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>About Link Generator</DialogTitle>
                  <DialogDescription>
                    <p className="mt-2">
                      <strong>Why:</strong> The Link Generator tool helps you
                      create HTML links with various options, saving time and
                      ensuring proper formatting.
                    </p>
                    <p className="mt-2">
                      <strong>What:</strong> It generates HTML code for links,
                      allowing you to customize attributes like target, rel, and
                      UTM parameters.
                    </p>
                    <p className="mt-2">
                      <strong>How:</strong> Fill in the desired options, choose
                      between text or image links, and click &quot;Generate Code&quot; to
                      create your HTML link.
                    </p>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="icon" asChild>
              <Link href="/" aria-label="Home">
                <Home className="h-4 w-4" />
                <span className="sr-only">Home</span>
              </Link>
            </Button>

            <ShareButton shareUrl={shareUrl} shareTitle={shareTitle} tooltipText="Share the Link Generator Tool" />

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
            <div className="space-y-2">
              <Label htmlFor="link-url">Link URL</Label>
              <Input
                id="link-url"
                type="url"
                value={linkURL}
                onChange={(e) => setLinkURL(sanitizeInput(e.target.value))}
                placeholder="https://example.com"
                aria-label="Link URL"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="new-window"
                  checked={newWindow}
                  onCheckedChange={setNewWindow}
                  aria-label="Open in New Window/Tab"
                />
                <Label htmlFor="new-window">Open in New Window/Tab</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="rel-noopener"
                  checked={addRelNoopener}
                  onCheckedChange={setAddRelNoopener}
                  aria-label='Add "noopener noreferrer"'
                />
                <Label htmlFor="rel-noopener">Add rel=&quot;noopener noreferrer&quot;</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="rel-nofollow"
                  checked={addRelNofollow}
                  onCheckedChange={setAddRelNofollow}
                  aria-label='Add "nofollow"'
                />
                <Label htmlFor="rel-nofollow">Add rel=&quot;nofollow&quot;</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="utm-source">UTM Source</Label>
              <Input
                id="utm-source"
                type="text"
                value={utmSource}
                onChange={(e) => setUtmSource(sanitizeInput(e.target.value))}
                placeholder="campaign_name"
                aria-label="UTM Source"
              />
            </div>

            <div className="space-y-2">
              <Label>Link Type</Label>
              <RadioGroup value={linkType} onValueChange={setLinkType}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="text" id="link-type-text" />
                  <Label htmlFor="link-type-text">Text Link</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="image" id="link-type-image" />
                  <Label htmlFor="link-type-image">Image Link</Label>
                </div>
              </RadioGroup>
            </div>

            {linkType === "text" && (
              <div className="space-y-2">
                <Label htmlFor="link-text">Link Text</Label>
                <Input
                  id="link-text"
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(sanitizeInput(e.target.value))}
                  placeholder="Click here"
                  aria-label="Link Text"
                />
                <div className="flex items-center space-x-2">
                  <Switch
                    id="uppercase"
                    checked={uppercase}
                    onCheckedChange={toggleUppercase}
                    aria-label="Toggle Uppercase"
                  />
                  <Label htmlFor="uppercase">Uppercase</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="bold"
                    checked={bold}
                    onCheckedChange={setBold}
                    aria-label="Toggle Bold"
                  />
                  <Label htmlFor="bold">Bold</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="italic"
                    checked={italic}
                    onCheckedChange={setItalic}
                    aria-label="Toggle Italic"
                  />
                  <Label htmlFor="italic">Italic</Label>
                </div>
              </div>
            )}

            {linkType === "image" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image-url">Image URL</Label>
                  <Input
                    id="image-url"
                    type="url"
                    value={imageURL}
                    onChange={(e) => setImageURL(sanitizeInput(e.target.value))}
                    placeholder="https://example.com/image.jpg"
                    aria-label="Image URL"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alt-text">Alt Text</Label>
                  <Input
                    id="alt-text"
                    type="text"
                    value={altText}
                    onChange={(e) => setAltText(sanitizeInput(e.target.value))}
                    placeholder="Description of the image"
                    aria-label="Alt Text"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="image-width">Width (px)</Label>
                    <Input
                      id="image-width"
                      type="number"
                      value={imageWidth}
                      onChange={(e) => setImageWidth(sanitizeInput(e.target.value))}
                      placeholder="Width in pixels"
                      aria-label="Image Width"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image-height">Height (px)</Label>
                    <Input
                      id="image-height"
                      type="number"
                      value={imageHeight}
                      onChange={(e) => setImageHeight(sanitizeInput(e.target.value))}
                      placeholder="Height in pixels"
                      aria-label="Image Height"
                    />
                  </div>
                </div>
              </div>
            )}

            <Button onClick={generateCode} disabled={!linkURL} aria-label="Generate Code">
              Generate Code
            </Button>

            {generatedCode && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="generated-code">Generated HTML</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    disabled={!generatedCode}
                    aria-label="Copy generated HTML"
                  >
                    {isCopied ? (
                      <Check className="h-4 w-4 mr-2" />
                    ) : (
                      <Copy className="h-4 w-4 mr-2" />
                    )}
                    {isCopied ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <Textarea
                  id="generated-code"
                  value={generatedCode}
                  readOnly
                  rows={4}
                  aria-label="Generated HTML"
                />
              </div>
            )}

            {generatedCode && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <div
                  className="p-4 border rounded-md"
                  dangerouslySetInnerHTML={{ __html: generatedCode }}
                  aria-label="HTML Preview"
                ></div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
