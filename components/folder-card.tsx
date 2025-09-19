"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FolderOpen, Trash2 } from "lucide-react"
import { deleteFolder, type Folder } from "@/lib/storage"

interface FolderCardProps {
  folder: Folder
  taskCount: number
  onClick: (folderId: string) => void
  onFolderDeleted: () => void
}

export function FolderCard({ folder, taskCount, onClick, onFolderDeleted }: FolderCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (confirm(`Are you sure you want to delete "${folder.name}"? This will remove the folder from all tasks.`)) {
      deleteFolder(folder.id)
      onFolderDeleted()
    }
  }

  return (
    <Card className="cursor-pointer transition-all hover:shadow-md" onClick={() => onClick(folder.id)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FolderOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-sm">{folder.name}</h3>
              <p className="text-xs text-muted-foreground">
                {taskCount} {taskCount === 1 ? "task" : "tasks"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {taskCount}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
