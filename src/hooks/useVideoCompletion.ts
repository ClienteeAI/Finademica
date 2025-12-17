import { useRef, useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";
import { useLogEvent } from "@/hooks/useLogEvent";

const WEBHOOK_URL = "https://clientee.app.n8n.cloud/webhook-test/14bc5880-e57c-44ce-9980-5caf53bf2e53";

interface WebhookResponse {
  achievements_unlocked?: Array<{
    name: string;
    icon: string;
    description?: string;
  }>;
  level_up?: boolean;
  level?: number;
  points_earned?: number;
  already_completed?: boolean;
}

export const useVideoCompletion = (videoId: string | undefined, videoTitle?: string) => {
  const hasTriggeredRef = useRef(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState<WebhookResponse["achievements_unlocked"]>([]);
  const [levelUpData, setLevelUpData] = useState<{ show: boolean; level: number }>({ show: false, level: 0 });
  const { logEvent } = useLogEvent();

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
    if (hasTriggeredRef.current || !videoId) return;

    try {
      // Get user from Supabase Auth
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error("No authenticated user found");
        toast({
          title: "Error",
          description: "Please log in to track your progress",
          variant: "destructive",
        });
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
        return;
      }

      // Call Supabase complete_video function
      const { data: statsResult, error: statsError } = await supabase
        .rpc("complete_video", {
          p_user_id: userId,
          p_video_id: videoId,
          p_points: 25
        });

      if (statsError) {
        console.error("Error updating user stats:", statsError);
      }

      // Send webhook and get response
      const payload = {
        user: { id: userId },
        video: { id: videoId }
      };

      console.log("Sending video completion webhook:", payload);

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      hasTriggeredRef.current = true;

      // Log event to user_events
      await logEvent("video_completed", { video_id: videoId, video_title: videoTitle || "Unknown" });

      // Try to parse response for achievements
      let webhookResult: WebhookResponse = {};
      try {
        webhookResult = await response.json();
        console.log("Webhook response:", webhookResult);
      } catch (e) {
        console.log("Could not parse webhook response as JSON");
      }

      // Handle achievements
      if (webhookResult.achievements_unlocked && webhookResult.achievements_unlocked.length > 0) {
        setUnlockedAchievements(webhookResult.achievements_unlocked);
        webhookResult.achievements_unlocked.forEach((_, index) => {
          setTimeout(() => {
            triggerConfetti();
          }, index * 500);
        });
      }

      // Handle level up
      if (webhookResult.level_up && webhookResult.level) {
        setTimeout(() => {
          setLevelUpData({ show: true, level: webhookResult.level! });
          triggerConfetti();
        }, webhookResult.achievements_unlocked?.length ? webhookResult.achievements_unlocked.length * 500 + 500 : 500);
      }

      // Show XP toast if not already completed
      if (!webhookResult.already_completed) {
        const points = webhookResult.points_earned || 25;
        toast({
          title: "Lesson completed",
          description: `+${points} XP earned! Keep learning to level up.`,
          duration: 3000
        });
      } else {
        toast({
          title: "Already completed",
          description: "You've already completed this video.",
          duration: 3000
        });
      }
      
    } catch (error) {
      console.error("Failed to send video completion event:", error);
      toast({
        title: "Error",
        description: "Failed to mark video as complete",
        variant: "destructive",
      });
    }
  }, [videoId, triggerConfetti]);

  const resetCompletion = useCallback(() => {
    hasTriggeredRef.current = false;
  }, []);

  const dismissAchievement = useCallback((index: number) => {
    setUnlockedAchievements((prev) => prev?.filter((_, i) => i !== index));
  }, []);

  const dismissLevelUp = useCallback(() => {
    setLevelUpData({ show: false, level: 0 });
  }, []);

  return { 
    handleVideoEnd, 
    resetCompletion, 
    unlockedAchievements, 
    levelUpData,
    dismissAchievement,
    dismissLevelUp
  };
};
