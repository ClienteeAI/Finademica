import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

// Fallback level names if DB doesn't have them
const FALLBACK_LEVEL_NAMES: Record<number, string> = {
  1: "Rookie",
  2: "Explorer",
  3: "Grinder",
  4: "Strategist",
  5: "Technician",
  6: "Risk Manager",
  7: "Execution Pro",
  8: "Consistency King",
  9: "Funded Ready",
  10: "Master Trader",
};

interface GamificationState {
  xp: number; // Renamed from xpTotal for clarity - this is experience_points
  level: number;
  levelName: string;
  streakDays: number;
  totalAchievementsUnlocked: number;
  videosCompleted: number;
  currentLevelXp: number;
  nextLevelXp: number;
  isLoading: boolean;
  error: string | null;
}

const DEFAULT_STATE: GamificationState = {
  xp: 0,
  level: 1,
  levelName: "Rookie",
  streakDays: 0,
  totalAchievementsUnlocked: 0,
  videosCompleted: 0,
  currentLevelXp: 0,
  nextLevelXp: 100,
  isLoading: true,
  error: null,
};

/**
 * Hook to read gamification state from Supabase.
 * Frontend is READ-ONLY - all XP/level calculations happen in the database.
 * 
 * Data flow:
 * 1. Get auth.uid() from Supabase Auth
 * 2. Fetch public.users row by auth_user_id to get profile_id
 * 3. Fetch public.user_gamification by user_id = profile_id
 * 4. Determine level from xp_levels table (highest level where min_xp <= xp_total)
 * 5. Get level name from xp_levels.title or fallback
 */
export function useGamification() {
  const [state, setState] = useState<GamificationState>(DEFAULT_STATE);

  const fetchGamification = useCallback(async () => {
    try {
      // Step 1: Get authenticated user (auth.uid())
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setState(prev => ({ ...prev, isLoading: false, error: "Not authenticated" }));
        return;
      }

      let profileId = user.id; // Fallback to auth ID
      
      // Step 2: Get public.users.id (profile_id) from auth_user_id
      const { data: publicUser, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (!userError && publicUser?.id) {
        profileId = publicUser.id;
      } else if (userError) {
        console.warn("Could not fetch profile from public.users (potentially RLS), using auth.uid:", userError);
      }

      // Step 3: Fetch user_gamification by user_id = profile_id
      // Read xp (the active XP column)
      const { data: gamification, error: gamError } = await supabase
        .from("user_gamification")
        .select("xp, streak_days, level")
        .eq("user_id", profileId)
        .maybeSingle();

      if (gamError) {
        console.error("Error fetching gamification:", gamError);
        setState(prev => ({ ...prev, isLoading: false, error: "Failed to load progress" }));
        return;
      }

      // Use xp as the single source of truth for XP
      const xp = Number(gamification?.xp ?? 0);
      const streakDays = gamification?.streak_days ?? 0;

      // Step 4: Get all xp_levels to determine current and next level
      const { data: allLevels } = await supabase
        .from("xp_levels")
        .select("level, min_xp, title")
        .order("level", { ascending: true });

      // Determine current level: highest level where min_xp <= xp
      let currentLevel = 1;
      let levelName = FALLBACK_LEVEL_NAMES[1];
      let currentLevelXp = 0;
      let nextLevelXp = 100; // Default for level 1 -> 2

      if (allLevels && allLevels.length > 0) {
        for (const lvl of allLevels) {
          if (lvl.min_xp <= xp) {
            currentLevel = lvl.level;
            levelName = lvl.title || FALLBACK_LEVEL_NAMES[lvl.level] || `Level ${lvl.level}`;
            currentLevelXp = lvl.min_xp;
          }
        }
        // Find next level threshold
        const nextLevel = allLevels.find(lvl => lvl.level === currentLevel + 1);
        if (nextLevel) {
          nextLevelXp = nextLevel.min_xp;
        } else {
          // If at max level, set next threshold high
          nextLevelXp = currentLevelXp + 500;
        }
      }

      // Step 5: Get achievements count
      const { count: achievementCount } = await supabase
        .from("user_achievements")
        .select("*", { count: "exact", head: true })
        .eq("user_id", profileId);

      // Step 6: Get videos completed count
      const { count: videoCount } = await supabase
        .from("video_views")
        .select("*", { count: "exact", head: true })
        .eq("user_id", profileId)
        .eq("status", "completed");

      setState({
        xp,
        level: currentLevel,
        levelName,
        streakDays,
        totalAchievementsUnlocked: achievementCount ?? 0,
        videosCompleted: videoCount ?? 0,
        currentLevelXp,
        nextLevelXp,
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
