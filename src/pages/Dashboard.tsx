import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Play, User, Settings, LogOut, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Dashboard = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(true);
  const [stockSymbol, setStockSymbol] = useState("");

  // Placeholder user data
  const userData = {
    name: "John Doe",
    progress: 15,
    profile: {
      experience: "I've researched but never traded",
      interests: "Stocks, Cryptocurrency",
      goal: "Generate extra income",
      concern: "Losing money / Risk management",
      timeAvailable: "4-6 hours (part-time)",
    },
  };

  // Placeholder video data
  const videos = [
    { id: 1, title: "Stock Trading 101 for Beginners", duration: "10 minutes", status: "completed" },
    { id: 2, title: "Risk Management Essentials", duration: "15 minutes", status: "in-progress" },
    { id: 3, title: "Understanding Market Psychology", duration: "12 minutes", status: "not-started" },
    { id: 4, title: "Technical Analysis Basics", duration: "18 minutes", status: "not-started" },
    { id: 5, title: "Building Your Trading Plan", duration: "20 minutes", status: "not-started" },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: "bg-green-500/20 text-green-400 border-green-500/50",
      "in-progress": "bg-blue-500/20 text-blue-400 border-blue-500/50",
      "not-started": "bg-muted text-muted-foreground border-border",
    };
    const labels = {
      completed: "Completed",
      "in-progress": "In Progress",
      "not-started": "Not Started",
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-dark-blue">
      {/* Top Navigation Bar */}
      <nav className="bg-primary/10 backdrop-blur-sm border-b border-primary/20 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="text-xl font-bold text-foreground">AI Trading Pro Academy</div>

            {/* Center Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
                Dashboard
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                My Videos
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Stock Analyzer
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                My Roadmap
              </a>
            </div>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Welcome back, {userData.name}!</h1>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Your Progress: {userData.progress}% Complete</span>
            </div>
            <Progress value={userData.progress} className="h-2" />
          </div>
          <p className="text-muted-foreground">Let's continue your trading journey</p>
        </div>

        {/* Trading Profile Section */}
        <Card>
          <Collapsible open={isProfileOpen} onOpenChange={setIsProfileOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-accent/5 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <span>📋</span> Your Trading Profile
                  </CardTitle>
                  <ChevronDown
                    className={`h-5 w-5 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
                  />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-3">
                <div className="grid gap-3">
                  <div>
                    <span className="font-medium text-foreground">Experience:</span>{" "}
                    <span className="text-muted-foreground">{userData.profile.experience}</span>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Interested in:</span>{" "}
                    <span className="text-muted-foreground">{userData.profile.interests}</span>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Main Goal:</span>{" "}
                    <span className="text-muted-foreground">{userData.profile.goal}</span>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Main Concern:</span>{" "}
                    <span className="text-muted-foreground">{userData.profile.concern}</span>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Time Available:</span>{" "}
                    <span className="text-muted-foreground">{userData.profile.timeAvailable}</span>
                  </div>
                </div>
                <Button variant="outline" className="mt-4">
                  Edit My Answers
                </Button>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Personalized Videos Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>🎥</span> Your Personalized Video Playlist
            </CardTitle>
            <CardDescription>Based on your answers, these are the most relevant videos for you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {videos.map((video) => (
                <Card key={video.id} className="overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <Play className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{video.title}</h3>
                      <p className="text-sm text-muted-foreground">⏱ {video.duration}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      {getStatusBadge(video.status)}
                      <Button size="sm">Watch Now</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Stock Analyzer Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>📊</span> AI Stock Analyzer
            </CardTitle>
            <CardDescription>Analyze any stock in real-time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter stock symbol (e.g., AAPL, TSLA)"
                value={stockSymbol}
                onChange={(e) => setStockSymbol(e.target.value)}
                className="flex-1"
              />
              <Button>
                <Search className="mr-2 h-4 w-4" />
                Analyze
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Get detailed analysis and chat with AI about any stock
            </p>
          </CardContent>
        </Card>

        {/* Roadmap Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>🗺️</span> Your Personalized Trading Roadmap
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">WEEK 1-2: Foundations</h3>
              <div className="space-y-2 ml-4">
                <div className="flex items-center gap-2 text-green-400">
                  <span className="text-lg">✓</span>
                  <span>Watch Stock Trading 101</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-lg">○</span>
                  <span>Watch Risk Management</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-lg">○</span>
                  <span>Make your first paper trade</span>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              View Full Roadmap
            </Button>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>📞</span> Ready for 1-on-1 Guidance?
            </CardTitle>
            <CardDescription>Book a free call with a trading specialist</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" size="lg">
              Book Your Call
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
