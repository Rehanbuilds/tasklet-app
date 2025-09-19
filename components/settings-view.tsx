"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ExportDialog } from "@/components/export-dialog"
import { AppHeader } from "@/components/app-header"
import { FolderCard } from "@/components/folder-card"
import { useTheme } from "@/hooks/use-theme"
import { Moon, Sun, Download, Trash2, Info, Settings, CheckCircle2, User } from "lucide-react"
import { getTasks, getFolders, COMPLETED_TASKS_FOLDER_ID } from "@/lib/storage"

export function SettingsView() {
  const { isDarkMode, toggleTheme, mounted } = useTheme()
  const [taskCount, setTaskCount] = useState(0)
  const [folderCount, setFolderCount] = useState(0)
  const [completedTasksCount, setCompletedTasksCount] = useState(0)
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    const tasks = getTasks()
    const completedTasks = tasks.filter((task) => task.status === "Completed")
    setTaskCount(tasks.length)
    setFolderCount(getFolders().length)
    setCompletedTasksCount(completedTasks.length)

    const storedName = localStorage.getItem("tasklet_user_name")
    setUserName(storedName)
  }, [])

  const handleClearAllData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      localStorage.removeItem("tasklet_tasks")
      localStorage.removeItem("tasklet_folders")
      localStorage.removeItem("tasklet_user_name")
      localStorage.removeItem("tasklet-onboarding-complete")
      window.location.reload()
    }
  }

  const completedTasksFolder = getFolders().find((folder) => folder.id === COMPLETED_TASKS_FOLDER_ID)

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader
        title="Settings"
        subtitle="Customize your Tasklet experience"
        icon={<Settings className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />}
      />

      <div className="container mx-auto px-4 py-6 space-y-6">
        {userName && (
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <User className="h-6 w-6 text-primary" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Welcome back, {userName}!</h3>
                  <p className="text-sm text-muted-foreground">Keep up the great work with your tasks</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {completedTasksFolder && completedTasksCount > 0 && (
          <Card className="border-2 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                Completed Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FolderCard
                folder={completedTasksFolder}
                taskCount={completedTasksCount}
                onClick={() => {}} // Will be handled by parent component
                onFolderDeleted={() => {}} // Completed folder shouldn't be deletable
              />
            </CardContent>
          </Card>
        )}

        {/* Appearance */}
        <Card className="border-2 border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              {isDarkMode ? <Moon className="h-6 w-6 text-primary" /> : <Sun className="h-6 w-6 text-primary" />}
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div>
                <Label htmlFor="dark-mode" className="text-base font-medium">
                  Dark Mode
                </Label>
                <p className="text-sm text-muted-foreground mt-1">Toggle between light and dark themes</p>
              </div>
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={toggleTheme}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{taskCount}</div>
                <div className="text-sm text-muted-foreground">Tasks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{folderCount}</div>
                <div className="text-sm text-muted-foreground">Folders</div>
              </div>
            </div>

            <div className="space-y-3">
              <ExportDialog>
                <Button variant="outline" className="w-full gap-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  Export & Share Tasks
                </Button>
              </ExportDialog>

              <Button variant="destructive" className="w-full gap-2" onClick={handleClearAllData}>
                <Trash2 className="h-4 w-4" />
                Clear All Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              About Tasklet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Tasklet is a smart task and deadline tracker designed for students and freelancers. Stay organized and
                never miss a deadline again.
              </p>

              <div className="pt-2 border-t">
                <div className="text-sm font-medium">Features:</div>
                <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                  <li>• Create and organize tasks with priorities</li>
                  <li>• Group tasks into folders and projects</li>
                  <li>• Visual calendar view of deadlines</li>
                  <li>• Export and share your task lists</li>
                  <li>• Dark mode support</li>
                  <li>• Offline-first with local storage</li>
                </ul>
              </div>

              <div className="pt-2 border-t text-center">
                <p className="text-xs text-muted-foreground">Version 1.0.0 • Built by Mr Rehan</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
