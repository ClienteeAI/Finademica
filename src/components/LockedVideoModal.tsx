import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock, BarChart2, Calculator, Swords, BookOpen, TrendingUp, Users, GraduationCap } from "lucide-react";
import { useClient } from "@/lib/clientContext";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface LockedVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoTitle: string;
}

const UNLOCK_ACTIONS = [
  { icon: GraduationCap, label: "Pass a Trading Quiz", path: "/quiz" },
  { icon: BarChart2, label: "Use the Stock Analyzer", path: "/analyzer" },
  { icon: Calculator, label: "Use the Calculator", path: "/calculator" },
  { icon: Users, label: "Share 5 posts on the Wall", path: "/feed" },
  { icon: Swords, label: "Complete an Arena challenge", path: "/arena" },
  { icon: BookOpen, label: "Log a trade in your Diary", path: "/diary" },
];

export const LockedVideoModal = ({ isOpen, onClose, videoTitle }: LockedVideoModalProps) => {
  const { client } = useClient();
  const navigate = useNavigate();
  const isPremiumTheme = client?.subdomain === 'finademica';

  const handleAction = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "sm:max-w-md",
        isPremiumTheme 
          ? "bg-premium-bg border-premium-gold/20 text-premium-text" 
          : ""
      )}>
        <DialogHeader>
          <div className={cn(
            "w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center",
            isPremiumTheme ? "bg-premium-gold/20" : "bg-amber-100"
          )}>
            <Lock className={cn("w-8 h-8", isPremiumTheme ? "text-premium-gold" : "text-amber-600")} />
          </div>
          <DialogTitle className={cn(
            "text-center text-xl",
            isPremiumTheme ? "text-premium-gold" : ""
          )}>
            🎁 Unlock More Free Content
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-5 text-center">
          <p className="text-muted-foreground text-sm">
            This video teaches:
          </p>
          <p className="font-semibold text-foreground text-base leading-snug">
            "{videoTitle}"
          </p>

          <div className={cn(
            "rounded-xl p-4 text-left space-y-3",
            isPremiumTheme ? "bg-premium-panel/50 border border-premium-gold/10" : "bg-muted/50"
          )}>
            <p className={cn(
              "text-sm font-semibold text-center mb-3",
              isPremiumTheme ? "text-premium-gold" : "text-foreground"
            )}>
              <TrendingUp className="inline w-4 h-4 mr-1" />
              Use the Academy to earn free videos:
            </p>
            {UNLOCK_ACTIONS.map(({ icon: Icon, label, path }) => (
              <button
                key={path}
                onClick={() => handleAction(path)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left",
                  isPremiumTheme
                    ? "hover:bg-premium-gold/10 text-premium-text-muted hover:text-premium-gold"
                    : "hover:bg-accent text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("w-4 h-4 flex-shrink-0", isPremiumTheme ? "text-premium-gold" : "text-primary")} />
                <span>{label}</span>
                <span className={cn(
                  "ml-auto text-xs font-semibold px-2 py-0.5 rounded-full",
                  isPremiumTheme ? "bg-premium-gold/20 text-premium-gold" : "bg-primary/10 text-primary"
                )}>+1 video</span>
              </button>
            ))}
          </div>

          <Button 
            variant="outline" 
            className={cn(
              "w-full",
              isPremiumTheme ? "border-premium-gold/30 text-premium-gold hover:bg-premium-gold/10" : ""
            )}
            onClick={onClose}
          >
            Back to Free Videos
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
