import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FEED_CONFIG, SYSTEM_AVATARS } from '@/lib/feedConfig';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/AuthContext';
import { useClient } from '@/lib/clientContext';
import { toast } from '@/hooks/use-toast';
import { Loader2, Send, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeedComposerProps {
  onPostCreated: () => void;
}

interface UserProfile {
  nickname: string | null;
  avatar_url: string | null;
}

export function FeedComposer({ onPostCreated }: FeedComposerProps) {
  const { user } = useAuth();
  const { client } = useClient();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

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

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
      <CardContent className="pt-4 space-y-4">
        <div className="flex gap-3">
          {/* User Avatar */}
          <div
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0',
              avatar?.bg || 'bg-muted'
            )}
          >
            {avatar?.emoji || '👤'}
          </div>
          
          {/* Input Area */}
          <div className="flex-1 space-y-3">
            {/* Nickname */}
            {userProfile?.nickname && (
              <span className="text-sm font-medium text-foreground">
                {userProfile.nickname}
              </span>
            )}
            
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              placeholder="Share an update with your community..."
              maxLength={FEED_CONFIG.MAX_POST_LENGTH}
              rows={2}
              className="resize-none min-h-[60px] border-0 bg-transparent p-0 focus-visible:ring-0 text-base placeholder:text-muted-foreground/60"
            />
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between gap-4 pt-2 border-t border-border/50">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary/60" />
            <span className="text-xs text-muted-foreground">
              {content.length}/{FEED_CONFIG.MAX_POST_LENGTH}
            </span>
          </div>
          
          <Button
            onClick={handleSubmit}
            disabled={loading || !canSubmit}
            size="sm"
            className="gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Send className="h-4 w-4" />
                Post
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
