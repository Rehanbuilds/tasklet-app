"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { TaskCard } from "@/components/task-card"
import { AddTaskDialog } from "@/components/add-task-dialog"
import { EditTaskDialog } from "@/components/edit-task-dialog"
import { ArrowLeft, Plus } from "lucide-react"
import { getTasks, getFolders, updateTask, type Task, type Folder } from "@/lib/storage"

interface FolderDetailViewProps {
  folderId: string
  onBack: () => void
}

export function FolderDetailView({ folderId, onBack }: FolderDetailViewProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [folder, setFolder] = useState<Folder | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  useEffect(() => {
    const allTasks = getTasks()
    const allFolders = getFolders()
    const currentFolder = allFolders.find((f) => f.id === folderId)

    setTasks(allTasks.filter((task) => task.folderId === folderId))
    setFolders(allFolders)
    setFolder(currentFolder || null)
  }, [folderId])

  const refreshData = () => {
    const allTasks = getTasks()
    const allFolders = getFolders()
    setTasks(allTasks.filter((task) => task.folderId === folderId))
    setFolders(allFolders)
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

  const pendingTasks = tasks
    .filter((task) => task.status === "Pending")
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())

  const completedTasks = tasks
    .filter((task) => task.status === "Completed")
    .sort((a, b) => b.dueDate.getTime() - a.dueDate.getTime())

  const getFolderName = (folderId?: string) => {
    return folders.find((f) => f.id === folderId)?.name
  }

  if (!folder) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center py-20">
            <p className="text-muted-foreground">Folder not found</p>
            <Button onClick={onBack} className="mt-4">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">{folder.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
                </p>
              </div>
            </div>
            <AddTaskDialog folders={folders} onTaskAdded={refreshData} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Pending Tasks */}
        {pendingTasks.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3">Pending Tasks</h2>
            <div className="space-y-3">
              {pendingTasks.map((task) => (
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
          </section>
        )}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3">Completed Tasks</h2>
            <div className="space-y-3">
              {completedTasks.map((task) => (
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
          </section>
        )}

        {/* Empty State */}
        {tasks.length === 0 && (
          <div className="text-center py-20">
            <div className="p-4 bg-muted/50 rounded-lg inline-block mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No tasks in this folder</h3>
            <p className="text-muted-foreground mb-4">Add your first task to get started organizing your work.</p>
            <AddTaskDialog folders={folders} onTaskAdded={refreshData} />
          </div>
        )}
      </div>

      <EditTaskDialog
        task={editingTask}
        folders={folders}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onTaskUpdated={refreshData}
      />
    </div>
  )
}
