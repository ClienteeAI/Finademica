import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Save, TrendingUp, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useLogEvent } from "@/hooks/useLogEvent";

interface DiaryEntry {
  id: string;
  symbol: string;
  side: "long" | "short";
  entry_price: number;
  stop_loss_price: number;
  take_profit_price?: number;
  lots_final?: number;
  notes?: string;
  status?: string;
}

interface EditTradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trade: DiaryEntry | null;
  isNasrTheme: boolean;
  onSuccess: () => void;
}

export const EditTradeModal = ({
  open,
  onOpenChange,
  trade,
  isNasrTheme,
  onSuccess,
}: EditTradeModalProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { logEvent } = useLogEvent();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [symbol, setSymbol] = useState("");
  const [side, setSide] = useState<"long" | "short">("long");
  const [status, setStatus] = useState<"planned" | "open" | "closed">("planned");
  const [entryPrice, setEntryPrice] = useState("");
  const [stopLossPrice, setStopLossPrice] = useState("");
  const [takeProfitPrice, setTakeProfitPrice] = useState("");
  const [lotsFinal, setLotsFinal] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (trade) {
      setSymbol(trade.symbol || "");
      setSide(trade.side || "long");
      setStatus((trade.status as "planned" | "open" | "closed") || "planned");
      setEntryPrice(trade.entry_price?.toString() || "");
      setStopLossPrice(trade.stop_loss_price?.toString() || "");
      setTakeProfitPrice(trade.take_profit_price?.toString() || "");
      setLotsFinal(trade.lots_final?.toString() || "");
      setNotes(trade.notes || "");
    }
  }, [trade]);

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
    if (!trade) return;

    setIsSubmitting(true);

    try {
      // Get authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Login Required",
          description: "Please log in to manage your trading diary.",
          variant: "destructive",
        });
        onOpenChange(false);
        navigate("/login");
        return;
      }

      // Update directly in Supabase
      const { error } = await supabase
        .from('trading_diary_trades')
        .update({
          symbol: symbol.toUpperCase(),
          side,
          status,
          entry_price: parseFloat(entryPrice) || null,
          stop_loss_price: parseFloat(stopLossPrice) || null,
          take_profit_price: takeProfitPrice ? parseFloat(takeProfitPrice) : null,
          lots_final: lotsFinal ? parseFloat(lotsFinal) : null,
          notes: notes || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', trade.id)
        .eq('auth_user_id', user.id);

      if (error) {
        console.error("Update error:", error);
        toast({
          title: "Error",
          description: "Failed to update trade. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Trade updated",
        description: "Your trade has been updated successfully.",
      });
      
      // Log event
      await logEvent("diary_trade_updated", {
        trade_id: trade.id,
        fields_changed: ["symbol", "side", "status", "entry_price", "stop_loss_price", "take_profit_price", "lots_final", "notes"],
      });
      
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Failed to update trade:", error);
      toast({
        title: "Error",
        description: "Failed to update trade. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "max-w-md backdrop-blur-xl border",
        isNasrTheme 
          ? 'bg-nasr-panel/95 border-gold/20' 
          : 'bg-white/95 border-ice'
      )}>
        <DialogHeader>
          <DialogTitle className={cn("text-xl", themeColors.heading)}>
            Edit Trade
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Symbol */}
          <div className="space-y-2">
            <Label className={themeColors.subtext}>Symbol</Label>
            <Input
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className={cn("h-11", themeColors.inputBg, themeColors.inputBorder)}
            />
          </div>

          {/* Side Toggle */}
          <div className="space-y-2">
            <Label className={themeColors.subtext}>Side</Label>
            <div className={cn(
              "flex gap-1 p-1 rounded-xl",
              isNasrTheme ? 'bg-nasr-bg/60' : 'bg-muted/60'
            )}>
              <button
                type="button"
                onClick={() => setSide("long")}
                className={cn(
                  "flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2",
                  side === "long" ? themeColors.toggleActive : themeColors.toggleInactive
                )}
              >
                <TrendingUp className="w-4 h-4" /> Long
              </button>
              <button
                type="button"
                onClick={() => setSide("short")}
                className={cn(
                  "flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2",
                  side === "short" ? themeColors.toggleActive : themeColors.toggleInactive
                )}
              >
                <TrendingDown className="w-4 h-4" /> Short
              </button>
            </div>
          </div>

          {/* Status Toggle */}
          <div className="space-y-2">
            <Label className={themeColors.subtext}>Status</Label>
            <div className={cn(
              "flex gap-1 p-1 rounded-xl",
              isNasrTheme ? 'bg-nasr-bg/60' : 'bg-muted/60'
            )}>
              <button
                type="button"
                onClick={() => setStatus("planned")}
                className={cn(
                  "flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200",
                  status === "planned" ? themeColors.toggleActive : themeColors.toggleInactive
                )}
              >
                Planned
              </button>
              <button
                type="button"
                onClick={() => setStatus("open")}
                className={cn(
                  "flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200",
                  status === "open" ? themeColors.toggleActive : themeColors.toggleInactive
                )}
              >
                Open
              </button>
              <button
                type="button"
                onClick={() => setStatus("closed")}
                className={cn(
                  "flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200",
                  status === "closed" ? themeColors.toggleActive : themeColors.toggleInactive
                )}
              >
                Closed
              </button>
            </div>
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className={themeColors.subtext}>Entry Price</Label>
              <Input
                type="number"
                step="any"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
                className={cn("h-11 font-mono", themeColors.inputBg, themeColors.inputBorder)}
              />
            </div>
            <div className="space-y-2">
              <Label className={themeColors.subtext}>Stop Loss</Label>
              <Input
                type="number"
                step="any"
                value={stopLossPrice}
                onChange={(e) => setStopLossPrice(e.target.value)}
                className={cn("h-11 font-mono", themeColors.inputBg, themeColors.inputBorder)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className={themeColors.subtext}>Take Profit</Label>
              <Input
                type="number"
                step="any"
                value={takeProfitPrice}
                onChange={(e) => setTakeProfitPrice(e.target.value)}
                className={cn("h-11 font-mono", themeColors.inputBg, themeColors.inputBorder)}
              />
            </div>
            <div className="space-y-2">
              <Label className={themeColors.subtext}>Lots</Label>
              <Input
                type="number"
                step="0.01"
                value={lotsFinal}
                onChange={(e) => setLotsFinal(e.target.value)}
                className={cn("h-11 font-mono", themeColors.inputBg, themeColors.inputBorder)}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className={themeColors.subtext}>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this trade..."
              className={cn(
                "min-h-[80px] resize-none",
                themeColors.inputBg,
                themeColors.inputBorder
              )}
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
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
                Updating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
