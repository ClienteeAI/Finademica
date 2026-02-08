import {
  Brain,
  MessageSquare,
  ListOrdered,
  Dumbbell,
  Target,
  Activity,
  ShieldCheck,
  AlertTriangle,
  Eye,
  Compass,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ArenaResult } from "@/pages/ArenaResults";

/* ── Shared helpers ─────────────────────────────────────── */

function SectionCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("premium-card p-4 md:p-5", className)}>{children}</div>;
}

function SectionTitle({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon className="h-4 w-4 text-primary" />
      <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">{children}</h2>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (value === null || value === undefined) return null;
  return (
    <div className="flex items-start justify-between gap-3 py-2 border-b border-border/40 last:border-0">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
      <span className="text-sm font-medium text-foreground text-right max-w-[60%]">{String(value)}</span>
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

function JsonListSection({ items }: { items: unknown[] | null }) {
  if (!items || items.length === 0) return null;
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
          <span className="text-primary mt-0.5">•</span>
          <span>{typeof item === "string" ? item : JSON.stringify(item)}</span>
        </li>
      ))}
    </ul>
  );
}

/* ── Main Component ─────────────────────────────────────── */

export default function ArenaFullEvaluation({ result }: { result: ArenaResult }) {
  let delay = 0;
  const nextDelay = () => {
    delay += 0.05;
    return delay;
  };

  return (
    <div className="space-y-4">
      {/* Call Summary */}
      {(result.call_summary || result.call_summary_short) && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: nextDelay() }}>
          <SectionCard>
            <SectionTitle icon={FileText}>Session Summary</SectionTitle>
            {result.call_summary_one_line && (
              <p className="text-sm font-medium text-foreground mb-2">{result.call_summary_one_line}</p>
            )}
            <p className="text-sm leading-relaxed text-muted-foreground">
              {result.call_summary || result.call_summary_short}
            </p>
          </SectionCard>
        </motion.div>
      )}

      {/* Feedback Messages */}
      {(result.user_message_neutral || result.user_message_direct || result.user_message_brutal) && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: nextDelay() }}>
          <SectionCard>
            <SectionTitle icon={MessageSquare}>Key Feedback</SectionTitle>
            <div className="space-y-3">
              <FeedbackCard tone="Neutral" message={result.user_message_neutral} />
              <FeedbackCard tone="Direct" message={result.user_message_direct} />
              <FeedbackCard tone="Brutal" message={result.user_message_brutal} />
            </div>
          </SectionCard>
        </motion.div>
      )}

      {/* Deep Profile Analysis */}
      {(result.dominant_response_pattern || result.locus_of_control || result.self_talk_style) && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: nextDelay() }}>
          <SectionCard>
            <SectionTitle icon={Brain}>Deep Profile</SectionTitle>
            <StatRow label="Dominant Response" value={result.dominant_response_pattern} />
            <StatRow label="Locus of Control" value={result.locus_of_control} />
            <StatRow label="Self-Talk Style" value={result.self_talk_style} />
          </SectionCard>
        </motion.div>
      )}

      {/* Extended Scores */}
      {(result.decision_speed !== null || result.emotional_control !== null || result.rule_integrity !== null) && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: nextDelay() }}>
          <SectionCard>
            <SectionTitle icon={Target}>Extended Scores</SectionTitle>
            <div className="space-y-4">
              {result.decision_speed !== null && <ScoreBar label="Decision Speed" value={result.decision_speed} />}
              {result.emotional_control !== null && <ScoreBar label="Emotional Control" value={result.emotional_control} />}
              {result.rule_integrity !== null && <ScoreBar label="Rule Integrity" value={result.rule_integrity} />}
            </div>
          </SectionCard>
        </motion.div>
      )}

      {/* Cognitive Distortions */}
      {result.cognitive_distortions && result.cognitive_distortions.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: nextDelay() }}>
          <SectionCard>
            <SectionTitle icon={Eye}>Cognitive Distortions</SectionTitle>
            <JsonListSection items={result.cognitive_distortions} />
          </SectionCard>
        </motion.div>
      )}

      {/* Risk Behaviors */}
      {result.risk_behaviors && result.risk_behaviors.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: nextDelay() }}>
          <SectionCard>
            <SectionTitle icon={AlertTriangle}>Risk Behaviors</SectionTitle>
            <JsonListSection items={result.risk_behaviors} />
          </SectionCard>
        </motion.div>
      )}

      {/* Protective Behaviors */}
      {result.protective_behaviors && result.protective_behaviors.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: nextDelay() }}>
          <SectionCard>
            <SectionTitle icon={ShieldCheck}>Protective Behaviors</SectionTitle>
            <JsonListSection items={result.protective_behaviors} />
          </SectionCard>
        </motion.div>
      )}

      {/* Stress Breakpoint */}
      {result.stress_breakpoint && Object.keys(result.stress_breakpoint).length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: nextDelay() }}>
          <SectionCard>
            <SectionTitle icon={Activity}>Stress Breakpoint</SectionTitle>
            {Object.entries(result.stress_breakpoint).map(([key, value]) => (
              <StatRow key={key} label={key.replace(/_/g, " ")} value={String(value)} />
            ))}
          </SectionCard>
        </motion.div>
      )}

      {/* Bullet Timeline */}
      {result.bullet_timeline && result.bullet_timeline.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: nextDelay() }}>
          <SectionCard>
            <SectionTitle icon={Compass}>Session Timeline</SectionTitle>
            <ol className="space-y-2">
              {result.bullet_timeline.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted text-muted-foreground text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-sm text-foreground leading-relaxed pt-0.5">
                    {typeof item === "string" ? item : JSON.stringify(item)}
                  </span>
                </li>
              ))}
            </ol>
          </SectionCard>
        </motion.div>
      )}

      {/* Training Priorities */}
      {result.top3_priorities && result.top3_priorities.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: nextDelay() }}>
          <SectionCard>
            <SectionTitle icon={ListOrdered}>Training Priorities</SectionTitle>
            <ol className="space-y-2">
              {result.top3_priorities.map((p, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-sm text-foreground leading-relaxed pt-0.5">
                    {typeof p === "string" ? p : JSON.stringify(p)}
                  </span>
                </li>
              ))}
            </ol>
          </SectionCard>
        </motion.div>
      )}

      {/* Recommended Drills */}
      {result.drills && result.drills.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: nextDelay() }}>
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
                  {drill.goal && <p className="text-xs text-muted-foreground mb-2">{drill.goal}</p>}
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

      {/* Recommended Training */}
      {result.recommended_training && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: nextDelay() }}>
          <SectionCard>
            <SectionTitle icon={Target}>Recommended Focus</SectionTitle>
            <p className="text-sm leading-relaxed text-foreground">{result.recommended_training}</p>
          </SectionCard>
        </motion.div>
      )}

      {/* Additional Flags */}
      {(result.flag_high_dropout_risk || result.impulsive) && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: nextDelay() }}>
          <SectionCard>
            <SectionTitle icon={AlertTriangle}>Additional Risk Indicators</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {result.flag_high_dropout_risk && (
                <Badge variant="destructive" className="text-[11px] px-3 py-1.5 border-destructive/50 bg-destructive/15 text-destructive">
                  ⚠ High Dropout Risk
                </Badge>
              )}
              {result.impulsive && (
                <Badge variant="destructive" className="text-[11px] px-3 py-1.5 border-destructive/50 bg-destructive/15 text-destructive">
                  ⚠ Impulsive Behavior
                </Badge>
              )}
            </div>
          </SectionCard>
        </motion.div>
      )}
    </div>
  );
}
