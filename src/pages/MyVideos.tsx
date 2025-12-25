import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Play, Lock, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ConversionBanner } from "@/components/ConversionBanner";
import { LockedVideoModal } from "@/components/LockedVideoModal";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/AuthContext";
import { VideoFilterSheet } from "@/components/VideoFilterSheet";
import { cn } from "@/lib/utils";

interface Video {
  id: string;
  video_id: string;
  title: string;
  category: string | null;
  duration_seconds: number | null;
  thumbnail_url: string | null;
  video_url: string;
  description: string | null;
}

interface RecommendedVideo {
  id: string;
  priority: number | null;
  tier: string | null;
  reason: string | null;
  video_id: string | null;
  video: Video | null;
}

const categoryColors: Record<string, string> = {
  "Getting Started": "bg-blue-500",
  "Trading Strategies": "bg-purple-500",
  "Risk Management": "bg-red-500",
  "Technical Analysis": "bg-green-500",
};

const formatDuration = (seconds: number | null): string => {
  if (!seconds) return "Unknown";
  const minutes = Math.floor(seconds / 60);
  return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
};

// Generate YouTube thumbnail from video URL
const getYouTubeThumbnail = (videoUrl: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
  ];
  for (const pattern of patterns) {
    const match = videoUrl.match(pattern);
    if (match && match[1]) {
      return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
    }
  }
  return null;
};

const getThumbnail = (video: Video): string | null => {
  if (video.thumbnail_url) return video.thumbnail_url;
  return getYouTubeThumbnail(video.video_url);
};

