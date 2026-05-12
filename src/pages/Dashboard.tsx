import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Video, Clock, ChevronDown, ChevronUp, Play, CheckCircle, Lock, Trophy } from "lucide-react";
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
  const isPremiumTheme = client?.subdomain === 'finademica';
  
  // Theme-aware color classes - use semantic tokens for proper contrast
  const themeColors = {
    heading: isPremiumTheme ? 'text-premium-text font-playfair' : 'text-foreground',
    subtext: isPremiumTheme ? 'text-premium-text-muted' : 'text-muted-foreground',
    primary: isPremiumTheme ? 'text-premium-gold' : 'text-primary',
    primaryBg: isPremiumTheme ? 'bg-premium-gold' : 'bg-primary',
    cardBorder: isPremiumTheme ? 'border-premium-gold/20' : 'border-border',
    accentGlow: isPremiumTheme ? 'shadow-premium-gold' : 'shadow-primary/20',
    progressBar: isPremiumTheme ? 'from-premium-gold-light to-premium-gold' : 'from-primary to-primary/80',
    badge: isPremiumTheme ? 'bg-premium-gold/10 border-premium-gold/30 text-premium-gold' : 'bg-primary/10 border-primary/30 text-primary',
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

    // Fetch videos - try recommendations first, fallback to mandatory/beginner videos
    const fetchRecommendedVideos = async (profileId: string) => {
      if (!profileId) {
        setVideosLoading(false);
        return;
      }
      const userId = profileId;

      // First, try AI recommendations
      const { data: recommendations } = await supabase
        .from("user_video_recommendations")
        .select("id, priority, tier, reason, video_id")
        .eq("user_id", userId)
        .order("priority", { ascending: true });

      let matchedVideos: RecommendedVideo[] = [];

      if (recommendations && recommendations.length > 0) {
        // Get unique video IDs (filter out nulls)
        const videoIds = recommendations
          .map(r => r.video_id)
          .filter((id): id is string => id !== null);

        // Fetch video details using video_id (text field)
        const { data: videos } = await supabase
          .from("videos")
          .select("id, video_id, title, category, duration_seconds, thumbnail_url")
          .in("video_id", videoIds);

        if (videos && videos.length > 0) {
          // Map videos by video_id (text) to match recommendations
          const videosMap = new Map(videos.map(v => [v.video_id, v]));
          matchedVideos = recommendations
            .map(rec => ({
              ...rec,
              video: rec.video_id ? videosMap.get(rec.video_id) || null : null
            }))
            .filter(rec => rec.video !== null);
        }
      }

      // If no valid recommendations, fallback to mandatory/beginner videos
      if (matchedVideos.length === 0) {
        const { data: fallbackVideos } = await supabase
          .from("videos")
          .select("id, video_id, title, category, duration_seconds, thumbnail_url, mandatory")
          .eq("is_active", true)
          .or("mandatory.eq.true,module.eq.beginner")
          .order("order_priority", { ascending: true, nullsFirst: false })
          .order("created_at", { ascending: true })
          .limit(10);

        if (fallbackVideos && fallbackVideos.length > 0) {
          matchedVideos = fallbackVideos.map((v, idx) => ({
            id: v.id,
            priority: idx + 1,
            tier: "free_to_watch",
            reason: v.mandatory ? "Essential beginner video" : "Recommended for your level",
            video_id: v.video_id,
            video: v
          }));
        }
      }

      // Separate by tier
      const free = matchedVideos.filter(v => v.tier === 'free_to_watch');
      const locked = matchedVideos.filter(v => v.tier === 'preview_only');
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
    <SidebarLayout>
      {/* Premium Academy Video Background */}
      {isPremiumTheme && (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute w-full h-full object-cover opacity-30"
          >
            <source src="/premium-background.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-premium-bg/70 via-premium-bg/85 to-premium-bg" />
        </div>
      )}
      
      <div className="space-y-12 relative z-10">
        {/* Admin Preview Banner */}
        {isAdminMode && (
          <div className="bg-purple-500/15 border border-purple-500/50 px-6 py-3 rounded-xl backdrop-blur-sm animate-slide-down">
            <p className="text-sm font-medium text-foreground">
              🔧 <strong>Admin Preview Mode</strong> - You're viewing as: <span className="text-primary">{client?.company_name}</span>
            </p>
          </div>
        )}

        {/* Welcome Section */}
        <div className="space-y-6 md:space-y-8 animate-slide-up">
          <div className="space-y-3 md:space-y-4">
            <h1 className={cn(
              "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif tracking-tight",
              themeColors.heading
            )}>
              Welcome back, {userData.firstName}!
            </h1>
            <p className={cn("text-base md:text-lg", themeColors.subtext)}>
              Let's continue your trading journey
            </p>
          </div>

          {/* Progress Bar & Streak */}
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
                  "inline-flex items-center gap-3 px-5 py-3 rounded-xl backdrop-blur-sm border",
                  isPremiumTheme ? 'bg-premium-gold/10 border-premium-gold/30' : 'bg-indigo-500/10 border-indigo-500/30'
                )}>
                  <span className="text-xl animate-pulse-subtle">🔥</span>
                  <span className={cn("text-sm font-medium text-foreground")}>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-2xl">
          <Card
            className="p-5 md:p-8 space-y-4 md:space-y-5 group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-success/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Video className="w-5 h-5 md:w-6 md:h-6 text-success" />
              </div>
            </div>
            <div className="space-y-1 md:space-y-2">
              <p className="text-xs md:text-sm uppercase tracking-widest text-muted-foreground font-semibold">
                Videos Watched
              </p>
              <p className="text-2xl md:text-4xl font-semibold text-foreground font-mono tracking-tight group-hover:scale-105 transition-transform duration-300">
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
                <button className="w-full p-6 flex items-center justify-between hover:bg-muted/30 transition-colors duration-200 cursor-pointer">
                  <h2 className="text-2xl font-serif text-foreground flex items-center gap-3">
                    <span className="text-2xl">📋</span>
                    Your Trading Profile
                  </h2>
                  {profileOpen ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground transition-transform duration-200" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform duration-200" />
                  )}
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-8 pb-8 pt-2 border-t border-border space-y-5">
                  <div className="grid gap-5 mt-6">
                    {[
                      { label: "Experience", value: getQuizLabel(quizAnswers.experience, "experience") },
                      { label: "Interested in", value: quizAnswers.markets?.join(", ") || "Not specified" },
                      { label: "Primary Goal", value: getQuizLabel(quizAnswers.goal, "goal") },
                      { label: "Main Concern", value: getQuizLabel(quizAnswers.concern, "concern") },
                      { label: "Time Available", value: getQuizLabel(quizAnswers.timeCommitment, "timeCommitment") },
                    ].map((item) => (
                      <div key={item.label} className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-sm uppercase tracking-wider text-muted-foreground font-semibold min-w-[160px]">
                          {item.label}
                        </span>
                        <span className="text-base text-foreground font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        )}

        {/* Personalized Video Playlist */}
        <div className="space-y-5 md:space-y-8">
          <div className="space-y-2 md:space-y-3">
            <h2 className="text-3xl md:text-5xl font-serif text-foreground tracking-tight flex items-center gap-2 md:gap-3">
              <span className="text-xl md:text-3xl">🎥</span>
              Start Learning
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Your personalized videos - watch these first
            </p>
          </div>

          {videosLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {[1, 2].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-video bg-muted animate-pulse" />
                  <div className="p-4 md:p-8 space-y-3 md:space-y-4">
                    <div className="h-5 md:h-6 bg-muted rounded animate-pulse w-1/3" />
                    <div className="h-5 md:h-6 bg-muted rounded animate-pulse w-2/3" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Show free videos */}
              {freeVideos.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {freeVideos.map((rec, index) => {
                    if (!rec.video) return null;
                    const video = rec.video;
                    const isCompleted = completedVideoIds.has(video.id);
                    return (
                      <Card
                        key={rec.id}
                        className="overflow-hidden cursor-pointer group"
                        onClick={() => navigate(`/video/${video.id}`)}
                      >
                        {/* Thumbnail */}
                        <div className="relative aspect-video bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
                          {video.thumbnail_url ? (
                            <img 
                              src={video.thumbnail_url} 
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <>
                              <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors duration-500" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/30 transition-all duration-300">
                                  <Play className="w-8 h-8 text-primary ml-1" fill="currentColor" />
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
                            <span className="text-sm text-muted-foreground font-mono flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              {formatDuration(video.duration_seconds)}
                            </span>
                          </div>

                          <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
                            {video.title}
                          </h3>

                          {rec.reason && (
                            <p className="text-sm text-muted-foreground italic">
                              {rec.reason}
                            </p>
                          )}

                          <div className="space-y-3">
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-1000"
                                style={{ width: isCompleted ? "100%" : "0%" }}
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">
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

              {/* Full Library Link */}
              <Button 
                onClick={() => navigate("/videos")}
                size="lg"
                className="w-full py-6 text-lg font-semibold"
                variant="primary"
              >
                Go to Full Academy Library →
              </Button>

              {/* Empty state */}
              {freeVideos.length === 0 && (
                <Card className={cn(
                  "p-8 md:p-16 text-center space-y-6 md:space-y-8 border-2 border-dashed",
                  isPremiumTheme ? "bg-premium-bg/40 border-premium-gold/30" : "bg-card border-border"
                )}>
                  <div className="space-y-3 md:space-y-4 max-w-md mx-auto">
                    <div className={cn(
                      "mx-auto w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-4 md:mb-6",
                      isPremiumTheme ? "bg-premium-gold/20" : "bg-primary/20"
                    )}>
                      <Trophy className={cn("h-8 w-8 md:h-10 md:w-10", isPremiumTheme ? "text-premium-gold" : "text-primary")} />
                    </div>
                    <h3 className={cn("text-xl md:text-2xl font-bold", themeColors.heading)}>
                      Ready to Start Learning?
                    </h3>
                    <p className={cn("text-sm md:text-base", themeColors.subtext)}>
                      Take our AI-powered quiz to unlock a personalized video library tailored to your goals and experience level.
                    </p>
                  </div>
                  <Button 
                    onClick={() => navigate("/quiz")}
                    size="lg"
                    className={cn(
                      "px-8 md:px-10 py-5 md:py-6 text-base md:text-lg font-bold shadow-2xl transition-all hover:scale-105 active:scale-95",
                      isPremiumTheme ? "bg-premium-gold hover:bg-premium-gold/90 text-premium-bg" : "bg-primary"
                    )}
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Take Quiz Now →
                  </Button>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Dashboard;
