"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useTheme } from "next-themes"
import { Home, HelpCircle, Copy, Check, Moon, Sun } from 'lucide-react'

export default function LinkGenerator() {
  const [linkURL, setLinkURL] = useState('')
  const [newWindow, setNewWindow] = useState(false)
  const [addRelNoopener, setAddRelNoopener] = useState(false)
  const [addRelNofollow, setAddRelNofollow] = useState(false)
  const [utmSource, setUtmSource] = useState('')
  const [linkType, setLinkType] = useState('text')
  const [linkText, setLinkText] = useState('')
  const [uppercase, setUppercase] = useState(false)
  const [bold, setBold] = useState(false)
  const [italic, setItalic] = useState(false)
  const [imageURL, setImageURL] = useState('')
  const [altText, setAltText] = useState('')
  const [imageWidth, setImageWidth] = useState('')
  const [imageHeight, setImageHeight] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [isCopied, setIsCopied] = useState(false)
  const { theme, setTheme } = useTheme()

  const toggleUppercase = () => {
    setLinkText((prevText) => (uppercase ? prevText.toLowerCase() : prevText.toUpperCase()))
    setUppercase(!uppercase)
  }

  const generateCode = () => {
    let code = `<a href="${linkURL.startsWith('http') ? linkURL : `https://${linkURL}`}"`

    if (newWindow) code += ' target="_blank"'
    if (addRelNoopener || addRelNofollow) {
      code += ' rel="'
      if (addRelNoopener) code += 'noopener noreferrer '
      if (addRelNofollow) code += 'nofollow'
      code += '"'
    }
    if (utmSource) code += ` utm_source="${utmSource}"`
    code += '>'

    if (linkType === 'text') {
      let text = linkText
      if (bold) text = `<strong>${text}</strong>`
      if (italic) text = `<em>${text}</em>`
      code += text
    } else if (linkType === 'image') {
      code += `<img src="${imageURL}" alt="${altText}"`
      if (imageWidth) code += ` width="${imageWidth}"`
      if (imageHeight) code += ` height="${imageHeight}"`
      code += ' />'
    }

    code += '</a>'
    setGeneratedCode(code)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Link Generator</h1>
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
        <div className="space-y-2">
          <Label htmlFor="link-url">Link URL</Label>
          <Input
            id="link-url"
            type="url"
            value={linkURL}
            onChange={(e) => setLinkURL(e.target.value)}
            placeholder="https://example.com"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="new-window"
              checked={newWindow}
              onCheckedChange={setNewWindow}
            />
            <Label htmlFor="new-window">Open in New Window/Tab</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="rel-noopener"
              checked={addRelNoopener}
              onCheckedChange={setAddRelNoopener}
            />
            <Label htmlFor="rel-noopener">Add rel="noopener noreferrer"</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="rel-nofollow"
              checked={addRelNofollow}
              onCheckedChange={setAddRelNofollow}
            />
            <Label htmlFor="rel-nofollow">Add rel="nofollow"</Label>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="utm-source">UTM Source</Label>
          <Input
            id="utm-source"
            type="text"
            value={utmSource}
            onChange={(e) => setUtmSource(e.target.value)}
            placeholder="campaign_name"
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

        {linkType === 'text' && (
          <div className="space-y-2">
            <Label htmlFor="link-text">Link Text</Label>
            <Input
              id="link-text"
              type="text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="Click here"
            />
            <div className="flex items-center space-x-2">
              <Switch
                id="uppercase"
                checked={uppercase}
                onCheckedChange={toggleUppercase}
              />
              <Label htmlFor="uppercase">Uppercase</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="bold"
                checked={bold}
                onCheckedChange={setBold}
              />
              <Label htmlFor="bold">Bold</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="italic"
                checked={italic}
                onCheckedChange={setItalic}
              />
              <Label htmlFor="italic">Italic</Label>
            </div>
          </div>
        )}

        {linkType === 'image' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                type="url"
                value={imageURL}
                onChange={(e) => setImageURL(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alt-text">Alt Text</Label>
              <Input
                id="alt-text"
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Description of the image"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="image-width">Width (px)</Label>
                <Input
                  id="image-width"
                  type="number"
                  value={imageWidth}
                  onChange={(e) => setImageWidth(e.target.value)}
                  placeholder="Width in pixels"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image-height">Height (px)</Label>
                <Input
                  id="image-height"
                  type="number"
                  value={imageHeight}
                  onChange={(e) => setImageHeight(e.target.value)}
                  placeholder="Height in pixels"
                />
              </div>
            </div>
          </div>
        )}

        <Button onClick={generateCode} disabled={!linkURL}>Generate Code</Button>

        {generatedCode && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="generated-code">Generated HTML</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                disabled={!generatedCode}
              >
                {isCopied ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                {isCopied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <Textarea
              id="generated-code"
              value={generatedCode}
              readOnly
              rows={4}
            />
          </div>
        )}

        {generatedCode && (
          <div className="space-y-2">
            <Label>Preview</Label>
            <div className="p-4 border rounded-md" dangerouslySetInnerHTML={{ __html: generatedCode }}></div>
          </div>
        )}
      </div>
    </div>
  )
}