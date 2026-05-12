import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Sparkles } from "lucide-react";
import { useGamification } from "@/hooks/useGamification";
import { useClient } from "@/lib/clientContext";
import { cn } from "@/lib/utils";

export const UserProgressCard = () => {
  const { xp, level, videosCompleted, currentLevelXp, nextLevelXp, isLoading } = useGamification();
  const { client } = useClient();
  const isPremiumTheme = client?.subdomain === 'finademica';

  if (isLoading) {
    return (
      <Card className="p-8 space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <Skeleton className="h-3 w-full rounded-full" />
        <Skeleton className="h-4 w-40" />
      </Card>
    );
  }

  const progressPercent = nextLevelXp > currentLevelXp 
    ? Math.min(((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100, 100)
    : 0;

  const isEmpty = xp === 0 && videosCompleted === 0;

  return (
    <Card className="p-8 space-y-6 group hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300",
            isPremiumTheme 
              ? "bg-premium-gold/20 text-premium-gold" 
              : "bg-gradient-to-br from-primary/20 to-aqua/20 text-primary"
          )}>
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-sm uppercase tracking-widest text-muted-foreground font-semibold">
              Your Progress
            </h3>
            <p className="text-3xl font-bold text-foreground font-mono">
              Level {level}
            </p>
          </div>
        </div>
        {!isEmpty && (
          <div className={cn(
            "flex items-center gap-1",
            isPremiumTheme ? "text-premium-gold" : "text-primary"
          )}>
            <Sparkles className="w-5 h-5" />
          </div>
        )}
      </div>

      <p className="text-base text-muted-foreground">
        XP: <span className="font-mono font-semibold text-foreground">{xp}</span> · Videos completed: <span className="font-mono font-semibold text-foreground">{videosCompleted}</span>
      </p>

      <div className="space-y-2">
        <Progress value={progressPercent} className={cn("h-3", isPremiumTheme && "bg-premium-gold/20")} />
        <p className="text-sm text-muted-foreground">
          Next level at <span className="font-mono font-semibold">{nextLevelXp}</span> XP
        </p>
      </div>

      {isEmpty && (
        <div className={cn(
          "flex items-center gap-2 px-4 py-3 rounded-xl border",
          isPremiumTheme 
            ? "bg-premium-gold/10 border-premium-gold/30" 
            : "bg-primary/10 border-primary/30"
        )}>
          <span className="text-lg">🚀</span>
          <p className="text-sm text-foreground font-medium">
            Start your first lesson to earn XP.
          </p>
        </div>
      )}
    </Card>
  );
};