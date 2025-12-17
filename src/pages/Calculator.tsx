import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calculator as CalcIcon, AlertTriangle, Loader2, TrendingUp, TrendingDown, DollarSign, Target, Info } from "lucide-react";
import { useClient } from "@/lib/clientContext";
import { cn } from "@/lib/utils";

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
  account_balance?: string;
  risk_value?: string;
  lots_requested?: string;
  general?: string;
}

const Calculator = () => {
  const navigate = useNavigate();
  const { client } = useClient();

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

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  // Theme-aware colors
  const themeColors = {
    heading: isNasrTheme ? 'text-nasr-text font-playfair' : 'text-ocean',
    subtext: isNasrTheme ? 'text-nasr-text-muted' : 'text-ocean-muted',
    primary: isNasrTheme ? 'text-gold' : 'text-aqua',
    primaryBg: isNasrTheme ? 'bg-gold' : 'bg-aqua',
    cardBorder: isNasrTheme ? 'border-gold/20' : 'border-ice',
    inputBg: isNasrTheme ? 'bg-nasr-panel/60' : 'bg-white/60',
    inputBorder: isNasrTheme ? 'border-gold/20 focus:border-gold/50' : 'border-ice focus:border-aqua/50',
    toggleActive: isNasrTheme ? 'bg-gold text-nasr-bg' : 'bg-aqua text-white',
    toggleInactive: isNasrTheme ? 'bg-nasr-panel/60 text-nasr-text-muted' : 'bg-muted text-ocean-muted',
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const quizCompleted = localStorage.getItem("quizCompleted");
    
    if (!isLoggedIn || !quizCompleted) {
      navigate("/");
      return;
    }
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
    };

    try {
      const response = await fetch(
        "https://clientee.app.n8n.cloud/webhook-test/95c61f3e-fb17-4049-9801-62c89402d43b",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (data.error) {
        setErrors({ general: data.error });
      } else {
        setResult(data);
      }
    } catch (error) {
      setErrors({ general: "Calculation failed. Please try again." });
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
        "flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200",
        active 
          ? themeColors.toggleActive
          : themeColors.toggleInactive + " hover:opacity-80"
      )}
    >
      {children}
    </button>
  );

  return (
    <DashboardLayout>
      {/* Nasr Trade Academy Video Background */}
      {isNasrTheme && (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
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
        </div>
      )}

      <div className="space-y-8 relative z-10">
        {/* Header */}
        <div className="space-y-3 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              isNasrTheme ? 'bg-gold/10' : 'bg-aqua/10'
            )}>
              <CalcIcon className={cn("w-6 h-6", themeColors.primary)} />
            </div>
            <div>
              <h1 className={cn("text-4xl md:text-5xl font-bold tracking-tight", themeColors.heading)}>
                Position Size Calculator
              </h1>
              <p className={cn("text-base mt-1", themeColors.subtext)}>
                Calculate optimal lot size based on your risk parameters
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Card */}
          <Card className={cn("p-8 space-y-6", isNasrTheme && "bg-nasr-panel/80 border-gold/20")}>
            <h2 className={cn("text-xl font-semibold", themeColors.heading)}>Trade Parameters</h2>

            {/* Symbol */}
            <div className="space-y-2">
              <Label className={themeColors.subtext}>Symbol *</Label>
              <Input
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="e.g., EURUSD, XAUUSD, US30"
                className={cn(
                  "h-12 text-base",
                  themeColors.inputBg,
                  themeColors.inputBorder,
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
              <Label className={themeColors.subtext}>Side *</Label>
              <div className={cn(
                "flex gap-1 p-1 rounded-xl",
                isNasrTheme ? 'bg-nasr-bg/60' : 'bg-muted/60'
              )}>
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

            {/* Entry & Stop Loss */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className={themeColors.subtext}>Entry Price *</Label>
                <Input
                  type="number"
                  step="any"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  placeholder="0.00"
                  className={cn(
                    "h-12 text-base font-mono",
                    themeColors.inputBg,
                    themeColors.inputBorder,
                    errors.entry_price && "border-destructive"
                  )}
                />
                {errors.entry_price && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> {errors.entry_price}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className={themeColors.subtext}>Stop Loss Price *</Label>
                <Input
                  type="number"
                  step="any"
                  value={stopLossPrice}
                  onChange={(e) => setStopLossPrice(e.target.value)}
                  placeholder="0.00"
                  className={cn(
                    "h-12 text-base font-mono",
                    themeColors.inputBg,
                    themeColors.inputBorder,
                    errors.stop_loss_price && "border-destructive"
                  )}
                />
                {errors.stop_loss_price && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> {errors.stop_loss_price}
                  </p>
                )}
              </div>
            </div>

            {/* Take Profit (Optional) */}
            <div className="space-y-2">
              <Label className={themeColors.subtext}>Take Profit Price (Optional)</Label>
              <Input
                type="number"
                step="any"
                value={takeProfitPrice}
                onChange={(e) => setTakeProfitPrice(e.target.value)}
                placeholder="0.00"
                className={cn("h-12 text-base font-mono", themeColors.inputBg, themeColors.inputBorder)}
              />
            </div>

            {/* Account Balance */}
            <div className="space-y-2">
              <Label className={themeColors.subtext}>Account Balance (USD) *</Label>
              <Input
                type="number"
                step="any"
                value={accountBalance}
                onChange={(e) => setAccountBalance(e.target.value)}
                placeholder="10000"
                className={cn(
                  "h-12 text-base font-mono",
                  themeColors.inputBg,
                  themeColors.inputBorder,
                  errors.account_balance && "border-destructive"
                )}
              />
              {errors.account_balance && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> {errors.account_balance}
                </p>
              )}
            </div>

            {/* Risk Type Toggle */}
            <div className="space-y-2">
              <Label className={themeColors.subtext}>Risk Type *</Label>
              <div className={cn(
                "flex gap-1 p-1 rounded-xl",
                isNasrTheme ? 'bg-nasr-bg/60' : 'bg-muted/60'
              )}>
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
              <Label className={themeColors.subtext}>
                Risk Value ({riskType === "percent" ? "%" : "USD"}) *
              </Label>
              <Input
                type="number"
                step="any"
                value={riskValue}
                onChange={(e) => setRiskValue(e.target.value)}
                placeholder={riskType === "percent" ? "1" : "100"}
                className={cn(
                  "h-12 text-base font-mono",
                  themeColors.inputBg,
                  themeColors.inputBorder,
                  errors.risk_value && "border-destructive"
                )}
              />
              {errors.risk_value && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> {errors.risk_value}
                </p>
              )}
              <p className={cn("text-xs", themeColors.subtext)}>
                {riskType === "percent" 
                  ? "Percentage of account balance to risk" 
                  : "Fixed USD amount to risk"}
              </p>
            </div>

            {/* Lots Override */}
            <div className={cn(
              "p-4 rounded-xl space-y-4",
              isNasrTheme ? 'bg-nasr-bg/40 border border-gold/10' : 'bg-muted/40 border border-border'
            )}>
              <div className="flex items-center justify-between">
                <div>
                  <Label className={themeColors.subtext}>Override Lot Size</Label>
                  <p className={cn("text-xs", themeColors.subtext)}>
                    Manually specify lot size instead of calculated
                  </p>
                </div>
                <Switch
                  checked={lotsOverrideEnabled}
                  onCheckedChange={setLotsOverrideEnabled}
                />
              </div>
              {lotsOverrideEnabled && (
                <div className="space-y-2">
                  <Input
                    type="number"
                    step="0.01"
                    value={lotsRequested}
                    onChange={(e) => setLotsRequested(e.target.value)}
                    placeholder="0.10"
                    className={cn(
                      "h-12 text-base font-mono",
                      themeColors.inputBg,
                      themeColors.inputBorder,
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

            {/* Calculate Button */}
            <Button
              onClick={handleCalculate}
              disabled={isLoading}
              className={cn(
                "w-full h-14 text-lg font-semibold rounded-xl transition-all",
                isNasrTheme 
                  ? 'gold-gradient text-nasr-bg hover:opacity-90 gold-glow' 
                  : 'success-gradient text-white hover:opacity-90 success-glow'
              )}
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
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30">
                <p className="text-sm text-destructive flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> {errors.general}
                </p>
              </div>
            )}
          </Card>

          {/* Results Card */}
          <Card className={cn(
            "p-8 space-y-6",
            isNasrTheme && "bg-nasr-panel/80 border-gold/20",
            !result && "flex items-center justify-center"
          )}>
            {result ? (
              <div className="space-y-6 animate-fade-in">
                <h2 className={cn("text-xl font-semibold", themeColors.heading)}>
                  Calculation Results
                </h2>

                {/* Primary Results */}
                <div className="grid grid-cols-2 gap-4">
                  <div className={cn(
                    "p-6 rounded-xl text-center",
                    isNasrTheme 
                      ? 'bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30' 
                      : 'bg-gradient-to-br from-aqua/20 to-aqua/5 border border-aqua/30'
                  )}>
                    <div className={cn(
                      "w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center",
                      isNasrTheme ? 'bg-gold/20' : 'bg-aqua/20'
                    )}>
                      <Target className={cn("w-6 h-6", themeColors.primary)} />
                    </div>
                    <p className={cn("text-sm uppercase tracking-wider mb-1", themeColors.subtext)}>
                      Recommended Lots
                    </p>
                    <p className={cn(
                      "text-4xl font-bold font-mono",
                      themeColors.primary
                    )}>
                      {result.lots_final?.toFixed(2) ?? "—"}
                    </p>
                  </div>
                  <div className={cn(
                    "p-6 rounded-xl text-center",
                    isNasrTheme 
                      ? 'bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30' 
                      : 'bg-gradient-to-br from-aqua/20 to-aqua/5 border border-aqua/30'
                  )}>
                    <div className={cn(
                      "w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center",
                      isNasrTheme ? 'bg-gold/20' : 'bg-aqua/20'
                    )}>
                      <DollarSign className={cn("w-6 h-6", themeColors.primary)} />
                    </div>
                    <p className={cn("text-sm uppercase tracking-wider mb-1", themeColors.subtext)}>
                      Actual Risk
                    </p>
                    <p className={cn(
                      "text-4xl font-bold font-mono",
                      themeColors.primary
                    )}>
                      ${result.risk_total_usd?.toFixed(2) ?? "—"}
                    </p>
                  </div>
                </div>

                {/* Secondary Results */}
                <div className={cn(
                  "p-5 rounded-xl space-y-4",
                  isNasrTheme ? 'bg-nasr-bg/40 border border-gold/10' : 'bg-muted/40 border border-border'
                )}>
                  <h3 className={cn("text-sm font-semibold uppercase tracking-wider", themeColors.subtext)}>
                    Additional Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={themeColors.subtext}>Ticks to Stop Loss</span>
                      <span className={cn("font-mono font-semibold", themeColors.heading)}>
                        {result.ticks_to_sl?.toFixed(2) ?? "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={themeColors.subtext}>Risk per 1 Lot (USD)</span>
                      <span className={cn("font-mono font-semibold", themeColors.heading)}>
                        ${result.risk_per_1lot_usd?.toFixed(2) ?? "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={themeColors.subtext}>Calculated Lots (before rounding)</span>
                      <span className={cn("font-mono font-semibold", themeColors.heading)}>
                        {result.lots_calculated?.toFixed(4) ?? "—"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Position Sensitivity Section */}
                <div className={cn(
                  "p-5 rounded-xl space-y-4 animate-fade-in",
                  isNasrTheme 
                    ? 'bg-nasr-bg/40 border border-gold/10 backdrop-blur-sm' 
                    : 'bg-muted/40 border border-border backdrop-blur-sm'
                )}>
                  <div>
                    <h3 className={cn("text-sm font-semibold uppercase tracking-wider", themeColors.subtext)}>
                      Position Sensitivity
                    </h3>
                    <p className={cn("text-xs mt-0.5", themeColors.subtext, "opacity-70")}>
                      Understand how price movement affects your P/L
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* 1 Tick Move */}
                    <div className={cn(
                      "p-4 rounded-lg",
                      isNasrTheme 
                        ? 'bg-gradient-to-r from-amber-500/15 to-amber-500/5 border border-amber-500/20' 
                        : 'bg-gradient-to-r from-amber-500/10 to-amber-500/5 border border-amber-500/20'
                    )}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">📉</span>
                          <span className={cn("text-sm font-medium", themeColors.subtext)}>
                            1 Tick Movement
                          </span>
                        </div>
                        <span className={cn(
                          "text-xl font-bold font-mono",
                          isNasrTheme ? 'text-amber-400' : 'text-amber-600'
                        )}>
                          {result.tick_value_position_usd !== undefined 
                            ? `$${result.tick_value_position_usd.toFixed(2)}` 
                            : '—'}
                        </span>
                      </div>
                      <p className={cn("text-xs mt-2", themeColors.subtext, "opacity-70")}>
                        Your profit or loss changes by this amount for every 1 tick move.
                      </p>
                    </div>

                    {/* 1 Pip Move */}
                    <div className={cn(
                      "p-4 rounded-lg",
                      isNasrTheme 
                        ? 'bg-gradient-to-r from-gold/20 to-gold/5 border border-gold/30' 
                        : 'bg-gradient-to-r from-aqua/15 to-aqua/5 border border-aqua/30'
                    )}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">📈</span>
                          <span className={cn("text-sm font-medium", themeColors.subtext)}>
                            1 Pip Movement
                          </span>
                        </div>
                        <span className={cn(
                          "text-2xl font-bold font-mono",
                          themeColors.primary
                        )}>
                          {result.pip_value_position_usd !== undefined 
                            ? `$${result.pip_value_position_usd.toFixed(2)}` 
                            : '—'}
                        </span>
                      </div>
                      <p className={cn("text-xs mt-2", themeColors.subtext, "opacity-70")}>
                        Your profit or loss changes by this amount for every 1 pip move.
                      </p>
                    </div>
                  </div>

                  {/* Micro-detail footer */}
                  <p className={cn("text-xs text-center pt-2 border-t", themeColors.subtext, "opacity-60", isNasrTheme ? 'border-gold/10' : 'border-border')}>
                    Calculated for <span className="font-mono font-semibold">{result.lots_final?.toFixed(2)}</span> lots on <span className="font-mono font-semibold">{result.symbol || symbol.toUpperCase()}</span>
                  </p>
                </div>

                {/* Warnings */}
                {result.warnings && result.warnings.length > 0 && (
                  <div className={cn(
                    "p-4 rounded-xl",
                    isNasrTheme 
                      ? 'bg-amber-500/10 border border-amber-500/30' 
                      : 'bg-warning/10 border border-warning/30'
                  )}>
                    <h3 className="text-sm font-semibold text-amber-600 mb-2 flex items-center gap-2">
                      <Info className="w-4 h-4" /> Warnings
                    </h3>
                    <ul className="space-y-1">
                      {result.warnings.map((warning, index) => (
                        <li key={index} className="text-sm text-amber-600">
                          • {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center space-y-4 py-12">
                <div className={cn(
                  "w-20 h-20 rounded-full mx-auto flex items-center justify-center",
                  isNasrTheme ? 'bg-gold/10' : 'bg-aqua/10'
                )}>
                  <CalcIcon className={cn("w-10 h-10", themeColors.primary, "opacity-50")} />
                </div>
                <div>
                  <p className={cn("text-lg font-medium", themeColors.heading)}>
                    Enter your trade parameters
                  </p>
                  <p className={cn("text-sm", themeColors.subtext)}>
                    Results will appear here after calculation
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Calculator;
