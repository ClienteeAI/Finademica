import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Trophy, Target, Flame, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface SkillData {
  skill_id: string;
  name: string;
  level: number;
  xp: number;
}

interface AchievementData {
  achievement_id: string;
  key: string;
  name: string;
  unlocked_at: string;
}

interface GamificationData {
  xp: number;
  level: number;
  streak_days: number;
  skills: SkillData[];
  achievements: AchievementData[];
}

// Skill colors mapped by skill name/key
const skillColors: Record<string, string> = {
  risk: "from-[#4DE2E8] to-[#2FB3C6]",
  mindset: "from-[#B5A7FF] to-[#D4CBFF]",
  technical: "from-[#1D3557] to-[#3D5A80]",
  fundamental: "from-[#A7E9FF] to-[#D4E0EC]",
  money_management: "from-[#4DE2E8] to-[#A7E9FF]",
};

// Level titles based on level
const getLevelTitle = (level: number): string => {
  if (level <= 2) return "Novice Trader";
  if (level <= 4) return "Apprentice Trader";
  if (level <= 6) return "Rising Analyst";
  if (level <= 8) return "Strategic Learner";
  if (level <= 10) return "Market Tactician";
  return "Master Trader";
};

// Calculate XP needed for next level (150 XP per level)
const getXPForLevel = (level: number): number => {
  return level * 150;
};

