import { supabase } from "@/integrations/supabase/client";

const DIARY_WEBHOOK_URL = "https://clientee.app.n8n.cloud/webhook-test/03362423-8c6c-4c11-bd42-1c56a074a88d";
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
