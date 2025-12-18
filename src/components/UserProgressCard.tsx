import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Sparkles } from "lucide-react";
import { useGamification } from "@/hooks/useGamification";

export const UserProgressCard = () => {
  const { xp, level, videosCompleted, currentLevelXp, nextLevelXp, isLoading } = useGamification();

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
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#4DE2E8]/20 to-[#A7E9FF]/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Trophy className="w-7 h-7 text-[#4DE2E8]" />
          </div>
          <div>
            <h3 className="text-sm uppercase tracking-widest text-[#6B7280] font-semibold">
              Your Progress
            </h3>
            <p className="text-3xl font-bold text-[#1D3557] font-mono">
              Level {level}
            </p>
          </div>
        </div>
        {!isEmpty && (
          <div className="flex items-center gap-1 text-[#4DE2E8]">
            <Sparkles className="w-5 h-5" />
          </div>
        )}
      </div>

      <p className="text-base text-[#6B7280]">
        XP: <span className="font-mono font-semibold text-[#1D3557]">{xp}</span> · Videos completed: <span className="font-mono font-semibold text-[#1D3557]">{videosCompleted}</span>
      </p>

      <div className="space-y-2">
        <Progress value={progressPercent} className="h-3" />
        <p className="text-sm text-[#6B7280]">
          Next level at <span className="font-mono font-semibold">{nextLevelXp}</span> XP
        </p>
      </div>

      {isEmpty && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#4DE2E8]/10 border border-[#4DE2E8]/30">
          <span className="text-lg">🚀</span>
          <p className="text-sm text-[#1D3557] font-medium">
            Start your first lesson to earn XP.
          </p>
        </div>
      )}
    </Card>
  );
};