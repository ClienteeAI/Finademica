import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Trophy, Target, Flame, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Placeholder data - will be replaced with Supabase data later
const placeholderData = {
  level: 7,
  levelTitle: "Strategic Learner",
  currentXP: 420,
  nextLevelXP: 500,
  avatarStage: 2,
  avatarTitle: "Emerging Analyst",
  streak: 4,
  skills: [
    { name: "Risk", level: 3, progress: 65, color: "from-[#4DE2E8] to-[#2FB3C6]" },
    { name: "Mindset", level: 4, progress: 80, color: "from-[#B5A7FF] to-[#D4CBFF]" },
    { name: "Technical", level: 2, progress: 40, color: "from-[#1D3557] to-[#3D5A80]" },
    { name: "Fundamental", level: 3, progress: 55, color: "from-[#A7E9FF] to-[#D4E0EC]" },
    { name: "Money Mgmt", level: 2, progress: 35, color: "from-[#4DE2E8] to-[#A7E9FF]" },
  ],
  achievements: [
    { name: "First Step", description: "Completed your first video.", unlocked: true },
  ],
  activeMission: "Watch 2 videos and ask the Mentor 1 question this week.",
};

export function GamificationSection() {
  const xpPercentage = (placeholderData.currentXP / placeholderData.nextLevelXP) * 100;

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
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-[#1D3557] font-mono">
                Level {placeholderData.level}
              </span>
            </div>
            <p className="text-lg text-[#4DE2E8] font-medium">{placeholderData.levelTitle}</p>
            <p className="text-sm text-[#6B7280] font-mono">
              {placeholderData.currentXP} / {placeholderData.nextLevelXP} XP to next level
            </p>
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-2">
            <div className="h-3 bg-[#D4E0EC]/40 rounded-full overflow-hidden backdrop-blur-sm border border-[#D4E0EC]/60">
              <div
                className="h-full bg-gradient-to-r from-[#4DE2E8] to-[#A7E9FF] relative overflow-hidden shadow-[0_0_12px_rgba(77,226,232,0.4)]"
                style={{ width: `${xpPercentage}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
              </div>
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
            <Badge variant="success" className="text-xs">Stage {placeholderData.avatarStage}</Badge>
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
            <p className="text-lg font-semibold text-[#1D3557]">{placeholderData.avatarTitle}</p>
            <p className="text-xs text-[#6B7280]">
              Keep learning to evolve your avatar.
            </p>
          </div>

          <p className="text-xs text-[#6B7280] text-center border-t border-[#D4E0EC]/60 pt-3">
            Next stage unlocks at Level 10
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
            {placeholderData.skills.map((skill) => (
              <div key={skill.name} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#1D3557]">{skill.name}</span>
                  <span className="text-xs text-[#6B7280] font-mono">Lv.{skill.level}</span>
                </div>
                <div className="h-2 bg-[#D4E0EC]/40 rounded-full overflow-hidden border border-[#D4E0EC]/50">
                  <div
                    className={cn("h-full rounded-full bg-gradient-to-r", skill.color)}
                    style={{ width: `${skill.progress}%` }}
                  />
                </div>
              </div>
            ))}
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
              <p className="text-sm font-semibold text-[#1D3557]">
                Streak: {placeholderData.streak} days
              </p>
              <p className="text-xs text-[#6B7280]">Keep it going!</p>
            </div>
          </div>

          {/* Unlocked Badge */}
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider text-[#6B7280] font-semibold">
              Latest Badge
            </p>
            {placeholderData.achievements.filter(a => a.unlocked).map((achievement) => (
              <div
                key={achievement.name}
                className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-[#4DE2E8]/5 to-[#A7E9FF]/10 border border-[#4DE2E8]/25"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4DE2E8] to-[#2FB3C6] flex items-center justify-center shadow-[0_0_12px_rgba(77,226,232,0.4)]">
                  <Trophy className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1D3557]">{achievement.name}</p>
                  <p className="text-xs text-[#6B7280] truncate">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Active Mission */}
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider text-[#6B7280] font-semibold">
              Active Mission
            </p>
            <div className="p-3 rounded-xl bg-[#D4E0EC]/20 border border-[#D4E0EC]/50">
              <p className="text-xs text-[#4B5563] leading-relaxed">
                {placeholderData.activeMission}
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
