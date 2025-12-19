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

// Map actions to skills and XP amounts
const ACTION_SKILL_MAP: Record<string, { skillKey: string; xpAmount: number }> = {
  video_completed: { skillKey: "technical", xpAmount: 15 },
  video_watched: { skillKey: "technical", xpAmount: 15 },
  calculator_used: { skillKey: "money_management", xpAmount: 5 },
  diary_trade_created: { skillKey: "risk", xpAmount: 10 },
  diary_trade_updated: { skillKey: "risk", xpAmount: 3 },
  stock_analyzer_used: { skillKey: "fundamental", xpAmount: 8 },
  mentor_message_sent: { skillKey: "mindset", xpAmount: 2 },
  mentor_message: { skillKey: "mindset", xpAmount: 2 },
};

// Calculate skill level from XP (100 XP per level)
function calcSkillLevel(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

/**
 * Award skill-specific XP by upserting into user_skills table
 */
async function awardSkillXp(profileId: string, skillKey: string, xpAmount: number): Promise<void> {
  try {
    // Get skill ID from key
    const { data: skill, error: skillError } = await supabase
      .from("skills")
      .select("id")
      .eq("key", skillKey)
      .maybeSingle();

    if (skillError || !skill) {
      console.warn(`Skill not found for key: ${skillKey}`, skillError);
      return;
    }

    // Check if user_skill record exists
    const { data: existingSkill, error: fetchError } = await supabase
      .from("user_skills")
      .select("id, xp, level")
      .eq("user_id", profileId)
      .eq("skill_id", skill.id)
      .maybeSingle();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error fetching user_skill:", fetchError);
      return;
    }

    if (existingSkill) {
      // Update existing record
      const newXp = (existingSkill.xp || 0) + xpAmount;
      const newLevel = calcSkillLevel(newXp);

      const { error: updateError } = await supabase
        .from("user_skills")
        .update({ xp: newXp, level: newLevel })
        .eq("id", existingSkill.id);

      if (updateError) {
        console.error("Error updating user_skill:", updateError);
      } else {
        console.log(`Skill XP awarded: ${skillKey} +${xpAmount} XP (total: ${newXp}, level: ${newLevel})`);
      }
    } else {
      // Insert new record
      const newLevel = calcSkillLevel(xpAmount);

      const { error: insertError } = await supabase
        .from("user_skills")
        .insert({
          user_id: profileId,
          skill_id: skill.id,
          xp: xpAmount,
          level: newLevel,
        });

      if (insertError) {
        console.error("Error inserting user_skill:", insertError);
      } else {
        console.log(`Skill XP created: ${skillKey} +${xpAmount} XP (level: ${newLevel})`);
      }
    }
  } catch (err) {
    console.error("awardSkillXp error:", err);
  }
}

/**
 * Hook to log user events and award XP via Supabase RPC.
 * Also awards skill-specific XP based on action type.
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

        // Get profile ID for skill XP
        const { data: publicUser } = await supabase
          .from("users")
          .select("id")
          .eq("auth_user_id", user.id)
          .maybeSingle();

        // Map action to award_xp event_type
        const xpEventType = action === "video_completed" ? "video_watched" : action;

        // Call award_xp RPC to log event and award XP
        const { data, error } = await supabase.rpc("award_xp", {
          p_auth_user_id: user.id,
          p_action_key: xpEventType,
          p_meta: JSON.parse(JSON.stringify(meta)) as Json,
        });

        if (error) {
          console.error("useLogEvent award_xp error:", error);
          return;
        }

        console.log(`Event logged with XP: ${action}`, data);

        // Award skill-specific XP if profile exists and action has a skill mapping
        if (publicUser?.id) {
          const skillMapping = ACTION_SKILL_MAP[action] || ACTION_SKILL_MAP[xpEventType];
          if (skillMapping) {
            await awardSkillXp(publicUser.id, skillMapping.skillKey, skillMapping.xpAmount);
          }
        }

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
