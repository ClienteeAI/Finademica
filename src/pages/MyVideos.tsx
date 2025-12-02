import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Video {
  id: string;
  title: string;
  category: string | null;
  duration_seconds: number | null;
  thumbnail_url: string | null;
  video_url: string;
  description: string | null;
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

const MyVideos = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>(["All"]);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("videos")
        .select("id, title, category, duration_seconds, thumbnail_url, video_url, description")
        .eq("is_active", true)
        .order("order_priority", { ascending: true });

      if (error) {
        console.error("Error fetching videos:", error);
        setLoading(false);
        return;
      }

      if (data) {
        setVideos(data);
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map(v => v.category).filter(Boolean))] as string[];
        setCategories(["All", ...uniqueCategories]);
      }
      setLoading(false);
    };

    fetchVideos();
  }, []);

  const filteredVideos = videos.filter((video) => {
    const matchesCategory = selectedCategory === "All" || video.category === selectedCategory;
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">My Video Library</h1>
          <p className="text-muted-foreground">Your personalized collection</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
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

        {/* Video Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
                onClick={() => navigate(`/video/${video.id}`)}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-muted">
                  {video.thumbnail_url ? (
                    <img 
                      src={video.thumbnail_url} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Play className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Play className="h-12 w-12 text-white" />
                  </div>
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

                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      Not Started
                    </Badge>
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      Watch Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No videos found matching your criteria.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyVideos;
