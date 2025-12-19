import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Save, BookOpen, TrendingUp, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { useLogEvent } from "@/hooks/useLogEvent";
import { sendDiaryWebhook, getAuthUser } from "@/lib/diaryWebhook";

interface SaveAnalysisToDiaryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  symbol: string;
  currentPrice: number;
  aiMessage?: string;
  isNasrTheme?: boolean;
}

export const SaveAnalysisToDiaryModal = ({
  open,
  onOpenChange,
  symbol,
  currentPrice,
  aiMessage,
  isNasrTheme = false,
}: SaveAnalysisToDiaryModalProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { logEvent } = useLogEvent();
  
  const [side, setSide] = useState<"long" | "short">("long");
  const [entryPrice, setEntryPrice] = useState(currentPrice?.toString() || "");
  const [stopLossPrice, setStopLossPrice] = useState("");
  const [takeProfitPrice, setTakeProfitPrice] = useState("");
  const [notes, setNotes] = useState(aiMessage || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const themeColors = {
    heading: isNasrTheme ? 'text-nasr-text font-playfair' : 'text-ocean',
    subtext: isNasrTheme ? 'text-nasr-text-muted' : 'text-ocean-muted',
    primary: isNasrTheme ? 'text-gold' : 'text-aqua',
    inputBg: isNasrTheme ? 'bg-nasr-panel/60' : 'bg-white/60',
    inputBorder: isNasrTheme ? 'border-gold/20 focus:border-gold/50' : 'border-ice focus:border-aqua/50',
    toggleActive: isNasrTheme ? 'bg-gold text-nasr-bg' : 'bg-aqua text-white',
    toggleInactive: isNasrTheme ? 'bg-nasr-bg/60 text-nasr-text-muted' : 'bg-muted/60 text-ocean-muted',
  };

  const handleSubmit = async () => {
    if (!entryPrice) {
      toast({
        title: "Entry price required",
        description: "Please enter an entry price.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const authUser = await getAuthUser();
      
      if (!authUser) {
        toast({
          title: "Login Required",
          description: "Please log in to manage your trading diary.",
          variant: "destructive",
        });
        onOpenChange(false);
        navigate("/login");
        return;
      }

      const entryPriceNum = parseFloat(entryPrice) || 0;
      const stopLossPriceNum = stopLossPrice ? parseFloat(stopLossPrice) : (side === "long" ? entryPriceNum * 0.98 : entryPriceNum * 1.02);
      const takeProfitPriceNum = takeProfitPrice ? parseFloat(takeProfitPrice) : null;

      const tradeData = {
        auth_user_id: authUser.auth_user_id,
        email: authUser.user_email,
        broker_key: "nasr_trade_mt5",
        symbol: symbol.toUpperCase(),
        side,
        entry_price: entryPriceNum,
        stop_loss_price: stopLossPriceNum,
        take_profit_price: takeProfitPriceNum,
        lots_final: null,
        risk_total_usd: null,
        profit_total_usd: null,
        rr_ratio: null,
        tick_value_position_usd: null,
        pip_value_position_usd: null,
        notes: notes || null,
        status: "planned",
        open_time: null,
        tags: ["ai-analysis"],
      };

      console.log("Sending trade to diary:", tradeData);
      const result = await sendDiaryWebhook("create", tradeData);
      console.log("Diary webhook result:", result);

      if (!result.success) {
        console.error("Failed to save trade:", result.error);
        toast({
          title: "Error",
          description: result.error || "Failed to save trade. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Saved to diary",
        description: "Your trade idea has been saved successfully.",
      });
      
      await logEvent("diary_trade_created", {
        symbol: symbol.toUpperCase(),
        side,
        source: "ai_analyzer",
      });
      
      setShowSuccess(true);
    } catch (error) {
      console.error("Failed to save trade:", error);
      toast({
        title: "Error",
        description: "Failed to save trade. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowSuccess(false);
    setSide("long");
    setEntryPrice(currentPrice?.toString() || "");
    setStopLossPrice("");
    setTakeProfitPrice("");
    setNotes(aiMessage || "");
    onOpenChange(false);
  };

  if (showSuccess) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className={cn(
          "max-w-md backdrop-blur-xl border",
          isNasrTheme 
            ? 'bg-nasr-panel/95 border-gold/20' 
            : 'bg-white/95 border-ice'
        )}>
          <div className="text-center py-6 space-y-4">
            <div className={cn(
              "w-16 h-16 rounded-full mx-auto flex items-center justify-center",
              isNasrTheme ? 'bg-gold/20' : 'bg-emerald-500/20'
            )}>
              <span className="text-3xl">✅</span>
            </div>
            <h3 className={cn("text-xl font-semibold", themeColors.heading)}>
              Trade Idea Saved!
            </h3>
            <p className={cn("text-sm", themeColors.subtext)}>
              Your trade idea has been added to your Trading Diary.
            </p>
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleClose}
                className={cn(
                  "flex-1 h-11 rounded-xl",
                  isNasrTheme 
                    ? 'border-gold/30 text-gold hover:bg-gold/10' 
                    : 'border-aqua/30 text-aqua hover:bg-aqua/10'
                )}
              >
                Close
              </Button>
              <Link to="/diary" className="flex-1">
                <Button 
                  onClick={handleClose}
                  className={cn(
                    "w-full h-11 font-semibold rounded-xl",
                    isNasrTheme 
                      ? 'gold-gradient text-nasr-bg hover:opacity-90' 
                      : 'success-gradient text-white hover:opacity-90'
                  )}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Open Diary
                </Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={cn(
        "max-w-md backdrop-blur-xl border",
        isNasrTheme 
          ? 'bg-nasr-panel/95 border-gold/20' 
          : 'bg-white/95 border-ice'
      )}>
        <DialogHeader>
          <DialogTitle className={cn("text-xl", themeColors.heading)}>
            Save {symbol} to Diary
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Side Toggle */}
          <div className="space-y-2">
            <Label className={themeColors.subtext}>Direction</Label>
            <div className={cn(
              "flex gap-1 p-1 rounded-xl",
              isNasrTheme ? 'bg-nasr-bg/60' : 'bg-muted/60'
            )}>
              <button
                type="button"
                onClick={() => setSide("long")}
                className={cn(
                  "flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2",
                  side === "long" 
                    ? "bg-emerald-500 text-white" 
                    : themeColors.toggleInactive + " hover:opacity-80"
                )}
              >
                <TrendingUp className="w-4 h-4" />
                Long
              </button>
              <button
                type="button"
                onClick={() => setSide("short")}
                className={cn(
                  "flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2",
                  side === "short" 
                    ? "bg-red-500 text-white" 
                    : themeColors.toggleInactive + " hover:opacity-80"
                )}
              >
                <TrendingDown className="w-4 h-4" />
                Short
              </button>
            </div>
          </div>

          {/* Entry Price */}
          <div className="space-y-2">
            <Label className={themeColors.subtext}>Entry Price *</Label>
            <Input
              type="number"
              step="any"
              value={entryPrice}
              onChange={(e) => setEntryPrice(e.target.value)}
              placeholder="Entry price"
              className={cn(
                "h-11",
                themeColors.inputBg,
                themeColors.inputBorder
              )}
            />
          </div>

          {/* SL & TP Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className={themeColors.subtext}>Stop Loss</Label>
              <Input
                type="number"
                step="any"
                value={stopLossPrice}
                onChange={(e) => setStopLossPrice(e.target.value)}
                placeholder="Optional"
                className={cn(
                  "h-11",
                  themeColors.inputBg,
                  themeColors.inputBorder
                )}
              />
            </div>
            <div className="space-y-2">
              <Label className={themeColors.subtext}>Take Profit</Label>
              <Input
                type="number"
                step="any"
                value={takeProfitPrice}
                onChange={(e) => setTakeProfitPrice(e.target.value)}
                placeholder="Optional"
                className={cn(
                  "h-11",
                  themeColors.inputBg,
                  themeColors.inputBorder
                )}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className={themeColors.subtext}>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="AI analysis notes..."
              className={cn(
                "min-h-[80px] resize-none text-sm",
                themeColors.inputBg,
                themeColors.inputBorder
              )}
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !entryPrice}
            className={cn(
              "w-full h-12 text-base font-semibold rounded-xl transition-all",
              isNasrTheme 
                ? 'gold-gradient text-nasr-bg hover:opacity-90 gold-glow' 
                : 'success-gradient text-white hover:opacity-90 success-glow'
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save to Diary
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
