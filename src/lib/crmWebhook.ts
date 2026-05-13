import { supabase } from "@/integrations/supabase/client";

const CRM_WEBHOOK_URL = "https://n8n.srv1474318.hstgr.cloud/webhook/all-inf-to-CRM-finademica";

export type CrmEventName = 
  | "user_login"
  | "video_completed"
  | "calculator_used"
  | "diary_trade_saved"
  | "mentor_message_sent";

export interface CrmUser {
  auth_user_id: string | null;
  user_id: string | null;
  email: string | null;
  phone: string | null;
  first_name: string | null;
  last_name: string | null;
  role: string | null;
  client_id: string | null;
  broker_key: string | null;
}

export interface CrmAction {
  type: string;
  entity: string;
  entity_id: string | null;
  data: Record<string, unknown>;
}

export interface CrmContext {
  page: string;
  device: "mobile" | "desktop";
  locale: string;
  ip: string | null;
}

export interface CrmEventPayload {
  event_name: CrmEventName;
  occurred_at: string;
  source: string;
  app: string;
  environment: string;
  user: CrmUser;
  action: CrmAction;
  context: CrmContext;
}

/**
 * Fetch current user info from Supabase auth + public.users
 */
export async function getCrmUser(): Promise<CrmUser> {
  const defaultUser: CrmUser = {
    auth_user_id: null,
    user_id: null,
    email: null,
    phone: null,
    first_name: null,
    last_name: null,
    role: null,
    client_id: null,
    broker_key: null,
  };

  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return defaultUser;
    }

    const authUser = session.user;
    defaultUser.auth_user_id = authUser.id;
    defaultUser.email = authUser.email || null;

    // Fetch user row from public.users
    const { data: userRow, error } = await supabase
      .from("users")
      .select("id, email, phone, first_name, last_name, role, client_id")
      .eq("auth_user_id", authUser.id)
      .maybeSingle();

    if (error) {
      console.warn("getCrmUser: Error fetching user row:", error);
      return defaultUser;
    }

    if (userRow) {
      return {
        auth_user_id: authUser.id,
        user_id: userRow.id || null,
        email: userRow.email || authUser.email || null,
        phone: userRow.phone || null,
        first_name: userRow.first_name || null,
        last_name: userRow.last_name || null,
        role: userRow.role || null,
        client_id: userRow.client_id || null,
        broker_key: "finademica_mt5", // Default broker key
      };
    }

    return defaultUser;
  } catch (err) {
    console.error("getCrmUser: Exception:", err);
    return defaultUser;
  }
}

/**
 * Get device type based on screen width
 */
function getDeviceType(): "mobile" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  return window.innerWidth < 768 ? "mobile" : "desktop";
}

/**
 * Get current context (page, device, locale)
 */
function getCrmContext(): CrmContext {
  return {
    page: typeof window !== "undefined" ? window.location.pathname : "/",
    device: getDeviceType(),
    locale: typeof navigator !== "undefined" ? navigator.language : "en-US",
    ip: null, // Cannot get client IP from frontend
  };
}

/**
 * Send CRM webhook event to n8n
 * This is fire-and-forget - errors are logged but don't block UI
 */
export async function sendCrmWebhook(
  eventName: CrmEventName,
  action: CrmAction,
  userOverride?: Partial<CrmUser>
): Promise<void> {
  try {
    const user = await getCrmUser();
    
    // Apply any overrides
    const finalUser: CrmUser = userOverride 
      ? { ...user, ...userOverride }
      : user;

    const payload: CrmEventPayload = {
      event_name: eventName,
      occurred_at: new Date().toISOString(),
      source: "lovable_app",
      app: "Finademica Academy",
      environment: "production",
      user: finalUser,
      action,
      context: getCrmContext(),
    };

    // Convert undefined to null in action.data
    const sanitizedPayload = JSON.parse(
      JSON.stringify(payload, (_, value) => (value === undefined ? null : value))
    );

    console.log(`🚀 [CRM] Attempting to send ${eventName} event to: ${CRM_WEBHOOK_URL}`);
    console.log(`[CRM] Payload:`, sanitizedPayload);

    const response = await fetch(CRM_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sanitizedPayload),
    });

    if (!response.ok) {
      console.error(`[CRM] Webhook failed: ${response.status} ${response.statusText}`);
    } else {
      console.log(`[CRM] Event ${eventName} sent successfully`);
    }

    // Optionally insert into crm_events table (if it exists)
    try {
      const { error: dbError } = await supabase.from("crm_events").insert({
        user_id: finalUser.user_id,
        client_id: finalUser.client_id,
        event_name: eventName,
        payload: sanitizedPayload
      });
      
      if (dbError) {
        console.warn("[CRM] Could not save to crm_events table:", dbError.message);
      } else {
        console.log("[CRM] Event successfully backed up to database.");
      }
    } catch (dbError) {
      console.log("[CRM] crm_events insert skipped:", dbError);
    }
  } catch (error) {
    // Never block UI - just log the error
    console.error(`[CRM] Error sending ${eventName} event:`, error);
  }
}

