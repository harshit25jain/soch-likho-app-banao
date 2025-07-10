"use client"

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { useState, useEffect } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { HomeScreen } from "@/components/home-screen"
import { AppBuilder } from "@/components/app-builder"
import { ThemeProvider } from "@/components/theme-provider"
import { GlobalHeader } from "@/components/global-header"
import { Menu } from "lucide-react"

export interface GeneratedApp {
  id: string
  title: string
  prompt: string
  summary: string
  files: { [filename: string]: string }
  status: "generating" | "ready" | "deploying" | "deployed"
  deployUrl?: string
  createdAt: Date
}

function DeploymentOverlay({ message }: { message: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-white via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-purple-950 dark:to-slate-900">
      <div className="flex flex-col items-center justify-center">
        <svg className="animate-spin h-12 w-12 text-blue-600 mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{message}</h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg">Please wait while your app is being deployed to Netlify...</p>
      </div>
    </div>
  )
}

export default function Home() {
  const [currentApp, setCurrentApp] = useState<GeneratedApp | null>(null)
  const [recentApps, setRecentApps] = useState<GeneratedApp[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [appToDelete, setAppToDelete] = useState<GeneratedApp | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [isDeploying, setIsDeploying] = useState(false)
  const [deployMessage, setDeployMessage] = useState("")

  const handleGenerateApp = async (prompt: string) => {
    setIsGenerating(true)
    try {
      const res = await fetch('/api/apps/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, framework: 'react' })
      })
      const data = await res.json()
      console.log('API /api/apps/generate response:', data)
      if (!data.success || !data.app) throw new Error(data.error || 'Failed to generate app')
      // Fetch the full app object (with files) after creation
      const appRes = await fetch(`/api/apps/${data.app.id}`)
      const appData = await appRes.json()
      console.log('API /api/apps/:id response:', appData)
      if (!appData.success || !appData.data) throw new Error(appData.error || 'Failed to fetch app')
      const newApp = appData.data
      setRecentApps((prev) => [newApp, ...prev])
      setCurrentApp(newApp)
    } catch (e) {
      console.error('App generation error:', e)
      alert('Failed to generate app. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSelectApp = (app: GeneratedApp) => {
    setCurrentApp(app)
  }

  const handleNewApp = () => {
    setCurrentApp(null)
  }

  const handleDeploy = async (appId: string) => {
    setIsDeploying(true)
    setDeployMessage("Deployment is building")
    try {
      // 1. Call backend to start deployment
      const res = await fetch('/api/deployment/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appId, framework: 'react' })
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error || 'Failed to start deployment')
      // 2. Poll for deployment status
      let deployed = false
      let deployUrl = ''
      setDeployMessage("Deployment is building")
      for (let i = 0; i < 60; i++) { // up to 3 minutes
        await new Promise(r => setTimeout(r, 3000))
        const statusRes = await fetch(`/api/deployment/${appId}/status`)
        const statusData = await statusRes.json()
        if (statusData.status === 'deployed' && statusData.deployUrl) {
          deployed = true
          deployUrl = statusData.deployUrl
          break
        }
        setDeployMessage(
          statusData.status === 'failed'
            ? 'Deployment failed. Please try again.'
            : `Deployment is ${statusData.status || 'building'}...`
        )
        if (statusData.status === 'failed') break
      }
      setIsDeploying(false)
      if (deployed && deployUrl) {
        window.location.href = deployUrl.startsWith('http') ? deployUrl : `https://${deployUrl}`
      } else {
        alert('Deployment failed or timed out. Please try again.')
      }
    } catch (e) {
      setIsDeploying(false)
      alert('Deployment failed. Please try again.')
    }
  }

  const handleDeleteApp = (app: GeneratedApp) => {
    setAppToDelete(app)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteApp = async () => {
    if (!appToDelete) return
    setIsDeleting(true)
    try {
      // Call backend to delete
      await fetch(`/api/apps/${appToDelete.id}`, { method: "DELETE" })
      setRecentApps((prev) => prev.filter((a) => a.id !== appToDelete.id))
      if (currentApp?.id === appToDelete.id) setCurrentApp(null)
      setDeleteDialogOpen(false)
      setAppToDelete(null)
    } catch (e) {
      alert("Failed to delete app. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-purple-950 dark:to-slate-900">
        {isDeploying && <DeploymentOverlay message={deployMessage} />}
        <SidebarProvider>
          {/* Global Header - Absolutely positioned to span full width */}
          <GlobalHeader showBackButton={!!currentApp} onBackClick={handleNewApp} />
          {/* Hamburger menu for mobile (absolutely positioned in header) */}
          <button
            className="md:hidden fixed left-4 top-4 z-30 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Open sidebar"
            type="button"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Sidebar - fixed on desktop, drawer on mobile */}
          {/* Desktop sidebar */}
          <div className="hidden md:block fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-64 z-20">
            <AppSidebar
              recentApps={recentApps}
              onSelectApp={handleSelectApp}
              onNewApp={handleNewApp}
              currentAppId={currentApp?.id}
              onDeleteApp={handleDeleteApp}
            />
          </div>
          {/* Mobile sidebar drawer */}
          {mobileSidebarOpen && (
            <div className="fixed inset-0 z-40 flex md:hidden">
              {/* Overlay */}
              <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setMobileSidebarOpen(false)}
                aria-label="Close sidebar overlay"
              />
              {/* Sidebar drawer */}
              <div className="relative w-64 h-full bg-white dark:bg-black/90 shadow-xl z-50 animate-slideInLeft">
                <AppSidebar
                  recentApps={recentApps}
                  onSelectApp={(app) => { setMobileSidebarOpen(false); handleSelectApp(app); }}
                  onNewApp={() => { setMobileSidebarOpen(false); handleNewApp(); }}
                  currentAppId={currentApp?.id}
                  onDeleteApp={handleDeleteApp}
                />
                {/* Close button */}
                <button
                  className="absolute top-2 right-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
                  onClick={() => setMobileSidebarOpen(false)}
                  aria-label="Close sidebar"
                  type="button"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Main content - responsive left padding for desktop only */}
          <main
            className="flex-1 min-w-0 flex items-center justify-center md:pl-64"
            style={{ minHeight: 'calc(100vh - 3.5rem)' }}
          >
            {!currentApp ? (
              <HomeScreen onGenerateApp={handleGenerateApp} isGenerating={isGenerating} />
            ) : (
              <AppBuilder app={currentApp} onDeploy={handleDeploy} onChat={handleGenerateApp} />
            )}
          </main>
        </SidebarProvider>
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this app?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete <span className="font-semibold text-red-600">{appToDelete?.title}</span>? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteApp} disabled={isDeleting} className="bg-red-600 hover:bg-red-700 text-white">
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ThemeProvider>
  )
}
