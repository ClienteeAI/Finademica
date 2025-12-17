import { useGamification } from "@/hooks/useGamification";

// XP thresholds - should match xp_levels table
const getXPForNextLevel = (level: number): number => {
  const thresholds: Record<number, number> = {
    1: 0, 2: 150, 3: 300, 4: 450, 5: 600,
    6: 750, 7: 900, 8: 1050, 9: 1200, 10: 1350,
  };
  return thresholds[level + 1] ?? (level + 1) * 150;
};

const getCurrentLevelXP = (level: number): number => {
  const thresholds: Record<number, number> = {
    1: 0, 2: 150, 3: 300, 4: 450, 5: 600,
    6: 750, 7: 900, 8: 1050, 9: 1200, 10: 1350,
  };
  return thresholds[level] ?? (level - 1) * 150;
};

interface XPProgressBarProps {
  compact?: boolean;
  className?: string;
}

const XPProgressBar = ({ compact = false, className = "" }: XPProgressBarProps) => {
  const { xpTotal, level, levelName, isLoading } = useGamification();

  const currentLevelXP = getCurrentLevelXP(level);
  const nextLevelXP = getXPForNextLevel(level);
  const progressPercent = Math.min(((xpTotal - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100, 100);

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-gray-700/50 rounded-full" />
      </div>
    );
  }

  if (compact) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-bold text-cyan-400">Lv.{level}</span>
          <div className="w-24 h-2 bg-gray-700/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs text-gray-400">{xpTotal}/{nextLevelXP}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Level Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
            <span className="text-cyan-400 font-bold">Level {level}</span>
          </div>
          <span className="text-gray-300 font-medium">{levelName}</span>
        </div>
        <span className="text-sm text-gray-400">
          {xpTotal.toLocaleString()} / {nextLevelXP.toLocaleString()} XP
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative h-4 bg-gray-800/50 rounded-full overflow-hidden border border-gray-700/50">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10" />
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-400 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progressPercent}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="absolute right-2 text-xs font-medium text-white/70">
            {Math.round(progressPercent)}%
          </div>
        </div>
      </div>

      {/* Next level hint */}
      <p className="text-xs text-gray-500">
        {nextLevelXP - xpTotal} XP to Level {level + 1}
      </p>
    </div>
  );
};

export default XPProgressBar;
