import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SYSTEM_AVATARS } from '@/lib/feedConfig';
import { formatDistanceToNow } from 'date-fns';
import { Trophy, Clock, CheckCircle, XCircle, AlertCircle, TrendingUp, MessageCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { PostComments } from './PostComments';
import { cn } from '@/lib/utils';

interface FeedPostEnhanced {
  id: string;
  content: string;
  post_type: string;
  status: string;
  moderation_reason: string | null;
  created_at: string;
  user_id: string;
  nickname: string | null;
  avatar_url: string | null;
  like_count: number;
  liked_by_me: boolean;
  comment_count: number;
}

interface FeedPostCardEnhancedProps {
  post: FeedPostEnhanced;
  showStatus?: boolean;
  currentUserId: string | null;
  currentClientId: string | null;
  onLikeChange?: () => void;
}

export function FeedPostCardEnhanced({
  post,
  showStatus = false,
  currentUserId,
  currentClientId,
  onLikeChange,
}: FeedPostCardEnhancedProps) {
  const [likeCount, setLikeCount] = useState(post.like_count);
  const [likedByMe, setLikedByMe] = useState(post.liked_by_me);
  const [likeLoading, setLikeLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const avatar = SYSTEM_AVATARS.find((a) => a.id === post.avatar_url);

  const getStatusBadge = () => {
    switch (post.status) {
      case 'approved':
        return (
          <Badge variant="outline" className="text-green-500 border-green-500/30 bg-green-500/10">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="text-red-500 border-red-500/30 bg-red-500/10">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      case 'pending':
      default:
        return (
          <Badge variant="outline" className="text-yellow-500 border-yellow-500/30 bg-yellow-500/10">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  const handleLike = async () => {
    if (!currentUserId || !currentClientId || likeLoading) return;

    setLikeLoading(true);

    // Optimistic update
    const wasLiked = likedByMe;
    setLikedByMe(!wasLiked);
    setLikeCount((prev) => (wasLiked ? prev - 1 : prev + 1));

    try {
      if (wasLiked) {
        // Unlike
        const { error } = await supabase
          .from('feed_post_likes')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', currentUserId);

        if (error) throw error;
      } else {
        // Like
        const { error } = await supabase.from('feed_post_likes').insert({
          post_id: post.id,
          user_id: currentUserId,
          client_id: currentClientId,
        });

        if (error) throw error;
      }

      onLikeChange?.();
    } catch (err: any) {
      // Revert optimistic update
      setLikedByMe(wasLiked);
      setLikeCount((prev) => (wasLiked ? prev + 1 : prev - 1));

      console.error('Error toggling like:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to update like',
        variant: 'destructive',
      });
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <Card className="border-border/50 hover:border-primary/30 transition-colors">
      <CardContent className="pt-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center text-lg',
                avatar?.bg || 'bg-muted'
              )}
            >
              {avatar?.emoji || '👤'}
            </div>

            {/* Name & Time */}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">
                  {post.nickname || 'Anonymous'}
                </span>
                {post.post_type === 'achievement' && (
                  <Trophy className="h-4 w-4 text-yellow-500" />
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </span>
            </div>
          </div>

          {/* Status Badge */}
          {showStatus && getStatusBadge()}
        </div>

        {/* Content */}
        <p className="text-foreground/90 whitespace-pre-wrap break-words">{post.content}</p>

        {/* Rejection Reason */}
        {showStatus && post.status === 'rejected' && post.moderation_reason && (
          <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-400">{post.moderation_reason}</p>
            </div>
          </div>
        )}

        {/* Actions: Like & Comments */}
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border/50">
          {/* Like Button - Trending Chart Icon */}
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'gap-2 h-8 px-3',
              likedByMe && 'text-primary bg-primary/10 hover:bg-primary/20'
            )}
            onClick={handleLike}
            disabled={likeLoading || !currentUserId}
          >
            {likeLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <TrendingUp className={cn('h-4 w-4', likedByMe && 'fill-current')} />
            )}
            <span className="text-sm font-medium">{likeCount}</span>
          </Button>

          {/* Comments Button */}
          <Button
            variant="ghost"
            size="sm"
            className={cn('gap-2 h-8 px-3', showComments && 'bg-muted')}
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm font-medium">{post.comment_count}</span>
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <PostComments
            postId={post.id}
            commentCount={post.comment_count}
            onClose={() => setShowComments(false)}
          />
        )}
      </CardContent>
    </Card>
  );
}
