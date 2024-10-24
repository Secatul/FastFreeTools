"use client"

import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useTheme } from "next-themes"
import { Home, HelpCircle, Moon, Sun, Copy, Save, Trash2, Play, AlertTriangle } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

const commonPatterns = {
  "Email": /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  "URL": /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  "Phone Number": /^(\+\d{1,2}\s)?\d{3}[\s.-]?\d{3}[\s.-]?\d{4}$/,
  "Date (YYYY-MM-DD)": /^\d{4}-\d{2}-\d{2}$/,
  "Strong Password": /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
}


function sanitizeInput(input) {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
}

function highlightMatches(text, regex) {
  if (!regex) return text
  const parts = text.split(regex)
  const matches = text.match(regex)
  if (!matches) return text
  return parts.reduce((arr, part, i) => {
    arr.push(part)
    if (i < matches.length) {
      arr.push(<mark key={i} className="bg-yellow-200 dark:bg-yellow-700">{matches[i]}</mark>)
    }
    return arr
  }, [])
}

function explainRegex(regex) {
  let explanation = []
  if (regex.startsWith('^')) explanation.push("Starts with")
  if (regex.endsWith('$')) explanation.push("Ends with")
  if (regex.includes('[a-z]')) explanation.push("Lowercase letters")
  if (regex.includes('[A-Z]')) explanation.push("Uppercase letters")
  if (regex.includes('\\d')) explanation.push("Digits")
  if (regex.includes('.')) explanation.push("Any character")
  if (regex.includes('*')) explanation.push("Zero or more occurrences")
  if (regex.includes('+')) explanation.push("One or more occurrences")
  if (regex.includes('?')) explanation.push("Zero or one occurrence")
  return explanation.join(', ')
}

