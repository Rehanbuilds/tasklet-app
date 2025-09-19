"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TaskCard } from "@/components/task-card"
import { EditTaskDialog } from "@/components/edit-task-dialog"
import { ChevronLeft, ChevronRight, Plus, TrendingUp, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { getTasks, getFolders, updateTask, type Task, type Folder } from "@/lib/storage"
import { AppHeader } from "@/components/app-header"

export function CalendarView() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  useEffect(() => {
    setTasks(getTasks())
    setFolders(getFolders())
  }, [])

  const refreshData = () => {
    setTasks(getTasks())
    setFolders(getFolders())
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

  const getFolderName = (folderId?: string) => {
    return folders.find((f) => f.id === folderId)?.name
  }

  // Calendar logic
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayOfWeek = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
    setSelectedDate(null)
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
    setSelectedDate(null)
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentDate(today)
    setSelectedDate(today)
  }

  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => task.dueDate.toDateString() === date.toDateString())
  }

  const getTasksForSelectedDate = () => {
    if (!selectedDate) return []
    return getTasksForDate(selectedDate).sort((a, b) => {
      if (a.status !== b.status) {
        return a.status === "Pending" ? -1 : 1
      }
      return a.dueDate.getTime() - b.dueDate.getTime()
    })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date: Date) => {
    return selectedDate?.toDateString() === date.toDateString()
  }

  // Progress analysis calculations
  const getMonthlyProgress = () => {
    const monthStart = new Date(year, month, 1)
    const monthEnd = new Date(year, month + 1, 0)

    const monthTasks = tasks.filter((task) => task.dueDate >= monthStart && task.dueDate <= monthEnd)

    const completedTasks = monthTasks.filter((task) => task.status === "Completed")
    const totalTasks = monthTasks.length
    const completionRate = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0

    return {
      total: totalTasks,
      completed: completedTasks.length,
      pending: totalTasks - completedTasks.length,
      completionRate: Math.round(completionRate),
    }
  }

  const getWeeklyProgress = () => {
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)

    const weekTasks = tasks.filter((task) => task.dueDate >= startOfWeek && task.dueDate <= endOfWeek)

    const completedTasks = weekTasks.filter((task) => task.status === "Completed")
    const completionRate = weekTasks.length > 0 ? (completedTasks.length / weekTasks.length) * 100 : 0

    return {
      total: weekTasks.length,
      completed: completedTasks.length,
      completionRate: Math.round(completionRate),
    }
  }

  const monthlyProgress = getMonthlyProgress()
  const weeklyProgress = getWeeklyProgress()

  // Generate calendar days
  const calendarDays = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(year, month, day))
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader
        title="Calendar"
        subtitle="View tasks and track progress"
        icon={<Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />}
      />

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Card className="border-2 border-primary/10">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Monthly Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-muted-foreground">Completion Rate</span>
                  <span className="text-xl sm:text-2xl font-bold text-primary">{monthlyProgress.completionRate}%</span>
                </div>
                <Progress value={monthlyProgress.completionRate} className="h-2" />
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">
                    {monthlyProgress.completed} of {monthlyProgress.total} tasks completed
                  </span>
                  <span className="text-primary font-medium">{monthlyProgress.pending} pending</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/10">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-muted-foreground">Weekly Progress</span>
                  <span className="text-xl sm:text-2xl font-bold text-primary">{weeklyProgress.completionRate}%</span>
                </div>
                <Progress value={weeklyProgress.completionRate} className="h-2" />
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">
                    {weeklyProgress.completed} of {weeklyProgress.total} completed
                  </span>
                  <span className="text-primary font-medium">
                    {weeklyProgress.total - weeklyProgress.completed} left
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <h2 className="text-xl sm:text-2xl font-semibold">
              {monthNames[month]} {year}
            </h2>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Calendar Grid */}
          <div className="xl:col-span-2">
            <Card>
              <CardContent className="p-2 sm:p-4">
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {dayNames.map((day) => (
                    <div
                      key={day}
                      className="p-1 sm:p-2 text-center text-xs sm:text-sm font-medium text-muted-foreground"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((date, index) => {
                    if (!date) {
                      return <div key={index} className="p-1 sm:p-2 h-10 sm:h-12" />
                    }

                    const dayTasks = getTasksForDate(date)
                    const pendingTasks = dayTasks.filter((t) => t.status === "Pending")

                    return (
                      <button
                        key={date.toISOString()}
                        onClick={() => setSelectedDate(date)}
                        className={cn(
                          "p-1 sm:p-2 h-10 sm:h-12 text-xs sm:text-sm rounded-lg transition-colors relative",
                          "hover:bg-muted",
                          isToday(date) && "bg-primary text-primary-foreground hover:bg-primary/90",
                          isSelected(date) && !isToday(date) && "bg-accent text-accent-foreground",
                          pendingTasks.length > 0 && !isToday(date) && !isSelected(date) && "bg-primary/10",
                        )}
                      >
                        <span className="block">{date.getDate()}</span>
                        {pendingTasks.length > 0 && (
                          <Badge
                            variant="secondary"
                            className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 p-0 text-xs flex items-center justify-center"
                          >
                            {pendingTasks.length}
                          </Badge>
                        )}
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Selected Date Tasks */}
          <div className="space-y-4">
            {selectedDate ? (
              <>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2">
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </h3>
                  {isToday(selectedDate) && (
                    <Badge variant="outline" className="mb-3">
                      Today
                    </Badge>
                  )}
                </div>

                <div className="space-y-3">
                  {getTasksForSelectedDate().length === 0 ? (
                    <div className="text-center py-6 sm:py-8 text-muted-foreground">
                      <p className="mb-2 text-sm sm:text-base">No tasks for this date</p>
                    </div>
                  ) : (
                    getTasksForSelectedDate().map((task) => (
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
                    ))
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-8 sm:py-12 text-muted-foreground">
                <div className="p-3 sm:p-4 bg-muted/50 rounded-lg inline-block mb-4">
                  <Plus className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <p className="text-sm sm:text-base">Select a date to view tasks</p>
              </div>
            )}
          </div>
        </div>
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
