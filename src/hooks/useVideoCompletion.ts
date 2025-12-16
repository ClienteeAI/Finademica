import { useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const WEBHOOK_URL = "https://clientee.app.n8n.cloud/webhook-test/14bc5880-e57c-44ce-9980-5caf53bf2e53";

export const useVideoCompletion = (videoId: string | undefined) => {
  const hasTriggeredRef = useRef(false);

  const handleVideoEnd = useCallback(async () => {
    // Prevent duplicate triggers for the same end event
    if (hasTriggeredRef.current || !videoId) return;

    try {
      // Get user_id from localStorage - check multiple patterns
      let userId = localStorage.getItem("userId");
      
      // Fallback: check userData JSON object
      if (!userId) {
        const userDataStr = localStorage.getItem("userData");
        if (userDataStr) {
          try {
            const userData = JSON.parse(userDataStr);
            userId = userData.id || userData.userId;
          } catch (e) {
            console.error("Failed to parse userData from localStorage:", e);
          }
        }
      }

      // Fallback: try to get from Supabase using email
      if (!userId) {
        const email = localStorage.getItem("email");
        if (email) {
          const { data: userData } = await supabase
            .from("users")
            .select("id")
            .eq("email", email)
            .maybeSingle();
          
          if (userData?.id) {
            userId = userData.id;
            // Store for future use
            localStorage.setItem("userId", userId);
          }
        }
      }

      // Error if no user_id found
      if (!userId) {
        console.error("No user_id found - user may not be logged in");
        toast({
          title: "Error",
          description: "Please log in to track your progress",
          variant: "destructive",
        });
        return;
      }

      // Call Supabase complete_video function to update stats
      const { data: statsResult, error: statsError } = await supabase
        .rpc("complete_video", {
          p_user_id: userId,
          p_video_id: videoId,
          p_points: 25
        });

      if (statsError) {
        console.error("Error updating user stats:", statsError);
      } else {
        console.log("User stats updated:", statsResult);
      }

      // Send simplified webhook payload
      const payload = {
        user: {
          id: userId
        },
        video: {
          id: videoId
        }
      };

      console.log("Sending video completion webhook:", payload);

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      console.log("Webhook response status:", response.status);

      // Only mark as triggered after successful webhook
      hasTriggeredRef.current = true;

      toast({
        title: "Lesson completed",
        description: "+25 XP earned! Keep learning to level up.",
        duration: 3000
      });
      
    } catch (error) {
      console.error("Failed to send video completion event:", error);
      toast({
        title: "Error",
        description: "Failed to mark video as complete",
        variant: "destructive",
      });
    }
  }, [videoId]);

  const resetCompletion = useCallback(() => {
    hasTriggeredRef.current = false;
  }, []);

  return { handleVideoEnd, resetCompletion };
};
