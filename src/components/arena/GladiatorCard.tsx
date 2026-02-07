import { motion } from "framer-motion";
import type { Gladiator } from "./gladiators";

interface GladiatorCardProps {
  gladiator: Gladiator;
  index: number;
  onSelect: (gladiator: Gladiator) => void;
}

export default function GladiatorCard({
  gladiator,
  index,
  onSelect,
}: GladiatorCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={() => onSelect(gladiator)}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:border-primary/40 transition-all duration-300 text-left shadow-lg hover:shadow-[0_0_30px_rgba(var(--primary-rgb,56,189,248),0.12)]"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={gladiator.imageUrl}
          alt={gladiator.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />

        {/* Name overlay */}
        <div className="absolute bottom-0 inset-x-0 p-4">
          <h3 className="text-lg font-bold text-foreground">{gladiator.name}</h3>
          <p className="text-xs font-medium text-primary tracking-wide uppercase">
            {gladiator.title}
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="p-4 pt-2">
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
          {gladiator.description}
        </p>

        {/* CTA hint */}
        <div className="mt-3 flex items-center gap-2 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
          Start Session
        </div>
      </div>
    </motion.button>
  );
}