const MyVideos = () => {
  const navigate = useNavigate();
  const { profile, loading: authLoading } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [freeVideos, setFreeVideos] = useState<RecommendedVideo[]>([]);
  const [lockedVideos, setLockedVideos] = useState<RecommendedVideo[]>([]);
  const [allVideos, setAllVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [accountStatus, setAccountStatus] = useState<string>("quiz_completed");
  const [completedVideoIds, setCompletedVideoIds] = useState<Set<string>>(new Set());
  const [lockedModalOpen, setLockedModalOpen] = useState(false);
  const [selectedLockedVideo, setSelectedLockedVideo] = useState<string>("");

  useEffect(() => {
    // Skip if auth is still loading
    if (authLoading) return;
    
    // Use profile.id (public.users.id) for all queries
    const userId = profile?.id;
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchVideos = async () => {
      setLoading(true);

      // Fetch user account status
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("account_status")
        .eq("id", userId)
        .maybeSingle();

      if (!userError && userData) {
        setAccountStatus(userData.account_status || "quiz_completed");
      }

      const isPremium = userData?.account_status === "live_account";

      if (isPremium) {
        // Premium users: Show ALL videos
        const { data: videos, error } = await supabase
          .from("videos")
          .select("id, video_id, title, category, duration_seconds, thumbnail_url, video_url, description")
          .eq("is_active", true)
          .order("order_priority", { ascending: true });

        if (!error && videos) {
          setAllVideos(videos);
          const uniqueCategories = [...new Set(videos.map(v => v.category).filter(Boolean))] as string[];
          setCategories(["All", ...uniqueCategories]);
        }
      } else {
        // Free users: Fetch from recommendations
        const { data: recommendations, error: recError } = await supabase
          .from("user_video_recommendations")
          .select("id, priority, tier, reason, video_id")
          .eq("user_id", userId)
          .order("priority", { ascending: true });

        if (recError) {
          console.error("Error fetching recommendations:", recError);
          setLoading(false);
          return;
        }

        if (recommendations && recommendations.length > 0) {
          const videoIds = recommendations
            .map(r => r.video_id)
            .filter((id): id is string => id !== null);

          const { data: videos, error: vidError } = await supabase
            .from("videos")
            .select("id, video_id, title, category, duration_seconds, thumbnail_url, video_url, description")
            .in("video_id", videoIds);

          if (!vidError && videos) {
            const videosMap = new Map(videos.map(v => [v.video_id, v]));
            const enrichedRecommendations: RecommendedVideo[] = recommendations.map(rec => ({
              ...rec,
              video: rec.video_id ? videosMap.get(rec.video_id) || null : null
            }));

            const free = enrichedRecommendations.filter(v => v.tier === 'free_to_watch' && v.video);
            const locked = enrichedRecommendations.filter(v => v.tier === 'preview_only' && v.video);
            
            setFreeVideos(free);
            setLockedVideos(locked);

            const allVids = [...free, ...locked].map(r => r.video).filter((v): v is Video => v !== null);
            const uniqueCategories = [...new Set(allVids.map(v => v.category).filter(Boolean))] as string[];
            setCategories(["All", ...uniqueCategories]);
          }
        }
      }

      // Fetch completed videos using profile userId
      const { data: views } = await supabase
        .from("video_views")
        .select("video_id")
        .eq("user_id", userId)
        .eq("status", "completed");
      
      if (views) {
        setCompletedVideoIds(new Set(views.map(v => v.video_id)));
      }

      setLoading(false);
    };

    fetchVideos();
  }, [authLoading, profile]);

  const isPremium = accountStatus === "live_account";

  // Filter videos based on search and category
  const filterVideo = (video: Video | null) => {
    if (!video) return false;
    const matchesCategory = selectedCategory === "All" || video.category === selectedCategory;
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  };

  const filteredFreeVideos = freeVideos.filter(r => filterVideo(r.video));
  const filteredLockedVideos = lockedVideos.filter(r => filterVideo(r.video));
  const filteredAllVideos = allVideos.filter(filterVideo);

  const handleLockedVideoClick = (title: string) => {
    setSelectedLockedVideo(title);
    setLockedModalOpen(true);
  };

  const VideoCard = ({ video, isLocked = false, isCompleted = false, reason }: { video: Video; isLocked?: boolean; isCompleted?: boolean; reason?: string | null }) => {
    const thumbnail = getThumbnail(video);
    
    return (
    <Card
      className={`overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${isLocked ? 'cursor-pointer opacity-90' : 'cursor-pointer'}`}
      onClick={() => isLocked ? handleLockedVideoClick(video.title) : navigate(`/video/${video.id}`)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-muted">
        {thumbnail ? (
          <img 
            src={thumbnail} 
            alt={video.title}
            className={`w-full h-full object-cover ${isLocked ? 'grayscale' : ''}`}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Play className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        
        {/* Lock Overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <p className="text-white text-sm font-medium px-4">
                Unlock with Live Account
              </p>
            </div>
          </div>
        )}

        {/* Completed badge */}
        {isCompleted && !isLocked && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-semibold">
            <CheckCircle className="w-3.5 h-3.5" />
            Completed
          </div>
        )}
        
        {/* Play overlay for unlocked */}
        {!isLocked && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <Play className="h-12 w-12 text-white" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground line-clamp-2">{video.title}</h3>
        </div>

        <div className="flex items-center gap-2">
          <Badge className={`${categoryColors[video.category || ""] || "bg-gray-500"} text-white`}>
            {video.category || "Uncategorized"}
          </Badge>
          <span className="text-sm text-muted-foreground">⏱ {formatDuration(video.duration_seconds)}</span>
        </div>

        {reason && (
          <p className="text-xs text-muted-foreground italic line-clamp-2">{reason}</p>
        )}

        <div className="flex items-center justify-between">
          {isLocked ? (
            <>
              <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                🔒 Premium
              </Badge>
              <Button size="sm" variant="outline" className="text-amber-600 border-amber-300 hover:bg-amber-50">
                Unlock
              </Button>
            </>
          ) : (
            <>
              <Badge variant="outline" className="text-xs">
                {isCompleted ? "✓ Watched" : "Free"}
              </Badge>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                {isCompleted ? "Watch Again" : "Watch Now"}
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">My Video Library</h1>
          <p className="text-muted-foreground">
            {isPremium ? "Full access to all videos" : `${freeVideos.length} free videos available`}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4">
          {/* Search and Filter Row */}
          <div className="flex gap-3">
            {/* Search - takes most space */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-card border-2 border-border focus:border-primary placeholder:text-muted-foreground/70"
              />
            </div>

            {/* Mobile: Filter Button with Sheet */}
            <div className="md:hidden">
              <VideoFilterSheet 
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>
          </div>

          {/* Desktop: Category Pills (wrapped, no horizontal scroll) */}
          <div className="hidden md:flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "h-9 px-4 font-medium transition-all duration-200",
                  selectedCategory === category 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "bg-card/50 border-2 border-border text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-card"
                )}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Mobile: Show active filter as badge */}
          {selectedCategory !== "All" && (
            <div className="md:hidden flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Filtered by:</span>
              <Badge 
                variant="secondary" 
                className="bg-primary/10 text-primary border border-primary/30"
              >
                {selectedCategory}
                <button 
                  onClick={() => setSelectedCategory("All")}
                  className="ml-1.5 hover:text-primary/80"
                >
                  ×
                </button>
              </Badge>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card rounded-xl overflow-hidden border border-border">
                <Skeleton className="aspect-video w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Premium User: Show all videos */}
        {!loading && isPremium && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAllVideos.map((video) => (
              <VideoCard 
                key={video.id} 
                video={video} 
                isCompleted={completedVideoIds.has(video.id)}
              />
            ))}
          </div>
        )}

        {/* Free User: Show free + locked videos with conversion banner */}
        {!loading && !isPremium && (
          <div className="space-y-12">
            {/* Free Videos Section */}
            {filteredFreeVideos.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-semibold text-foreground">Your Free Videos</h2>
                  <Badge className="bg-emerald-500 text-white">{filteredFreeVideos.length} available</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredFreeVideos.map((rec) => rec.video && (
                    <VideoCard 
                      key={rec.id} 
                      video={rec.video} 
                      isCompleted={completedVideoIds.has(rec.video.id)}
                      reason={rec.reason}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Conversion Banner */}
            <ConversionBanner />

            {/* Locked Videos Section */}
            {filteredLockedVideos.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Premium Content - Advanced Strategies
                  </h2>
                  <Badge variant="secondary">100+ locked</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredLockedVideos.map((rec) => rec.video && (
                    <VideoCard 
                      key={rec.id} 
                      video={rec.video} 
                      isLocked={true}
                      reason={rec.reason}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!loading && (
          (isPremium && filteredAllVideos.length === 0) ||
          (!isPremium && filteredFreeVideos.length === 0 && filteredLockedVideos.length === 0)
        ) && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No videos found matching your criteria.</p>
          </div>
        )}

        {/* Locked Video Modal */}
        <LockedVideoModal 
          isOpen={lockedModalOpen}
          onClose={() => setLockedModalOpen(false)}
          videoTitle={selectedLockedVideo}
        />
      </div>
    </DashboardLayout>
  );
};

export default MyVideos;
