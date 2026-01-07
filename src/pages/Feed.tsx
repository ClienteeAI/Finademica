import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FeedComposer } from '@/components/feed/FeedComposer';
import { FeedPostCard } from '@/components/feed/FeedPostCard';
import { FeedPostSkeleton } from '@/components/feed/FeedPostSkeleton';
import { ProfileModal } from '@/components/feed/ProfileModal';
import { FEED_CONFIG } from '@/lib/feedConfig';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/AuthContext';
import { useClient } from '@/lib/clientContext';
import { Users, User, UserCircle, RefreshCw } from 'lucide-react';

interface FeedPost {
  id: string;
  content: string;
  post_type: string;
  status: string;
  moderation_reason: string | null;
  created_at: string;
  user_id: string;
}

interface UserProfile {
  user_id: string;
  nickname: string;
  avatar_url: string | null;
}

export default function Feed() {
  const { user } = useAuth();
  const { client } = useClient();
  
  const [activeTab, setActiveTab] = useState('community');
  const [communityPosts, setCommunityPosts] = useState<FeedPost[]>([]);
  const [myPosts, setMyPosts] = useState<FeedPost[]>([]);
  const [profiles, setProfiles] = useState<Map<string, UserProfile>>(new Map());
  const [loadingCommunity, setLoadingCommunity] = useState(true);
  const [loadingMyPosts, setLoadingMyPosts] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentClientId, setCurrentClientId] = useState<string | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

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

  const fetchProfiles = useCallback(async (userIds: string[]) => {
    if (userIds.length === 0) return;
    
    const uniqueIds = [...new Set(userIds)];
    const { data } = await supabase
      .from('user_profiles')
      .select('user_id, nickname, avatar_url')
      .in('user_id', uniqueIds);
    
    if (data) {
      setProfiles(prev => {
        const profileMap = new Map(prev);
        data.forEach(p => profileMap.set(p.user_id, p));
        return profileMap;
      });
    }
  }, []);

  const fetchCommunityPosts = useCallback(async () => {
    setLoadingCommunity(true);
    try {
      // Let RLS handle client isolation - do NOT filter by client_id in frontend
      // The RLS policy ensures users only see approved posts from their own client
      const { data, error } = await supabase
        .from('feed_posts')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(FEED_CONFIG.POSTS_PER_PAGE);

      if (error) throw error;

      const posts = data || [];
      setCommunityPosts(posts);

      // Fetch profiles for these posts
      const userIds = posts.map(p => p.user_id);
      await fetchProfiles(userIds);
    } catch (err) {
      console.error('Error fetching community posts:', err);
    } finally {
      setLoadingCommunity(false);
    }
  }, [fetchProfiles]);

  const fetchMyPosts = useCallback(async () => {
    if (!currentUserId) return;
    
    setLoadingMyPosts(true);
    try {
      const { data, error } = await supabase
        .from('feed_posts')
        .select('*')
        .eq('user_id', currentUserId)
        .order('created_at', { ascending: false })
        .limit(FEED_CONFIG.POSTS_PER_PAGE);
      
      if (error) throw error;
      
      const posts = data || [];
      setMyPosts(posts);
      
      // Fetch profile for current user
      await fetchProfiles([currentUserId]);
    } catch (err) {
      console.error('Error fetching my posts:', err);
    } finally {
      setLoadingMyPosts(false);
    }
  }, [currentUserId, fetchProfiles]);

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
        {posts.map(post => (
          <FeedPostCard
            key={post.id}
            post={post}
            profile={profiles.get(post.user_id)}
            showStatus={showStatus}
          />
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Community Feed</h1>
            <p className="text-muted-foreground text-sm">
              Share updates and connect with your community
            </p>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setProfileModalOpen(true)}
          >
            <UserCircle className="h-4 w-4 mr-2" />
            Profile
          </Button>
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

      {/* Profile Modal */}
      <ProfileModal
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
      />
    </DashboardLayout>
  );
}
