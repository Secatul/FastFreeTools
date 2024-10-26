"use client";

import React, { useState } from "react";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme } from "next-themes";
import { Home, HelpCircle, Moon, Sun, Copy, Check, RefreshCw, Link as LinkIcon, Image as ImageIcon, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import DOMPurify from "isomorphic-dompurify";

export default function LinkGenerator() {
  const [linkURL, setLinkURL] = useState("");
  const [newWindow, setNewWindow] = useState(false);
  const [addRelNoopener, setAddRelNoopener] = useState(false);
  const [addRelNofollow, setAddRelNofollow] = useState(false);
  const [utmSource, setUtmSource] = useState("");
  const [utmMedium, setUtmMedium] = useState("");
  const [utmCampaign, setUtmCampaign] = useState("");
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
  const { toast } = useToast();

  const shareUrl = "https://fastfreetools.com/link-generator";
  const shareTitle = "Check out this Link Generator Tool!";

  const sanitizeInput = (input) => DOMPurify.sanitize(input);

  const toggleUppercase = () => {
    setLinkText((prevText) =>
      uppercase ? prevText.toLowerCase() : prevText.toUpperCase()
    );
    setUppercase(!uppercase);
  };

  const generateCode = () => {
    let href = linkURL.startsWith("http") ? linkURL : `https://${linkURL}`;
    
    // Adiciona parâmetros UTM se necessário
    let utmParams = [];
    if (utmSource) utmParams.push(`utm_source=${encodeURIComponent(utmSource)}`);
    if (utmMedium) utmParams.push(`utm_medium=${encodeURIComponent(utmMedium)}`);
    if (utmCampaign) utmParams.push(`utm_campaign=${encodeURIComponent(utmCampaign)}`);
    
    if (utmParams.length > 0) {
      href += `${href.includes('?') ? '&' : '?'}${utmParams.join('&')}`;
    }

    // Construindo o link HTML
    let code = `<a href="${href}"`;
    
    if (newWindow) code += ' target="_blank"';
    
    if (addRelNoopener || addRelNofollow) {
      code += ' rel="';
      if (addRelNoopener) code += "noopener noreferrer ";
      if (addRelNofollow) code += "nofollow";
      code = code.trim() + '"';
    }

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
    setGeneratedCode(sanitizeInput(code));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({
        title: "Code Copied",
        description: "The generated HTML has been copied to your clipboard.",
      });
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast({
        title: "Copy Failed",
        description: "Failed to copy the code. Please try again.",
        variant: "destructive",
      });
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://fastfreetools.com/link-generator" />
        <meta property="og:title" content="Link Generator Tool | Fast Free Tools" />
        <meta
          property="og:description"
          content="Easily create customized HTML links with attributes such as target, rel, and UTM parameters using the Link Generator."
        />
        <meta property="og:url" content="https://fastfreetools.com/link-generator" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Link Generator Tool | Fast Free Tools" />
        <meta
          name="twitter:description"
          content="Use our Link Generator tool to quickly generate HTML links with customizable attributes."
        />
        <meta charSet="UTF-8" />
      </Head>
      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-900 dark:to-red-900 p-4 sm:p-6">
          <main className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-in-out">
            <header className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 text-white p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl sm:text-4xl font-bold">Link Generator</h1>
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
                        <p>Get help and information about the Link Generator</p>
                      </TooltipContent>
                    </Tooltip>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>About Link Generator</DialogTitle>
                        <DialogDescription>
                          <p className="mt-2">
                            <strong>Why:</strong> The Link Generator tool helps you create HTML links with various options, saving time and ensuring proper formatting.
                          </p>
                          <p className="mt-2">
                            <strong>What:</strong> It generates HTML code for links, allowing you to customize attributes like target, rel, and UTM parameters.
                          </p>
                          <p className="mt-2">
                            <strong>How:</strong> Fill in the desired options, choose between text or image links, and click "Generate Code" to create your HTML link.
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

                  <ShareButton shareUrl={shareUrl} shareTitle={shareTitle} tooltipText="Share the Link Generator Tool" />

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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="new-window"
                        checked={newWindow}
                        onCheckedChange={setNewWindow}
                        aria-label="Open in New Window/Tab"
                      />
                      <Label htmlFor="new-window" className="flex items-center">
                        Open in New Window/Tab
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 ml-1 text-gray-500 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Adds target="_blank" to the link, opening it in a new tab or window</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="rel-noopener"
                        checked={addRelNoopener}
                        onCheckedChange={setAddRelNoopener}
                        aria-label='Add "noopener noreferrer"'
                      />
                      <Label htmlFor="rel-noopener" className="flex items-center">
                        Add rel="noopener noreferrer"
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 ml-1 text-gray-500 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Improves security for links opening in new tabs</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="rel-nofollow"
                        checked={addRelNofollow}
                        onCheckedChange={setAddRelNofollow}
                        aria-label='Add "nofollow"'
                      />
                      <Label htmlFor="rel-nofollow" className="flex items-center">
                        Add rel="nofollow"
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 ml-1 text-gray-500 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Tells search engines not to follow this link</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="utm-source" className="flex items-center">
                      UTM Source
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 ml-1 text-gray-500 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Identifies which site sent the traffic, e.g., google, newsletter</p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <Input
                      id="utm-source"
                      type="text"
                      value={utmSource}
                      onChange={(e) => 
                        setUtmSource(sanitizeInput(e.target.value))
                      }
                      placeholder="e.g., newsletter"
                      aria-label="UTM Source"
                    />
                    <Label htmlFor="utm-medium" className="flex items-center">
                      UTM Medium
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 ml-1 text-gray-500 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Identifies what type of link was used, e.g., cpc, email, social</p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <Input
                      id="utm-medium"
                      type="text"
                      value={utmMedium}
                      onChange={(e) =>
                        setUtmMedium(sanitizeInput(e.target.value))
                      }
                      placeholder="e.g., email"
                      aria-label="UTM Medium"
                    />
                    <Label htmlFor="utm-campaign" className="flex items-center">
                      UTM Campaign
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 ml-1 text-gray-500 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Identifies a specific product promotion or strategic campaign</p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <Input
                      id="utm-campaign"
                      type="text"
                      value={utmCampaign}
                      onChange={(e) =>
                        setUtmCampaign(sanitizeInput(e.target.value))
                      }
                      placeholder="e.g., spring_sale"
                      aria-label="UTM Campaign"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Link Type</Label>
                  <Select value={linkType} onValueChange={setLinkType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select link type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">
                        <div className="flex items-center">
                          <LinkIcon className="mr-2 h-4 w-4" />
                          Text Link
                        </div>
                      </SelectItem>
                      <SelectItem value="image">
                        <div className="flex items-center">
                          <ImageIcon className="mr-2 h-4 w-4" />
                          Image Link
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
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
                    <div className="flex items-center space-x-4">
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

                <Button onClick={generateCode} disabled={!linkURL} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate Code
                </Button>
              </div>

              {generatedCode && (
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <Label htmlFor="generated-code" className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      Generated HTML
                    </Label>
                    <Button
                      onClick={handleCopy}
                      disabled={!generatedCode}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      {isCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                      {isCopied ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                  <Textarea
                    id="generated-code"
                    value={generatedCode}
                    readOnly
                    rows={4}
                    className="w-full p-2 font-mono text-sm bg-gray-100 dark:bg-gray-700 border-2 border-blue-300 dark:border-blue-600 rounded-md transition-all duration-300 ease-in-out"
                    aria-label="Generated HTML"
                  />
                </div>
              )}

              {generatedCode && (
                <Tabs defaultValue="preview">
                  <TabsList className="grid w-full grid-cols-1 bg-purple-100 dark:bg-purple-900">
                    <TabsTrigger value="preview" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                      Preview
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="preview" className="p-4 bg-white dark:bg-gray-800 rounded-b-lg shadow-md">
                    <div
                      className="p-4 border rounded-md"
                      dangerouslySetInnerHTML={{ __html: generatedCode }}
                      aria-label="HTML Preview"
                    ></div>
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </main>
        </div>
      </TooltipProvider>
    </>
  );
}
