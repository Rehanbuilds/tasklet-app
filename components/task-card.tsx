"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface TaskCardProps {
  id: string
  title: string
  description?: string
  dueDate: Date
  priority: "Low" | "Medium" | "High"
  folderName?: string
  completed: boolean
  onToggleComplete: (id: string) => void
  onClick: (id: string) => void
}

export function TaskCard({
  id,
  title,
  description,
  dueDate,
  priority,
  folderName,
  completed,
  onToggleComplete,
  onClick,
}: TaskCardProps) {
  const isOverdue = dueDate < new Date() && !completed
  const isToday = dueDate.toDateString() === new Date().toDateString()

  const priorityColors = {
    Low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    High: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  }

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        completed && "opacity-60",
        isOverdue && "border-destructive",
      )}
      onClick={() => onClick(id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={completed}
            onCheckedChange={() => onToggleComplete(id)}
            onClick={(e) => e.stopPropagation()}
            className="mt-1 border-2 border-purple-500 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
          />
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3
                className={cn("font-medium text-sm leading-tight", completed && "line-through text-muted-foreground")}
              >
                {title}
              </h3>
              <Badge variant="secondary" className={cn("text-xs", priorityColors[priority])}>
                {priority}
              </Badge>
            </div>

            {description && <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>}

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span
                  className={cn(isOverdue && "text-destructive font-medium", isToday && "text-primary font-medium")}
                >
                  {dueDate.toLocaleDateString()}
                </span>
              </div>

              {folderName && (
                <Badge variant="outline" className="text-xs">
                  {folderName}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
