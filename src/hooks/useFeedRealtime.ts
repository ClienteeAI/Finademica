import { useEffect, useRef, useMemo, useCallback } from 'react';
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
  
  // Store callbacks in refs to avoid re-creating debounced functions
  const onPostChangeRef = useRef(onPostChange);
  const onLikeChangeRef = useRef(onLikeChange);
  const onCommentChangeRef = useRef(onCommentChange);
  
  // Update refs when callbacks change
  useEffect(() => {
    onPostChangeRef.current = onPostChange;
    onLikeChangeRef.current = onLikeChange;
    onCommentChangeRef.current = onCommentChange;
  }, [onPostChange, onLikeChange, onCommentChange]);

  // Create stable debounced functions that read from refs
  const debouncedPostChange = useMemo(
    () => debounce(() => onPostChangeRef.current?.(), 400),
    []
  );
  const debouncedLikeChange = useMemo(
    () => debounce((postId: string) => {
      onLikeChangeRef.current?.(postId);
      onPostChangeRef.current?.();
    }, 400),
    []
  );
  const debouncedCommentChange = useMemo(
    () => debounce((postId: string) => {
      onCommentChangeRef.current?.(postId);
      onPostChangeRef.current?.();
    }, 400),
    []
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
