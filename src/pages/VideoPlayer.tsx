import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, CheckCircle, Play, Loader2 } from "lucide-react";
import { useVideoCompletion } from "@/hooks/useVideoCompletion";
import { useGamification } from "@/hooks/useGamification";
import { supabase } from "@/integrations/supabase/client";

interface Video {
  id: string;
  title: string;
  category: string | null;
  duration_seconds: number | null;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  transcript: string | null;
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

const getYouTubeEmbedUrl = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
  }
  return null;
};

const VideoPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState<Video | null>(null);
  const [nextVideo, setNextVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Get gamification refresh function
  const { refetch: refetchGamification } = useGamification();
  
  // Pass video title and refresh callback to useVideoCompletion
  const { 
    handleVideoEnd, 
    isCompleting,
  } = useVideoCompletion(id, video?.title, refetchGamification);

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }

      if (!id) return;
      
      setLoading(true);
      
      const { data, error } = await supabase
        .from("videos")
        .select("id, title, category, duration_seconds, description, video_url, thumbnail_url, transcript")
        .eq("id", id)
        .eq("is_active", true)
        .maybeSingle();

      if (error) {
        console.error("Error fetching video:", error);
        setLoading(false);
        return;
      }

      setVideo(data);

      if (data) {
        const { data: nextData } = await supabase
          .from("videos")
          .select("id, title, category, duration_seconds, thumbnail_url, video_url, description, transcript")
          .eq("is_active", true)
          .neq("id", id)
          .order("order_priority", { ascending: true })
          .limit(1)
          .maybeSingle();
        
        setNextVideo(nextData);
      }

      setLoading(false);
    };

    checkAuthAndFetch();
  }, [id, navigate]);

  if (loading) {
    return (
      <SidebarLayout>
        <div className="space-y-6 animate-fade-in">
          <Skeleton className="h-10 w-32" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="aspect-video w-full rounded-xl" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  if (!video) {
    return (
      <SidebarLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Video not found</p>
          <Button onClick={() => navigate("/videos")} className="mt-4">
            Back to Videos
          </Button>
        </div>
      </SidebarLayout>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(video.video_url);

  return (
    <SidebarLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/videos")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Videos
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="relative aspect-video bg-card rounded-xl border border-border overflow-hidden">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={video.title}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-card">
                  <div className="text-center space-y-4">
                    <Play className="h-16 w-16 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">Video unavailable</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* AI Disclaimer */}
            <p className="text-xs text-muted-foreground text-center mt-2">
              Videos are prepared by professionals and presented by AI
            </p>

            {/* Video Info */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    {video.title}
                  </h1>
                  <div className="flex items-center gap-2">
                    <Badge className={`${categoryColors[video.category || ""] || "bg-gray-500"} text-white`}>
                      {video.category || "Uncategorized"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">⏱ {formatDuration(video.duration_seconds)}</span>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground">{video.description || "No description available."}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Progress Card */}
            <Card className="p-4 space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Your Progress</h3>
                <Progress value={0} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">0% watched</p>
              </div>
              
              <Button 
                className="w-full gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400" 
                onClick={handleVideoEnd}
                disabled={isCompleting}
              >
                {isCompleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                {isCompleting ? "Saving..." : "Mark as Complete"}
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                Earn +25 XP when you complete this video
              </p>
            </Card>

            {/* Next Video */}
            {nextVideo && (
              <Card className="p-4 space-y-3">
                <h3 className="font-semibold text-foreground">Up Next</h3>
                <div
                  className="space-y-2 cursor-pointer group"
                  onClick={() => navigate(`/video/${nextVideo.id}`)}
                >
                  <div className="relative aspect-video bg-muted rounded-lg overflow-hidden group-hover:opacity-80 transition-opacity">
                    {nextVideo.thumbnail_url ? (
                      <img 
                        src={nextVideo.thumbnail_url} 
                        alt={nextVideo.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Play className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {nextVideo.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDuration(nextVideo.duration_seconds)}
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default VideoPlayer;
