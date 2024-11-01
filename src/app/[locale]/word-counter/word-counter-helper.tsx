'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
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
import { HelpCircle, Info, List, PlayCircle } from "lucide-react"
import { useTranslations } from 'next-intl'

export default function WordCounterHelper() {
  const t = useTranslations('WordCounterHelper')

  const howSteps = [
    t('How_Step_1'),
    t('How_Step_2'),
    t('How_Step_3'),
    t('How_Step_4')
  ]

  return (
    <TooltipProvider>
      <Dialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label={t('Help_Aria')}
                className="bg-white/10 hover:bg-white/20 text-white relative overflow-hidden transition-all duration-300 ease-in-out"
              >
                <HelpCircle className="h-5 w-5 z-10" />
                <span className="absolute inset-0 bg-white opacity-15"></span>
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('Help_Tooltip')}</p>
          </TooltipContent>
        </Tooltip>
        <DialogContent className="sm:max-w-[425px] overflow-hidden">
          <DialogHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-lg">
            <DialogTitle className="text-2xl font-bold">{t('Guide_Title')}</DialogTitle>
            <DialogDescription className="text-purple-100">
              {t('Guide_Description')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 p-6 bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-gray-800 rounded-b-lg transition-all duration-300 ease-in-out">
            <section className="flex items-start space-x-3">
              <Info className="h-6 w-6 text-purple-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2 text-lg">{t('What_Title')}</h3>
                <p className="text-gray-600 dark:text-gray-300">{t('What_Description')}</p>
              </div>
            </section>
            <section className="flex items-start space-x-3">
              <List className="h-6 w-6 text-purple-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2 text-lg">{t('Features_Title')}</h3>
                <ul className="space-y-1">
                  {[t('Feature_1'), t('Feature_2'), t('Feature_3'), t('Feature_4')].map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-400 transition-colors duration-200">
                      <span className="h-1.5 w-1.5 bg-purple-500 rounded-full"></span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
            <section className="flex items-start space-x-3">
              <PlayCircle className="h-6 w-6 text-purple-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2 text-lg">{t('How_Title')}</h3>
                <ol className="list-decimal pl-5 space-y-1">
                  {howSteps.map((step, index) => (
                    <li key={index} className="text-gray-600 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-400 transition-colors duration-200">{step}</li>
                  ))}
                </ol>
              </div>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}
