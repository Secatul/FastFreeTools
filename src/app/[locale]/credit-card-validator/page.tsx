'use client'

import React, { useState, useEffect } from "react"
import Head from "next/head"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ShareButton from "../components/share-button"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useTheme } from "next-themes"
import {
  Home,
  HelpCircle,
  CreditCard,
  Check,
  Moon,
  Sun,
  AlertCircle,
  Info,
  Key,
  X,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import DOMPurify from "dompurify"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"

interface CardInfo {
  number: string
  name: string
  expiry: string
  cvv: string
}

interface Errors {
  number?: string
  name?: string
  expiry?: string
  cvv?: string
}

function sanitizeInput(input: string) {
  return DOMPurify.sanitize(input)
}

const testCards = [
  { type: "Visa", number: "4111111111111111", cvv: "123" },
  { type: "Mastercard", number: "5555555555554444", cvv: "123" },
  { type: "American Express", number: "378282246310005", cvv: "1234" },
  { type: "Discover", number: "6011111111111117", cvv: "123" },
]

const CreditCardValidator: React.FC = () => {
  const t = useTranslations("CreditCardValidator")
  const [cardInfo, setCardInfo] = useState<CardInfo>({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  })
  const [cardType, setCardType] = useState<string>("unknown")
  const [isValid, setIsValid] = useState<boolean>(false)
  const [errors, setErrors] = useState<Errors>({})
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const { toast } = useToast()

  // State variables for the help dialog
  const [helpCardNumber, setHelpCardNumber] = useState("")
  const [helpIsValid, setHelpIsValid] = useState<boolean | null>(null)


  const locale = pathname ? pathname.split("/")[1] : "en"; 
  const shareUrl = `https://fastfreetools.com/${locale}/credit-card-validator`
  const shareTitle = t("Share_Title")

  useEffect(() => {
    validateCard()
  }, [cardInfo])

  const validateCard = () => {
    const newErrors: Errors = {}
    let valid = true

    if (!luhnCheck(cardInfo.number)) {
      newErrors.number = t("Invalid_Card_Number")
      valid = false
    }

    if (cardInfo.name.trim().length < 2) {
      newErrors.name = t("Name_Required")
      valid = false
    }

    const [month, year] = cardInfo.expiry.split("/")
    const currentYear = new Date().getFullYear() % 100
    const currentMonth = new Date().getMonth() + 1
    if (
      !month ||
      !year ||
      parseInt(year) < currentYear ||
      (parseInt(year) === currentYear && parseInt(month) < currentMonth)
    ) {
      newErrors.expiry = t("Invalid_Expiry_Date")
      valid = false
    }

    if (!/^\d{3,4}$/.test(cardInfo.cvv)) {
      newErrors.cvv = t("Invalid_CVV")
      valid = false
    }

    setErrors(newErrors)
    setIsValid(valid)
  }

  const luhnCheck = (num: string) => {
    let arr = (num + "")
      .split("")
      .reverse()
      .map((x) => parseInt(x))
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

  const detectCardType = (number: string) => {
    const patterns: { [key: string]: RegExp } = {
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
    return "unknown"
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let sanitizedValue = sanitizeInput(value)

    if (name === "number") {
      sanitizedValue = sanitizedValue.replace(/\D/g, "")
      setCardType(detectCardType(sanitizedValue))
    } else if (name === "expiry") {
      sanitizedValue = sanitizedValue.replace(/\D/g, "")
      if (sanitizedValue.length > 2) {
        sanitizedValue = `${sanitizedValue.slice(0, 2)}/${sanitizedValue.slice(
          2,
          4
        )}`
      }
    } else if (name === "cvv") {
      sanitizedValue = sanitizedValue.replace(/\D/g, "").slice(0, 4)
    }

    setCardInfo((prev) => ({ ...prev, [name]: sanitizedValue }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isValid) {
      toast({
        title: t("Card_Validated"),
        description: t("Card_Valid_Description"),
      })
    } else {
      toast({
        title: t("Validation_Failed"),
        description: t("Validation_Failed_Description"),
        variant: "destructive",
      })
    }
  }

  const fillTestCard = (card: { type: string; number: string; cvv: string }) => {
    setCardInfo({
      number: card.number,
      name: "John Doe",
      expiry: "12/25",
      cvv: card.cvv,
    })
  }

  const helpValidateCard = (number: string) => {
    let sum = 0
    let isEven = false
    for (let i = number.length - 1; i >= 0; i--) {
      let digit = parseInt(number.charAt(i), 10)
      if (isEven) {
        digit *= 2
        if (digit > 9) {
          digit -= 9
        }
      }
      sum += digit
      isEven = !isEven
    }
    return sum % 10 === 0
  }

  const helpHandleValidate = () => {
    setHelpIsValid(helpValidateCard(helpCardNumber.replace(/\s/g, "")))
  }

  const hreflangs = [
    { locale: "en", href: "https://fastfreetools.com/en/credit-card-validator" },
    { locale: "es", href: "https://fastfreetools.com/es/credit-card-validator" },
    {
      locale: "pt-br",
      href: "https://fastfreetools.com/pt-br/credit-card-validator",
    },
    { locale: "de", href: "https://fastfreetools.com/de/credit-card-validator" },
    { locale: "fr", href: "https://fastfreetools.com/fr/credit-card-validator" },
  ]

  return (
    <>
      <Head>
        <title>{t("Page_Title")}</title>
        <meta name="description" content={t("Page_Description")} />
        <meta name="keywords" content={t("Page_Keywords")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={shareUrl} />

        {hreflangs.map(({ locale, href }) => (
          <link key={locale} rel="alternate" hrefLang={locale} href={href} />
        ))}

        <meta property="og:title" content={t("Page_Title")} />
        <meta property="og:description" content={t("Page_Description")} />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t("Page_Title")} />
        <meta name="twitter:description" content={t("Page_Description")} />
        <meta property="og:image" content="https://www.fastfreetools.com/twitter-card.png" />
        <meta name="twitter:image" content="https://fastfreetools.com/twitter-card.png" />
        <meta charSet="UTF-8" />
      </Head>
      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-900 dark:to-red-900 p-4 sm:p-6">
          <main className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-in-out">
            <header className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 text-white p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl sm:text-4xl font-bold">
                  {t("Page_Title")}
                </h1>
                <nav className="flex items-center space-x-2">
                  {/* Updated Help Dialog */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        aria-label={t("Help_Aria")}
                        className="bg-white/10 hover:bg-white/20 text-white"
                      >
                        <HelpCircle className="h-5 w-5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                          <CreditCard className="w-6 h-6" />
                          {t("Help_Title")}
                        </DialogTitle>
                        <DialogDescription>
                          {t("Help_Description")}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6 mt-4">
                        <section>
                          <h3 className="text-lg font-semibold mb-2">
                            {t("What_is_Title")}
                          </h3>
                          <p>{t("What_is_Content")}</p>
                        </section>

                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="item-1">
                            <AccordionTrigger>
                              {t("How_Does_It_Work_Title")}
                            </AccordionTrigger>
                            <AccordionContent>
                              <p>{t("How_Does_It_Work_Content_Intro")}</p>
                              <ol className="list-decimal list-inside space-y-1 mt-2">
                                <li>{t("How_Does_It_Work_Step1")}</li>
                                <li>{t("How_Does_It_Work_Step2")}</li>
                                <li>{t("How_Does_It_Work_Step3")}</li>
                                <li>{t("How_Does_It_Work_Step4")}</li>
                              </ol>
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="item-2">
                            <AccordionTrigger>
                              {t("Why_Validation_Important_Title")}
                            </AccordionTrigger>
                            <AccordionContent>
                              <p>{t("Why_Validation_Important_Content_Intro")}</p>
                              <ul className="list-disc list-inside space-y-1 mt-2">
                                <li>{t("Why_Validation_Important_Point1")}</li>
                                <li>{t("Why_Validation_Important_Point2")}</li>
                                <li>{t("Why_Validation_Important_Point3")}</li>
                                <li>{t("Why_Validation_Important_Point4")}</li>
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>

                        <section className="bg-muted p-4 rounded-lg">
                          <h3 className="text-lg font-semibold mb-2">
                            {t("Try_It_Yourself_Title")}
                          </h3>
                          <p className="mb-4">{t("Try_It_Yourself_Description")}</p>
                          <div className="space-y-4">
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                              <Label htmlFor="helpCardNumber">
                                {t("Card_Number")}
                              </Label>
                              <Input
                                type="text"
                                id="helpCardNumber"
                                placeholder="XXXX XXXX XXXX XXXX"
                                value={helpCardNumber}
                                onChange={(e) => setHelpCardNumber(e.target.value)}
                              />
                            </div>
                            <Button onClick={helpHandleValidate}>
                              {t("Validate_Button")}
                            </Button>
                            {helpIsValid !== null && (
                              <div
                                className={`flex items-center gap-2 ${helpIsValid ? "text-green-600" : "text-red-600"
                                  }`}
                              >
                                {helpIsValid ? <Check /> : <X />}
                                {helpIsValid
                                  ? t("Valid_Card_Number")
                                  : t("Invalid_Card_Number")}
                              </div>
                            )}
                          </div>
                        </section>

                        <section>
                          <h3 className="text-lg font-semibold mb-2">
                            {t("FAQ_Title")}
                          </h3>
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="faq-1">
                              <AccordionTrigger>
                                {t("FAQ_Question1")}
                              </AccordionTrigger>
                              <AccordionContent>
                                {t("FAQ_Answer1")}
                              </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="faq-2">
                              <AccordionTrigger>
                                {t("FAQ_Question2")}
                              </AccordionTrigger>
                              <AccordionContent>
                                {t("FAQ_Answer2")}
                              </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="faq-3">
                              <AccordionTrigger>
                                {t("FAQ_Question3")}
                              </AccordionTrigger>
                              <AccordionContent>
                                {t("FAQ_Answer3")}
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </section>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Other Navigation Buttons */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        asChild
                        className="bg-white/10 hover:bg-white/20 text-white"
                      >
                        <Link href={`/${locale}`} aria-label={t("Home_Aria")}>
                          <Home className="h-5 w-5" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t("Return_to_Home")}</p>
                    </TooltipContent>
                  </Tooltip>

                  <ShareButton
                    shareUrl={shareUrl}
                    shareTitle={shareTitle}
                    tooltipText={t("Share_Title")}
                  />

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setTheme(theme === "dark" ? "light" : "dark")
                        }
                        aria-label={t("Toggle_Theme_Aria")}
                        className="bg-white/10 hover:bg-white/20 text-white"
                      >
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t("Switch_Theme")}</p>
                    </TooltipContent>
                  </Tooltip>
                </nav>
              </div>
            </header>


            <div className="p-6">
              <Card className={`${isValid ? 'border-green-500' : 'border-red-500'} border-2 transition-colors duration-300`}>
                <CardHeader>
                  <CardTitle>{t('Enter_Card_Details')}</CardTitle>
                  <CardDescription>{t('Card_Description')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="number">{t('Card_Number')}</Label>
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
                      <Label htmlFor="name">{t('Cardholder_Name')}</Label>
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
                      <div className="space-y-2">
                        <Label htmlFor="expiry">{t('Expiry_Date')}</Label>
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
                        <Label htmlFor="cvv">{t('CVV')}</Label>
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
                      className={`w-full ${isValid
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-red-500 hover:bg-red-600 text-white'
                        }`}
                    >
                      {isValid ? (
                        <>
                          <Check className="mr-2 h-4 w-4" /> {t('Valid_Card')}
                        </>
                      ) : (
                        <>
                          <AlertCircle className="mr-2 h-4 w-4" /> {t('Invalid_Card')}
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="flex flex-col items-start">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {t('Secure_Validation_Note')}
                  </p>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="test-cards">
                      <AccordionTrigger>
                        <div className="flex items-center">
                          <Info className="mr-2 h-4 w-4" />
                          {t('Test_Card_Numbers')}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t('Test_Card_Note')}
                          </p>
                          <ul className="list-disc list-inside">
                            {testCards.map((card, index) => (
                              <li key={index} className="text-sm">
                                {card.type}: {card.number}{' '}
                                <Button
                                  variant="link"
                                  className="p-0 h-auto text-primary dark:text-zinc-400"
                                  onClick={() => fillTestCard(card)}
                                >
                                  ({t('Fill_Form_Button')})
                                </Button>
                              </li>
                            ))}
                          </ul>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t('Future_Date_CVV_Note')}
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

export default CreditCardValidator
