import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Loader2, CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLogEvent } from "@/hooks/useLogEvent";
import { sendDiaryWebhook, getAuthUser } from "@/lib/diaryWebhook";
import { format } from "date-fns";

interface AddTradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  isNasrTheme?: boolean;
}

export const AddTradeModal = ({ open, onOpenChange, onSuccess, isNasrTheme }: AddTradeModalProps) => {
  const navigate = useNavigate();
  const { logEvent } = useLogEvent();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openTime, setOpenTime] = useState<Date | undefined>(undefined);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [formData, setFormData] = useState({
    symbol: "",
    side: "long" as "long" | "short",
    status: "planned",
    entry_price: "",
    stop_loss_price: "",
    take_profit_price: "",
    lots_final: "",
    risk_total_usd: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.symbol.trim()) {
      toast.error("Symbol is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const authUser = await getAuthUser();
      
      if (!authUser) {
        toast.error("Please log in to manage your trading diary.");
        navigate("/login");
        return;
      }

      const tradeData = {
        auth_user_id: authUser.auth_user_id,
        email: authUser.user_email,
        broker_key: "nasr_trade_mt5",
        symbol: formData.symbol.toUpperCase(),
        side: formData.side,
        entry_price: formData.entry_price ? parseFloat(formData.entry_price) : null,
        stop_loss_price: formData.stop_loss_price ? parseFloat(formData.stop_loss_price) : null,
        take_profit_price: formData.take_profit_price ? parseFloat(formData.take_profit_price) : null,
        lots_final: formData.lots_final ? parseFloat(formData.lots_final) : null,
        risk_total_usd: formData.risk_total_usd ? parseFloat(formData.risk_total_usd) : null,
        notes: formData.notes || null,
        status: formData.status,
        open_time: openTime ? openTime.toISOString() : null,
      };

      const result = await sendDiaryWebhook("create", tradeData);

      if (!result.success) {
        toast.error("Failed to save trade. Please try again.");
        return;
      }

      toast.success("Saved to diary");
      
      await logEvent("diary_trade_created", {
        symbol: formData.symbol.toUpperCase(),
        side: formData.side,
      });

      onSuccess();
      onOpenChange(false);
      
      setFormData({
        symbol: "",
        side: "long",
        status: "planned",
        entry_price: "",
        stop_loss_price: "",
        take_profit_price: "",
        lots_final: "",
        risk_total_usd: "",
        notes: "",
      });
      setOpenTime(undefined);
      setIsDatePickerOpen(false);
    } catch (error) {
      console.error("Failed to save trade:", error);
      toast.error("Failed to save trade. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "max-w-md",
        isNasrTheme && "bg-nasr-panel border-gold/20"
      )}>
        <DialogHeader>
          <DialogTitle className={cn(isNasrTheme && "text-nasr-text font-playfair")}>
            Add New Trade
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className={cn(isNasrTheme && "text-nasr-text-muted")}>Symbol *</Label>
              <Input
                placeholder="e.g., EURUSD"
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                className={cn(isNasrTheme && "bg-nasr-bg/60 border-gold/20")}
              />
            </div>
            <div className="space-y-2">
              <Label className={cn(isNasrTheme && "text-nasr-text-muted")}>Side</Label>
              <Select value={formData.side} onValueChange={(v) => setFormData({ ...formData, side: v as "long" | "short" })}>
                <SelectTrigger className={cn(isNasrTheme && "bg-nasr-bg/60 border-gold/20")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={cn(isNasrTheme && "bg-nasr-panel border-gold/20")}>
                  <SelectItem value="long">Long</SelectItem>
                  <SelectItem value="short">Short</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className={cn(isNasrTheme && "text-nasr-text-muted")}>Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                <SelectTrigger className={cn(isNasrTheme && "bg-nasr-bg/60 border-gold/20")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={cn(isNasrTheme && "bg-nasr-panel border-gold/20")}>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className={cn(isNasrTheme && "text-nasr-text-muted")}>Date</Label>
              <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      isNasrTheme && "bg-nasr-bg/60 border-gold/20",
                      !openTime && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {openTime ? format(openTime, "PPP") : <span>Pick date</span>}
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
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label className={cn(isNasrTheme && "text-nasr-text-muted")}>Entry</Label>
              <Input
                type="number"
                step="any"
                placeholder="0.00"
                value={formData.entry_price}
                onChange={(e) => setFormData({ ...formData, entry_price: e.target.value })}
                className={cn(isNasrTheme && "bg-nasr-bg/60 border-gold/20")}
              />
            </div>
            <div className="space-y-2">
              <Label className={cn(isNasrTheme && "text-nasr-text-muted")}>Stop Loss</Label>
              <Input
                type="number"
                step="any"
                placeholder="0.00"
                value={formData.stop_loss_price}
                onChange={(e) => setFormData({ ...formData, stop_loss_price: e.target.value })}
                className={cn(isNasrTheme && "bg-nasr-bg/60 border-gold/20")}
              />
            </div>
            <div className="space-y-2">
              <Label className={cn(isNasrTheme && "text-nasr-text-muted")}>Take Profit</Label>
              <Input
                type="number"
                step="any"
                placeholder="0.00"
                value={formData.take_profit_price}
                onChange={(e) => setFormData({ ...formData, take_profit_price: e.target.value })}
                className={cn(isNasrTheme && "bg-nasr-bg/60 border-gold/20")}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className={cn(isNasrTheme && "text-nasr-text-muted")}>Lots</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.lots_final}
                onChange={(e) => setFormData({ ...formData, lots_final: e.target.value })}
                className={cn(isNasrTheme && "bg-nasr-bg/60 border-gold/20")}
              />
            </div>
            <div className="space-y-2">
              <Label className={cn(isNasrTheme && "text-nasr-text-muted")}>Risk ($)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.risk_total_usd}
                onChange={(e) => setFormData({ ...formData, risk_total_usd: e.target.value })}
                className={cn(isNasrTheme && "bg-nasr-bg/60 border-gold/20")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className={cn(isNasrTheme && "text-nasr-text-muted")}>Notes</Label>
            <Textarea
              placeholder="Trade notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className={cn(isNasrTheme && "bg-nasr-bg/60 border-gold/20")}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className={cn("flex-1", isNasrTheme && "border-gold/20")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "flex-1",
                isNasrTheme 
                  ? "gold-gradient text-nasr-bg hover:opacity-90" 
                  : "success-gradient text-white hover:opacity-90"
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Trade"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
