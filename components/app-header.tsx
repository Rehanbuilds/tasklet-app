"use client"

import type React from "react"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/hooks/use-theme"

interface AppHeaderProps {
  title: string
  subtitle: string
  icon?: React.ReactNode
}

export function AppHeader({ title, subtitle, icon }: AppHeaderProps) {
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <div className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon && <div className="p-2 sm:p-3 bg-primary/10 rounded-full flex-shrink-0">{icon}</div>}
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-primary truncate">{title}</h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1 truncate">{subtitle}</p>
            </div>
          </div>

          <Button variant="ghost" size="sm" onClick={toggleTheme} className="flex-shrink-0 p-2">
            {isDarkMode ? <Sun className="h-5 w-5 text-primary" /> : <Moon className="h-5 w-5 text-primary" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
