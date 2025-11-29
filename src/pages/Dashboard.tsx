import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Video, Clock, TrendingUp, Trophy, ChevronDown, ChevronUp, Play } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const placeholderVideos = [
  {
    id: "1",
    title: "Why Trade Forex?",
    category: "Getting Started",
    categoryColor: "bg-blue-500",
    duration: "7 minutes",
    progress: 0,
    status: "Not Started",
  },
  {
    id: "2",
    title: "Timing Your Entries",
    category: "Trading Strategies",
    categoryColor: "bg-purple-500",
    duration: "8 minutes",
    progress: 0,
    status: "Not Started",
  },
  {
    id: "3",
    title: "Risk and Position Management",
    category: "Risk Management",
    categoryColor: "bg-red-500",
    duration: "15 minutes",
    progress: 0,
    status: "Not Started",
  },
  {
    id: "4",
    title: "Double Top & Double Bottom Patterns",
    category: "Technical Analysis",
    categoryColor: "bg-green-500",
    duration: "7 minutes",
    progress: 0,
    status: "Not Started",
  },
  {
    id: "5",
    title: "Small Cap Trading",
    category: "Trading Strategies",
    categoryColor: "bg-purple-500",
    duration: "9 minutes",
    progress: 0,
    status: "Not Started",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<any>(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/");
      return;
    }

    const data = localStorage.getItem("userData");
    if (data) {
      setUserData(JSON.parse(data));
    }

    const quiz = localStorage.getItem("quizAnswers");
    if (quiz) {
      setQuizAnswers(JSON.parse(quiz));
    }
  }, [navigate]);

  if (!userData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const getQuizLabel = (value: string, type: string) => {
    const labels: Record<string, Record<string, string>> = {
      experience: {
        beginner: "🌱 Complete beginner",
        researched: "📚 Researched but never traded",
        "few-trades": "📈 Made a few trades",
        regular: "💼 Trade regularly",
      },
      goal: {
        "extra-income": "💰 Generate extra income",
        "replace-income": "🚀 Replace full-time income",
        wealth: "🏦 Build long-term wealth",
        hobby: "🎓 Learn as a hobby",
      },
      concern: {
        "losing-money": "😰 Losing money / Risk management",
        understanding: "🤔 Not understanding how it works",
        time: "⏰ Not having enough time",
        decisions: "🎯 Making bad decisions / Psychology",
        capital: "💸 Don't have enough capital",
      },
      timeCommitment: {
        "1-3": "⏱️ 1-3 hours (casual)",
        "4-6": "📅 4-6 hours (part-time)",
        "7-10": "💪 7-10 hours (serious commitment)",
        "10+": "🔥 10+ hours (full-time focus)",
      },
    };
    return labels[type]?.[value] || value;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-slide-up">
        {/* Welcome Header */}
        <div className="space-y-4 p-8 rounded-2xl glass-card border-primary/20">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-neon-purple bg-clip-text text-transparent animate-gradient">
            Welcome back, {userData.firstName}!
          </h1>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Your Progress</span>
              <span className="text-sm font-semibold text-primary animate-glow">0% Complete</span>
            </div>
            <Progress value={0} className="h-4" />
          </div>
          <p className="text-muted-foreground text-lg">Let's continue your trading journey</p>
          <div className="flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-primary/10 border border-primary/20 w-fit">
            <span className="text-2xl">🔥</span>
            <span className="text-foreground font-medium">
              0 day streak - Start watching to build your streak!
            </span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-6 space-y-3 glass-card-hover group">
            <Video className="h-10 w-10 text-primary group-hover:animate-glow transition-all" />
            <p className="text-3xl font-bold bg-gradient-to-br from-foreground to-primary bg-clip-text text-transparent">
              0 / {placeholderVideos.length}
            </p>
            <p className="text-sm text-muted-foreground font-medium">Videos Watched</p>
          </Card>

          <Card className="p-6 space-y-3 glass-card-hover group">
            <Clock className="h-10 w-10 text-neon-purple group-hover:animate-glow transition-all" />
            <p className="text-3xl font-bold bg-gradient-to-br from-foreground to-neon-purple bg-clip-text text-transparent">
              0h 0m
            </p>
            <p className="text-sm text-muted-foreground font-medium">Total Watch Time</p>
          </Card>

          <Card className="p-6 space-y-3 glass-card-hover group">
            <TrendingUp className="h-10 w-10 text-neon-cyan group-hover:animate-glow transition-all" />
            <p className="text-3xl font-bold bg-gradient-to-br from-foreground to-neon-cyan bg-clip-text text-transparent">
              0%
            </p>
            <p className="text-sm text-muted-foreground font-medium">Progress</p>
          </Card>

          <Card className="p-6 space-y-3 glass-card-hover group">
            <Trophy className="h-10 w-10 text-gradient-pink group-hover:animate-glow transition-all" />
            <p className="text-3xl font-bold bg-gradient-to-br from-foreground to-gradient-pink bg-clip-text text-transparent">
              0
            </p>
            <p className="text-sm text-muted-foreground font-medium">Achievements</p>
          </Card>
        </div>

        {/* Trading Profile */}
        {quizAnswers && (
          <Collapsible open={profileOpen} onOpenChange={setProfileOpen}>
            <Card className="overflow-hidden glass-card border-primary/20">
              <CollapsibleTrigger asChild>
                <button className="w-full p-6 flex items-center justify-between hover:bg-primary/5 transition-all duration-300">
                  <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    📋 Your Trading Profile
                  </h2>
                  {profileOpen ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-6 pb-6 space-y-4">
                  <div className="grid gap-3">
                    <div className="flex items-start gap-2">
                      <span className="font-medium text-foreground min-w-[140px]">Experience:</span>
                      <span className="text-muted-foreground">
                        {getQuizLabel(quizAnswers.experience, "experience")}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium text-foreground min-w-[140px]">Interested in:</span>
                      <span className="text-muted-foreground">
                        {quizAnswers.markets?.join(", ") || "Not specified"}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium text-foreground min-w-[140px]">Primary Goal:</span>
                      <span className="text-muted-foreground">
                        {getQuizLabel(quizAnswers.goal, "goal")}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium text-foreground min-w-[140px]">Main Concern:</span>
                      <span className="text-muted-foreground">
                        {getQuizLabel(quizAnswers.concern, "concern")}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium text-foreground min-w-[140px]">Time Available:</span>
                      <span className="text-muted-foreground">
                        {getQuizLabel(quizAnswers.timeCommitment, "timeCommitment")}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => console.log("Edit clicked")}
                  >
                    Edit My Answers
                  </Button>
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        )}

        {/* Personalized Video Playlist */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground via-primary to-neon-purple bg-clip-text text-transparent">
              🎥 Your Personalized Learning Path
            </h2>
            <p className="text-muted-foreground text-lg">Based on your answers, these videos are perfect for you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {placeholderVideos.map((video, index) => (
              <Card
                key={video.id}
                className="overflow-hidden glass-card-hover border-primary/30 cursor-pointer group"
                onClick={() => navigate(`/video/${video.id}`)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative aspect-video bg-gradient-to-br from-primary/20 via-neon-purple/20 to-neon-cyan/20 flex items-center justify-center overflow-hidden group-hover:from-primary/30 group-hover:via-neon-purple/30 group-hover:to-neon-cyan/30 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Play className="h-16 w-16 text-primary group-hover:scale-125 group-hover:text-neon-purple transition-all duration-500 drop-shadow-lg relative z-10" />
                </div>
                <div className="p-5 space-y-3">
                  <h3 className="font-bold text-foreground text-lg line-clamp-2 group-hover:text-primary transition-colors">{video.title}</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={`${video.categoryColor} text-white backdrop-blur-sm`}>{video.category}</Badge>
                    <span className="text-sm text-muted-foreground font-medium">⏱ {video.duration}</span>
                  </div>
                  {video.progress > 0 && (
                    <div className="space-y-1">
                      <Progress value={video.progress} className="h-1" />
                      <p className="text-xs text-muted-foreground">{video.progress}% complete</p>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">{video.status}</Badge>
                    <Button size="sm">Watch Now</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Learning Roadmap Preview */}
        <Card className="p-8 space-y-6 glass-card border-primary/20">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground via-neon-cyan to-primary bg-clip-text text-transparent">
              🗺️ Your Personalized Roadmap
            </h2>
            <p className="text-muted-foreground text-lg">Follow this path to reach your trading goals</p>
          </div>

          <div className="space-y-3">
            <div className="border-l-4 border-primary pl-4 py-2">
              <h3 className="font-semibold text-foreground mb-2">WEEK 1-2: FOUNDATIONS</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-success">
                  <span>✅</span>
                  <span>Create account (completed)</span>
                </div>
                <div className="flex items-center gap-2 text-primary">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  <span>Watch first video (current)</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>⬜</span>
                  <span>Complete beginner module</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>⬜</span>
                  <span>Take first quiz</span>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-muted pl-4 py-2 opacity-50">
              <h3 className="font-semibold text-foreground mb-2">WEEK 3-4: BUILDING SKILLS</h3>
              <p className="text-sm text-muted-foreground">🔒 Locked - Complete Week 1-2 first</p>
            </div>
          </div>

          <Button onClick={() => navigate("/roadmap")} className="w-full">
            View Full Roadmap
          </Button>
        </Card>

        {/* Stock Analyzer Teaser */}
        <Card className="p-8 space-y-6 glass-card border-neon-cyan/30 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-neon-purple/10 to-neon-cyan/10 opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
          <div className="relative z-10 text-center space-y-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-neon-cyan bg-clip-text text-transparent">
              📊 AI Stock Analyzer
            </h2>
            <p className="text-muted-foreground text-lg">Analyze any stock in real-time</p>
          </div>

          <div className="relative z-10">
            <Input 
              placeholder="Enter stock symbol (e.g., AAPL, TSLA)" 
              disabled 
              className="bg-background/50 backdrop-blur-sm border-primary/30"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 relative z-10">
            <Button disabled className="flex-1">Analyze</Button>
            <Button onClick={() => navigate("/analyzer")} variant="outline" className="flex-1">
              Go to Analyzer →
            </Button>
          </div>
        </Card>

        {/* CTA */}
        <Card className="p-12 text-center space-y-6 glass-card border-gradient-pink/30 relative overflow-hidden group animate-glow-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-neon-purple/20 to-gradient-pink/20 opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
          <div className="relative z-10 space-y-3">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-foreground via-primary to-gradient-pink bg-clip-text text-transparent">
              📞 Ready for 1-on-1 Guidance?
            </h2>
            <p className="text-muted-foreground text-lg">Book a free call with a trading specialist</p>
          </div>
          <Button
            size="lg"
            onClick={() => console.log("Book call clicked")}
            className="bg-gradient-to-r from-primary via-neon-purple to-gradient-pink text-lg px-8 py-6 h-auto relative z-10 hover:scale-105 transition-transform duration-300"
          >
            Book Your Call
          </Button>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