// ============ Convenience functions for each event type ============

/**
 * Send user_login event
 */
export async function sendUserLoginEvent(loginMethod: string = "password"): Promise<void> {
  await sendCrmWebhook("user_login", {
    type: "user_login",
    entity: "session",
    entity_id: null,
    data: {
      login_method: loginMethod,
      redirected_from: document.referrer || null,
    },
  });
}

/**
 * Send video_completed event
 */
export async function sendVideoCompletedEvent(
  videoId: string,
  videoTitle: string | null = null,
  watchTimeSeconds: number | null = null
): Promise<void> {
  await sendCrmWebhook("video_completed", {
    type: "video_completed",
    entity: "video",
    entity_id: videoId,
    data: {
      video_id: videoId,
      video_title: videoTitle,
      watch_time_seconds: watchTimeSeconds,
      completion_percent: 100,
    },
  });
}

/**
 * Send calculator_used event
 */
export async function sendCalculatorUsedEvent(
  formData: {
    broker_key?: string;
    symbol: string;
    side: string;
    entry_price: number | null;
    stop_loss_price: number | null;
    take_profit_price: number | null;
    risk_total_usd?: number | null;
    lots_final?: number | null;
  },
  results: {
    recommended_lots?: number | null;
    actual_risk_usd?: number | null;
    ticks_to_stop_loss?: number | null;
    risk_per_1_lot_usd?: number | null;
    calculated_lots_raw?: number | null;
    rr_ratio?: number | null;
    pip_value_position_usd?: number | null;
    tick_value_position_usd?: number | null;
  },
  calculationId: string | null = null
): Promise<void> {
  await sendCrmWebhook("calculator_used", {
    type: "calculator_used",
    entity: "trade_calculation",
    entity_id: calculationId,
    data: {
      broker_key: formData.broker_key || "finademica_mt5",
      symbol: formData.symbol,
      side: formData.side,
      entry_price: formData.entry_price,
      stop_loss_price: formData.stop_loss_price,
      take_profit_price: formData.take_profit_price,
      risk_total_usd: formData.risk_total_usd || null,
      lots_final: formData.lots_final || null,
      results: {
        recommended_lots: results.recommended_lots ?? null,
        actual_risk_usd: results.actual_risk_usd ?? null,
        ticks_to_stop_loss: results.ticks_to_stop_loss ?? null,
        risk_per_1_lot_usd: results.risk_per_1_lot_usd ?? null,
        calculated_lots_raw: results.calculated_lots_raw ?? null,
        rr_ratio: results.rr_ratio ?? null,
        pip_value_position_usd: results.pip_value_position_usd ?? null,
        tick_value_position_usd: results.tick_value_position_usd ?? null,
      },
    },
  });
}

/**
 * Send diary_trade_saved event
 */
export async function sendDiaryTradeSavedEvent(
  tradeData: {
    trade_id: string;
    broker_key?: string;
    symbol: string;
    side: string;
    entry_price: number | null;
    stop_loss_price: number | null;
    take_profit_price: number | null;
    lots_final: number | null;
    risk_total_usd: number | null;
    profit_total_usd: number | null;
    rr_ratio: number | null;
    tick_value_position_usd: number | null;
    pip_value_position_usd: number | null;
    notes: string | null;
    status: string | null;
  }
): Promise<void> {
  await sendCrmWebhook("diary_trade_saved", {
    type: "diary_trade_saved",
    entity: "trading_diary_trades",
    entity_id: tradeData.trade_id,
    data: {
      trade_id: tradeData.trade_id,
      broker_key: tradeData.broker_key || "finademica_mt5",
      symbol: tradeData.symbol,
      side: tradeData.side,
      entry_price: tradeData.entry_price,
      stop_loss_price: tradeData.stop_loss_price,
      take_profit_price: tradeData.take_profit_price,
      lots_final: tradeData.lots_final,
      risk_total_usd: tradeData.risk_total_usd,
      profit_total_usd: tradeData.profit_total_usd,
      rr_ratio: tradeData.rr_ratio,
      tick_value_position_usd: tradeData.tick_value_position_usd,
      pip_value_position_usd: tradeData.pip_value_position_usd,
      notes: tradeData.notes,
      status: tradeData.status,
    },
  });
}

/**
 * Send mentor_message_sent event
 */
export async function sendMentorMessageSentEvent(
  messageId: string | null,
  content: string,
  conversationId: string | null = null
): Promise<void> {
  await sendCrmWebhook("mentor_message_sent", {
    type: "mentor_message_sent",
    entity: "mentor_messages",
    entity_id: messageId,
    data: {
      message_id: messageId,
      role: "user",
      content: content,
      conversation_id: conversationId,
      mentor_mode: null,
    },
  });
}
