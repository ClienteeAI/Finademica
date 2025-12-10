import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, Lock, Download } from "lucide-react";
import { useClient } from "@/lib/clientContext";
import { supabase } from "@/integrations/supabase/client";

interface RoadmapStep {
  id: number;
  title: string;
  videoTitle?: string; // matches videos.title in Supabase
  completed: boolean;
  inProgress?: boolean;
}

interface RoadmapPhase {
  id: number;
  title: string;
  weeks: string;
  status: "active" | "locked" | "completed";
  progress: number;
  steps: RoadmapStep[];
}

// Base roadmap structure with video titles that match Supabase videos.title
const basePhases: Omit<RoadmapPhase, "status" | "progress">[] = [
  {
    id: 1,
    title: "Getting Started",
    weeks: "Week 1-2",
    steps: [
      { id: 1, title: "Create your account", completed: true },
      { id: 2, title: "Complete your profile", completed: true },
      { id: 3, title: 'Watch "Why Trade Forex?"', videoTitle: "Why Trade Forex?", completed: false },
      { id: 4, title: 'Watch "Risk Management"', videoTitle: "Risk Management", completed: false },
      { id: 5, title: "Take beginner quiz", completed: false },
    ],
  },
  {
    id: 2,
    title: "Building Foundation",
    weeks: "Week 3-4",
    steps: [
      { id: 1, title: 'Watch "Entry Timing"', videoTitle: "Entry Timing", completed: false },
      { id: 2, title: 'Watch "Chart Patterns"', videoTitle: "Chart Patterns", completed: false },
      { id: 3, title: "Practice with demo account", completed: false },
      { id: 4, title: "Complete strategy assessment", completed: false },
    ],
  },
  {
    id: 3,
    title: "Developing Skills",
    weeks: "Week 5-6",
    steps: [
      { id: 1, title: "Advanced technical analysis", completed: false },
      { id: 2, title: "Position sizing strategies", completed: false },
      { id: 3, title: "Trading psychology", completed: false },
      { id: 4, title: "Live trading practice", completed: false },
    ],
  },
  {
    id: 4,
    title: "Advanced Trading",
    weeks: "Week 7-8",
    steps: [
      { id: 1, title: "Develop your trading plan", completed: false },
      { id: 2, title: "Advanced risk management", completed: false },
      { id: 3, title: "Portfolio optimization", completed: false },
      { id: 4, title: "Final assessment", completed: false },
    ],
  },
];
const MyRoadmap = () => {
  const { client } = useClient();
  const isNasrTheme = client?.subdomain === 'nasr';
  const [phases, setPhases] = useState<RoadmapPhase[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    const fetchCompletedVideos = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        // No user, just show base phases with default status
        const defaultPhases = basePhases.map((phase, index) => ({
          ...phase,
          status: index === 0 ? "active" as const : "locked" as const,
          progress: index === 0 ? 20 : 0, // Account and profile completed
        }));
        setPhases(defaultPhases);
        setOverallProgress(5);
        return;
      }

      try {
        // Fetch completed video views for this user
        const { data: videoViews, error: viewsError } = await supabase
          .from("video_views")
          .select("video_id")
          .eq("user_id", userId)
          .eq("status", "completed");

        if (viewsError) {
          console.error("Error fetching video views:", viewsError);
        }

        // Fetch all videos to match by title
        const { data: videos, error: videosError } = await supabase
          .from("videos")
          .select("id, title");

        if (videosError) {
          console.error("Error fetching videos:", videosError);
        }

        // Create a set of completed video titles
        const completedVideoIds = new Set(videoViews?.map(v => v.video_id) || []);
        const videoTitleMap = new Map(videos?.map(v => [v.title, v.id]) || []);

        // Update phases with completion status
        let totalSteps = 0;
        let completedSteps = 0;

        const updatedPhases: RoadmapPhase[] = basePhases.map((phase, phaseIndex) => {
          const updatedSteps = phase.steps.map(step => {
            totalSteps++;
            let isCompleted = step.completed; // Keep pre-completed items (account, profile)

            // Check if this step has an associated video and if it's been watched
            if (step.videoTitle) {
              const videoId = videoTitleMap.get(step.videoTitle);
              if (videoId && completedVideoIds.has(videoId)) {
                isCompleted = true;
              }
            }

            if (isCompleted) completedSteps++;
            return { ...step, completed: isCompleted };
          });

          const completedInPhase = updatedSteps.filter(s => s.completed).length;
          const phaseProgress = Math.round((completedInPhase / updatedSteps.length) * 100);

          // Determine phase status
          let status: "active" | "locked" | "completed" = "locked";
          if (phaseProgress === 100) {
            status = "completed";
          } else if (phaseIndex === 0) {
            status = "active";
          } else {
            // Check if previous phase is complete
            const prevPhaseSteps = basePhases[phaseIndex - 1].steps;
            const prevPhaseComplete = prevPhaseSteps.every(s => {
              if (s.completed) return true;
              if (s.videoTitle) {
                const videoId = videoTitleMap.get(s.videoTitle);
                return videoId && completedVideoIds.has(videoId);
              }
              return false;
            });
            if (prevPhaseComplete) status = "active";
          }

          // Find first incomplete step and mark as inProgress
          const firstIncomplete = updatedSteps.findIndex(s => !s.completed);
          if (status === "active" && firstIncomplete !== -1) {
            updatedSteps[firstIncomplete].inProgress = true;
          }

          return {
            ...phase,
            steps: updatedSteps,
            progress: phaseProgress,
            status,
          };
        });

        setPhases(updatedPhases);
        setOverallProgress(Math.round((completedSteps / totalSteps) * 100));
      } catch (error) {
        console.error("Error loading roadmap data:", error);
      }
    };

    fetchCompletedVideos();
  }, []);

  return (
    <DashboardLayout>
      {/* Nasr Trade Academy Video Background */}
      {isNasrTheme && (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute w-full h-full object-cover opacity-30"
          >
            <source src="/nasr-roadmap-background.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-nasr-bg/70 via-nasr-bg/85 to-nasr-bg" />
        </div>
      )}
      
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in relative z-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Your Personalized Trading Roadmap
          </h1>
          <p className="text-muted-foreground">Follow this step-by-step path to success</p>

          {/* Overall Progress */}
          <Card className="p-6 inline-flex flex-col items-center gap-4 bg-gradient-to-br from-primary/10 to-purple/10">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - overallProgress / 100)}`}
                  className="text-primary transition-all duration-500"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-foreground">{overallProgress}%</span>
              </div>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Overall Progress</p>
          </Card>
        </div>

        {/* Timeline */}
        <div className="space-y-6">
          {phases.map((phase, index) => (
            <Card
              key={phase.id}
              className={`p-6 ${
                phase.status === "locked"
                  ? "opacity-60"
                  : "border-primary/50 bg-gradient-to-br from-card to-primary/5"
              }`}
            >
              {/* Phase Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-foreground">
                      Phase {phase.id}: {phase.title}
                    </h2>
                    {phase.status === "active" && (
                      <span className="px-2 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded-full">
                        Active
                      </span>
                    )}
                    {phase.status === "locked" && (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{phase.weeks}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">{phase.progress}%</p>
                  <p className="text-xs text-muted-foreground">Complete</p>
                </div>
              </div>

              {/* Progress Bar */}
              <Progress value={phase.progress} className="h-2 mb-6" />

              {/* Steps */}
              <div className="space-y-3">
                {phase.steps.map((step) => (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      phase.status === "locked"
                        ? "bg-muted/30"
                        : step.completed
                        ? "bg-success/10"
                        : step.inProgress
                        ? "bg-primary/10"
                        : "bg-muted/50"
                    }`}
                  >
                    {phase.status === "locked" ? (
                      <Lock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    ) : step.completed ? (
                      <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                    ) : step.inProgress ? (
                      <Clock className="h-5 w-5 text-primary flex-shrink-0 animate-pulse" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-muted-foreground flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        step.completed
                          ? "text-success font-medium"
                          : step.inProgress
                          ? "text-primary font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>

              {/* Phase Footer */}
              {phase.status === "locked" && (
                <p className="mt-4 text-sm text-muted-foreground text-center">
                  🔒 Complete Phase {phase.id - 1} to unlock
                </p>
              )}
            </Card>
          ))}
        </div>

        {/* Download Button */}
        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            disabled
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Download Roadmap PDF
          </Button>
          <p className="text-xs text-muted-foreground mt-2">Coming soon</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyRoadmap;
