import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const LEVEL_NAMES: Record<number, string> = {
  1: "Beginner Trader",
  2: "Student Trader",
  3: "Apprentice Trader",
  4: "Intermediate Trader",
  5: "Advanced Trader",
  6: "Expert Trader",
  7: "Professional Trader",
  8: "Elite Trader",
  9: "Master Trader",
  10: "Legend Trader",
};

const XP_PER_LEVEL = 150;

interface XPProgressBarProps {
  compact?: boolean;
  className?: string;
}

const XPProgressBar = ({ compact = false, className = "" }: XPProgressBarProps) => {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const userId = user.id;

      const { data } = await supabase
        .from("user_gamification")
        .select("experience_points, level")
        .eq("user_id", userId)
        .maybeSingle();

      if (data) {
        const oldXp = xp;
        setXp(data.experience_points || 0);
        setLevel(data.level || 1);
        
        // Trigger animation if XP increased
        if (data.experience_points > oldXp && oldXp > 0) {
          setIsAnimating(true);
          setTimeout(() => setIsAnimating(false), 1000);
        }
      }
    };

    fetchStats();
    
    // Poll for updates every 5 seconds when visible
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentLevelXp = (level - 1) * XP_PER_LEVEL;
  const nextLevelXp = level * XP_PER_LEVEL;
  const progressInLevel = xp - currentLevelXp;
  const progressPercent = Math.min((progressInLevel / XP_PER_LEVEL) * 100, 100);

  const levelName = LEVEL_NAMES[level] || `Level ${level} Trader`;

  if (compact) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-bold text-cyan-400">Lv.{level}</span>
          <div className="w-24 h-2 bg-gray-700/50 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500 ${
                isAnimating ? "animate-pulse shadow-lg shadow-cyan-500/50" : ""
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs text-gray-400">{xp}/{nextLevelXp}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Level Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 ${
            isAnimating ? "animate-pulse shadow-lg shadow-cyan-500/30" : ""
          }`}>
            <span className="text-cyan-400 font-bold">Level {level}</span>
          </div>
          <span className="text-gray-300 font-medium">{levelName}</span>
        </div>
        <span className="text-sm text-gray-400">
          {xp.toLocaleString()} / {nextLevelXp.toLocaleString()} XP
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative h-4 bg-gray-800/50 rounded-full overflow-hidden border border-gray-700/50">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10" />
        
        {/* Progress fill */}
        <div
          className={`absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-400 rounded-full transition-all duration-700 ease-out ${
            isAnimating ? "shadow-lg shadow-cyan-500/50" : ""
          }`}
          style={{ width: `${progressPercent}%` }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
          
          {/* Animated particles when gaining XP */}
          {isAnimating && (
            <div className="absolute right-0 top-0 bottom-0 w-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full animate-ping"
                  style={{
                    right: `${Math.random() * 16}px`,
                    top: `${Math.random() * 16}px`,
                    animationDelay: `${i * 100}ms`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Level markers */}
        <div className="absolute inset-0 flex items-center">
          <div className="absolute right-2 text-xs font-medium text-white/70">
            {Math.round(progressPercent)}%
          </div>
        </div>
      </div>

      {/* Next level hint */}
      <p className="text-xs text-gray-500">
        {nextLevelXp - xp} XP to Level {level + 1}
      </p>
    </div>
  );
};

export default XPProgressBar;
