import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useGamification } from "@/hooks/useGamification";
import { useClient } from "@/lib/clientContext";

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
  const { client } = useClient();
  const { xp, level, levelName, streakDays, currentLevelXp, nextLevelXp, isLoading, error, refetch } = useGamification();
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [achievements, setAchievements] = useState<AchievementData[]>([]);
  const [detailsLoading, setDetailsLoading] = useState(true);
  
  // Theme detection
  const isNasrTheme = client?.subdomain === 'nasr';

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

  // Calculate XP progress within current level (read-only)
  const xpInCurrentLevel = xp - currentLevelXp;
  const xpNeededForLevel = nextLevelXp - currentLevelXp;
  const xpPercentage = xpNeededForLevel > 0 
    ? Math.min((xpInCurrentLevel / xpNeededForLevel) * 100, 100)
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
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center border",
          isNasrTheme 
            ? "bg-gradient-to-br from-gold/20 to-gold-light/20 border-gold/30" 
            : "bg-gradient-to-br from-[#4DE2E8]/20 to-[#A7E9FF]/20 border-[#4DE2E8]/30"
        )}>
          <Sparkles className={cn("w-5 h-5", isNasrTheme ? "text-gold" : "text-[#2FB3C6]")} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Trader Progress</h2>
          <p className="text-sm text-muted-foreground">Your trading RPG journey</p>
        </div>
      </div>

      {/* Main Grid - showing only wired features for v1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Level & XP Card */}
        <Card className="p-6 space-y-5 group hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-sm uppercase tracking-widest text-muted-foreground font-semibold">
              Your Trader Level
            </h3>
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center border",
              isNasrTheme 
                ? "bg-gradient-to-br from-gold/20 to-gold-light/20 border-gold/30" 
                : "bg-gradient-to-br from-[#4DE2E8]/20 to-[#A7E9FF]/20 border-[#4DE2E8]/30"
            )}>
              <Target className={cn("w-4 h-4", isNasrTheme ? "text-gold" : "text-[#2FB3C6]")} />
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
                  <span className="text-4xl font-bold text-foreground font-mono">
                    Level {level}
                  </span>
                </div>
                <p className={cn("text-lg font-medium", isNasrTheme ? "text-gold" : "text-[#4DE2E8]")}>{levelName}</p>
                <p className="text-sm text-muted-foreground font-mono">
                  {xpInCurrentLevel} / {xpNeededForLevel} XP to next level
                </p>
              </>
            )}
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-2">
            <div className={cn(
              "h-3 rounded-full overflow-hidden backdrop-blur-sm border",
              isNasrTheme ? "bg-white/5 border-white/10" : "bg-[#D4E0EC]/40 border-[#D4E0EC]/60"
            )}>
              {isLoading ? (
                <div className="h-full w-0" />
              ) : (
                <div
                  className={cn(
                    "h-full bg-gradient-to-r relative overflow-hidden transition-all duration-1000",
                    isNasrTheme 
                      ? "from-gold-light to-gold shadow-[0_0_12px_rgba(212,175,55,0.4)]" 
                      : "from-[#4DE2E8] to-[#A7E9FF] shadow-[0_0_12px_rgba(77,226,232,0.4)]"
                  )}
                  style={{ width: `${xpPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Complete lessons, use the Mentor, and follow your roadmap to gain XP.
          </p>
        </Card>

        {/* Avatar Card */}
        <Card className="p-6 space-y-5 group hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 relative overflow-hidden">
          <div className={cn(
            "absolute inset-0 pointer-events-none",
            isNasrTheme 
              ? "bg-gradient-to-br from-gold/5 via-transparent to-gold-light/10" 
              : "bg-gradient-to-br from-[#4DE2E8]/5 via-transparent to-[#B5A7FF]/10"
          )} />
          
          <div className="flex items-center justify-between relative">
            <h3 className="text-sm uppercase tracking-widest text-muted-foreground font-semibold">
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
              <div className={cn(
                "absolute inset-0 w-24 h-24 rounded-full blur-xl animate-pulse",
                isNasrTheme ? "bg-gradient-to-br from-gold/30 to-gold-light/20" : "bg-gradient-to-br from-[#4DE2E8]/30 to-[#A7E9FF]/20"
              )} />
              <div className={cn(
                "absolute inset-2 w-20 h-20 rounded-full blur-lg animate-pulse",
                isNasrTheme ? "bg-gradient-to-br from-gold/20 to-gold-light/20" : "bg-gradient-to-br from-[#4DE2E8]/20 to-[#B5A7FF]/20"
              )} style={{ animationDelay: '0.5s' }} />
              
              <div className={cn(
                "relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500",
                isNasrTheme 
                  ? "bg-gradient-to-br from-gold/30 via-white/10 to-gold-light/30 border-2 border-gold/50 shadow-[0_0_30px_rgba(212,175,55,0.25),inset_0_0_20px_rgba(255,255,255,0.2)] group-hover:shadow-[0_0_40px_rgba(212,175,55,0.4),inset_0_0_25px_rgba(255,255,255,0.3)]"
                  : "bg-gradient-to-br from-[#4DE2E8]/30 via-white/60 to-[#A7E9FF]/30 border-2 border-[#4DE2E8]/50 shadow-[0_0_30px_rgba(77,226,232,0.25),inset_0_0_20px_rgba(255,255,255,0.5)] group-hover:shadow-[0_0_40px_rgba(77,226,232,0.4),inset_0_0_25px_rgba(255,255,255,0.6)]"
              )}>
                <Sparkles className={cn(
                  "w-10 h-10",
                  isNasrTheme ? "text-gold drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]" : "text-[#2FB3C6] drop-shadow-[0_0_8px_rgba(77,226,232,0.6)]"
                )} />
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
                <p className="text-lg font-semibold text-foreground">{levelName}</p>
                <p className="text-xs text-muted-foreground">
                  Keep learning to evolve your avatar.
                </p>
              </>
            )}
          </div>

          <p className={cn(
            "text-xs text-muted-foreground text-center border-t pt-3",
            isNasrTheme ? "border-white/10" : "border-[#D4E0EC]/60"
          )}>
            Next stage unlocks at Level {(Math.floor(level / 3) + 1) * 3 + 1}
          </p>
        </Card>

        {/* Skill Tree Card */}
        <Card className="p-6 space-y-5 group hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-sm uppercase tracking-widest text-muted-foreground font-semibold">
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
                const color = isNasrTheme 
                  ? "from-gold-light to-gold" 
                  : skillColors[skill.key] || "from-[#4DE2E8] to-[#A7E9FF]";
                const progress = getSkillProgress(skill.xp);
                const hasProgress = skill.xp > 0;
                
                return (
                  <div key={skill.skill_id} className={cn("space-y-1.5", !hasProgress && "opacity-60")}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground capitalize">
                        {skill.name.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {hasProgress ? `Lv.${skill.level} · ${skill.xp} XP` : "Start learning"}
                      </span>
                    </div>
                    <div className={cn(
                      "h-2 rounded-full overflow-hidden border",
                      isNasrTheme ? "bg-white/5 border-white/10" : "bg-[#D4E0EC]/40 border-[#D4E0EC]/50"
                    )}>
                      <div
                        className={cn(
                          "h-full rounded-full bg-gradient-to-r transition-all duration-1000",
                          color,
                          hasProgress && (isNasrTheme ? "shadow-[0_0_8px_rgba(212,175,55,0.3)]" : "shadow-[0_0_8px_rgba(77,226,232,0.3)]")
                        )}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-muted-foreground text-center py-4">
                No skills unlocked yet. Start learning to grow your skills!
              </p>
            )}
          </div>

          <p className={cn(
            "text-xs text-muted-foreground leading-relaxed border-t pt-3",
            isNasrTheme ? "border-white/10" : "border-[#D4E0EC]/60"
          )}>
            Skill XP grows as you complete new lessons.
          </p>
        </Card>

        {/* Achievements & Missions Card - Hidden for v1 (backend logic not implemented) */}
      </div>
    </div>
  );
}
