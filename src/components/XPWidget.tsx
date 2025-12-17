import { useGamification } from "@/hooks/useGamification";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, Flame, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface XPWidgetProps {
  className?: string;
}

const XPWidget = ({ className }: XPWidgetProps) => {
  const { xpTotal, level, levelName, streakDays, isLoading, error } = useGamification();

  // XP thresholds from xp_levels table
  const levelThresholds: Record<number, number> = {
    1: 0, 2: 100, 3: 250, 4: 450, 5: 700,
    6: 1000, 7: 1350, 8: 1750, 9: 2200, 10: 2700,
  };

  const currentLevelXP = levelThresholds[level] ?? 0;
  const nextLevelXP = levelThresholds[level + 1] ?? currentLevelXP + 500;
  const xpInLevel = xpTotal - currentLevelXP;
  const xpNeeded = nextLevelXP - currentLevelXP;
  const progressPercent = Math.min((xpInLevel / xpNeeded) * 100, 100);

  if (isLoading) {
    return (
      <div className={cn("animate-pulse bg-white/10 backdrop-blur-sm rounded-2xl p-4 w-64", className)}>
        <div className="h-4 bg-gray-300/20 rounded w-3/4 mb-2" />
        <div className="h-2 bg-gray-300/20 rounded w-full mb-2" />
        <div className="h-3 bg-gray-300/20 rounded w-1/2" />
      </div>
    );
  }

  if (error) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative bg-white/80 backdrop-blur-xl border border-ice rounded-2xl p-4 shadow-lg",
        "hover:shadow-xl hover:border-aqua/30 transition-all duration-300",
        className
      )}
    >
      {/* Top Row: Level + Info */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-aqua to-aqua-deep flex items-center justify-center shadow-aqua">
            <Trophy className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-ocean-muted uppercase tracking-wide">
              Level {level}
            </p>
            <p className="text-sm font-bold text-ocean leading-tight">
              {levelName}
            </p>
          </div>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="w-6 h-6 rounded-full flex items-center justify-center bg-muted/50 hover:bg-aqua/10 transition-colors">
                <Info className="w-3.5 h-3.5 text-ocean-muted" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs text-xs bg-ocean text-white border-0">
              XP increases when you learn (videos), practice (diary), and use tools (calculator/analyzer). Keep a streak to level up faster.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* XP Progress Bar */}
      <div className="space-y-1.5 mb-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-ocean">{xpTotal.toLocaleString()} XP</span>
          <span className="text-ocean-muted">{nextLevelXP.toLocaleString()} XP</span>
        </div>
        <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-aqua to-aqua-light rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-[10px] text-ocean-muted text-right">
          {Math.max(0, nextLevelXP - xpTotal).toLocaleString()} XP to next level
        </p>
      </div>

      {/* Streak Badge */}
      {streakDays > 0 && (
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 w-fit">
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-xs font-semibold text-amber-600">
            {streakDays} day streak
          </span>
        </div>
      )}
    </div>
  );
};

export default XPWidget;
