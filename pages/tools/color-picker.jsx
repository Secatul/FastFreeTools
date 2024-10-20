"use client"

import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTheme } from "next-themes"
import { Home, HelpCircle, Moon, Sun, Copy, Save, Trash2, Download } from 'lucide-react'
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast";

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 }
}

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

function rgbToHsl(r, g, b) {
  r /= 255, g /= 255, b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function hslToRgb(h, s, l) {
  h /= 360
  s /= 100
  l /= 100
  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }

  return { 
    r: Math.round(r * 255), 
    g: Math.round(g * 255), 
    b: Math.round(b * 255)
  }
}

function getComplementaryColor(hex) {
  const rgb = hexToRgb(hex)
  return rgbToHex(255 - rgb.r, 255 - rgb.g, 255 - rgb.b)
}

function getAnalogousColors(hex) {
  const hsl = rgbToHsl(...Object.values(hexToRgb(hex)))
  const color1 = hslToRgb((hsl.h + 30) % 360, hsl.s, hsl.l)
  const color2 = hslToRgb((hsl.h + 330) % 360, hsl.s, hsl.l)
  return [rgbToHex(color1.r, color1.g, color1.b), rgbToHex(color2.r, color2.g, color2.b)]
}

function getTriadicColors(hex) {
  const hsl = rgbToHsl(...Object.values(hexToRgb(hex)))
  const color1 = hslToRgb((hsl.h + 120) % 360, hsl.s, hsl.l)
  const color2 = hslToRgb((hsl.h + 240) % 360, hsl.s, hsl.l)
  return [rgbToHex(color1.r, color1.g, color1.b), rgbToHex(color2.r, color2.g, color2.b)]
}

