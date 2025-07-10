"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="bg-white/90 dark:bg-white/10 border-gray-200/60 dark:border-white/20 backdrop-blur-xl hover:bg-white dark:hover:bg-white/20 text-gray-700 dark:text-white shadow-sm transition-all duration-200"
      >
        <Sun className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="bg-white/90 dark:bg-white/10 border-gray-200/60 dark:border-white/20 backdrop-blur-xl hover:bg-white dark:hover:bg-white/20 text-gray-700 dark:text-white transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 transition-transform duration-300 rotate-0 scale-100" />
      ) : (
        <Moon className="h-4 w-4 transition-transform duration-300 rotate-0 scale-100" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
