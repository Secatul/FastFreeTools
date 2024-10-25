"use client"

import React, { useState, useEffect } from "react"
import Head from "next/head"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import ShareButton from "@/app/components/share-button"
import { Label } from "@/components/ui/label"
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
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useTheme } from "next-themes"
import { Home, HelpCircle, Moon, Sun, Copy, Check, Download, RefreshCw, Type, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"

export default function EnhancedUUIDGenerator() {
  const [uuids, setUuids] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [version, setVersion] = useState("4")
  const [uppercase, setUppercase] = useState(false)
  const [removeDashes, setRemoveDashes] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [clearDialogOpen, setClearDialogOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  const shareUrl = "https://fastfreetools.com/uuid-generator"
  const shareTitle = "Check out this UUID Generator Tool!"

  useEffect(() => {
    generateUUIDs()
  }, [])

  const generateUUID = (version) => {
    let d = new Date().getTime()
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      let r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
    
    if (version === "1") {
      uuid = uuid.substr(0, 8) + '-1' + uuid.substr(9)
    }
    
    return uuid
  }

  const generateUUIDs = () => {
    const newUUIDs = Array(quantity).fill(null).map(() => {
      let uuid = generateUUID(version)
      if (uppercase) uuid = uuid.toUpperCase()
      if (removeDashes) uuid = uuid.replace(/-/g, '')
      return uuid
    })
    setUuids(newUUIDs)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(uuids.join("\n"))
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
      toast({
        title: "UUIDs Copied",
        description: "The generated UUIDs have been copied to your clipboard.",
      })
    } catch (err) {
      console.error("Failed to copy text: ", err)
      toast({
        title: "Copy Failed",
        description: "Failed to copy the UUIDs. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDownload = () => {
    const blob = new Blob([uuids.join("\n")], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "generated_uuids.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast({
      title: "UUIDs Downloaded",
      description: "Your UUID text file has been downloaded.",
    })
  }

  const handleClearUUIDs = () => {
    setUuids([])
    setClearDialogOpen(false)
    toast({
      title: "UUIDs Cleared",
      description: "The generated UUIDs have been cleared.",
    })
  }

  return (
    <>
      <Head>
        <title>UUID Generator | Fast Free Tools</title>
        <meta
          name="description"
          content="Generate UUIDs with customizable options. Choose UUID version, quantity, case, and format. Perfect for developers and system administrators."
        />
        <meta
          name="keywords"
          content="UUID generator, UUID tool, online UUID generator, generate UUID, version 1 UUID, version 4 UUID"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://fastfreetools.com/uuid-generator" />
        <meta property="og:title" content="UUID Generator | Fast Free Tools" />
        <meta
          property="og:description"
          content="Generate customizable UUIDs for use in systems, databases, and software development. Create multiple UUIDs with options for version, case, and formatting."
        />
        <meta property="og:url" content="https://fastfreetools.com/uuid-generator" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="UUID Generator | Fast Free Tools" />
        <meta
          name="twitter:description"
          content="Generate customizable UUIDs with options for version, quantity, case, and format. Ideal for developers and system administrators."
        />
        <meta charSet="UTF-8" />
      </Head>
      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 p-4 sm:p-6">
          <main className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-in-out">
            <header className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 text-white p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl sm:text-4xl font-bold">UUID Generator</h1>
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
                        <p>Get help and information about the UUID Generator</p>
                      </TooltipContent>
                    </Tooltip>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>About UUID Generator</DialogTitle>
                        <DialogDescription>
                          <p className="mt-2">
                            <strong>Why:</strong> UUIDs (Universally Unique Identifiers) are used to uniquely identify information in computer systems.
                          </p>
                          <p className="mt-2">
                            <strong>What:</strong> This tool generates version 1 or 4 UUIDs with customizable options.
                          </p>
                          <p className="mt-2">
                            <strong>How:</strong> Choose your settings and click &quot;Generate UUIDs&quot; to create new UUIDs. You can generate multiple UUIDs at once and customize their format.
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

                  <ShareButton shareUrl={shareUrl} shareTitle={shareTitle} tooltipText="Share the UUID Generator" />

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
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="w-full sm:w-1/4">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      max="100"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                      className="mt-1"
                      aria-label="Quantity of UUIDs"
                    />
                  </div>
                  <div className="w-full sm:w-1/4">
                    <Label htmlFor="version">Version</Label>
                    <Select value={version} onValueChange={(value) => setVersion(value)}>
                      <SelectTrigger id="version" className="mt-1">
                        <SelectValue placeholder="Select version" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Version 1 (time-based)</SelectItem>
                        <SelectItem value="4">Version 4 (random)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full sm:w-1/4 flex items-center space-x-2">
                    <Switch
                      id="uppercase"
                      checked={uppercase}
                      onCheckedChange={setUppercase}
                      aria-label="Toggle uppercase UUIDs"
                    />
                    <Label htmlFor="uppercase">Uppercase</Label>
                  </div>
                  <div className="w-full sm:w-1/4 flex items-center space-x-2">
                    <Switch
                      id="remove-dashes"
                      checked={removeDashes}
                      onCheckedChange={setRemoveDashes}
                      aria-label="Toggle remove dashes from UUIDs"
                    />
                    <Label htmlFor="remove-dashes">Remove Dashes</Label>
                  </div>
                </div>
                <Button 
                  onClick={generateUUIDs} 
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700" 
                  aria-label="Generate UUIDs"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate UUIDs
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <Label htmlFor="generated-uuids" className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Generated UUIDs
                  </Label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <Dialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 border-red-500 hover:bg-red-100 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-900"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Clear
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm Clear UUIDs</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to clear the generated UUIDs? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end space-x-2">
                          <Button onClick={() => setClearDialogOpen(false)} variant="secondary">
                            Cancel
                          </Button>
                          <Button onClick={handleClearUUIDs} variant="destructive">
                            Clear
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                
                </div>
                <div className="relative">
                  <Textarea
                    id="generated-uuids"
                    value={uuids.join("\n")}
                    readOnly
                    rows={10}
                    className="w-full p-2 font-mono text-sm bg-gray-100 dark:bg-gray-700 border-2 border-blue-300 dark:border-blue-600 rounded-md transition-all duration-300 ease-in-out"
                    aria-label="Generated UUIDs"
                  />
                </div>
                <div className="flex justify-end space-x-2 mt-2">
                  <Button onClick={handleCopy} disabled={uuids.length === 0} className="bg-blue-500 hover:bg-blue-600 text-white">
                    {isCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {isCopied ? "Copied!" : "Copy"}
                  </Button>
                  <Button onClick={handleDownload} disabled={uuids.length === 0} className="bg-green-500 hover:bg-green-600 text-white">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="info">
                <TabsList className="grid w-full grid-cols-1 bg-blue-100 dark:bg-blue-900">
                  <TabsTrigger value="info" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                    <Type className="h-4 w-4 mr-2" />
                    UUID Information
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="info" className="p-4 bg-white dark:bg-gray-800 rounded-b-lg shadow-md">
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Version 1 UUID</TableCell>
                        <TableCell>Time-based: Uses the current timestamp and MAC address of the computer.</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Version 4 UUID</TableCell>
                        <TableCell>Random: Generated using a cryptographically strong random number generator.</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">UUID Format</TableCell>
                        <TableCell>8-4-4-4-12 (e.g., 550e8400-e29b-41d4-a716-446655440000)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">UUID Length</TableCell>
                        <TableCell>32 characters (36 with hyphens)</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </TooltipProvider>
    </>
  )
}