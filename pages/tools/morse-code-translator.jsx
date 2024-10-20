"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useTheme } from "next-themes"
import { Home, HelpCircle, Moon, Sun, Copy, Save, Trash2, Play, VolumeX, Download } from 'lucide-react'
import { useToast } from "@/hooks/use-toast";

const morseCodeMap = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
  '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.', '.': '.-.-.-', ',': '--..--', '?': '..--..',
  "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
  '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.',
  '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
  ' ': '/'
}

const reverseMorseCodeMap = Object.fromEntries(
  Object.entries(morseCodeMap).map(([key, value]) => [value, key])
)

const mostUsedWords = [
  "HELLO", "HELP", "SOS", "THANK YOU", "PLEASE", "YES", "NO", "OK"
]

export default function MorseCodeTranslator() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState('textToMorse')
  const [savedTranslations, setSavedTranslations] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const audioContext = useRef(null)

  useEffect(() => {
    const saved = localStorage.getItem('savedTranslations')
    if (saved) {
      setSavedTranslations(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    translateInput()
  }, [input, mode])

  const translateInput = () => {
    if (mode === 'textToMorse') {
      setOutput(textToMorse(input))
    } else {
      setOutput(morseToText(input))
    }
  }

  const textToMorse = (text) => {
    return text.toUpperCase().split('').map(char => morseCodeMap[char] || char).join(' ')
  }

  const morseToText = (morse) => {
    return morse.split(' ').map(code => reverseMorseCodeMap[code] || code).join('')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
    toast({
      title: "Copied to clipboard",
      description: "The translated text has been copied to your clipboard.",
    })
  }

  const handleSave = () => {
    const newTranslation = { input, output, mode, timestamp: Date.now() }
    const updatedTranslations = [...savedTranslations, newTranslation]
    setSavedTranslations(updatedTranslations)
    localStorage.setItem('savedTranslations', JSON.stringify(updatedTranslations))
    toast({
      title: "Translation saved",
      description: "Your translation has been saved.",
    })
  }

  const handleDelete = (timestamp) => {
    const updatedTranslations = savedTranslations.filter(t => t.timestamp !== timestamp)
    setSavedTranslations(updatedTranslations)
    localStorage.setItem('savedTranslations', JSON.stringify(updatedTranslations))
    toast({
      title: "Translation deleted",
      description: "The selected translation has been deleted.",
    })
  }

  const playMorseCode = (morseCode) => {
    setIsPlaying(true)
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    const audio = audioContext.current
    const dotDuration = 60 // milliseconds
    
    const playTone = (duration) => {
      const osc = audio.createOscillator()
      const gain = audio.createGain()
      osc.connect(gain)
      gain.connect(audio.destination)
      osc.frequency.value = 600
      gain.gain.setValueAtTime(0.5, audio.currentTime)
      osc.start()
      osc.stop(audio.currentTime + duration)
    }

    const playSymbol = (symbol) => {
      return new Promise(resolve => {
        if (symbol === '.') {
          playTone(dotDuration / 1000)
          setTimeout(resolve, dotDuration)
        } else if (symbol === '-') {
          playTone(dotDuration * 3 / 1000)
          setTimeout(resolve, dotDuration * 3)
        } else if (symbol === ' ') {
          setTimeout(resolve, dotDuration * 3)
        } else if (symbol === '/') {
          setTimeout(resolve, dotDuration * 7)
        }
      })
    }

    const playSequence = async () => {
      for (let symbol of morseCode) {
        await playSymbol(symbol)
      }
      setIsPlaying(false)
    }

    playSequence()
  }

  const generateMorseAudio = (morseCode) => {
    return new Promise((resolve) => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const dotDuration = 0.06 // seconds
    
      // Calculate the total duration of the Morse code
      const totalDuration = morseCode.split('').reduce((acc, symbol) => {
        if (symbol === '.') return acc + dotDuration * 2; // dot + space
        if (symbol === '-') return acc + dotDuration * 4; // dash + space
        if (symbol === ' ') return acc + dotDuration * 3; // word space
        if (symbol === '/') return acc + dotDuration * 7; // new word
        return acc;
      }, 0);

      const offlineAudioContext = new OfflineAudioContext(1, audioContext.sampleRate * totalDuration, audioContext.sampleRate)
    
      let currentTime = 0

      const playTone = (duration) => {
        const osc = offlineAudioContext.createOscillator()
        const gain = offlineAudioContext.createGain()
        osc.connect(gain)
        gain.connect(offlineAudioContext.destination)
        osc.frequency.value = 600
        gain.gain.setValueAtTime(0.5, currentTime)
        osc.start(currentTime)
        osc.stop(currentTime + duration)
        currentTime += duration
      }

      const addSilence = (duration) => {
        currentTime += duration
      }

      for (let symbol of morseCode) {
        if (symbol === '.') {
          playTone(dotDuration)
          addSilence(dotDuration)
        } else if (symbol === '-') {
          playTone(dotDuration * 3)
          addSilence(dotDuration)
        } else if (symbol === ' ') {
          addSilence(dotDuration * 3)
        } else if (symbol === '/') {
          addSilence(dotDuration * 7)
        }
      }

      offlineAudioContext.startRendering().then((renderedBuffer) => {
        const wav = audioBufferToWav(renderedBuffer)
        const blob = new Blob([new DataView(wav)], { type: 'audio/wav' })
        resolve(blob)
      })
    })
  }

  const audioBufferToWav = (buffer) => {
    const numOfChan = buffer.numberOfChannels
    const length = buffer.length * numOfChan * 2 + 44
    const out = new ArrayBuffer(length)
    const view = new DataView(out)
    const channels = []
    let sample
    let offset = 0
    let pos = 0

    // write WAVE header
    setUint32(0x46464952)
    setUint32(length - 8)
    setUint32(0x45564157)
    setUint32(0x20746d66)
    setUint32(16)
    setUint16(1)
    setUint16(numOfChan)
    setUint32(buffer.sampleRate)
    setUint32(buffer.sampleRate * 2 * numOfChan)
    setUint16(numOfChan * 2)
    setUint16(16)
    setUint32(0x61746164)
    setUint32(length - pos - 4)

    for (let i = 0; i < buffer.numberOfChannels; i++)
      channels.push(buffer.getChannelData(i))

    while (pos < length) {
      for (let i = 0; i < numOfChan; i++) {
        sample = Math.max(-1, Math.min(1, channels[i][offset]))
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0
        view.setInt16(pos, sample, true)
        pos += 2
      }
      offset++
    }

    return out

    function setUint16(data) {
      view.setUint16(pos, data, true)
      pos += 2
    }

    function setUint32(data) {
      view.setUint32(pos, data, true)
      pos += 4
    }
  }

  const handleDownloadMp3 = async (translation) => {
    const morseCode = translation.mode === 'textToMorse' ? translation.output : textToMorse(translation.input)
    const audioBlob = await generateMorseAudio(morseCode)
    const url = URL.createObjectURL(audioBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `morse_code_${translation.timestamp}_${morseCode.length}chars.wav`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast({
      title: "Audio downloaded",
      description: `The Morse code audio (${morseCode.length} characters) has been downloaded as a WAV file.`,
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Morse Code Translator</h1>
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
        <div>
          <Label htmlFor="translation-mode">Translation Mode</Label>
          <select
            id="translation-mode"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="w-full p-2 border rounded-md dark:bg-gray-800"
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
            placeholder={mode === 'textToMorse' ? 'Enter text here' : 'Enter Morse code here'}
            rows={4}
          />
        </div>
        <div>
          <Label htmlFor="output">Output</Label>
          <div className="relative">
            <Textarea
              id="output"
              value={output}
              readOnly
              rows={4}
            />
            <div className="absolute top-2 right-2 space-x-2">
              <Button size="sm" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4" />
              </Button>
              {mode ===   'textToMorse' && (
                <Button size="sm" onClick={() => playMorseCode(output)} disabled={isPlaying}>
                  {isPlaying ? <VolumeX className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Most Used Words</h2>
        <div className="flex flex-wrap gap-2">
          {mostUsedWords.map((word) => (
            <Button
              key={word}
              variant="outline"
              size="sm"
              onClick={() => setInput(word)}
            >
              {word}
            </Button>
          ))}
        </div>
      </div>

      {savedTranslations.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Saved Translations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedTranslations.map((translation) => (
              <div key={translation.timestamp} className="border p-4 rounded-lg space-y-2">
                <p><strong>Input:</strong> {translation.input}</p>
                <p><strong>Output:</strong> {translation.output}</p>
                <p><strong>Mode:</strong> {translation.mode === 'textToMorse' ? 'Text to Morse' : 'Morse to Text'}</p>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleDownloadMp3(translation)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Audio
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(translation.timestamp)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Morse Code Chart</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {Object.entries(morseCodeMap).map(([char, code]) => (
            <div key={char} className="flex justify-between border p-2 rounded">
              <span>{char}</span>
              <span>{code}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}