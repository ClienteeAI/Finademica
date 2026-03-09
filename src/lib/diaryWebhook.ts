import { supabase } from "@/integrations/supabase/client";

const DIARY_WEBHOOK_URL = "https://n8n.srv1474318.hstgr.cloud/webhook/trading-diary";
const DIARY_SECRET = "DIARY_9fA3kP2xQ7mVZ81sLwT0R";

export interface DiaryUser {
  auth_user_id: string;
  user_email: string;
}

export async function getAuthUser(): Promise<DiaryUser | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }
  
  return {
    auth_user_id: user.id,
    user_email: user.email || "",
  };
}

export async function sendDiaryWebhook(
  action: "create" | "update" | "delete",
  payload: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(DIARY_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-diary-secret": DIARY_SECRET,
      },
      body: JSON.stringify({
        action,
        ...payload,
      }),
    });

    if (response.ok) {
      return { success: true };
    } else {
      console.error("Diary webhook error:", response.status, response.statusText);
      return { success: false, error: `HTTP ${response.status}` };
    }
  } catch (error) {
    console.error("Diary webhook error:", error);
    return { success: false, error: String(error) };
  }
}
