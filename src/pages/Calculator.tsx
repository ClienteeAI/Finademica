import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Calculator as CalcIcon, AlertTriangle, Loader2, TrendingUp, TrendingDown, DollarSign, Target, Info, X, Save, BookOpen, BarChart3, Activity, FileText, Sparkles } from "lucide-react";
import { useClient } from "@/lib/clientContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { SaveToDiaryModal } from "@/components/SaveToDiaryModal";

import { supabase } from "@/integrations/supabase/client";
import { useLogEvent } from "@/hooks/useLogEvent";
import { sendCalculatorUsedEvent } from "@/lib/crmWebhook";

interface CalculationResult {
  lots_final: number;
  recommended_lots?: number;
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
        <h4 className="font-semibold text-sm text-foreground">Tick</h4>
        <p className="text-sm mt-1 text-muted-foreground">
          A tick is the smallest price step for the instrument (from broker specs).
          "1 Tick Movement" shows how much your P/L changes when price moves by 1 tick, for your current lot size.
        </p>
      </div>
      <div>
        <h4 className="font-semibold text-sm text-foreground">Pip</h4>
        <p className="text-sm mt-1 text-muted-foreground">
          A pip is a standard Forex unit. For most pairs: 1 pip = 0.0001.
          On 5-digit pricing, 1 pip = 10 ticks.
          "1 Pip Movement" shows how much your P/L changes when price moves by 1 pip, for your current lot size.
        </p>
      </div>
    </div>

    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="learn-more" className="border-none">
        <AccordionTrigger className="text-sm py-2 hover:no-underline text-primary">
          Learn more
        </AccordionTrigger>
        <AccordionContent className="text-sm text-muted-foreground">
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
    <button className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 bg-muted border border-border hover:border-primary/50 hover:shadow-[0_0_8px] hover:shadow-primary/30">
      <Info className="w-3.5 h-3.5 text-primary/70" />
    </button>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <button onClick={() => setOpen(true)}>{triggerButton}</button>
        <DrawerContent className="bg-card border-border">
          <DrawerHeader className="relative">
            <DrawerTitle className="text-lg font-semibold text-foreground">
              Tick vs Pip
            </DrawerTitle>
            <DrawerClose asChild>
              <button className="absolute right-4 top-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-muted text-muted-foreground">
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
      <PopoverContent className="w-80 p-0 backdrop-blur-xl bg-card/95 border-border" align="end">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Tick vs Pip</h3>
            <button 
              onClick={() => setOpen(false)}
              className="w-6 h-6 rounded-full flex items-center justify-center transition-colors hover:bg-muted text-muted-foreground"
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

