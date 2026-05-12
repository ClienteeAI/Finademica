import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Save, TrendingUp, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useLogEvent } from "@/hooks/useLogEvent";
import { useClient } from "@/lib/clientContext";
import { sendDiaryWebhook, getAuthUser } from "@/lib/diaryWebhook";
import { supabase } from "@/integrations/supabase/client";

interface DiaryEntry {
  id: string;
  symbol: string;
  side: "long" | "short";
  entry_price: number;
  stop_loss_price: number;
  take_profit_price?: number;
  lots_final?: number;
  risk_total_usd?: number;
  profit_total_usd?: number;
  rr_ratio?: number;
  tick_value_position_usd?: number;
  pip_value_position_usd?: number;
  notes?: string;
  status?: string;
}

interface EditTradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trade: DiaryEntry | null;
  onSuccess: () => void;
}

export const EditTradeModal = ({
  open,
  onOpenChange,
  trade,
  onSuccess,
}: EditTradeModalProps) => {
  const { client } = useClient();
  const isPremiumTheme = client?.subdomain === 'nasr' || client?.subdomain === 'finademica' || true;
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
    heading: isPremiumTheme ? 'text-premium-gold font-serif' : 'text-ocean',
    subtext: isPremiumTheme ? 'text-premium-text-muted' : 'text-ocean-muted',
    primary: isPremiumTheme ? 'text-premium-gold' : 'text-aqua',
    inputBg: isPremiumTheme ? 'bg-premium-panel/60' : 'bg-white/60',
    inputBorder: isPremiumTheme ? 'border-premium-gold/20 focus:border-premium-gold/50' : 'border-ice focus:border-aqua/50',
    toggleActive: isPremiumTheme ? 'bg-premium-gold text-premium-bg' : 'bg-aqua text-white',
    toggleInactive: isPremiumTheme ? 'bg-premium-bg/60 text-premium-text-muted' : 'bg-muted/60 text-ocean-muted',
  };

  const handleSubmit = async () => {
    if (!trade) return;

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

      // 1. Update directly in Supabase
      const { error: dbError } = await supabase
        .from('trading_diary')
        .update({
          Symbol: symbol.toUpperCase(),
          direction: side,
          Status: status,
          entry_price: parseFloat(entryPrice) || null,
          Stop_loss: parseFloat(stopLossPrice) || null,
          Take_profit: takeProfitPrice ? parseFloat(takeProfitPrice) : null,
          Volume: lotsFinal ? parseFloat(lotsFinal) : null,
          notes: notes || null,
        })
        .eq('id', trade.id);

      if (dbError) {
        console.error("Database update error:", dbError);
        toast({
          title: "Error",
          description: `Database error: ${dbError.message}`,
          variant: "destructive",
        });
        return;
      }

      // 2. Send to Webhook for CRM
      const tradeData = {
        auth_user_id: authUser.auth_user_id,
        supabase_id: authUser.supabase_id,
        email: authUser.user_email,
        phone: authUser.user_phone,
        trade_id: trade.id,
        broker_key: "finademica_mt5",
        symbol: symbol.toUpperCase(),
        side,
        status,
        entry_price: parseFloat(entryPrice) || null,
        stop_loss_price: parseFloat(stopLossPrice) || null,
        take_profit_price: takeProfitPrice ? parseFloat(takeProfitPrice) : null,
        lots_final: lotsFinal ? parseFloat(lotsFinal) : null,
        risk_total_usd: trade.risk_total_usd || null,
        profit_total_usd: trade.profit_total_usd || null,
        rr_ratio: trade.rr_ratio || null,
        tick_value_position_usd: trade.tick_value_position_usd || null,
        pip_value_position_usd: trade.pip_value_position_usd || null,
        notes: notes || null,
      };

      await sendDiaryWebhook("update", tradeData);

      toast({
        title: "Trade updated",
        description: "Your trade has been updated successfully.",
      });
      
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
        isPremiumTheme 
          ? 'bg-premium-panel/95 border-premium-gold/20' 
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
              isPremiumTheme ? 'bg-premium-bg/60' : 'bg-muted/60'
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
              isPremiumTheme ? 'bg-premium-bg/60' : 'bg-muted/60'
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
              isPremiumTheme 
                ? 'bg-premium-gold text-premium-bg hover:opacity-90 premium-gold-glow' 
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
