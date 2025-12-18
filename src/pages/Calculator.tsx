import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Calculator as CalcIcon, AlertTriangle, Loader2, TrendingUp, TrendingDown, DollarSign, Target, Info, X, Save, BookOpen, BarChart3, Activity, FileText } from "lucide-react";
import { useClient } from "@/lib/clientContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { SaveToDiaryModal } from "@/components/SaveToDiaryModal";
import { supabase } from "@/integrations/supabase/client";
import { useLogEvent } from "@/hooks/useLogEvent";

interface CalculationResult {
  lots_final: number;
  risk_total_usd: number;
  ticks_to_sl: number;
  risk_per_1lot_usd: number;
  lots_calculated: number;
  tick_value_position_usd?: number;
  pip_value_position_usd?: number;
  symbol?: string;
  warnings?: string[];
  error?: string;
}

interface FormErrors {
  symbol?: string;
  entry_price?: string;
  stop_loss_price?: string;
  take_profit_price?: string;
  account_balance?: string;
  risk_value?: string;
  lots_requested?: string;
  general?: string;
}

// Tick vs Pip Info Content Component
const TickPipInfoContent = () => (
  <div className="space-y-4">
    <div className="space-y-3">
      <div>
        <h4 className="font-semibold text-sm text-white">Tick</h4>
        <p className="text-sm mt-1 text-slate-400">
          A tick is the smallest price step for the instrument (from broker specs).
          "1 Tick Movement" shows how much your P/L changes when price moves by 1 tick, for your current lot size.
        </p>
      </div>
      <div>
        <h4 className="font-semibold text-sm text-white">Pip</h4>
        <p className="text-sm mt-1 text-slate-400">
          A pip is a standard Forex unit. For most pairs: 1 pip = 0.0001.
          On 5-digit pricing, 1 pip = 10 ticks.
          "1 Pip Movement" shows how much your P/L changes when price moves by 1 pip, for your current lot size.
        </p>
      </div>
    </div>

    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="learn-more" className="border-none">
        <AccordionTrigger className="text-sm py-2 hover:no-underline text-yellow-400">
          Learn more
        </AccordionTrigger>
        <AccordionContent className="text-sm text-slate-400">
          On instruments with 5-digit pricing (like EURUSD at 1.08525), the last digit represents a "point" or "pipette". 
          In this case, 1 pip = 10 ticks. For indices and commodities, the relationship between pips and ticks varies by instrument. 
          The calculator uses broker-specific tick values to ensure accurate calculations.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
);

// Info Tooltip Component (Popover on desktop, Drawer on mobile)
const InfoTooltip = () => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const triggerButton = (
    <button className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 bg-slate-800/60 border border-slate-700 hover:border-yellow-500/50 hover:shadow-[0_0_8px_rgba(234,179,8,0.3)]">
      <Info className="w-3.5 h-3.5 text-yellow-500/70" />
    </button>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <button onClick={() => setOpen(true)}>{triggerButton}</button>
        <DrawerContent className="bg-slate-900 border-slate-700">
          <DrawerHeader className="relative">
            <DrawerTitle className="text-lg font-semibold text-white">
              Tick vs Pip
            </DrawerTitle>
            <DrawerClose asChild>
              <button className="absolute right-4 top-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-slate-800 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </DrawerClose>
          </DrawerHeader>
          <div className="px-4 pb-6">
            <TickPipInfoContent />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
      <PopoverContent className="w-80 p-0 backdrop-blur-xl bg-slate-900/95 border-slate-700" align="end">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Tick vs Pip</h3>
            <button 
              onClick={() => setOpen(false)}
              className="w-6 h-6 rounded-full flex items-center justify-center transition-colors hover:bg-slate-800 text-slate-400"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <TickPipInfoContent />
        </div>
      </PopoverContent>
    </Popover>
  );
};

