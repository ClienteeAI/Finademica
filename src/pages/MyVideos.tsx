import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Play, CheckCircle, Clock, BookOpen, Lock, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/AuthContext";
import { VideoFilterSheet } from "@/components/VideoFilterSheet";
import { cn } from "@/lib/utils";
import { LockedVideoModal } from "@/components/LockedVideoModal";

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
  is_unlocked: boolean;
  is_mandatory: boolean;
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

// Seeded random shuffle using user_id + today's date
const seededShuffle = <T,>(array: T[], seed: string): T[] => {
  const result = [...array];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  
  for (let i = result.length - 1; i > 0; i--) {
    hash = ((hash * 1103515245) + 12345) & 0x7fffffff;
    const j = hash % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const getTodayDateString = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

const VIDEOS_PER_PAGE = 3;
const LOCKED_PREVIEW_COUNT = 12;

const MyVideos = () => {
  const navigate = useNavigate();
  const { profile, loading: authLoading } = useAuth();
  
  const [playableVideos, setPlayableVideos] = useState<Video[]>([]);
  const [lockedVideos, setLockedVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [completedVideoIds, setCompletedVideoIds] = useState<Set<string>>(new Set());
  const [showLockedModal, setShowLockedModal] = useState(false);
  const [selectedLockedVideo, setSelectedLockedVideo] = useState<Video | null>(null);
  
  // Show more state for playable and locked sections
  const [playableShowCount, setPlayableShowCount] = useState(VIDEOS_PER_PAGE);
  const [lockedShowCount, setLockedShowCount] = useState(VIDEOS_PER_PAGE);

  useEffect(() => {
    if (authLoading) return;
    
    const userId = profile?.id;
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchVideos(userId);
  }, [authLoading, profile]);

  const fetchVideos = async (userId: string) => {
    setLoading(true);
    try {
      // Step A: Load unlocks for current user
      const { data: unlockedData, error: unlocksError } = await supabase
        .from("user_video_unlocks")
        .select("video_id")
        .eq("user_id", userId);

      if (unlocksError) {
        console.error("Error fetching unlocks:", unlocksError);
      }

      const unlockedVideoIds = new Set(
        (unlockedData || []).map((u) => u.video_id)
      );

      // Step B: Load videos
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
        setPlayableVideos([]);
        setLockedVideos([]);
        setLoading(false);
        return;
      }

      // Split videos into playable and locked
      const playable: Video[] = [];
      const locked: Video[] = [];

      allVideos.forEach((video) => {
        const isMandatory = video.mandatory === true;
        const isUnlocked = unlockedVideoIds.has(video.id);
        const isPlayable = isMandatory || isUnlocked;

        const videoWithFlags: Video = {
          ...video,
          is_unlocked: isPlayable,
          is_mandatory: isMandatory,
        };

        if (isPlayable) {
          playable.push(videoWithFlags);
        } else {
          locked.push(videoWithFlags);
        }
      });

      setPlayableVideos(playable);

      // Seeded shuffle for locked videos (changes daily)
      const seed = userId + getTodayDateString();
      const shuffledLocked = seededShuffle(locked, seed);
      setLockedVideos(shuffledLocked.slice(0, LOCKED_PREVIEW_COUNT));

      // Fetch completed video IDs
      const { data: views } = await supabase
        .from("video_views")
        .select("video_id")
        .eq("user_id", userId)
        .eq("status", "completed");

      if (views) {
        setCompletedVideoIds(new Set(views.map((v) => v.video_id)));
      }
    } catch (err) {
      console.error("Error in fetchVideos:", err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories from all videos
  const categories = useMemo(() => {
    const allVids = [...playableVideos, ...lockedVideos];
    const cats = ["All", ...new Set(allVids.map((v) => v.category).filter(Boolean))];
    return cats as string[];
  }, [playableVideos, lockedVideos]);

  // Filter videos by search and category
  const filteredPlayable = useMemo(() => {
    return playableVideos.filter((video) => {
      const matchesSearch =
        !searchQuery ||
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || video.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [playableVideos, searchQuery, selectedCategory]);

  const filteredLocked = useMemo(() => {
    return lockedVideos.filter((video) => {
      const matchesSearch =
        !searchQuery ||
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || video.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [lockedVideos, searchQuery, selectedCategory]);

  const handleVideoClick = (video: Video) => {
    if (video.is_unlocked) {
      navigate(`/video/${video.id}`);
    } else {
      setSelectedLockedVideo(video);
      setShowLockedModal(true);
    }
  };

  const handleShowMorePlayable = () => {
    setPlayableShowCount((prev) => prev + VIDEOS_PER_PAGE);
  };

  const handleShowMoreLocked = () => {
    setLockedShowCount((prev) => prev + VIDEOS_PER_PAGE);
  };

  const displayedPlayable = filteredPlayable.slice(0, playableShowCount);
  const displayedLocked = filteredLocked.slice(0, lockedShowCount);
  const hasMorePlayable = playableShowCount < filteredPlayable.length;
  const hasMoreLocked = lockedShowCount < filteredLocked.length;

  const VideoCard = ({ video, isLocked = false }: { video: Video; isLocked?: boolean }) => {
    const isCompleted = completedVideoIds.has(video.id);
    const thumbnail = getThumbnail(video);

    return (
      <Card
        className={cn(
          "group overflow-hidden cursor-pointer transition-all duration-300 bg-card border-border",
          isLocked 
            ? "hover:shadow-md opacity-80 hover:opacity-100" 
            : "hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/50"
        )}
        onClick={() => handleVideoClick(video)}
      >
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-muted">
          <img
            src={thumbnail}
            alt={video.title}
            className={cn(
              "w-full h-full object-cover transition-transform duration-300",
              isLocked ? "filter grayscale-[30%]" : "group-hover:scale-105"
            )}
          />
          
          {/* Overlay */}
          {isLocked ? (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-muted/90 flex items-center justify-center">
                <Lock className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center">
                <Play className="h-6 w-6 text-primary-foreground ml-1" />
              </div>
            </div>
          )}

          {/* Duration badge */}
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDuration(video.duration_seconds)}
          </div>

          {/* Mandatory badge */}
          {video.is_mandatory && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-amber-500/90 text-white border-0">
                Required
              </Badge>
            </div>
          )}

          {/* Locked badge */}
          {isLocked && (
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="bg-muted/90 text-muted-foreground border-0">
                <Lock className="h-3 w-3 mr-1" />
                Locked
              </Badge>
            </div>
          )}

          {/* Completed badge */}
          {isCompleted && !isLocked && (
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
              className={cn(
                "text-white text-xs",
                isLocked ? "bg-gray-500" : categoryColors[video.category] || "bg-gray-500"
              )}
            >
              {video.category}
            </Badge>
          )}
          <h3 className={cn(
            "font-semibold line-clamp-2 transition-colors",
            isLocked ? "text-muted-foreground" : "text-foreground group-hover:text-primary"
          )}>
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
            {isLocked ? (
              <Button size="sm" variant="secondary" className="bg-muted text-muted-foreground">
                <Lock className="h-3 w-3 mr-1" />
                Unlock
              </Button>
            ) : (
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                {isCompleted ? "Rewatch" : "Watch"}
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  };

  const totalVideos = playableVideos.length + lockedVideos.length;

  return (
    <SidebarLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            My Video Library
          </h1>
          <p className="text-muted-foreground">
            {playableVideos.length} playable • {lockedVideos.length} locked
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
            {[1, 2, 3].map((i) => (
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

        {/* Playable Videos Section */}
        {!loading && filteredPlayable.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Play className="h-5 w-5 text-primary" />
              Your Videos ({filteredPlayable.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedPlayable.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
            {hasMorePlayable && (
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  onClick={handleShowMorePlayable}
                  className="gap-2"
                >
                  Show More
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Locked Videos Section */}
        {!loading && filteredLocked.length > 0 && (
          <div className="space-y-4 pt-8 border-t border-border">
            <h2 className="text-xl font-semibold text-muted-foreground flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Unlock More Videos ({filteredLocked.length})
            </h2>
            <p className="text-sm text-muted-foreground">
              Pass quizzes to unlock these videos
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedLocked.map((video) => (
                <VideoCard key={video.id} video={video} isLocked />
              ))}
            </div>
            {hasMoreLocked && (
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  onClick={handleShowMoreLocked}
                  className="gap-2"
                >
                  Show More
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredPlayable.length === 0 && filteredLocked.length === 0 && (
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

      {/* Locked Video Modal */}
      <LockedVideoModal
        isOpen={showLockedModal}
        onClose={() => setShowLockedModal(false)}
        videoTitle={selectedLockedVideo?.title || ""}
      />
    </SidebarLayout>
  );
};

export default MyVideos;
