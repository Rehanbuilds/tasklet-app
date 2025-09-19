"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Target, Calendar, FolderOpen } from "lucide-react"
import { NameCollectionDialog } from "@/components/name-collection-dialog"

interface OnboardingScreenProps {
  onComplete: () => void
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [showNameDialog, setShowNameDialog] = useState(false)

  const handleGetStarted = () => {
    setShowNameDialog(true)
  }

  const handleNameComplete = (name: string) => {
    setShowNameDialog(false)
    onComplete()
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="max-w-4xl w-full mx-auto">
          {/* Main Content */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 mb-12">
            {/* Illustration Section */}
            <div className="flex-1 max-w-md lg:max-w-lg">
              <div className="relative">
                {/* Modern Illustration */}
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-8 sm:p-12">
                  <div className="relative">
                    {/* Central Task Management Visual */}
                    <div className="bg-card rounded-2xl p-6 shadow-lg border border-border/50 mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        <div className="h-2 bg-muted rounded-full flex-1"></div>
                      </div>
                      <div className="flex items-center gap-3 mb-4">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <div className="h-2 bg-muted rounded-full flex-1"></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-accent rounded-full"></div>
                        <div className="h-2 bg-muted rounded-full flex-1"></div>
                      </div>
                    </div>

                    {/* Floating Elements */}
                    <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground rounded-full p-3 shadow-lg">
                      <Target className="w-5 h-5" />
                    </div>
                    <div className="absolute -bottom-4 -left-4 bg-accent text-accent-foreground rounded-full p-3 shadow-lg">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="absolute top-1/2 -right-8 bg-secondary text-secondary-foreground rounded-full p-2 shadow-lg">
                      <FolderOpen className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 text-center lg:text-left max-w-md lg:max-w-lg">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                Welcome to <span className="text-primary">Tasklet</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
                Your journey to effortless task management begins here. Stay organized, meet deadlines, and boost your
                productivity.
              </p>

              {/* Feature Highlights */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 justify-center lg:justify-start">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-muted-foreground">Organize tasks by folders</span>
                </div>
                <div className="flex items-center gap-3 justify-center lg:justify-start">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-muted-foreground">Never miss a deadline</span>
                </div>
                <div className="flex items-center gap-3 justify-center lg:justify-start">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span className="text-muted-foreground">Track your progress</span>
                </div>
              </div>

              <Button
                onClick={handleGetStarted}
                size="lg"
                className="w-full sm:w-auto px-8 py-3 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Get Started
              </Button>

              {/* No Signup Required */}
              <p className="text-sm text-muted-foreground mt-4">No signup required</p>
            </div>
          </div>

          {/* Bottom Decorative Elements */}
          <div className="flex justify-center items-center gap-2 opacity-50">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <div className="w-2 h-2 bg-secondary rounded-full"></div>
          </div>
        </div>
      </div>

      <NameCollectionDialog open={showNameDialog} onComplete={handleNameComplete} />
    </>
  )
}