export function GamificationSection() {
  const [gamificationData, setGamificationData] = useState<GamificationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGamificationData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get the current authenticated user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setError("Not authenticated");
          setIsLoading(false);
          return;
        }

        // Map auth user to public.users.id
        const { data: publicUser } = await supabase
          .from("users")
          .select("id")
          .eq("auth_user_id", user.id)
          .maybeSingle();

        const userId = publicUser?.id;
        if (!userId) {
          setError("User profile not found");
          setIsLoading(false);
          return;
        }

        // Call the get_gamification function with public user id
        const { data, error: rpcError } = await supabase.rpc('get_gamification', {
          uid: userId
        });

        if (rpcError) {
          console.error("Error fetching gamification data:", rpcError);
          setError("Could not load gamification data");
          setIsLoading(false);
          return;
        }

        if (data) {
          setGamificationData(data as unknown as GamificationData);
        }
      } catch (err) {
        console.error("Failed to fetch gamification data:", err);
        setError("Could not load gamification data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGamificationData();
  }, []);

  // Calculate derived values
  const level = gamificationData?.level ?? 1;
  const currentXP = gamificationData?.xp ?? 0;
  const nextLevelXP = getXPForLevel(level + 1);
  const currentLevelXP = getXPForLevel(level);
  const xpProgress = currentXP - currentLevelXP;
  const xpNeeded = nextLevelXP - currentLevelXP;
  const xpPercentage = xpNeeded > 0 ? Math.min((xpProgress / xpNeeded) * 100, 100) : 0;
  const levelTitle = getLevelTitle(level);
  const streak = gamificationData?.streak_days ?? 0;
  const skills = gamificationData?.skills ?? [];
  const achievements = gamificationData?.achievements ?? [];

  // Calculate skill progress (XP within current skill level)
  const getSkillProgress = (skillXP: number, skillLevel: number): number => {
    const xpForCurrentLevel = skillLevel * 50;
    const xpForNextLevel = (skillLevel + 1) * 50;
    const progress = ((skillXP - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;
    return Math.max(0, Math.min(progress, 100));
  };

  // Error state
  if (error && !isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4DE2E8]/20 to-[#A7E9FF]/20 flex items-center justify-center border border-[#4DE2E8]/30">
            <Sparkles className="w-5 h-5 text-[#2FB3C6]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#1D3557] tracking-tight">Trader Progress</h2>
            <p className="text-sm text-[#6B7280]">Your trading RPG journey</p>
          </div>
        </div>
        <Card className="p-8">
          <p className="text-sm text-[#6B7280] text-center">{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4DE2E8]/20 to-[#A7E9FF]/20 flex items-center justify-center border border-[#4DE2E8]/30">
          <Sparkles className="w-5 h-5 text-[#2FB3C6]" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#1D3557] tracking-tight">Trader Progress</h2>
          <p className="text-sm text-[#6B7280]">Your trading RPG journey</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Level & XP Card */}
        <Card className="p-6 space-y-5 group hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-sm uppercase tracking-widest text-[#6B7280] font-semibold">
              Your Trader Level
            </h3>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4DE2E8]/20 to-[#A7E9FF]/20 flex items-center justify-center border border-[#4DE2E8]/30">
              <Target className="w-4 h-4 text-[#2FB3C6]" />
            </div>
          </div>

          <div className="space-y-1">
            {isLoading ? (
              <>
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-48" />
              </>
            ) : (
              <>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-[#1D3557] font-mono">
                    Level {level}
                  </span>
                </div>
                <p className="text-lg text-[#4DE2E8] font-medium">{levelTitle}</p>
                <p className="text-sm text-[#6B7280] font-mono">
                  {currentXP} / {nextLevelXP} XP to next level
                </p>
              </>
            )}
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-2">
            <div className="h-3 bg-[#D4E0EC]/40 rounded-full overflow-hidden backdrop-blur-sm border border-[#D4E0EC]/60">
              {isLoading ? (
                <div className="h-full w-0" />
              ) : (
                <div
                  className="h-full bg-gradient-to-r from-[#4DE2E8] to-[#A7E9FF] relative overflow-hidden shadow-[0_0_12px_rgba(77,226,232,0.4)] transition-all duration-1000"
                  style={{ width: `${xpPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-[#6B7280] leading-relaxed">
            Complete lessons, use the Mentor, and follow your roadmap to gain XP.
          </p>
        </Card>

        {/* Avatar Card */}
        <Card className="p-6 space-y-5 group hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 relative overflow-hidden">
          {/* Holographic glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#4DE2E8]/5 via-transparent to-[#B5A7FF]/10 pointer-events-none" />
          
          <div className="flex items-center justify-between relative">
            <h3 className="text-sm uppercase tracking-widest text-[#6B7280] font-semibold">
              AI Trading Avatar
            </h3>
            {isLoading ? (
              <Skeleton className="h-5 w-16" />
            ) : (
              <Badge variant="success" className="text-xs">Stage {Math.floor(level / 3) + 1}</Badge>
            )}
          </div>

          {/* Avatar Placeholder - Glowing Orb */}
          <div className="flex justify-center py-4">
            <div className="relative">
              {/* Outer glow rings */}
              <div className="absolute inset-0 w-24 h-24 rounded-full bg-gradient-to-br from-[#4DE2E8]/30 to-[#A7E9FF]/20 blur-xl animate-pulse" />
              <div className="absolute inset-2 w-20 h-20 rounded-full bg-gradient-to-br from-[#4DE2E8]/20 to-[#B5A7FF]/20 blur-lg animate-pulse" style={{ animationDelay: '0.5s' }} />
              
              {/* Main orb */}
              <div className={cn(
                "relative w-24 h-24 rounded-full",
                "bg-gradient-to-br from-[#4DE2E8]/30 via-white/60 to-[#A7E9FF]/30",
                "border-2 border-[#4DE2E8]/50",
                "flex items-center justify-center",
                "shadow-[0_0_30px_rgba(77,226,232,0.25),inset_0_0_20px_rgba(255,255,255,0.5)]",
                "group-hover:shadow-[0_0_40px_rgba(77,226,232,0.4),inset_0_0_25px_rgba(255,255,255,0.6)]",
                "transition-all duration-500"
              )}>
                <Sparkles className="w-10 h-10 text-[#2FB3C6] drop-shadow-[0_0_8px_rgba(77,226,232,0.6)]" />
              </div>
            </div>
          </div>

          <div className="text-center space-y-1 relative">
            {isLoading ? (
              <>
                <Skeleton className="h-6 w-32 mx-auto" />
                <Skeleton className="h-4 w-48 mx-auto" />
              </>
            ) : (
              <>
                <p className="text-lg font-semibold text-[#1D3557]">{levelTitle}</p>
                <p className="text-xs text-[#6B7280]">
                  Keep learning to evolve your avatar.
                </p>
              </>
            )}
          </div>

          <p className="text-xs text-[#6B7280] text-center border-t border-[#D4E0EC]/60 pt-3">
            Next stage unlocks at Level {(Math.floor(level / 3) + 1) * 3 + 1}
          </p>
        </Card>

        {/* Skill Tree Card */}
        <Card className="p-6 space-y-5 group hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-sm uppercase tracking-widest text-[#6B7280] font-semibold">
              Your Skill Tree
            </h3>
          </div>

          <div className="space-y-3">
            {isLoading ? (
              // Loading skeletons for skills
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-8" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ))
            ) : skills.length > 0 ? (
              skills.map((skill) => {
                const colorKey = skill.name.toLowerCase().replace(/\s+/g, '_');
                const color = skillColors[colorKey] || "from-[#4DE2E8] to-[#A7E9FF]";
                const progress = getSkillProgress(skill.xp, skill.level);
                
                return (
                  <div key={skill.skill_id} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[#1D3557] capitalize">{skill.name}</span>
                      <span className="text-xs text-[#6B7280] font-mono">Lv.{skill.level}</span>
                    </div>
                    <div className="h-2 bg-[#D4E0EC]/40 rounded-full overflow-hidden border border-[#D4E0EC]/50">
                      <div
                        className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-1000", color)}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-[#6B7280] text-center py-4">
                No skills unlocked yet. Start learning to grow your skills!
              </p>
            )}
          </div>

          <p className="text-xs text-[#6B7280] leading-relaxed border-t border-[#D4E0EC]/60 pt-3">
            Skill levels grow as you complete specific lessons and actions.
          </p>
        </Card>

        {/* Achievements & Missions Card */}
        <Card className="p-6 space-y-5 group hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-sm uppercase tracking-widest text-[#6B7280] font-semibold">
              Achievements & Missions
            </h3>
            <Trophy className="w-4 h-4 text-[#4DE2E8]" />
          </div>

          {/* Streak */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-[#4DE2E8]/10 to-[#A7E9FF]/10 border border-[#4DE2E8]/30">
            <Flame className="w-5 h-5 text-[#2FB3C6]" />
            <div>
              {isLoading ? (
                <>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-[#1D3557]">
                    Streak: {streak} day{streak !== 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-[#6B7280]">
                    {streak > 0 ? "Keep it going!" : "Start your streak today!"}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Unlocked Badges */}
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider text-[#6B7280] font-semibold">
              Latest Badge{achievements.length > 1 ? 's' : ''}
            </p>
            {isLoading ? (
              // Loading skeleton for achievements
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-[#4DE2E8]/5 to-[#A7E9FF]/10 border border-[#4DE2E8]/25">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-20 mb-1" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ) : achievements.length > 0 ? (
              achievements.slice(0, 3).map((achievement) => (
                <div
                  key={achievement.achievement_id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-[#4DE2E8]/5 to-[#A7E9FF]/10 border border-[#4DE2E8]/25"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4DE2E8] to-[#2FB3C6] flex items-center justify-center shadow-[0_0_12px_rgba(77,226,232,0.4)]">
                    <Trophy className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1D3557]">{achievement.name}</p>
                    <p className="text-xs text-[#6B7280] truncate">
                      Unlocked {new Date(achievement.unlocked_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 rounded-xl bg-[#D4E0EC]/20 border border-[#D4E0EC]/50">
                <p className="text-xs text-[#6B7280] text-center">
                  No achievements yet. Keep learning!
                </p>
              </div>
            )}
          </div>

          {/* Active Mission */}
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider text-[#6B7280] font-semibold">
              Active Mission
            </p>
            <div className="p-3 rounded-xl bg-[#D4E0EC]/20 border border-[#D4E0EC]/50">
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Watch 2 videos and ask the Mentor 1 question this week.
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs text-[#6B7280] hover:text-[#1D3557]"
            onClick={() => console.log("View all achievements")}
          >
            View all achievements
            <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        </Card>
      </div>
    </div>
  );
}
