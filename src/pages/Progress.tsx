import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Video, Clock, TrendingUp, Lock } from "lucide-react";
import { useClient } from "@/lib/clientContext";

const achievements = [
  {
    id: 1,
    title: "First Steps",
    description: "Create your account",
    icon: "🎓",
    unlocked: true,
  },
  {
    id: 2,
    title: "Video Viewer",
    description: "Watch your first video",
    icon: "🎥",
    unlocked: false,
  },
  {
    id: 3,
    title: "Knowledge Seeker",
    description: "Watch 5 videos",
    icon: "📚",
    unlocked: false,
  },
  {
    id: 4,
    title: "Speed Learner",
    description: "Complete a module in 1 week",
    icon: "⚡",
    unlocked: false,
  },
  {
    id: 5,
    title: "Streak Master",
    description: "Maintain a 7-day learning streak",
    icon: "🔥",
    unlocked: false,
  },
  {
    id: 6,
    title: "Graduate",
    description: "Complete all videos",
    icon: "🏆",
    unlocked: false,
  },
];

const stats = [
  { label: "Videos Watched", value: "0", icon: Video },
  { label: "Total Watch Time", value: "0h 0m", icon: Clock },
  { label: "Completion Rate", value: "0%", icon: TrendingUp },
  { label: "Average Session", value: "0 min", icon: Clock },
];

const Progress = () => {
  const navigate = useNavigate();
  const { client } = useClient();
  const isNasrTheme = client?.subdomain === 'nasr';

  // ACCESS CONTROL: Must be logged in AND have completed quiz
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const quizCompleted = localStorage.getItem("quizCompleted");
    if (!isLoggedIn || !quizCompleted) {
      navigate("/");
    }
  }, [navigate]);
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
            <source src="/nasr-progress-background.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-nasr-bg/70 via-nasr-bg/85 to-nasr-bg" />
        </div>
      )}
      
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Your Progress</h1>
          <p className="text-muted-foreground">Track your learning journey</p>
        </div>

        {/* Overall Progress */}
        <Card className="p-8 text-center space-y-4 bg-gradient-to-br from-primary/10 to-purple/10">
          <div className="relative w-40 h-40 mx-auto">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 70}`}
                strokeDashoffset={`${2 * Math.PI * 70 * (1 - 0 / 100)}`}
                className="text-primary transition-all duration-500"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold text-foreground">0%</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">You're just getting started!</h2>
            <p className="text-muted-foreground">Complete your first video to begin your journey</p>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-6 text-center space-y-2">
              <stat.icon className="h-8 w-8 mx-auto text-primary" />
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Achievements */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            Achievements
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={`p-6 text-center space-y-3 ${
                  achievement.unlocked
                    ? "bg-gradient-to-br from-primary/20 to-purple/20 border-primary/50"
                    : "opacity-50 grayscale"
                }`}
              >
                <div className="text-4xl">{achievement.icon}</div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-sm text-foreground">{achievement.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {achievement.description}
                  </p>
                </div>
                {achievement.unlocked ? (
                  <Badge className="bg-success text-white">Unlocked</Badge>
                ) : (
                  <Badge variant="outline" className="gap-1">
                    <Lock className="h-3 w-3" />
                    Locked
                  </Badge>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Watch History */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Video className="h-6 w-6 text-primary" />
            Watch History
          </h2>
          <Card className="p-12 text-center space-y-4">
            <Video className="h-16 w-16 text-muted-foreground mx-auto" />
            <div>
              <p className="text-lg font-semibold text-foreground">No videos watched yet</p>
              <p className="text-muted-foreground">Start learning to see your history here</p>
            </div>
          </Card>
        </div>

        {/* Learning Streak Calendar */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            🔥 Learning Streak
          </h2>
          <Card className="p-6">
            <div className="text-center space-y-4">
              <div>
                <p className="text-4xl font-bold text-foreground">0</p>
                <p className="text-muted-foreground">Day Streak</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Log in and watch videos daily to build your streak!
              </p>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Progress;
