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
    { name: "Risk", level: 3, progress: 65, color: "from-red-500 to-orange-400" },
    { name: "Mindset", level: 4, progress: 80, color: "from-purple-500 to-violet-400" },
    { name: "Technical", level: 2, progress: 40, color: "from-cyan-500 to-blue-400" },
    { name: "Fundamental", level: 3, progress: 55, color: "from-emerald-500 to-teal-400" },
    { name: "Money Mgmt", level: 2, progress: 35, color: "from-amber-500 to-yellow-400" },
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
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Trader Progress</h2>
          <p className="text-sm text-muted-foreground">Your trading RPG journey</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Level & XP Card */}
        <Card className="p-6 space-y-5 group hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-sm uppercase tracking-widest text-muted-foreground font-semibold">
              Your Trader Level
            </h3>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Target className="w-4 h-4 text-primary" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-foreground font-mono">
                Level {placeholderData.level}
              </span>
            </div>
            <p className="text-lg text-primary font-medium">{placeholderData.levelTitle}</p>
            <p className="text-sm text-muted-foreground font-mono">
              {placeholderData.currentXP} / {placeholderData.nextLevelXP} XP to next level
            </p>
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-2">
            <div className="h-3 bg-secondary/50 rounded-full overflow-hidden backdrop-blur-sm border border-border-glass">
              <div
                className="h-full success-gradient relative overflow-hidden"
                style={{ width: `${xpPercentage}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Complete lessons, use the Mentor, and follow your roadmap to gain XP.
          </p>
        </Card>

        {/* Avatar Card */}
        <Card className="p-6 space-y-5 group hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 relative overflow-hidden">
          {/* Holographic glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-primary/5 pointer-events-none" />
          
          <div className="flex items-center justify-between relative">
            <h3 className="text-sm uppercase tracking-widest text-muted-foreground font-semibold">
              AI Trading Avatar
            </h3>
            <Badge variant="purple" className="text-xs">Stage {placeholderData.avatarStage}</Badge>
          </div>

          {/* Avatar Placeholder - Glowing Orb */}
          <div className="flex justify-center py-4">
            <div className="relative">
              {/* Outer glow rings */}
              <div className="absolute inset-0 w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-purple-500/30 blur-xl animate-pulse" />
              <div className="absolute inset-2 w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 blur-lg animate-pulse" style={{ animationDelay: '0.5s' }} />
              
              {/* Main orb */}
              <div className={cn(
                "relative w-24 h-24 rounded-full",
                "bg-gradient-to-br from-primary/40 via-purple-500/30 to-accent/40",
                "border-2 border-primary/50",
                "flex items-center justify-center",
                "shadow-[0_0_40px_rgba(34,243,255,0.3),inset_0_0_30px_rgba(34,243,255,0.2)]",
                "group-hover:shadow-[0_0_60px_rgba(34,243,255,0.5),inset_0_0_40px_rgba(34,243,255,0.3)]",
                "transition-all duration-500"
              )}>
                <Sparkles className="w-10 h-10 text-primary drop-shadow-[0_0_10px_rgba(34,243,255,0.8)]" />
              </div>
            </div>
          </div>

          <div className="text-center space-y-1 relative">
            <p className="text-lg font-semibold text-foreground">{placeholderData.avatarTitle}</p>
            <p className="text-xs text-muted-foreground">
              Keep learning to evolve your avatar.
            </p>
          </div>

          <p className="text-xs text-muted-foreground text-center border-t border-border-glass pt-3">
            Next stage unlocks at Level 10
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
            {placeholderData.skills.map((skill) => (
              <div key={skill.name} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground">{skill.name}</span>
                  <span className="text-xs text-muted-foreground font-mono">Lv.{skill.level}</span>
                </div>
                <div className="h-2 bg-secondary/50 rounded-full overflow-hidden border border-border-glass">
                  <div
                    className={cn("h-full rounded-full bg-gradient-to-r", skill.color)}
                    style={{ width: `${skill.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed border-t border-border-glass pt-3">
            Skill levels grow as you complete specific lessons and actions.
          </p>
        </Card>

        {/* Achievements & Missions Card */}
        <Card className="p-6 space-y-5 group hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-sm uppercase tracking-widest text-muted-foreground font-semibold">
              Achievements & Missions
            </h3>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>

          {/* Streak */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20">
            <Flame className="w-5 h-5 text-orange-400" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                Streak: {placeholderData.streak} days
              </p>
              <p className="text-xs text-muted-foreground">Keep it going!</p>
            </div>
          </div>

          {/* Unlocked Badge */}
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              Latest Badge
            </p>
            {placeholderData.achievements.filter(a => a.unlocked).map((achievement) => (
              <div
                key={achievement.name}
                className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_15px_rgba(34,243,255,0.4)]">
                  <Trophy className="w-4 h-4 text-background" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{achievement.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Active Mission */}
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              Active Mission
            </p>
            <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/20">
              <p className="text-xs text-foreground leading-relaxed">
                {placeholderData.activeMission}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs text-muted-foreground hover:text-foreground"
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
