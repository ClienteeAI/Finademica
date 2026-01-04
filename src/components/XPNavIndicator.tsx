import { useGamification } from "@/hooks/useGamification";
import { Flame } from "lucide-react";
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
      <div className="flex items-center gap-3 animate-pulse">
        <div className={cn(
          "w-8 h-8 rounded-full",
          isNasrTheme ? "bg-gold/20" : "bg-aqua/20"
        )} />
        <div className="flex flex-col gap-1">
          <div className={cn(
            "w-12 h-3 rounded",
            isNasrTheme ? "bg-gold/20" : "bg-aqua/20"
          )} />
          <div className={cn(
            "w-20 h-1.5 rounded-full",
            isNasrTheme ? "bg-gold/20" : "bg-aqua/20"
          )} />
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-3 cursor-default">
            {/* Level Badge - Circular with gold outline */}
            <div className={cn(
              "relative flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm",
              isNasrTheme 
                ? "bg-[#1A1A1A] text-gold ring-2 ring-gold/40" 
                : "bg-white/80 text-aqua ring-2 ring-aqua/40"
            )}>
              {level}
              {/* Subtle glow effect */}
              {isNasrTheme && (
                <div className="absolute inset-0 rounded-full bg-gold/10 animate-gold-pulse" />
              )}
            </div>

            {/* XP Progress Section */}
            <div className="flex flex-col gap-1">
              {/* Level text */}
              <span className={cn(
                "text-[11px] font-semibold uppercase tracking-wider",
                isNasrTheme ? "text-gold" : "text-aqua"
              )}>
                Level {level}
              </span>
              
              {/* XP Bar */}
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-20 h-[6px] rounded-full overflow-hidden",
                  isNasrTheme ? "bg-[#1A1A1A]" : "bg-aqua/20"
                )}>
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      isNasrTheme 
                        ? "bg-gradient-to-r from-gold to-gold-light shadow-[0_0_8px_rgba(212,175,55,0.4)]"
                        : "bg-gradient-to-r from-aqua to-aqua-light"
                    )}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                
                {/* XP Count */}
                <span className={cn(
                  "text-[11px] font-medium tabular-nums",
                  isNasrTheme ? "text-[#808080]" : "text-ocean-muted"
                )}>
                  {xp.toLocaleString()} XP
                </span>
              </div>
            </div>

            {/* Streak indicator */}
            {streakDays > 0 && (
              <div className="flex items-center gap-1 ml-2 px-2 py-1 rounded-full bg-amber-500/10">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[11px] font-semibold text-amber-500">{streakDays}</span>
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side="bottom" 
          sideOffset={12}
          className={cn(
            "p-4 rounded-xl border shadow-2xl",
            isNasrTheme 
              ? "bg-[#0F0F0F] border-[#2A2A2A] text-[#E0E0E0]"
              : "bg-white/95 border-ice text-ocean"
          )}
        >
          <div className="space-y-3 min-w-[200px]">
            <div className="flex items-center justify-between">
              <span className={cn(
                "text-sm font-bold",
                isNasrTheme ? "text-gold" : "text-aqua"
              )}>
                Level {level}
              </span>
              <span className={cn(
                "text-xs",
                isNasrTheme ? "text-[#808080]" : "text-ocean-muted"
              )}>
                {levelName}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className={isNasrTheme ? "text-[#808080]" : "text-ocean-muted"}>
                  Progress to Level {level + 1}
                </span>
                <span className="font-semibold">
                  {Math.round(progressPercent)}%
                </span>
              </div>
              <div className={cn(
                "w-full h-2 rounded-full overflow-hidden",
                isNasrTheme ? "bg-[#1A1A1A]" : "bg-aqua/20"
              )}>
                <div
                  className={cn(
                    "h-full rounded-full",
                    isNasrTheme 
                      ? "bg-gradient-to-r from-gold to-gold-light shadow-[0_0_8px_rgba(212,175,55,0.4)]"
                      : "bg-gradient-to-r from-aqua to-aqua-light"
                  )}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px]">
                <span className={isNasrTheme ? "text-[#606060]" : "text-ocean-muted"}>
                  {xp.toLocaleString()} XP
                </span>
                <span className={isNasrTheme ? "text-[#606060]" : "text-ocean-muted"}>
                  {nextLevelXp.toLocaleString()} XP
                </span>
              </div>
            </div>

            {streakDays > 0 && (
              <div className="flex items-center gap-2 pt-2 border-t border-current/10">
                <Flame className="w-4 h-4 text-amber-500" />
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
