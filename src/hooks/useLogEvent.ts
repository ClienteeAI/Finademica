import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

type EventAction =
  | "video_completed"
  | "calculator_used"
  | "diary_trade_created"
  | "diary_trade_updated"
  | "diary_trade_deleted"
  | "stock_analyzer_used"
  | "mentor_message_sent";

interface EventMeta {
  video_id?: string;
  video_title?: string;
  symbol?: string;
  side?: string;
  lots_final?: number;
  risk_total_usd?: number;
  trade_id?: string;
  rr_ratio?: number;
  fields_changed?: string[];
  timeframe?: string;
  message_length?: number;
  [key: string]: unknown;
}

/**
 * Hook to log user events to public.user_events table.
 * Call `logEvent` after any trackable user action.
 * Call `onEventLogged` callback to trigger gamification refresh.
 */
export function useLogEvent(onEventLogged?: () => void) {
  const logEvent = useCallback(
    async (action: EventAction, meta: EventMeta = {}) => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.warn("useLogEvent: No authenticated user");
          return;
        }

        // Get public.users.id from auth_user_id
        const { data: publicUser } = await supabase
          .from("users")
          .select("id")
          .eq("auth_user_id", user.id)
          .maybeSingle();

        if (!publicUser?.id) {
          console.warn("useLogEvent: No public user found");
          return;
        }

        // Insert event into user_events table
        const { error } = await supabase.from("user_events").insert({
          auth_user_id: user.id,
          user_id: publicUser.id,
          event_type: action,
          event_value: JSON.stringify(meta),
          points: 0, // Points are handled by DB triggers
        });

        if (error) {
          console.error("useLogEvent insert error:", error);
          return;
        }

        console.log(`Event logged: ${action}`, meta);

        // Trigger callback to refresh gamification widget
        if (onEventLogged) {
          onEventLogged();
        }
      } catch (err) {
        console.error("useLogEvent error:", err);
      }
    },
    [onEventLogged]
  );

  return { logEvent };
}
