import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { CheckCircle, Clock, Lock, Play, ChevronRight, Trophy, Flame, X } from "lucide-react";
import { useClient } from "@/lib/clientContext";
import { supabase } from "@/integrations/supabase/client";
import AchievementCard from "@/components/AchievementCard";
import { useAchievements } from "@/hooks/useAchievements";
import { Skeleton } from "@/components/ui/skeleton";
import { useGamification } from "@/hooks/useGamification";
import { ScrollArea } from "@/components/ui/scroll-area";
import { shouldHideTradingCTAs } from "@/lib/featureFlags";

interface VideoStep {
  id: string;
  title: string;
  duration?: number;
  completed: boolean;
  inProgress?: boolean;
}

interface MountainLocation {
  id: number;
  name: string;
  emoji: string;
  subtitle: string;
  description: string;
  status: "completed" | "active" | "locked";
  requiresLiveAccount?: boolean;
  progress: number;
  totalVideos: number;
  completedVideos: number;
  videos: VideoStep[];
}

interface RoadmapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RoadmapDialog({ open, onOpenChange }: RoadmapDialogProps) {
  const navigate = useNavigate();
  const { client } = useClient();
  const [locations, setLocations] = useState<MountainLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { achievements, loading: achievementsLoading } = useAchievements();
  
  const { xp, level, levelName, streakDays, currentLevelXp, nextLevelXp, isLoading: gamificationLoading } = useGamification();

