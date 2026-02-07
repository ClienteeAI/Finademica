import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldAlert, Swords } from "lucide-react";
import { motion } from "framer-motion";

interface ArenaDisclaimerProps {
  onAccept: () => void;
}

export default function ArenaDisclaimer({ onAccept }: ArenaDisclaimerProps) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-lg w-full rounded-2xl border border-destructive/30 bg-card/80 backdrop-blur-xl p-8 shadow-[0_0_60px_rgba(239,68,68,0.08)]"
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center ring-2 ring-destructive/20">
            <Swords className="w-8 h-8 text-destructive" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-foreground mb-2">
          You Are Entering The Psychological Arena
        </h1>
        <p className="text-center text-muted-foreground text-sm mb-6">
          A simulated environment designed to test your trading psychology
        </p>

        {/* Disclaimer body */}
        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-6">
          <div className="flex gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p>
              Inside the Arena you will interact with AI-powered{" "}
              <span className="text-foreground font-medium">Gladiators</span> —
              characters engineered to simulate the psychological pressures of
              real trading scenarios.
            </p>
          </div>

          <p>
            Each Gladiator uses different tactics — time compression, competence
            doubt, fear triggers, and emotional manipulation — to test how you
            respond under stress.
          </p>

          <p>
            <span className="text-foreground font-semibold">
              This is training only.
            </span>{" "}
            No real trades are placed. No financial advice is given. No
            recommendations are made. Everything inside the Arena is a
            simulation designed to help you build psychological resilience.
          </p>

          <p className="text-xs text-muted-foreground/70">
            The Arena uses voice-based AI conversations. Microphone access will
            be required when you start a session with a Gladiator.
          </p>
        </div>

        {/* Agreement checkbox */}
        <div className="flex items-start gap-3 mt-6 p-3 rounded-lg bg-muted/30 border border-border">
          <Checkbox
            id="arena-agree"
            checked={agreed}
            onCheckedChange={(v) => setAgreed(v === true)}
            className="mt-0.5"
          />
          <label
            htmlFor="arena-agree"
            className="text-sm text-foreground cursor-pointer select-none leading-snug"
          >
            I understand this is a psychological training simulation. I accept
            that no financial advice or trade recommendations will be given.
          </label>
        </div>

        {/* CTA */}
        <Button
          onClick={onAccept}
          disabled={!agreed}
          className="w-full mt-6 h-12 text-base font-semibold bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-lg disabled:opacity-40"
        >
          <Swords className="w-5 h-5 mr-2" />
          Enter The Arena
        </Button>
      </motion.div>
    </div>
  );
}
