"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { User } from "lucide-react"

interface NameCollectionDialogProps {
  open: boolean
  onComplete: (name: string) => void
}

export function NameCollectionDialog({ open, onComplete }: NameCollectionDialogProps) {
  const [name, setName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      // Store the name in localStorage
      localStorage.setItem("tasklet_user_name", name.trim())
      onComplete(name.trim())
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-bold">What's your name?</DialogTitle>
          <DialogDescription className="text-base">Let's personalize your Tasklet experience</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Your Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-center text-lg py-3"
              autoFocus
              required
            />
          </div>

          <Button type="submit" className="w-full py-3 text-lg font-semibold" disabled={!name.trim()}>
            Next
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
