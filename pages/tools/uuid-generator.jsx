"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Head from "next/head";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";

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

export default function UUIDGenerator() {
  const [uuid, setUUID] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [uppercase, setUppercase] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { theme, setTheme } = useTheme();

  const generateUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const handleGenerate = () => {
    const uuids = Array(quantity)
      .fill(null)
      .map(() => generateUUID());
    const formattedUUIDs = uppercase ? uuids.map((uuid) => uuid.toUpperCase()) : uuids;
    setUUID(formattedUUIDs.join("\n"));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(uuid);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <>
      <Head>
        <title>UUID Generator</title>
        <meta
          name="description"
          content="Generate version 4 UUIDs quickly and easily. Create multiple UUIDs at once and format them in uppercase if needed."
        />
        <meta
          name="keywords"
          content="UUID generator, UUID tool, online UUID generator, generate UUID, version 4 UUID"
        />
        <meta name="author" content="Your Name or Company" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="UUID Generator" />
        <meta
          property="og:description"
          content="Generate version 4 UUIDs for use in systems, databases, and software development. Create multiple UUIDs with customizable options like uppercase formatting."
        />
        <meta property="og:image" content="https://example.com/og-image.jpg" />
        <meta property="og:url" content="https://example.com/uuid-generator" />
        <meta property="og:type" content="website" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="UUID Generator" />
        <meta
          name="twitter:description"
          content="Easily generate multiple UUIDs, including version 4 UUIDs, with options for uppercase formatting."
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
          <h1 className="text-3xl font-bold">UUID Generator</h1>
          <div className="space-x-2 flex items-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Help">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>About UUID Generator</DialogTitle>
                  <DialogDescription>
                    <p className="mt-2">
                      <strong>Why:</strong> UUIDs (Universally Unique Identifiers) are used to uniquely identify information in computer systems.
                    </p>
                    <p className="mt-2">
                      <strong>What:</strong> This tool generates version 4 UUIDs, which are randomly generated.
                    </p>
                    <p className="mt-2">
                      <strong>How:</strong> Click &quot;Generate UUID&quot; to create new UUIDs. You can generate multiple UUIDs at once and choose uppercase format if needed.
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

        <main className="space-y-4">
          <section className="flex items-center space-x-4">
            <div className="flex-1">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max="100"
                value={quantity}
                onChange={(e) => setQuantity(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                aria-label="Enter quantity of UUIDs"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="uppercase"
                checked={uppercase}
                onCheckedChange={setUppercase}
                aria-label="Toggle uppercase UUIDs"
              />
              <Label htmlFor="uppercase">Uppercase</Label>
            </div>
          </section>

          <Button onClick={handleGenerate} className="w-full" aria-label="Generate UUID">
            <RefreshCw className="h-4 w-4 mr-2" />
            Generate UUID
          </Button>
        </main>

        {uuid && (
          <section className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="generated-uuid">Generated UUID(s)</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                disabled={!uuid}
                aria-label={isCopied ? "UUIDs copied" : "Copy UUIDs"}
              >
                {isCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {isCopied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <textarea
              id="generated-uuid"
              value={uuid}
              readOnly
              rows={quantity}
              className="w-full p-2 font-mono text-sm bg-secondary rounded-md"
              aria-label="Generated UUID(s)"
            />
          </section>
        )}
      </div>
    </>
  );
}
