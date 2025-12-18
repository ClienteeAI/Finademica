import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useGamification } from "@/hooks/useGamification";

interface SkillData {
  skill_id: string;
  key: string;
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

// Skill colors mapped by skill key
const skillColors: Record<string, string> = {
  risk: "from-[#4DE2E8] to-[#2FB3C6]",
  mindset: "from-[#B5A7FF] to-[#D4CBFF]",
  technical: "from-[#1D3557] to-[#3D5A80]",
  fundamental: "from-[#A7E9FF] to-[#D4E0EC]",
  money_management: "from-[#4DE2E8] to-[#A7E9FF]",
};

// Calculate skill progress: 100 XP per level (display only)
const getSkillProgress = (xp: number): number => {
  const progressInLevel = xp % 100;
  return Math.min((progressInLevel / 100) * 100, 100);
};

export function GamificationSection() {
  const { xp, level, levelName, streakDays, currentLevelXp, nextLevelXp, isLoading, error, refetch } = useGamification();
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [achievements, setAchievements] = useState<AchievementData[]>([]);
  const [detailsLoading, setDetailsLoading] = useState(true);

  // Fetch skills and achievements
  const fetchDetails = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get public user id
      const { data: publicUser } = await supabase
        .from("users")
        .select("id")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (!publicUser?.id) return;

      // Fetch all skills (static definitions)
      const { data: allSkills } = await supabase
        .from("skills")
        .select("id, key, name");

      // Fetch user's skill progress
      const { data: userSkillsData } = await supabase
        .from("user_skills")
        .select("skill_id, level, xp")
        .eq("user_id", publicUser.id);

      // Merge: always show all skills, attach user progress if exists
      if (allSkills) {
        const userSkillsMap = new Map(
          (userSkillsData || []).map((us: any) => [us.skill_id, us])
        );

        const mergedSkills: SkillData[] = allSkills.map((skill: any) => {
          const userProgress = userSkillsMap.get(skill.id);
          return {
            skill_id: skill.id,
            key: skill.key,
            name: skill.name,
            level: userProgress?.level ?? 1,
            xp: userProgress?.xp ?? 0,
          };
        });

        setSkills(mergedSkills);
      }

      // Fetch achievements
      const { data: achievementsData } = await supabase
        .from("user_achievements")
        .select(`
          achievement_id,
          unlocked_at,
          achievements (key, name)
        `)
        .eq("user_id", publicUser.id)
        .order("unlocked_at", { ascending: false });

      if (achievementsData) {
        setAchievements(achievementsData.map((a: any) => ({
          achievement_id: a.achievement_id,
          key: a.achievements?.key || "",
          name: a.achievements?.name || "Achievement",
          unlocked_at: a.unlocked_at,
        })));
      }
    } catch (err) {
      console.error("Error fetching gamification details:", err);
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  // Listen for gamification updates (e.g., after video completion)
  useEffect(() => {
    const handleUpdate = () => {
      fetchDetails();
      refetch?.();
    };
    window.addEventListener('gamification-update', handleUpdate);
    return () => window.removeEventListener('gamification-update', handleUpdate);
  }, [refetch]);

  // Calculate XP progress for display (read-only) - using values from hook
  const xpPercentage = nextLevelXp > currentLevelXp 
    ? Math.min(((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100, 100)
    : 0;

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

      {/* Main Grid - showing only wired features for v1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
                <p className="text-lg text-[#4DE2E8] font-medium">{levelName}</p>
                <p className="text-sm text-[#6B7280] font-mono">
                  {xp} / {nextLevelXp} XP to next level
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

          <div className="flex justify-center py-4">
            <div className="relative">
              <div className="absolute inset-0 w-24 h-24 rounded-full bg-gradient-to-br from-[#4DE2E8]/30 to-[#A7E9FF]/20 blur-xl animate-pulse" />
              <div className="absolute inset-2 w-20 h-20 rounded-full bg-gradient-to-br from-[#4DE2E8]/20 to-[#B5A7FF]/20 blur-lg animate-pulse" style={{ animationDelay: '0.5s' }} />
              
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
                <p className="text-lg font-semibold text-[#1D3557]">{levelName}</p>
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
            {detailsLoading ? (
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
                const color = skillColors[skill.key] || "from-[#4DE2E8] to-[#A7E9FF]";
                const progress = getSkillProgress(skill.xp);
                
                return (
                  <div key={skill.skill_id} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[#1D3557] capitalize">
                        {skill.name.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs text-[#6B7280] font-mono">
                        Lv.{skill.level} · {skill.xp} XP
                      </span>
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
            Skill XP grows as you complete new lessons.
          </p>
        </Card>

        {/* Achievements & Missions Card - Hidden for v1 (backend logic not implemented) */}
      </div>
    </div>
  );
}
