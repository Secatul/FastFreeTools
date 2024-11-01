"use client";

import React, { useState, useEffect, ChangeEvent } from 'react';
import Head from 'next/head';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ShareButton from '../components/share-button';
import Link from "next/link";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTheme } from "next-themes";
import { Home, HelpCircle, Moon, Sun, Copy, Save, Trash2, Download } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useMediaQuery } from 'react-responsive';

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : { r: 0, g: 0, b: 0 };
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h: number, s: number, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0;
    }
    h /= 6;
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h: number, s: number, l: number) {
  h /= 360;
  s /= 100;
  l /= 100;
  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function getComplementaryColor(hex: string) {
  const rgb = hexToRgb(hex);
  return rgbToHex(255 - rgb.r, 255 - rgb.g, 255 - rgb.b);
}

function getAnalogousColors(hex: string) {
  const hsl = rgbToHsl(...Object.values(hexToRgb(hex)));
  const color1 = hslToRgb((hsl.h + 30) % 360, hsl.s, hsl.l);
  const color2 = hslToRgb((hsl.h + 330) % 360, hsl.s, hsl.l);
  return [rgbToHex(color1.r, color1.g, color1.b), rgbToHex(color2.r, color2.g, color2.b)];
}

function getTriadicColors(hex: string) {
  const hsl = rgbToHsl(...Object.values(hexToRgb(hex)));
  const color1 = hslToRgb((hsl.h + 120) % 360, hsl.s, hsl.l);
  const color2 = hslToRgb((hsl.h + 240) % 360, hsl.s, hsl.l);
  return [rgbToHex(color1.r, color1.g, color1.b), rgbToHex(color2.r, color2.g, color2.b)];
}

function isValidHex(hex: string) {
  return /^#([0-9A-F]{3}){1,2}$/i.test(hex);
}

function getLuminance(hex: string) {
  const rgb = hexToRgb(hex);
  const a = [rgb.r, rgb.g, rgb.b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(color1: string, color2: string) {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

interface Palette {
  id: number;
  mainColor: string;
  complementary: string;
  analogous: string[];
  triadic: string[];
}

export default function ColorPicker() {
  const [color, setColor] = useState<string>('#3b82f6');
  const [rgb, setRgb] = useState<{ r: number; g: number; b: number }>({ r: 59, g: 130, b: 246 });
  const [hsl, setHsl] = useState<{ h: number; s: number; l: number }>({ h: 217, s: 91, l: 60 });
  const [savedPalettes, setSavedPalettes] = useState<Palette[]>([]);
  const [colorBlindnessType, setColorBlindnessType] = useState<string>('normal');
  const [gradientColor, setGradientColor] = useState<string>('#ffffff');
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const t = useTranslations('ColorPicker');
  const pathname = usePathname();

  const [activeTab, setActiveTab] = useState('palette');
  const isMobile = useMediaQuery({ query: '(max-width: 640px)' });

  const locale = pathname ? pathname.split("/")[1] : "en";
  const shareUrl = `https://fastfreetools.com/${locale}/color-picker`;
  const shareTitle = t('Share_Title');

  const MAX_PALETTES = 30;

  useEffect(() => {
    const savedPalettes = localStorage.getItem('savedPalettes');
    if (savedPalettes) {
      setSavedPalettes(JSON.parse(savedPalettes));
    }
  }, []);

  useEffect(() => {
    const newRgb = hexToRgb(color);
    setRgb(newRgb);
    setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
  }, [color]);

  const handleHexChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    if (isValidHex(newColor)) {
      setColor(newColor);
      const newRgb = hexToRgb(newColor);
      setRgb(newRgb);
      setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
    }
  };

  const handleRgbChange = (channel: string, value: number) => {
    const newRgb = { ...rgb, [channel]: value };
    setRgb(newRgb);
    setColor(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
  };

  const handleHslChange = (channel: string, value: number) => {
    const newHsl = { ...hsl, [channel]: value };
    setHsl(newHsl);
    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    setRgb(newRgb);
    setColor(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: t('Copy_Success_Title'),
      description: `${t('Copy_Success_Description', { type })}: ${text}`,
    });
  };

  const savePalette = () => {
    if (savedPalettes.length >= MAX_PALETTES) {
      toast({
        title: t('Save_Palette_Limit_Title'),
        description: t('Save_Palette_Limit_Description', { max: MAX_PALETTES }),
        variant: "destructive",
      });
      return;
    }

    const newPalette: Palette = {
      id: Date.now(),
      mainColor: color,
      complementary: getComplementaryColor(color),
      analogous: getAnalogousColors(color),
      triadic: getTriadicColors(color),
    };

    const updatedPalettes = [...savedPalettes, newPalette];
    setSavedPalettes(updatedPalettes);
    localStorage.setItem('savedPalettes', JSON.stringify(updatedPalettes));

    toast({
      title: t('Save_Palette_Success_Title'),
      description: t('Save_Palette_Success_Description'),
    });
  };

  const deletePalette = (id: number) => {
    const updatedPalettes = savedPalettes.filter(palette => palette.id !== id);
    setSavedPalettes(updatedPalettes);
    localStorage.setItem('savedPalettes', JSON.stringify(updatedPalettes));
    toast({
      title: t('Delete_Palette_Title'),
      description: t('Delete_Palette_Description'),
      variant: "destructive",
    });
  };

  const loadPalette = (palette: Palette) => {
    setColor(palette.mainColor);
    toast({
      title: t('Load_Palette_Title'),
      description: t('Load_Palette_Description'),
    });
  };

  const downloadPaletteInfo = (palette: Palette) => {
    const content = `
${t('Palette_Main_Color')}:
HEX: ${palette.mainColor}
RGB: ${Object.values(hexToRgb(palette.mainColor)).join(', ')}
HSL: ${Object.values(rgbToHsl(...Object.values(hexToRgb(palette.mainColor)))).join(', ')}

${t('Palette_Complementary_Color')}:
HEX: ${palette.complementary}
RGB: ${Object.values(hexToRgb(palette.complementary)).join(', ')}
HSL: ${Object.values(rgbToHsl(...Object.values(hexToRgb(palette.complementary)))).join(', ')}

${t('Palette_Analogous_Colors')}:
${palette.analogous.map((color, index) => `
${t('Color')} ${index + 1}:
HEX: ${color}
RGB: ${Object.values(hexToRgb(color)).join(', ')}
HSL: ${Object.values(rgbToHsl(...Object.values(hexToRgb(color)))).join(', ')}
`).join('\n')}

${t('Palette_Triadic_Colors')}:
${palette.triadic.map((color, index) => `
${t('Color')} ${index + 1}:
HEX: ${color}
RGB: ${Object.values(hexToRgb(color)).join(', ')}
HSL: ${Object.values(rgbToHsl(...Object.values(hexToRgb(color)))).join(', ')}
`).join('\n')}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `palette_${palette.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: t('Download_Palette_Title'),
      description: t('Download_Palette_Description'),
    });
  };

  const simulateColorBlindness = (hex: string, type: string) => {
    const rgb = hexToRgb(hex);
    let simulated;

    switch (type) {
      case 'protanopia':
        simulated = {
          r: 0.567 * rgb.r + 0.433 * rgb.g,
          g: 0.558 * rgb.r + 0.442 * rgb.g,
          b: 0.242 * rgb.r + 0.758 * rgb.b,
        };
        break;
      case 'deuteranopia':
        simulated = {
          r: 0.625 * rgb.r + 0.375 * rgb.g,
          g: 0.7 * rgb.r + 0.3 * rgb.g,
          b: 0.3 * rgb.r + 0.7 * rgb.b,
        };
        break;
      case 'tritanopia':
        simulated = {
          r: 0.95 * rgb.r + 0.05 * rgb.b,
          g: 0.433 * rgb.r + 0.567 * rgb.g,
          b: 0.475 * rgb.g + 0.525 * rgb.b,
        };
        break;
      default:
        return hex;
    }

    return rgbToHex(
      Math.round(simulated.r),
      Math.round(simulated.g),
      Math.round(simulated.b),
    );
  };

  const hreflangs = [
    { locale: 'en', href: "https://fastfreetools.com/en/color-picker" },
    { locale: 'es', href: "https://fastfreetools.com/es/color-picker" },
    { locale: 'pt-br', href: "https://fastfreetools.com/pt-br/color-picker" },
    { locale: 'de', href: "https://fastfreetools.com/de/color-picker" },
    { locale: 'fr', href: "https://fastfreetools.com/fr/color-picker" },
  ];

  return (
    <>
      <Head>
        <title>{t('Page_Title')}</title>
        <meta
          name="description"
          content={t('Page_Description')}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={shareUrl} />

        {hreflangs.map(({ locale, href }) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}

        <meta property="og:title" content={t('Page_Title')} />
        <meta
          property="og:description"
          content={t('Page_Description')}
        />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('Page_Title')} />
        <meta
          name="twitter:description"
          content={t('Page_Description')}
        />
        <meta charSet="UTF-8" />
      </Head>

      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-900 dark:to-red-900 p-4 sm:p-6">
          <main className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-in-out">
            <header className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 text-white p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl sm:text-4xl font-bold">{t('ColorPicker_Title')}</h1>
                <nav className="flex items-center space-x-2">
                  <Dialog>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" aria-label={t('Aria_Help')} className="bg-white/10 hover:bg-white/20 text-white">
                            <HelpCircle className="h-5 w-5" />
                          </Button>
                        </DialogTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('Tooltip_Help')}</p>
                      </TooltipContent>
                    </Tooltip>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t('Dialog_About_Title')}</DialogTitle>
                        <DialogDescription>
                          <p className="mt-2">
                            <strong>{t('Dialog_Why')}:</strong> {t('Dialog_Why_Description')}
                          </p>
                          <p className="mt-2">
                            <strong>{t('Dialog_What')}:</strong> {t('Dialog_What_Description')}
                          </p>
                          <p className="mt-2">
                            <strong>{t('Dialog_How')}:</strong> {t('Dialog_How_Description')}
                          </p>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" asChild className="bg-white/10 hover:bg-white/20 text-white">
                        <Link href="/" aria-label={t('Aria_Home')}>
                          <Home className="h-5 w-5" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('Tooltip_Home')}</p>
                    </TooltipContent>
                  </Tooltip>

                  <ShareButton shareUrl={shareUrl} shareTitle={shareTitle} tooltipText={t('Tooltip_Share')} />

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        aria-label={t('Aria_ToggleTheme')}
                        className="bg-white/10 hover:bg-white/20 text-white"
                      >
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('Tooltip_ToggleTheme')}</p>
                    </TooltipContent>
                  </Tooltip>
                </nav>
              </div>
            </header>

            <div className="p-6 space-y-6">
              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="w-full h-40 rounded-lg shadow-md" style={{ backgroundColor: color }}></div>
                  <div className="space-y-2">
                    <Label htmlFor="hex-input" className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('Label_HEX')}</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="hex-input"
                        value={color}
                        onChange={handleHexChange}
                        className="border-2 border-purple-300 dark:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <Button onClick={() => copyToClipboard(color, 'HEX value')} aria-label={t('Aria_Copy_HEX')} className="bg-blue-500 hover:bg-blue-600 text-white">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('Label_RGB')}</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {['r', 'g', 'b'].map((channel) => (
                        <div key={channel} className="space-y-2">
                          <Input
                            type="number"
                            min="0"
                            max="255"
                            value={rgb[channel]}
                            onChange={(e) => handleRgbChange(channel, parseInt(e.target.value))}
                            aria-label={t('Aria_Channel', { channel: channel.toUpperCase() })}
                            className="border-2 border-purple-300 dark:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          <Slider
                            min={0}
                            max={255}
                            step={1}
                            value={[rgb[channel]]}
                            onValueChange={(value) => handleRgbChange(channel, value[0])}
                            className="[&>span:first-child]:bg-purple-300 [&>span:first-child]:dark:bg-purple-600"
                          />
                        </div>
                      ))}
                    </div>
                    <Button onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'RGB value')} className="bg-green-500 hover:bg-green-600 text-white">
                      <Copy className="h-4 w-4 mr-2" />
                      {t('Button_Copy_RGB')}
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('Label_HSL')}</Label>
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
                            aria-label={t('Aria_Channel', { channel: key.toUpperCase() })}
                            className="border-2 border-purple-300 dark:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          <Slider
                            min={0}
                            max={max}
                            step={1}
                            value={[hsl[key]]}
                            onValueChange={(value) => handleHslChange(key, value[0])}
                            className="[&>span:first-child]:bg-purple-300 [&>span:first-child]:dark:bg-purple-600"
                          />
                        </div>
                      ))}
                    </div>
                    <Button onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'HSL value')} className="bg-pink-500 hover:bg-pink-600 text-white">
                      <Copy className="h-4 w-4 mr-2" />
                      {t('Button_Copy_HSL')}
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {isMobile ? (
                    <div className="space-y-4">
                      <Select
                        value={activeTab}
                        onValueChange={setActiveTab}
                      >
                        <SelectTrigger aria-label={t('Aria_Select_Tab')}>
                          <SelectValue placeholder={t('Placeholder_Select_Tab')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="palette">{t('Tab_Palette')}</SelectItem>
                          <SelectItem value="contrast">{t('Tab_Contrast')}</SelectItem>
                          <SelectItem value="colorblind">{t('Tab_Colorblind')}</SelectItem>
                          <SelectItem value="gradient">{t('Tab_Gradient')}</SelectItem>
                        </SelectContent>
                      </Select>

                      {activeTab === 'palette' && (
                        <div className="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                          <div className="space-y-2">
                            <Label className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('Label_Complementary')}</Label>
                            <div className="h-10 rounded-lg shadow-inner" style={{ backgroundColor: getComplementaryColor(color) }}></div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('Label_Analogous')}</Label>
                            <div className="flex space-x-2">
                              {getAnalogousColors(color).map((c, i) => (
                                <div key={i} className="flex-1 h-10 rounded-lg shadow-inner" style={{ backgroundColor: c }}></div>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('Label_Triadic')}</Label>
                            <div className="flex space-x-2">
                              {getTriadicColors(color).map((c, i) => (
                                <div key={i} className="flex-1 h-10 rounded-lg shadow-inner" style={{ backgroundColor: c }}></div>
                              ))}
                            </div>
                          </div>
                          <Button onClick={savePalette} className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                            <Save className="h-4 w-4 mr-2" />
                            {t('Button_Save_Palette')}
                          </Button>
                        </div>
                      )}
                      {activeTab === 'contrast' && (
                        <div className="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                          <div className="space-y-2">
                            <Label className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('Label_Contrast_White')}</Label>
                            <div className="flex items-center space-x-2">
                              <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md" style={{ backgroundColor: color }}>
                                <span className="text-white font-bold">A</span>
                              </div>
                              <span className="text-lg font-semibold">{getContrastRatio(color, '#ffffff').toFixed(2)}:1</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('Label_Contrast_Black')}</Label>
                            <div className="flex items-center space-x-2">
                              <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md" style={{ backgroundColor: color }}>
                                <span className="text-black font-bold">A</span>
                              </div>
                              <span className="text-lg font-semibold">{getContrastRatio(color, '#000000').toFixed(2)}:1</span>
                            </div>
                          </div>
                        </div>
                      )}
                      {activeTab === 'colorblind' && (
                        <div className="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                          <Select value={colorBlindnessType} onValueChange={setColorBlindnessType}>
                            <SelectTrigger aria-label={t('Aria_ColorBlindness_Type')} className="border-2 border-purple-300 dark:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                              <SelectValue placeholder={t('Placeholder_Select_ColorBlindness_Type')} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="normal">{t('SelectItem_NormalVision')}</SelectItem>
                              <SelectItem value="protanopia">{t('SelectItem_Protanopia')}</SelectItem>
                              <SelectItem value="deuteranopia">{t('SelectItem_Deuteranopia')}</SelectItem>
                              <SelectItem value="tritanopia">{t('SelectItem_Tritanopia')}</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="h-20 rounded-lg shadow-inner" style={{ backgroundColor: simulateColorBlindness(color, colorBlindnessType) }}></div>
                        </div>
                      )}
                      {activeTab === 'gradient' && (
                        <div className="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                          <div className="space-y-2">
                            <Label htmlFor="gradient-color" className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('Label_Gradient_EndColor')}</Label>
                            <Input
                              id="gradient-color"
                              type="color"
                              value={gradientColor}
                              onChange={(e) => {
                                if (isValidHex(e.target.value)) {
                                  setGradientColor(e.target.value)
                                }
                              }}
                              className="h-10 w-full border-2 border-purple-300 dark:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                          <div className="h-20 rounded-lg shadow-inner" style={{ background: `linear-gradient(to right, ${color}, ${gradientColor})` }}></div>
                          <Button onClick={() => copyToClipboard(`linear-gradient(to right, ${color}, ${gradientColor})`, 'Gradient CSS')} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                            <Copy className="h-4 w-4 mr-2" />
                            {t('Button_Copy_Gradient_CSS')}
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Tabs defaultValue="palette" value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-4 bg-purple-100 dark:bg-purple-900">
                        <TabsTrigger value="palette" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">{t('Tab_Palette')}</TabsTrigger>
                        <TabsTrigger value="contrast" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">{t('Tab_Contrast')}</TabsTrigger>
                        <TabsTrigger value="colorblind" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">{t('Tab_Colorblind')}</TabsTrigger>
                        <TabsTrigger value="gradient" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">{t('Tab_Gradient')}</TabsTrigger>
                      </TabsList>
                      <TabsContent value="palette" className="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-b-lg shadow-md">
                        <div className="space-y-2">
                          <Label className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('Label_Complementary')}</Label>
                          <div className="h-10 rounded-lg shadow-inner" style={{ backgroundColor: getComplementaryColor(color) }}></div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('Label_Analogous')}</Label>
                          <div className="flex space-x-2">
                            {getAnalogousColors(color).map((c, i) => (
                              <div key={i} className="flex-1 h-10 rounded-lg shadow-inner" style={{ backgroundColor: c }}></div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('Label_Triadic')}</Label>
                          <div className="flex space-x-2">
                            {getTriadicColors(color).map((c, i) => (
                              <div key={i} className="flex-1 h-10 rounded-lg shadow-inner" style={{ backgroundColor: c }}></div>
                            ))}
                          </div>
                        </div>
                        <Button onClick={savePalette} className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                          <Save className="h-4 w-4 mr-2" />
                          {t('Button_Save_Palette')}
                        </Button>
                      </TabsContent>
                      <TabsContent value="contrast" className="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-b-lg shadow-md">
                        <div className="space-y-2">
                          <Label className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('Label_Contrast_White')}</Label>
                          <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md" style={{ backgroundColor: color }}>
                              <span className="text-white font-bold">A</span>
                            </div>
                            <span className="text-lg font-semibold">{getContrastRatio(color, '#ffffff').toFixed(2)}:1</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('Label_Contrast_Black')}</Label>
                          <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md" style={{ backgroundColor: color }}>
                              <span className="text-black font-bold">A</span>
                            </div>
                            <span className="text-lg font-semibold">{getContrastRatio(color, '#000000').toFixed(2)}:1</span>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="colorblind" className="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-b-lg shadow-md">
                        <Select value={colorBlindnessType} onValueChange={setColorBlindnessType}>
                          <SelectTrigger aria-label={t('Aria_ColorBlindness_Type')} className="border-2 border-purple-300 dark:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                            <SelectValue placeholder={t('Placeholder_Select_ColorBlindness_Type')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">{t('SelectItem_NormalVision')}</SelectItem>
                            <SelectItem value="protanopia">{t('SelectItem_Protanopia')}</SelectItem>
                            <SelectItem value="deuteranopia">{t('SelectItem_Deuteranopia')}</SelectItem>
                            <SelectItem value="tritanopia">{t('SelectItem_Tritanopia')}</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="h-20 rounded-lg shadow-inner" style={{ backgroundColor: simulateColorBlindness(color, colorBlindnessType) }}></div>
                      </TabsContent>
                      <TabsContent value="gradient" className="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-b-lg shadow-md">
                        <div className="space-y-2">
                          <Label htmlFor="gradient-color" className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('Label_Gradient_EndColor')}</Label>
                          <Input
                            id="gradient-color"
                            type="color"
                            value={gradientColor}
                            onChange={(e) => {
                              if (isValidHex(e.target.value)) {
                                setGradientColor(e.target.value)
                              }
                            }}
                            className="h-10 w-full border-2 border-purple-300 dark:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div className="h-20 rounded-lg shadow-inner" style={{ background: `linear-gradient(to right, ${color}, ${gradientColor})` }}></div>
                        <Button onClick={() => copyToClipboard(`linear-gradient(to right, ${color}, ${gradientColor})`, 'Gradient CSS')} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                          <Copy className="h-4 w-4 mr-2" />
                          {t('Button_Copy_Gradient_CSS')}
                        </Button>
                      </TabsContent>
                    </Tabs>
                  )}
                </div>
              </section>

              {savedPalettes.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('Heading_Saved_Palettes')}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedPalettes.map((palette) => (
                      <div key={palette.id} className="border border-purple-300 dark:border-purple-600 p-4 rounded-lg space-y-2 bg-white dark:bg-gray-800 shadow-md">
                        <div className="flex space-x-2">
                          <button
                            className="flex-1 h-10 rounded-lg focus:outline-none shadow-inner"
                            style={{ backgroundColor: palette.mainColor }}
                            onClick={() => loadPalette(palette)}
                            aria-label={t('Aria_Load_Palette')}
                          ></button>
                          <div className="flex-1 h-10 rounded-lg shadow-inner" style={{ backgroundColor: palette.complementary }}></div>
                        </div>
                        <div className="flex space-x-2">
                          {palette.analogous.map((c, i) => (
                            <div key={i} className="flex-1 h-10 rounded-lg shadow-inner" style={{ backgroundColor: c }}></div>
                          ))}
                        </div>
                        <div className="flex space-x-2">
                          {palette.triadic.map((c, i) => (
                            <div key={i} className="flex-1 h-10 rounded-lg shadow-inner" style={{ backgroundColor: c }}></div>
                          ))}
                        </div>
                        <div className="flex justify-between">
                          <Button variant="outline" onClick={() => downloadPaletteInfo(palette)} className="bg-green-500 hover:bg-green-600 text-white">
                            <Download className="h-4 w-4 mr-2" />
                            {t('Button_Download_Info')}
                          </Button>
                          <Button variant="destructive" onClick={() => deletePalette(palette.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            {t('Button_Delete')}
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
