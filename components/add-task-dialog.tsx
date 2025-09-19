"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { addTask, type Folder } from "@/lib/storage"

interface AddTaskDialogProps {
  folders: Folder[]
  onTaskAdded: () => void
  children?: React.ReactNode // Added children prop to fix black screen issue
}

export function AddTaskDialog({ folders, onTaskAdded, children }: AddTaskDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState<Date>()
  const [reminderTime, setReminderTime] = useState<Date>()
  const [folderId, setFolderId] = useState<string | null>(null)
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !dueDate) return

    addTask({
      title: title.trim(),
      description: description.trim(),
      dueDate,
      reminderTime,
      folderId,
      priority,
      status: "Pending",
    })

    // Reset form
    setTitle("")
    setDescription("")
    setDueDate(undefined)
    setReminderTime(undefined)
    setFolderId(null)
    setPriority("Medium")
    setOpen(false)
    onTaskAdded()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description (optional)"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Due Date *</Label>
              <Popover modal={true}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 z-[9999]"
                  align="start"
                  side="bottom"
                  sideOffset={4}
                  avoidCollisions={true}
                  collisionPadding={10}
                >
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    className="rounded-md border shadow-lg bg-popover"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
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
              <Label htmlFor="folder">Folder</Label>
              <Select value={folderId || "none"} onValueChange={setFolderId}>
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

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || !dueDate} className="w-full sm:w-auto">
              Add Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
