import { useEffect, useRef, useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface UseCommentsRealtimeOptions {
  postId: string;
  clientId: string | null;
  onCommentChange: () => void;
}

export function useCommentsRealtime({
  postId,
  clientId,
  onCommentChange,
}: UseCommentsRealtimeOptions) {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const [hasNewComments, setHasNewComments] = useState(false);

  const setupSubscription = useCallback(() => {
    if (!postId || !clientId) return;

    // Clean up any existing subscription
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel(`comments-${postId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'feed_post_comments',
          filter: `post_id=eq.${postId}`,
        },
        (payload) => {
          console.log('[Realtime] Comment change for post:', postId, payload.eventType);
          // Signal new comments available
          setHasNewComments(true);
          // Auto-refresh after short delay
          setTimeout(() => {
            onCommentChange();
            setHasNewComments(false);
          }, 300);
        }
      )
      .subscribe((status) => {
        console.log('[Realtime] Comments subscription status:', status);
      });

    channelRef.current = channel;
  }, [postId, clientId, onCommentChange]);

  useEffect(() => {
    setupSubscription();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [setupSubscription]);

  return { hasNewComments };
}
