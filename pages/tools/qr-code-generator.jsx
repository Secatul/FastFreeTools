import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTheme } from "next-themes";
import { Home, HelpCircle, Moon, Sun, Download, Save, Trash2, Upload, RefreshCw } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DOMPurify from 'dompurify';

function sanitizeInput(input) {
  return DOMPurify.sanitize(input);
}

export default function QRCodeGenerator() {
  const [qrValue, setQrValue] = useState("https://example.com");
  const [qrSize, setQrSize] = useState(256);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState("M");
  const [logoFile, setLogoFile] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const [savedQRCodes, setSavedQRCodes] = useState([]);
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  useEffect(() => {
    const savedCodes = localStorage.getItem('savedQRCodes');
    if (savedCodes) {
      setSavedQRCodes(JSON.parse(savedCodes));
    }
  }, []);

  useEffect(() => {
    if (logoFile) {
      const reader = new FileReader();
      reader.onload = (e) => setLogoUrl(e.target?.result);
      reader.readAsDataURL(logoFile);
    }
  }, [logoFile]);

  const handleLogoUpload = (event) => {
    const file = event.target.files?.[0];
    if (file && ["image/png", "image/jpeg", "image/gif"].includes(file.type)) {
      setLogoFile(file);
    } else {
      toast({
        title: "Invalid file type",
        description: "Only PNG, JPG, and GIF are allowed.",
        variant: "destructive",
      });
    }
  };

  const downloadQRCode = (format) => {
    const canvas = document.getElementById("qr-code");
    if (canvas) {
      const dataUrl = canvas.toDataURL(`image/${format}`);
      const link = document.createElement("a");
      link.download = `qrcode.${format}`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({
        title: "QR Code downloaded",
        description: `Your QR code has been downloaded as ${format.toUpperCase()}.`,
      });
    }
  };

  const saveQRCode = () => {
    const newQRCode = {
      id: Date.now().toString(),
      label: qrValue,
      value: qrValue,
      fgColor,
      bgColor,
      errorCorrectionLevel,
      size: qrSize,
    };
    const updatedQRCodes = [...savedQRCodes, newQRCode];
    setSavedQRCodes(updatedQRCodes);
    localStorage.setItem('savedQRCodes', JSON.stringify(updatedQRCodes));
    toast({
      title: "QR Code saved",
      description: "Your QR code has been saved successfully.",
    });
  };

  const deleteSavedQRCode = (id) => {
    const updatedQRCodes = savedQRCodes.filter((qr) => qr.id !== id);
    setSavedQRCodes(updatedQRCodes);
    localStorage.setItem('savedQRCodes', JSON.stringify(updatedQRCodes));
    toast({
      title: "QR Code deleted",
      description: "The saved QR code has been deleted.",
      variant: "destructive",
    });
  };

  const loadSavedQRCode = (qrCode) => {
    setQrValue(qrCode.value);
    setFgColor(qrCode.fgColor);
    setBgColor(qrCode.bgColor);
    setErrorCorrectionLevel(qrCode.errorCorrectionLevel);
    setQrSize(qrCode.size);
    toast({
      title: "QR Code loaded",
      description: "The saved QR code has been loaded.",
    });
  };

  const generateRandomQRCode = () => {
    const randomValue = `https://example.com/${Math.random().toString(36).substring(7)}`;
    setQrValue(randomValue);
    setFgColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
    setBgColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
    setErrorCorrectionLevel(['L', 'M', 'Q', 'H'][Math.floor(Math.random() * 4)]);
    setQrSize(Math.floor(Math.random() * (512 - 128 + 1) + 128));
  };

  return (
    <>
      <Head>
        <title>QR Code Generator | Fast Task</title>
        <meta name="description" content="Create custom QR codes with configurable options like content, size, foreground and background colors, error correction levels, and logos. Download your QR codes in PNG or SVG format." />
        <meta name="keywords" content="QR code generator, QR code with logo, custom QR codes, QR code download, online QR code generator" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-900 dark:to-red-900 p-4 sm:p-6">
          <main className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-in-out">
            <header className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 text-white p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl sm:text-4xl font-bold">QR Code Generator</h1>
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
                        <p>Get help and information about the QR Code Generator</p>
                      </TooltipContent>
                    </Tooltip>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>About QR Code Generator</DialogTitle>
                        <DialogDescription>
                          <p className="mt-2">
                            <strong>Why:</strong> This tool helps you create customized QR codes for various purposes.
                          </p>
                          <p className="mt-2">
                            <strong>What:</strong> You can generate QR codes with custom content, colors, error correction levels, and even add a logo.
                          </p>
                          <p className="mt-2">
                            <strong>How:</strong> Enter the content for your QR code, customize its appearance, and download it in PNG or SVG format.
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="qr-value" className="text-lg font-semibold text-gray-700 dark:text-gray-300">QR Code Content</Label>
                    <Input
                      id="qr-value"
                      value={qrValue}
                      onChange={(e) => setQrValue(sanitizeInput(e.target.value))}
                      placeholder="Enter URL or text"
                      className="border-2 border-purple-300 dark:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="qr-size" className="text-lg font-semibold text-gray-700 dark:text-gray-300">QR Code Size</Label>
                    <Input
                      id="qr-size"
                      type="number"
                      value={qrSize}
                      onChange={(e) => setQrSize(Number(e.target.value))}
                      min={128}
                      max={1024}
                      className="border-2 border-purple-300 dark:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fg-color" className="text-lg font-semibold text-gray-700 dark:text-gray-300">Foreground Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="fg-color"
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="w-12 h-12 p-1 rounded-md"
                      />
                      <Input
                        type="text"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="flex-grow border-2 border-purple-300 dark:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bg-color" className="text-lg font-semibold text-gray-700 dark:text-gray-300">Background Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="bg-color"
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-12 h-12 p-1 rounded-md"
                      />
                      <Input
                        type="text"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="flex-grow border-2 border-purple-300 dark:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="error-correction" className="text-lg font-semibold text-gray-700 dark:text-gray-300">Error Correction Level</Label>
                    <Select value={errorCorrectionLevel} onValueChange={setErrorCorrectionLevel}>
                      <SelectTrigger id="error-correction" className="border-2 border-purple-300 dark:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                        <SelectValue placeholder="Select error correction level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="L">Low (7%)</SelectItem>
                        <SelectItem value="M">Medium (15%)</SelectItem>
                        <SelectItem value="Q">Quartile (25%)</SelectItem>
                        <SelectItem value="H">High (30%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logo-upload" className="text-lg font-semibold text-gray-700 dark:text-gray-300">Upload Logo (optional)</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="logo-upload"
                        type="file"
                        onChange={handleLogoUpload}
                        accept="image/*"
                        className="border-2 border-purple-300 dark:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      {logoUrl && (
                        <img src={logoUrl} alt="Uploaded logo" className="w-10 h-10 object-contain" />
                      )}
                    </div>
                  </div>
                  <Button onClick={generateRandomQRCode} className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Generate Random QR Code
                  </Button>
                </section>

                <section className="space-y-4">
                  <div className="flex justify-center items-center bg-white dark:bg-gray-700 p-4 rounded-lg shadow-inner">
                    <QRCodeCanvas
                      id="qr-code"
                      value={qrValue}
                      size={qrSize}
                      fgColor={fgColor}
                      bgColor={bgColor}
                      level={errorCorrectionLevel}
                      imageSettings={
                        logoUrl
                          ? {
                              src: logoUrl,
                              x: undefined,
                              y: undefined,
                              height: 24,
                              width: 24,
                              excavate: true,
                            }
                          : undefined
                      }
                    />
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Button onClick={() => downloadQRCode("png")} className="bg-blue-500 hover:bg-blue-600 text-white">
                      <Download className="h-4 w-4 mr-2" />
                      Download PNG
                    </Button>
                    <Button onClick={() => downloadQRCode("svg")} className="bg-green-500 hover:bg-green-600 text-white">
                      <Download className="h-4 w-4 mr-2" />
                      Download SVG
                    </Button>
                    <Button onClick={saveQRCode} className="bg-purple-500 hover:bg-purple-600 text-white">
                      <Save className="h-4 w-4 mr-2" />
                      Save QR Code
                    </Button>
                  </div>
                </section>
              </div>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">QR Code Analysis</h2>
                <Tabs defaultValue="info">
                  <TabsList className="grid w-full grid-cols-2 bg-purple-100 dark:bg-purple-900">
                    <TabsTrigger value="info" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">Information</TabsTrigger>
                    <TabsTrigger value="compatibility" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">Compatibility</TabsTrigger>
                  </TabsList>
                  <TabsContent value="info" className="p-4 bg-white dark:bg-gray-800 rounded-b-lg shadow-md">
                    <div className="space-y-2">
                      <p><strong>Content Type:</strong> {qrValue.startsWith('http') ? 'URL' : 'Text'}</p>
                      <p><strong>Character Count:</strong> {qrValue.length}</p>
                      <p><strong>Error Correction:</strong> {errorCorrectionLevel === 'L' ? 'Low (7%)' : errorCorrectionLevel === 'M' ? 'Medium (15%)' : errorCorrectionLevel === 'Q' ? 'Quartile (25%)' : 'High (30%)'}</p>
                      <p><strong>Estimated Scan Distance:</strong> {Math.round(qrSize / 10)} cm (assuming 1 module = 1 mm)</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="compatibility" className="p-4 bg-white dark:bg-gray-800 rounded-b-lg shadow-md">
                    <div className="space-y-2">
                      <p><strong>Smartphone Compatibility:</strong> High (iOS, Android)</p>
                      <p><strong>Desktop Webcam Compatibility:</strong> Medium (depends on camera quality)</p>
                      <p><strong>Print Compatibility:</strong> Good (ensure sufficient contrast and size when printing)</p>
                      <p><strong>Scan Speed:</strong> Fast (due to error correction and optimized pattern)</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </section>

              {savedQRCodes.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Saved QR Codes</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {savedQRCodes.map((qrCode) => (
                      <div key={qrCode.id} className="border border-purple-300 dark:border-purple-600 p-4 rounded-lg space-y-2 bg-white dark:bg-gray-800 shadow-md">
                        <QRCodeCanvas
                          value={qrCode.value}
                          size={128}
                          fgColor={qrCode.fgColor}
                          bgColor={qrCode.bgColor}
                          level={qrCode.errorCorrectionLevel}
                        />
                        <p className="text-sm truncate">{qrCode.label}</p>
                        <div className="flex justify-between">
                          <Button size="sm" onClick={() => loadSavedQRCode(qrCode)} className="bg-blue-500 hover:bg-blue-600 text-white">
                            <Upload className="h-4 w-4 mr-2" />
                            Load
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteSavedQRCode(qrCode.id)}>
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
