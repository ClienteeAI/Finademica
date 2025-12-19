import { useGamification } from "@/hooks/useGamification";
import { Trophy, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface XPNavIndicatorProps {
  isNasrTheme?: boolean;
}

const XPNavIndicator = ({ isNasrTheme = false }: XPNavIndicatorProps) => {
  const { xp, level, levelName, streakDays, currentLevelXp, nextLevelXp, isLoading } = useGamification();

  const xpInLevel = xp - currentLevelXp;
  const xpNeeded = nextLevelXp - currentLevelXp;
  const progressPercent = xpNeeded > 0 ? Math.min((xpInLevel / xpNeeded) * 100, 100) : 0;

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 animate-pulse">
        <div className={cn(
          "w-7 h-7 rounded-lg",
          isNasrTheme ? "bg-gold/20" : "bg-aqua/20"
        )} />
        <div className={cn(
          "w-20 h-2 rounded-full",
          isNasrTheme ? "bg-gold/20" : "bg-aqua/20"
        )} />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(
            "flex items-center gap-3 px-4 py-2 rounded-xl cursor-default transition-all border backdrop-blur-sm",
            isNasrTheme 
              ? "bg-nasr-panel/60 border-gold/20 hover:border-gold/40 shadow-[0_2px_12px_rgba(212,175,55,0.15)]" 
              : "bg-white/60 border-ice hover:border-aqua/30 shadow-[0_2px_12px_rgba(77,226,232,0.1)]"
          )}>
            {/* Level Badge */}
            <div className={cn(
              "flex items-center justify-center w-7 h-7 rounded-lg font-bold text-xs",
              isNasrTheme 
                ? "bg-gradient-to-br from-gold-light to-gold text-nasr-bg shadow-[0_0_10px_rgba(212,175,55,0.3)]"
                : "bg-gradient-to-br from-aqua to-aqua-deep text-white shadow-[0_0_10px_rgba(77,226,232,0.3)]"
            )}>
              {level}
            </div>

            {/* Progress Bar + XP */}
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-16 h-1.5 rounded-full overflow-hidden",
                isNasrTheme ? "bg-gold/20" : "bg-aqua/20"
              )}>
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    isNasrTheme 
                      ? "bg-gradient-to-r from-gold to-gold-light"
                      : "bg-gradient-to-r from-aqua to-aqua-light"
                  )}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className={cn(
                "text-xs font-semibold tabular-nums",
                isNasrTheme ? "text-gold" : "text-aqua"
              )}>
                {xp.toLocaleString()}
              </span>
            </div>

            {/* Streak indicator */}
            {streakDays > 0 && (
              <div className="flex items-center gap-0.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs font-semibold text-amber-500">{streakDays}</span>
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side="bottom" 
          className={cn(
            "p-4 rounded-xl border backdrop-blur-xl",
            isNasrTheme 
              ? "bg-nasr-panel/95 border-gold/20 text-nasr-text"
              : "bg-white/95 border-ice text-ocean"
          )}
        >
          <div className="space-y-3 min-w-[180px]">
            <div className="flex items-center gap-2">
              <Trophy className={cn(
                "w-4 h-4",
                isNasrTheme ? "text-gold" : "text-aqua"
              )} />
              <span className="font-bold">Level {level} – {levelName}</span>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className={isNasrTheme ? "text-nasr-text-muted" : "text-ocean-muted"}>Progress</span>
                <span className="font-semibold">{xp.toLocaleString()} / {nextLevelXp.toLocaleString()} XP</span>
              </div>
              <div className={cn(
                "w-full h-2 rounded-full overflow-hidden",
                isNasrTheme ? "bg-gold/20" : "bg-aqua/20"
              )}>
                <div
                  className={cn(
                    "h-full rounded-full",
                    isNasrTheme 
                      ? "bg-gradient-to-r from-gold to-gold-light"
                      : "bg-gradient-to-r from-aqua to-aqua-light"
                  )}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className={cn(
                "text-[10px]",
                isNasrTheme ? "text-nasr-text-muted" : "text-ocean-muted"
              )}>
                {Math.max(0, nextLevelXp - xp).toLocaleString()} XP to next level
              </p>
            </div>

            {streakDays > 0 && (
              <div className="flex items-center gap-1.5 pt-1 border-t border-current/10">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs font-medium">{streakDays} day streak</span>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default XPNavIndicator;
