import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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
  };
  isNasrTheme: boolean;
}

export const SaveToDiaryModal = ({
  open,
  onOpenChange,
  calcResult,
  formData,
  isNasrTheme,
}: SaveToDiaryModalProps) => {
  const { toast } = useToast();
  const [status, setStatus] = useState<"planned" | "open">("planned");
  const [openTime, setOpenTime] = useState("");
  const [notes, setNotes] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setIsSubmitting(true);

    // Get user_id from localStorage
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

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const payload = {
      action: "save_trade",
      user_id: userId || "unknown",
      status,
      open_time: openTime || null,
      notes: notes || null,
      tags,
      calc: {
        ...calcResult,
        symbol: formData.symbol.toUpperCase(),
        side: formData.side,
        entry_price: parseFloat(formData.entryPrice) || null,
        stop_loss_price: parseFloat(formData.stopLossPrice) || null,
        take_profit_price: formData.takeProfitPrice ? parseFloat(formData.takeProfitPrice) : null,
        account_balance: formData.accountBalance ? parseFloat(formData.accountBalance) : null,
        risk_type: formData.riskType,
        risk_value: parseFloat(formData.riskValue) || null,
      },
    };

    try {
      const response = await fetch(
        "https://clientee.app.n8n.cloud/webhook/95c61f3e-fb17-4049-9801-62c89402d43b",
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "x-diary-secret": "DIARY_9fA3kP2xQ7mVZ81sLwT0R"
          },
          body: JSON.stringify(payload),
        }
      );

      // Check if request was successful (2xx status)
      if (response.ok) {
        // Try to parse JSON response, but don't fail if empty
        let data = null;
        const text = await response.text();
        if (text) {
          try {
            data = JSON.parse(text);
          } catch (e) {
            // Response is not JSON, but that's okay if status is 200
          }
        }

        // Check if the parsed data contains an error
        if (data?.error) {
          toast({
            title: "Error",
            description: data.error,
            variant: "destructive",
          });
        } else {
          // Send trade data to secondary webhook
          try {
            await fetch(
              "https://clientee.app.n8n.cloud/webhook-test/03362423-8c6c-4c11-bd42-1c56a074a88d",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              }
            );
          } catch (e) {
            console.error('Failed to send trade data to secondary webhook:', e);
          }

          toast({
            title: "Saved to Diary",
            description: "Your trade has been saved successfully.",
          });
          // Clear form and close modal
          setStatus("planned");
          setOpenTime("");
          setNotes("");
          setTagsInput("");
          onOpenChange(false);
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to save trade. Server returned an error.",
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
              placeholder="Add any notes about this trade..."
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
