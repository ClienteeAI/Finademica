import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string | null;
  key: string;
  points: number;
  unlocked_at?: string | null;
}

interface AchievementWithStatus extends Achievement {
  status: "unlocked" | "in_progress" | "locked";
  progress?: number;
}

export const useAchievements = () => {
  const [achievements, setAchievements] = useState<AchievementWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [videosCompleted, setVideosCompleted] = useState(0);
  const [userLevel, setUserLevel] = useState(1);

  const fetchAchievements = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
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
      setLoading(false);
      return;
    }

    try {
      // Fetch all achievements
      const { data: allAchievements, error: achievementError } = await supabase
        .from("achievements")
        .select("*");

      if (achievementError) throw achievementError;

      // Fetch user's unlocked achievements
      const { data: userAchievements, error: userAchError } = await supabase
        .from("user_achievements")
        .select("achievement_id, unlocked_at")
        .eq("user_id", userId);

      if (userAchError) throw userAchError;

      // Fetch user stats for progress calculation
      const { data: userStats } = await supabase
        .from("user_stats")
        .select("videos_completed, level")
        .eq("user_id", userId)
        .maybeSingle();

      const completedVideos = userStats?.videos_completed || 0;
      const level = userStats?.level || 1;
      setVideosCompleted(completedVideos);
      setUserLevel(level);

      // Create a map of unlocked achievement IDs
      const unlockedMap = new Map(
        userAchievements?.map((ua) => [ua.achievement_id, ua.unlocked_at]) || []
      );

      // Calculate progress thresholds based on achievement keys
      const getProgressForAchievement = (key: string): { status: "unlocked" | "in_progress" | "locked"; progress?: number } => {
        if (unlockedMap.has(key)) {
          return { status: "unlocked" };
        }

        // Video-based achievements
        if (key === "first_steps") {
          if (completedVideos >= 1) return { status: "in_progress", progress: 100 };
          return { status: "locked" };
        }
        if (key === "video_viewer") {
          if (completedVideos >= 1) return { status: "in_progress", progress: Math.min((completedVideos / 5) * 100, 100) };
          return { status: "locked" };
        }
        if (key === "knowledge_seeker") {
          if (completedVideos >= 1) return { status: "in_progress", progress: Math.min((completedVideos / 10) * 100, 100) };
          return { status: "locked" };
        }
        if (key === "dedicated_learner") {
          if (completedVideos >= 5) return { status: "in_progress", progress: Math.min((completedVideos / 25) * 100, 100) };
          return { status: "locked" };
        }
        if (key === "master_student") {
          if (completedVideos >= 10) return { status: "in_progress", progress: Math.min((completedVideos / 50) * 100, 100) };
          return { status: "locked" };
        }

        // Level-based achievements
        if (key === "advanced_trader") {
          if (level >= 3) return { status: "in_progress", progress: Math.min((level / 5) * 100, 100) };
          return { status: "locked" };
        }
        if (key === "master_trader") {
          if (level >= 5) return { status: "in_progress", progress: Math.min((level / 10) * 100, 100) };
          return { status: "locked" };
        }

        return { status: "locked" };
      };

      // Map achievements with status
      const achievementsWithStatus: AchievementWithStatus[] = (allAchievements || []).map((achievement) => {
        const unlockedAt = unlockedMap.get(achievement.id);
        const { status, progress } = getProgressForAchievement(achievement.key);

        return {
          ...achievement,
          unlocked_at: unlockedAt,
          status: unlockedAt ? "unlocked" : status,
          progress,
        };
      });

      // Sort: unlocked first, then in_progress, then locked
      achievementsWithStatus.sort((a, b) => {
        const order = { unlocked: 0, in_progress: 1, locked: 2 };
        return order[a.status] - order[b.status];
      });

      setAchievements(achievementsWithStatus);
    } catch (error) {
      console.error("Error fetching achievements:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  return { achievements, loading, refetch: fetchAchievements, videosCompleted, userLevel };
};
