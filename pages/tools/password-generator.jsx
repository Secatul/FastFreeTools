"use client"

import React, { useState, useEffect, useCallback } from "react"
import Head from "next/head"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import ShareButton from "@/app/components/share-button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useTheme } from "next-themes"
import { Home, HelpCircle, Copy, Check, Moon, Sun, RefreshCw, Save, Trash2, Eye, EyeOff, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DOMPurify from 'dompurify'
import bcrypt from 'bcryptjs'

function sanitizeInput(input) {
  return DOMPurify.sanitize(input)
}

export default function PasswordGenerator() {
  const [password, setPassword] = useState("")
  const [length, setLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [isCopied, setIsCopied] = useState(false)
  const [savedPasswords, setSavedPasswords] = useState([])
  const [showPassword, setShowPassword] = useState(false)
  const [charset, setCharset] = useState('')
  const [hashedPassword, setHashedPassword] = useState('')
  const [saltRounds, setSaltRounds] = useState(10)
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  const shareUrl = "https://fastfreetools.com/password-generator"
  const shareTitle = "Check out this Password Generator Tool!"

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

    setCharset(newCharset);

    let generatedPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * newCharset.length);
      generatedPassword += newCharset[randomIndex];
    }
    setPassword(generatedPassword);
    setHashedPassword('');
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols])

  useEffect(() => {
    generatePassword()
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, generatePassword])

  useEffect(() => {
    const savedPasswords = localStorage.getItem('savedPasswords')
    if (savedPasswords) {
      setSavedPasswords(JSON.parse(savedPasswords))
    }
  }, [])

  const handleCopy = async (textToCopy) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({
        title: "Copied to clipboard",
        description: "The text has been copied to your clipboard.",
      });
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast({
        title: "Copy failed",
        description: "Failed to copy the text. Please try again.",
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

  const hashPassword = async () => {
    try {
      const response = await fetch('/api/hash-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, saltRounds }),
      });
  
      const data = await response.json();
      setHashedPassword(data.hashedPassword);
      toast({
        title: "Password hashed",
        description: "The password has been hashed using bcrypt.",
      });
    } catch (error) {
      console.error("Hashing failed:", error);
      toast({
        title: "Hashing failed",
        description: "Failed to hash the password. Please try again.",
        variant: "destructive",
      });
    }
  };
  

  return (
    <>
      <Head>
        <title>Password Generator | Fast Free Tools</title>
        <meta
          name="description"
          content="Generate secure, random passwords with customizable options like length, uppercase, lowercase, numbers, and symbols. Improve your online security with strong passwords."
        />
        <meta
          name="keywords"
          content="password generator, strong passwords, random password generator, secure passwords, online password tool, bcrypt hashing"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://fastfreetools.com/password-generator" />
        <meta property="og:title" content="Password Generator | Fast Free Tools" />
        <meta
          property="og:description"
          content="Generate secure, random passwords with customizable options like length, uppercase, lowercase, numbers, and symbols."
        />
        <meta property="og:url" content="https://fastfreetools.com/password-generator" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Password Generator | Fast Free Tools" />
        <meta
          name="twitter:description"
          content="Improve your online security with strong, customizable passwords generated using our secure password tool."
        />
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
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
                            <strong>How:</strong> Adjust the settings to your preference, and a new password will be generated automatically. You can also hash your password using bcrypt for secure storage.
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

                  <ShareButton shareUrl={shareUrl} shareTitle={shareTitle} tooltipText="Share the Password Generator Tool" />

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
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
                    <Label htmlFor="generated-password" className="text-lg font-semibold text-gray-700 dark:text-gray-300">Generated Password</Label>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="secondary" size="sm" onClick={generatePassword} className="bg-primary text-primary-foreground hover:bg-primary/90">
                        <RefreshCw className="h-4  w-4 mr-2" />
                        Regenerate
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => handleCopy(password)} disabled={!password} className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-primary/50">
                        {isCopied ? (
                          <Check className="h-4 w-4 mr-2" />
                        ) : (
                          <Copy className="h-4 w-4 mr-2" />
                        )}
                        {isCopied ? "Copied!" : "Copy"}
                      </Button>
                      <Button variant="secondary" size="sm" onClick={savePassword} disabled={!password} className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-primary/50">
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
                      className="pr-10 font-mono border-2 border-primary focus:ring-2 focus:ring-primary focus:border-transparent"
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

                <div className="space-y-2">
                  <Label htmlFor="salt-rounds" className="text-lg font-semibold text-gray-700 dark:text-gray-300">Bcrypt Salt Rounds: {saltRounds}</Label>
                  <Slider
                    id="salt-rounds"
                    min={10}
                    max={20}
                    step={1}
                    value={[saltRounds]}
                    onValueChange={(value) => setSaltRounds(value[0])}
                    className="[&>span:first-child]:bg-purple-300 [&>span:first-child]:dark:bg-purple-600"
                  />
                </div>

                <Button onClick={hashPassword} disabled={!password} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-primary/50">
                  <Lock className="h-4 w-4 mr-2" />
                  Hash with Bcrypt
                </Button>

                {hashedPassword && (
                  <div className="space-y-2">
                    <Label htmlFor="hashed-password" className="text-lg font-semibold text-gray-700 dark:text-gray-300">Hashed Password</Label>
                    <div className="relative">
                      <Input
                        id="hashed-password"
                        value={hashedPassword}
                        readOnly
                        className="pr-10 font-mono border-2 border-primary focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => handleCopy(hashedPassword)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Note: Bcrypt hashing is commonly used for securely storing passwords. The original password should not be reused elsewhere.
                    </p>
                  </div>
                )}
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Password Analysis</h2>
                <Tabs defaultValue="entropy">
                  <TabsList className="grid w-full grid-cols-2 bg-muted">
                    <TabsTrigger value="entropy" className="data-[state=active]:bg-background">Entropy</TabsTrigger>
                    <TabsTrigger value="time-to-crack" className="data-[state=active]:bg-background">Time to Crack</TabsTrigger>
                  </TabsList>
                  <TabsContent value="entropy" className="p-4 bg-card rounded-b-lg shadow-md">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold mb-2">Password Entropy</h3>
                      <div className="text-4xl font-bold text-primary">
                        {charset && password ? Math.round(Math.log2(Math.pow(charset.length, password.length))) : 0} bits
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Entropy is a measure of password strength. Higher is better.
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="time-to-crack" className="p-4 bg-card rounded-b-lg shadow-md">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold mb-2">Estimated Time to Crack</h3>
                      <div className="text-4xl font-bold text-primary">
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
                      <p className="mt-2 text-sm text-muted-foreground">
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
                      <div key={index} className="border border-primary p-4 rounded-lg space-y-2 bg-card shadow-md">
                        <p className="font-mono text-sm text-card-foreground">
                          {showPassword ? savedPassword : '•'.repeat(savedPassword.length)}
                        </p>
                        <div className="flex justify-between">
                          <Button variant="secondary" size="sm" onClick={() => handleCopy(savedPassword)} className="bg-primary text-primary-foreground hover:bg-primary/90">
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
  )
}