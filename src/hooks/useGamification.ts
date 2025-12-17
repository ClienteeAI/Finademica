import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface GamificationState {
  xpTotal: number;
  level: number;
  levelName: string;
  streakDays: number;
  totalAchievementsUnlocked: number;
  videosCompleted: number;
  isLoading: boolean;
  error: string | null;
}

const DEFAULT_STATE: GamificationState = {
  xpTotal: 0,
  level: 1,
  levelName: "Beginner Trader",
  streakDays: 0,
  totalAchievementsUnlocked: 0,
  videosCompleted: 0,
  isLoading: true,
  error: null,
};

/**
 * Hook to read gamification state from Supabase.
 * Frontend is READ-ONLY - all XP/level calculations happen in the database.
 */
export function useGamification() {
  const [state, setState] = useState<GamificationState>(DEFAULT_STATE);

  const fetchGamification = useCallback(async () => {
    try {
      // Get authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setState(prev => ({ ...prev, isLoading: false, error: "Not authenticated" }));
        return;
      }

      // Read from v_user_gamification_auth view (single source of truth)
      const { data: gamification, error: gamError } = await supabase
        .from("v_user_gamification_auth")
        .select("*")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (gamError) {
        console.error("Error fetching gamification:", gamError);
        setState(prev => ({ ...prev, isLoading: false, error: "Failed to load progress" }));
        return;
      }

      const level = gamification?.level ?? 1;
      const xpTotal = Number(gamification?.xp_total ?? 0);
      const streakDays = gamification?.streak_days ?? 0;

      // Get level name from xp_levels table
      const { data: levelData } = await supabase
        .from("xp_levels")
        .select("title")
        .eq("level", level)
        .maybeSingle();

      const levelName = levelData?.title ?? `Level ${level} Trader`;

      // Get achievements count from user_achievements via user_id
      let totalAchievementsUnlocked = 0;
      let videosCompleted = 0;

      if (gamification?.user_id) {
        const { count: achievementCount } = await supabase
          .from("user_achievements")
          .select("*", { count: "exact", head: true })
          .eq("user_id", gamification.user_id);

        totalAchievementsUnlocked = achievementCount ?? 0;

        // Get videos completed count
        const { count: videoCount } = await supabase
          .from("video_views")
          .select("*", { count: "exact", head: true })
          .eq("user_id", gamification.user_id)
          .eq("status", "completed");

        videosCompleted = videoCount ?? 0;
      }

      setState({
        xpTotal,
        level,
        levelName,
        streakDays,
        totalAchievementsUnlocked,
        videosCompleted,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      console.error("Gamification fetch error:", err);
      setState(prev => ({ ...prev, isLoading: false, error: "Failed to load progress" }));
    }
  }, []);

  useEffect(() => {
    fetchGamification();
  }, [fetchGamification]);

  return {
    ...state,
    refetch: fetchGamification,
  };
}
