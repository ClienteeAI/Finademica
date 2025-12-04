import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Sparkles } from "lucide-react";

interface UserStats {
  total_points: number;
  videos_completed: number;
}

export const UserProgressCard = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      // Get user ID from localStorage (consistent with app's auth approach)
      const userDataStr = localStorage.getItem("userData");
      let userId: string | null = null;
      
      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr);
          userId = userData.id;
        } catch (e) {
          console.error("Error parsing userData:", e);
        }
      }
      
      if (!userId) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("user_stats")
        .select("total_points, videos_completed")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user stats:", error);
      }

      setStats(data || { total_points: 0, videos_completed: 0 });
      setLoading(false);
    };

    fetchStats();
  }, []);

  if (loading) {
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

  const totalPoints = stats?.total_points || 0;
  const videosCompleted = stats?.videos_completed || 0;
  
  const level = Math.floor(totalPoints / 100) + 1;
  const pointsForCurrentLevel = (level - 1) * 100;
  const pointsForNextLevel = level * 100;
  const progressPercent = totalPoints === 0 
    ? 0 
    : ((totalPoints - pointsForCurrentLevel) / (pointsForNextLevel - pointsForCurrentLevel)) * 100;

  const isEmpty = totalPoints === 0 && videosCompleted === 0;

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
        XP: <span className="font-mono font-semibold text-[#1D3557]">{totalPoints}</span> · Videos completed: <span className="font-mono font-semibold text-[#1D3557]">{videosCompleted}</span>
      </p>

      <div className="space-y-2">
        <Progress value={progressPercent} className="h-3" />
        <p className="text-sm text-[#6B7280]">
          Next level at <span className="font-mono font-semibold">{pointsForNextLevel}</span> XP
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