export default function RegexTester() {
  const [regex, setRegex] = useState('')
  const [flags, setFlags] = useState('g')
  const [testString, setTestString] = useState('')
  const [multilineInput, setMultilineInput] = useState('')
  const [matches, setMatches] = useState([])
  const [savedPatterns, setSavedPatterns] = useState([])
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  useEffect(() => {
    const savedPatterns = localStorage.getItem('savedPatterns')
    if (savedPatterns) {
      setSavedPatterns(JSON.parse(savedPatterns))
    }
  }, [])

  useEffect(() => {
    try {
      const sanitizedRegex = sanitizeInput(regex)
      const sanitizedTestString = sanitizeInput(testString)
      const re = new RegExp(sanitizedRegex, flags)
      const newMatches = sanitizedTestString.match(re) || []
      setMatches(newMatches)
    } catch (error) {
      console.error('Invalid regex:', error)
    }
  }, [regex, flags, testString])

  const handleSavePattern = () => {
    const newPattern = { regex, flags }
    const updatedPatterns = [...savedPatterns, newPattern]
    setSavedPatterns(updatedPatterns)
    localStorage.setItem('savedPatterns', JSON.stringify(updatedPatterns))
    toast({
      title: "Pattern saved",
      description: "Your regex pattern has been saved.",
    })
  }

  const handleLoadPattern = (pattern) => {
    setRegex(pattern.regex)
    setFlags(pattern.flags)
    toast({
      title: "Pattern loaded",
      description: "The selected regex pattern has been loaded.",
    })
  }

  const handleDeletePattern = (index) => {
    const updatedPatterns = savedPatterns.filter((_, i) => i !== index)
    setSavedPatterns(updatedPatterns)
    localStorage.setItem('savedPatterns', JSON.stringify(updatedPatterns))
    toast({
      title: "Pattern deleted",
      description: "The selected regex pattern has been deleted.",
      variant: "destructive"
    })
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "The regex pattern has been copied to your clipboard.",
    })
  }

  return (
    <>
      <Head>
        <title>Regex Tester | Fast Task</title>
        <meta name="description" content="Test and debug your regular expressions with our powerful Regex Tester tool. Features include real-time matching, syntax highlighting, and pattern saving." />
        <meta name="keywords" content="regex, regular expression, tester, debugger, pattern matching" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-900 dark:to-red-900 p-4 sm:p-6">
          <main className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-in-out">
            <header className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 text-white p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl sm:text-4xl font-bold">Regex Tester</h1>
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
                        <p>Get help and information about the Regex Tester</p>
                      </TooltipContent>
                    </Tooltip>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>About Regex Tester</DialogTitle>
                        <DialogDescription>
                          <p className="mt-2">
                            <strong>Why:</strong> This tool helps you test and debug regular expressions.
                          </p>
                          <p className="mt-2">
                            <strong>What:</strong> You can input a regex pattern, set flags, and test against various strings.
                          </p>
                          <p className="mt-2">
                            <strong>How:</strong> Enter your regex, choose flags, and input test strings. The tool will show matches in real-time.
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
                <div className="flex flex-wrap gap-4">
                  <div className="flex-grow">
                    <Label htmlFor="regex-input" className="text-lg font-semibold text-gray-700 dark:text-gray-300">Regex Pattern</Label>
                    <div className="flex mt-1">
                      <Input
                        id="regex-input"
                        value={regex}
                        onChange={(e) => setRegex(sanitizeInput(e.target.value))}
                        className="flex-grow border-2 border-purple-300 dark:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter regex pattern"
                      />
                      <Select value={flags} onValueChange={setFlags}>
                        <SelectTrigger className="w-[180px] ml-2 border-2 border-purple-300 dark:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                          <SelectValue placeholder="Select flags" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="g">Global (g)</SelectItem>
                          <SelectItem value="i">Case-insensitive (i)</SelectItem>
                          <SelectItem value="m">Multiline (m)</SelectItem>
                          <SelectItem value="gi">Global + Case-insensitive (gi)</SelectItem>
                          <SelectItem value="gm">Global + Multiline (gm)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Label className="text-lg font-semibold text-gray-700 dark:text-gray-300">Actions</Label>
                    <div className="flex mt-1 space-x-2">
                      <Button onClick={handleSavePattern} className="bg-green-500 hover:bg-green-600 text-white">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button onClick={() => copyToClipboard(regex)} className="bg-blue-500 hover:bg-blue-600 text-white">
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="test-string" className="text-lg font-semibold text-gray-700 dark:text-gray-300">Test String</Label>
                  <Textarea
                    id="test-string"
                    value={testString}
                    onChange={(e) => setTestString(sanitizeInput(e.target.value))}
                    className="mt-1 w-full border-2 border-purple-300 dark:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter test string"
                    rows={4}
                  />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Matches</h2>
                  <div className="mt-1 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg min-h-[100px]">
                    {highlightMatches(testString, new RegExp(regex, flags))}
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {matches.length} {matches.length === 1 ? 'match' : 'matches'} found
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Tools & Resources</h2>
                <Tabs defaultValue="common-patterns">
                  <TabsList className="grid w-full grid-cols-3 bg-purple-100 dark:bg-purple-900">
                    <TabsTrigger value="common-patterns" className="data-[state=active]:bg-white  dark:data-[state=active]:bg-gray-800">Common Patterns</TabsTrigger>
                    <TabsTrigger value="explanation" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">Explanation</TabsTrigger>
                    <TabsTrigger value="cheat-sheet" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">Cheat Sheet</TabsTrigger>
                  </TabsList>
                  <TabsContent value="common-patterns" className="p-4 bg-white dark:bg-gray-800 rounded-b-lg shadow-md">
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(commonPatterns).map(([name, pattern]) => (
                        <Button
                          key={name}
                          onClick={() => setRegex(pattern.toString().slice(1, -1))}
                          className="bg-purple-500 hover:bg-purple-600 text-white"
                        >
                          {name}
                        </Button>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="explanation" className="p-4 bg-white dark:bg-gray-800 rounded-b-lg shadow-md">
                    <p className="text-gray-700 dark:text-gray-300">
                      {regex ? explainRegex(regex) : "Enter a regex pattern to see an explanation."}
                    </p>
                  </TabsContent>
                  <TabsContent value="cheat-sheet" className="p-4 bg-white dark:bg-gray-800 rounded-b-lg shadow-md">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><strong>.</strong> - Any character except newline</div>
                      <div><strong>\w</strong> - Word character [a-zA-Z0-9_]</div>
                      <div><strong>\d</strong> - Digit [0-9]</div>
                      <div><strong>\s</strong> - Whitespace character</div>
                      <div><strong>^</strong> - Start of string</div>
                      <div><strong>$</strong> - End of string</div>
                      <div><strong>*</strong> - 0 or more occurrences</div>
                      <div><strong>+</strong> - 1 or more occurrences</div>
                      <div><strong>?</strong> - 0 or 1 occurrence</div>
                      <div><strong>{'{n}'}</strong> - Exactly n occurrences</div>
                    </div>
                  </TabsContent>
                </Tabs>
              </section>

              {savedPatterns.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Saved Patterns</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedPatterns.map((pattern, index) => (
                      <div key={index} className="border border-purple-300 dark:border-purple-600 p-4 rounded-lg space-y-2 bg-white dark:bg-gray-800 shadow-md">
                        <p className="font-mono text-sm text-gray-700 dark:text-gray-300">{pattern.regex}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Flags: {pattern.flags}</p>
                        <div className="flex justify-between">
                          <Button onClick={() => handleLoadPattern(pattern)} className="bg-blue-500 hover:bg-blue-600 text-white">
                            <Play className="h-4 w-4 mr-2" />
                            Load
                          </Button>
                          <Button variant="destructive" onClick={() => handleDeletePattern(index)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Multiline Test</h2>
                <Textarea
                  value={multilineInput}
                  onChange={(e) => setMultilineInput(sanitizeInput(e.target.value))}
                  className="w-full border-2 border-purple-300 dark:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter multiple lines to test against the regex"
                  rows={6}
                />
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  {multilineInput.split('\n').map((line, index) => (
                    <div key={index} className="mb-2">
                      {highlightMatches(line, new RegExp(regex, flags))}
                    </div>
                  ))}
                </div>
              </section>

              <section className="mt-8 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <h2 className="flex items-center text-xl font-bold text-yellow-800 dark:text-yellow-200 mb-2">
                  <AlertTriangle className="h-6 w-6 mr-2" />
                  Safety Note
                </h2>
                <p className="text-yellow-700 dark:text-yellow-300">
                  Be cautious when using regular expressions with user-supplied input in production environments.
                  Improperly constructed regex patterns can lead to performance issues or security vulnerabilities.
                  Always validate and sanitize user input before processing.
                </p>
              </section>
            </div>
          </main>
        </div>
      </TooltipProvider>
    </>
  )
}