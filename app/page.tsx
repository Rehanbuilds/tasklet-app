"use client"

import { useState, useEffect } from "react"
import { OnboardingScreen } from "@/components/onboarding-screen"
import { BottomNavigation } from "@/components/bottom-navigation"
import { TaskCard } from "@/components/task-card"
import { EditTaskDialog } from "@/components/edit-task-dialog"
import { FolderCard } from "@/components/folder-card"
import { FolderDetailView } from "@/components/folder-detail-view"
import { CalendarView } from "@/components/calendar-view"
import { SettingsView } from "@/components/settings-view"
import { AppHeader } from "@/components/app-header"
import { FloatingAddButton } from "@/components/floating-add-button"
import { getTasks, getFolders, updateTask, initializeDefaultFolders, type Task, type Folder } from "@/lib/storage"
import { CheckCircle2, FolderOpen, Home } from "lucide-react"

export default function HomePage() {
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [activeTab, setActiveTab] = useState<"home" | "folders" | "calendar" | "settings">("home")
  const [tasks, setTasks] = useState<Task[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("tasklet-onboarding-complete")
    if (hasSeenOnboarding) {
      setShowOnboarding(false)
    }

    initializeDefaultFolders()
    setTasks(getTasks())
    setFolders(getFolders())
  }, [])

  const handleGetStarted = () => {
    localStorage.setItem("tasklet-onboarding-complete", "true")
    setShowOnboarding(false)
  }

  const refreshData = () => {
    setTasks(getTasks())
    setFolders(getFolders())
  }

  const handleToggleComplete = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      const newStatus = task.status === "Completed" ? "Pending" : "Completed"
      updateTask(taskId, { status: newStatus })
      refreshData()
    }
  }

  const handleTaskClick = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      setEditingTask(task)
      setEditDialogOpen(true)
    }
  }

  const handleFolderClick = (folderId: string) => {
    setSelectedFolderId(folderId)
  }

  const getTaskCountForFolder = (folderId: string) => {
    return tasks.filter((task) => task.folderId === folderId && task.status === "Pending").length
  }

  const today = new Date()
  const todayTasks = tasks.filter(
    (task) => task.dueDate.toDateString() === today.toDateString() && task.status === "Pending",
  )

  const upcomingTasks = tasks
    .filter((task) => task.dueDate > today && task.status === "Pending")
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())

  const getFolderName = (folderId?: string) => {
    return folders.find((f) => f.id === folderId)?.name
  }

  if (showOnboarding) {
    return <OnboardingScreen onGetStarted={handleGetStarted} />
  }

  if (selectedFolderId) {
    return <FolderDetailView folderId={selectedFolderId} onBack={() => setSelectedFolderId(null)} />
  }

  if (activeTab === "calendar") {
    return (
      <>
        <CalendarView />
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </>
    )
  }

  if (activeTab === "settings") {
    return (
      <>
        <SettingsView />
        <FloatingAddButton
          activeTab={activeTab}
          folders={folders}
          onTaskAdded={refreshData}
          onFolderAdded={refreshData}
        />
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </>
    )
  }

  if (activeTab === "folders") {
    return (
      <div className="min-h-screen bg-background pb-20">
        <AppHeader
          title="Folders"
          subtitle="Organize your tasks by project"
          icon={<FolderOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />}
        />

        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="space-y-3 sm:space-y-4">
            {folders.map((folder) => (
              <FolderCard
                key={folder.id}
                folder={folder}
                taskCount={getTaskCountForFolder(folder.id)}
                onClick={handleFolderClick}
                onFolderDeleted={refreshData}
              />
            ))}
          </div>
        </div>

        <FloatingAddButton
          activeTab={activeTab}
          folders={folders}
          onTaskAdded={refreshData}
          onFolderAdded={refreshData}
        />
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader
        title="Tasklet"
        subtitle="Stay on top of deadlines"
        icon={<Home className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />}
      />

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-6 sm:space-y-8">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center">
            <div className="p-4 sm:p-6 bg-primary/10 rounded-full mb-4 sm:mb-6">
              <CheckCircle2 className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Welcome to Tasklet!</h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-md px-4">
              Start organizing your tasks and never miss a deadline again. Use the + button to create your first task.
            </p>
          </div>
        ) : (
          <>
            <section>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <div className="w-1 h-5 sm:h-6 bg-primary rounded-full"></div>
                Today's Tasks
              </h2>
              {todayTasks.length === 0 ? (
                <div className="text-center py-6 sm:py-8 text-muted-foreground bg-muted/30 rounded-lg">
                  <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm sm:text-base">No tasks due today. Great job!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todayTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      id={task.id}
                      title={task.title}
                      description={task.description}
                      dueDate={task.dueDate}
                      priority={task.priority}
                      folderName={getFolderName(task.folderId)}
                      completed={task.status === "Completed"}
                      onToggleComplete={handleToggleComplete}
                      onClick={handleTaskClick}
                    />
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <div className="w-1 h-5 sm:h-6 bg-primary rounded-full"></div>
                Upcoming Tasks
              </h2>
              {upcomingTasks.length === 0 ? (
                <div className="text-center py-6 sm:py-8 text-muted-foreground bg-muted/30 rounded-lg">
                  <FolderOpen className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm sm:text-base">No upcoming tasks. Time to add some!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingTasks.slice(0, 5).map((task) => (
                    <TaskCard
                      key={task.id}
                      id={task.id}
                      title={task.title}
                      description={task.description}
                      dueDate={task.dueDate}
                      priority={task.priority}
                      folderName={getFolderName(task.folderId)}
                      completed={task.status === "Completed"}
                      onToggleComplete={handleToggleComplete}
                      onClick={handleTaskClick}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>

      <EditTaskDialog
        task={editingTask}
        folders={folders}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onTaskUpdated={refreshData}
      />

      <FloatingAddButton
        activeTab={activeTab}
        folders={folders}
        onTaskAdded={refreshData}
        onFolderAdded={refreshData}
      />
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
