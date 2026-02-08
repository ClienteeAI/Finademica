import { motion } from "framer-motion";
import { Brain, Shield, Target, Activity } from "lucide-react";

const steps = [
  { icon: Brain, label: "Analyzing decision patterns..." },
  { icon: Shield, label: "Evaluating risk behavior..." },
  { icon: Target, label: "Scoring pressure tolerance..." },
  { icon: Activity, label: "Generating training plan..." },
];

export default function ArenaEvaluating() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6 max-w-sm mx-auto text-center">
      {/* Pulsing brain icon */}
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center"
      >
        <Brain className="w-8 h-8 text-primary" />
      </motion.div>

      <div className="space-y-1">
        <h2 className="text-lg font-bold text-foreground">Evaluating Your Performance</h2>
        <p className="text-sm text-muted-foreground">
          We're analyzing your responses under pressure. This usually takes 10–30 seconds.
        </p>
      </div>

      {/* Animated steps */}
      <div className="w-full space-y-3 mt-2">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeInOut",
            }}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-card/60 border border-border/40"
          >
            <step.icon className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-sm text-foreground">{step.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 mt-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-primary"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>
    </div>
  );
}
