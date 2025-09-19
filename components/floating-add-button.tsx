"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AddTaskDialog } from "@/components/add-task-dialog"
import { AddFolderDialog } from "@/components/add-folder-dialog"
import { Plus, FileText, FolderPlus } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Folder } from "@/lib/storage"

interface FloatingAddButtonProps {
  activeTab: "home" | "folders" | "calendar" | "settings"
  folders: Folder[]
  onTaskAdded: () => void
  onFolderAdded: () => void
}

export function FloatingAddButton({ activeTab, folders, onTaskAdded, onFolderAdded }: FloatingAddButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (activeTab === "settings") {
    return null
  }

  return (
    <div className="fixed bottom-24 right-4 z-50">
      {/* Expanded options */}
      <div
        className={cn(
          "flex flex-col gap-3 mb-3 transition-all duration-300",
          isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none",
        )}
      >
        {activeTab === "folders" && (
          <AddFolderDialog onFolderAdded={onFolderAdded}>
            <Button size="sm" className="gap-2 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground">
              <FolderPlus className="h-4 w-4" />
              Add Folder
            </Button>
          </AddFolderDialog>
        )}

        <AddTaskDialog folders={folders} onTaskAdded={onTaskAdded}>
          <Button size="sm" className="gap-2 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground">
            <FileText className="h-4 w-4" />
            Add Task
          </Button>
        </AddTaskDialog>
      </div>

      {/* Main floating button */}
      <Button
        size="lg"
        className={cn(
          "h-14 w-14 rounded-full shadow-lg transition-all duration-300",
          "bg-primary hover:bg-primary/90 text-primary-foreground",
          isExpanded && "rotate-45",
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  )
}
