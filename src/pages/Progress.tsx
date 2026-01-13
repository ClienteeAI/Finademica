import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Video, Target, Zap } from "lucide-react";
import { useClient } from "@/lib/clientContext";
import { supabase } from "@/integrations/supabase/client";
import AchievementCard from "@/components/AchievementCard";
import { useAchievements } from "@/hooks/useAchievements";
import XPProgressBar from "@/components/XPProgressBar";
import { useGamification } from "@/hooks/useGamification";
import StreakCelebration from "@/components/StreakCelebration";

const Progress = () => {
  const navigate = useNavigate();
  const { client } = useClient();
  const isNasrTheme = client?.subdomain === 'nasr';
  
  // Use the shared gamification hook for XP, level, streak
  const { xp, level, levelName, streakDays, currentLevelXp, nextLevelXp, isLoading: gamificationLoading } = useGamification();
  
  const [videoStats, setVideoStats] = useState({
    videosWatched: 0,
    totalVideos: 0,
    completionRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const { achievements, loading: achievementsLoading } = useAchievements();

  // Filter to only show completed/unlocked achievements
  const completedAchievements = achievements.filter(a => a.status === 'unlocked');

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      // Map auth user to public.users.id
      const { data: publicUser } = await supabase
        .from("users")
        .select("id")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      const userId = publicUser?.id;
      if (!userId) {
        console.error("No public user found for auth user");
        setLoading(false);
        return;
      }

      try {
        // Count completed videos directly from video_views table (same as Dashboard)
        const { count: videosWatched } = await supabase
          .from("video_views")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .eq("status", "completed");

        // Calculate total videos for completion rate
        const { count: totalVideos } = await supabase
          .from("videos")
          .select("*", { count: "exact", head: true })
          .eq("is_active", true);

        const watchedCount = videosWatched || 0;
        const completionRate = totalVideos ? Math.round((watchedCount / totalVideos) * 100) : 0;

        setVideoStats({
          videosWatched: watchedCount,
          totalVideos: totalVideos || 0,
          completionRate,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  const isPageLoading = loading || gamificationLoading;

  return (
    <SidebarLayout>
      {/* Video Background with proper overlay */}
      {isNasrTheme && (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute w-full h-full object-cover opacity-25"
          >
            <source src="/nasr-progress-background.mp4" type="video/mp4" />
          </video>
          {/* Enhanced overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/50 to-black/70" />
        </div>
      )}
      
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in relative z-10">
        {/* Header - with proper spacing below safe area */}
        <div className="text-center space-y-2 pt-2">
          <h1 className="text-3xl md:text-4xl font-bold text-high-contrast">Your Progress</h1>
          <p className="text-medium-contrast">Track your learning journey</p>
        </div>

        {/* Level & XP Summary - Two small cards side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Level Card - improved glass styling */}
          <div className="glass-card-dark p-5">
            {isPageLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-20 bg-white/10" />
                <Skeleton className="h-8 w-32 bg-white/10" />
                <Skeleton className="h-3 w-24 bg-white/10" />
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/30 to-purple-500/30 border border-cyan-500/50 flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Current Level</p>
                  <p className="text-2xl font-bold text-white">Level {level}</p>
                  <p className="text-sm text-cyan-400">{levelName}</p>
                </div>
              </div>
            )}
          </div>

          {/* XP Card - improved glass styling */}
          <div className="glass-card-dark p-5">
            {isPageLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-20 bg-white/10" />
                <Skeleton className="h-8 w-32 bg-white/10" />
                <Skeleton className="h-2 w-full mt-2 bg-white/10" />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/30 to-orange-500/30 border border-amber-500/50 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Experience Points</p>
                    <p className="text-2xl font-bold text-white">{xp.toLocaleString()} XP</p>
                  </div>
                </div>
                <XPProgressBar />
              </div>
            )}
          </div>
        </div>

        {/* Videos & Completion Summary - improved glass styling */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Videos Watched Card */}
          <div className="glass-card-dark p-5 text-center">
            {isPageLoading ? (
              <Skeleton className="h-20 rounded-xl bg-white/10" />
            ) : (
              <>
                <Video className="h-8 w-8 mx-auto text-cyan-400 mb-2" />
                <p className="text-3xl font-bold text-white">{videoStats.videosWatched}</p>
                <p className="text-sm text-gray-400">Videos Completed</p>
                {videoStats.totalVideos > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    out of {videoStats.totalVideos} available
                  </p>
                )}
              </>
            )}
          </div>

          {/* Completion Rate Card */}
          <div className="glass-card-dark p-5 text-center">
            {isPageLoading ? (
              <Skeleton className="h-20 rounded-xl bg-white/10" />
            ) : (
              <>
                <Trophy className="h-8 w-8 mx-auto text-amber-400 mb-2" />
                <p className="text-3xl font-bold text-white">{videoStats.completionRate}%</p>
                <p className="text-sm text-gray-400">Completion Rate</p>
                {videoStats.videosWatched === 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Watch your first video to start
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Learning Streak - With celebration animations */}
        <div className="glass-card-dark p-0 overflow-hidden rounded-2xl">
          <StreakCelebration streakDays={streakDays} isNasrTheme={isNasrTheme} />
        </div>

        {/* Achievements - Only completed achievements */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Trophy className="h-6 w-6 text-amber-400" />
              Achievements
            </h2>
          </div>

          {achievementsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-xl bg-white/10" />
              ))}
            </div>
          ) : completedAchievements.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {completedAchievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  status="unlocked"
                />
              ))}
            </div>
          ) : (
            <div className="glass-card-dark p-8 text-center rounded-2xl">
              <Trophy className="h-12 w-12 mx-auto text-gray-500 mb-3" />
              <p className="text-gray-400">No achievements yet. Keep learning!</p>
            </div>
          )}
        </div>

        {/* Continue Learning Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Video className="h-5 w-5 text-cyan-400" />
            Continue Learning
          </h2>
          <div className="glass-card-dark p-6 text-center rounded-2xl">
            {videoStats.videosWatched === 0 ? (
              <>
                <p className="text-gray-400 mb-4">Start watching videos to track your progress</p>
                <Link to="/videos">
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
                    Browse Videos
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <p className="text-gray-400 mb-4">
                  You've completed {videoStats.videosWatched} video{videoStats.videosWatched !== 1 ? 's' : ''}
                </p>
                <Link to="/videos">
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                    Continue Learning
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Progress;
