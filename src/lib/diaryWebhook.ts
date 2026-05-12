import { supabase } from "@/integrations/supabase/client";

const DIARY_WEBHOOK_URL = "https://n8n.srv1474318.hstgr.cloud/webhook/trading-diary-Finademica";
const DIARY_SECRET = "DIARY_9fA3kP2xQ7mVZ81sLwT0R";

export interface DiaryUser {
  auth_user_id: string;
  user_email: string;
  user_phone?: string;
  supabase_id: string;
}

export async function getAuthUser(): Promise<DiaryUser | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }

  // Fetch additional info from public.users table
  const { data: profile } = await supabase
    .from('users')
    .select('id, phone')
    .eq('auth_user_id', user.id)
    .single();
  
  return {
    auth_user_id: user.id,
    user_email: user.email || "",
    user_phone: profile?.phone || "",
    supabase_id: profile?.id || user.id,
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

    const responseText = await response.text();
    let responseData = {};
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      responseData = { text: responseText };
    }

    if (response.ok) {
      console.log("Diary webhook success:", responseData);
      return { success: true, data: responseData };
    } else {
      console.error("Diary webhook error:", response.status, responseText);
      return { success: false, error: `HTTP ${response.status}`, data: responseData };
    }
  } catch (error) {
    console.error("Diary webhook fatal error:", error);
    return { success: false, error: String(error) };
  }
}
