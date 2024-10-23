"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import Head from "next/head";
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
import {
  Home,
  HelpCircle,
  Copy,
  Check,
  Moon,
  Sun,
  RefreshCw,
} from "lucide-react";

export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const { theme, setTheme } = useTheme();

  const generatePassword = useCallback(() => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+[]{}|;:,.<>?";

    let charset = "";
    if (includeLowercase) charset += lowercase;
    if (includeUppercase) charset += uppercase;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;

    if (charset === "") {
      setPassword("Please select at least one character type");
      return;
    }

    let generatedPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      generatedPassword += charset[randomIndex];
    }
    setPassword(generatedPassword);
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  useEffect(() => {
    generatePassword();
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, generatePassword]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const calculateStrength = () => {
    let strength = 0;
    if (includeLowercase) strength += 1;
    if (includeUppercase) strength += 1;
    if (includeNumbers) strength += 1;
    if (includeSymbols) strength += 1;

    if (length >= 8) strength += 1;
    if (length >= 16) strength += 1;

    return strength;
  };

  const renderStrengthLabel = () => {
    const strength = calculateStrength();
    if (strength <= 2) return <span className="text-red-500">Weak</span>;
    if (strength <= 4) return <span className="text-yellow-500">Medium</span>;
    return <span className="text-green-500">Strong</span>;
  };

  useEffect(() => {
    generatePassword();
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  return (
    <>

      <Head>
        <title>Password Generator</title>
        <meta
          name="description"
          content="Generate secure, random passwords with customizable options like length, uppercase, lowercase, numbers, and symbols. Improve your online security with strong passwords."
        />
        <meta
          name="keywords"
          content="password generator, strong passwords, random password generator, secure passwords, online password tool"
        />
        <meta name="author" content="Your Name or Company" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Password Generator" />
        <meta
          property="og:description"
          content="Generate secure and random passwords with a variety of customizable options to enhance your online security."
        />
        <meta property="og:image" content="https://example.com/og-image.jpg" />
        <meta property="og:url" content="https://example.com/password-generator" />
        <meta property="og:type" content="website" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Password Generator" />
        <meta
          name="twitter:description"
          content="Create strong, random passwords to enhance your online security. Customize length, characters, and symbols."
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
          <h1 className="text-3xl font-bold">Password Generator</h1>
          <div className="space-x-2 flex items-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Help">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>About Password Generator</DialogTitle>
                  <DialogDescription>
                    <p className="mt-2">
                      <strong>Why:</strong> This tool helps you create strong, unique passwords to enhance your online security.
                    </p>
                    <p className="mt-2">
                      <strong>What:</strong> It generates random passwords based on your specified criteria, including length and character types.
                    </p>
                    <p className="mt-2">
                      <strong>How:</strong> Adjust the settings to your preference, and a new password will be generated automatically.
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

        <main className="space-y-4">
          <section className="space-y-2">
            <Label htmlFor="password-length">Password Length: {length}</Label>
            <Slider
              id="password-length"
              min={8}
              max={32}
              step={1}
              value={[length]}
              onValueChange={(value) => setLength(value[0])}
              aria-label="Password Length"
            />
          </section>

          <section className="space-y-2">
            <Label>Include Characters:</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="uppercase"
                  checked={includeUppercase}
                  onCheckedChange={setIncludeUppercase}
                  aria-label="Include Uppercase"
                />
                <Label htmlFor="uppercase">Uppercase</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="lowercase"
                  checked={includeLowercase}
                  onCheckedChange={setIncludeLowercase}
                  aria-label="Include Lowercase"
                />
                <Label htmlFor="lowercase">Lowercase</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="numbers"
                  checked={includeNumbers}
                  onCheckedChange={setIncludeNumbers}
                  aria-label="Include Numbers"
                />
                <Label htmlFor="numbers">Numbers</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="symbols"
                  checked={includeSymbols}
                  onCheckedChange={setIncludeSymbols}
                  aria-label="Include Symbols"
                />
                <Label htmlFor="symbols">Symbols</Label>
              </div>
            </div>
          </section>
        </main>

        <section className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="generated-password">Generated Password</Label>
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={generatePassword} aria-label="Regenerate Password">
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
              <Button variant="outline" size="sm" onClick={handleCopy} disabled={!password} aria-label="Copy Password">
                {isCopied ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                {isCopied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>
          <Input
            id="generated-password"
            value={password}
            readOnly
            className="font-mono"
            aria-label="Generated Password"
          />
        </section>

        <footer className="flex items-center space-x-2">
          <Label>Password Strength:</Label>
          {renderStrengthLabel()}
        </footer>
      </div>
    </>
  );
}
