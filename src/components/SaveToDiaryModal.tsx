import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Save, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
interface CalculationResult {
  lots_final?: number;
  risk_total_usd?: number;
  ticks_to_sl?: number;
  risk_per_1lot_usd?: number;
  lots_calculated?: number;
  tick_value_position_usd?: number;
  pip_value_position_usd?: number;
  profit_total_usd?: number;
  rr_ratio?: number;
  symbol?: string;
  warnings?: string[];
  error?: string;
}

interface SaveToDiaryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  calcResult: CalculationResult | null;
  formData: {
    symbol: string;
    side: "long" | "short";
    entryPrice: string;
    stopLossPrice: string;
    takeProfitPrice: string;
    accountBalance: string;
    riskType: "percent" | "amount";
    riskValue: string;
    lotsRequested?: string;
    notes?: string;
  };
  isNasrTheme: boolean;
}

const DIARY_WEBHOOK_URL = "https://clientee.app.n8n.cloud/webhook-test/03362423-8c6c-4c11-bd42-1c56a074a88d";

export const SaveToDiaryModal = ({
  open,
  onOpenChange,
  calcResult,
  formData,
  isNasrTheme,
}: SaveToDiaryModalProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"planned" | "open">("planned");
  const [openTime, setOpenTime] = useState("");
  const [notes, setNotes] = useState(formData.notes || "");
  const [tagsInput, setTagsInput] = useState("");
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
    if (!calcResult) return;

    // Check if user is logged in
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to save trades to your diary.",
        variant: "destructive",
      });
      onOpenChange(false);
      navigate("/login");
      return;
    }

    setIsSubmitting(true);

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    // Payload structure with Supabase auth user
    const payload = {
      action: "create",
      auth_user_id: user.id,
      email: user.email,
      broker_key: "nasr_trade_mt5",
      symbol: formData.symbol.toUpperCase(),
      side: formData.side,
      account_currency: "USD",
      account_balance: formData.accountBalance ? parseFloat(formData.accountBalance) : null,
      risk_type: formData.riskType,
      risk_value: parseFloat(formData.riskValue) || null,
      entry_price: parseFloat(formData.entryPrice) || null,
      stop_loss_price: parseFloat(formData.stopLossPrice) || null,
      take_profit_price: formData.takeProfitPrice ? parseFloat(formData.takeProfitPrice) : null,
      lots_requested: formData.lotsRequested ? parseFloat(formData.lotsRequested) : null,
      lots_final: calcResult.lots_final,
      risk_total_usd: calcResult.risk_total_usd,
      profit_total_usd: calcResult.profit_total_usd,
      rr_ratio: calcResult.rr_ratio,
      tick_value_position_usd: calcResult.tick_value_position_usd,
      pip_value_position_usd: calcResult.pip_value_position_usd,
      notes: notes || formData.notes || null,
      status,
      open_time: openTime || null,
      tags,
    };

    try {
      const response = await fetch(DIARY_WEBHOOK_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-diary-secret": "DIARY_9fA3kP2xQ7mVZ81sLwT0R"
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast({
          title: "Saved to Trading Diary ✅",
          description: "Your trade has been saved successfully.",
        });
        setShowSuccess(true);
      } else {
        toast({
          title: "Error",
          description: "Failed to save trade. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Save trade error:', error);
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
    setStatus("planned");
    setOpenTime("");
    setNotes(formData.notes || "");
    setTagsInput("");
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
              Trade Saved!
            </h3>
            <p className={cn("text-sm", themeColors.subtext)}>
              Your trade has been added to your Trading Diary.
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
            Save to Trading Diary
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
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
                  "flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200",
                  status === "planned" 
                    ? themeColors.toggleActive 
                    : themeColors.toggleInactive + " hover:opacity-80"
                )}
              >
                Planned
              </button>
              <button
                type="button"
                onClick={() => setStatus("open")}
                className={cn(
                  "flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200",
                  status === "open" 
                    ? themeColors.toggleActive 
                    : themeColors.toggleInactive + " hover:opacity-80"
                )}
              >
                Open
              </button>
            </div>
          </div>

          {/* Open Time */}
          <div className="space-y-2">
            <Label className={themeColors.subtext}>Open Time (optional)</Label>
            <Input
              type="datetime-local"
              value={openTime}
              onChange={(e) => setOpenTime(e.target.value)}
              className={cn(
                "h-11",
                themeColors.inputBg,
                themeColors.inputBorder
              )}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className={themeColors.subtext}>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Why this trade? Setup? Emotions?"
              className={cn(
                "min-h-[100px] resize-none",
                themeColors.inputBg,
                themeColors.inputBorder
              )}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className={themeColors.subtext}>Tags (comma separated)</Label>
            <Input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g., scalp, breakout, trend"
              className={cn(
                "h-11",
                themeColors.inputBg,
                themeColors.inputBorder
              )}
            />
            {tagsInput && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tagsInput.split(',').map((tag, i) => {
                  const trimmed = tag.trim();
                  if (!trimmed) return null;
                  return (
                    <span
                      key={i}
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        isNasrTheme 
                          ? 'bg-gold/20 text-gold' 
                          : 'bg-aqua/20 text-aqua'
                      )}
                    >
                      {trimmed}
                    </span>
                  );
                })}
              </div>
            )}
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
