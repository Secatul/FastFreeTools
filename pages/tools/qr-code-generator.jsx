"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import DOMPurify from "dompurify";
import Head from "next/head";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useTheme } from "next-themes";
import { Home, HelpCircle, Moon, Sun, Download, Save, Trash2 } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

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
      alert("Invalid file type. Only PNG, JPG, and GIF are allowed.");
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
    };
    setSavedQRCodes((prev) => [...prev, newQRCode]);
  };

  const deleteSavedQRCode = (id) => {
    setSavedQRCodes((prev) => prev.filter((qr) => qr.id !== id));
  };

  const loadSavedQRCode = (qrCode) => {
    setQrValue(qrCode.value);
    setFgColor(qrCode.fgColor);
    setBgColor(qrCode.bgColor);
    setErrorCorrectionLevel(qrCode.errorCorrectionLevel);
  };

  return (
    <>
      <Head>
        <title>QR Code Generator</title>
        <meta
          name="description"
          content="Create custom QR codes with configurable options like content, size, foreground and background colors, error correction levels, and logos. Download your QR codes in PNG or SVG format."
        />
        <meta
          name="keywords"
          content="QR code generator, QR code with logo, custom QR codes, QR code download, online QR code generator"
        />
        <meta name="author" content="Your Name or Company" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="QR Code Generator" />
        <meta
          property="og:description"
          content="Generate customizable QR codes with options like size, colors, error correction, and logos. Download your QR codes in PNG or SVG."
        />
        <meta property="og:image" content="https://example.com/og-image.jpg" />
        <meta property="og:url" content="https://example.com/qr-code-generator" />
        <meta property="og:type" content="website" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="QR Code Generator" />
        <meta
          name="twitter:description"
          content="Create custom QR codes for your projects with configurable settings and the option to download them in PNG or SVG format."
        />
        <meta name="twitter:image" content="https://example.com/twitter-image.jpg" />

        {/* Responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Charset and Favicon */}
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">QR Code Generator</h1>
          <div className="space-x-2 flex items-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Help">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </DialogTrigger>
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

        <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="space-y-4">
            <div>
              <Label htmlFor="qr-value">QR Code Content</Label>
              <Input
                id="qr-value"
                value={qrValue}
                onChange={(e) => setQrValue(DOMPurify.sanitize(e.target.value))}
                placeholder="Enter URL or text"
                aria-label="QR Code Content"
              />
            </div>
            <div>
              <Label htmlFor="qr-size">QR Code Size</Label>
              <Input
                id="qr-size"
                type="number"
                value={qrSize}
                onChange={(e) => setQrSize(Number(e.target.value))}
                min={128}
                max={1024}
                aria-label="QR Code Size"
              />
            </div>
            <div>
              <Label htmlFor="fg-color">Foreground Color</Label>
              <Input
                id="fg-color"
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                aria-label="Foreground Color"
              />
            </div>
            <div>
              <Label htmlFor="bg-color">Background Color</Label>
              <Input
                id="bg-color"
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                aria-label="Background Color"
              />
            </div>
            <div>
              <Label htmlFor="error-correction">Error Correction Level</Label>
              <Select
                value={errorCorrectionLevel}
                onValueChange={(value) => setErrorCorrectionLevel(value)}
                aria-label="Error Correction Level"
              >
                <SelectTrigger id="error-correction">
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
            <div>
              <Label htmlFor="logo-upload">Upload Logo (optional)</Label>
              <Input
                id="logo-upload"
                type="file"
                onChange={handleLogoUpload}
                accept="image/*"
                aria-label="Upload Logo"
              />
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex justify-center items-center bg-white dark:bg-gray-800 p-4 rounded-lg">
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
            <div className="flex justify-center space-x-2">
              <Button onClick={() => downloadQRCode("png")} aria-label="Download QR Code as PNG">
                <Download className="h-4 w-4 mr-2" />
                Download PNG
              </Button>
              <Button onClick={() => downloadQRCode("svg")} aria-label="Download QR Code as SVG">
                <Download className="h-4 w-4 mr-2" />
                Download SVG
              </Button>
              <Button onClick={saveQRCode} aria-label="Save QR Code">
                <Save className="h-4 w-4 mr-2" />
                Save QR Code
              </Button>
            </div>
          </section>
        </main>

        {savedQRCodes.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Saved QR Codes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {savedQRCodes.map((qrCode) => (
                <div key={qrCode.id} className="border p-4 rounded-lg">
                  <QRCodeCanvas
                    value={qrCode.value}
                    size={128}
                    fgColor={qrCode.fgColor}
                    bgColor={qrCode.bgColor}
                    level={qrCode.errorCorrectionLevel}
                  />
                  <p className="mt-2 text-sm truncate">{qrCode.label}</p>
                  <div className="flex justify-between mt-2">
                    <Button size="sm" onClick={() => loadSavedQRCode(qrCode)} aria-label="Load Saved QR Code">
                      Load
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteSavedQRCode(qrCode.id)} aria-label="Delete Saved QR Code">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
