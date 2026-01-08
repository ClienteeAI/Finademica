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
          <div className="flex items-center gap-2 cursor-default px-3 py-1.5 rounded-full bg-[#1e293b]/80 backdrop-blur-sm border border-[#334155]/50 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
            {/* Level Badge - Compact circular */}
            <div className={cn(
              "relative flex items-center justify-center w-7 h-7 rounded-full font-bold text-xs",
              isNasrTheme 
                ? "bg-[#0f172a] text-gold ring-2 ring-gold/50" 
                : "bg-[#0f172a] text-aqua ring-2 ring-aqua/40"
            )}>
              {level}
            </div>

            {/* Compact XP Bar */}
            <div className={cn(
              "w-14 h-[5px] rounded-full overflow-hidden",
              isNasrTheme ? "bg-[#0f172a]" : "bg-[#0f172a]"
            )}>
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  isNasrTheme 
                    ? "bg-gradient-to-r from-gold to-gold-light shadow-[0_0_6px_rgba(212,175,55,0.4)]"
                    : "bg-gradient-to-r from-aqua to-aqua-light"
                )}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            
            {/* XP Count - compact */}
            <span className={cn(
              "text-[10px] font-medium tabular-nums",
              isNasrTheme ? "text-[#94a3b8]" : "text-[#94a3b8]"
            )}>
              {xp.toLocaleString()} XP
            </span>

            {/* Streak indicator - inline */}
            {streakDays > 0 && (
              <div className="flex items-center gap-0.5">
                <Flame className="w-3 h-3 text-amber-500" />
                <span className="text-[10px] font-semibold text-amber-500">{streakDays}</span>
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
