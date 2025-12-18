import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Video, Clock, ChevronDown, ChevronUp, Play, CheckCircle, Lock } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useClient } from "@/lib/clientContext";
import { useAuth } from "@/lib/AuthContext";
import { GamificationSection } from "@/components/GamificationSection";
import { UserProgressCard } from "@/components/UserProgressCard";
import { useGamification } from "@/hooks/useGamification";
import { supabase } from "@/integrations/supabase/client";
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
  const { user, profile, loading } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<any>(null);
  const [freeVideos, setFreeVideos] = useState<RecommendedVideo[]>([]);
  const [lockedVideos, setLockedVideos] = useState<RecommendedVideo[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [completedVideoIds, setCompletedVideoIds] = useState<Set<string>>(new Set());
  
  // Gamification data
  const { xp, level, currentLevelXp, nextLevelXp, streakDays, videosCompleted } = useGamification();

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

  // Derive userData from profile
  const userData: UserData | null = profile ? {
    firstName: profile.first_name || user?.user_metadata?.first_name || '',
    lastName: profile.last_name || user?.user_metadata?.last_name || '',
    email: profile.email || user?.email || '',
    phone: profile.phone || ''
  } : null;

  useEffect(() => {
    // Skip if still loading auth
    if (loading) return;

    // Get quiz answers from profile (database) or fallback to localStorage
    const profileQuiz = profile?.quiz_answers;
    if (profileQuiz) {
      setQuizAnswers(profileQuiz);
    } else {
      const localQuiz = localStorage.getItem("quizAnswers");
      if (localQuiz) {
        setQuizAnswers(JSON.parse(localQuiz));
      }
    }

    // Fetch AI-recommended videos from Supabase
    const fetchRecommendedVideos = async (profileId: string) => {
      if (!profileId) {
        setVideosLoading(false);
        return;
      }
      const userId = profileId;

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

      // Fetch video details using video_id (text field, not UUID)
      const { data: videos, error: vidError } = await supabase
        .from("videos")
        .select("id, video_id, title, category, duration_seconds, thumbnail_url")
        .in("video_id", videoIds);

      if (vidError) {
        console.error("Error fetching videos:", vidError);
        setVideosLoading(false);
        return;
      }

      // Map videos by video_id (text) to match recommendations
      const videosMap = new Map(videos?.map(v => [v.video_id, v]) || []);
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

      // Map auth user to public.users.id
      const { data: publicUser } = await supabase
        .from("users")
        .select("id")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      const userId = publicUser?.id;
      if (!userId) return;

      const { data, error } = await supabase
        .from("video_views")
        .select("video_id")
        .eq("user_id", userId)
        .eq("status", "completed");

      if (error) {
        console.error("Error fetching video views:", error);
      } else if (data) {
        setCompletedVideoIds(new Set(data.map(v => v.video_id)));
      }
    };

    if (profile?.id) {
      fetchRecommendedVideos(profile.id);
    } else {
      setVideosLoading(false);
    }
    fetchCompletedVideos();
  }, [loading, profile]);

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
          {(() => {
            const progressPercent = nextLevelXp > 0 ? Math.min((xp / nextLevelXp) * 100, 100) : 0;
            
            return (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={cn("text-sm uppercase tracking-wider font-semibold", themeColors.subtext)}>
                    Your Progress
                  </span>
                  <span className={cn("text-xl font-semibold font-mono", themeColors.primary)}>
                    {Math.round(progressPercent)}%
                  </span>
                </div>
                <Progress value={progressPercent} className="h-2" />
                <div className={cn(
                  "inline-flex items-center gap-3 px-5 py-3 rounded-full backdrop-blur-sm border",
                  isNasrTheme ? 'bg-nasr-panel/60 border-gold/20' : 'bg-white/60 border-aqua/40'
                )}>
                  <span className="text-xl animate-pulse-subtle">🔥</span>
                  <span className={cn("text-sm", themeColors.subtext)}>
                    {streakDays > 0 
                      ? `${streakDays} day${streakDays !== 1 ? 's' : ''} streak - Keep it up!` 
                      : 'Start your streak - Watch your first video!'}
                  </span>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Gamification / Trader Progress Section */}
        <GamificationSection />

        {/* Your Progress Card */}
        <UserProgressCard />

        {/* Quick Stats - Only showing Videos Watched (real data) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-2xl">
          <Card
            className="p-8 space-y-5 group cursor-pointer"
            style={{
              animationDelay: `0.2s`,
              animationFillMode: "backwards",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Video className="w-6 h-6 text-success" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-widest text-muted-foreground font-semibold">
                Videos Watched
              </p>
              <p className="text-4xl font-semibold text-foreground font-mono tracking-tight group-hover:scale-105 transition-transform duration-300">
                {completedVideoIds.size} / {freeVideos.length || 0}
              </p>
              <p className="text-sm text-muted-foreground">
                {freeVideos.length - completedVideoIds.size > 0 
                  ? `${freeVideos.length - completedVideoIds.size} free videos remaining`
                  : "All free videos completed!"}
              </p>
            </div>
          </Card>
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
                  {/* Edit button hidden for v1 - quiz editing flow not implemented */}
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
              Start Learning
            </h2>
            <p className="text-lg text-[#6B7280]">
              Your personalized videos - watch these first
            </p>
          </div>

          {videosLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
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
            <div className="space-y-6">
              {/* Show only first 2 free videos */}
              {freeVideos.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {freeVideos.slice(0, 2).map((rec, index) => {
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

              {/* See More Free Videos Button */}
              {freeVideos.length > 2 && (
                <Button 
                  onClick={() => navigate("/videos")}
                  size="lg"
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-6 text-lg"
                >
                  See {Math.max(0, freeVideos.length - 2)} More Free Videos →
                </Button>
              )}

              {/* Empty state */}
              {freeVideos.length === 0 && (
                <Card className="p-12 text-center">
                  <p className="text-[#6B7280]">No personalized videos available yet. Complete the quiz to get recommendations.</p>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Roadmap and Analyzer sections hidden for v1 - backend logic not fully connected */}

      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
