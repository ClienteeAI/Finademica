import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useClient } from "@/lib/clientContext";
import { useMemo } from "react";

interface IntroVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INTRO_VIDEOS = [
  "https://www.youtube.com/embed/1ny_F4BUyv8",
  "https://www.youtube.com/embed/Ta-nuMY02co",
];

export const IntroVideoModal = ({ isOpen, onClose }: IntroVideoModalProps) => {
  const { client } = useClient();
  const isNasrTheme = client?.subdomain === 'nasr';

  // Randomly select a video when the modal opens
  const selectedVideo = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * INTRO_VIDEOS.length);
    return INTRO_VIDEOS[randomIndex];
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-3xl p-0 overflow-hidden ${
        isNasrTheme 
          ? 'bg-nasr-panel border-gold/30' 
          : 'bg-background border-border'
      }`}>
        <DialogHeader className={`p-6 pb-0 ${isNasrTheme ? 'text-nasr-text' : ''}`}>
          <DialogTitle className={`text-xl font-semibold ${
            isNasrTheme 
              ? 'text-gold' 
              : 'text-foreground'
          }`}>
            Welcome to NASR Trade Academy
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6 pt-4">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
            <iframe
              src={`${selectedVideo}?autoplay=1&rel=0`}
              title="Intro Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
