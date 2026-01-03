import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Play, CheckCircle, Clock, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/AuthContext";
import { VideoFilterSheet } from "@/components/VideoFilterSheet";
import { cn } from "@/lib/utils";

/**
 * Video interface matching the required output fields
 */
interface Video {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  asset_type: string;
  module: string;
  level: number;
  order_priority: number | null;
  category: string | null;
  duration_seconds: number;
  mandatory: boolean;
  created_at: string;
  is_unlocked: boolean; // Always true for visible videos
}

const categoryColors: Record<string, string> = {
  "Getting Started": "bg-blue-500",
  "Trading Strategies": "bg-purple-500",
  "Risk Management": "bg-red-500",
  "Technical Analysis": "bg-green-500",
  "Forex": "bg-emerald-500",
  "Stocks": "bg-blue-500",
  "Crypto": "bg-orange-500",
  "Psychology": "bg-pink-500",
  "Fundamentals": "bg-cyan-500",
};

const formatDuration = (seconds: number | null): string => {
  if (!seconds) return "0 min";
  const minutes = Math.floor(seconds / 60);
  return `${minutes} min`;
};

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

const getThumbnail = (video: Video): string => {
  if (video.thumbnail_url) return video.thumbnail_url;
  const ytThumb = getYouTubeThumbnail(video.video_url);
  if (ytThumb) return ytThumb;
  return "/placeholder.svg";
};

const MyVideos = () => {
  const navigate = useNavigate();
  const { profile, loading: authLoading } = useAuth();
  
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [completedVideoIds, setCompletedVideoIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (authLoading) return;
    
    const userId = profile?.id;
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchVisibleVideos(userId);
  }, [authLoading, profile]);

  /**
   * Fetch videos following strict visibility rules:
   * - Video is visible if mandatory = true OR exists in user_video_unlocks
   * - All visible videos are playable (is_unlocked = true)
   * - No locked videos are shown
   */
  const fetchVisibleVideos = async (userId: string) => {
    setLoading(true);
    try {
      // Step 1: Fetch ALL active videos from public.videos
      const { data: allVideos, error: videosError } = await supabase
        .from("videos")
        .select(`
          id,
          title,
          description,
          video_url,
          thumbnail_url,
          asset_type,
          module,
          level,
          order_priority,
          category,
          duration_seconds,
          mandatory,
          created_at
        `)
        .eq("is_active", true)
        .order("order_priority", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: true });

      if (videosError) {
        console.error("Error fetching videos:", videosError);
        setLoading(false);
        return;
      }

      if (!allVideos || allVideos.length === 0) {
        setVideos([]);
        setLoading(false);
        return;
      }

      // Step 2: Fetch user's unlocked videos from user_video_unlocks
      const { data: unlockedData, error: unlocksError } = await supabase
        .from("user_video_unlocks")
        .select("video_id")
        .eq("user_id", userId);

      if (unlocksError) {
        console.error("Error fetching unlocks:", unlocksError);
      }

      // Create a Set of unlocked video IDs for fast lookup
      const unlockedVideoIds = new Set(
        (unlockedData || []).map((u) => u.video_id)
      );

      // Step 3: Filter videos - ONLY show mandatory OR unlocked
      // Rule: visible if mandatory = true OR exists in user_video_unlocks
      const visibleVideos: Video[] = allVideos
        .filter((video) => {
          return video.mandatory === true || unlockedVideoIds.has(video.id);
        })
        .map((video) => ({
          ...video,
          is_unlocked: true, // All visible videos are playable
        }));

      setVideos(visibleVideos);

      // Step 4: Fetch completed video IDs
      const { data: views } = await supabase
        .from("video_views")
        .select("video_id")
        .eq("user_id", userId)
        .eq("status", "completed");

      if (views) {
        setCompletedVideoIds(new Set(views.map((v) => v.video_id)));
      }
    } catch (err) {
      console.error("Error in fetchVisibleVideos:", err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories from visible videos
  const categories = useMemo(() => {
    const cats = ["All", ...new Set(videos.map((v) => v.category).filter(Boolean))];
    return cats as string[];
  }, [videos]);

  // Filter videos by search and category
  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      const matchesSearch =
        !searchQuery ||
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || video.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [videos, searchQuery, selectedCategory]);

  const handleVideoClick = (videoId: string) => {
    navigate(`/video/${videoId}`);
  };

  const VideoCard = ({ video }: { video: Video }) => {
    const isCompleted = completedVideoIds.has(video.id);
    const thumbnail = getThumbnail(video);

    return (
      <Card
        className="group overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 bg-card border-border hover:border-primary/50"
        onClick={() => handleVideoClick(video.id)}
      >
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-muted">
          <img
            src={thumbnail}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Play overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center">
              <Play className="h-6 w-6 text-primary-foreground ml-1" />
            </div>
          </div>

          {/* Duration badge */}
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDuration(video.duration_seconds)}
          </div>

          {/* Mandatory badge */}
          {video.mandatory && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-amber-500/90 text-white border-0">
                Required
              </Badge>
            </div>
          )}

          {/* Completed badge */}
          {isCompleted && (
            <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-semibold">
              <CheckCircle className="w-3 h-3" />
              Done
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          {video.category && (
            <Badge
              className={`${categoryColors[video.category] || "bg-gray-500"} text-white text-xs`}
            >
              {video.category}
            </Badge>
          )}
          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {video.title}
          </h3>
          {video.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {video.description}
            </p>
          )}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="capitalize">{video.asset_type}</span>
              <span>•</span>
              <span>Level {video.level}</span>
            </div>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              {isCompleted ? "Rewatch" : "Watch"}
            </Button>
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
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            My Video Library
          </h1>
          <p className="text-muted-foreground">
            {videos.length} video{videos.length !== 1 ? "s" : ""} available
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-card border-2 border-border focus:border-primary placeholder:text-muted-foreground/70"
              />
            </div>

            <div className="md:hidden">
              <VideoFilterSheet
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>
          </div>

          {/* Desktop: Category Pills */}
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

          {/* Mobile: Active filter badge */}
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
              <div
                key={i}
                className="bg-card rounded-xl overflow-hidden border border-border"
              >
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

        {/* Video Grid */}
        {!loading && filteredVideos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredVideos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground">
              No videos available
            </h3>
            <p className="text-muted-foreground mt-1">
              {searchQuery || selectedCategory !== "All"
                ? "Try adjusting your filters"
                : "Complete quizzes to unlock more videos"}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyVideos;
