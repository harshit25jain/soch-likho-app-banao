"use client"

import { ArrowLeft, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface TopHeaderProps {
  showBackButton?: boolean
  onBackClick?: () => void
}

export function TopHeader({ showBackButton, onBackClick }: TopHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 dark:border-white/10 bg-white/90 dark:bg-black/30 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="bg-white/80 dark:bg-white/10 border-gray-200 dark:border-white/20 hover:bg-white dark:hover:bg-white/20 text-gray-700 dark:text-white shadow-sm transition-all duration-200" />

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">Soch Likho</h1>
              <p className="text-xs text-gray-600 dark:text-gray-400 -mt-1">App Banao</p>
            </div>
          </div>

          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackClick}
              className="ml-4 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
