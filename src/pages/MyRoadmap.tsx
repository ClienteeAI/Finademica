import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Lock, Play, ChevronRight } from "lucide-react";
import { useClient } from "@/lib/clientContext";
import { supabase } from "@/integrations/supabase/client";

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

const MyRoadmap = () => {
  const navigate = useNavigate();
  const { client } = useClient();
  const isNasrTheme = client?.subdomain === 'nasr';
  const [locations, setLocations] = useState<MountainLocation[]>([]);
  const [userLevel, setUserLevel] = useState({ level: 1, title: "Beginner Trader", xp: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const quizCompleted = localStorage.getItem("quizCompleted");
    if (!isLoggedIn || !quizCompleted) {
      navigate("/");
      return;
    }

    const fetchRoadmapData = async () => {
      const userId = localStorage.getItem("userId");
      
      // Fetch user stats for level/XP
      if (userId) {
        const { data: stats } = await supabase
          .from("user_stats")
          .select("total_points, level")
          .eq("user_id", userId)
          .maybeSingle();
        
        if (stats) {
          const levelTitles = ["Beginner Trader", "Learning Trader", "Apprentice Trader", "Skilled Trader", "Expert Trader", "Master Trader"];
          setUserLevel({
            level: stats.level || 1,
            title: levelTitles[Math.min((stats.level || 1) - 1, levelTitles.length - 1)],
            xp: stats.total_points || 0
          });
        }
      }

      // Fetch video recommendations and completion status
      if (userId) {
        const { data: recommendations } = await supabase
          .from("user_video_recommendations")
          .select(`
            video_id,
            tier,
            priority
          `)
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

        // Group recommendations by tier/priority ranges
        const freeVideos = recommendations?.filter(r => r.tier === 'free_to_watch') || [];
        const lockedVideos = recommendations?.filter(r => r.tier === 'preview_only') || [];

        // Map video data
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

        // Mark first incomplete video as in progress
        const firstIncomplete = freeVideoSteps.findIndex(v => !v.completed);
        if (firstIncomplete !== -1) {
          freeVideoSteps[firstIncomplete].inProgress = true;
        }

        // Split free videos into two phases
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
      } else {
        // Default state for no user
        setLocations([
          {
            id: 4,
            name: "MASTER SUMMIT",
            emoji: "⛰️",
            subtitle: "Elite Mastery",
            description: "Professional institutional tactics",
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
            description: "Richard Dennis, Game Theory, VWAP",
            status: "locked",
            requiresLiveAccount: true,
            progress: 0,
            totalVideos: 35,
            completedVideos: 0,
            videos: []
          },
          {
            id: 2,
            name: "SKILLS VALLEY",
            emoji: "⛺",
            subtitle: "Building Foundation",
            description: "Chart patterns & indicators",
            status: "locked",
            progress: 0,
            totalVideos: 7,
            completedVideos: 0,
            videos: []
          },
          {
            id: 1,
            name: "BASE CAMP",
            emoji: "🏕️",
            subtitle: "Phase 1: Foundations",
            description: "Start your journey",
            status: "active",
            progress: 0,
            totalVideos: 8,
            completedVideos: 0,
            videos: []
          }
        ]);
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

  const getActiveLocation = () => locations.find(l => l.status === "active");

  return (
    <DashboardLayout>
      {/* Nasr Theme Background */}
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

      <div className="max-w-3xl mx-auto relative z-10 pb-12">
        {/* Header Section */}
        <div className="text-center space-y-3 mb-10 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Your Trading Journey
          </h1>
          <p className="text-muted-foreground">
            Climb to trading mastery — one phase at a time
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
            <span className="text-cyan-400 font-semibold">Level {userLevel.level}</span>
            <span className="text-muted-foreground">—</span>
            <span className="text-foreground font-medium">{userLevel.title}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-purple-400 font-semibold">{userLevel.xp.toLocaleString()} XP</span>
          </div>
        </div>

        {/* Mountain Path */}
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
                  className={`relative animate-fade-in`}
                  style={{ animationDelay: `${(locations.length - index) * 150}ms` }}
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
                            <p className="text-sm text-muted-foreground">{location.subtitle}</p>
                          </div>
                        </div>

                        {/* Progress Ring */}
                        {!isLocked && (
                          <div className="relative w-16 h-16">
                            <svg className="w-16 h-16 transform -rotate-90">
                              <circle
                                cx="32"
                                cy="32"
                                r="28"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                                className="text-gray-700"
                              />
                              <circle
                                cx="32"
                                cy="32"
                                r="28"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
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

                      {/* Description */}
                      <p className="text-sm text-muted-foreground mb-4">{location.description}</p>

                      {/* Stats */}
                      {!isLocked && (
                        <div className="text-xs text-muted-foreground mb-4">
                          {location.completedVideos}/{location.totalVideos} videos completed
                        </div>
                      )}

                      {/* Video List - Only for active location */}
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
                                ${video.completed ? 'text-green-400' : video.inProgress ? 'text-cyan-400 font-medium' : 'text-muted-foreground'}`}>
                                {video.title}
                              </span>
                              {video.duration && (
                                <span className="text-xs text-muted-foreground">{formatDuration(video.duration)}</span>
                              )}
                              {video.inProgress && (
                                <span className="text-xs font-medium text-cyan-400 bg-cyan-500/20 px-2 py-0.5 rounded">
                                  CONTINUE
                                </span>
                              )}
                            </div>
                          ))}
                          {location.videos.length > 6 && (
                            <p className="text-xs text-muted-foreground text-center py-2">
                              +{location.videos.length - 6} more videos
                            </p>
                          )}
                        </div>
                      )}

                      {/* Locked preview videos */}
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

                      {/* CTA Button */}
                      {isActive && (
                        <Button 
                          onClick={() => navigate("/videos")}
                          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40"
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
        <div className="mt-12 text-center text-muted-foreground text-sm">
          <p>🏔️ Keep climbing — your trading mastery awaits!</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyRoadmap;
