import { useState, useEffect, useCallback } from 'react';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FeedComposer } from '@/components/feed/FeedComposer';
import { FeedPostCardEnhanced } from '@/components/feed/FeedPostCardEnhanced';
import { FeedPostSkeleton } from '@/components/feed/FeedPostSkeleton';
import { FEED_CONFIG } from '@/lib/feedConfig';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/AuthContext';
import { useFeedRealtime } from '@/hooks/useFeedRealtime';
import { Users, User, RefreshCw } from 'lucide-react';

interface FeedPost {
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

export default function Feed() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('community');
  const [communityPosts, setCommunityPosts] = useState<FeedPost[]>([]);
  const [myPosts, setMyPosts] = useState<FeedPost[]>([]);
  const [loadingCommunity, setLoadingCommunity] = useState(true);
  const [loadingMyPosts, setLoadingMyPosts] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentClientId, setCurrentClientId] = useState<string | null>(null);

  // Get current user's public.users.id + client_id
  useEffect(() => {
    const fetchUserContext = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('users')
        .select('id, client_id')
        .eq('auth_user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user context:', error);
        return;
      }

      if (data) {
        setCurrentUserId(data.id);
        setCurrentClientId(data.client_id);
      }
    };

    fetchUserContext();
  }, [user]);

  const fetchCommunityPosts = useCallback(async () => {
    setLoadingCommunity(true);
    try {
      // Use v_feed_posts view which includes like_count, liked_by_me, comment_count
      const { data, error } = await supabase
        .from('v_feed_posts')
        .select('id, content, post_type, status, moderation_reason, created_at, user_id, nickname, avatar_url, like_count, liked_by_me, comment_count')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(FEED_CONFIG.POSTS_PER_PAGE);

      if (error) throw error;
      setCommunityPosts((data as FeedPost[]) || []);
    } catch (err) {
      console.error('Error fetching community posts:', err);
    } finally {
      setLoadingCommunity(false);
    }
  }, []);

  const fetchMyPosts = useCallback(async () => {
    if (!currentUserId) return;

    setLoadingMyPosts(true);
    try {
      const { data, error } = await supabase
        .from('v_feed_posts')
        .select('id, content, post_type, status, moderation_reason, created_at, user_id, nickname, avatar_url, like_count, liked_by_me, comment_count')
        .eq('user_id', currentUserId)
        .order('created_at', { ascending: false })
        .limit(FEED_CONFIG.POSTS_PER_PAGE);

      if (error) throw error;
      setMyPosts((data as FeedPost[]) || []);
    } catch (err) {
      console.error('Error fetching my posts:', err);
    } finally {
      setLoadingMyPosts(false);
    }
  }, [currentUserId]);

  // Setup realtime subscriptions with client filter
  useFeedRealtime({
    clientId: currentClientId,
    onPostChange: () => {
      fetchCommunityPosts();
      if (currentUserId) fetchMyPosts();
    },
    onLikeChange: () => {
      fetchCommunityPosts();
      if (currentUserId) fetchMyPosts();
    },
    onCommentChange: () => {
      fetchCommunityPosts();
      if (currentUserId) fetchMyPosts();
    },
  });

  useEffect(() => {
    fetchCommunityPosts();
  }, [fetchCommunityPosts]);

  useEffect(() => {
    if (currentUserId) {
      fetchMyPosts();
    }
  }, [currentUserId, fetchMyPosts]);

  const handlePostCreated = () => {
    fetchCommunityPosts();
    fetchMyPosts();
  };

  const renderPosts = (posts: FeedPost[], loading: boolean, showStatus: boolean) => {
    if (loading) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <FeedPostSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (posts.length === 0) {
      return (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">
            {showStatus ? "You haven't posted anything yet" : 'No posts to show'}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {posts.map((post) => (
          <FeedPostCardEnhanced
            key={post.id}
            post={post}
            showStatus={showStatus}
            currentUserId={currentUserId}
            currentClientId={currentClientId}
            onLikeChange={() => {
              fetchCommunityPosts();
              fetchMyPosts();
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <SidebarLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Community Feed</h1>
          <p className="text-muted-foreground text-sm">
            Share updates and connect with your community
          </p>
        </div>

        {/* Composer */}
        <FeedComposer onPostCreated={handlePostCreated} />

        {/* Feed Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="community" className="gap-2">
                <Users className="h-4 w-4" />
                Community
              </TabsTrigger>
              <TabsTrigger value="my-posts" className="gap-2">
                <User className="h-4 w-4" />
                My Posts
              </TabsTrigger>
            </TabsList>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (activeTab === 'community') {
                  fetchCommunityPosts();
                } else {
                  fetchMyPosts();
                }
              }}
              className="h-8 w-8"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          <TabsContent value="community" className="mt-4">
            {renderPosts(communityPosts, loadingCommunity, false)}
          </TabsContent>

          <TabsContent value="my-posts" className="mt-4">
            {renderPosts(myPosts, loadingMyPosts, true)}
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
}
