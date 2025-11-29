import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle, Play } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

const videoData: Record<string, any> = {
  "1": {
    title: "Why Trade Forex?",
    category: "Getting Started",
    categoryColor: "bg-blue-500",
    duration: "7 minutes",
    description: "Learn the fundamentals of forex trading and why it's one of the most popular markets for traders worldwide.",
  },
  "2": {
    title: "Timing Your Entries",
    category: "Trading Strategies",
    categoryColor: "bg-purple-500",
    duration: "8 minutes",
    description: "Master the art of timing your market entries for maximum profitability.",
  },
  "3": {
    title: "Risk and Position Management",
    category: "Risk Management",
    categoryColor: "bg-red-500",
    duration: "15 minutes",
    description: "Essential risk management techniques to protect your trading capital.",
  },
  "4": {
    title: "Double Top & Double Bottom Patterns",
    category: "Technical Analysis",
    categoryColor: "bg-green-500",
    duration: "7 minutes",
    description: "Identify and trade powerful reversal patterns in the market.",
  },
  "5": {
    title: "Small Cap Trading",
    category: "Trading Strategies",
    categoryColor: "bg-purple-500",
    duration: "9 minutes",
    description: "Strategies for trading small cap stocks with high growth potential.",
  },
};

const VideoPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  
  const video = id ? videoData[id] : null;

  if (!video) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Video not found</p>
          <Button onClick={() => navigate("/videos")} className="mt-4">
            Back to Videos
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const nextVideoId = id ? String(parseInt(id) + 1) : null;
  const hasNextVideo = nextVideoId && videoData[nextVideoId];

  return (
    <DashboardLayout>
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
            <div className="relative aspect-video bg-card rounded-xl border border-border flex items-center justify-center">
              <div className="text-center space-y-4">
                <Play className="h-16 w-16 text-muted-foreground mx-auto" />
                <p className="text-muted-foreground">Video player will be embedded here</p>
              </div>
            </div>

            {/* Video Info */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    {video.title}
                  </h1>
                  <div className="flex items-center gap-2">
                    <Badge className={`${video.categoryColor} text-white`}>
                      {video.category}
                    </Badge>
                    <span className="text-sm text-muted-foreground">⏱ {video.duration}</span>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground">{video.description}</p>

              {/* Transcript */}
              <Collapsible open={transcriptOpen} onOpenChange={setTranscriptOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full">
                    {transcriptOpen ? "Hide" : "Show"} Transcript
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Card className="p-4 mt-4 bg-muted/50">
                    <p className="text-sm text-muted-foreground">
                      Video transcript will appear here with searchable and clickable timestamps...
                    </p>
                  </Card>
                </CollapsibleContent>
              </Collapsible>
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
              
              <Button className="w-full gap-2">
                <CheckCircle className="h-4 w-4" />
                Mark as Complete
              </Button>
            </Card>

            {/* Next Video */}
            {hasNextVideo && (
              <Card className="p-4 space-y-3">
                <h3 className="font-semibold text-foreground">Up Next</h3>
                <div
                  className="space-y-2 cursor-pointer group"
                  onClick={() => navigate(`/video/${nextVideoId}`)}
                >
                  <div className="relative aspect-video bg-muted rounded-lg flex items-center justify-center group-hover:bg-muted/70 transition-colors">
                    <Play className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {videoData[nextVideoId].title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {videoData[nextVideoId].duration}
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VideoPlayer;
