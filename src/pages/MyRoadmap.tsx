import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Clock, Lock, Play, ChevronRight, Trophy, Flame } from "lucide-react";
import { useClient } from "@/lib/clientContext";
import { supabase } from "@/integrations/supabase/client";
import AchievementCard from "@/components/AchievementCard";
import { useAchievements } from "@/hooks/useAchievements";
import { Skeleton } from "@/components/ui/skeleton";

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

const LEVEL_NAMES: Record<number, string> = {
  1: "Beginner Trader",
  2: "Student Trader",
  3: "Apprentice Trader",
  4: "Intermediate Trader",
  5: "Advanced Trader",
  6: "Expert Trader",
  7: "Professional Trader",
  8: "Elite Trader",
  9: "Master Trader",
  10: "Legend Trader",
};

const XP_PER_LEVEL = 150;

const MyRoadmap = () => {
  const navigate = useNavigate();
  const { client } = useClient();
  const isNasrTheme = client?.subdomain === 'nasr';
  const [locations, setLocations] = useState<MountainLocation[]>([]);
  const [userStats, setUserStats] = useState({ level: 1, xp: 0, streak: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const { achievements, loading: achievementsLoading } = useAchievements();

  useEffect(() => {
    const fetchRoadmapData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      const userId = user.id;
      
      if (userId) {
        // Fetch user gamification data
        const { data: gamification } = await supabase
          .from("user_gamification")
          .select("level, experience_points, streak_days")
          .eq("user_id", userId)
          .maybeSingle();
        
        if (gamification) {
          setUserStats({
            level: gamification.level || 1,
            xp: gamification.experience_points || 0,
            streak: gamification.streak_days || 0
          });
        }

        // Fetch video recommendations and completion status
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
      }

      setIsLoading(false);
    };

    fetchRoadmapData();
  }, [navigate]);

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "";
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  const levelName = LEVEL_NAMES[userStats.level] || `Level ${userStats.level} Trader`;
  const currentLevelXp = (userStats.level - 1) * XP_PER_LEVEL;
  const nextLevelXp = userStats.level * XP_PER_LEVEL;
  const progressPercent = Math.min(((userStats.xp - currentLevelXp) / XP_PER_LEVEL) * 100, 100);
  const xpToNextLevel = nextLevelXp - userStats.xp;

  return (
    <DashboardLayout>
      {/* Full-screen Video Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-full h-full object-cover"
        >
          <source src={isNasrTheme ? "/nasr-roadmap-background.mp4" : "/nasr-roadmap-background.mp4"} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 pb-12">
        {/* Header Section */}
        <div className="space-y-6 mb-10 animate-fade-in">
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Your Trading Journey
            </h1>
            <p className="text-gray-400">
              Climb to trading mastery — one phase at a time
            </p>
          </div>

          {/* User Stats Card */}
          <Card className="p-6 bg-gray-900/80 backdrop-blur-xl border border-gray-700/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Level Badge */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-purple-500/30 border border-cyan-500/50 flex items-center justify-center">
                    <span className="text-2xl font-black text-cyan-400">{userStats.level}</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-cyan-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                    LV
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Level {userStats.level} - {levelName}</h2>
                  <p className="text-sm text-gray-400">{userStats.xp.toLocaleString()} XP total</p>
                </div>
              </div>

              {/* Streak Badge */}
              {userStats.streak > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <span className="font-bold text-orange-400">{userStats.streak} Day Streak</span>
                </div>
              )}
            </div>

            {/* XP Progress Bar */}
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Progress to Level {userStats.level + 1}</span>
                <span className="text-cyan-400">{userStats.xp} / {nextLevelXp} XP</span>
              </div>
              <div className="h-3 bg-gray-800/50 rounded-full overflow-hidden border border-gray-700/50">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="h-full bg-gradient-to-b from-white/30 to-transparent" />
                </div>
              </div>
              <p className="text-xs text-gray-500">
                {xpToNextLevel > 0 ? `Watch ${Math.ceil(xpToNextLevel / 25)} more videos to reach Level ${userStats.level + 1}` : "Level up ready!"}
              </p>
            </div>
          </Card>
        </div>

        {/* Achievements Section */}
        <div className="mb-10 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Your Achievements
            </h2>
            <span className="text-sm text-gray-400">
              {achievements.filter(a => a.status === "unlocked").length} / {achievements.length} unlocked
            </span>
          </div>

          {achievementsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {achievements.map((achievement) => (
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
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Your Path</h2>
        </div>

        <div className="relative">
          {/* Vertical Path Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 z-0">
            <div className="h-full bg-gradient-to-b from-purple-500/50 via-blue-500/50 to-cyan-500/50 rounded-full" />
          </div>

          {/* Location Cards */}
          <div className="space-y-8 relative z-10">
            {locations.map((location, index) => {
              const isActive = location.status === "active";
              const isCompleted = location.status === "completed";
              const isLocked = location.status === "locked";

              return (
                <div
                  key={location.id}
                  className="relative animate-fade-in"
                  style={{ animationDelay: `${(locations.length - index) * 150 + 400}ms` }}
                >
                  {/* Path Connector Dot */}
                  <div className={`absolute left-1/2 -translate-x-1/2 -top-4 w-4 h-4 rounded-full border-2 z-20
                    ${isCompleted ? 'bg-green-500 border-green-400' : 
                      isActive ? 'bg-cyan-500 border-cyan-400 animate-pulse shadow-lg shadow-cyan-500/50' : 
                      'bg-gray-600 border-gray-500'}`} 
                  />

                  {/* Location Card */}
                  <div
                    className={`relative mx-4 rounded-2xl overflow-hidden transition-all duration-500
                      ${isActive 
                        ? 'bg-gradient-to-br from-gray-900/90 to-gray-800/90 border-2 border-cyan-500/50 shadow-xl shadow-cyan-500/20' 
                        : isCompleted
                        ? 'bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-green-500/30'
                        : 'bg-gray-900/60 border border-gray-700/50'
                      }
                      backdrop-blur-xl
                    `}
                  >
                    {/* Locked Overlay */}
                    {isLocked && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-10 flex items-center justify-center">
                        <div className="text-center p-4">
                          <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-400">
                            {location.requiresLiveAccount 
                              ? "Unlock with Live Account" 
                              : `Complete ${locations[index + 1]?.name || 'previous phase'} to unlock`
                            }
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Card Content */}
                    <div className={`p-6 ${isLocked ? 'opacity-50' : ''}`}>
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-4xl">{location.emoji}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h2 className={`text-xl font-bold ${isActive ? 'text-cyan-400' : isCompleted ? 'text-green-400' : 'text-gray-400'}`}>
                                {location.name}
                              </h2>
                              {isActive && (
                                <span className="px-2 py-0.5 text-xs font-semibold bg-cyan-500 text-white rounded-full">
                                  Current
                                </span>
                              )}
                              {isCompleted && (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              )}
                            </div>
                            <p className="text-sm text-gray-400">{location.subtitle}</p>
                          </div>
                        </div>

                        {/* Progress Ring */}
                        {!isLocked && (
                          <div className="relative w-16 h-16">
                            <svg className="w-16 h-16 transform -rotate-90">
                              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none" className="text-gray-700" />
                              <circle
                                cx="32" cy="32" r="28"
                                stroke="currentColor" strokeWidth="4" fill="none"
                                strokeDasharray={`${2 * Math.PI * 28}`}
                                strokeDashoffset={`${2 * Math.PI * 28 * (1 - location.progress / 100)}`}
                                className={`${isCompleted ? 'text-green-500' : 'text-cyan-500'} transition-all duration-1000`}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className={`text-sm font-bold ${isCompleted ? 'text-green-400' : 'text-cyan-400'}`}>
                                {location.progress}%
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-gray-400 mb-4">{location.description}</p>

                      {!isLocked && (
                        <div className="text-xs text-gray-500 mb-4">
                          {location.completedVideos}/{location.totalVideos} videos completed
                        </div>
                      )}

                      {/* Video List */}
                      {isActive && location.videos.length > 0 && (
                        <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                          {location.videos.slice(0, 6).map((video) => (
                            <div
                              key={video.id}
                              className={`flex items-center gap-3 p-3 rounded-lg transition-colors
                                ${video.completed 
                                  ? 'bg-green-500/10 border border-green-500/20' 
                                  : video.inProgress 
                                  ? 'bg-cyan-500/10 border border-cyan-500/30' 
                                  : 'bg-gray-800/50 border border-gray-700/30'
                                }`}
                            >
                              {video.completed ? (
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                              ) : video.inProgress ? (
                                <Play className="w-5 h-5 text-cyan-400 flex-shrink-0 animate-pulse" />
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-gray-500 flex-shrink-0" />
                              )}
                              <span className={`text-sm flex-1 truncate
                                ${video.completed ? 'text-green-400' : video.inProgress ? 'text-cyan-400 font-medium' : 'text-gray-400'}`}>
                                {video.title}
                              </span>
                              {video.duration && (
                                <span className="text-xs text-gray-500">{formatDuration(video.duration)}</span>
                              )}
                              {video.inProgress && (
                                <span className="text-xs font-medium text-cyan-400 bg-cyan-500/20 px-2 py-0.5 rounded">
                                  CONTINUE
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Locked preview */}
                      {isLocked && location.videos.length > 0 && (
                        <div className="space-y-1 mb-4 opacity-60">
                          {location.videos.slice(0, 3).map((video) => (
                            <div key={video.id} className="flex items-center gap-2 text-sm text-gray-500">
                              <Lock className="w-3 h-3" />
                              <span className="truncate">{video.title}</span>
                            </div>
                          ))}
                          <p className="text-xs text-gray-600">...and {location.totalVideos - 3} more</p>
                        </div>
                      )}

                      {/* CTA Buttons */}
                      {isActive && (
                        <Button 
                          onClick={() => navigate("/videos")}
                          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold shadow-lg shadow-cyan-500/25"
                        >
                          Continue Learning
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      )}

                      {isCompleted && (
                        <Button 
                          variant="outline"
                          onClick={() => navigate("/videos")}
                          className="w-full border-green-500/30 text-green-400 hover:bg-green-500/10"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Review Videos
                        </Button>
                      )}

                      {isLocked && location.requiresLiveAccount && (
                        <Button 
                          className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-semibold z-20 relative"
                          onClick={() => window.open('https://nasrtrade.com', '_blank')}
                        >
                          Open Live Account
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom decorative element */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>🏔️ Keep climbing — your trading mastery awaits!</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyRoadmap;
