import { useEffect, useState } from "react";
import { Flame, Sparkles, Star, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import { useClient } from "@/lib/clientContext";

interface StreakCelebrationProps {
  streakDays: number;
}

// Milestone definitions
const MILESTONES = [3, 7, 14, 21, 30, 60, 90, 180, 365];

const getMilestoneMessage = (days: number): string => {
  if (days >= 365) return "🏆 Legendary! One year of dedication!";
  if (days >= 180) return "👑 Unstoppable! 6 months strong!";
  if (days >= 90) return "🔥 On fire! 90 days of growth!";
  if (days >= 60) return "💪 Incredible! 2 months of learning!";
  if (days >= 30) return "🌟 Amazing! A full month of trading education!";
  if (days >= 21) return "⚡ 3 weeks! Habits are forming!";
  if (days >= 14) return "🎯 2 weeks! You're building momentum!";
  if (days >= 7) return "🔥 One week! You're on a roll!";
  if (days >= 3) return "✨ Great start! 3 days in a row!";
  return "";
};

const isMilestone = (days: number): boolean => {
  return MILESTONES.includes(days);
};

const getStreakLevel = (days: number): { level: number; color: string; icon: string } => {
  if (days >= 90) return { level: 5, color: "from-purple-500 via-pink-500 to-rose-500", icon: "👑" };
  if (days >= 30) return { level: 4, color: "from-amber-400 via-orange-500 to-red-500", icon: "🔥" };
  if (days >= 14) return { level: 3, color: "from-orange-400 to-amber-500", icon: "⚡" };
  if (days >= 7) return { level: 2, color: "from-yellow-400 to-orange-400", icon: "✨" };
  if (days >= 3) return { level: 1, color: "from-gray-400 to-yellow-400", icon: "🌱" };
  return { level: 0, color: "from-gray-500 to-gray-400", icon: "💤" };
};

export function StreakCelebration({ streakDays }: StreakCelebrationProps) {
  const { client } = useClient();
  const isPremiumTheme = client?.subdomain === 'finademica';
  const [showCelebration, setShowCelebration] = useState(false);
  const [animateFlame, setAnimateFlame] = useState(false);
  
  const milestone = isMilestone(streakDays);
  const message = getMilestoneMessage(streakDays);
  const streakLevel = getStreakLevel(streakDays);

  // Trigger celebration animation on milestone
  useEffect(() => {
    if (milestone && streakDays > 0) {
      setShowCelebration(true);
      
      // Fire confetti for milestones
      const colors = isPremiumTheme 
        ? ['#D4AF37', '#B8860B', '#FFD700'] 
        : ['#6366F1', '#A7E9FF', '#B5A7FF'];
      
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors,
      });
      
      // Hide celebration after delay
      const timer = setTimeout(() => setShowCelebration(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [streakDays, milestone, isPremiumTheme]);

  // Animate flame continuously for active streaks
  useEffect(() => {
    if (streakDays > 0) {
      setAnimateFlame(true);
    }
  }, [streakDays]);

  return (
    <div className="relative overflow-hidden">
      {/* Celebration overlay for milestones */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {/* Radial glow */}
          <div className={cn(
            "absolute inset-0 animate-pulse",
            isPremiumTheme 
              ? "bg-gradient-radial from-premium-gold/20 via-transparent to-transparent" 
              : "bg-gradient-radial from-cyan-500/20 via-transparent to-transparent"
          )} />
          
          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "absolute w-2 h-2 rounded-full animate-float-up",
                isPremiumTheme ? "bg-premium-gold" : "bg-cyan-400"
              )}
              style={{
                left: `${15 + i * 15}%`,
                animationDelay: `${i * 0.2}s`,
                opacity: 0.6,
              }}
            />
          ))}
        </div>
      )}

      {/* Main streak card */}
      <div className={cn(
        "flex items-center justify-between p-4 rounded-xl transition-all duration-500",
        showCelebration && "scale-[1.02]",
        isPremiumTheme 
          ? "bg-premium-panel/80 border border-premium-gold/20" 
          : "bg-card"
      )}>
        <div className="flex items-center gap-4">
          {/* Animated flame icon */}
          <div className={cn(
            "relative w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden",
            streakDays > 0 ? `bg-gradient-to-br ${streakLevel.color}` : "bg-gray-700/50"
          )}>
            {/* Flame glow effect */}
            {streakDays > 0 && (
              <div className={cn(
                "absolute inset-0 rounded-xl",
                animateFlame && "animate-streak-glow"
              )} />
            )}
            
            {/* Icon */}
            <div className={cn(
              "relative z-10",
              animateFlame && streakDays > 0 && "animate-streak-flame"
            )}>
              <Flame className={cn(
                "w-7 h-7",
                streakDays > 0 ? "text-white drop-shadow-lg" : "text-gray-500"
              )} />
            </div>
            
            {/* Sparkle effects for high streaks */}
            {streakDays >= 7 && (
              <>
                <Sparkles className="absolute top-0 right-0 w-3 h-3 text-yellow-200 animate-pulse" />
                <Star className="absolute bottom-0 left-0 w-2 h-2 text-yellow-200 animate-pulse" style={{ animationDelay: '0.5s' }} />
              </>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-foreground">Learning Streak</p>
              {streakDays >= 7 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30">
                  {streakLevel.icon} Level {streakLevel.level}
                </span>
              )}
            </div>
            <p className={cn(
              "text-xs transition-all duration-300",
              showCelebration ? (isPremiumTheme ? "text-premium-gold" : "text-cyan-400") : "text-muted-foreground"
            )}>
              {showCelebration && message 
                ? message 
                : streakDays > 0 
                  ? `${streakDays} day${streakDays !== 1 ? 's' : ''} and counting!`
                  : "Watch a video daily to build your streak"
              }
            </p>
          </div>
        </div>

        {/* Streak counter */}
        <div className={cn(
          "text-right transition-all duration-300",
          showCelebration && "scale-110"
        )}>
          <p className={cn(
            "text-3xl font-bold font-mono",
            streakDays > 0 
              ? showCelebration 
                ? (isPremiumTheme ? "text-premium-gold" : "text-cyan-400") 
                : "text-foreground"
              : "text-muted-foreground"
          )}>
            {streakDays}
          </p>
          <p className="text-xs text-muted-foreground">days</p>
        </div>
      </div>

      {/* Next milestone hint */}
      {streakDays > 0 && !showCelebration && (
        <div className="mt-2 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Zap className="w-3 h-3" />
          <span>
            {MILESTONES.find(m => m > streakDays) 
              ? `${MILESTONES.find(m => m > streakDays)! - streakDays} days until next milestone`
              : "Maximum streak achieved!"}
          </span>
        </div>
      )}
    </div>
  );
}

export default StreakCelebration;
