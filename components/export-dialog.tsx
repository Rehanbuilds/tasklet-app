"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Download, Share2 } from "lucide-react"
import { getTasks, getFolders } from "@/lib/storage"
import { exportTasksToCSV, exportTasksToJSON, downloadFile, shareTaskList } from "@/lib/export"

interface ExportDialogProps {
  children: React.ReactNode
}

export function ExportDialog({ children }: ExportDialogProps) {
  const [open, setOpen] = useState(false)
  const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv")
  const [includeCompleted, setIncludeCompleted] = useState(true)
  const [selectedFolder, setSelectedFolder] = useState<string>("all")

  const handleExport = () => {
    const allTasks = getTasks()
    const folders = getFolders()

    let tasksToExport = allTasks

    // Filter by folder
    if (selectedFolder !== "all") {
      tasksToExport = tasksToExport.filter((task) => task.folderId === selectedFolder)
    }

    // Filter by completion status
    if (!includeCompleted) {
      tasksToExport = tasksToExport.filter((task) => task.status === "Pending")
    }

    const timestamp = new Date().toISOString().split("T")[0]

    if (exportFormat === "csv") {
      const csvContent = exportTasksToCSV(tasksToExport, folders)
      downloadFile(csvContent, `tasklet-export-${timestamp}.csv`, "text/csv")
    } else {
      const jsonContent = exportTasksToJSON()
      downloadFile(jsonContent, `tasklet-export-${timestamp}.json`, "application/json")
    }

    setOpen(false)
  }

  const handleShare = async () => {
    const allTasks = getTasks()
    const folders = getFolders()

    let tasksToShare = allTasks

    if (selectedFolder !== "all") {
      tasksToShare = tasksToShare.filter((task) => task.folderId === selectedFolder)
    }

    if (!includeCompleted) {
      tasksToShare = tasksToShare.filter((task) => task.status === "Pending")
    }

    const shareText = shareTaskList(tasksToShare, folders)

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Task List",
          text: shareText,
        })
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareText)
        alert("Task list copied to clipboard!")
      }
    } else {
      navigator.clipboard.writeText(shareText)
      alert("Task list copied to clipboard!")
    }

    setOpen(false)
  }

  const folders = getFolders()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export & Share Tasks</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="export-format">Export Format</Label>
            <Select value={exportFormat} onValueChange={(value: "csv" | "json") => setExportFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV (Spreadsheet)</SelectItem>
                <SelectItem value="json">JSON (Backup)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {folders.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="folder-filter">Filter by Folder</Label>
              <Select value={selectedFolder} onValueChange={setSelectedFolder}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Folders</SelectItem>
                  {folders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox id="include-completed" checked={includeCompleted} onCheckedChange={setIncludeCompleted} />
            <Label htmlFor="include-completed">Include completed tasks</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleShare} variant="outline" className="flex-1 gap-2 bg-transparent">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button onClick={handleExport} className="flex-1 gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
