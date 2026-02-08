import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/AuthContext";
import { Swords, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ArenaEvaluating from "@/components/arena/ArenaEvaluating";
import ArenaResultsContent from "@/components/arena/ArenaResultsContent";

export interface Drill {
  name?: string;
  goal?: string;
  duration?: string;
  steps?: string[];
}

export interface ArenaResult {
  id: string;
  pressure_response: string | null;
  decision_style: string | null;
  confidence_calibration: string | null;
  emotional_regulation: string | null;
  flag_panic_exit_risk: boolean | null;
  flag_high_revenge_trading_risk: boolean | null;
  flag_rule_breaking_risk: boolean | null;
  pressure_tolerance: number | null;
  coachability: number | null;
  user_message_neutral: string | null;
  user_message_direct: string | null;
  user_message_brutal: string | null;
  top3_priorities: string[] | null;
  drills: Drill[] | null;
  next_simulation_recommendation: string | null;
  created_at: string | null;
}

const POLL_INTERVAL = 4000;
const MAX_POLL_TIME = 120000; // 2 minutes

export default function ArenaResults() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const callEndedAt = (location.state as { callEndedAt?: string } | null)?.callEndedAt;

  const [result, setResult] = useState<ArenaResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);

  const fetchResult = useCallback(async () => {
    if (!user) return null;
    const { data, error } = await supabase
      .from("psych_arena_results")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;
    return {
      ...data,
      top3_priorities: Array.isArray(data.top3_priorities) ? data.top3_priorities as string[] : null,
      drills: Array.isArray(data.drills) ? data.drills as Drill[] : null,
    } as ArenaResult;
  }, [user]);

  const pollingRef = useRef(false);

  useEffect(() => {
    if (!user) return;

    if (callEndedAt) {
      setEvaluating(true);
      setLoading(false);
      pollingRef.current = true;
      const startTime = Date.now();

      const poll = async () => {
        if (!pollingRef.current) return;
        const data = await fetchResult();
        if (data?.created_at && new Date(data.created_at) >= new Date(new Date(callEndedAt).getTime() - 5000)) {
          pollingRef.current = false;
          setResult(data);
          setEvaluating(false);
          window.history.replaceState({}, "");
          return true;
        }
        if (Date.now() - startTime > MAX_POLL_TIME) {
          pollingRef.current = false;
          if (data) setResult(data);
          setEvaluating(false);
          window.history.replaceState({}, "");
          return true;
        }
        return false;
      };

      const interval = setInterval(async () => {
        const done = await poll();
        if (done) clearInterval(interval);
      }, POLL_INTERVAL);

      // Initial check
      poll().then(done => { if (done) clearInterval(interval); });

      return () => {
        pollingRef.current = false;
        clearInterval(interval);
      };
    } else {
      (async () => {
        const data = await fetchResult();
        if (data) setResult(data);
        setLoading(false);
      })();
    }
  }, [user, callEndedAt, fetchResult]);

  return (
    <SidebarLayout>
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : evaluating ? (
        <ArenaEvaluating />
      ) : !result ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <Swords className="h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">No arena results yet. Complete a session first.</p>
          <Button onClick={() => navigate("/arena")}>Enter the Arena</Button>
        </div>
      ) : (
        <ArenaResultsContent result={result} />
      )}
    </SidebarLayout>
  );
}
