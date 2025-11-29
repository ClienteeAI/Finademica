import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, Play } from "lucide-react";

const placeholderVideos = [
  {
    id: "1",
    title: "Why Trade Forex?",
    category: "Getting Started",
    categoryColor: "bg-blue-500",
    duration: "7 minutes",
    progress: 0,
    status: "Not Started",
    thumbnail: null,
  },
  {
    id: "2",
    title: "Timing Your Entries",
    category: "Trading Strategies",
    categoryColor: "bg-purple-500",
    duration: "8 minutes",
    progress: 0,
    status: "Not Started",
    thumbnail: null,
  },
  {
    id: "3",
    title: "Risk and Position Management",
    category: "Risk Management",
    categoryColor: "bg-red-500",
    duration: "15 minutes",
    progress: 0,
    status: "Not Started",
    thumbnail: null,
  },
  {
    id: "4",
    title: "Double Top & Double Bottom Patterns",
    category: "Technical Analysis",
    categoryColor: "bg-green-500",
    duration: "7 minutes",
    progress: 0,
    status: "Not Started",
    thumbnail: null,
  },
  {
    id: "5",
    title: "Small Cap Trading",
    category: "Trading Strategies",
    categoryColor: "bg-purple-500",
    duration: "9 minutes",
    progress: 0,
    status: "Not Started",
    thumbnail: null,
  },
];

const categories = ["All", "Getting Started", "Risk Management", "Trading Strategies", "Technical Analysis"];

const MyVideos = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVideos = placeholderVideos.filter((video) => {
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

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
              onClick={() => navigate(`/video/${video.id}`)}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-muted flex items-center justify-center">
                <Play className="h-12 w-12 text-muted-foreground" />
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-foreground line-clamp-2">{video.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className={`${video.categoryColor} text-white`}>{video.category}</Badge>
                  <span className="text-sm text-muted-foreground">⏱ {video.duration}</span>
                </div>

                {video.progress > 0 && (
                  <div className="space-y-1">
                    <Progress value={video.progress} className="h-1" />
                    <p className="text-xs text-muted-foreground">{video.progress}% complete</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {video.status}
                  </Badge>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Watch Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No videos found matching your criteria.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyVideos;
