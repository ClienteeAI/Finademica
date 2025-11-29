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
      <div className="space-y-8 animate-fade-in">
        {/* Welcome Header */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Welcome back, {userData.firstName}!
          </h1>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Your Progress</span>
              <span className="text-sm font-semibold text-primary">0% Complete</span>
            </div>
            <Progress value={0} className="h-3" />
          </div>
          <p className="text-muted-foreground">Let's continue your trading journey</p>
          <div className="flex items-center gap-2 text-sm">
            <span>🔥</span>
            <span className="text-muted-foreground">
              0 day streak - Start watching to build your streak!
            </span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-6 space-y-2 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <Video className="h-8 w-8 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">0 / {placeholderVideos.length}</p>
            <p className="text-sm text-muted-foreground">Videos Watched</p>
          </Card>

          <Card className="p-6 space-y-2 hover:shadow-lg transition-shadow">
            <Clock className="h-8 w-8 text-primary" />
            <p className="text-2xl font-bold text-foreground">0h 0m</p>
            <p className="text-sm text-muted-foreground">Total Watch Time</p>
          </Card>

          <Card className="p-6 space-y-2 hover:shadow-lg transition-shadow">
            <TrendingUp className="h-8 w-8 text-primary" />
            <p className="text-2xl font-bold text-foreground">0%</p>
            <p className="text-sm text-muted-foreground">Progress</p>
          </Card>

          <Card className="p-6 space-y-2 hover:shadow-lg transition-shadow">
            <Trophy className="h-8 w-8 text-primary" />
            <p className="text-2xl font-bold text-foreground">0</p>
            <p className="text-sm text-muted-foreground">Achievements</p>
          </Card>
        </div>

        {/* Trading Profile */}
        {quizAnswers && (
          <Collapsible open={profileOpen} onOpenChange={setProfileOpen}>
            <Card className="overflow-hidden">
              <CollapsibleTrigger asChild>
                <button className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
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
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">🎥 Your Personalized Learning Path</h2>
            <p className="text-muted-foreground">Based on your answers, these videos are perfect for you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {placeholderVideos.map((video) => (
              <Card
                key={video.id}
                className="overflow-hidden hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
                onClick={() => navigate(`/video/${video.id}`)}
              >
                <div className="relative aspect-video bg-muted flex items-center justify-center">
                  <Play className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-foreground line-clamp-2">{video.title}</h3>
                  <div className="flex items-center gap-2">
                    <Badge className={`${video.categoryColor} text-white`}>{video.category}</Badge>
                    <span className="text-sm text-muted-foreground">⏱ {video.duration}</span>
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
        <Card className="p-6 space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">🗺️ Your Personalized Roadmap</h2>
            <p className="text-muted-foreground">Follow this path to reach your trading goals</p>
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
        <Card className="p-6 space-y-4 bg-gradient-to-br from-primary/10 to-purple/10">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">📊 AI Stock Analyzer</h2>
            <p className="text-muted-foreground">Analyze any stock in real-time</p>
          </div>

          <Input placeholder="Enter stock symbol (e.g., AAPL, TSLA)" disabled />
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button disabled className="flex-1">Analyze</Button>
            <Button onClick={() => navigate("/analyzer")} variant="outline" className="flex-1">
              Go to Analyzer →
            </Button>
          </div>
        </Card>

        {/* CTA */}
        <Card className="p-8 text-center space-y-4 bg-gradient-to-r from-primary/20 to-purple/20">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">📞 Ready for 1-on-1 Guidance?</h2>
            <p className="text-muted-foreground">Book a free call with a trading specialist</p>
          </div>
          <Button
            size="lg"
            onClick={() => console.log("Book call clicked")}
            className="bg-gradient-to-r from-primary to-purple hover:opacity-90"
          >
            Book Your Call
          </Button>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