function getLuminance(hex) {
  const rgb = hexToRgb(hex)
  const a = [rgb.r, rgb.g, rgb.b].map(v => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
}

function getContrastRatio(color1, color2) {
  const l1 = getLuminance(color1)
  const l2 = getLuminance(color2)
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
}

function isValidHex(hex) {
  return /^#([0-9A-F]{3}){1,2}$/i.test(hex);
}

export default function ColorPicker() {
  const [color, setColor] = useState('#3b82f6')
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 })
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 })
  const [savedPalettes, setSavedPalettes] = useState([])
  const [colorBlindnessType, setColorBlindnessType] = useState('normal')
  const [gradientColor, setGradientColor] = useState('#ffffff')
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  const MAX_PALETTES = 30;

  useEffect(() => {
    const savedPalettes = localStorage.getItem('savedPalettes')
    if (savedPalettes) {
      setSavedPalettes(JSON.parse(savedPalettes))
    }
  }, [])

  useEffect(() => {
    const newRgb = hexToRgb(color)
    setRgb(newRgb)
    setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b))
  }, [color])

  const handleHexChange = (e) => {
    const newColor = e.target.value
    if (isValidHex(newColor)) {
      setColor(newColor)
      const newRgb = hexToRgb(newColor)
      setRgb(newRgb)
      setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b))
    }
  }

  const handleRgbChange = (channel, value) => {
    const newRgb = { ...rgb, [channel]: value }
    setRgb(newRgb)
    setColor(rgbToHex(newRgb.r, newRgb.g, newRgb.b))
    setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b))
  }

  const handleHslChange = (channel, value) => {
    const newHsl = { ...hsl, [channel]: value }
    setHsl(newHsl)
    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l)
    setRgb(newRgb)
    setColor(rgbToHex(newRgb.r, newRgb.g, newRgb.b))
  }

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: `${type} copied: ${text}`,
    })
  }

  const savePalette = () => {
    if (savedPalettes.length >= MAX_PALETTES) {
      toast({
        title: "Palette limit reached",
        description: "You have reached the maximum of 30 saved palettes. Please delete some palettes to save new ones.",
        variant: "destructive"
      });
      return;
    }

    const newPalette = {
      id: Date.now(),
      mainColor: color,
      complementary: getComplementaryColor(color),
      analogous: getAnalogousColors(color),
      triadic: getTriadicColors(color),
    }

    const updatedPalettes = [...savedPalettes, newPalette]
    setSavedPalettes(updatedPalettes)
    localStorage.setItem('savedPalettes', JSON.stringify(updatedPalettes))
    
    toast({
      title: "Palette saved",
      description: "Your color palette has been saved.",
    })
  }

  const deletePalette = (id) => {
    const updatedPalettes = savedPalettes.filter(palette => palette.id !== id)
    setSavedPalettes(updatedPalettes)
    localStorage.setItem('savedPalettes', JSON.stringify(updatedPalettes))
    toast({
      title: "Palette deleted",
      description: "The selected color palette has been deleted.",
      variant:"destructive"
    })
  }

  const loadPalette = (palette) => {
    setColor(palette.mainColor)
    toast({
      title: "Palette loaded",
      description: "The selected color palette has been loaded.",
    })
  }

  const simulateColorBlindness = (hex, type) => {
    const rgb = hexToRgb(hex)
    let simulated

    switch (type) {
      case 'protanopia':
        simulated = {
          r: 0.567 * rgb.r + 0.433 * rgb.g,
          g: 0.558 * rgb.r + 0.442 * rgb.g,
          b: 0.242 * rgb.r + 0.758 * rgb.b
        }
        break
      case 'deuteranopia':
        simulated = {
          r: 0.625 * rgb.r + 0.375 * rgb.g,
          g: 0.7 * rgb.r + 0.3 * rgb.g,
          b: 0.3 * rgb.r + 0.7 * rgb.b
        }
        break
      case 'tritanopia':
        simulated = {
          r: 0.95 * rgb.r + 0.05 * rgb.b,
          g: 0.433 * rgb.r + 0.567 * rgb.g,
          b: 0.475 * rgb.g + 0.525 * rgb.b
        }
        break
      default:
        return hex
    }

    return rgbToHex(
      Math.round(simulated.r),
      Math.round(simulated.g),
      Math.round(simulated.b)
    )
  }

  const downloadPaletteInfo = (palette) => {
    const content = `
Main Color:
HEX: ${palette.mainColor}
RGB: ${Object.values(hexToRgb(palette.mainColor)).join(', ')}
HSL: ${Object.values(rgbToHsl(...Object.values(hexToRgb(palette.mainColor)))).join(', ')}

Complementary Color:
HEX: ${palette.complementary}
RGB: ${Object.values(hexToRgb(palette.complementary)).join(', ')}
HSL: ${Object.values(rgbToHsl(...Object.values(hexToRgb(palette.complementary)))).join(', ')}

Analogous Colors:
${palette.analogous.map((color, index) => `
Color ${index + 1}:
HEX: ${color}
RGB: ${Object.values(hexToRgb(color)).join(', ')}
HSL: ${Object.values(rgbToHsl(...Object.values(hexToRgb(color)))).join(', ')}
`).join('\n')}

Triadic Colors:
${palette.triadic.map((color, index) => `
Color ${index + 1}:
HEX: ${color}
RGB: ${Object.values(hexToRgb(color)).join(', ')}
HSL: ${Object.values(rgbToHsl(...Object.values(hexToRgb(color)))).join(', ')}
`).join('\n')}
    `.trim()

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `palette_${palette.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Palette information downloaded",
      description: "The palette information has been downloaded as a text file.",
    })
  }

  return (
    <>
      <Head>
        <title>Color Picker</title>
        <meta name="description" content="A comprehensive color picker tool with various features like palette generation, contrast checking, color blindness simulation, and gradient creation." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <TooltipProvider>
        <main className="max-w-4xl mx-auto p-6 space-y-6">
          <header className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Color Picker</h1>
            <div className="space-x-2 flex items-center">
              <Dialog>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" aria-label="Help">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Get help and information about the Color Picker</p>
                  </TooltipContent>
                </Tooltip>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>About Color Picker</DialogTitle>
                    <DialogDescription>
                      <p className="mt-2">
                        <strong>Why:</strong> This tool helps you choose and analyze colors for your designs.
                      </p>
                      <p className="mt-2">
                        <strong>What:</strong> You can pick colors, generate palettes, check contrast, simulate color blindness, and create gradients.
                      </p>
                      <p className="mt-2">
                        <strong>How:</strong> Use the color inputs or sliders to select a color. Explore different features in the tabs below.
                      </p>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" asChild aria-label="Home">
                    <a href="/">
                      <Home className="h-4 w-4" />
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Return to the home page</p>
                </TooltipContent>
              </Tooltip>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle theme"
              >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
            </div>
          </header>
      
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="w-full h-40 rounded-lg" style={{ backgroundColor: color }}></div>
              <div className="space-y-2">
                <Label htmlFor="hex-input">HEX</Label>
                <div className="flex space-x-2">
                  <Input id="hex-input" value={color} onChange={handleHexChange} />
                  <Button onClick={() => copyToClipboard(color, 'HEX value')} aria-label="Copy HEX">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>RGB</Label>
                <div className="grid grid-cols-3 gap-2">
                  {['r', 'g', 'b'].map((channel) => (
                    <div key={channel} className="space-y-2">
                      <Input
                        type="number"
                        min="0"
                        max="255"
                        value={rgb[channel]}
                        onChange={(e) => handleRgbChange(channel, parseInt(e.target.value))}
                        aria-label={`Channel ${channel.toUpperCase()}`}
                      />
                      <Slider
                        min={0}
                        max={255}
                        step={1}
                        value={[rgb[channel]]}
                        onValueChange={(value) => handleRgbChange(channel, value[0])}
                      />
                    </div>
                  ))}
                </div>
                <Button onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'RGB value')}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy RGB
                </Button>
              </div>
              <div className="space-y-2">
                <Label>HSL</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'h', max: 360 },
                    { key: 's', max: 100 },
                    { key: 'l', max: 100 },
                  ].map(({ key, max }) => (
                    <div key={key} className="space-y-2">
                      <Input
                        type="number"
                        min="0"
                        max={max}
                        value={hsl[key]}
                        onChange={(e) => handleHslChange(key, parseInt(e.target.value))}
                        aria-label={`Channel ${key.toUpperCase()}`}
                      />
                      <Slider
                        min={0}
                        max={max}
                        step={1}
                        value={[hsl[key]]}
                        onValueChange={(value) => handleHslChange(key, value[0])}
                      />
                    </div>
                  ))}
                </div>
                <Button onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'HSL value')}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy HSL
                </Button>
              </div>
            </div>
    
            <div className="space-y-4">
              <Tabs defaultValue="palette">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="palette">Palette</TabsTrigger>
                  <TabsTrigger value="contrast">Contrast</TabsTrigger>
                  <TabsTrigger value="colorblind">Colorblind</TabsTrigger>
                  <TabsTrigger value="gradient">Gradient</TabsTrigger>
                </TabsList>
                <TabsContent value="palette" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Complementary</Label>
                    <div className="h-10 rounded-lg" style={{ backgroundColor: getComplementaryColor(color) }}></div>
                  </div>
                  <div className="space-y-2">
                    <Label>Analogous</Label>
                    <div className="flex space-x-2">
                      {getAnalogousColors(color).map((c, i) => (
                        <div key={i} className="flex-1 h-10 rounded-lg" style={{ backgroundColor: c }}></div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Triadic</Label>
                    <div className="flex space-x-2">
                      {getTriadicColors(color).map((c, i) => (
                        <div key={i} className="flex-1 h-10 rounded-lg" style={{ backgroundColor: c }}></div>
                      ))}
                    </div>
                  </div>
                  <Button onClick={savePalette}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Palette
                  </Button>
                </TabsContent>
                <TabsContent value="contrast" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Contrast with White</Label>
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: color }}>
                        <span className="text-white font-bold">A</span>
                      </div>
                      <span>{getContrastRatio(color, '#ffffff').toFixed(2)}:1</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Contrast with Black</Label>
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: color }}>
                        <span className="text-black font-bold">A</span>
                      </div>
                      <span>{getContrastRatio(color, '#000000').toFixed(2)}:1</span>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="colorblind" className="space-y-4">
                  <Select value={colorBlindnessType} onValueChange={setColorBlindnessType}>
                    <SelectTrigger aria-label="Type of Color Blindness">
                      <SelectValue placeholder="Select color blindness type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal Vision</SelectItem>
                      <SelectItem value="protanopia">Protanopia</SelectItem>
                      <SelectItem value="deuteranopia">Deuteranopia</SelectItem>
                      <SelectItem value="tritanopia">Tritanopia</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="h-20 rounded-lg" style={{ backgroundColor: simulateColorBlindness(color, colorBlindnessType) }}></div>
                </TabsContent>
                <TabsContent value="gradient" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="gradient-color">Gradient End Color</Label>
                    <Input
                      id="gradient-color"
                      type="color"
                      value={gradientColor}
                      onChange={(e) => {
                        if (isValidHex(e.target.value)) {
                          setGradientColor(e.target.value)
                        }
                      }}
                    />
                  </div>
                  <div className="h-20 rounded-lg" style={{ background: `linear-gradient(to right, ${color}, ${gradientColor})` }}></div>
                  <Button onClick={() => copyToClipboard(`linear-gradient(to right, ${color}, ${gradientColor})`, 'Gradient CSS')}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Gradient CSS
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          </section>
  
          {savedPalettes.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">Saved Palettes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedPalettes.map((palette) => (
                  <div key={palette.id} className="border p-4 rounded-lg space-y-2">
                    <div className="flex space-x-2">
                      <button
                        className="flex-1 h-10 rounded-lg focus:outline-none"
                        style={{ backgroundColor: palette.mainColor }}
                        onClick={() => loadPalette(palette)}
                        aria-label="Load palette"
                      ></button>
                      <div className="flex-1 h-10 rounded-lg" style={{ backgroundColor: palette.complementary }}></div>
                    </div>
                    <div className="flex space-x-2">
                      {palette.analogous.map((c, i) => (
                        <div key={i} className="flex-1 h-10 rounded-lg" style={{ backgroundColor: c }}></div>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      {palette.triadic.map((c, i) => (
                        <div key={i} className="flex-1 h-10 rounded-lg" style={{ backgroundColor: c }}></div>
                      ))}
                    </div>
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => downloadPaletteInfo(palette)}>
                        <Download className="h-4 w-4 mr-2" />
                        Download Info
                      </Button>
                      <Button variant="destructive" onClick={() => deletePalette(palette.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </TooltipProvider>
    </>
  )
}
