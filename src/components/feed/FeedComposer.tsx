import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FEED_CONFIG } from '@/lib/feedConfig';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/AuthContext';
import { useClient } from '@/lib/clientContext';
import { toast } from '@/hooks/use-toast';
import { Loader2, Send } from 'lucide-react';

interface FeedComposerProps {
  onPostCreated: () => void;
}

export function FeedComposer({ onPostCreated }: FeedComposerProps) {
  const { user } = useAuth();
  const { client } = useClient();
  
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<'text' | 'achievement'>('text');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() || !user || !client) return;
    
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
        p_post_type: postType,
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

      // Show success toast
      toast({
        title: 'Post submitted',
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
        post_type: postType,
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

      // Clear and refresh
      setContent('');
      setPostType('text');
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

  return (
    <Card className="border-primary/20">
      <CardContent className="pt-4 space-y-4">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share an update with your community..."
          maxLength={FEED_CONFIG.MAX_POST_LENGTH}
          rows={3}
          className="resize-none"
        />
        
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Select value={postType} onValueChange={(v) => setPostType(v as 'text' | 'achievement')}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="achievement">Achievement</SelectItem>
              </SelectContent>
            </Select>
            
            <span className="text-xs text-muted-foreground">
              {content.length}/{FEED_CONFIG.MAX_POST_LENGTH}
            </span>
          </div>
          
          <Button
            onClick={handleSubmit}
            disabled={loading || !content.trim()}
            size="sm"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Post
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
