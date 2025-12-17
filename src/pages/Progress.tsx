import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Video, Clock, TrendingUp, Lock, ChevronRight, Flame } from "lucide-react";
import { useClient } from "@/lib/clientContext";
import { supabase } from "@/integrations/supabase/client";
import AchievementCard from "@/components/AchievementCard";
import { useAchievements } from "@/hooks/useAchievements";
import XPProgressBar from "@/components/XPProgressBar";

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

const Progress = () => {
  const navigate = useNavigate();
  const { client } = useClient();
  const isNasrTheme = client?.subdomain === 'nasr';
  const [userStats, setUserStats] = useState({
    videosWatched: 0,
    totalWatchTime: "0h 0m",
    completionRate: 0,
    level: 1,
    xp: 0,
    streak: 0,
  });
  const [loading, setLoading] = useState(true);
  const { achievements, loading: achievementsLoading } = useAchievements();

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
        // Fetch user stats
        const { data: stats } = await supabase
          .from("user_stats")
          .select("videos_completed, total_points, level")
          .eq("user_id", userId)
          .maybeSingle();

        // Fetch gamification data
        const { data: gamification } = await supabase
          .from("user_gamification")
          .select("experience_points, level, streak_days")
          .eq("user_id", userId)
          .maybeSingle();

        // Calculate total videos for completion rate
        const { count: totalVideos } = await supabase
          .from("videos")
          .select("*", { count: "exact", head: true })
          .eq("is_active", true);

        const videosWatched = stats?.videos_completed || 0;
        const completionRate = totalVideos ? Math.round((videosWatched / totalVideos) * 100) : 0;
        
        // Estimate watch time (average 10 min per video)
        const totalMinutes = videosWatched * 10;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        setUserStats({
          videosWatched,
          totalWatchTime: `${hours}h ${minutes}m`,
          completionRate,
          level: gamification?.level || stats?.level || 1,
          xp: gamification?.experience_points || stats?.total_points || 0,
          streak: gamification?.streak_days || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  const levelName = LEVEL_NAMES[userStats.level] || `Level ${userStats.level} Trader`;

  const stats = [
    { label: "Videos Watched", value: userStats.videosWatched.toString(), icon: Video },
    { label: "Total Watch Time", value: userStats.totalWatchTime, icon: Clock },
    { label: "Completion Rate", value: `${userStats.completionRate}%`, icon: TrendingUp },
    { label: "Current Level", value: `Lv.${userStats.level}`, icon: Trophy },
  ];

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
      
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Your Progress</h1>
          <p className="text-muted-foreground">Track your learning journey</p>
        </div>

        {/* Top Stats Bar */}
        <Card className="p-6 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-700/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/30 to-purple-500/30 border border-cyan-500/50 flex items-center justify-center">
                  <span className="text-xl font-black text-cyan-400">{userStats.level}</span>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Level {userStats.level} - {levelName}</h2>
                <p className="text-sm text-gray-400">{userStats.xp.toLocaleString()} XP earned</p>
              </div>
            </div>

            {userStats.streak > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="font-bold text-orange-400">{userStats.streak} Day Streak</span>
              </div>
            )}
          </div>
          
          <XPProgressBar />
        </Card>

        {/* Overall Progress */}
        <Card className="p-8 text-center space-y-4 bg-gradient-to-br from-primary/10 to-purple/10">
          <div className="relative w-40 h-40 mx-auto">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 70}`}
                strokeDashoffset={`${2 * Math.PI * 70 * (1 - userStats.completionRate / 100)}`}
                className="text-primary transition-all duration-500"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold text-foreground">{userStats.completionRate}%</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {userStats.completionRate === 0 
                ? "You're just getting started!" 
                : userStats.completionRate < 25 
                ? "Great start! Keep going!"
                : userStats.completionRate < 50
                ? "You're making progress!"
                : userStats.completionRate < 75
                ? "Impressive dedication!"
                : "Almost there! Finish strong!"}
            </h2>
            <p className="text-muted-foreground">
              {userStats.videosWatched === 0 
                ? "Complete your first video to begin your journey"
                : `You've completed ${userStats.videosWatched} videos`}
            </p>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))
          ) : (
            stats.map((stat) => (
              <Card key={stat.label} className="p-6 text-center space-y-2">
                <stat.icon className="h-8 w-8 mx-auto text-primary" />
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            ))
          )}
        </div>

        {/* Achievements */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Trophy className="h-6 w-6 text-primary" />
              Achievements
            </h2>
            <Link to="/roadmap">
              <Button variant="ghost" size="sm" className="gap-1">
                View All in Roadmap
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {achievementsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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

        {/* Watch History */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Video className="h-6 w-6 text-primary" />
            Watch History
          </h2>
          <Card className="p-12 text-center space-y-4">
            {userStats.videosWatched === 0 ? (
              <>
                <Video className="h-16 w-16 text-muted-foreground mx-auto" />
                <div>
                  <p className="text-lg font-semibold text-foreground">No videos watched yet</p>
                  <p className="text-muted-foreground">Start learning to see your history here</p>
                </div>
                <Link to="/videos">
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-500">
                    Start Learning
                  </Button>
                </Link>
              </>
            ) : (
              <div>
                <p className="text-lg font-semibold text-foreground">
                  You've watched {userStats.videosWatched} videos
                </p>
                <p className="text-muted-foreground mb-4">
                  Total watch time: {userStats.totalWatchTime}
                </p>
                <Link to="/videos">
                  <Button variant="outline">Continue Learning</Button>
                </Link>
              </div>
            )}
          </Card>
        </div>

        {/* Learning Streak Calendar */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            🔥 Learning Streak
          </h2>
          <Card className="p-6">
            <div className="text-center space-y-4">
              <div>
                <p className="text-4xl font-bold text-foreground">{userStats.streak}</p>
                <p className="text-muted-foreground">Day Streak</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {userStats.streak === 0 
                  ? "Log in and watch videos daily to build your streak!"
                  : `Keep it up! Watch a video today to maintain your ${userStats.streak}-day streak.`}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Progress;
