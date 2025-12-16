import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Video, Clock, TrendingUp, Trophy, ChevronDown, ChevronUp, Play, Phone, CheckCircle, Lock } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useClient } from "@/lib/clientContext";
import { GamificationSection } from "@/components/GamificationSection";
import { UserProgressCard } from "@/components/UserProgressCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface VideoData {
  id: string;
  title: string;
  category: string | null;
  duration_seconds: number | null;
  thumbnail_url: string | null;
}

interface RecommendedVideo {
  id: string;
  priority: number | null;
  tier: string | null;
  reason: string | null;
  video_id: string | null;
  video: VideoData | null;
}

const categoryVariantMap: Record<string, "info" | "purple" | "destructive" | "success"> = {
  "Getting Started": "info",
  "Trading Strategies": "purple",
  "Risk Management": "destructive",
  "Technical Analysis": "success",
};

const formatDuration = (seconds: number | null): string => {
  if (!seconds) return "Unknown";
  const minutes = Math.floor(seconds / 60);
  return `${minutes} min`;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { client, isAdminMode } = useClient();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<any>(null);
  const [freeVideos, setFreeVideos] = useState<RecommendedVideo[]>([]);
  const [lockedVideos, setLockedVideos] = useState<RecommendedVideo[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [completedVideoIds, setCompletedVideoIds] = useState<Set<string>>(new Set());

  // Theme detection
  const isNasrTheme = client?.subdomain === 'nasr';
  
  // Theme-aware color classes
  const themeColors = {
    heading: isNasrTheme ? 'text-nasr-text font-playfair' : 'text-ocean',
    subtext: isNasrTheme ? 'text-nasr-text-muted' : 'text-ocean-muted',
    primary: isNasrTheme ? 'text-gold' : 'text-aqua',
    primaryBg: isNasrTheme ? 'bg-gold' : 'bg-aqua',
    cardBorder: isNasrTheme ? 'border-gold/20' : 'border-ice',
    accentGlow: isNasrTheme ? 'shadow-gold' : 'shadow-aqua',
    progressBar: isNasrTheme ? 'from-gold-light to-gold' : 'from-aqua to-aqua-light',
    badge: isNasrTheme ? 'bg-gold/10 border-gold/30 text-gold' : 'bg-aqua/10 border-aqua/30 text-aqua',
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const quizCompleted = localStorage.getItem("quizCompleted");
    
    // ACCESS CONTROL: Must be logged in AND have completed quiz
    if (!isLoggedIn || !quizCompleted) {
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

    // Fetch AI-recommended videos from Supabase
    const fetchRecommendedVideos = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setVideosLoading(false);
        return;
      }

      // First, fetch recommendations
      const { data: recommendations, error: recError } = await supabase
        .from("user_video_recommendations")
        .select("id, priority, tier, reason, video_id")
        .eq("user_id", userId)
        .order("priority", { ascending: true });

      if (recError) {
        console.error("Error fetching recommendations:", recError);
        setVideosLoading(false);
        return;
      }

      if (!recommendations || recommendations.length === 0) {
        setVideosLoading(false);
        return;
      }

      // Get unique video IDs (filter out nulls)
      const videoIds = recommendations
        .map(r => r.video_id)
        .filter((id): id is string => id !== null);

      // Fetch video details
      const { data: videos, error: vidError } = await supabase
        .from("videos")
        .select("id, title, category, duration_seconds, thumbnail_url")
        .in("id", videoIds);

      if (vidError) {
        console.error("Error fetching videos:", vidError);
        setVideosLoading(false);
        return;
      }

      // Map videos to recommendations
      const videosMap = new Map(videos?.map(v => [v.id, v]) || []);
      const enrichedRecommendations: RecommendedVideo[] = recommendations.map(rec => ({
        ...rec,
        video: rec.video_id ? videosMap.get(rec.video_id) || null : null
      }));

      // Separate by tier
      const free = enrichedRecommendations.filter(v => v.tier === 'free_to_watch');
      const locked = enrichedRecommendations.filter(v => v.tier === 'preview_only');
      setFreeVideos(free);
      setLockedVideos(locked);
      setVideosLoading(false);
    };

    // Fetch completed video views for current user
    const fetchCompletedVideos = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("video_views")
        .select("video_id")
        .eq("user_id", user.id)
        .eq("status", "completed");

      if (error) {
        console.error("Error fetching video views:", error);
      } else if (data) {
        setCompletedVideoIds(new Set(data.map(v => v.video_id)));
      }
    };

    fetchRecommendedVideos();
    fetchCompletedVideos();
  }, [navigate]);

  if (!userData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-text-secondary">Loading...</p>
      </div>
    );
  }

  const getQuizLabel = (value: string, type: string) => {
    const labels: Record<string, Record<string, string>> = {
      experience: {
        beginner: "Complete beginner",
        researched: "Researched but never traded",
        "few-trades": "Made a few trades",
        regular: "Trade regularly",
      },
      goal: {
        "extra-income": "Generate extra income",
        "replace-income": "Replace full-time income",
        wealth: "Build long-term wealth",
        hobby: "Learn as a hobby",
      },
      concern: {
        "losing-money": "Losing money / Risk management",
        understanding: "Not understanding how it works",
        time: "Not having enough time",
        decisions: "Making bad decisions / Psychology",
        capital: "Don't have enough capital",
      },
      timeCommitment: {
        "1-3": "1-3 hours per week",
        "4-6": "4-6 hours per week",
        "7-10": "7-10 hours per week",
        "10+": "10+ hours per week",
      },
    };
    return labels[type]?.[value] || value;
  };

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
            <source src="/nasr-background.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-nasr-bg/70 via-nasr-bg/85 to-nasr-bg" />
        </div>
      )}
      
      <div className="space-y-12 relative z-10">
        {/* Admin Preview Banner */}
        {isAdminMode && (
          <div className="bg-[#B5A7FF]/15 border border-[#B5A7FF]/50 px-6 py-3 rounded-xl backdrop-blur-sm animate-slide-down">
            <p className="text-sm font-medium text-[#1D3557]">
              🔧 <strong>Admin Preview Mode</strong> - You're viewing as: <span className="text-[#6B5B95]">{client?.company_name}</span>
            </p>
          </div>
        )}

        {/* Test Video Completion Webhook Button */}
        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-800">🧪 Test Mode</p>
              <p className="text-xs text-amber-600">Send test data to video completion webhook</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="border-amber-400 text-amber-700 hover:bg-amber-100"
              onClick={async () => {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                  toast({ title: "No user", description: "You must be logged in", variant: "destructive" });
                  return;
                }
                const payload = {
                  user_id: user.id,
                  video_id: "test-video-123",
                  event_type: "video_completed"
                };
                try {
                  const response = await fetch("https://clientee.app.n8n.cloud/webhook-test/14bc5880-e57c-44ce-9980-5caf53bf2e53", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                  });
                  toast({ title: "Test sent!", description: `Status: ${response.status}` });
                } catch (error) {
                  toast({ title: "Error", description: String(error), variant: "destructive" });
                }
              }}
            >
              Send Test Data
            </Button>
          </div>
        </Card>

        {/* Welcome Section */}
        <div className="space-y-8 animate-slide-up">
          <div className="space-y-4">
            <h1 className={cn(
              "text-5xl md:text-6xl font-bold tracking-tight",
              themeColors.heading
            )}>
              Welcome back, {userData.firstName}!
            </h1>
            <p className={cn("text-lg", themeColors.subtext)}>
              Let's continue your trading journey
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={cn("text-sm uppercase tracking-wider font-semibold", themeColors.subtext)}>
                Your Progress
              </span>
              <span className={cn("text-xl font-semibold font-mono", themeColors.primary)}>
                0%
              </span>
            </div>
            <Progress value={0} className="h-2" />
            <div className={cn(
              "inline-flex items-center gap-3 px-5 py-3 rounded-full backdrop-blur-sm border",
              isNasrTheme ? 'bg-nasr-panel/60 border-gold/20' : 'bg-white/60 border-aqua/40'
            )}>
              <span className="text-xl animate-pulse-subtle">🔥</span>
              <span className={cn("text-sm", themeColors.subtext)}>
                0 day streak - Watch your first video!
              </span>
            </div>
          </div>
        </div>

        {/* Gamification / Trader Progress Section */}
        <GamificationSection />

        {/* Your Progress Card */}
        <UserProgressCard />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Video,
              label: "Videos Watched",
              value: `${completedVideoIds.size} / ${freeVideos.length + lockedVideos.length || 5}`,
              subtext: `${Math.max(0, freeVideos.length - completedVideoIds.size)} free videos remaining`,
              color: "success",
            },
            {
              icon: Clock,
              label: "Total Watch Time",
              value: "0h 0m",
              subtext: "Start learning today",
              color: "info",
            },
            {
              icon: TrendingUp,
              label: "Progress",
              value: "0%",
              subtext: "Complete your first video",
              color: "warning",
            },
            {
              icon: Trophy,
              label: "Achievements",
              value: "0",
              subtext: "1 badge available",
              color: "success",
            },
          ].map((stat, index) => (
            <Card
              key={stat.label}
              className="p-8 space-y-5 group cursor-pointer"
              style={{
                animationDelay: `${0.2 + index * 0.1}s`,
                animationFillMode: "backwards",
              }}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-12 h-12 rounded-xl bg-${stat.color}/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-widest text-[#6B7280] font-semibold">
                  {stat.label}
                </p>
                <p className="text-4xl font-semibold text-[#1D3557] font-mono tracking-tight group-hover:scale-105 transition-transform duration-300">
                  {stat.value}
                </p>
                <p className="text-sm text-[#6B7280]">{stat.subtext}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Trading Profile */}
        {quizAnswers && (
          <Collapsible open={profileOpen} onOpenChange={setProfileOpen}>
            <Card className="overflow-hidden">
              <CollapsibleTrigger asChild>
                <button className="w-full p-6 flex items-center justify-between hover:bg-white/30 transition-colors duration-200 cursor-pointer">
                  <h2 className="text-xl font-semibold text-[#1D3557] flex items-center gap-3">
                    <span className="text-2xl">📋</span>
                    Your Trading Profile
                  </h2>
                  {profileOpen ? (
                    <ChevronUp className="h-5 w-5 text-[#6B7280] transition-transform duration-200" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-[#6B7280] transition-transform duration-200" />
                  )}
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-8 pb-8 pt-2 border-t border-[#D4E0EC] space-y-5">
                  <div className="grid gap-5 mt-6">
                    {[
                      { label: "Experience", value: getQuizLabel(quizAnswers.experience, "experience") },
                      { label: "Interested in", value: quizAnswers.markets?.join(", ") || "Not specified" },
                      { label: "Primary Goal", value: getQuizLabel(quizAnswers.goal, "goal") },
                      { label: "Main Concern", value: getQuizLabel(quizAnswers.concern, "concern") },
                      { label: "Time Available", value: getQuizLabel(quizAnswers.timeCommitment, "timeCommitment") },
                    ].map((item) => (
                      <div key={item.label} className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-sm uppercase tracking-wider text-[#6B7280] font-semibold min-w-[160px]">
                          {item.label}
                        </span>
                        <span className="text-base text-[#1D3557] font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => console.log("Edit clicked")}
                    className="mt-6"
                  >
                    Edit My Answers
                  </Button>
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        )}

        {/* Personalized Video Playlist */}
        <div className="space-y-8">
          <div className="space-y-3">
            <h2 className="text-4xl font-bold text-[#1D3557] tracking-tight flex items-center gap-3">
              <span className="text-3xl">🎥</span>
              Your Personalized Learning Path
            </h2>
            <p className="text-lg text-[#6B7280]">
              Based on your answers, these videos are perfect for you
            </p>
          </div>

          {videosLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-video bg-muted animate-pulse" />
                  <div className="p-8 space-y-4">
                    <div className="h-6 bg-muted rounded animate-pulse w-1/3" />
                    <div className="h-6 bg-muted rounded animate-pulse w-2/3" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              {/* Free Videos */}
              {freeVideos.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {freeVideos.map((rec, index) => {
                    if (!rec.video) return null;
                    const video = rec.video;
                    const isCompleted = completedVideoIds.has(video.id);
                    return (
                      <Card
                        key={rec.id}
                        className="overflow-hidden cursor-pointer group"
                        onClick={() => navigate(`/video/${video.id}`)}
                        style={{
                          animationDelay: `${0.1 * index}s`,
                          animationFillMode: "backwards",
                        }}
                      >
                        {/* Thumbnail */}
                        <div className="relative aspect-video bg-gradient-to-br from-[#EDF2F7] to-[#D4E0EC] overflow-hidden">
                          {video.thumbnail_url ? (
                            <img 
                              src={video.thumbnail_url} 
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <>
                              <div className="absolute inset-0 bg-[#4DE2E8]/5 group-hover:bg-[#4DE2E8]/10 transition-colors duration-500" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-[#4DE2E8]/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 group-hover:bg-[#4DE2E8]/30 transition-all duration-300">
                                  <Play className="w-8 h-8 text-[#2FB3C6] ml-1" fill="currentColor" />
                                </div>
                              </div>
                            </>
                          )}
                          {/* Completed overlay badge */}
                          {isCompleted && (
                            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-semibold shadow-lg">
                              <CheckCircle className="w-3.5 h-3.5" />
                              Completed
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-8 space-y-4">
                          <div className="flex items-center gap-3 flex-wrap">
                            <Badge variant={categoryVariantMap[video.category || ""] || "info"}>{video.category || "Uncategorized"}</Badge>
                            <span className="text-sm text-[#6B7280] font-mono flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              {formatDuration(video.duration_seconds)}
                            </span>
                          </div>

                          <h3 className="text-xl font-semibold text-[#1D3557] group-hover:text-[#4DE2E8] transition-colors duration-200 line-clamp-2">
                            {video.title}
                          </h3>

                          {rec.reason && (
                            <p className="text-sm text-[#6B7280] italic">
                              {rec.reason}
                            </p>
                          )}

                          <div className="space-y-3">
                            <div className="h-1.5 bg-[#D4E0EC]/50 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#4DE2E8] to-[#A7E9FF] transition-all duration-1000"
                                style={{ width: isCompleted ? "100%" : "0%" }}
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-sm text-[#6B7280]">
                                {isCompleted ? "Completed" : "Not Started"}
                              </span>
                              <Button size="sm" variant={isCompleted ? "outline" : "primary"} className="group-hover:scale-105 transition-transform">
                                {isCompleted ? "Watch Again" : "Watch Now →"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* Locked Videos Section */}
              {lockedVideos.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-[#1D3557] flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Unlock More Content
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {lockedVideos.map((rec, index) => {
                      if (!rec.video) return null;
                      const video = rec.video;
                      return (
                        <Card
                          key={rec.id}
                          className="overflow-hidden relative group opacity-75"
                          style={{
                            animationDelay: `${0.1 * index}s`,
                            animationFillMode: "backwards",
                          }}
                        >
                          {/* Thumbnail with lock overlay */}
                          <div className="relative aspect-video bg-gradient-to-br from-[#EDF2F7] to-[#D4E0EC] overflow-hidden">
                            {video.thumbnail_url ? (
                              <img 
                                src={video.thumbnail_url} 
                                alt={video.title}
                                className="w-full h-full object-cover grayscale"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-[#D4E0EC]/50" />
                            )}
                            {/* Lock Overlay */}
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                              <div className="text-center space-y-2">
                                <div className="w-14 h-14 mx-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                  <Lock className="w-7 h-7 text-white" />
                                </div>
                                <p className="text-white text-sm font-medium px-4">
                                  Unlock with Live Account
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-8 space-y-4">
                            <div className="flex items-center gap-3 flex-wrap">
                              <Badge variant="secondary">{video.category || "Premium"}</Badge>
                              <span className="text-sm text-[#6B7280] font-mono flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                {formatDuration(video.duration_seconds)}
                              </span>
                            </div>

                            <h3 className="text-xl font-semibold text-[#1D3557] line-clamp-2">
                              {video.title}
                            </h3>

                            {rec.reason && (
                              <p className="text-sm text-[#6B7280] italic">
                                {rec.reason}
                              </p>
                            )}

                            <div className="flex items-center justify-between">
                              <span className="text-sm text-[#6B7280] flex items-center gap-1">
                                <Lock className="w-3.5 h-3.5" />
                                Locked
                              </span>
                              <Button size="sm" variant="outline" disabled>
                                Open Live Account
                              </Button>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {freeVideos.length === 0 && lockedVideos.length === 0 && (
                <Card className="p-12 text-center">
                  <p className="text-[#6B7280]">No personalized videos available yet. Complete the quiz to get recommendations.</p>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Learning Roadmap Preview */}
        <Card className="p-12 space-y-8">
          <div className="space-y-3">
            <h2 className="text-4xl font-bold text-[#1D3557] tracking-tight flex items-center gap-3">
              <span className="text-3xl">🗺️</span>
              Your Personalized Roadmap
            </h2>
            <p className="text-lg text-[#6B7280]">
              Follow this step-by-step path to success
            </p>
          </div>

          <div className="space-y-6">
            {/* Phase 1 - Active */}
            <div className="relative pl-8 border-l-4 border-[#4DE2E8]">
              <div className="absolute -left-[14px] top-0 w-6 h-6 rounded-full bg-[#4DE2E8] border-4 border-white animate-pulse-subtle" />
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold text-[#1D3557] uppercase tracking-wider">
                    Phase 1: Getting Started
                  </h3>
                  <Badge variant="success">Active</Badge>
                </div>
                <p className="text-sm text-[#6B7280] uppercase tracking-wider">Week 1-2 • 10% Complete</p>

                <div className="space-y-3 mt-6">
                  {[
                    { done: true, text: "Create your account", icon: "✅" },
                    { done: false, current: true, text: "Watch your first video", icon: "⏳" },
                    { done: false, text: "Complete beginner module", icon: "⬜" },
                    { done: false, text: "Take your first quiz", icon: "⬜" },
                  ].map((step, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 text-base ${
                        step.done
                          ? "text-[#4DE2E8]"
                          : step.current
                          ? "text-[#1D3557]"
                          : "text-[#6B7280]"
                      }`}
                    >
                      <span className="text-lg">{step.icon}</span>
                      <span className={step.current ? "font-medium" : ""}>{step.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Phase 2 - Locked */}
            <div className="relative pl-8 border-l-4 border-[#D4E0EC] opacity-50">
              <div className="absolute -left-[14px] top-0 w-6 h-6 rounded-full bg-[#D4E0EC] border-4 border-white" />
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold text-[#1D3557] uppercase tracking-wider">
                    Phase 2: Building Skills
                  </h3>
                  <Badge variant="secondary">Locked</Badge>
                </div>
                <p className="text-sm text-[#6B7280] uppercase tracking-wider">Week 3-4</p>
                <p className="text-base text-[#6B7280]">🔒 Complete Phase 1 to unlock</p>
              </div>
            </div>
          </div>

          <Button
            onClick={() => navigate("/roadmap")}
            className="w-full"
            size="lg"
          >
            View Full Roadmap
          </Button>
        </Card>

        {/* AI Stock Analyzer Teaser */}
        <Card className="p-12 space-y-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1D3557]/5 to-transparent" />
          <div className="relative z-10 space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#1D3557]/10 flex items-center justify-center mb-6">
              <span className="text-4xl">📊</span>
            </div>
            <h2 className="text-4xl font-bold text-[#1D3557] tracking-tight">
              AI Stock Analyzer
            </h2>
            <p className="text-lg text-[#6B7280] max-w-md mx-auto">
              Analyze any stock in real-time with advanced AI technology
            </p>
          </div>

          <div className="max-w-md mx-auto space-y-4 relative z-10">
            <Input
              placeholder="Enter symbol (e.g., AAPL, TSLA)"
              disabled
              className="h-14 text-base bg-white/60 border-[#D4E0EC] rounded-xl"
            />
            <div className="flex gap-3">
              <Button disabled className="flex-1" size="lg">
                Analyze
              </Button>
              <Button
                onClick={() => navigate("/analyzer")}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                Go to Analyzer →
              </Button>
            </div>
          </div>
        </Card>

        {/* Call to Action */}
        <Card className="p-16 text-center space-y-8 relative overflow-hidden success-glow">
          <div className="absolute inset-0 success-gradient opacity-10" />
          <div className="relative z-10 space-y-6">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-[#4DE2E8]/10 flex items-center justify-center">
              <Phone className="w-10 h-10 text-[#4DE2E8]" />
            </div>
            <div className="space-y-3">
              <h2 className="text-5xl font-bold text-[#1D3557] tracking-tight">
                Ready for 1-on-1 Guidance?
              </h2>
              <p className="text-xl text-[#6B7280] max-w-xl mx-auto">
                Book a free call with a trading specialist
              </p>
            </div>

            <div className="flex items-center justify-center gap-6 text-sm text-[#9CA3AF]">
              <span className="flex items-center gap-2">✓ No sales pitch</span>
              <span className="flex items-center gap-2">✓ 30-minute session</span>
              <span className="flex items-center gap-2">✓ 100% free</span>
            </div>

            <Button
              onClick={() => console.log("Book call clicked")}
              className="px-16 animate-pulse-subtle"
              size="lg"
            >
              Book Your Call
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
