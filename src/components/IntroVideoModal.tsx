import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useClient } from "@/lib/clientContext";
import { useMemo } from "react";
import { useVideoCompletion } from "@/hooks/useVideoCompletion";
import { CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface IntroVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INTRO_VIDEOS = [
  { id: "intro-video-1", url: "https://www.youtube.com/embed/1ny_F4BUyv8", title: "NASR Lector Intro 1" },
  { id: "intro-video-2", url: "https://www.youtube.com/embed/Ta-nuMY02co", title: "NASR Lector Intro 2" },
];

export const IntroVideoModal = ({ isOpen, onClose }: IntroVideoModalProps) => {
  const { client } = useClient();
  const isPremiumTheme = client?.subdomain === 'finademica';

  // Randomly select a video when the modal opens
  const selectedVideo = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * INTRO_VIDEOS.length);
    return INTRO_VIDEOS[randomIndex];
  }, [isOpen]);

  const { handleVideoEnd, isCompleting } = useVideoCompletion(
    selectedVideo.id,
    selectedVideo.title
  );

  const handleMarkComplete = async () => {
    await handleVideoEnd();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "sm:max-w-3xl p-0 overflow-hidden",
        isPremiumTheme 
          ? 'bg-premium-panel border-premium-gold/30' 
          : 'bg-background border-border'
      )}>
        <DialogHeader className={cn("p-6 pb-0", isPremiumTheme ? 'text-premium-text' : '')}>
          <DialogTitle className={cn(
            "text-xl font-semibold",
            isPremiumTheme 
              ? 'text-premium-gold font-serif' 
              : 'text-foreground'
          )}>
            Welcome to Finademica Academy
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6 pt-4 space-y-4">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
            <iframe
              src={`${selectedVideo.url}?autoplay=1&rel=0`}
              title="Intro Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
          
          <Button
            onClick={handleMarkComplete}
            disabled={isCompleting}
            className={cn(
              "w-full",
              isPremiumTheme 
                ? 'bg-premium-gold text-premium-bg hover:shadow-premium-gold/30 premium-gold-glow' 
                : 'bg-gradient-to-r from-aqua to-aqua-deep text-white hover:shadow-aqua/30'
            )}
          >
            {isCompleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Complete
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
