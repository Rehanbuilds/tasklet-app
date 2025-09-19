"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { updateTask, deleteTask, type Task, type Folder } from "@/lib/storage"

interface EditTaskDialogProps {
  task: Task | null
  folders: Folder[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onTaskUpdated: () => void
}

export function EditTaskDialog({ task, folders, open, onOpenChange, onTaskUpdated }: EditTaskDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState<Date>()
  const [folderId, setFolderId] = useState<string>()
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium")

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description)
      setDueDate(task.dueDate)
      setFolderId(task.folderId || "")
      setPriority(task.priority)
    }
  }, [task])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!task || !title.trim() || !dueDate) return

    updateTask(task.id, {
      title: title.trim(),
      description: description.trim(),
      dueDate,
      folderId: folderId || undefined,
      priority,
    })

    onOpenChange(false)
    onTaskUpdated()
  }

  const handleDelete = () => {
    if (!task) return

    if (confirm("Are you sure you want to delete this task?")) {
      deleteTask(task.id)
      onOpenChange(false)
      onTaskUpdated()
    }
  }

  if (!task) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title *</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description (optional)"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Due Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-priority">Priority</Label>
              <Select value={priority} onValueChange={(value: "Low" | "Medium" | "High") => setPriority(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {folders.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="edit-folder">Folder</Label>
              <Select value={folderId} onValueChange={setFolderId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a folder (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No folder</SelectItem>
                  {folders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button type="button" variant="destructive" size="sm" onClick={handleDelete} className="gap-2">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!title.trim() || !dueDate}>
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
