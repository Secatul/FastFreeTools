"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Head from 'next/head'
import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useTheme } from "next-themes"
import { Home, HelpCircle, Moon, Sun, RefreshCcw, Calendar, Clock, Globe } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function UnixTimestampTool() {
  const [currentTimestamp, setCurrentTimestamp] = useState(Math.floor(Date.now() / 1000))
  const [inputTimestamp, setInputTimestamp] = useState('')
  const [convertedDate, setConvertedDate] = useState('')
  const { theme, setTheme } = useTheme()
  const [funFact, setFunFact] = useState('')
  const [timeZone, setTimeZone] = useState('UTC')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    generateFunFact()
  }, [])

  const handleConvert = () => {
    const date = new Date(parseInt(inputTimestamp) * 1000)
    setConvertedDate(date.toLocaleString(undefined, { timeZone }))
  }

  const generateFunFact = () => {
    const facts = [
      "The Unix epoch (timestamp 0) represents January 1, 1970, at 00:00:00 UTC.",
      "Unix time doesn't account for leap seconds, which can cause discrepancies in precise timekeeping.",
      "The largest value for a 32-bit Unix timestamp will occur in 2038, known as the 'Year 2038 problem'.",
      "Unix time is widely used in file systems, databases, and network protocols.",
      "The concept of Unix time was introduced by Ken Thompson, one of the creators of Unix.",
    ]
    setFunFact(facts[Math.floor(Math.random() * facts.length)])
  }

  const calculateTimeDifference = (timestamp1, timestamp2) => {
    const difference = Math.abs(timestamp1 - timestamp2)
    const days = Math.floor(difference / 86400)
    const hours = Math.floor((difference % 86400) / 3600)
    const minutes = Math.floor((difference % 3600) / 60)
    const seconds = difference % 60
    return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`
  }

  return (
    <>
      <Head>
        <title>Unix Timestamp Tool | Fast Free Tools</title>
        <meta
          name="description"
          content="Convert Unix timestamps to human-readable dates and vice versa with the Unix Timestamp Tool. Includes real-time conversion and support for various time formats."
        />
        <meta
          name="keywords"
          content="Unix timestamp, timestamp converter, date converter, time format, Unix time, epoch time"
        />
        <meta name="author" content="Fast Free Tools" />
        <meta property="og:title" content="Unix Timestamp Tool | Fast Free Tools" />
        <meta
          property="og:description"
          content="Convert Unix timestamps to human-readable dates and vice versa easily with our Unix Timestamp Tool. Real-time conversion and multiple time formats supported."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fastfreetools.com/unix-timestamp-tool" />
        <meta property="og:image" content="https://fastfreetools.com/images/unix-timestamp-preview.png" />
        <meta property="og:site_name" content="Fast Free Tools" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Unix Timestamp Tool | Fast Free Tools" />
        <meta
          name="twitter:description"
          content="Easily convert Unix timestamps to human-readable dates and vice versa with real-time conversion and multiple time formats."
        />
        <meta name="twitter:image" content="https://fastfreetools.com/images/unix-timestamp-preview.png" />
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon.ico" />

      </Head>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Unix Timestamp Tool</h1>
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
                  <DialogTitle>About Unix Timestamp Tool</DialogTitle>
                  <DialogDescription>
                    <p className="mt-2">
                      <strong>Why:</strong> This tool helps you work with Unix timestamps, which represent time as seconds since January 1, 1970 (UTC).
                    </p>
                    <p className="mt-2">
                      <strong>What:</strong> You can view the current Unix timestamp, convert timestamps to human-readable dates, and learn about time units in seconds.
                    </p>
                    <p className="mt-2">
                      <strong>How:</strong> Use the input field to convert Unix timestamps to dates, or explore the current timestamp and time unit table.
                    </p>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="icon" asChild>
              <Link href="/" aria-label="Home">
                <Home className="h-4 w-4" />
                <span className="sr-only">Home</span>
              </Link>
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
            <h2 className="text-xl font-semibold mb-2">How Unix Timestamps Work</h2>
            <p className="text-sm">
              Unix timestamps represent the number of seconds that have elapsed since January 1, 1970, at 00:00:00 UTC, not counting leap seconds. This date, known as the Unix Epoch, serves as a universal reference point for computer systems. Unix timestamps are widely used in programming and databases due to their simplicity and ease of calculation across different time zones.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Current Unix Timestamp</h2>
            <div className="text-3xl font-mono">{currentTimestamp}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Translates to: {new Date(currentTimestamp * 1000).toLocaleString(undefined, { timeZone })}
            </p>
          </div>

          <Tabs defaultValue="convert">
            <TabsList>
              <TabsTrigger value="convert">Convert</TabsTrigger>
              <TabsTrigger value="difference">Time Difference</TabsTrigger>
            </TabsList>
            <TabsContent value="convert">
              <div>
                <h2 className="text-xl font-semibold mb-2">Convert Unix Timestamp</h2>
                <div className="flex space-x-2 mb-2">
                  <Input
                    type="number"
                    value={inputTimestamp}
                    onChange={(e) => setInputTimestamp(e.target.value)}
                    placeholder="Enter Unix timestamp"
                  />
                  <Button onClick={handleConvert}>Convert</Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="timezone">Time Zone:</Label>
                  <select
                    id="timezone"
                    value={timeZone}
                    onChange={(e) => setTimeZone(e.target.value)}
                    className="border rounded p-1"
                  >
                    <option value="UTC">UTC</option>
                    <option value="local">Local</option>
                  </select>
                </div>
                {convertedDate && (
                  <p className="text-sm mt-2">
                    Converted date: <span className="font-semibold">{convertedDate}</span>
                  </p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="difference">
              <div>
                <h2 className="text-xl font-semibold mb-2">Calculate Time Difference</h2>
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="Enter first Unix timestamp"
                    onChange={(e) => setInputTimestamp(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Enter second Unix timestamp"
                    onChange={(e) => {
                      if (inputTimestamp && e.target.value) {
                        const diff = calculateTimeDifference(parseInt(inputTimestamp), parseInt(e.target.value))
                        setConvertedDate(`Difference: ${diff}`)
                      }
                    }}
                  />
                </div>
                {convertedDate && (
                  <p className="text-sm mt-2">
                    {convertedDate}
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div>
            <h2 className="text-xl font-semibold mb-2">Time Units in Seconds</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-2">Unit</th>
                    <th className="text-left p-2">Seconds</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2">Minute</td>
                    <td className="p-2">60</td>
                  </tr>
                  <tr>
                    <td className="p-2">Hour</td>
                    <td className="p-2">3,600</td>
                  </tr>
                  <tr>
                    <td className="p-2">Day</td>
                    <td className="p-2">86,400</td>
                  </tr>
                  <tr>
                    <td className="p-2">Week</td>
                    <td className="p-2">604,800</td>
                  </tr>
                  <tr>
                    <td className="p-2">Month (30 days)</td>
                    <td className="p-2">2,592,000</td>
                  </tr>
                  <tr>
                    <td className="p-2">Year (365 days)</td>
                    <td className="p-2">31,536,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Fun Fact</h2>
            <p className="text-sm">{funFact}</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={generateFunFact}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              New Fun Fact
            </Button>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Date to Unix Timestamp</h2>
            <Input
              type="datetime-local"
              onChange={(e) => {
                const date = new Date(e.target.value)
                setInputTimestamp(Math.floor(date.getTime() / 1000).toString())
              }}
            />
            {inputTimestamp && (
              <p className="text-sm mt-2">
                Unix Timestamp: <span className="font-semibold">{inputTimestamp}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}