import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import {
  Loader2,
  Megaphone,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';

interface AdminToolsProps {
  userId: string;
  clientId: string;
}

interface OfficialPost {
  id: string;
  content: string;
  status: string;
  created_at: string;
}

const MAX_CONTENT_LENGTH = 800;

export function AdminTools({ userId, clientId }: AdminToolsProps) {
  const [content, setContent] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [myPosts, setMyPosts] = useState<OfficialPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    fetchMyOfficialPosts();
  }, [userId, clientId]);

  const fetchMyOfficialPosts = async () => {
    setLoadingPosts(true);
    try {
      const { data, error } = await supabase
        .from('feed_posts')
        .select('id, content, status, created_at')
        .eq('user_id', userId)
        .eq('client_id', clientId)
        .eq('is_official', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching official posts:', error);
      } else {
        setMyPosts(data || []);
      }
    } catch (err) {
      console.error('Error in fetchMyOfficialPosts:', err);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handlePublish = async () => {
    if (!content.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter content for your post',
        variant: 'destructive',
      });
      return;
    }

    if (content.length > MAX_CONTENT_LENGTH) {
      toast({
        title: 'Error',
        description: `Content must be ${MAX_CONTENT_LENGTH} characters or less`,
        variant: 'destructive',
      });
      return;
    }

    setPublishing(true);
    try {
      const { error } = await supabase.from('feed_posts').insert({
        user_id: userId,
        client_id: clientId,
        content: content.trim(),
        status: 'approved',
        post_type: 'text',
        is_official: true,
        media_urls: [],
        media_storage_paths: [],
      });

      if (error) {
        console.error('Error publishing official post:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to publish post',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Official post published',
        });
        setContent('');
        fetchMyOfficialPosts();
      }
    } catch (err: any) {
      console.error('Error in handlePublish:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to publish post',
        variant: 'destructive',
      });
    } finally {
      setPublishing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-3 w-3 text-red-500" />;
      case 'pending':
        return <Clock className="h-3 w-3 text-yellow-500" />;
      default:
        return <AlertCircle className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getStatusBadgeVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      case 'pending':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-4">
      {/* Composer Card */}
      <Card className="p-4 border-primary/30 bg-primary/5">
        <div className="flex items-center gap-2 mb-3">
          <Megaphone className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Post an Official Update</h3>
        </div>

        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="official-content">Content</Label>
            <Textarea
              id="official-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your official announcement..."
              rows={4}
              maxLength={MAX_CONTENT_LENGTH}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">
              {content.length}/{MAX_CONTENT_LENGTH}
            </p>
          </div>

          <Button
            onClick={handlePublish}
            disabled={publishing || !content.trim()}
            className="w-full"
          >
            {publishing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Publish Official Post
          </Button>
        </div>
      </Card>

      {/* My Official Posts List */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">
          My Official Posts
        </h4>

        {loadingPosts ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : myPosts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No official posts yet
          </p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {myPosts.map((post) => (
              <Card key={post.id} className="p-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <Badge
                    variant={getStatusBadgeVariant(post.status)}
                    className="text-xs flex items-center gap-1"
                  >
                    {getStatusIcon(post.status)}
                    {post.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(post.created_at), 'MMM d, HH:mm')}
                  </span>
                </div>
                <p className="text-sm line-clamp-2">
                  {post.content.slice(0, 120)}
                  {post.content.length > 120 && '...'}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
