import { useState, useEffect, useRef, RefObject } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Send, X, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/AuthContext';
import { useCoachTips } from '@/hooks/useCoachTips';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { SYSTEM_AVATARS } from '@/lib/feedConfig';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useCommentsRealtime } from '@/hooks/useCommentsRealtime';
import { CoachTip } from '@/components/CoachTip';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  status: string;
}

interface UserProfile {
  user_id: string;
  nickname: string;
  avatar_url: string | null;
}

interface PostCommentsProps {
  postId: string;
  commentCount: number;
  onClose: () => void;
  inputRef?: RefObject<HTMLTextAreaElement>;
}

export function PostComments({ postId, commentCount, onClose, inputRef }: PostCommentsProps) {
  const { user } = useAuth();
  const { hasSeen, dismissTip, tipsEnabled } = useCoachTips();
  const [comments, setComments] = useState<Comment[]>([]);
  const [profiles, setProfiles] = useState<Map<string, UserProfile>>(new Map());
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentClientId, setCurrentClientId] = useState<string | null>(null);
  const [showPointFeedback, setShowPointFeedback] = useState(false);
  const [newCommentsAvailable, setNewCommentsAvailable] = useState(false);
  const [showCommentsTip, setShowCommentsTip] = useState(false);

  // Show comments tip once when drawer opened
  useEffect(() => {
    if (tipsEnabled && !hasSeen('TIP_COMMENTS')) {
      setShowCommentsTip(true);
    }
  }, [tipsEnabled, hasSeen]);

  useEffect(() => {
    const fetchUserContext = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('users')
        .select('id, client_id')
        .eq('auth_user_id', user.id)
        .maybeSingle();
      if (data) {
        setCurrentUserId(data.id);
        setCurrentClientId(data.client_id);
      }
    };
    fetchUserContext();
  }, [user]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const wasAtBottomRef = useRef(true);

  // Check if user is scrolled to bottom before fetching
  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 50;
      wasAtBottomRef.current = isAtBottom;
    }
  };

  // Scroll to bottom if user was at bottom before update
  const maybeScrollToBottom = () => {
    const container = scrollContainerRef.current;
    if (container) {
      if (wasAtBottomRef.current) {
        container.scrollTop = container.scrollHeight;
        setNewCommentsAvailable(false);
      } else {
        setNewCommentsAvailable(true);
      }
    }
  };

  const scrollToBottom = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
      setNewCommentsAvailable(false);
    }
  };

  // Subscribe to realtime comment changes
  useCommentsRealtime({
    postId,
    clientId: currentClientId,
    onCommentChange: () => {
      checkScrollPosition();
      fetchComments().then(maybeScrollToBottom);
    },
  });

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('feed_post_comments')
        .select('id, content, created_at, user_id, status')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const approvedComments = (data || []).filter(c => c.status === 'approved' || c.status === 'pending');
      setComments(approvedComments);

      // Fetch profiles
      const userIds = [...new Set(approvedComments.map((c) => c.user_id))];
      if (userIds.length > 0) {
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('user_id, nickname, avatar_url')
          .in('user_id', userIds);

        if (profileData) {
          const profileMap = new Map<string, UserProfile>();
          profileData.forEach((p) => profileMap.set(p.user_id, p));
          setProfiles(profileMap);
        }
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!newComment.trim() || !currentUserId || !currentClientId) return;

    setSubmitting(true);
    const commentContent = newComment.trim();
    try {
      const { error } = await supabase.from('feed_post_comments').insert({
        post_id: postId,
        user_id: currentUserId,
        client_id: currentClientId,
        content: commentContent,
        status: 'pending',
      });

      if (error) {
        if (error.message.includes('RLS') || error.code === '42501') {
          toast({
            title: 'Permission denied',
            description: 'You do not have permission to comment on this post.',
            variant: 'destructive',
          });
        } else {
          throw error;
        }
        return;
      }

      // Send to webhook (non-blocking) - include user contact info
      (async () => {
        try {
          const { data: userData } = await supabase
            .from('users')
            .select('first_name, last_name, email, phone')
            .eq('id', currentUserId)
            .maybeSingle();

          fetch('https://clientee.app.n8n.cloud/webhook-test/feed-commennts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              post_id: postId,
              user_id: currentUserId,
              client_id: currentClientId,
              content: commentContent,
              created_at: new Date().toISOString(),
              first_name: userData?.first_name || null,
              last_name: userData?.last_name || null,
              email: userData?.email || null,
              phone: userData?.phone || null,
            }),
          }).catch(console.error);
        } catch (err) {
          console.error('Error fetching user data for webhook:', err);
        }
      })();

      // Award points for commenting
      try {
        await supabase.rpc('increment_user_stats', {
          p_user_id: currentUserId,
          p_points: 2,
          p_videos: 0,
        });
        setShowPointFeedback(true);
        setTimeout(() => setShowPointFeedback(false), 1500);
      } catch (pointsError) {
        console.error('Error awarding points:', pointsError);
      }

      setNewComment('');
      toast({ title: 'Comment submitted +2 points', description: 'Your comment is pending approval.' });
      // Realtime will refresh, but we can also refresh manually
      fetchComments();
    } catch (err: any) {
      console.error('Error posting comment:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to post comment',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDismissCommentsTip = () => {
    setShowCommentsTip(false);
    dismissTip('TIP_COMMENTS');
  };

  return (
    <div className="border-t border-border mt-4 pt-4 space-y-4">
      {/* Comments Tip */}
      <AnimatePresence>
        {showCommentsTip && (
          <CoachTip
            tipId="TIP_COMMENTS"
            variant="inline"
            onDismiss={handleDismissCommentsTip}
          />
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold flex items-center gap-2 text-foreground">
          <MessageCircle className="h-4 w-4" />
          Comments ({comments.length})
        </h4>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Comments List */}
      <div ref={scrollContainerRef} className="space-y-3 max-h-64 overflow-y-auto scroll-smooth">
        {loading ? (
          // Loading Skeleton
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No comments yet. Be the first!
          </p>
        ) : (
          comments.map((comment, idx) => {
            const profile = profiles.get(comment.user_id);
            const avatar = SYSTEM_AVATARS.find((a) => a.id === profile?.avatar_url);

            return (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03, duration: 0.15 }}
                className="flex gap-3"
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0',
                    avatar?.bg || 'bg-muted'
                  )}
                >
                  {avatar?.emoji || '👤'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-foreground">
                      {profile?.nickname || 'Anonymous'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </span>
                    {comment.status === 'pending' && (
                      <span className="text-xs text-yellow-500">(pending)</span>
                    )}
                  </div>
                  <p className="text-sm text-foreground/90 break-words">{comment.content}</p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* New Comments Pill */}
      <AnimatePresence>
        {newCommentsAvailable && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={scrollToBottom}
            className="w-full py-1.5 text-xs font-medium text-primary bg-primary/10 rounded-full hover:bg-primary/20 transition-colors"
          >
            New comments ↓
          </motion.button>
        )}
      </AnimatePresence>

      {/* Add Comment */}
      {user && (
        <div className="flex gap-2 relative">
          <Textarea
            ref={inputRef}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="min-h-[60px] max-h-[120px] resize-none text-sm"
            maxLength={500}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <Button
            size="icon"
            onClick={handleSubmit}
            disabled={!newComment.trim() || submitting}
            className="h-[60px] w-10 flex-shrink-0"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
          <AnimatePresence>
            {showPointFeedback && (
              <motion.span
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: -20 }}
                exit={{ opacity: 0 }}
                className="absolute -top-4 right-5 text-xs font-bold text-primary"
              >
                +2
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
