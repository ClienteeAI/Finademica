import { Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useClient } from "@/lib/clientContext";
import { cn } from "@/lib/utils";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string | null;
  key: string;
  points: number;
  unlocked_at?: string | null;
}

interface AchievementCardProps {
  achievement: Achievement;
  status: "unlocked" | "in_progress" | "locked";
  progress?: number; // 0-100 for in_progress
}

const AchievementCard = ({ achievement, status, progress }: AchievementCardProps) => {
  const { client } = useClient();
  const isPremiumTheme = client?.subdomain === 'finademica';
  const isUnlocked = status === "unlocked";
  const isInProgress = status === "in_progress";
  const isLocked = status === "locked";

  return (
    <Card
      className={cn(
        "relative overflow-hidden p-4 transition-all duration-300 hover:scale-105",
        isUnlocked
          ? (isPremiumTheme 
              ? "bg-premium-panel border-2 border-premium-gold shadow-lg shadow-premium-gold/20" 
              : "bg-gradient-to-br from-yellow-500/20 via-amber-500/10 to-yellow-600/20 border-2 border-yellow-500/50 shadow-lg shadow-yellow-500/20")
          : isInProgress
          ? (isPremiumTheme 
              ? "bg-premium-bg/50 border border-premium-gold/30" 
              : "bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-cyan-600/10 border border-cyan-500/30")
          : (isPremiumTheme
              ? "bg-premium-bg border border-premium-gold/10 opacity-60"
              : "bg-gray-900/50 border border-gray-700/30 opacity-60")
      )}
    >
      {/* Glow effect for unlocked */}
      {isUnlocked && (
        <div className={cn(
          "absolute inset-0 animate-pulse",
          isPremiumTheme 
            ? "bg-gradient-to-tr from-premium-gold/10 via-transparent to-premium-gold/5" 
            : "bg-gradient-to-tr from-yellow-500/10 via-transparent to-amber-500/10"
        )} />
      )}

      {/* Lock overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
          <Lock className="w-6 h-6 text-gray-500" />
        </div>
      )}

      <div className={`relative z-10 text-center space-y-3 ${isLocked ? "opacity-50" : ""}`}>
        {/* Icon */}
        <div
          className={`text-4xl mx-auto ${
            isUnlocked ? "animate-bounce" : isLocked ? "grayscale" : ""
          }`}
          style={{ animationDuration: "2s" }}
        >
          {achievement.icon || "🏆"}
        </div>

        {/* Name */}
        <h3
          className={cn(
            "font-bold text-sm",
            isUnlocked 
              ? (isPremiumTheme ? "text-premium-gold font-serif" : "text-yellow-400") 
              : isInProgress 
              ? (isPremiumTheme ? "text-premium-gold/80" : "text-cyan-400") 
              : (isPremiumTheme ? "text-premium-text-muted" : "text-gray-500")
          )}
        >
          {achievement.name}
        </h3>

        {/* Description */}
        <p className={cn("text-xs line-clamp-2", isPremiumTheme ? "text-premium-text-muted" : "text-gray-400")}>{achievement.description}</p>

        {/* Progress bar for in_progress */}
        {isInProgress && progress !== undefined && (
          <div className={cn("w-full h-1.5 rounded-full overflow-hidden", isPremiumTheme ? "bg-premium-gold/10" : "bg-gray-700/50")}>
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                isPremiumTheme ? "bg-premium-gold" : "bg-gradient-to-r from-cyan-500 to-blue-500"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Status badge */}
        <Badge
          className={cn(
            "text-xs border-0",
            isUnlocked
              ? (isPremiumTheme ? "bg-premium-gold text-premium-bg" : "bg-gradient-to-r from-yellow-500 to-amber-500 text-black")
              : isInProgress
              ? (isPremiumTheme ? "bg-premium-gold/20 text-premium-gold" : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30")
              : (isPremiumTheme ? "bg-premium-bg text-premium-text-muted" : "bg-gray-700/50 text-gray-500 border border-gray-600/30")
          )}
        >
          {isUnlocked ? "UNLOCKED" : isInProgress ? "IN PROGRESS" : "LOCKED"}
        </Badge>

        {/* Unlock date */}
        {isUnlocked && achievement.unlocked_at && (
          <p className={cn("text-xs", isPremiumTheme ? "text-premium-gold/70" : "text-yellow-500/70")}>
            {new Date(achievement.unlocked_at).toLocaleDateString()}
          </p>
        )}

        {/* Points */}
        <p className="text-xs text-gray-500">+{achievement.points} XP</p>
      </div>
    </Card>
  );
};

export default AchievementCard;
