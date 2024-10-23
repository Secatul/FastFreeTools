"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { useTheme } from "next-themes";
import { Home, HelpCircle, Moon, Sun, RefreshCcw, Calendar, Clock, Globe } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Head from "next/head";

export default function UnixTimestampTool() {
  const [currentTimestamp, setCurrentTimestamp] = useState(Math.floor(Date.now() / 1000));
  const [inputTimestamp, setInputTimestamp] = useState("");
  const [convertedDate, setConvertedDate] = useState("");
  const { theme, setTheme } = useTheme();
  const [funFact, setFunFact] = useState("");
  const [timeZone, setTimeZone] = useState("UTC");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    generateFunFact();
  }, []);

  const handleConvert = () => {
    if (!inputTimestamp) return;
    const date = new Date(parseInt(inputTimestamp) * 1000);
    setConvertedDate(date.toLocaleString(undefined, { timeZone }));
  };

  const generateFunFact = () => {
    const facts = [
      "The Unix epoch (timestamp 0) represents January 1, 1970, at 00:00:00 UTC.",
      "Unix time doesn't account for leap seconds, which can cause discrepancies in precise timekeeping.",
      "The largest value for a 32-bit Unix timestamp will occur in 2038, known as the 'Year 2038 problem'.",
      "Unix time is widely used in file systems, databases, and network protocols.",
      "The concept of Unix time was introduced by Ken Thompson, one of the creators of Unix.",
    ];
    setFunFact(facts[Math.floor(Math.random() * facts.length)]);
  };

  const calculateTimeDifference = (timestamp1, timestamp2) => {
    const difference = Math.abs(timestamp1 - timestamp2);
    const days = Math.floor(difference / 86400);
    const hours = Math.floor((difference % 86400) / 3600);
    const minutes = Math.floor((difference % 3600) / 60);
    const seconds = difference % 60;
    return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
  };

  return (
    <>
      <Head>
        <title>Unix Timestamp Tool</title>
        <meta
          name="description"
          content="Convert Unix timestamps to human-readable dates, calculate time differences, and learn fun facts about Unix time. Explore how Unix timestamps work with this tool."
        />
        <meta
          name="keywords"
          content="Unix timestamp, timestamp converter, Unix time, timestamp to date, time difference calculator"
        />
        <meta name="author" content="Your Name or Company" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Unix Timestamp Tool" />
        <meta
          property="og:description"
          content="Convert Unix timestamps, calculate time differences, and explore time units in seconds with this comprehensive Unix timestamp tool."
        />
        <meta property="og:image" content="https://example.com/og-image.jpg" />
        <meta property="og:url" content="https://example.com/unix-timestamp-tool" />
        <meta property="og:type" content="website" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Unix Timestamp Tool" />
        <meta
          name="twitter:description"
          content="Work with Unix timestamps by converting them to human-readable dates or calculating time differences between two timestamps."
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
          <h1 className="text-3xl font-bold">Unix Timestamp Tool</h1>
          <div className="space-x-2 flex items-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Help">
                  <HelpCircle className="h-4 w-4" />
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

        <main className="space-y-4">
          <section>
            <h2 className="text-xl font-semibold mb-2">How Unix Timestamps Work</h2>
            <p className="text-sm">
              Unix timestamps represent the number of seconds that have elapsed since January 1, 1970, at 00:00:00 UTC, not counting leap seconds. This date, known as the Unix Epoch, serves as a universal reference point for computer systems.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Current Unix Timestamp</h2>
            <div className="text-3xl font-mono" aria-live="polite">
              {currentTimestamp}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Translates to: {new Date(currentTimestamp * 1000).toLocaleString(undefined, { timeZone })}
            </p>
          </section>

          <Tabs defaultValue="convert">
            <TabsList>
              <TabsTrigger value="convert">Convert</TabsTrigger>
              <TabsTrigger value="difference">Time Difference</TabsTrigger>
            </TabsList>
            <TabsContent value="convert">
              <section>
                <h2 className="text-xl font-semibold mb-2">Convert Unix Timestamp</h2>
                <div className="flex space-x-2 mb-2">
                  <Input
                    type="number"
                    value={inputTimestamp}
                    onChange={(e) => setInputTimestamp(e.target.value)}
                    placeholder="Enter Unix timestamp"
                    aria-label="Enter Unix timestamp"
                  />
                  <Button onClick={handleConvert} aria-label="Convert Timestamp">Convert</Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="timezone">Time Zone:</Label>
                  <select
                    id="timezone"
                    value={timeZone}
                    onChange={(e) => setTimeZone(e.target.value)}
                    className="border rounded p-1"
                    aria-label="Select Time Zone"
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
              </section>
            </TabsContent>

            <TabsContent value="difference">
              <section>
                <h2 className="text-xl font-semibold mb-2">Calculate Time Difference</h2>
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="Enter first Unix timestamp"
                    aria-label="Enter first Unix timestamp"
                    onChange={(e) => setInputTimestamp(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Enter second Unix timestamp"
                    aria-label="Enter second Unix timestamp"
                    onChange={(e) => {
                      if (inputTimestamp && e.target.value) {
                        const diff = calculateTimeDifference(parseInt(inputTimestamp), parseInt(e.target.value));
                        setConvertedDate(`Difference: ${diff}`);
                      }
                    }}
                  />
                </div>
                {convertedDate && (
                  <p className="text-sm mt-2">
                    {convertedDate}
                  </p>
                )}
              </section>
            </TabsContent>
          </Tabs>

          <section>
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
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Fun Fact</h2>
            <p className="text-sm">{funFact}</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={generateFunFact} aria-label="Generate Fun Fact">
              <RefreshCcw className="h-4 w-4 mr-2" />
              New Fun Fact
            </Button>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Date to Unix Timestamp</h2>
            <Input
              type="datetime-local"
              onChange={(e) => {
                const date = new Date(e.target.value);
                setInputTimestamp(Math.floor(date.getTime() / 1000).toString());
              }}
              aria-label="Pick a date and time"
            />
            {inputTimestamp && (
              <p className="text-sm mt-2">
                Unix Timestamp: <span className="font-semibold">{inputTimestamp}</span>
              </p>
            )}
          </section>
        </main>
      </div>
    </>
  );
}
