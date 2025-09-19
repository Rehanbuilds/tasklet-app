"use client"

import { useState, useEffect } from "react"

export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("tasklet-theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const shouldUseDark = savedTheme === "dark" || (!savedTheme && prefersDark)

    setIsDarkMode(shouldUseDark)
    document.documentElement.classList.toggle("dark", shouldUseDark)
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    localStorage.setItem("tasklet-theme", newTheme ? "dark" : "light")
    document.documentElement.classList.toggle("dark", newTheme)
  }

  return {
    isDarkMode,
    toggleTheme,
    mounted,
  }
}
