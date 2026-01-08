import { useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UseFeedGamificationOptions {
  userId: string | null;
  clientId: string | null;
}

// Thresholds for unlocking content
const UNLOCK_THRESHOLDS = [
  { points: 10, message: 'You unlocked more content 🎉', achieved: false },
  { points: 25, message: 'You unlocked even more content 🚀', achieved: false },
];

export function useFeedGamification({ userId, clientId }: UseFeedGamificationOptions) {
  const previousPointsRef = useRef<number | null>(null);
  const achievedMilestonesRef = useRef<Set<number>>(new Set());

  // Check for milestone achievements and auto-post
  const checkMilestones = async (currentPoints: number) => {
    if (!userId || !clientId) return;

    for (const threshold of UNLOCK_THRESHOLDS) {
      const wasBelow = previousPointsRef.current !== null && previousPointsRef.current < threshold.points;
      const isNowAbove = currentPoints >= threshold.points;
      const notYetAchieved = !achievedMilestonesRef.current.has(threshold.points);

      if (wasBelow && isNowAbove && notYetAchieved) {
        achievedMilestonesRef.current.add(threshold.points);

        // Show unlock toast
        toast({
          title: 'Content Unlocked!',
          description: threshold.message,
        });

        // Try to create achievement post (silently fail if not allowed)
        try {
          // Check if user is shadowbanned first
          const { data: moderation } = await supabase
            .from('user_moderation')
            .select('is_shadowbanned')
            .eq('user_id', userId)
            .maybeSingle();

          if (!moderation?.is_shadowbanned) {
            await supabase.rpc('create_feed_post', {
              p_content: `📈 I just hit ${threshold.points} points! Grinding.`,
              p_post_type: 'achievement',
              p_media_storage_paths: [],
            });
          }
        } catch {
          // Silently ignore achievement post errors
        }
      }
    }

    previousPointsRef.current = currentPoints;
  };

  return { checkMilestones };
}
