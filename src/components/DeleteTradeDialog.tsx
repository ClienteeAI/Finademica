import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface DeleteTradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tradeId: string | null;
  tradeSymbol: string;
  isNasrTheme: boolean;
  onSuccess: () => void;
}

export const DeleteTradeDialog = ({
  open,
  onOpenChange,
  tradeId,
  tradeSymbol,
  isNasrTheme,
  onSuccess,
}: DeleteTradeDialogProps) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!tradeId) return;

    setIsDeleting(true);

    let userId = localStorage.getItem('userId');
    if (!userId) {
      const userData = localStorage.getItem('userData');
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          userId = parsed.userId || parsed.id;
        } catch (e) {
          console.error('Failed to parse userData');
        }
      }
    }

    const payload = {
      action: "delete",
      user_id: userId || "unknown",
      trade_id: tradeId,
    };

    try {
      const response = await fetch(
        "https://clientee.app.n8n.cloud/webhook-test/03362423-8c6c-4c11-bd42-1c56a074a88d",
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "x-diary-secret": "DIARY_9fA3kP2xQ7mVZ81sLwT0R"
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        toast({
          title: "Trade deleted",
          description: "Your trade has been removed from the diary.",
        });
        onOpenChange(false);
        onSuccess();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete trade. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Delete trade error:', error);
      toast({
        title: "Error",
        description: "Failed to delete trade. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className={cn(
        "backdrop-blur-xl border",
        isNasrTheme 
          ? 'bg-nasr-panel/95 border-gold/20' 
          : 'bg-white/95 border-ice'
      )}>
        <AlertDialogHeader>
          <AlertDialogTitle className={cn(
            isNasrTheme ? 'text-nasr-text font-playfair' : 'text-ocean'
          )}>
            Delete Trade
          </AlertDialogTitle>
          <AlertDialogDescription className={cn(
            isNasrTheme ? 'text-nasr-text-muted' : 'text-ocean-muted'
          )}>
            Are you sure you want to delete the trade for <span className="font-semibold">{tradeSymbol}</span>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            disabled={isDeleting}
            className={cn(
              "rounded-xl",
              isNasrTheme 
                ? 'border-gold/20 text-nasr-text hover:bg-gold/10' 
                : 'border-ice text-ocean hover:bg-muted'
            )}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
