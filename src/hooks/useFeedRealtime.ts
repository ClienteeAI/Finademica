import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface UseFeedRealtimeOptions {
  onPostChange?: () => void;
  onLikeChange?: (postId: string) => void;
  onCommentChange?: (postId: string) => void;
  clientId?: string | null;
}

// Simple debounce helper
function debounce<T extends (...args: any[]) => void>(fn: T, ms: number): T {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return ((...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  }) as T;
}

export function useFeedRealtime({
  onPostChange,
  onLikeChange,
  onCommentChange,
  clientId,
}: UseFeedRealtimeOptions) {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const subscribedRef = useRef(false);

  // Debounced callbacks to prevent spam
  const debouncedPostChange = useCallback(
    debounce(() => onPostChange?.(), 400),
    [onPostChange]
  );
  const debouncedLikeChange = useCallback(
    debounce((postId: string) => {
      onLikeChange?.(postId);
      onPostChange?.(); // Also refresh posts for like_count
    }, 400),
    [onLikeChange, onPostChange]
  );
  const debouncedCommentChange = useCallback(
    debounce((postId: string) => {
      onCommentChange?.(postId);
      onPostChange?.(); // Also refresh posts for comment_count
    }, 400),
    [onCommentChange, onPostChange]
  );

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
          ...(clientId ? { filter: `client_id=eq.${clientId}` } : {}),
        },
        (payload) => {
          console.log('[Realtime] feed_posts change:', payload.eventType);
          debouncedPostChange();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'feed_post_likes',
          ...(clientId ? { filter: `client_id=eq.${clientId}` } : {}),
        },
        (payload) => {
          console.log('[Realtime] feed_post_likes change:', payload.eventType);
          const postId = (payload.new as any)?.post_id || (payload.old as any)?.post_id;
          if (postId) {
            debouncedLikeChange(postId);
          } else {
            debouncedPostChange();
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'feed_post_comments',
          ...(clientId ? { filter: `client_id=eq.${clientId}` } : {}),
        },
        (payload) => {
          console.log('[Realtime] feed_post_comments change:', payload.eventType);
          const postId = (payload.new as any)?.post_id || (payload.old as any)?.post_id;
          if (postId) {
            debouncedCommentChange(postId);
          } else {
            debouncedPostChange();
          }
        }
      )
      .subscribe((status) => {
        console.log('[Realtime] Subscription status:', status);
      });

    channelRef.current = channel;
  }, [clientId, debouncedPostChange, debouncedLikeChange, debouncedCommentChange]);

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
