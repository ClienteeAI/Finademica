import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

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
 * Hook to log user events and award XP via Supabase RPC.
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

        // Map action to award_xp event_type
        const xpEventType = action === "video_completed" ? "video_watched" : action;

        // Call award_xp RPC to log event and award XP
        const { data, error } = await supabase.rpc("award_xp", {
          p_event_type: xpEventType,
          p_ref_id: meta.video_id || meta.trade_id || null,
          p_meta: JSON.parse(JSON.stringify(meta)) as Json,
        });

        if (error) {
          console.error("useLogEvent award_xp error:", error);
          return;
        }

        console.log(`Event logged with XP: ${action}`, data);

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
