import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useLogEvent } from "@/hooks/useLogEvent";
import { sendDiaryWebhook, getAuthUser } from "@/lib/diaryWebhook";

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
  const { logEvent } = useLogEvent();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const isConfirmed = confirmText === "DELETE";

  const handleClose = (open: boolean) => {
    if (!open) {
      setConfirmText("");
    }
    onOpenChange(open);
  };

  const handleDelete = async () => {
    if (!tradeId || !isConfirmed) return;

    setIsDeleting(true);

    try {
      const authUser = await getAuthUser();
      
      if (!authUser) {
        toast({
          title: "Login Required",
          description: "Please log in to manage your trading diary.",
          variant: "destructive",
        });
        onOpenChange(false);
        return;
      }

      const result = await sendDiaryWebhook("delete", {
        auth_user_id: authUser.auth_user_id,
        email: authUser.user_email,
        trade_id: tradeId,
        symbol: tradeSymbol,
      });

      if (!result.success) {
        toast({
          title: "Error",
          description: "Failed to delete trade. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Trade deleted",
        description: "Your trade has been removed from the diary.",
      });
      
      await logEvent("diary_trade_deleted", { trade_id: tradeId });
      
      setConfirmText("");
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Failed to delete trade:", error);
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
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent className={cn(
        "backdrop-blur-xl border",
        isNasrTheme 
          ? 'bg-nasr-panel/95 border-gold/20' 
          : 'bg-white/95 border-ice'
      )}>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-full",
              isNasrTheme ? 'bg-red-500/20' : 'bg-destructive/10'
            )}>
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <AlertDialogTitle className={cn(
              isNasrTheme ? 'text-nasr-text font-playfair' : 'text-ocean'
            )}>
              Delete Trade
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className={cn(
            "pt-2",
            isNasrTheme ? 'text-nasr-text-muted' : 'text-ocean-muted'
          )}>
            Are you sure you want to delete the trade for <span className="font-semibold">{tradeSymbol}</span>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4 space-y-2">
          <p className={cn(
            "text-sm",
            isNasrTheme ? 'text-nasr-text-muted' : 'text-ocean-muted'
          )}>
            Type <span className="font-mono font-bold text-destructive">DELETE</span> to confirm:
          </p>
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type DELETE here"
            className={cn(
              "font-mono",
              isNasrTheme 
                ? 'bg-nasr-bg/60 border-gold/20 text-nasr-text' 
                : 'bg-white/60 border-ice'
            )}
          />
        </div>

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
          <Button
            onClick={handleDelete}
            disabled={isDeleting || !isConfirmed}
            variant="destructive"
            className="rounded-xl"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Trade"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
