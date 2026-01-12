import { useState, useEffect, useRef, RefObject } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FEED_CONFIG, SYSTEM_AVATARS } from '@/lib/feedConfig';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/AuthContext';
import { useClient } from '@/lib/clientContext';
import { useCoachTips } from '@/hooks/useCoachTips';
import { toast } from '@/hooks/use-toast';
import { Loader2, Send, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CoachTip } from '@/components/CoachTip';
import { AnimatePresence } from 'framer-motion';

interface FeedComposerProps {
  onPostCreated: () => void;
  composerRef?: RefObject<HTMLTextAreaElement>;
}

interface UserProfile {
  nickname: string | null;
  avatar_url: string | null;
}

export function FeedComposer({ onPostCreated, composerRef }: FeedComposerProps) {
  const { user } = useAuth();
  const { client } = useClient();
  const { hasSeen, dismissTip, tipsEnabled } = useCoachTips();
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = composerRef || internalRef;
  
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showPostGuideTip, setShowPostGuideTip] = useState(false);

  // Show post guide tip once
  useEffect(() => {
    if (tipsEnabled && !hasSeen('TIP_POST_GUIDE')) {
      setShowPostGuideTip(true);
    }
  }, [tipsEnabled, hasSeen]);

  // Fetch user profile for avatar and nickname
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .maybeSingle();
      
      if (userData) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('nickname, avatar_url')
          .eq('user_id', userData.id)
          .maybeSingle();
        
        if (profile) {
          setUserProfile(profile);
        }
      }
    };
    
    fetchProfile();
  }, [user]);

  // Auto-resize textarea
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    
    // Auto-expand
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() || content.trim().length < 3 || !user || !client) return;
    
    setLoading(true);
    try {
      // Get user data for webhook
      const { data: userData } = await supabase
        .from('users')
        .select('id, email')
        .eq('auth_user_id', user.id)
        .single();

      if (!userData) {
        toast({
          title: 'Error',
          description: 'User not found',
          variant: 'destructive',
        });
        return;
      }

      // Call RPC to create post
      const { data: postId, error } = await supabase.rpc('create_feed_post', {
        p_content: content.trim(),
        p_post_type: 'text',
        p_media_storage_paths: [],
      });

      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      // Award points for creating a post
      try {
        await supabase.rpc('increment_user_stats', {
          p_user_id: userData.id,
          p_points: 3,
          p_videos: 0,
        });
      } catch (pointsError) {
        console.error('Error awarding points:', pointsError);
      }

      // Show success toast
      toast({
        title: 'Posted! +3 points',
        description: 'Your post has been submitted for review.',
      });

      // Fire-and-forget webhook
      const webhookPayload = {
        event: 'feed_post_created',
        post_id: postId,
        client_id: client.id,
        user_id: userData.id,
        auth_user_id: user.id,
        email: userData.email,
        post_type: 'text',
        content_preview: content.trim().substring(0, 120),
        created_at: new Date().toISOString(),
        source: 'lovable_feed',
      };

      // Non-blocking webhook call
      fetch(FEED_CONFIG.WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookPayload),
      }).catch(() => {
        // Silently ignore webhook errors
      });

      // Clear and reset textarea height
      setContent('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      onPostCreated();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to create post',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const avatar = SYSTEM_AVATARS.find((a) => a.id === userProfile?.avatar_url);
  const canSubmit = content.trim().length >= 3;

  const handleDismissPostGuideTip = () => {
    setShowPostGuideTip(false);
    dismissTip('TIP_POST_GUIDE');
  };

  return (
    <div className="space-y-3">
      {/* Post Guide Tip */}
      <AnimatePresence>
        {showPostGuideTip && (
          <CoachTip
            tipId="TIP_POST_GUIDE"
            variant="inline"
            onDismiss={handleDismissPostGuideTip}
          />
        )}
      </AnimatePresence>

      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-3 md:pt-4 pb-3 space-y-3 md:space-y-4">
        <div className="flex gap-2.5 md:gap-3">
          {/* User Avatar */}
          <div
            className={cn(
              'w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-base md:text-lg flex-shrink-0',
              avatar?.bg || 'bg-muted'
            )}
          >
            {avatar?.emoji || '👤'}
          </div>
          
          {/* Input Area */}
          <div className="flex-1 min-w-0">
            {/* Nickname */}
            {userProfile?.nickname && (
              <span className="text-xs md:text-sm font-medium text-foreground block mb-1">
                {userProfile.nickname}
              </span>
            )}
            
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              placeholder="Share an update..."
              maxLength={FEED_CONFIG.MAX_POST_LENGTH}
              rows={2}
              className="resize-none min-h-[52px] md:min-h-[60px] border-0 bg-transparent p-0 focus-visible:ring-0 text-[15px] md:text-base placeholder:text-muted-foreground/60 leading-relaxed"
            />
          </div>
        </div>
        
        {/* Footer - simplified on mobile */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-border/50">
          <span className="text-[11px] md:text-xs text-muted-foreground tabular-nums">
            {content.length}/{FEED_CONFIG.MAX_POST_LENGTH}
          </span>
          
          <Button
            onClick={handleSubmit}
            disabled={loading || !canSubmit}
            size="sm"
            className="gap-1.5 h-9 px-4 text-sm"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                Post
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}
