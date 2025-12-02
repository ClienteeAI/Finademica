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
      // Get user from localStorage (app uses separate keys)
      const email = localStorage.getItem("email");
      const firstName = localStorage.getItem("firstName");
      const lastName = localStorage.getItem("lastName");
      const clientId = localStorage.getItem("client_id");

      let userData = null;
      
      // Try to fetch full user profile if email exists
      if (email) {
        const { data, error } = await supabase
          .from("users")
          .select("*, clients(*)")
          .eq("email", email)
          .maybeSingle();

        if (!error && data) {
          userData = data;
        }
      }

      // Fetch video details
      const { data: videoData, error: videoError } = await supabase
        .from("videos")
        .select("id, title, category, duration_seconds, video_url")
        .eq("id", videoId)
        .maybeSingle();

      if (videoError) {
        console.error("Error fetching video data:", videoError);
      }

      const payload = {
        event_type: "video_completed",
        timestamp: new Date().toISOString(),
        user: userData ? {
          id: userData.id,
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone: userData.phone,
          client_id: userData.client_id,
          quiz_answers: userData.quiz_answers,
          lead_score: userData.lead_score,
          login_count: userData.login_count,
          created_at: userData.created_at,
        } : {
          email: email || "anonymous",
          first_name: firstName || null,
          last_name: lastName || null,
          client_id: clientId || null,
        },
        client: userData?.clients ? {
          id: (userData.clients as any).id,
          company_name: (userData.clients as any).company_name,
          subdomain: (userData.clients as any).subdomain,
        } : null,
        video: videoData ? {
          id: videoData.id,
          title: videoData.title,
          category: videoData.category,
          duration_seconds: videoData.duration_seconds,
          video_url: videoData.video_url,
        } : {
          id: videoId,
        },
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

      toast({
        title: "Lesson completed",
        description: "XP gained! Keep learning to level up.",
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