  useEffect(() => {
    if (!open) return;

    const fetchRoadmapData = async () => {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return;
      }

      const { data: publicUser } = await supabase
        .from("users")
        .select("id")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      const userId = publicUser?.id;
      if (!userId) {
        setIsLoading(false);
        return;
      }

      const { data: recommendations } = await supabase
        .from("user_video_recommendations")
        .select("video_id, tier, priority")
        .eq("user_id", userId)
        .order("priority", { ascending: true });

      const { data: videoViews } = await supabase
        .from("video_views")
        .select("video_id")
        .eq("user_id", userId)
        .eq("status", "completed");

      const { data: videos } = await supabase
        .from("videos")
        .select("id, title, duration_seconds");

      const completedIds = new Set(videoViews?.map(v => v.video_id) || []);
      const videoMap = new Map(videos?.map(v => [v.id, v]) || []);

      const freeVideos = recommendations?.filter(r => r.tier === 'free_to_watch') || [];
      const lockedVideos = recommendations?.filter(r => r.tier === 'preview_only') || [];

      const mapVideos = (recs: typeof freeVideos): VideoStep[] => {
        return recs.map(rec => {
          const video = videoMap.get(rec.video_id);
          return {
            id: rec.video_id,
            title: video?.title || 'Unknown Video',
            duration: video?.duration_seconds,
            completed: completedIds.has(rec.video_id),
            inProgress: false
          };
        }).filter(v => v.title !== 'Unknown Video');
      };

      const freeVideoSteps = mapVideos(freeVideos);
      const lockedVideoSteps = mapVideos(lockedVideos);

      const firstIncomplete = freeVideoSteps.findIndex(v => !v.completed);
      if (firstIncomplete !== -1) {
        freeVideoSteps[firstIncomplete].inProgress = true;
      }

      const phase1Videos = freeVideoSteps.slice(0, 8);
      const phase2Videos = freeVideoSteps.slice(8, 15);

      const phase1Completed = phase1Videos.filter(v => v.completed).length;
      const phase2Completed = phase2Videos.filter(v => v.completed).length;
      const phase1Complete = phase1Completed === phase1Videos.length && phase1Videos.length > 0;

      const mountainLocations: MountainLocation[] = [
        {
          id: 4,
          name: "MASTER SUMMIT",
          emoji: "⛰️",
          subtitle: "Elite Mastery",
          description: "Professional institutional tactics & advanced portfolio management",
          status: "locked",
          requiresLiveAccount: true,
          progress: 0,
          totalVideos: 50,
          completedVideos: 0,
          videos: []
        },
        {
          id: 3,
          name: "STRATEGY PEAK",
          emoji: "🏔️",
          subtitle: "Advanced Strategies",
          description: "Richard Dennis's $150M System, Game Theory, VWAP Analysis",
          status: "locked",
          requiresLiveAccount: true,
          progress: 0,
          totalVideos: lockedVideoSteps.length + 30,
          completedVideos: 0,
          videos: lockedVideoSteps.slice(0, 5)
        },
        {
          id: 2,
          name: "SKILLS VALLEY",
          emoji: "⛺",
          subtitle: "Building Foundation",
          description: "Chart patterns, technical indicators & entry timing",
          status: phase1Complete ? "active" : "locked",
          progress: phase2Videos.length > 0 ? Math.round((phase2Completed / phase2Videos.length) * 100) : 0,
          totalVideos: phase2Videos.length,
          completedVideos: phase2Completed,
          videos: phase2Videos
        },
        {
          id: 1,
          name: "BASE CAMP",
          emoji: "🏕️",
          subtitle: "Phase 1: Foundations",
          description: "Your trading journey begins here",
          status: phase1Complete ? "completed" : "active",
          progress: phase1Videos.length > 0 ? Math.round((phase1Completed / phase1Videos.length) * 100) : 0,
          totalVideos: phase1Videos.length,
          completedVideos: phase1Completed,
          videos: phase1Videos
        }
      ];

      setLocations(mountainLocations);
      setIsLoading(false);
    };

    fetchRoadmapData();
  }, [open]);

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "";
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  const progressPercent = nextLevelXp > currentLevelXp 
    ? Math.min(((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100, 100)
    : 0;
  const xpToNextLevel = nextLevelXp - xp;

  const handleNavigate = (path: string) => {
    onOpenChange(false);
    navigate(path);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-gray-950/95 border-gray-800 backdrop-blur-xl overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Your Trading Journey
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Climb to trading mastery — one phase at a time
          </p>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-100px)] px-6 pb-6">
          {/* User Stats Card */}
          <Card className="p-4 mb-6 bg-gray-900/80 backdrop-blur-xl border border-gray-700/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-purple-500/30 border border-cyan-500/50 flex items-center justify-center">
                    <span className="text-xl font-black text-cyan-400">{level}</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-cyan-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                    LV
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Level {level} - {levelName}</h2>
                  <p className="text-sm text-gray-400">{xp.toLocaleString()} XP total</p>
                </div>
              </div>

              {streakDays > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="font-bold text-sm text-orange-400">{streakDays} Day Streak</span>
                </div>
              )}
            </div>

            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Progress to Level {level + 1}</span>
                <span className="text-cyan-400">{xp} / {nextLevelXp} XP</span>
              </div>
              <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden border border-gray-700/50">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">
                {xpToNextLevel > 0 ? `Watch ${Math.ceil(xpToNextLevel / 25)} more videos to reach Level ${level + 1}` : "Level up ready!"}
              </p>
            </div>
          </Card>

          {/* Achievements Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                Your Achievements
              </h2>
              <span className="text-xs text-gray-400">
                {achievements.filter(a => a.status === "unlocked").length} / {achievements.length} unlocked
              </span>
            </div>

            {achievementsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-28 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {achievements.slice(0, 8).map((achievement) => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    status={achievement.status}
                    progress={achievement.progress}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Mountain Path Section */}
          <div className="mb-4">
            <h2 className="text-lg font-bold text-white mb-3">Your Path</h2>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {locations.map((location, index) => {
                const isActive = location.status === "active";
                const isCompleted = location.status === "completed";
                const isLocked = location.status === "locked";

                return (
                  <div
                    key={location.id}
                    className={`relative rounded-xl overflow-hidden transition-all duration-300
                      ${isActive 
                        ? 'bg-gradient-to-br from-gray-900/90 to-gray-800/90 border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/10' 
                        : isCompleted
                        ? 'bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-green-500/30'
                        : 'bg-gray-900/60 border border-gray-700/50'
                      }
                    `}
                  >
                    {isLocked && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-10 flex items-center justify-center">
                        <div className="text-center p-3">
                          <Lock className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                          <p className="text-xs text-gray-400">
                            {location.requiresLiveAccount && !shouldHideTradingCTAs(client?.subdomain)
                              ? "Unlock with Live Account" 
                              : `Complete ${locations[index + 1]?.name || 'previous phase'} to unlock`
                            }
                          </p>
                        </div>
                      </div>
                    )}

                    <div className={`p-4 ${isLocked ? 'opacity-50' : ''}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{location.emoji}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className={`text-base font-bold ${isActive ? 'text-cyan-400' : isCompleted ? 'text-green-400' : 'text-gray-400'}`}>
                                {location.name}
                              </h3>
                              {isActive && (
                                <span className="px-2 py-0.5 text-xs font-semibold bg-cyan-500 text-white rounded-full">
                                  Current
                                </span>
                              )}
                              {isCompleted && (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                            <p className="text-xs text-gray-400">{location.subtitle}</p>
                          </div>
                        </div>

                        {!isLocked && (
                          <div className="relative w-12 h-12">
                            <svg className="w-12 h-12 transform -rotate-90">
                              <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" fill="none" className="text-gray-700" />
                              <circle
                                cx="24" cy="24" r="20"
                                stroke="currentColor" strokeWidth="3" fill="none"
                                strokeDasharray={`${2 * Math.PI * 20}`}
                                strokeDashoffset={`${2 * Math.PI * 20 * (1 - location.progress / 100)}`}
                                className={`${isCompleted ? 'text-green-500' : 'text-cyan-500'} transition-all duration-1000`}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className={`text-xs font-bold ${isCompleted ? 'text-green-400' : 'text-cyan-400'}`}>
                                {location.progress}%
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-gray-400 mb-2">{location.description}</p>

                      {!isLocked && (
                        <div className="text-xs text-gray-500 mb-3">
                          {location.completedVideos}/{location.totalVideos} videos completed
                        </div>
                      )}

                      {isActive && (
                        <Button 
                          onClick={() => handleNavigate("/videos")}
                          size="sm"
                          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold"
                        >
                          Continue Learning
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      )}

                      {isCompleted && (
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => handleNavigate("/videos")}
                          className="w-full border-green-500/30 text-green-400 hover:bg-green-500/10"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Review Videos
                        </Button>
                      )}

                      {isLocked && location.requiresLiveAccount && !shouldHideTradingCTAs(client?.subdomain) && (
                        <Button 
                          size="sm"
                          className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-semibold z-20 relative"
                          onClick={() => window.open('https://nasrtrade.com', '_blank')}
                        >
                          Open Live Account
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-6 text-center text-gray-500 text-xs">
            <p>🏔️ Keep climbing — your trading mastery awaits!</p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
