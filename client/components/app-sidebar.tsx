"use client"

import { Plus, Clock, Globe, Loader2, Folder, Trash } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import type { GeneratedApp } from "@/app/page"
import { cn } from "@/lib/utils"

interface AppSidebarProps {
  recentApps: GeneratedApp[]
  onSelectApp: (app: GeneratedApp) => void
  onNewApp: () => void
  currentAppId?: string
  onDeleteApp: (app: GeneratedApp) => void
}

export function AppSidebar({ recentApps, onSelectApp, onNewApp, currentAppId, onDeleteApp }: AppSidebarProps) {
  const getStatusIcon = (status: GeneratedApp["status"]) => {
    switch (status) {
      case "generating":
        return <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
      case "ready":
        return <Clock className="h-3 w-3 text-emerald-500" />
      case "deploying":
        return <Loader2 className="h-3 w-3 animate-spin text-orange-500" />
      case "deployed":
        return <Globe className="h-3 w-3 text-green-500" />
    }
  }

  const getStatusText = (status: GeneratedApp["status"]) => {
    switch (status) {
      case "generating":
        return "Generating..."
      case "ready":
        return "Ready"
      case "deploying":
        return "Deploying..."
      case "deployed":
        return "Live"
    }
  }

  return (
    <Sidebar className="border-r border-gray-200/60 dark:border-white/10">
      <div className="flex h-full w-full flex-col bg-white/98 dark:bg-black/40 backdrop-blur-xl">
        <SidebarHeader className="p-4">
          <Button
            onClick={onNewApp}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:p-0 font-medium"
          >
            <Plus className="h-4 w-4 group-data-[collapsible=icon]:mr-0 mr-2" />
            <span className="group-data-[collapsible=icon]:hidden">Create New App</span>
          </Button>
        </SidebarHeader>

        <SidebarSeparator className="bg-gray-200/60 dark:bg-white/10 mx-3" />

        <SidebarContent className="flex-1 p-3 overflow-auto">
          <div className="mb-4 group-data-[collapsible=icon]:hidden">
            <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2 px-1">
              <Folder className="h-3 w-3" />
              Recent Apps
            </h3>
          </div>

          {recentApps.length === 0 ? (
            <div className="text-center py-8 group-data-[collapsible=icon]:hidden">
              <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">No apps yet</div>
              <div className="text-gray-400 dark:text-gray-500 text-xs">Create your first app to get started</div>
            </div>
          ) : (
            <SidebarMenu className="space-y-2">
              {recentApps.map((app) => (
                <SidebarMenuItem key={app.id}>
                  <div className="flex items-center w-full">
                    <SidebarMenuButton
                      onClick={() => onSelectApp(app)}
                      className={cn(
                        "flex-1 w-0 p-3 rounded-lg transition-all duration-200 border",
                        "bg-white/90 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10",
                        "border-gray-200/60 dark:border-white/10 hover:border-gray-300/80 dark:hover:border-white/20",
                        "backdrop-blur-sm shadow-sm hover:shadow-md",
                        currentAppId === app.id &&
                          "bg-blue-50 dark:bg-blue-500/20 border-blue-200/80 dark:border-blue-400/30 shadow-md",
                        "group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:p-2",
                      )}
                    >
                      <div className="flex flex-col items-start gap-1.5 w-full group-data-[collapsible=icon]:hidden">
                        <div className="flex items-center justify-between w-full">
                          <span className="text-sm font-medium text-gray-900 dark:text-white truncate pr-2">
                            {app.title}
                          </span>
                          {getStatusIcon(app.status)}
                        </div>
                        <div className="flex items-center justify-between w-full text-xs">
                          <span className="text-gray-500 dark:text-gray-400">{app.createdAt.toLocaleDateString()}</span>
                          <span className="text-gray-500 dark:text-gray-400 font-medium">
                            {getStatusText(app.status)}
                          </span>
                        </div>
                      </div>
                      <div className="group-data-[collapsible=icon]:block hidden">{getStatusIcon(app.status)}</div>
                    </SidebarMenuButton>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteApp(app); }}
                      className="ml-2 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
                      title="Delete app"
                      aria-label="Delete app"
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          )}
        </SidebarContent>

        <SidebarFooter className="p-3 border-t border-gray-200/60 dark:border-white/10">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center group-data-[collapsible=icon]:hidden">
            {recentApps.length} app{recentApps.length !== 1 ? "s" : ""} created
          </div>
        </SidebarFooter>
      </div>
    </Sidebar>
  )
}
