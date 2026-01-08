import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface UseFeedRealtimeOptions {
  onPostChange?: () => void;
  onLikeChange?: (postId: string) => void;
  onCommentChange?: (postId: string) => void;
}

export function useFeedRealtime({
  onPostChange,
  onLikeChange,
  onCommentChange,
}: UseFeedRealtimeOptions) {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const subscribedRef = useRef(false);

  const setupSubscription = useCallback(() => {
    // Prevent double-subscribe in React Strict Mode
    if (subscribedRef.current) return;
    subscribedRef.current = true;

    // Create a single channel for all feed-related changes
    const channel = supabase
      .channel('feed-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'feed_posts',
        },
        (payload) => {
          console.log('[Realtime] feed_posts change:', payload.eventType);
          onPostChange?.();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'feed_post_likes',
        },
        (payload) => {
          console.log('[Realtime] feed_post_likes change:', payload.eventType);
          const postId = (payload.new as any)?.post_id || (payload.old as any)?.post_id;
          if (postId) {
            onLikeChange?.(postId);
          } else {
            // Fallback to full refresh
            onPostChange?.();
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'feed_post_comments',
        },
        (payload) => {
          console.log('[Realtime] feed_post_comments change:', payload.eventType);
          const postId = (payload.new as any)?.post_id || (payload.old as any)?.post_id;
          if (postId) {
            onCommentChange?.(postId);
          } else {
            onPostChange?.();
          }
        }
      )
      .subscribe((status) => {
        console.log('[Realtime] Subscription status:', status);
      });

    channelRef.current = channel;
  }, [onPostChange, onLikeChange, onCommentChange]);

  useEffect(() => {
    setupSubscription();

    return () => {
      if (channelRef.current) {
        console.log('[Realtime] Cleaning up subscription');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        subscribedRef.current = false;
      }
    };
  }, [setupSubscription]);

  return null;
}
