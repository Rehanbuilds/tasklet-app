"use client"

import { Home, FolderOpen, Calendar, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

interface BottomNavigationProps {
  activeTab: "home" | "folders" | "calendar" | "settings"
  onTabChange: (tab: "home" | "folders" | "calendar" | "settings") => void
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: "home" as const, label: "Home", icon: Home },
    { id: "folders" as const, label: "Folders", icon: FolderOpen },
    { id: "calendar" as const, label: "Calendar", icon: Calendar },
    { id: "settings" as const, label: "Settings", icon: Settings },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg">
      <div className="flex items-center justify-around py-2">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
              activeTab === id
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
