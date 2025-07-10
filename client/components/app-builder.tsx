"use client"

import type React from "react"
import { useState } from "react"
import { Code, Eye, Download, Globe, Send, Loader2, Folder, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import type { GeneratedApp } from "@/app/page"
import { cn } from "@/lib/utils"
import { Sandpack, SandpackProvider, SandpackPreview, SandpackCodeViewer } from "@codesandbox/sandpack-react"

interface AppBuilderProps {
  app: GeneratedApp
  onDeploy: (appId: string) => void
  onChat: (prompt: string) => void
}

const fileStructure = [
  { name: "public", type: "folder", icon: "📁", children: [{ name: "index.html", type: "file", icon: "🌐" }] },
  {
    name: "src",
    type: "folder",
    icon: "📁",
    children: [
      { name: "App.js", type: "file", icon: "⚛️", active: true },
      { name: "index.js", type: "file", icon: "📄" },
      { name: "App.css", type: "file", icon: "🎨" },
    ],
  },
  { name: "package.json", type: "file", icon: "📦" },
]

export function AppBuilder({ app, onDeploy, onChat }: AppBuilderProps) {
  const [chatInput, setChatInput] = useState("")
  const [activeTab, setActiveTab] = useState("preview")

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (chatInput.trim()) {
      onChat(chatInput.trim())
      setChatInput("")
    }
  }

  const handleDeploy = () => {
    onDeploy(app.id)
  }

  const handleExport = () => {
    const blob = new Blob([app.files["/App.js"]], { type: "text/javascript" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${app.title.replace(/\s+/g, "-").toLowerCase()}.js`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const renderFileTree = (files: any[], level = 0) => {
    return files.map((file, index) => (
      <div key={index}>
        <div
          className={cn(
            "flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer transition-all duration-200 text-sm",
            "hover:bg-white/60 dark:hover:bg-white/10",
            file.active && "bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300",
          )}
          style={{ paddingLeft: `${8 + level * 16}px` }}
        >
          {file.type === "folder" && <ChevronRight className="h-3 w-3" />}
          <span className="text-sm">{file.icon}</span>
          <span className="font-medium">{file.name}</span>
        </div>
        {file.children && renderFileTree(file.children, level + 1)}
      </div>
    ))
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Left Panel - Chat/Summary */}
      <div className="w-full lg:w-1/3 bg-white/98 dark:bg-black/40 backdrop-blur-xl border-b lg:border-b-0 lg:border-r border-gray-200/60 dark:border-white/10 flex flex-col">
        {/* Summary Section */}
        <div className="p-4 lg:p-6 border-b border-gray-200/60 dark:border-white/10">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold inline-block mb-4 shadow-lg">
            {app.title}
          </div>
          <div className="text-gray-900 dark:text-white text-sm leading-relaxed">{app.summary}</div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed space-y-2">
            <p>✨ Key features and components will be implemented based on your requirements.</p>
            <p>🔧 You can ask for modifications or improvements below.</p>
            <p>🚀 Once ready, export your code or deploy to Netlify.</p>
          </div>
        </div>

        {/* Chat Input - Fixed at bottom */}
        <div className="p-4 lg:p-6 border-t border-gray-200/60 dark:border-white/10 bg-white/95 dark:bg-black/40 backdrop-blur-xl">
          <form onSubmit={handleChatSubmit} className="space-y-3">
            <Textarea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask for changes or improvements..."
              className="bg-white/80 dark:bg-white/10 border-gray-200/60 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 resize-none rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200"
              rows={3}
            />
            <Button
              type="submit"
              disabled={!chatInput.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
            >
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </form>
        </div>
      </div>

      {/* Right Panel - Code/Preview */}
      <div className="flex-1 flex flex-col bg-white/60 dark:bg-black/30 backdrop-blur-xl overflow-hidden">
        {/* Header with tabs and actions */}
        <div className="bg-white/95 dark:bg-black/50 backdrop-blur-xl border-b border-gray-200/60 dark:border-white/10 p-4 lg:p-6 flex-shrink-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList className="bg-white/90 dark:bg-white/10 border border-gray-200/60 dark:border-white/20 rounded-lg p-1">
                <TabsTrigger
                  value="preview"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-white/20 data-[state=active]:shadow-sm rounded-md px-4 py-2 font-medium transition-all duration-200"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </TabsTrigger>
                <TabsTrigger
                  value="code"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-white/20 data-[state=active]:shadow-sm rounded-md px-4 py-2 font-medium transition-all duration-200"
                >
                  <Code className="h-4 w-4 mr-2" />
                  Code
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                onClick={handleExport}
                variant="outline"
                className="flex-1 sm:flex-none bg-white/90 dark:bg-white/10 border-gray-200/60 dark:border-white/20 text-gray-700 dark:text-white hover:bg-white dark:hover:bg-white/20 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 font-medium"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                onClick={handleDeploy}
                disabled={app.status === "deploying"}
                className={cn(
                  "flex-1 sm:flex-none text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 font-medium",
                  app.status === "deployed"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : app.status === "deploying"
                      ? "bg-orange-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700",
                )}
              >
                {app.status === "deploying" ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deploying...
                  </>
                ) : app.status === "deployed" ? (
                  <>
                    <Globe className="h-4 w-4 mr-2" />
                    Live
                  </>
                ) : (
                  <>
                    <Globe className="h-4 w-4 mr-2" />
                    Deploy
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} className="h-full">
            <SandpackProvider files={app.files} template="react">
              <TabsContent value="preview" className="h-full m-0">
                <div className="h-full flex items-center justify-center bg-white/80 dark:bg-white/5 backdrop-blur-xl overflow-auto">
                  {app.status === "generating" ? (
                    <div className="flex items-center justify-center h-96 w-full">
                      <div className="text-center">
                        <Loader2 className="h-10 w-10 lg:h-12 lg:w-12 animate-spin text-blue-500 mx-auto mb-4 lg:mb-6" />
                        <p className="text-gray-900 dark:text-white text-lg lg:text-xl font-semibold mb-2">
                          Building preview, please wait...
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">This may take a few seconds</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <div className="w-full max-w-xl min-h-[400px] bg-white dark:bg-black/80 border border-gray-200/60 dark:border-white/20 rounded-2xl shadow-2xl p-4 flex items-center justify-center transition-all duration-300">
                        <iframe
                          srcDoc={app.files['/index.html']}
                          title="App Preview"
                          className="w-full h-[500px] rounded-xl border-0 shadow"
                          sandbox="allow-scripts allow-same-origin"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="code" className="h-full m-0">
                <div className="h-full bg-gray-50/90 dark:bg-black/50 backdrop-blur-xl flex flex-col lg:flex-row overflow-hidden">
                  <div className="w-full flex-1 flex flex-col overflow-hidden">
                    <SandpackCodeViewer
                      showTabs={true}
                      showLineNumbers={true}
                    />
                  </div>
                </div>
              </TabsContent>
            </SandpackProvider>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
