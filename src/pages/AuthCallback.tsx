import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Finishing confirmation...");

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const code = new URL(window.location.href).searchParams.get("code");

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        }
      } catch (err) {
        console.error("Auth callback error:", err);
        if (!cancelled) setMessage("Confirmation completed. Please log in.");
      } finally {
        const { data } = await supabase.auth.getSession();
        if (cancelled) return;
        navigate(data.session ? "/dashboard" : "/login", { replace: true });
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-xl border border-border bg-card/80 backdrop-blur p-8 text-center">
        <div className="flex items-center justify-center gap-3 text-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">{message}</span>
        </div>
      </div>
    </main>
  );
};

export default AuthCallback;
