import { useRef, useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

const XP_PER_VIDEO = 25; // XP awarded per video completion

// Dispatch custom event for XP gain (listened by XPGainToastProvider)
const dispatchXPGainEvent = (xpAmount: number, title?: string) => {
  window.dispatchEvent(new CustomEvent('xp-gain', { 
    detail: { xpAmount, title } 
  }));
};

// Dispatch custom event for level-up (listened by XPGainToastProvider)
const dispatchLevelUpEvent = (level: number) => {
  window.dispatchEvent(new CustomEvent('level-up', { 
    detail: { level } 
  }));
};

// Calculate level from XP using xp_levels thresholds
const calculateLevelFromXP = (xp: number): number => {
  const thresholds = [0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700];
  let level = 1;
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (xp >= thresholds[i]) {
      level = i + 1;
      break;
    }
  }
  return Math.min(level, 10);
};

export const useVideoCompletion = (
  videoId: string | undefined, 
  videoTitle?: string,
  onEventLogged?: () => void
) => {
  const hasTriggeredRef = useRef(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const triggerConfetti = useCallback(() => {
    const colors = ["#22d3ee", "#3b82f6", "#a855f7", "#f59e0b"];
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors,
    });
  }, []);

  const handleVideoEnd = useCallback(async () => {
    if (hasTriggeredRef.current || !videoId || isCompleting) return;

    setIsCompleting(true);

    try {
      // 1. Get auth user ID
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        toast({
          title: "Authentication required",
          description: authError?.message || "Please log in to track your progress",
          variant: "destructive",
        });
        setIsCompleting(false);
        return;
      }

      const authUid = user.id;

      // 2. Get profile_id from public.users
      const { data: publicUser, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("auth_user_id", authUid)
        .maybeSingle();

      if (userError || !publicUser?.id) {
        toast({
          title: "User profile not found",
          description: userError?.message || "Could not find your user profile",
          variant: "destructive",
        });
        setIsCompleting(false);
        return;
      }

      const profileId = publicUser.id;

      // 3. Get current XP before completion to detect level-up
      const { data: gamificationBefore } = await supabase
        .from("user_gamification")
        .select("experience_points")
        .eq("user_id", profileId)
        .maybeSingle();

      const xpBefore = gamificationBefore?.experience_points ?? 0;
      const levelBefore = calculateLevelFromXP(xpBefore);

      // 4. Check if video_view exists, then insert or update
      const { data: existingView } = await supabase
        .from("video_views")
        .select("id")
        .eq("user_id", profileId)
        .eq("video_id", videoId)
        .maybeSingle();

      let viewError;
      if (existingView) {
        // Update existing record
        const { error } = await supabase
          .from("video_views")
          .update({
            status: "completed",
            completed_at: new Date().toISOString(),
          })
          .eq("id", existingView.id);
        viewError = error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from("video_views")
          .insert({
            user_id: profileId,
            video_id: videoId,
            status: "completed",
            completed_at: new Date().toISOString(),
          });
        viewError = error;
      }

      if (viewError) {
        console.error("Error upserting video_views:", viewError);
        toast({
          title: "Failed to save progress",
          description: viewError.message,
          variant: "destructive",
        });
        setIsCompleting(false);
        return;
      }

      // 5. Insert into user_events for XP tracking (ignore if already exists)
      const { error: eventError } = await supabase
        .from("user_events")
        .insert({
          auth_user_id: authUid,
          user_id: profileId,
          event_type: "video_completed",
          event_value: JSON.stringify({ 
            video_id: videoId, 
            video_title: videoTitle || "Unknown" 
          }),
          points: 0, // Points handled by DB triggers
        });

      // Don't fail if event already exists (duplicate completion)
      if (eventError && !eventError.message.includes("duplicate")) {
        console.warn("Event logging error:", eventError.message);
      }

      hasTriggeredRef.current = true;

      // 6. Success - show XP toast with animation and confetti
      triggerConfetti();
      dispatchXPGainEvent(XP_PER_VIDEO, "Lesson Complete!");

      // 7. Check for level-up after a brief delay (allow DB triggers to update)
      setTimeout(async () => {
        const { data: gamificationAfter } = await supabase
          .from("user_gamification")
          .select("experience_points")
          .eq("user_id", profileId)
          .maybeSingle();

        const xpAfter = gamificationAfter?.experience_points ?? xpBefore + XP_PER_VIDEO;
        const levelAfter = calculateLevelFromXP(xpAfter);

        if (levelAfter > levelBefore) {
          dispatchLevelUpEvent(levelAfter);
        }
      }, 500);

      // 8. Refresh XP widget
      if (onEventLogged) {
        onEventLogged();
      }

    } catch (error: any) {
      console.error("Failed to mark video as complete:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to mark video as complete",
        variant: "destructive",
      });
    } finally {
      setIsCompleting(false);
    }
  }, [videoId, videoTitle, triggerConfetti, onEventLogged, isCompleting]);

  const resetCompletion = useCallback(() => {
    hasTriggeredRef.current = false;
  }, []);

  return { 
    handleVideoEnd, 
    resetCompletion,
    isCompleting,
  };
};