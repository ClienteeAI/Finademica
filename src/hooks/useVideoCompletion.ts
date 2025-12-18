import { useRef, useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

const XP_PER_VIDEO = 25;

// Dispatch custom event for XP gain
const dispatchXPGainEvent = (xpAmount: number, title?: string) => {
  window.dispatchEvent(new CustomEvent('xp-gain', { 
    detail: { xpAmount, title } 
  }));
};

// Dispatch custom event for level-up
const dispatchLevelUpEvent = (level: number) => {
  window.dispatchEvent(new CustomEvent('level-up', { 
    detail: { level } 
  }));
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

      // 2. Get profile_id from public.users
      const { data: publicUser, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("auth_user_id", user.id)
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

      // 3. Get current level before completion to detect level-up
      const { data: gamificationBefore } = await supabase
        .from("user_gamification")
        .select("level")
        .eq("user_id", profileId)
        .maybeSingle();

      const levelBefore = gamificationBefore?.level ?? 1;

      // 4. Call the complete_video RPC - this handles EVERYTHING
      const { data: result, error: rpcError } = await supabase.rpc('complete_video', {
        p_user_id: profileId,
        p_video_id: videoId,
        p_points: XP_PER_VIDEO
      });

      if (rpcError) {
        console.error("Error calling complete_video RPC:", rpcError);
        toast({
          title: "Failed to save progress",
          description: rpcError.message,
          variant: "destructive",
        });
        setIsCompleting(false);
        return;
      }

      hasTriggeredRef.current = true;

      // 5. Check RPC response
      const rpcResult = result as {
        user_id: string;
        total_points: number;
        videos_completed: number;
        level: number;
        experience_points?: number;
        already_completed: boolean;
      };

      // 6. Only show celebration if NOT already completed
      if (!rpcResult.already_completed) {
        triggerConfetti();
        dispatchXPGainEvent(XP_PER_VIDEO, "Lesson Complete!");

        // Check for level-up
        if (rpcResult.level > levelBefore) {
          setTimeout(() => {
            dispatchLevelUpEvent(rpcResult.level);
          }, 500);
        }
      }

      // 7. Refresh XP widget regardless (to sync UI)
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
