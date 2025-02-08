"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Minus, Plus, RotateCcw, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

// Soft, subtle sounds
const INCREASE_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3"
const DECREASE_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3"
const MILESTONE_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3"

// Motivational messages for milestones
const MILESTONE_MESSAGES = [
  "Keep going strong! 💪",
  "You're on fire! 🔥",
  "Unstoppable! ⚡",
  "Amazing progress! 🌟",
  "You're crushing it! 🚀",
  "Fantastic work! 🎯",
  "Keep that momentum! 🌊",
  "You're doing great! ✨",
  "Outstanding! 🏆",
  "Incredible pace! 💫",
]

export default function Counter() {
  const [count, setCount] = useState(0)
  const { theme, setTheme } = useTheme()
  const [increaseAudio] = useState(() => new Audio(INCREASE_SOUND_URL))
  const [decreaseAudio] = useState(() => new Audio(DECREASE_SOUND_URL))
  const [milestoneAudio] = useState(() => new Audio(MILESTONE_SOUND_URL))
  const { toast } = useToast()

  // Set volume to be very quiet
  useEffect(() => {
    increaseAudio.volume = 0.1
    decreaseAudio.volume = 0.1
    milestoneAudio.volume = 0.15 // Slightly louder for celebration
  }, [increaseAudio, decreaseAudio, milestoneAudio])

  const celebrateMilestone = useCallback(() => {
    // Play celebration sound
    milestoneAudio.currentTime = 0
    milestoneAudio.play().catch(() => {})

    // Show random motivational message
    const message = MILESTONE_MESSAGES[Math.floor(Math.random() * MILESTONE_MESSAGES.length)]

    toast({
      title: `Milestone Reached! ${count}`,
      description: message,
      className: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-none",
    })
  }, [milestoneAudio, count, toast])

  const playSound = useCallback(
    (isIncrease: boolean) => {
      const audio = isIncrease ? increaseAudio : decreaseAudio
      audio.currentTime = 0
      audio.play().catch(() => {})
    },
    [increaseAudio, decreaseAudio],
  )

  useEffect(() => {
    const savedCount = localStorage.getItem("count")
    if (savedCount) {
      setCount(Number.parseInt(savedCount))
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setCount((prev) => {
          const newCount = prev - 1
          localStorage.setItem("count", newCount.toString())
          playSound(false)
          return newCount
        })
      } else if (e.key === "ArrowRight") {
        setCount((prev) => {
          const newCount = prev + 1
          localStorage.setItem("count", newCount.toString())
          playSound(true)
          if (newCount > 0 && newCount % 10 === 0) {
            celebrateMilestone()
          }
          return newCount
        })
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [playSound, celebrateMilestone])

  const updateCount = (newCount: number, isIncrease: boolean) => {
    setCount(newCount)
    localStorage.setItem("count", newCount.toString())
    playSound(isIncrease)

    // Check for milestone (multiples of 10) when increasing
    if (isIncrease && newCount > 0 && newCount % 10 === 0) {
      celebrateMilestone()
    }
  }

  const resetCount = () => {
    updateCount(0, false)
  }

  return (
    <div className="flex h-[100vh] items-center justify-center bg-background">
      <div className="flex flex-col items-center">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-12 pb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => updateCount(count - 1, false)}
            aria-label="Decrease count"
            className="h-16 w-16 rounded-2xl border-2 bg-gradient-to-b from-background to-muted/50 shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
          >
            <Minus className="h-8 w-8" />
          </Button>

          <div className="relative flex h-32 w-48 items-center justify-center">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={count}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute text-9xl font-medium tabular-nums tracking-tighter"
              >
                {count}
              </motion.span>
            </AnimatePresence>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => updateCount(count + 1, true)}
            aria-label="Increase count"
            className="h-16 w-16 rounded-2xl border-2 bg-gradient-to-b from-background to-muted/50 shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
          >
            <Plus className="h-8 w-8" />
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={resetCount}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  )
}

