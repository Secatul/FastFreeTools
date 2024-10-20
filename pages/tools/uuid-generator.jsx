"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useTheme } from "next-themes"
import { Home, HelpCircle, Copy, Check, Moon, Sun, RefreshCw } from 'lucide-react'

export default function UUIDGenerator() {
  const [uuid, setUUID] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [uppercase, setUppercase] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const { theme, setTheme } = useTheme()

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  const handleGenerate = () => {
    const uuids = Array(quantity).fill(null).map(() => generateUUID())
    const formattedUUIDs = uppercase ? uuids.map(uuid => uuid.toUpperCase()) : uuids
    setUUID(formattedUUIDs.join('\n'))
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(uuid)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">UUID Generator</h1>
        <div className="space-x-2 flex items-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <HelpCircle className="h-4 w-4" />
                <span className="sr-only">Help</span>
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
                    <strong>How:</strong> Click "Generate UUID" to create new UUIDs. You can generate multiple UUIDs at once and choose uppercase format if needed.
                  </p>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="icon" asChild>
            <a href="/">
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </a>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max="100"
              value={quantity}
              onChange={(e) => setQuantity(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="uppercase"
              checked={uppercase}
              onCheckedChange={setUppercase}
            />
            <Label htmlFor="uppercase">Uppercase</Label>
          </div>
        </div>
        <Button onClick={handleGenerate} className="w-full">
          <RefreshCw className="h-4 w-4 mr-2" />
          Generate UUID
        </Button>
      </div>

      {uuid && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="generated-uuid">Generated UUID(s)</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={!uuid}
            >
              {isCopied ? (
                <Check className="h-4 w-4 mr-2" />
              ) : (
                <Copy className="h-4 w-4 mr-2" />
              )}
              {isCopied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          <textarea
            id="generated-uuid"
            value={uuid}
            readOnly
            rows={quantity}
            className="w-full p-2 font-mono text-sm bg-secondary rounded-md"
          />
        </div>
      )}
    </div>
  )
}