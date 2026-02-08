import { useNavigate } from "react-router-dom";
import { Swords, ShieldAlert, Brain, Target, MessageSquare, ListOrdered, Dumbbell, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ArenaResult } from "@/pages/ArenaResults";

function SectionCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("premium-card p-4 md:p-5", className)}>
      {children}
    </div>
  );
}

function SectionTitle({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon className="h-4 w-4 text-primary" />
      <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">{children}</h2>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-3 py-2 border-b border-border/40 last:border-0">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
      <span className="text-sm font-medium text-foreground text-right max-w-[60%]">{value}</span>
    </div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number | null }) {
  const score = value ?? 0;
  const pct = Math.min(score * 10, 100);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span className="text-sm font-bold text-foreground">{score}/10</span>
      </div>
      <Progress value={pct} className="h-2.5" />
    </div>
  );
}

function RiskBadge({ label, flagged }: { label: string; flagged: boolean | null }) {
  const isRisk = flagged === true;
  return (
    <Badge
      variant={isRisk ? "destructive" : "success"}
      className={cn(
        "text-[11px] px-3 py-1.5",
        isRisk
          ? "border-destructive/50 bg-destructive/15 text-destructive"
          : "border-primary/50 bg-primary/10 text-primary"
      )}
    >
      {isRisk ? "⚠" : "✓"} {label}
    </Badge>
  );
}

function FeedbackCard({ tone, message }: { tone: string; message: string | null }) {
  if (!message) return null;
  const toneStyles: Record<string, string> = {
    Neutral: "border-border/60",
    Direct: "border-warning/40",
    Brutal: "border-destructive/40",
  };
  return (
    <div className={cn("rounded-xl border p-3.5 bg-card/60 backdrop-blur-sm", toneStyles[tone] || "border-border/60")}>
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">{tone}</span>
      <p className="text-sm leading-relaxed text-foreground">{message}</p>
    </div>
  );
}

export default function ArenaResultsContent({ result }: { result: ArenaResult }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 max-w-2xl mx-auto pb-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center">
            <Swords className="w-4.5 h-4.5 text-destructive" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {result.first_name
                ? `${result.first_name}'s Arena Result`
                : "Psychological Arena Result"}
            </h1>
            <p className="text-xs text-muted-foreground">Your behavior under pressure</p>
          </div>
        </div>
      </motion.div>

      {/* Summary Card */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <SectionCard>
          <SectionTitle icon={Brain}>Profile Summary</SectionTitle>
          <StatRow label="Pressure Response" value={result.pressure_response} />
          <StatRow label="Decision Style" value={result.decision_style} />
          <StatRow label="Confidence Calibration" value={result.confidence_calibration} />
          <StatRow label="Emotional Regulation" value={result.emotional_regulation} />
        </SectionCard>
      </motion.div>

      {/* Risk Flags */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <SectionCard>
          <SectionTitle icon={ShieldAlert}>Risk Flags</SectionTitle>
          <div className="flex flex-wrap gap-2">
            <RiskBadge label="Panic Exit" flagged={result.flag_panic_exit_risk} />
            <RiskBadge label="Revenge Trading" flagged={result.flag_high_revenge_trading_risk} />
            <RiskBadge label="Rule Breaking" flagged={result.flag_rule_breaking_risk} />
          </div>
        </SectionCard>
      </motion.div>

      {/* Scores */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <SectionCard>
          <SectionTitle icon={Target}>Scores</SectionTitle>
          <div className="space-y-4">
            <ScoreBar label="Pressure Tolerance" value={result.pressure_tolerance} />
            <ScoreBar label="Coachability" value={result.coachability} />
          </div>
        </SectionCard>
      </motion.div>

      {/* Feedback Messages */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <SectionCard>
          <SectionTitle icon={MessageSquare}>Key Feedback</SectionTitle>
          <div className="space-y-3">
            <FeedbackCard tone="Neutral" message={result.user_message_neutral} />
            <FeedbackCard tone="Direct" message={result.user_message_direct} />
            <FeedbackCard tone="Brutal" message={result.user_message_brutal} />
          </div>
        </SectionCard>
      </motion.div>

      {/* Training Priorities */}
      {result.top3_priorities && result.top3_priorities.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <SectionCard>
            <SectionTitle icon={ListOrdered}>Training Priorities</SectionTitle>
            <ol className="space-y-2">
              {result.top3_priorities.map((p, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-sm text-foreground leading-relaxed pt-0.5">{typeof p === 'string' ? p : JSON.stringify(p)}</span>
                </li>
              ))}
            </ol>
          </SectionCard>
        </motion.div>
      )}

      {/* Recommended Drills */}
      {result.drills && result.drills.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <SectionCard>
            <SectionTitle icon={Dumbbell}>Recommended Drills</SectionTitle>
            <div className="space-y-4">
              {result.drills.map((drill, i) => (
                <div key={i} className="rounded-lg border border-border/50 p-3 bg-muted/30">
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-sm font-semibold text-foreground">{drill.name || `Drill ${i + 1}`}</h3>
                    {drill.duration && (
                      <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {drill.duration}
                      </span>
                    )}
                  </div>
                  {drill.goal && (
                    <p className="text-xs text-muted-foreground mb-2">{drill.goal}</p>
                  )}
                  {drill.steps && drill.steps.length > 0 && (
                    <ul className="space-y-1 ml-1">
                      {drill.steps.map((step, j) => (
                        <li key={j} className="text-xs text-foreground/80 flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </SectionCard>
        </motion.div>
      )}

      {/* CTA */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <div className="flex flex-col items-center gap-3 pt-2">
          <Button size="lg" onClick={() => navigate("/arena")} className="w-full sm:w-auto">
            <Swords className="h-4 w-4 mr-2" />
            Run Arena Again
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          {result.next_simulation_recommendation && (
            <p className="text-xs text-muted-foreground text-center">
              Next focus: <span className="font-medium text-foreground">{result.next_simulation_recommendation}</span>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
