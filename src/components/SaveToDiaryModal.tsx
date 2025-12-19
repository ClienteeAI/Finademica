import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Save, BookOpen, CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { useLogEvent } from "@/hooks/useLogEvent";
import { sendDiaryWebhook, getAuthUser } from "@/lib/diaryWebhook";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

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

export const SaveToDiaryModal = ({
  open,
  onOpenChange,
  calcResult,
  formData,
  isNasrTheme,
}: SaveToDiaryModalProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { logEvent } = useLogEvent();
  const [status, setStatus] = useState<"planned" | "open">("planned");
  const [openTime, setOpenTime] = useState<Date | undefined>(undefined);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [notes, setNotes] = useState(formData.notes || "");
  const [tagsInput, setTagsInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setNotes(formData.notes || "");
  }, [formData.notes]);

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

      const tags = tagsInput
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      const tradeData = {
        auth_user_id: authUser.auth_user_id,
        email: authUser.user_email,
        broker_key: "nasr_trade_mt5",
        symbol: formData.symbol.toUpperCase(),
        side: formData.side,
        entry_price: parseFloat(formData.entryPrice) || null,
        stop_loss_price: parseFloat(formData.stopLossPrice) || null,
        take_profit_price: formData.takeProfitPrice ? parseFloat(formData.takeProfitPrice) : null,
        lots_final: calcResult.lots_final || null,
        risk_total_usd: calcResult.risk_total_usd || null,
        profit_total_usd: calcResult.profit_total_usd || null,
        rr_ratio: calcResult.rr_ratio || null,
        tick_value_position_usd: calcResult.tick_value_position_usd || null,
        pip_value_position_usd: calcResult.pip_value_position_usd || null,
        notes: notes || formData.notes || null,
        status,
        open_time: openTime ? openTime.toISOString() : null,
        tags: tags.length > 0 ? tags : null,
      };

      const result = await sendDiaryWebhook("create", tradeData);

      if (!result.success) {
        toast({
          title: "Error",
          description: "Failed to save trade. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Saved to diary",
        description: "Your trade has been saved successfully.",
      });
      
      await logEvent("diary_trade_created", {
        symbol: formData.symbol.toUpperCase(),
        side: formData.side,
        rr_ratio: calcResult?.rr_ratio,
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
    setStatus("planned");
    setOpenTime(undefined);
    setIsDatePickerOpen(false);
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
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-11 justify-start text-left font-normal",
                    themeColors.inputBg,
                    themeColors.inputBorder,
                    !openTime && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {openTime ? format(openTime, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={openTime}
                  onSelect={(date) => {
                    setOpenTime(date);
                    setIsDatePickerOpen(false);
                  }}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
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