      let data: unknown;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error("Failed to parse response:", text);
        setErrors({ general: "Invalid response from server. Please try again." });
        setIsLoading(false);
        return;
      }

      const unwrapN8n = (value: unknown): unknown => {
        let v = value;
        if (Array.isArray(v)) v = v[0];
        if (v && typeof v === "object" && "json" in v) {
          const maybeJson = (v as any).json;
          if (maybeJson && typeof maybeJson === "object") v = maybeJson;
        }
        return v;
      };

      const coerceNumber = (v: unknown): number | null | undefined => {
        if (v == null) return v as null | undefined;
        if (typeof v === "number") return Number.isFinite(v) ? v : null;
        if (typeof v === "string") {
          const n = Number(v);
          return Number.isFinite(n) ? n : null;
        }
        return null;
      };

      const normalized = unwrapN8n(data);

      if (!normalized || typeof normalized !== "object") {
        console.error("Unexpected webhook response shape:", data);
        setErrors({ general: "Unexpected response from server. Please try again." });
        return;
      }

      const n = normalized as any;
      const resultData = {
        ...n,
        recommended_lots: coerceNumber(n.recommended_lots),
        lots_calculated: coerceNumber(n.lots_calculated),
        tick_value_position_usd: coerceNumber(n.tick_value_position_usd),
        pip_value_position_usd: coerceNumber(n.pip_value_position_usd),
      } as CalculationResult;

      console.log("Calculator webhook normalized:", resultData);

      if (resultData.error) {
        setErrors({ general: resultData.error });
      } else {
        setResult(resultData);
        // Log calculator_used event with unique ref_id to allow multiple calculations
        await logEvent("calculator_used", {
          ref_id: `calc_${Date.now()}`,
          symbol: symbol.toUpperCase().trim(),
          side,
          lots_final: resultData.lots_final,
          risk_total_usd: resultData.risk_total_usd,
        });
        
        // Send CRM webhook for calculator usage
        sendCalculatorUsedEvent(
          {
            broker_key: "nasr_trade_mt5",
            symbol: symbol.toUpperCase().trim(),
            side,
            entry_price: parseFloat(entryPrice) || null,
            stop_loss_price: parseFloat(stopLossPrice) || null,
            take_profit_price: takeProfitPrice ? parseFloat(takeProfitPrice) : null,
            risk_total_usd: resultData.risk_total_usd,
            lots_final: resultData.lots_final,
          },
          {
            recommended_lots: resultData.recommended_lots,
            actual_risk_usd: resultData.risk_total_usd,
            ticks_to_stop_loss: resultData.ticks_to_sl,
            risk_per_1_lot_usd: resultData.risk_per_1lot_usd,
            calculated_lots_raw: resultData.lots_calculated,
            rr_ratio: null,
            pip_value_position_usd: resultData.pip_value_position_usd,
            tick_value_position_usd: resultData.tick_value_position_usd,
          },
          `calc_${Date.now()}`
        ).catch(console.error);
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
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
          : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
      )}
    >
      {children}
    </button>
  );

  // Risk color helper
  const getRiskColor = (riskUsd: number, balance: number | null) => {
    if (!balance) return "text-foreground";
    const riskPercent = (riskUsd / balance) * 100;
    if (riskPercent <= 1) return "text-green-500";
    if (riskPercent <= 2) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <SidebarLayout>
      {/* Background - uses semantic bg-background */}
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
            <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />
          </>
        ) : (
          <div className="absolute inset-0 bg-background" />
        )}
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto space-y-8 px-4 md:px-6">
        {/* Header */}
        <div className="text-center space-y-4 pt-4 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
            <CalcIcon className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
            Position Size Calculator
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Calculate optimal lot size based on your risk parameters
          </p>
        </div>

        {/* Explanation Section */}
        <div className="backdrop-blur-xl bg-primary/5 border border-primary/20 rounded-2xl p-6 animate-fade-in" style={{ animationDelay: '0.05s' }}>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Info className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-4">
              <p className="text-foreground/80 leading-relaxed">
                This tool tells you how big your trade should be so you don't risk too much money.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-primary uppercase tracking-wider">You enter:</h4>
                  <ul className="text-muted-foreground text-sm space-y-1.5">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                      How much money you have
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                      How much you are willing to lose on one trade
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                      Entry price and stop loss
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-primary uppercase tracking-wider">The calculator then:</h4>
                  <ul className="text-muted-foreground text-sm space-y-1.5">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500/60" />
                      Calculates the correct lot size
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500/60" />
                      Shows you exact risk in money
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500/60" />
                      Helps you protect your account
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="pt-2 border-t border-border/50">
                <p className="text-sm text-muted-foreground italic">
                  <span className="text-primary font-medium not-italic">Why it matters:</span> Good traders don't guess position size. They control risk first — profit comes after.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trade Parameters Card */}
        <div className="backdrop-blur-xl bg-card/80 border border-border rounded-2xl shadow-xl p-6 md:p-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            Trade Parameters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Symbol */}
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm font-medium">Symbol *</Label>
              <Input
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="e.g., EURUSD, XAUUSD, US30"
                className={cn(
                  "h-12 bg-muted/50 border-border rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all",
                  errors.symbol && "border-destructive"
                )}
              />
              {errors.symbol && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> {errors.symbol}
                </p>
              )}
            </div>

            {/* Side Toggle */}
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm font-medium">Side *</Label>
              <div className="flex gap-2 p-1.5 rounded-xl bg-muted/30 border border-border/50">
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
              <Label className="text-muted-foreground text-sm font-medium">Entry Price *</Label>
              <div className="relative">
                <Input
                  type="number"
                  step="any"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  placeholder="0.00"
                  className={cn(
                    "h-12 bg-muted/50 border-border rounded-xl text-foreground font-mono placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all pl-10",
                    errors.entry_price && "border-destructive"
                  )}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              </div>
              {errors.entry_price && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> {errors.entry_price}
                </p>
              )}
            </div>

            {/* Stop Loss Price */}
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm font-medium">Stop Loss Price *</Label>
              <div className="relative">
                <Input
                  type="number"
                  step="any"
                  value={stopLossPrice}
                  onChange={(e) => setStopLossPrice(e.target.value)}
                  placeholder="0.00"
                  className={cn(
                    "h-12 bg-muted/50 border-border rounded-xl text-foreground font-mono placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all pl-10",
                    errors.stop_loss_price && "border-destructive"
                  )}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              </div>
              {errors.stop_loss_price && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> {errors.stop_loss_price}
                </p>
              )}
            </div>

            {/* Take Profit (Optional) */}
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm font-medium">Take Profit Price (Optional)</Label>
              <div className="relative">
                <Input
                  type="number"
                  step="any"
                  value={takeProfitPrice}
                  onChange={(e) => setTakeProfitPrice(e.target.value)}
                  placeholder="0.00"
                  className={cn(
                    "h-12 bg-muted/50 border-border rounded-xl text-foreground font-mono placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all pl-10",
                    errors.take_profit_price && "border-destructive"
                  )}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              </div>
              {errors.take_profit_price && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> {errors.take_profit_price}
                </p>
              )}
            </div>

            {/* Account Balance */}
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm font-medium">Account Balance (USD) *</Label>
              <div className="relative">
                <Input
                  type="number"
                  step="any"
                  value={accountBalance}
                  onChange={(e) => setAccountBalance(e.target.value)}
                  placeholder="10000"
                  className={cn(
                    "h-12 bg-muted/50 border-border rounded-xl text-foreground font-mono placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all pl-10",
                    errors.account_balance && "border-destructive"
                  )}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              </div>
              {errors.account_balance && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> {errors.account_balance}
                </p>
              )}
            </div>

            {/* Risk Type Toggle */}
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm font-medium">Risk Type *</Label>
              <div className="flex gap-2 p-1.5 rounded-xl bg-muted/30 border border-border/50">
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
              <Label className="text-muted-foreground text-sm font-medium">
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
                    "h-12 bg-muted/50 border-border rounded-xl text-foreground font-mono placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all pl-10",
                    errors.risk_value && "border-destructive"
                  )}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {riskType === "percent" ? "%" : "$"}
                </span>
              </div>
              {errors.risk_value && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> {errors.risk_value}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {riskType === "percent" 
                  ? "Percentage of account balance to risk" 
                  : "Fixed USD amount to risk"}
              </p>
            </div>
          </div>

          {/* Lots Override Section */}
          <div className="mt-6 p-5 rounded-xl bg-muted/30 border border-border/50 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-foreground/80 font-medium">Override Lot Size</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
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
                    "h-12 bg-muted/50 border-border rounded-xl text-foreground font-mono placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all",
                    errors.lots_requested && "border-destructive"
                  )}
                />
                {errors.lots_requested && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> {errors.lots_requested}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Notes Section */}
          <div className="mt-6 space-y-2">
            <Label className="text-muted-foreground text-sm font-medium flex items-center gap-2">
              <FileText className="w-4 h-4" /> Notes (optional)
            </Label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Why this trade? Setup? Emotions?"
              rows={3}
              maxLength={500}
              className="w-full px-4 py-3 rounded-xl text-base resize-none bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
            />
            <p className="text-xs text-muted-foreground text-right">{notes.length}/500</p>
          </div>

          {/* Calculate Button */}
          <Button
            onClick={handleCalculate}
            disabled={isLoading}
            className="w-full h-14 mt-6 text-lg font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
            <div className="mt-4 p-4 rounded-xl bg-destructive/10 border border-destructive/30 animate-fade-in">
              <p className="text-sm text-destructive flex items-center gap-2">
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
              <div className="backdrop-blur-xl bg-card/80 border border-border rounded-2xl p-6 md:p-8 text-center relative overflow-hidden group hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-primary/10 border border-primary/20">
                    <Target className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                    Recommended Lots
                  </p>
                  <p className="text-5xl md:text-6xl font-bold font-mono text-primary drop-shadow-[0_0_20px] drop-shadow-primary/50">
                    {(result.recommended_lots ?? result.lots_calculated)?.toFixed(2) ?? "—"}
                  </p>
                </div>
              </div>

              {/* Actual Risk Card */}
              <div className="backdrop-blur-xl bg-card/80 border border-border rounded-2xl p-6 md:p-8 text-center relative overflow-hidden group hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-primary/10 border border-primary/20">
                    <DollarSign className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
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
              <div className="backdrop-blur-xl bg-card/80 border border-border rounded-xl p-5 group hover:bg-card hover:-translate-y-1 transition-all duration-300">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Ticks to Stop Loss</p>
                <p className="text-2xl font-semibold text-foreground font-mono">
                  {result.ticks_to_sl?.toFixed(2) ?? "—"}
                </p>
              </div>
              <div className="backdrop-blur-xl bg-card/80 border border-border rounded-xl p-5 group hover:bg-card hover:-translate-y-1 transition-all duration-300">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Risk per 1 Lot (USD)</p>
                <p className="text-2xl font-semibold text-foreground font-mono">
                  ${result.risk_per_1lot_usd?.toFixed(2) ?? "—"}
                </p>
              </div>
              <div className="backdrop-blur-xl bg-card/80 border border-border rounded-xl p-5 group hover:bg-card hover:-translate-y-1 transition-all duration-300">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Calculated Lots (raw)</p>
                <p className="text-2xl font-semibold text-foreground font-mono">
                  {result.lots_calculated?.toFixed(4) ?? "—"}
                </p>
              </div>
            </div>

            {/* Position Sensitivity Section */}
            <div className="backdrop-blur-xl bg-card/80 border border-border rounded-2xl p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Position Sensitivity</h3>
                  <p className="text-sm text-muted-foreground">Understand how price movement affects your P/L</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1 Tick Movement */}
                <div className="p-5 rounded-xl bg-primary/5 border-l-4 border-primary group hover:bg-primary/10 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📊</span>
                      <div>
                        <p className="text-sm font-medium text-foreground/80">1 Tick Movement</p>
                        <p className="text-xs text-muted-foreground">↑↓ Per tick change</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <InfoTooltip />
                      <span className="text-2xl font-bold font-mono text-primary">
                        {result.tick_value_position_usd != null 
                          ? `$${result.tick_value_position_usd.toFixed(2)}` 
                          : '—'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 1 Pip Movement */}
                <div className="p-5 rounded-xl bg-primary/5 border-l-4 border-primary group hover:bg-primary/10 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📈</span>
                      <div>
                        <p className="text-sm font-medium text-foreground/80">1 Pip Movement</p>
                        <p className="text-xs text-muted-foreground">↑↓ Per pip change</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <InfoTooltip />
                      <span className="text-2xl font-bold font-mono text-primary">
                        {result.pip_value_position_usd != null 
                          ? `$${result.pip_value_position_usd.toFixed(2)}` 
                          : '—'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Micro-detail footer */}
              <p className="text-xs text-center text-muted-foreground pt-4 border-t border-border/50">
                Calculated for <span className="font-mono font-semibold text-foreground/80">{result.lots_final?.toFixed(2)}</span> lots on <span className="font-mono font-semibold text-foreground/80">{result.symbol || symbol.toUpperCase()}</span>
              </p>
            </div>

            {/* Warnings */}
            {result.warnings && result.warnings.length > 0 && (
              <div className="p-5 rounded-xl bg-yellow-500/10 border border-yellow-500/30 animate-fade-in">
                <h3 className="text-sm font-semibold text-yellow-600 dark:text-yellow-400 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Warnings
                </h3>
                <ul className="space-y-1.5">
                  {result.warnings.map((warning, index) => (
                    <li key={index} className="text-sm text-yellow-600/80 dark:text-yellow-300/80">
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
                className="flex-1 h-14 text-lg font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-[1.02]"
              >
                <Save className="w-5 h-5 mr-2" />
                Save to Diary
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/diary')}
                className="flex-1 h-14 text-lg font-semibold rounded-xl border-2 border-primary/50 text-primary bg-transparent hover:bg-primary/10 hover:border-primary transition-all duration-300"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                View Diary
              </Button>
            </div>

            {/* Live Trading CTA */}
            <div className="relative overflow-hidden rounded-2xl mt-6">
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
              
              {/* Glowing effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-green-400 opacity-30 blur-xl" />
              
              <div className="relative p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      <Sparkles className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-center md:text-left">
                      <h3 className="text-xl md:text-2xl font-bold text-white">
                        Ready to Trade {symbol.toUpperCase() || 'Live'}?
                      </h3>
                      <p className="text-white/80 text-sm md:text-base">
                        Open a live trading account and start executing your calculated positions
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => window.open('https://client.nasrtrade.com/client.add/?promocode=NTPP', '_blank')}
                    size="lg"
                    className="h-14 px-8 text-lg font-bold bg-white text-emerald-600 hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-xl whitespace-nowrap"
                  >
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Start Trading Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!result && !isLoading && (
          <div className="text-center py-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="w-24 h-24 rounded-3xl mx-auto mb-6 flex items-center justify-center bg-muted/50 border border-border/50">
              <CalcIcon className="w-12 h-12 text-muted-foreground" />
            </div>
            <p className="text-xl font-medium text-muted-foreground">
              Enter your trade parameters
            </p>
            <p className="text-muted-foreground/70 mt-2">
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

    </SidebarLayout>
  );
};

export default Calculator;
