import { Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  const isUnlocked = status === "unlocked";
  const isInProgress = status === "in_progress";
  const isLocked = status === "locked";

  return (
    <Card
      className={`relative overflow-hidden p-4 transition-all duration-300 hover:scale-105 ${
        isUnlocked
          ? "bg-gradient-to-br from-yellow-500/20 via-amber-500/10 to-yellow-600/20 border-2 border-yellow-500/50 shadow-lg shadow-yellow-500/20"
          : isInProgress
          ? "bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-cyan-600/10 border border-cyan-500/30"
          : "bg-gray-900/50 border border-gray-700/30 opacity-60"
      }`}
    >
      {/* Glow effect for unlocked */}
      {isUnlocked && (
        <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/10 via-transparent to-amber-500/10 animate-pulse" />
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
          className={`font-bold text-sm ${
            isUnlocked ? "text-yellow-400" : isInProgress ? "text-cyan-400" : "text-gray-500"
          }`}
        >
          {achievement.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-400 line-clamp-2">{achievement.description}</p>

        {/* Progress bar for in_progress */}
        {isInProgress && progress !== undefined && (
          <div className="w-full h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Status badge */}
        <Badge
          className={`text-xs ${
            isUnlocked
              ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-black border-0"
              : isInProgress
              ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
              : "bg-gray-700/50 text-gray-500 border-gray-600/30"
          }`}
        >
          {isUnlocked ? "UNLOCKED" : isInProgress ? "IN PROGRESS" : "LOCKED"}
        </Badge>

        {/* Unlock date */}
        {isUnlocked && achievement.unlocked_at && (
          <p className="text-xs text-yellow-500/70">
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
