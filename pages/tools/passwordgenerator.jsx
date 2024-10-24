"use client";

import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTheme } from "next-themes";
import { Home, HelpCircle, Copy, Check, Moon, Sun, RefreshCw, Save, Trash2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DOMPurify from 'dompurify';

function sanitizeInput(input) {
  return DOMPurify.sanitize(input);
}

export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [savedPasswords, setSavedPasswords] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [charset, setCharset] = useState('');
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const generatePassword = useCallback(() => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+[]{}|;:,.<>?";

    let newCharset = "";
    if (includeLowercase) newCharset += lowercase;
    if (includeUppercase) newCharset += uppercase;
    if (includeNumbers) newCharset += numbers;
    if (includeSymbols) newCharset += symbols;

    if (newCharset === "") {
      setPassword("Please select at least one character type");
      return;
    }

    setCharset(newCharset); // Save charset to state

    let generatedPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * newCharset.length);
      generatedPassword += newCharset[randomIndex];
    }
    setPassword(generatedPassword);
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  useEffect(() => {
    generatePassword();
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, generatePassword]);

  useEffect(() => {
    const savedPasswords = localStorage.getItem('savedPasswords');
    if (savedPasswords) {
      setSavedPasswords(JSON.parse(savedPasswords));
    }
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({
        title: "Password copied",
        description: "The generated password has been copied to your clipboard.",
      });
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast({
        title: "Copy failed",
        description: "Failed to copy the password. Please try again.",
        variant: "destructive",
      });
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

  const savePassword = () => {
    const updatedPasswords = [...savedPasswords, password];
    setSavedPasswords(updatedPasswords);
    localStorage.setItem('savedPasswords', JSON.stringify(updatedPasswords));
    toast({
      title: "Password saved",
      description: "The generated password has been saved.",
    });
  };

  const deletePassword = (index) => {
    const updatedPasswords = savedPasswords.filter((_, i) => i !== index);
    setSavedPasswords(updatedPasswords);
    localStorage.setItem('savedPasswords', JSON.stringify(updatedPasswords));
    toast({
      title: "Password deleted",
      description: "The saved password has been deleted.",
      variant: "destructive",
    });
  };

  return (
    <>
      <Head>
        <title>Password Generator | Fast Task</title>
        <meta name="description" content="Generate secure, random passwords with customizable options like length, uppercase, lowercase, numbers, and symbols. Improve your online security with strong passwords." />
        <meta name="keywords" content="password generator, strong passwords, random password generator, secure passwords, online password tool" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-900 dark:to-red-900 p-4 sm:p-6">
          <main className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-in-out">
            <header className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 text-white p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl sm:text-4xl font-bold">Password Generator</h1>
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
                        <p>Get help and information about the Password Generator</p>
                      </TooltipContent>
                    </Tooltip>
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

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
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
              <section className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password-length" className="text-lg font-semibold text-gray-700 dark:text-gray-300">Password Length: {length}</Label>
                  <Slider
                    id="password-length"
                    min={8}
                    max={32}
                    step={1}
                    value={[length]}
                    onValueChange={(value) => setLength(value[0])}
                    className="[&>span:first-child]:bg-purple-300 [&>span:first-child]:dark:bg-purple-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-lg font-semibold text-gray-700 dark:text-gray-300">Include Characters:</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="uppercase"
                        checked={includeUppercase}
                        onCheckedChange={setIncludeUppercase}
                      />
                      <Label htmlFor="uppercase">Uppercase</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="lowercase"
                        checked={includeLowercase}
                        onCheckedChange={setIncludeLowercase}
                      />
                      <Label htmlFor="lowercase">Lowercase</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="numbers"
                        checked={includeNumbers}
                        onCheckedChange={setIncludeNumbers}
                      />
                      <Label htmlFor="numbers">Numbers</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="symbols"
                        checked={includeSymbols}
                        onCheckedChange={setIncludeSymbols}
                      />
                      <Label htmlFor="symbols">Symbols</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="generated-password" className="text-lg font-semibold text-gray-700 dark:text-gray-300">Generated Password</Label>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm" onClick={generatePassword} className="bg-blue-500 hover:bg-blue-600 text-white">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Regenerate
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleCopy} disabled={!password} className="bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-400">
                        {isCopied ? (
                          <Check className="h-4 w-4 mr-2" />
                        ) : (
                          <Copy className="h-4 w-4 mr-2" />
                        )}
                        {isCopied ? "Copied!" : "Copy"}
                      </Button>
                      <Button variant="outline" size="sm" onClick={savePassword} disabled={!password} className="bg-purple-500 hover:bg-purple-600 text-white disabled:bg-gray-400">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                  <div className="relative">
                    <Input
                      id="generated-password"
                      value={password}
                      readOnly
                      type={showPassword ? "text" : "password"}
                      className="pr-10 font-mono border-2 border-purple-300 dark:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Label className="text-lg font-semibold text-gray-700 dark:text-gray-300">Password Strength:</Label>
                  {renderStrengthLabel()}
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Password Analysis</h2>
                <Tabs defaultValue="entropy">
                  <TabsList className="grid w-full grid-cols-2 bg-purple-100 dark:bg-purple-900">
                    <TabsTrigger value="entropy" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">Entropy</TabsTrigger>
                    <TabsTrigger value="time-to-crack" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">Time to Crack</TabsTrigger>
                  </TabsList>
                  <TabsContent value="entropy" className="p-4 bg-white dark:bg-gray-800 rounded-b-lg shadow-md">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold mb-2">Password Entropy</h3>
                      <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                        {charset && password ? Math.round(Math.log2(Math.pow(charset.length, password.length))) : 0} bits
                      </div>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Entropy is a measure of password strength. Higher is better.
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="time-to-crack" className="p-4 bg-white dark:bg-gray-800 rounded-b-lg shadow-md">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold mb-2">Estimated Time to Crack</h3>
                      <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                        {(() => {
                          const combinations = Math.pow(charset.length, password.length);
                          const secondsToCrack = combinations / (1000000000 * 60 * 60 * 24 * 365);
                          if (secondsToCrack < 1) return "Instantly";
                          if (secondsToCrack < 60) return `${Math.round(secondsToCrack)} seconds`;
                          if (secondsToCrack < 3600) return `${Math.round(secondsToCrack / 60)} minutes`;
                          if (secondsToCrack < 86400) return `${Math.round(secondsToCrack / 3600)} hours`;
                          if (secondsToCrack < 31536000) return `${Math.round(secondsToCrack / 86400)} days`;
                          return `${Math.round(secondsToCrack / 31536000)} years`;
                        })()}
                      </div>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Estimated time for a computer to crack this password by brute force.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </section>

              {savedPasswords.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Saved Passwords</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedPasswords.map((savedPassword, index) => (
                      <div key={index} className="border border-purple-300 dark:border-purple-600 p-4 rounded-lg space-y-2 bg-white dark:bg-gray-800 shadow-md">
                        <p className="font-mono text-sm text-gray-700 dark:text-gray-300">
                          {showPassword ? savedPassword : '•'.repeat(savedPassword.length)}
                        </p>
                        <div className="flex justify-between">
                          <Button variant="outline" size="sm" onClick={() => {
                            navigator.clipboard.writeText(savedPassword);
                            toast({
                              title: "Password copied",
                              description: "The saved password has been copied to your clipboard.",
                            });
                          }} className="bg-blue-500 hover:bg-blue-600 text-white">
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => deletePassword(index)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </main>
        </div>
      </TooltipProvider>
    </>
  );
}
