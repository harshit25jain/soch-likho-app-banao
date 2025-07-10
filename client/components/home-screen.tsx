"use client"

import type React from "react"
import { useState } from "react"
import { Loader2, Zap, Sparkles, Clock, Calculator, ListTodo } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface HomeScreenProps {
  onGenerateApp: (prompt: string) => void
  isGenerating: boolean
}

const quickStartIdeas = [
  { label: "Create a todo app", icon: <ListTodo className="w-4 h-4 mr-1" /> },
  { label: "Build a calculator", icon: <Calculator className="w-4 h-4 mr-1" /> },
  { label: "Make a timer app", icon: <Clock className="w-4 h-4 mr-1" /> },
]

const sampleApps = [
  {
    title: "Todo App",
    desc: "Organize your tasks with drag-and-drop and dark mode.",
    icon: <ListTodo className="w-6 h-6 text-blue-500" />,
  },
  {
    title: "Calculator",
    desc: "A modern calculator with scientific functions.",
    icon: <Calculator className="w-6 h-6 text-purple-500" />,
  },
  {
    title: "Timer App",
    desc: "A simple timer with start, pause, and reset.",
    icon: <Clock className="w-6 h-6 text-emerald-500" />,
  },
]

export function HomeScreen({ onGenerateApp, isGenerating }: HomeScreenProps) {
  const [prompt, setPrompt] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim() && !isGenerating) {
      onGenerateApp(prompt.trim())
    }
  }

  const handleQuickStart = (idea: string) => {
    if (!isGenerating) {
      setPrompt(idea)
    }
  }

  return (
    <div className="h-[calc(100vh-3.5rem)] w-full flex items-center justify-center">
      <div className="max-w-xl w-full mx-auto flex flex-col items-center justify-center p-4 overflow-auto">
        {/* Header Section */}
        <div className="text-center mb-4 lg:mb-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2 lg:mb-3 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
              Transform Ideas into Apps
            </span>
          </h1>
          <p className="text-base lg:text-xl text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
            Use text to generate production-ready applications with AI
          </p>
        </div>

        {/* Main Input Card */}
        <div className="bg-white/95 dark:bg-white/10 backdrop-blur-xl border border-gray-200/60 dark:border-white/20 rounded-2xl p-4 lg:p-6 shadow-xl mb-3 lg:mb-4 transition-all duration-300 hover:shadow-2xl w-full">
          <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-4">
            <div className="relative">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the app you want to build... (e.g., 'Create a modern todo app with dark mode and drag-and-drop functionality')"
                className="min-h-[80px] lg:min-h-[100px] bg-white/80 dark:bg-white/5 border-gray-200/60 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 resize-none text-base lg:text-lg leading-relaxed backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200"
                disabled={isGenerating}
              />
            </div>

            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={!prompt.trim() || isGenerating}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 lg:px-8 py-2.5 lg:py-3 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 text-base lg:text-lg font-semibold"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 lg:h-5 lg:w-5 mr-2 animate-spin" />
                    Generating App...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
                    Generate App
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Quick Start Ideas */}
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 text-center">Quick start ideas:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {quickStartIdeas.map((idea, index) => (
                <Button
                  key={index}
                  variant="outline"
                  type="button"
                  onClick={() => handleQuickStart(idea.label)}
                  disabled={isGenerating}
                  className="flex items-center gap-1 bg-white/80 dark:bg-white/10 border-gray-200/60 dark:border-white/20 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-white/20 hover:text-gray-900 dark:hover:text-white backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-medium disabled:opacity-50 shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105"
                >
                  {idea.icon}
                  {idea.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Sample Apps Showcase (optional, lively touch) */}
        <div className="w-full mt-6 flex flex-col items-center">
          <div className="flex gap-4 flex-wrap justify-center">
            {sampleApps.map((app, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center bg-white/80 dark:bg-white/10 border border-gray-200/60 dark:border-white/20 rounded-xl shadow-md p-4 min-w-[160px] max-w-[200px] transition-all duration-200 hover:shadow-xl"
              >
                {app.icon}
                <div className="font-semibold text-gray-900 dark:text-white mt-2 mb-1 text-center">{app.title}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300 text-center">{app.desc}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1 mt-4 text-xs text-gray-400 dark:text-gray-500">
            <Sparkles className="w-4 h-4" />
            <span>AI-powered app builder</span>
          </div>
        </div>
      </div>
    </div>
  )
}
