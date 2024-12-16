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
import { HelpCircle, FileCode, ArrowRight, Check } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HTMLToMarkdownHelper({ t, className }: { t: (key: string) => string, className?: string }) {
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
                className={`relative overflow-hidden transition-all duration-300 ease-in-out ${className}`}
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
        <DialogContent className="sm:max-w-[90vw] md:max-w-[700px] lg:max-w-[800px] w-full max-h-[90vh] overflow-y-auto overflow-x-hidden p-4 sm:p-6">
          <DialogHeader className="space-y-2 sm:space-y-3">
            <DialogTitle className="text-lg sm:text-2xl md:text-3xl font-bold flex items-center gap-2 text-purple-600">
              <FileCode className="w-5 h-5 sm:w-8 sm:h-8" />
              {t("HTML_To_Markdown_Guide")}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-base md:text-lg text-gray-600 dark:text-gray-300">
              {t("Discover_Conversion_Power")}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
            <section>
              <h3 className="text-sm sm:text-xl font-semibold mb-2 sm:mb-3 text-purple-500">{t("What_Is_It")}</h3>
              <p className="text-xs sm:text-base text-gray-600 dark:text-gray-300">{t("Tool_Description")}</p>
            </section>
            <section>
              <h3 className="text-sm sm:text-xl font-semibold mb-2 sm:mb-3 text-purple-500">{t("Key_Features")}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                {[
                  { title: t("Clean_HTML"), description: t("Clean_HTML_Description") },
                  { title: t("Markdown_Conversion"), description: t("Markdown_Conversion_Description") },
                  { title: t("Syntax_Highlighting"), description: t("Syntax_Highlighting_Description") },
                  { title: t("Copy_Download"), description: t("Copy_Download_Description") },
                ].map((feature, index) => (
                  <Card key={index} className="bg-purple-50 dark:bg-gray-800 border-purple-200 dark:border-gray-700">
                    <CardHeader className="py-2 px-3 sm:pb-2 sm:px-4">
                      <CardTitle className="text-xs sm:text-lg font-semibold text-purple-600">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2 px-3 sm:px-4">
                      <CardDescription className="text-[10px] sm:text-sm text-gray-600 dark:text-gray-300">{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
            <section>
              <h3 className="text-sm sm:text-xl font-semibold mb-2 sm:mb-3 text-purple-500">{t("How_It_Works")}</h3>
              <div className="space-y-2 sm:space-y-4">
                {[
                  { title: t("Step_1_Clean_HTML"), description: t("Clean_HTML_Explanation") },
                  { title: t("Step_2_Convert_Markdown"), description: t("Convert_Markdown_Explanation") },
                  { title: t("Step_3_Syntax_Highlight"), description: t("Syntax_Highlight_Explanation") },
                ].map((step, index) => (
                  <div key={index} className="flex items-start space-x-2 sm:space-x-3">
                    <div className="flex-shrink-0 w-4 h-4 sm:w-8 sm:h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                      {index === 2 ? <Check className="w-3 h-3 sm:w-5 sm:h-5 text-purple-600" /> : <ArrowRight className="w-3 h-3 sm:w-5 sm:h-5 text-purple-600" />}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-lg font-semibold text-purple-600">{step.title}</h4>
                      <p className="mt-1 text-[10px] sm:text-sm text-gray-600 dark:text-gray-300">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}

