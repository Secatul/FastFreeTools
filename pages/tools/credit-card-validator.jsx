'use client'

import React, { useState, useEffect } from "react"
import Head from "next/head"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useTheme } from "next-themes"
import { Home, HelpCircle, CreditCard, Check, Moon, Sun, AlertCircle, Info, Key } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import DOMPurify from 'dompurify'

function sanitizeInput(input) {
  return DOMPurify.sanitize(input)
}

const testCards = [
  { type: 'Visa', number: '4111111111111111', cvv: '123' },
  { type: 'Mastercard', number: '5555555555554444', cvv: '123' },
  { type: 'American Express', number: '378282246310005', cvv: '1234' },
  { type: 'Discover', number: '6011111111111117', cvv: '123' },
]

export default function CreditCardValidator() {
  const [cardInfo, setCardInfo] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  })
  const [cardType, setCardType] = useState('unknown')
  const [isValid, setIsValid] = useState(false)
  const [errors, setErrors] = useState({})
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  const shareUrl = "https://fastfreetools.com/credit-card-validator"
  const shareTitle = "Check out this Credit Card Validator Tool!"

  useEffect(() => {
    validateCard()
  }, [cardInfo])

  const validateCard = () => {
    const newErrors = {}
    let valid = true

    // Validate card number
    if (!luhnCheck(cardInfo.number)) {
      newErrors.number = 'Invalid card number'
      valid = false
    }

    // Validate name
    if (cardInfo.name.trim().length < 2) {
      newErrors.name = 'Name is required'
      valid = false
    }

    // Validate expiry
    const [month, year] = cardInfo.expiry.split('/')
    const currentYear = new Date().getFullYear() % 100
    const currentMonth = new Date().getMonth() + 1
    if (!month || !year || parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
      newErrors.expiry = 'Invalid expiry date'
      valid = false
    }

    // Validate CVV
    if (!/^\d{3,4}$/.test(cardInfo.cvv)) {
      newErrors.cvv = 'Invalid CVV'
      valid = false
    }

    setErrors(newErrors)
    setIsValid(valid)
  }

  const luhnCheck = (num) => {
    let arr = (num + '')
      .split('')
      .reverse()
      .map(x => parseInt(x))
    let sum = 0
    for (let i = 0; i < arr.length; i++) {
      if (i % 2 !== 0) {
        arr[i] = arr[i] * 2
      }
      if (arr[i] > 9) {
        arr[i] = arr[i] - 9
      }
      sum += arr[i]
    }
    return sum % 10 === 0
  }

  const detectCardType = (number) => {
    const patterns = {
      visa: /^4/,
      mastercard: /^5[1-5]/,
      amex: /^3[47]/,
      discover: /^6(?:011|5)/,
    }

    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(number)) {
        return type
      }
    }
    return 'unknown'
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    let sanitizedValue = sanitizeInput(value)

    if (name === 'number') {
      sanitizedValue = sanitizedValue.replace(/\D/g, '')
      setCardType(detectCardType(sanitizedValue))
    } else if (name === 'expiry') {
      sanitizedValue = sanitizedValue.replace(/\D/g, '')
      if (sanitizedValue.length > 2) {
        sanitizedValue = `${sanitizedValue.slice(0, 2)}/${sanitizedValue.slice(2, 4)}`
      }
    } else if (name === 'cvv') {
      sanitizedValue = sanitizedValue.replace(/\D/g, '').slice(0, 4)
    }

    setCardInfo(prev => ({ ...prev, [name]: sanitizedValue }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isValid) {
      toast({
        title: "Card Validated",
        description: "The credit card information is valid.",
      })
    } else {
      toast({
        title: "Validation Failed",
        description: "Please check the card information and try again.",
        variant: "destructive",
      })
    }
  }

  const fillTestCard = (card) => {
    setCardInfo({
      number: card.number,
      name: 'John Doe',
      expiry: '12/25',
      cvv: card.cvv,
    })
  }

  return (
    <>
      <Head>
        <title>Credit Card Validator | Fast Free Tools</title>
        <meta
          name="description"
          content="Validate credit card information securely with our free online tool. Check card numbers, expiry dates, and more."
        />
        <meta
          name="keywords"
          content="credit card validator, card number check, expiry date validation, CVV validation, online payment tool"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://fastfreetools.com/credit-card-validator" />
        <meta property="og:title" content="Credit Card Validator | Fast Free Tools" />
        <meta
          property="og:description"
          content="Validate credit card information securely with our free online tool. Check card numbers, expiry dates, and more."
        />
        <meta property="og:url" content="https://fastfreetools.com/credit-card-validator" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Credit Card Validator | Fast Free Tools" />
        <meta
          name="twitter:description"
          content="Securely validate credit card information with our user-friendly online tool. Perfect for businesses and individuals."
        />
      </Head>
      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-900 dark:to-red-900 p-4 sm:p-6">
          <main className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-in-out">
            <header className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 text-white p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl sm:text-4xl font-bold">Credit Card Validator</h1>
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
                        <p>Get help and information about the Credit Card Validator</p>
                      </TooltipContent>
                    </Tooltip>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>About Credit Card Validator</DialogTitle>
                        <DialogDescription>
                          <p className="mt-2">
                            This tool helps you validate credit card information securely. It checks:
                          </p>
                          <ul className="list-disc list-inside mt-2">
                            <li>Card number validity (using the Luhn algorithm)</li>
                            <li>Card type detection</li>
                            <li>Expiration date</li>
                            <li>CVV format</li>
                            <li>Cardholder name</li>
                          </ul>
                          <p className="mt-2">
                            All validation is done client-side for your security. No card data is stored or transmitted.
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
                      <Button variant="outline" size="icon" asChild className="bg-white/10 hover:bg-white/20 text-white">
                        <Link href="/tools/password-generator" aria-label="Password Generator">
                          <Key className="h-5 w-5" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Go to Password Generator</p>
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

            <div className="p-6">
              <Card className={`${isValid ? 'border-green-500' : 'border-red-500'} border-2 transition-colors duration-300`}>
                <CardHeader>
                  <CardTitle>Enter Card Details</CardTitle>
                  <CardDescription>Validate your credit card information securely</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="number">Card Number</Label>
                      <div className="relative">
                        <Input
                          id="number"
                          name="number"
                          value={cardInfo.number}
                          onChange={handleInputChange}
                          placeholder="1234 5678 9012 3456"
                          className={`pl-10 ${errors.number ? 'border-red-500 dark:border-red-400' : ''}`}
                          maxLength={19}
                          required
                        />
                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300" />
                        {cardType !== 'unknown' && (
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 font-bold text-primary dark:text-primary-foreground">
                            {cardType.toUpperCase()}
                          </span>
                        )}
                      </div>
                      {errors.number && <p className="text-red-500 dark:text-red-400 text-sm">{errors.number}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Cardholder Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={cardInfo.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className={errors.name ? 'border-red-500 dark:border-red-400' : ''}
                        required
                      />
                      {errors.name && <p className="text-red-500 dark:text-red-400 text-sm">{errors.name}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div  className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          name="expiry"
                          value={cardInfo.expiry}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          className={errors.expiry ? 'border-red-500 dark:border-red-400' : ''}
                          maxLength={5}
                          required
                        />
                        {errors.expiry && <p className="text-red-500 dark:text-red-400 text-sm">{errors.expiry}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          name="cvv"
                          value={cardInfo.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          className={errors.cvv ? 'border-red-500 dark:border-red-400' : ''}
                          maxLength={4}
                          required
                        />
                        {errors.cvv && <p className="text-red-500 dark:text-red-400 text-sm">{errors.cvv}</p>}
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className={`w-full ${
                        isValid 
                          ? 'bg-green-500 hover:bg-green-600 text-white' 
                          : 'bg-red-500 hover:bg-red-600 text-white'
                      }`}
                    >
                      {isValid ? (
                        <>
                          <Check className="mr-2 h-4 w-4" /> Valid Card
                        </>
                      ) : (
                        <>
                          <AlertCircle className="mr-2 h-4 w-4" /> Invalid Card
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="flex flex-col items-start">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Your card information is validated securely on your device and is never stored or transmitted.
                  </p>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="test-cards">
                      <AccordionTrigger>
                        <div className="flex items-center">
                          <Info className="mr-2 h-4 w-4" />
                          Test Credit Card Numbers
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Use these test card numbers to try out the validator:
                          </p>
                          <ul className="list-disc list-inside">
                            {testCards.map((card, index) => (
                              <li key={index} className="text-sm">
                                {card.type}: {card.number}{' '}
                                <Button
                                  variant="link"
                                  className="p-0 h-auto text-primary dark:text-primary-foreground"
                                  onClick={() => fillTestCard(card)}
                                >
                                  (Fill form)
                                </Button>
                              </li>
                            ))}
                          </ul>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            For all test cards, use any future date for expiry and any 3 digits for CVV (4 digits for Amex).
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardFooter>
              </Card>
            </div>
          </main>
        </div>
      </TooltipProvider>
    </>
  )
}
