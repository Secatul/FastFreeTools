'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { HelpCircle, CreditCard, Check, X, Info, Key } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function CreditCardValidatorHelper({ t }: { t: (key: string) => string }) {
  const [helpCardNumber, setHelpCardNumber] = useState("")
  const [helpIsValid, setHelpIsValid] = useState<boolean | null>(null)

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

  return (
    <TooltipProvider>
      <Dialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label={t("Help_Aria")}
                className="bg-purple-500 hover:bg-purple-600 text-white relative overflow-hidden transition-all duration-300 ease-in-out"
              >
                <HelpCircle className="h-5 w-5 z-10" />
                <span className="absolute inset-0 bg-white opacity-25 animate-ping"></span>
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("Learn_About_Tool")}</p>
          </TooltipContent>
        </Tooltip>
        <DialogContent className="sm:max-w-[425px] overflow-hidden">
          <DialogHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-lg">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <CreditCard className="w-6 h-6" />
              {t("Credit_Card_Validator_Guide")}
            </DialogTitle>
            <DialogDescription className="text-purple-100">
              {t("Discover_Validation_Power")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 p-6 bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-gray-800 rounded-b-lg transition-all duration-300 ease-in-out">
            <section className="flex items-start space-x-3">
              <Info className="h-6 w-6 text-purple-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2 text-lg">{t("What_Is_It")}</h3>
                <p className="text-gray-600 dark:text-gray-300">{t("Tool_Description")}</p>
              </div>
            </section>
            <section className="flex items-start space-x-3">
              <Key className="h-6 w-6 text-purple-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2 text-lg">{t("Key_Features")}</h3>
                <ul className="space-y-1">
                  {[t("Real_Time_Validation"), t("Card_Type_Detection"), t("Security_Check"), t("User_Friendly_Interface")].map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-400 transition-colors duration-200">
                      <span className="h-1.5 w-1.5 bg-purple-500 rounded-full"></span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
            <section className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-inner">
              <h3 className="font-semibold mb-2 text-lg">{t("Try_It_Out")}</h3>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">{t("Validate_Card_Number")}</p>
              <div className="space-y-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="helpCardNumber">{t("Card_Number")}</Label>
                  <Input
                    type="text"
                    id="helpCardNumber"
                    placeholder="XXXX XXXX XXXX XXXX"
                    value={helpCardNumber}
                    onChange={(e) => setHelpCardNumber(e.target.value)}
                    className="border-purple-300 focus:border-purple-500"
                  />
                </div>
                <Button onClick={helpHandleValidate} className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                  {t("Validate")}
                </Button>
                {helpIsValid !== null && (
                  <div className={`flex items-center gap-2 ${helpIsValid ? "text-green-600" : "text-red-600"} font-semibold`}>
                    {helpIsValid ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                    {helpIsValid ? t("Valid_Card_Number") : t("Invalid_Card_Number")}
                  </div>
                )}
              </div>
            </section>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
                  {t("How_It_Works")}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{t("Validation_Process_Explanation")}</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
                  {t("Why_Important")}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{t("Importance_Explanation")}</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}