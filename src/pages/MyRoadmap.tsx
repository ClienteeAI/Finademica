import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, Lock, Download } from "lucide-react";
import { useClient } from "@/lib/clientContext";

const phases = [
  {
    id: 1,
    title: "Getting Started",
    weeks: "Week 1-2",
    status: "active",
    progress: 10,
    steps: [
      { id: 1, title: "Create your account", completed: true },
      { id: 2, title: "Complete your profile", inProgress: true },
      { id: 3, title: 'Watch "Why Trade Forex?"', completed: false },
      { id: 4, title: 'Watch "Risk Management"', completed: false },
      { id: 5, title: "Take beginner quiz", completed: false },
    ],
  },
  {
    id: 2,
    title: "Building Foundation",
    weeks: "Week 3-4",
    status: "locked",
    progress: 0,
    steps: [
      { id: 1, title: 'Watch "Entry Timing"', completed: false },
      { id: 2, title: 'Watch "Chart Patterns"', completed: false },
      { id: 3, title: "Practice with demo account", completed: false },
      { id: 4, title: "Complete strategy assessment", completed: false },
    ],
  },
  {
    id: 3,
    title: "Developing Skills",
    weeks: "Week 5-6",
    status: "locked",
    progress: 0,
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
    status: "locked",
    progress: 0,
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
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - 10 / 100)}`}
                  className="text-primary transition-all duration-500"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-foreground">10%</span>
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