const Calculator = () => {
  const navigate = useNavigate();
  const { client } = useClient();
  const isMobile = useIsMobile();
  const { logEvent } = useLogEvent();

  // Theme detection
  const isNasrTheme = client?.subdomain === 'nasr';

  // Form state
  const [symbol, setSymbol] = useState("");
  const [side, setSide] = useState<"long" | "short">("long");
  const [entryPrice, setEntryPrice] = useState("");
  const [stopLossPrice, setStopLossPrice] = useState("");
  const [takeProfitPrice, setTakeProfitPrice] = useState("");
  const [accountBalance, setAccountBalance] = useState("");
  const [riskType, setRiskType] = useState<"percent" | "amount">("percent");
  const [riskValue, setRiskValue] = useState("");
  const [lotsOverrideEnabled, setLotsOverrideEnabled] = useState(false);
  const [lotsRequested, setLotsRequested] = useState("");
  const [notes, setNotes] = useState("");
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saveDiaryOpen, setSaveDiaryOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
    };
    checkAuth();
  }, [navigate]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!symbol.trim()) {
      newErrors.symbol = "Symbol is required";
    }

    const entry = parseFloat(entryPrice);
    const sl = parseFloat(stopLossPrice);

    if (!entryPrice || isNaN(entry)) {
      newErrors.entry_price = "Valid entry price is required";
    }

    if (!stopLossPrice || isNaN(sl)) {
      newErrors.stop_loss_price = "Valid stop loss price is required";
    }

    if (entry && sl && entry === sl) {
      newErrors.stop_loss_price = "Stop loss must differ from entry price";
    }

    // Side-aware validation for SL and TP
    const tp = parseFloat(takeProfitPrice);
    
    if (side === "long") {
      if (entry && sl && !isNaN(entry) && !isNaN(sl) && sl >= entry) {
        newErrors.stop_loss_price = "Stop loss must be below entry for long positions";
      }
      if (entry && tp && !isNaN(entry) && !isNaN(tp) && tp <= entry) {
        newErrors.take_profit_price = "Take profit must be above entry for long positions";
      }
    } else if (side === "short") {
      if (entry && sl && !isNaN(entry) && !isNaN(sl) && sl <= entry) {
        newErrors.stop_loss_price = "Stop loss must be above entry for short positions";
      }
      if (entry && tp && !isNaN(entry) && !isNaN(tp) && tp >= entry) {
        newErrors.take_profit_price = "Take profit must be below entry for short positions";
      }
    }

    const balance = parseFloat(accountBalance);
    if (riskType === "percent" && (!accountBalance || isNaN(balance) || balance <= 0)) {
      newErrors.account_balance = "Account balance must be greater than 0";
    }

    const risk = parseFloat(riskValue);
    if (!riskValue || isNaN(risk) || risk <= 0) {
      newErrors.risk_value = "Risk value must be greater than 0";
    }

    if (lotsOverrideEnabled) {
      const lots = parseFloat(lotsRequested);
      if (!lotsRequested || isNaN(lots) || lots <= 0) {
        newErrors.lots_requested = "Lots must be greater than 0";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setResult(null);
    setErrors({});

    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || "unknown";

    const payload = {
      calculator_type: "position_size",
      user_id: userId || "unknown",
      broker_key: "nasr_trade_mt5",
      account_currency: "USD",
      symbol: symbol.toUpperCase().trim(),
      side: side,
      entry_price: parseFloat(entryPrice),
      stop_loss_price: parseFloat(stopLossPrice),
      take_profit_price: takeProfitPrice ? parseFloat(takeProfitPrice) : null,
      account_balance: accountBalance ? parseFloat(accountBalance) : null,
      risk_type: riskType,
      risk_value: parseFloat(riskValue),
      lots_requested: lotsOverrideEnabled && lotsRequested ? parseFloat(lotsRequested) : null,
      notes: notes.trim() || null,
    };

    try {
      const response = await fetch(
        "https://clientee.app.n8n.cloud/webhook/95c61f3e-fb17-4049-9801-62c89402d43b",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        setErrors({ general: `Server error: ${response.status}. Please try again.` });
        setIsLoading(false);
        return;
      }

      const text = await response.text();
      
      if (!text || text.trim() === '') {
        setErrors({ general: "No response from server. Please try again." });
        setIsLoading(false);
        return;
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error("Failed to parse response:", text);
        setErrors({ general: "Invalid response from server. Please try again." });
        setIsLoading(false);
        return;
      }

      if (data.error) {
        setErrors({ general: data.error });
      } else {
        setResult(data);
        // Log calculator_used event
        await logEvent("calculator_used", {
          symbol: symbol.toUpperCase().trim(),
          side,
          lots_final: data.lots_final,
          risk_total_usd: data.risk_total_usd,
        });
      }
    } catch (error) {
      console.error("Calculator fetch error:", error);
      setErrors({ general: "Network error. Please check your connection and try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const ToggleButton = ({ 
    active, 
    onClick, 
    children 
  }: { 
    active: boolean; 
    onClick: () => void; 
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300",
        active 
          ? "bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 text-slate-900 shadow-lg shadow-yellow-500/30"
          : "bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50"
      )}
    >
      {children}
    </button>
  );

  // Risk color helper
  const getRiskColor = (riskUsd: number, balance: number | null) => {
    if (!balance) return "text-white";
    const riskPercent = (riskUsd / balance) * 100;
    if (riskPercent <= 1) return "text-green-400";
    if (riskPercent <= 2) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <DashboardLayout>
      {/* Premium Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {isNasrTheme ? (
          <>
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute w-full h-full object-cover opacity-30"
            >
              <source src="/nasr-background.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-nasr-bg/70 via-nasr-bg/85 to-nasr-bg" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" />
        )}
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto space-y-8 px-4 md:px-6">
        {/* Header */}
        <div className="text-center space-y-4 pt-4 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-amber-500/10 border border-yellow-500/20 mb-4 animate-pulse">
            <CalcIcon className="w-8 h-8 text-yellow-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 bg-clip-text text-transparent">
            Position Size Calculator
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Calculate optimal lot size based on your risk parameters
          </p>
        </div>

        {/* Trade Parameters Card */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl shadow-blue-500/10 p-6 md:p-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400/20 to-amber-500/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-yellow-400" />
            </div>
            Trade Parameters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Symbol */}
            <div className="space-y-2">
              <Label className="text-slate-400 text-sm font-medium">Symbol *</Label>
              <Input
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="e.g., EURUSD, XAUUSD, US30"
                className={cn(
                  "h-12 bg-slate-800/50 border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all",
                  errors.symbol && "border-red-500"
                )}
              />
              {errors.symbol && (
                <p className="text-sm text-red-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> {errors.symbol}
                </p>
              )}
            </div>

            {/* Side Toggle */}
            <div className="space-y-2">
              <Label className="text-slate-400 text-sm font-medium">Side *</Label>
              <div className="flex gap-2 p-1.5 rounded-xl bg-slate-800/30 border border-slate-700/50">
                <ToggleButton active={side === "long"} onClick={() => setSide("long")}>
                  <span className="flex items-center justify-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Long
                  </span>
                </ToggleButton>
                <ToggleButton active={side === "short"} onClick={() => setSide("short")}>
                  <span className="flex items-center justify-center gap-2">
                    <TrendingDown className="w-4 h-4" /> Short
                  </span>
                </ToggleButton>
              </div>
            </div>

            {/* Entry Price */}
            <div className="space-y-2">
              <Label className="text-slate-400 text-sm font-medium">Entry Price *</Label>
              <div className="relative">
                <Input
                  type="number"
                  step="any"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  placeholder="0.00"
                  className={cn(
                    "h-12 bg-slate-800/50 border-slate-700 rounded-xl text-white font-mono placeholder:text-slate-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all pl-10",
                    errors.entry_price && "border-red-500"
                  )}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
              </div>
              {errors.entry_price && (
                <p className="text-sm text-red-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> {errors.entry_price}
                </p>
              )}
            </div>

            {/* Stop Loss Price */}
            <div className="space-y-2">
              <Label className="text-slate-400 text-sm font-medium">Stop Loss Price *</Label>
              <div className="relative">
                <Input
                  type="number"
                  step="any"
                  value={stopLossPrice}
                  onChange={(e) => setStopLossPrice(e.target.value)}
                  placeholder="0.00"
                  className={cn(
                    "h-12 bg-slate-800/50 border-slate-700 rounded-xl text-white font-mono placeholder:text-slate-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all pl-10",
                    errors.stop_loss_price && "border-red-500"
                  )}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
              </div>
              {errors.stop_loss_price && (
                <p className="text-sm text-red-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> {errors.stop_loss_price}
                </p>
              )}
            </div>

            {/* Take Profit (Optional) */}
            <div className="space-y-2">
              <Label className="text-slate-400 text-sm font-medium">Take Profit Price (Optional)</Label>
              <div className="relative">
                <Input
                  type="number"
                  step="any"
                  value={takeProfitPrice}
                  onChange={(e) => setTakeProfitPrice(e.target.value)}
                  placeholder="0.00"
                  className={cn(
                    "h-12 bg-slate-800/50 border-slate-700 rounded-xl text-white font-mono placeholder:text-slate-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all pl-10",
                    errors.take_profit_price && "border-red-500"
                  )}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
              </div>
              {errors.take_profit_price && (
                <p className="text-sm text-red-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> {errors.take_profit_price}
                </p>
              )}
            </div>

            {/* Account Balance */}
            <div className="space-y-2">
              <Label className="text-slate-400 text-sm font-medium">Account Balance (USD) *</Label>
              <div className="relative">
                <Input
                  type="number"
                  step="any"
                  value={accountBalance}
                  onChange={(e) => setAccountBalance(e.target.value)}
                  placeholder="10000"
                  className={cn(
                    "h-12 bg-slate-800/50 border-slate-700 rounded-xl text-white font-mono placeholder:text-slate-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all pl-10",
                    errors.account_balance && "border-red-500"
                  )}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
              </div>
              {errors.account_balance && (
                <p className="text-sm text-red-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> {errors.account_balance}
                </p>
              )}
            </div>

            {/* Risk Type Toggle */}
            <div className="space-y-2">
              <Label className="text-slate-400 text-sm font-medium">Risk Type *</Label>
              <div className="flex gap-2 p-1.5 rounded-xl bg-slate-800/30 border border-slate-700/50">
                <ToggleButton active={riskType === "percent"} onClick={() => setRiskType("percent")}>
                  Percent %
                </ToggleButton>
                <ToggleButton active={riskType === "amount"} onClick={() => setRiskType("amount")}>
                  Amount $
                </ToggleButton>
              </div>
            </div>

            {/* Risk Value */}
            <div className="space-y-2">
              <Label className="text-slate-400 text-sm font-medium">
                Risk Value ({riskType === "percent" ? "%" : "USD"}) *
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  step="any"
                  value={riskValue}
                  onChange={(e) => setRiskValue(e.target.value)}
                  placeholder={riskType === "percent" ? "1" : "100"}
                  className={cn(
                    "h-12 bg-slate-800/50 border-slate-700 rounded-xl text-white font-mono placeholder:text-slate-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all pl-10",
                    errors.risk_value && "border-red-500"
                  )}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  {riskType === "percent" ? "%" : "$"}
                </span>
              </div>
              {errors.risk_value && (
                <p className="text-sm text-red-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> {errors.risk_value}
                </p>
              )}
              <p className="text-xs text-slate-500">
                {riskType === "percent" 
                  ? "Percentage of account balance to risk" 
                  : "Fixed USD amount to risk"}
              </p>
            </div>
          </div>

          {/* Lots Override Section */}
          <div className="mt-6 p-5 rounded-xl bg-slate-800/30 border border-slate-700/50 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-slate-300 font-medium">Override Lot Size</Label>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manually specify lot size instead of calculated
                </p>
              </div>
              <Switch
                checked={lotsOverrideEnabled}
                onCheckedChange={setLotsOverrideEnabled}
              />
            </div>
            {lotsOverrideEnabled && (
              <div className="space-y-2 animate-fade-in">
                <Input
                  type="number"
                  step="0.01"
                  value={lotsRequested}
                  onChange={(e) => setLotsRequested(e.target.value)}
                  placeholder="0.10"
                  className={cn(
                    "h-12 bg-slate-800/50 border-slate-700 rounded-xl text-white font-mono placeholder:text-slate-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all",
                    errors.lots_requested && "border-red-500"
                  )}
                />
                {errors.lots_requested && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> {errors.lots_requested}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Notes Section */}
          <div className="mt-6 space-y-2">
            <Label className="text-slate-400 text-sm font-medium flex items-center gap-2">
              <FileText className="w-4 h-4" /> Notes (optional)
            </Label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Why this trade? Setup? Emotions?"
              rows={3}
              maxLength={500}
              className="w-full px-4 py-3 rounded-xl text-base resize-none bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none transition-all"
            />
            <p className="text-xs text-slate-500 text-right">{notes.length}/500</p>
          </div>

          {/* Calculate Button */}
          <Button
            onClick={handleCalculate}
            disabled={isLoading}
            className="w-full h-14 mt-6 text-lg font-semibold rounded-xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 text-slate-900 hover:brightness-110 shadow-lg shadow-yellow-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-yellow-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                <CalcIcon className="w-5 h-5 mr-2" />
                Calculate Position Size
              </>
            )}
          </Button>

          {/* General Error */}
          {errors.general && (
            <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 animate-fade-in">
              <p className="text-sm text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> {errors.general}
              </p>
            </div>
          )}
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {/* Primary Results - 2 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recommended Lots Card */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 text-center relative overflow-hidden group hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-500 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-yellow-400/20 to-amber-500/10 border border-yellow-500/20">
                    <Target className="w-8 h-8 text-yellow-400" />
                  </div>
                  <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">
                    Recommended Lots
                  </p>
                  <p className="text-5xl md:text-6xl font-bold font-mono bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(234,179,8,0.5)]">
                    {result.lots_final?.toFixed(2) ?? "—"}
                  </p>
                </div>
              </div>

              {/* Actual Risk Card */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 text-center relative overflow-hidden group hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-500 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-yellow-400/20 to-amber-500/10 border border-yellow-500/20">
                    <DollarSign className="w-8 h-8 text-yellow-400" />
                  </div>
                  <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">
                    Actual Risk
                  </p>
                  <p className={cn(
                    "text-5xl md:text-6xl font-bold font-mono",
                    getRiskColor(result.risk_total_usd, accountBalance ? parseFloat(accountBalance) : null)
                  )}>
                    ${result.risk_total_usd?.toFixed(2) ?? "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Details - 3 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-5 group hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Ticks to Stop Loss</p>
                <p className="text-2xl font-semibold text-white font-mono">
                  {result.ticks_to_sl?.toFixed(2) ?? "—"}
                </p>
              </div>
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-5 group hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Risk per 1 Lot (USD)</p>
                <p className="text-2xl font-semibold text-white font-mono">
                  ${result.risk_per_1lot_usd?.toFixed(2) ?? "—"}
                </p>
              </div>
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-5 group hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Calculated Lots (raw)</p>
                <p className="text-2xl font-semibold text-white font-mono">
                  {result.lots_calculated?.toFixed(4) ?? "—"}
                </p>
              </div>
            </div>

            {/* Position Sensitivity Section */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400/20 to-amber-500/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Position Sensitivity</h3>
                  <p className="text-sm text-slate-500">Understand how price movement affects your P/L</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1 Tick Movement */}
                <div className="p-5 rounded-xl bg-gradient-to-r from-amber-500/10 to-transparent border-l-4 border-amber-500 group hover:from-amber-500/15 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📊</span>
                      <div>
                        <p className="text-sm font-medium text-slate-300">1 Tick Movement</p>
                        <p className="text-xs text-slate-500">↑↓ Per tick change</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <InfoTooltip />
                      <span className="text-2xl font-bold font-mono text-amber-400">
                        {result.tick_value_position_usd !== undefined 
                          ? `$${result.tick_value_position_usd.toFixed(2)}` 
                          : '—'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 1 Pip Movement */}
                <div className="p-5 rounded-xl bg-gradient-to-r from-yellow-500/10 to-transparent border-l-4 border-yellow-400 group hover:from-yellow-500/15 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📈</span>
                      <div>
                        <p className="text-sm font-medium text-slate-300">1 Pip Movement</p>
                        <p className="text-xs text-slate-500">↑↓ Per pip change</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <InfoTooltip />
                      <span className="text-2xl font-bold font-mono bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                        {result.pip_value_position_usd !== undefined 
                          ? `$${result.pip_value_position_usd.toFixed(2)}` 
                          : '—'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Micro-detail footer */}
              <p className="text-xs text-center text-slate-500 pt-4 border-t border-slate-700/50">
                Calculated for <span className="font-mono font-semibold text-slate-400">{result.lots_final?.toFixed(2)}</span> lots on <span className="font-mono font-semibold text-slate-400">{result.symbol || symbol.toUpperCase()}</span>
              </p>
            </div>

            {/* Warnings */}
            {result.warnings && result.warnings.length > 0 && (
              <div className="p-5 rounded-xl bg-yellow-500/10 border border-yellow-500/30 animate-fade-in">
                <h3 className="text-sm font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Warnings
                </h3>
                <ul className="space-y-1.5">
                  {result.warnings.map((warning, index) => (
                    <li key={index} className="text-sm text-yellow-300/80">
                      • {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button
                onClick={() => setSaveDiaryOpen(true)}
                className="flex-1 h-14 text-lg font-semibold rounded-xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 text-slate-900 hover:brightness-110 shadow-lg shadow-yellow-500/30 transition-all duration-300 hover:scale-[1.02]"
              >
                <Save className="w-5 h-5 mr-2" />
                Save to Diary
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/diary')}
                className="flex-1 h-14 text-lg font-semibold rounded-xl border-2 border-yellow-500/50 text-yellow-400 bg-transparent hover:bg-yellow-500/10 hover:border-yellow-500 transition-all duration-300"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                View Diary
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!result && !isLoading && (
          <div className="text-center py-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="w-24 h-24 rounded-3xl mx-auto mb-6 flex items-center justify-center bg-slate-800/50 border border-slate-700/50">
              <CalcIcon className="w-12 h-12 text-slate-600" />
            </div>
            <p className="text-xl font-medium text-slate-400">
              Enter your trade parameters
            </p>
            <p className="text-slate-500 mt-2">
              Results will appear here after calculation
            </p>
          </div>
        )}
      </div>

      <SaveToDiaryModal
        open={saveDiaryOpen}
        onOpenChange={setSaveDiaryOpen}
        calcResult={result}
        formData={{
          symbol,
          side,
          entryPrice,
          stopLossPrice,
          takeProfitPrice,
          accountBalance,
          riskType,
          riskValue,
          lotsRequested: lotsOverrideEnabled ? lotsRequested : undefined,
          notes,
        }}
        isNasrTheme={isNasrTheme}
      />
    </DashboardLayout>
  );
};

export default Calculator;
