"use client"

import { ArrowLeft, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface GlobalHeaderProps {
  showBackButton?: boolean
  onBackClick?: () => void
}

export function GlobalHeader({ showBackButton, onBackClick }: GlobalHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-gray-200/60 dark:border-white/10 bg-white/95 dark:bg-black/40 backdrop-blur-xl shadow-sm">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="bg-white/80 dark:bg-white/10 border-gray-200/80 dark:border-white/20 hover:bg-gray-50 dark:hover:bg-white/20 text-gray-700 dark:text-white shadow-sm transition-all duration-200 hover:shadow-md" />

          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-md">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base font-bold text-gray-900 dark:text-white">Soch Likho</h1>
              <p className="text-xs text-gray-600 dark:text-gray-400 -mt-0.5">App Banao</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-sm font-bold text-gray-900 dark:text-white">Soch Likho</h1>
            </div>
          </div>

          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackClick}
              className="ml-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200 hidden sm:flex"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackClick}
              className="text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200 sm:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
