"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Head from "next/head";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTheme } from "next-themes";
import {
  Home,
  HelpCircle,
  Moon,
  Sun,
  Copy,
  Save,
  Trash2,
  Play,
  VolumeX,
  Download,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const morseCodeMap = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.",
  G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..",
  M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.",
  S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
  Y: "-.--", Z: "--..", 0: "-----", 1: ".----", 2: "..---",
  3: "...--", 4: "....-", 5: ".....", 6: "-....", 7: "--...",
  8: "---..", 9: "----.", ".": ".-.-.-", ",": "--..--", "?": "..--..",
  "'": ".----.", "!": "-.-.--", "/": "-..-.", "(": "-.--.", ")": "-.--.-",
  "&": ".-...", ":": "---...", ";": "-.-.-.", "=": "-...-", "+": ".-.-.",
  "-": "-....-", _: "..--.-", '"': ".-..-.", $: "...-..-", "@": ".--.-.",
  " ": "/"
};

const reverseMorseCodeMap = Object.fromEntries(
  Object.entries(morseCodeMap).map(([key, value]) => [value, key])
);

const mostUsedWords = ["HELLO", "HELP", "SOS", "THANK YOU", "PLEASE", "YES", "NO", "OK"];

export default function MorseCodeTranslator() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState("textToMorse");
  const [savedTranslations, setSavedTranslations] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const audioContext = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("savedTranslations");
    if (saved) {
      setSavedTranslations(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    translateInput();
  }, [input, mode]);

  const translateInput = () => {
    if (mode === "textToMorse") {
      setOutput(textToMorse(input));
    } else {
      setOutput(morseToText(input));
    }
  };

  const textToMorse = (text) => {
    return text
      .toUpperCase()
      .split("")
      .map((char) => morseCodeMap[char] || char)
      .join(" ");
  };

  const morseToText = (morse) => {
    return morse
      .split(" ")
      .map((code) => reverseMorseCodeMap[code] || code)
      .join("");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    toast({
      title: "Copied to clipboard",
      description: "The translated text has been copied to your clipboard.",
    });
  };

  const handleSave = () => {
    const newTranslation = { input, output, mode, timestamp: Date.now() };
    const updatedTranslations = [...savedTranslations, newTranslation];
    setSavedTranslations(updatedTranslations);
    localStorage.setItem("savedTranslations", JSON.stringify(updatedTranslations));
    toast({
      title: "Translation saved",
      description: "Your translation has been saved.",
    });
  };

  const handleDelete = (timestamp) => {
    const updatedTranslations = savedTranslations.filter((t) => t.timestamp !== timestamp);
    setSavedTranslations(updatedTranslations);
    localStorage.setItem("savedTranslations", JSON.stringify(updatedTranslations));
    toast({
      title: "Translation deleted",
      description: "The selected translation has been deleted.",
    });
  };

  const playMorseCode = (morseCode) => {
    setIsPlaying(true);
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const audio = audioContext.current;
    const dotDuration = 60; // milliseconds

    const playTone = (duration) => {
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.connect(gain);
      gain.connect(audio.destination);
      osc.frequency.value = 600;
      gain.gain.setValueAtTime(0.5, audio.currentTime);
      osc.start();
      osc.stop(audio.currentTime + duration);
    };

    const playSymbol = (symbol) => {
      return new Promise((resolve) => {
        if (symbol === ".") {
          playTone(dotDuration / 1000);
          setTimeout(resolve, dotDuration);
        } else if (symbol === "-") {
          playTone(dotDuration * 3 / 1000);
          setTimeout(resolve, dotDuration * 3);
        } else if (symbol === " ") {
          setTimeout(resolve, dotDuration * 3);
        } else if (symbol === "/") {
          setTimeout(resolve, dotDuration * 7);
        }
      });
    };

    const playSequence = async () => {
      for (let symbol of morseCode) {
        await playSymbol(symbol);
      }
      setIsPlaying(false);
    };

    playSequence();
  };

  const handleDownloadMp3 = async (translation) => {
    const morseCode = translation.mode === "textToMorse" ? translation.output : textToMorse(translation.input);
    const audioBlob = await generateMorseAudio(morseCode);
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `morse_code_${translation.timestamp}_${morseCode.length}chars.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Audio downloaded",
      description: `The Morse code audio (${morseCode.length} characters) has been downloaded as a WAV file.`,
    });
  };

  return (
    <>
      <Head>
        <title>Morse Code Translator</title>
        <meta
          name="description"
          content="Easily translate text to Morse code and vice versa with this tool. Save, play, and download translations as audio files."
        />
        <meta
          name="keywords"
          content="Morse code translator, text to Morse, Morse code to text, Morse code audio, Morse code player"
        />
        <meta name="author" content="Your Name or Company" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Morse Code Translator" />
        <meta
          property="og:description"
          content="Translate between text and Morse code with audio playback, saving, and downloading options. A comprehensive Morse code translator tool."
        />
        <meta property="og:image" content="https://example.com/og-image.jpg" />
        <meta property="og:url" content="https://example.com/morse-code-translator" />
        <meta property="og:type" content="website" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Morse Code Translator" />
        <meta
          name="twitter:description"
          content="Translate text to Morse code and vice versa, with the ability to play, save, and download Morse code as audio."
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
          <h1 className="text-3xl font-bold">Morse Code Translator</h1>
          <div className="space-x-2 flex items-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Help">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>About Morse Code Translator</DialogTitle>
                  <DialogDescription>
                    <p className="mt-2">
                      <strong>Why:</strong> This tool helps you translate between text and Morse code.
                    </p>
                    <p className="mt-2">
                      <strong>What:</strong> You can convert text to Morse code or Morse code to text, play the Morse code audio, save translations, and download Morse code as audio files.
                    </p>
                    <p className="mt-2">
                      <strong>How:</strong> Enter your text or Morse code, select the translation mode, and use the buttons to copy, save, play, or download the result.
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

        <main>
          <section className="space-y-4">
            <div>
              <Label htmlFor="translation-mode">Translation Mode</Label>
              <select
                id="translation-mode"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full p-2 border rounded-md dark:bg-gray-800"
                aria-label="Translation Mode"
              >
                <option value="textToMorse">Text to Morse Code</option>
                <option value="morseToText">Morse Code to Text</option>
              </select>
            </div>
            <div>
              <Label htmlFor="input">Input</Label>
              <Textarea
                id="input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === "textToMorse" ? "Enter text here" : "Enter Morse code here"}
                rows={4}
                aria-label="Input Text"
              />
            </div>
            <div>
              <Label htmlFor="output">Output</Label>
              <div className="relative">
                <Textarea id="output" value={output} readOnly rows={4} aria-label="Output Text" />
                <div className="absolute top-2 right-2 space-x-2">
                  <Button size="sm" onClick={handleCopy} aria-label="Copy Output">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button size="sm" onClick={handleSave} aria-label="Save Translation">
                    <Save className="h-4 w-4" />
                  </Button>
                  {mode === "textToMorse" && (
                    <Button size="sm" onClick={() => playMorseCode(output)} disabled={isPlaying} aria-label="Play Morse Code">
                      {isPlaying ? <VolumeX className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Most Used Words</h2>
            <div className="flex flex-wrap gap-2">
              {mostUsedWords.map((word) => (
                <Button key={word} variant="outline" size="sm" onClick={() => setInput(word)}>
                  {word}
                </Button>
              ))}
            </div>
          </section>

          {savedTranslations.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">Saved Translations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedTranslations.map((translation) => (
                  <div key={translation.timestamp} className="border p-4 rounded-lg space-y-2">
                    <p>
                      <strong>Input:</strong> {translation.input}
                    </p>
                    <p>
                      <strong>Output:</strong> {translation.output}
                    </p>
                    <p>
                      <strong>Mode:</strong> {translation.mode === "textToMorse" ? "Text to Morse" : "Morse to Text"}
                    </p>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleDownloadMp3(translation)} aria-label="Download Morse Audio">
                        <Download className="h-4 w-4 mr-2" />
                        Download Audio
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(translation.timestamp)} aria-label="Delete Translation">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Morse Code Chart</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {Object.entries(morseCodeMap).map(([char, code]) => (
                <div key={char} className="flex justify-between border p-2 rounded">
                  <span>{char}</span>
                  <span>{code}</span>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
