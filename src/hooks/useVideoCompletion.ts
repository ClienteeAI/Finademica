import { useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const WEBHOOK_URL = "https://clientee.app.n8n.cloud/webhook-test/14bc5880-e57c-44ce-9980-5caf53bf2e53";

export const useVideoCompletion = (videoId: string | undefined) => {
  const hasTriggeredRef = useRef(false);

  const handleVideoEnd = useCallback(async () => {
    // Prevent duplicate triggers for the same end event
    if (hasTriggeredRef.current || !videoId) return;
    hasTriggeredRef.current = true;

    try {
      // Get the current authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log("No authenticated user found, skipping video completion event");
        hasTriggeredRef.current = false;
        return;
      }

      const payload = {
        user_id: user.id,
        video_id: videoId,
        event_type: "video_completed"
      };

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast({
          title: "Lesson completed",
          description: "XP gained! Keep learning to level up.",
          duration: 3000
        });
      }
    } catch (error) {
      // Silently log error, don't block user experience
      console.error("Failed to send video completion event:", error);
    }
  }, [videoId]);

  const resetCompletion = useCallback(() => {
    // Allow re-triggering if video is replayed
    hasTriggeredRef.current = false;
  }, []);

  return { handleVideoEnd, resetCompletion };
};
