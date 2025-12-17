import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BookOpen, Search, TrendingUp, TrendingDown, X, Loader2, Plus, MoreVertical, Edit2, Trash2, FileText, Info } from "lucide-react";
import { useClient } from "@/lib/clientContext";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { EditTradeModal } from "@/components/EditTradeModal";
import { DeleteTradeDialog } from "@/components/DeleteTradeDialog";
import { AddTradeModal } from "@/components/AddTradeModal";
import { useAuth } from "@/lib/AuthContext";

interface DiaryEntry {
  id: string;
  created_at: string;
  symbol: string;
  side: "long" | "short";
  status: string | null;
  lots_final: number | null;
  risk_total_usd: number | null;
  profit_total_usd: number | null;
  rr_ratio: number | null;
  entry_price: number | null;
  stop_loss_price: number | null;
  take_profit_price: number | null;
  notes: string | null;
  tick_value_position_usd: number | null;
  pip_value_position_usd: number | null;
  tags?: string[] | null;
  open_time?: string | null;
}

const TradingDiary = () => {
  const navigate = useNavigate();
  const { client } = useClient();
  const { user, loading: authLoading } = useAuth();
  const isNasrTheme = client?.subdomain === 'nasr';

  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Filters
  const [sideFilter, setSideFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [symbolSearch, setSymbolSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Edit/Delete/Add modals
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [tradeToEdit, setTradeToEdit] = useState<DiaryEntry | null>(null);
  const [tradeToDelete, setTradeToDelete] = useState<{ id: string; symbol: string } | null>(null);

  const themeColors = {
    heading: isNasrTheme ? 'text-nasr-text font-playfair' : 'text-ocean',
    subtext: isNasrTheme ? 'text-nasr-text-muted' : 'text-ocean-muted',
    primary: isNasrTheme ? 'text-gold' : 'text-aqua',
    primaryBg: isNasrTheme ? 'bg-gold' : 'bg-aqua',
    cardBorder: isNasrTheme ? 'border-gold/20' : 'border-ice',
    inputBg: isNasrTheme ? 'bg-nasr-panel/60' : 'bg-white/60',
    inputBorder: isNasrTheme ? 'border-gold/20 focus:border-gold/50' : 'border-ice focus:border-aqua/50',
  };

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      navigate("/login");
      return;
    }

    fetchEntries(user.id);
  }, [authLoading, user, navigate]);

  const fetchEntries = async (authUserId: string) => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('trading_diary_trades')
        .select('*')
        .eq('auth_user_id', authUserId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch diary entries:', error);
      } else if (data) {
        setEntries(data as DiaryEntry[]);
      }
    } catch (error) {
      console.error('Failed to fetch diary entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to refresh entries (used after saving new trade)
  const refreshEntries = () => {
    if (user) {
      fetchEntries(user.id);
    }
  };

  const filteredEntries = entries.filter(entry => {
    if (sideFilter !== "all" && entry.side !== sideFilter) return false;
    if (statusFilter !== "all" && entry.status !== statusFilter) return false;
    if (symbolSearch && !entry.symbol.toLowerCase().includes(symbolSearch.toLowerCase())) return false;
    if (startDate && new Date(entry.created_at) < new Date(startDate)) return false;
    if (endDate && new Date(entry.created_at) > new Date(endDate + 'T23:59:59')) return false;
    return true;
  });

  const handleRowClick = (entry: DiaryEntry) => {
    setSelectedEntry(entry);
    setDrawerOpen(true);
  };

  const clearFilters = () => {
    setSideFilter("all");
    setStatusFilter("all");
    setSymbolSearch("");
    setStartDate("");
    setEndDate("");
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      planned: isNasrTheme ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-500/20 text-amber-600',
      open: isNasrTheme ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-500/20 text-emerald-600',
      closed: isNasrTheme ? 'bg-slate-500/20 text-slate-400' : 'bg-slate-500/20 text-slate-600',
    };
    return styles[status as keyof typeof styles] || styles.planned;
  };

  const handleEdit = (entry: DiaryEntry, e: React.MouseEvent) => {
    e.stopPropagation();
    setTradeToEdit(entry);
    setEditModalOpen(true);
  };

  const handleDelete = (entry: DiaryEntry, e: React.MouseEvent) => {
    e.stopPropagation();
    setTradeToDelete({ id: entry.id, symbol: entry.symbol });
    setDeleteDialogOpen(true);
  };

  const handleEditSuccess = () => {
    refreshEntries();
    setDrawerOpen(false);
  };

  const handleDeleteSuccess = () => {
    refreshEntries();
    setDrawerOpen(false);
  };

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
        <div className="flex items-center justify-between animate-slide-up">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              isNasrTheme ? 'bg-gold/10' : 'bg-aqua/10'
            )}>
              <BookOpen className={cn("w-6 h-6", themeColors.primary)} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className={cn("text-4xl md:text-5xl font-bold tracking-tight", themeColors.heading)}>
                  Trading Diary
                </h1>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className={cn("w-5 h-5 cursor-help opacity-60 hover:opacity-100 transition-opacity", themeColors.subtext)} />
                    </TooltipTrigger>
                    <TooltipContent className={cn(isNasrTheme && "bg-nasr-panel border-gold/20")}>
                      <p className="text-sm">Trades are filtered by your account (auth_user_id)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className={cn("text-base mt-1", themeColors.subtext)}>
                Track and analyze your trades
              </p>
            </div>
          </div>
          <Button
            onClick={() => setAddModalOpen(true)}
            className={cn(
              "h-11 px-5 text-base font-semibold rounded-xl transition-all",
              isNasrTheme 
                ? 'gold-gradient text-nasr-bg hover:opacity-90 gold-glow' 
                : 'success-gradient text-white hover:opacity-90 success-glow'
            )}
          >
            <Plus className="w-5 h-5 mr-2" />
            New Trade
          </Button>
        </div>

        {/* Filters */}
        <Card className={cn("p-5", isNasrTheme && "bg-nasr-panel/80 border-gold/20")}>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[180px]">
              <label className={cn("text-sm mb-1.5 block", themeColors.subtext)}>Symbol</label>
              <div className="relative">
                <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4", themeColors.subtext)} />
                <Input
                  placeholder="Search symbol..."
                  value={symbolSearch}
                  onChange={(e) => setSymbolSearch(e.target.value)}
                  className={cn("pl-9 h-10", themeColors.inputBg, themeColors.inputBorder)}
                />
              </div>
            </div>
            
            <div className="w-[130px]">
              <label className={cn("text-sm mb-1.5 block", themeColors.subtext)}>Side</label>
              <Select value={sideFilter} onValueChange={setSideFilter}>
                <SelectTrigger className={cn("h-10", themeColors.inputBg, themeColors.inputBorder)}>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent className={cn(isNasrTheme && "bg-nasr-panel border-gold/20")}>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="long">Long</SelectItem>
                  <SelectItem value="short">Short</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-[130px]">
              <label className={cn("text-sm mb-1.5 block", themeColors.subtext)}>Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className={cn("h-10", themeColors.inputBg, themeColors.inputBorder)}>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent className={cn(isNasrTheme && "bg-nasr-panel border-gold/20")}>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-[140px]">
              <label className={cn("text-sm mb-1.5 block", themeColors.subtext)}>From</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={cn("h-10", themeColors.inputBg, themeColors.inputBorder)}
              />
            </div>

            <div className="w-[140px]">
              <label className={cn("text-sm mb-1.5 block", themeColors.subtext)}>To</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={cn("h-10", themeColors.inputBg, themeColors.inputBorder)}
              />
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className={cn("h-10", themeColors.subtext)}
            >
              <X className="w-4 h-4 mr-1" /> Clear
            </Button>
          </div>
        </Card>

        {/* Desktop Table / Mobile Cards */}
        <Card className={cn("overflow-hidden", isNasrTheme && "bg-nasr-panel/80 border-gold/20")}>
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className={cn("w-8 h-8 animate-spin", themeColors.primary)} />
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className={cn("w-12 h-12 mx-auto mb-4 opacity-30", themeColors.subtext)} />
              <p className={cn("text-lg font-medium", themeColors.heading)}>No trades yet</p>
              <p className={cn("text-sm mt-1 mb-4", themeColors.subtext)}>
                Save your first one from the calculator.
              </p>
              <Link to="/calculator">
                <Button className={cn(
                  "h-10 px-4 font-semibold rounded-xl",
                  isNasrTheme 
                    ? 'gold-gradient text-nasr-bg hover:opacity-90' 
                    : 'success-gradient text-white hover:opacity-90'
                )}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Trade
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={cn(
                      "border-b",
                      isNasrTheme ? 'border-gold/10 bg-nasr-bg/40' : 'border-border bg-muted/40'
                    )}>
                      <th className={cn("text-left py-3 px-4 text-sm font-medium", themeColors.subtext)}>Date</th>
                      <th className={cn("text-left py-3 px-4 text-sm font-medium", themeColors.subtext)}>Symbol</th>
                      <th className={cn("text-left py-3 px-4 text-sm font-medium", themeColors.subtext)}>Side</th>
                      <th className={cn("text-left py-3 px-4 text-sm font-medium", themeColors.subtext)}>Status</th>
                      <th className={cn("text-right py-3 px-4 text-sm font-medium", themeColors.subtext)}>Lots</th>
                      <th className={cn("text-right py-3 px-4 text-sm font-medium", themeColors.subtext)}>Entry / SL / TP</th>
                      <th className={cn("text-right py-3 px-4 text-sm font-medium", themeColors.subtext)}>Risk ($)</th>
                      <th className={cn("text-right py-3 px-4 text-sm font-medium", themeColors.subtext)}>Profit ($)</th>
                      <th className={cn("text-right py-3 px-4 text-sm font-medium", themeColors.subtext)}>RR</th>
                      <th className={cn("text-center py-3 px-4 text-sm font-medium", themeColors.subtext)}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEntries.map((entry) => (
                      <tr
                        key={entry.id}
                        onClick={() => handleRowClick(entry)}
                        className={cn(
                          "border-b cursor-pointer transition-colors",
                          isNasrTheme 
                            ? 'border-gold/5 hover:bg-gold/5' 
                            : 'border-border/50 hover:bg-muted/50'
                        )}
                      >
                        <td className={cn("py-3 px-4 text-sm", themeColors.heading)}>
                          {format(new Date(entry.created_at), 'MMM d, yyyy')}
                        </td>
                        <td className={cn("py-3 px-4 text-sm font-mono font-semibold", themeColors.primary)}>
                          {entry.symbol}
                        </td>
                        <td className="py-3 px-4">
                          <span className={cn(
                            "inline-flex items-center gap-1 text-sm",
                            entry.side === 'long' ? 'text-emerald-500' : 'text-red-500'
                          )}>
                            {entry.side === 'long' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                            {entry.side.charAt(0).toUpperCase() + entry.side.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium capitalize", getStatusBadge(entry.status))}>
                            {entry.status}
                          </span>
                        </td>
                        <td className={cn("py-3 px-4 text-sm text-right font-mono", themeColors.heading)}>
                          {entry.lots_final?.toFixed(2) ?? '—'}
                        </td>
                        <td className={cn("py-3 px-4 text-sm text-right font-mono", themeColors.subtext)}>
                          <span className={themeColors.heading}>{entry.entry_price}</span>
                          <span className="mx-1">/</span>
                          <span className="text-red-500">{entry.stop_loss_price}</span>
                          <span className="mx-1">/</span>
                          <span className="text-emerald-500">{entry.take_profit_price ?? '—'}</span>
                        </td>
                        <td className={cn("py-3 px-4 text-sm text-right font-mono", themeColors.heading)}>
                          ${entry.risk_total_usd?.toFixed(2) ?? '—'}
                        </td>
                        <td className={cn(
                          "py-3 px-4 text-sm text-right font-mono",
                          entry.profit_total_usd !== null 
                            ? entry.profit_total_usd >= 0 ? 'text-emerald-500' : 'text-red-500'
                            : themeColors.subtext
                        )}>
                          {entry.profit_total_usd !== null ? `$${entry.profit_total_usd.toFixed(2)}` : '—'}
                        </td>
                        <td className={cn("py-3 px-4 text-sm text-right font-mono", themeColors.heading)}>
                          {entry.rr_ratio?.toFixed(2) ?? '—'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {entry.notes && (
                              <FileText className={cn("w-4 h-4", themeColors.subtext)} />
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button 
                                  onClick={(e) => e.stopPropagation()}
                                  className={cn(
                                    "p-1 rounded-lg transition-colors",
                                    isNasrTheme ? 'hover:bg-gold/10' : 'hover:bg-muted'
                                  )}
                                >
                                  <MoreVertical className={cn("w-4 h-4", themeColors.subtext)} />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className={cn(isNasrTheme && "bg-nasr-panel border-gold/20")}>
                                <DropdownMenuItem onClick={(e) => handleEdit(entry, e as unknown as React.MouseEvent)}>
                                  <Edit2 className="w-4 h-4 mr-2" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={(e) => handleDelete(entry, e as unknown as React.MouseEvent)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3 p-4">
                {filteredEntries.map((entry) => (
                  <div
                    key={entry.id}
                    onClick={() => handleRowClick(entry)}
                    className={cn(
                      "p-4 rounded-xl border cursor-pointer transition-all",
                      isNasrTheme 
                        ? 'bg-nasr-bg/40 border-gold/10 hover:border-gold/30' 
                        : 'bg-muted/40 border-border hover:border-aqua/30'
                    )}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className={cn("text-lg font-mono font-semibold", themeColors.primary)}>
                          {entry.symbol}
                        </p>
                        <p className={cn("text-xs", themeColors.subtext)}>
                          {format(new Date(entry.created_at), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full",
                          entry.side === 'long' 
                            ? 'bg-emerald-500/20 text-emerald-500' 
                            : 'bg-red-500/20 text-red-500'
                        )}>
                          {entry.side === 'long' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {entry.side.charAt(0).toUpperCase() + entry.side.slice(1)}
                        </span>
                        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium capitalize", getStatusBadge(entry.status))}>
                          {entry.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className={cn("text-xs", themeColors.subtext)}>Lots</p>
                        <p className={cn("font-mono font-semibold", themeColors.heading)}>
                          {entry.lots_final?.toFixed(2) ?? '—'}
                        </p>
                      </div>
                      <div>
                        <p className={cn("text-xs", themeColors.subtext)}>Risk</p>
                        <p className={cn("font-mono font-semibold", themeColors.heading)}>
                          ${entry.risk_total_usd?.toFixed(2) ?? '—'}
                        </p>
                      </div>
                      <div>
                        <p className={cn("text-xs", themeColors.subtext)}>RR</p>
                        <p className={cn("font-mono font-semibold", themeColors.primary)}>
                          {entry.rr_ratio?.toFixed(2) ?? '—'}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-3 pt-3 border-t" style={{ borderColor: isNasrTheme ? 'rgba(212,175,55,0.1)' : 'rgba(0,0,0,0.1)' }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleEdit(entry, e)}
                        className={cn("h-8 px-3", themeColors.subtext)}
                      >
                        <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleDelete(entry, e)}
                        className="h-8 px-3 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Detail Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className={cn(
          "w-[400px] sm:w-[540px] backdrop-blur-xl overflow-y-auto",
          isNasrTheme 
            ? 'bg-nasr-panel/95 border-gold/20' 
            : 'bg-white/95 border-ice'
        )}>
          <SheetHeader>
            <SheetTitle className={cn("text-xl", themeColors.heading)}>
              Trade Details
            </SheetTitle>
          </SheetHeader>

          {selectedEntry && (
            <div className="mt-6 space-y-6">
              {/* Symbol & Side */}
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn("text-2xl font-bold font-mono", themeColors.primary)}>
                    {selectedEntry.symbol}
                  </p>
                  <span className={cn(
                    "inline-flex items-center gap-1 text-sm mt-1",
                    selectedEntry.side === 'long' ? 'text-emerald-500' : 'text-red-500'
                  )}>
                    {selectedEntry.side === 'long' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {selectedEntry.side.charAt(0).toUpperCase() + selectedEntry.side.slice(1)}
                  </span>
                </div>
                <span className={cn("px-3 py-1 rounded-full text-sm font-medium capitalize", getStatusBadge(selectedEntry.status))}>
                  {selectedEntry.status}
                </span>
              </div>

              {/* Key Metrics */}
              <div className={cn(
                "grid grid-cols-2 gap-4 p-4 rounded-xl",
                isNasrTheme ? 'bg-nasr-bg/40 border border-gold/10' : 'bg-muted/40 border border-border'
              )}>
                <div>
                  <p className={cn("text-xs uppercase tracking-wider", themeColors.subtext)}>Lots</p>
                  <p className={cn("text-lg font-mono font-semibold", themeColors.heading)}>
                    {selectedEntry.lots_final?.toFixed(2) ?? '—'}
                  </p>
                </div>
                <div>
                  <p className={cn("text-xs uppercase tracking-wider", themeColors.subtext)}>Risk</p>
                  <p className={cn("text-lg font-mono font-semibold", themeColors.heading)}>
                    ${selectedEntry.risk_total_usd?.toFixed(2) ?? '—'}
                  </p>
                </div>
                <div>
                  <p className={cn("text-xs uppercase tracking-wider", themeColors.subtext)}>Entry</p>
                  <p className={cn("text-lg font-mono font-semibold", themeColors.heading)}>
                    {selectedEntry.entry_price ?? '—'}
                  </p>
                </div>
                <div>
                  <p className={cn("text-xs uppercase tracking-wider", themeColors.subtext)}>Stop Loss</p>
                  <p className={cn("text-lg font-mono font-semibold", themeColors.heading)}>
                    {selectedEntry.stop_loss_price ?? '—'}
                  </p>
                </div>
                {selectedEntry.take_profit_price && (
                  <div>
                    <p className={cn("text-xs uppercase tracking-wider", themeColors.subtext)}>Take Profit</p>
                    <p className={cn("text-lg font-mono font-semibold", themeColors.heading)}>
                      {selectedEntry.take_profit_price}
                    </p>
                  </div>
                )}
                {selectedEntry.rr_ratio && (
                  <div>
                    <p className={cn("text-xs uppercase tracking-wider", themeColors.subtext)}>Risk/Reward</p>
                    <p className={cn("text-lg font-mono font-semibold", themeColors.primary)}>
                      {selectedEntry.rr_ratio.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>

              {/* Position Sensitivity */}
              {(selectedEntry.tick_value_position_usd || selectedEntry.pip_value_position_usd) && (
                <div className={cn(
                  "p-4 rounded-xl space-y-3",
                  isNasrTheme ? 'bg-nasr-bg/40 border border-gold/10' : 'bg-muted/40 border border-border'
                )}>
                  <p className={cn("text-xs uppercase tracking-wider font-medium", themeColors.subtext)}>
                    Position Sensitivity
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedEntry.tick_value_position_usd && (
                      <div>
                        <p className={cn("text-xs", themeColors.subtext)}>1 Tick</p>
                        <p className={cn("text-lg font-mono font-semibold", isNasrTheme ? 'text-amber-400' : 'text-amber-600')}>
                          ${selectedEntry.tick_value_position_usd.toFixed(2)}
                        </p>
                      </div>
                    )}
                    {selectedEntry.pip_value_position_usd && (
                      <div>
                        <p className={cn("text-xs", themeColors.subtext)}>1 Pip</p>
                        <p className={cn("text-lg font-mono font-semibold", themeColors.primary)}>
                          ${selectedEntry.pip_value_position_usd.toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedEntry.notes && (
                <div>
                  <p className={cn("text-xs uppercase tracking-wider font-medium mb-2", themeColors.subtext)}>
                    Notes
                  </p>
                  <p className={cn("text-sm leading-relaxed", themeColors.heading)}>
                    {selectedEntry.notes}
                  </p>
                </div>
              )}

              {/* Tags */}
              {selectedEntry.tags && selectedEntry.tags.length > 0 && (
                <div>
                  <p className={cn("text-xs uppercase tracking-wider font-medium mb-2", themeColors.subtext)}>
                    Tags
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedEntry.tags.map((tag, i) => (
                      <span
                        key={i}
                        className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-medium",
                          isNasrTheme 
                            ? 'bg-gold/20 text-gold' 
                            : 'bg-aqua/20 text-aqua'
                        )}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className={cn(
                "pt-4 border-t text-xs",
                isNasrTheme ? 'border-gold/10' : 'border-border'
              )}>
                <p className={themeColors.subtext}>
                  Created: {format(new Date(selectedEntry.created_at), 'PPpp')}
                </p>
                {selectedEntry.open_time && (
                  <p className={cn("mt-1", themeColors.subtext)}>
                    Opened: {format(new Date(selectedEntry.open_time), 'PPpp')}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={(e) => handleEdit(selectedEntry, e)}
                  className={cn(
                    "flex-1 h-11 font-semibold rounded-xl",
                    isNasrTheme 
                      ? 'gold-gradient text-nasr-bg hover:opacity-90' 
                      : 'success-gradient text-white hover:opacity-90'
                  )}
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  onClick={(e) => handleDelete(selectedEntry, e)}
                  className={cn(
                    "h-11 px-6 font-semibold rounded-xl",
                    "border-destructive/30 text-destructive hover:bg-destructive/10"
                  )}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Edit Modal */}
      <EditTradeModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        trade={tradeToEdit ? {
          id: tradeToEdit.id,
          symbol: tradeToEdit.symbol,
          side: tradeToEdit.side,
          entry_price: tradeToEdit.entry_price ?? 0,
          stop_loss_price: tradeToEdit.stop_loss_price ?? 0,
          take_profit_price: tradeToEdit.take_profit_price ?? undefined,
          lots_final: tradeToEdit.lots_final ?? undefined,
          notes: tradeToEdit.notes ?? undefined,
        } : null}
        isNasrTheme={isNasrTheme}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Dialog */}
      <DeleteTradeDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        tradeId={tradeToDelete?.id || null}
        tradeSymbol={tradeToDelete?.symbol || ""}
        isNasrTheme={isNasrTheme}
        onSuccess={handleDeleteSuccess}
      />

      {/* Add Trade Modal */}
      <AddTradeModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onSuccess={refreshEntries}
        isNasrTheme={isNasrTheme}
      />
    </DashboardLayout>
  );
};

export default TradingDiary;
