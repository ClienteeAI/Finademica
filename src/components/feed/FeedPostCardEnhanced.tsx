import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { SYSTEM_AVATARS } from '@/lib/feedConfig';
import { formatDistanceToNow } from 'date-fns';
import { Trophy, Clock, CheckCircle, XCircle, AlertCircle, TrendingUp, MessageCircle, Loader2, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { PostComments } from './PostComments';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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
  media_urls?: string[];
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
  const [showPointFeedback, setShowPointFeedback] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  const avatar = SYSTEM_AVATARS.find((a) => a.id === post.avatar_url);
  const mediaUrls = Array.isArray(post.media_urls) ? post.media_urls.filter(Boolean) : [];

  // Autofocus comment input when drawer opens
  useEffect(() => {
    if (showComments && commentInputRef.current) {
      setTimeout(() => commentInputRef.current?.focus(), 150);
    }
  }, [showComments]);

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

        // Award points for liking (only on insert success)
        try {
          await supabase.rpc('increment_user_stats', {
            p_user_id: currentUserId,
            p_points: 1,
            p_videos: 0,
          });
          // Show point feedback
          setShowPointFeedback(true);
          setTimeout(() => setShowPointFeedback(false), 1500);
        } catch (pointsError) {
          // Silently ignore points error - like still succeeded
          console.error('Error awarding points:', pointsError);
        }
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

  // Render media grid based on count
  const renderMediaGrid = () => {
    if (mediaUrls.length === 0) return null;

    const gridClass = cn(
      'mt-3 gap-2 rounded-lg overflow-hidden',
      mediaUrls.length === 1 && 'grid grid-cols-1',
      mediaUrls.length === 2 && 'grid grid-cols-2',
      mediaUrls.length >= 3 && 'grid grid-cols-2 grid-rows-2'
    );

    return (
      <div className={gridClass}>
        {mediaUrls.slice(0, 4).map((url, idx) => (
          <div
            key={idx}
            className={cn(
              'relative cursor-pointer overflow-hidden rounded-lg bg-muted',
              mediaUrls.length === 3 && idx === 0 && 'row-span-2',
              mediaUrls.length >= 3 ? 'aspect-square' : 'aspect-video'
            )}
            onClick={() => setLightboxImage(url)}
          >
            <img
              src={url}
              alt={`Media ${idx + 1}`}
              className="w-full h-full object-cover transition-transform hover:scale-105"
              loading="lazy"
            />
            {mediaUrls.length > 4 && idx === 3 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white text-xl font-bold">+{mediaUrls.length - 4}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
      >
        <Card className="border-border/50 hover:border-primary/30 transition-all duration-200">
          <CardContent className="pt-4">
            {/* Author Row */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0',
                    avatar?.bg || 'bg-muted'
                  )}
                >
                  {avatar?.emoji || '👤'}
                </div>

                {/* Name & Time */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-foreground truncate">
                      {post.nickname || 'Anonymous'}
                    </span>
                    {post.post_type === 'achievement' && (
                      <Trophy className="h-4 w-4 text-yellow-500 flex-shrink-0" />
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

            {/* Content Body */}
            <p className="text-foreground/90 whitespace-pre-wrap break-words leading-relaxed">
              {post.content}
            </p>

            {/* Media Grid */}
            {renderMediaGrid()}

            {/* Rejection Reason */}
            {showStatus && post.status === 'rejected' && post.moderation_reason && (
              <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-400">{post.moderation_reason}</p>
                </div>
              </div>
            )}

            {/* Actions Row */}
            <div className="flex items-center gap-1 mt-4 pt-3 border-t border-border/50">
              {/* Like Button - Trending Chart Icon */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'gap-2 h-9 px-3 rounded-full transition-all',
                    likedByMe && 'text-primary bg-primary/10 hover:bg-primary/20'
                  )}
                  onClick={handleLike}
                  disabled={likeLoading || !currentUserId}
                >
                  <motion.div
                    whileTap={{ scale: 0.85 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  >
                    {likeLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <TrendingUp
                        className={cn(
                          'h-4 w-4 transition-all',
                          likedByMe && 'text-primary scale-110'
                        )}
                      />
                    )}
                  </motion.div>
                  <span className="text-sm font-medium">{likeCount}</span>
                </Button>
                <AnimatePresence>
                  {showPointFeedback && (
                    <motion.span
                      initial={{ opacity: 0, y: 0, scale: 0.5 }}
                      animate={{ opacity: 1, y: -24, scale: 1 }}
                      exit={{ opacity: 0, y: -32 }}
                      className="absolute -top-1 left-1/2 -translate-x-1/2 text-xs font-bold text-primary pointer-events-none"
                    >
                      +1
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Comments Button */}
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'gap-2 h-9 px-3 rounded-full transition-all',
                  showComments && 'bg-muted text-foreground'
                )}
                onClick={() => setShowComments(!showComments)}
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm font-medium">{post.comment_count}</span>
              </Button>
            </div>

            {/* Inline Comments Drawer */}
            <AnimatePresence>
              {showComments && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <PostComments
                    postId={post.id}
                    commentCount={post.comment_count}
                    onClose={() => setShowComments(false)}
                    inputRef={commentInputRef}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Lightbox Modal */}
      <Dialog open={!!lightboxImage} onOpenChange={() => setLightboxImage(null)}>
        <DialogContent className="max-w-4xl p-0 bg-black/95 border-none">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 text-white hover:bg-white/20"
            onClick={() => setLightboxImage(null)}
          >
            <X className="h-5 w-5" />
          </Button>
          {lightboxImage && (
            <img
              src={lightboxImage}
              alt="Full size"
              className="w-full h-auto max-h-[85vh] object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
