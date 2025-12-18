import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Video, Flame, Target, Zap } from "lucide-react";
import { useClient } from "@/lib/clientContext";
import { supabase } from "@/integrations/supabase/client";
import AchievementCard from "@/components/AchievementCard";
import { useAchievements } from "@/hooks/useAchievements";
import XPProgressBar from "@/components/XPProgressBar";
import { useGamification } from "@/hooks/useGamification";

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
        // Fetch user stats for videos completed
        const { data: stats } = await supabase
          .from("user_stats")
          .select("videos_completed")
          .eq("user_id", userId)
          .maybeSingle();

        // Calculate total videos for completion rate
        const { count: totalVideos } = await supabase
          .from("videos")
          .select("*", { count: "exact", head: true })
          .eq("is_active", true);

        const videosWatched = stats?.videos_completed || 0;
        const completionRate = totalVideos ? Math.round((videosWatched / totalVideos) * 100) : 0;

        setVideoStats({
          videosWatched,
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
            <source src="/nasr-progress-background.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-nasr-bg/70 via-nasr-bg/85 to-nasr-bg" />
        </div>
      )}
      
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Your Progress</h1>
          <p className="text-muted-foreground">Track your learning journey</p>
        </div>

        {/* Level & XP Summary - Two small cards side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Level Card */}
          <Card className="p-5 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-700/50">
            {isPageLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-3 w-24" />
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
          </Card>

          {/* XP Card */}
          <Card className="p-5 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-700/50">
            {isPageLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-2 w-full mt-2" />
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
          </Card>
        </div>

        {/* Videos & Completion Summary - Two small cards side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Videos Watched Card */}
          <Card className="p-5 text-center">
            {isPageLoading ? (
              <Skeleton className="h-20 rounded-xl" />
            ) : (
              <>
                <Video className="h-8 w-8 mx-auto text-primary mb-2" />
                <p className="text-3xl font-bold text-foreground">{videoStats.videosWatched}</p>
                <p className="text-sm text-muted-foreground">Videos Completed</p>
                {videoStats.totalVideos > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    out of {videoStats.totalVideos} available
                  </p>
                )}
              </>
            )}
          </Card>

          {/* Completion Rate Card */}
          <Card className="p-5 text-center">
            {isPageLoading ? (
              <Skeleton className="h-20 rounded-xl" />
            ) : (
              <>
                <Trophy className="h-8 w-8 mx-auto text-primary mb-2" />
                <p className="text-3xl font-bold text-foreground">{videoStats.completionRate}%</p>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                {videoStats.videosWatched === 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Watch your first video to start
                  </p>
                )}
              </>
            )}
          </Card>
        </div>

        {/* Learning Streak - Minimal, neutral messaging */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30 flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Learning Streak</p>
                <p className="text-xs text-muted-foreground">
                  {streakDays > 0 
                    ? `${streakDays} day${streakDays !== 1 ? 's' : ''} and counting!`
                    : "Watch a video daily to build your streak"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">{streakDays}</p>
              <p className="text-xs text-muted-foreground">days</p>
            </div>
          </div>
        </Card>

        {/* Achievements - Only completed achievements */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Trophy className="h-6 w-6 text-primary" />
              Achievements
            </h2>
          </div>

          {achievementsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-xl" />
              ))}
            </div>
          ) : completedAchievements.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {completedAchievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  status="unlocked"
                />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Trophy className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No achievements yet. Keep learning!</p>
            </Card>
          )}
        </div>

        {/* Watch History - Simplified */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" />
            Continue Learning
          </h2>
          <Card className="p-6 text-center">
            {videoStats.videosWatched === 0 ? (
              <>
                <p className="text-muted-foreground mb-4">Start watching videos to track your progress</p>
                <Link to="/videos">
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-500">
                    Browse Videos
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <p className="text-muted-foreground mb-4">
                  You've completed {videoStats.videosWatched} video{videoStats.videosWatched !== 1 ? 's' : ''}
                </p>
                <Link to="/videos">
                  <Button variant="outline">Continue Learning</Button>
                </Link>
              </>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Progress;