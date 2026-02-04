import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { shouldHideTradingCTAs } from "@/lib/featureFlags";
import { useClient } from "@/lib/clientContext";

interface LockedVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoTitle: string;
}

export const LockedVideoModal = ({ isOpen, onClose, videoTitle }: LockedVideoModalProps) => {
  const { client } = useClient();
  const hideCTAs = shouldHideTradingCTAs(client?.subdomain);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
            <Lock className="w-8 h-8 text-amber-600" />
          </div>
          <DialogTitle className="text-center text-xl">
            Premium Content
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 text-center">
          <p className="text-muted-foreground">
            This video teaches:
          </p>
          <p className="font-semibold text-foreground text-lg">
            "{videoTitle}"
          </p>
          
          <div className="bg-muted/50 rounded-xl p-4">
            <p className="text-sm text-muted-foreground">
              {hideCTAs 
                ? "Complete quizzes to unlock more videos"
                : "Available with live trading account"
              }
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            {!hideCTAs && (
              <Button 
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
                onClick={() => window.open('https://client.nasrtrade.com/client.add/?promocode=NTPP', '_blank')}
              >
                Open Live Account
              </Button>
            )}
            <Button 
              variant="outline" 
              className="w-full"
              onClick={onClose}
            >
              Back to Free Videos
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
