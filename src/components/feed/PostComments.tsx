import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, X, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/AuthContext';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { SYSTEM_AVATARS } from '@/lib/feedConfig';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useCommentsRealtime } from '@/hooks/useCommentsRealtime';

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
}

export function PostComments({ postId, commentCount, onClose }: PostCommentsProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [profiles, setProfiles] = useState<Map<string, UserProfile>>(new Map());
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentClientId, setCurrentClientId] = useState<string | null>(null);
  const [showPointFeedback, setShowPointFeedback] = useState(false);

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
    if (container && wasAtBottomRef.current) {
      container.scrollTop = container.scrollHeight;
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
    try {
      const { error } = await supabase.from('feed_post_comments').insert({
        post_id: postId,
        user_id: currentUserId,
        client_id: currentClientId,
        content: newComment.trim(),
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

  return (
    <div className="border-t border-border mt-4 pt-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          Comments ({commentCount})
        </h4>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Comments List */}
      <div ref={scrollContainerRef} className="space-y-3 max-h-64 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No comments yet. Be the first!
          </p>
        ) : (
          comments.map((comment) => {
            const profile = profiles.get(comment.user_id);
            const avatar = SYSTEM_AVATARS.find((a) => a.id === profile?.avatar_url);

            return (
              <div key={comment.id} className="flex gap-3">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0',
                    avatar?.bg || 'bg-muted'
                  )}
                >
                  {avatar?.emoji || '👤'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
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
              </div>
            );
          })
        )}
      </div>

      {/* Add Comment */}
      {user && (
        <div className="flex gap-2 relative">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="min-h-[60px] resize-none text-sm"
            maxLength={500}
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
