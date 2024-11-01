'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Head from 'next/head'
import { usePathname } from 'next/navigation'
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import ShareButton from '../components/share-button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Link from "next/link"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useTheme } from "next-themes"
import { Home, HelpCircle, Moon, Sun, Copy, Save, Trash2, Play, VolumeX, Download } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { useTranslations } from 'next-intl'

const morseCodeMap: { [key: string]: string } = {
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

const reverseMorseCodeMap: { [key: string]: string } = Object.fromEntries(
  Object.entries(morseCodeMap).map(([key, value]) => [value, key])
)

const mostUsedWords = [
  "HELLO", "HELP", "SOS", "THANK YOU", "PLEASE", "YES", "NO", "OK"
]

interface Translation {
  input: string
  output: string
  mode: 'textToMorse' | 'morseToText'
  timestamp: number
}

export default function MorseCodeTranslator() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'textToMorse' | 'morseToText'>('textToMorse')
  const [savedTranslations, setSavedTranslations] = useState<Translation[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const audioContext = useRef<AudioContext | null>(null)
  const t = useTranslations('MorseCodeTranslator')
  const pathname = usePathname()

  if (!pathname) {
    return null
  }

  const locale = pathname.split("/")[1]
  const shareUrl = `https://fastfreetools.com/${locale}/morse-code-translator`
  const shareTitle = t('shareTitle')

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

  const textToMorse = (text: string): string => {
    return text.toUpperCase().split('').map(char => morseCodeMap[char] || char).join(' ')
  }

  const morseToText = (morse: string): string => {
    return morse.split(' ').map(code => reverseMorseCodeMap[code] || code).join('')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
    toast({
      title: t('copiedToClipboardTitle'),
      description: t('copiedToClipboardDescription'),
    })
  }

  const handleSave = () => {
    const newTranslation: Translation = { input, output, mode, timestamp: Date.now() }
    const updatedTranslations = [...savedTranslations, newTranslation]
    setSavedTranslations(updatedTranslations)
    localStorage.setItem('savedTranslations', JSON.stringify(updatedTranslations))
    toast({
      title: t('translationSavedTitle'),
      description: t('translationSavedDescription'),
    })
  }

  const handleDelete = (timestamp: number) => {
    const updatedTranslations = savedTranslations.filter(t => t.timestamp !== timestamp)
    setSavedTranslations(updatedTranslations)
    localStorage.setItem('savedTranslations', JSON.stringify(updatedTranslations))
    toast({
      title: t('translationDeletedTitle'),
      description: t('translationDeletedDescription'),
    })
  }

  const playMorseCode = (morseCode: string) => {
    setIsPlaying(true)
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    const audio = audioContext.current
    const dotDuration = 60 

    const playTone = (duration: number) => {
      const osc = audio.createOscillator()
      const gain = audio.createGain()
      osc.connect(gain)
      gain.connect(audio.destination)
      osc.frequency.value = 600
      gain.gain.setValueAtTime(0.5, audio.currentTime)
      osc.start()
      osc.stop(audio.currentTime + duration)
    }

    const playSymbol = (symbol: string) => {
      return new Promise<void>(resolve => {
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

  const generateMorseAudio = (morseCode: string): Promise<Blob> => {
    return new Promise((resolve) => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const dotDuration = 0.06 // seconds

      // Calculate the total duration of the Morse code
      const totalDuration = morseCode.split('').reduce((acc, symbol) => {
        if (symbol === '.') return acc + dotDuration * 2 // dot + space
        if (symbol === '-') return acc + dotDuration * 4 // dash + space
        if (symbol === ' ') return acc + dotDuration * 3 // word space
        if (symbol === '/') return acc + dotDuration * 7 // new word
        return acc
      }, 0)

      const offlineAudioContext = new OfflineAudioContext(1, audioContext.sampleRate * totalDuration, audioContext.sampleRate)

      let currentTime = 0

      const playTone = (duration: number) => {
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

      const addSilence = (duration: number) => {
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

  const audioBufferToWav = (buffer: AudioBuffer): ArrayBuffer => {
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

    function setUint16(data: number) {
      view.setUint16(pos, data, true)
      pos += 2
    }

    function setUint32(data: number) {
      view.setUint32(pos, data, true)
      pos += 4
    }
  }

  const handleDownloadMp3 = async (translation: Translation) => {
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
      title: t('audioDownloadedTitle'),
      description: t('audioDownloadedDescription', { chars: morseCode.length }),
    })
  }

  return (
    <>
      <Head>
        <title>{t('pageTitle')}</title>
        <meta
          name="description"
          content={t('pageDescription')}
        />
        <meta
          name="keywords"
          content={t('pageKeywords')}
        />
        <meta name="author" content="Fast Free Tools" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={shareUrl} />
        <meta property="og:title" content={t('ogTitle')} />
        <meta
          property="og:description"
          content={t('ogDescription')}
        />
        <meta property="og:image" content="https://fastfreetools.com/og-image.jpg" />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('twitterTitle')} />
        <meta
          name="twitter:description"
          content={t('twitterDescription')}
        />
        <meta name="twitter:image" content="https://fastfreetools.com/twitter-image.jpg" />
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="alternate" hrefLang="en" href="https://fastfreetools.com/en/morse-code-translator" />
        <link rel="alternate" hrefLang="es" href="https://fastfreetools.com/es/morse-code-translator" />
        <link rel="alternate"   hrefLang="fr" href="https://fastfreetools.com/fr/morse-code-translator" />
        <link rel="alternate" hrefLang="de" href="https://fastfreetools.com/de/morse-code-translator" />
        <link rel="alternate" hrefLang="x-default" href="https://fastfreetools.com/morse-code-translator" />
      </Head>

      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-900 dark:to-red-900 p-4 sm:p-6">
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-in-out">
            <header className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 text-white p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl sm:text-4xl font-bold">{t('headerTitle')}</h1>
                <nav className="flex items-center space-x-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" aria-label={t('helpButtonAriaLabel')} className="bg-white/10 hover:bg-white/20 text-white">
                            <HelpCircle className="h-5 w-5" />
                            <span className="sr-only">{t('helpButtonText')}</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{t('aboutDialogTitle')}</DialogTitle>
                            <DialogDescription>
                              <p className="mt-2">
                                <strong>{t('aboutDialogWhy')}</strong> {t('aboutDialogWhyContent')}
                              </p>
                              <p className="mt-2">
                                <strong>{t('aboutDialogWhat')}</strong> {t('aboutDialogWhatContent')}
                              </p>
                              <p className="mt-2">
                                <strong>{t('aboutDialogHow')}</strong> {t('aboutDialogHowContent')}
                              </p>
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('helpTooltip')}</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-white/10 hover:bg-white/20 text-white"
                        aria-label={t('homeButtonAriaLabel')}
                        asChild
                      >
                        <Link href="/" aria-label={t('homeButtonAriaLabel')}>
                          <Home className="h-4 w-4" />
                          <span className="sr-only">{t('homeButtonText')}</span>
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('homeTooltip')}</p>
                    </TooltipContent>
                  </Tooltip>

                  <ShareButton shareUrl={shareUrl} shareTitle={shareTitle} tooltipText={t('shareTooltip')} />

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        aria-label={t('themeToggleAriaLabel')}
                        className="bg-white/10 hover:bg-white/20 text-white"
                      >
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">{t('themeToggleText')}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('themeTooltip')}</p>
                    </TooltipContent>
                  </Tooltip>
                </nav>
              </div>
            </header>

            <main className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="translation-mode" className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('translationModeLabel')}</Label>
                  <select
                    id="translation-mode"
                    value={mode}
                    onChange={(e) => setMode(e.target.value as 'textToMorse' | 'morseToText')}
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ease-in-out"
                  >
                    <option value="textToMorse">{t('textToMorseOption')}</option>
                    <option value="morseToText">{t('morseToTextOption')}</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="input" className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('inputLabel')}</Label>
                  <Textarea
                    id="input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={mode === 'textToMorse' ? t('textInputPlaceholder') : t('morseInputPlaceholder')}
                    rows={4}
                    className="w-full p-3 text-lg border-2 border-purple-300 dark:border-purple-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ease-in-out dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="output" className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('outputLabel')}</Label>
                  <div className="relative">
                    <Textarea
                      id="output"
                      value={output}
                      readOnly
                      rows={4}
                      className="w-full p-3 text-lg bg-gray-100 dark:bg-gray-700 border-2 border-blue-300 dark:border-blue-600 rounded-md transition-all duration-300 ease-in-out dark:text-white"
                    />
                    <div className="absolute top-2 right-2 space-x-2">
                      <Button size="sm" onClick={handleCopy} className="bg-green-500 hover:bg-green-600 text-white">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button size="sm" onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-white">
                        <Save className="h-4 w-4" />
                      </Button>
                      {mode === 'textToMorse' && (
                        <Button size="sm" onClick={() => playMorseCode(output)} disabled={isPlaying} className="bg-purple-500 hover:bg-purple-600 text-white disabled:bg-gray-400">
                          {isPlaying ? <VolumeX className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{t('mostUsedWordsTitle')}</h2>
                <div className="flex flex-wrap gap-2">
                  {mostUsedWords.map((word) => (
                    <Button
                      key={word}
                      variant="outline"
                      size="sm"
                      onClick={() => setInput(word)}
                      className="bg-pink-100 hover:bg-pink-200 text-pink-800 dark:bg-pink-900 dark:hover:bg-pink-800 dark:text-pink-100"
                    >
                      {word}
                    </Button>
                  ))}
                </div>
              </div>

              {savedTranslations.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('savedTranslationsTitle')}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedTranslations.map((translation) => (
                      <div key={translation.timestamp} className="border border-purple-300 dark:border-purple-600 p-4 rounded-lg space-y-2 bg-white dark:bg-gray-800 shadow-md">
                        <p><strong>{t('inputLabel')}:</strong> {translation.input}</p>
                        <p><strong>{t('outputLabel')}:</strong> {translation.output}</p>
                        <p><strong>{t('modeLabel')}:</strong> {translation.mode === 'textToMorse' ? t('textToMorseOption') : t('morseToTextOption')}</p>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleDownloadMp3(translation)} className="bg-green-500 hover:bg-green-600 text-white">
                            <Download className="h-4 w-4 mr-2" />
                            {t('downloadAudioButton')}
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(translation.timestamp)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            {t('deleteButton')}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">{t('morseCodeChartTitle')}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {Object.entries(morseCodeMap).map(([char, code]) => (
                    <div key={char} className="flex justify-between border border-purple-300 dark:border-purple-600 p-2 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
                      <span>{char}</span>
                      <span>{code}</span>
                    </div>
                  ))}
                </div>
              </div>
            </main>
          </div>
        </div>
      </TooltipProvider>
    </>
  )
}