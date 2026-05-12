import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, TrendingUp, Loader2, BookOpen } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import StockAnalysisCard from "@/components/StockAnalysisCard";
import StockChat from "@/components/StockChat";
import { useClient } from "@/lib/clientContext";
import { supabase } from "@/integrations/supabase/client";
import { useLogEvent } from "@/hooks/useLogEvent";

import { SaveAnalysisToDiaryModal } from "@/components/SaveAnalysisToDiaryModal";
import { shouldHideTradingCTAs } from "@/lib/featureFlags";

const WEBHOOK_URL = "https://n8n.srv1474318.hstgr.cloud/webhook/live-chat-analyser-finademica";

const popularSymbols = ["AAPL", "TSLA", "GOOGL", "BTC", "ETH", "NVDA", "MSFT", "AMZN"];

const StockAnalyzer = () => {
  const navigate = useNavigate();
  const { client } = useClient();
  const { logEvent } = useLogEvent();
  const isPremiumTheme = client?.subdomain === 'finademica';

  // ACCESS CONTROL: Must be logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate]);
  
  const [symbol, setSymbol] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<unknown>(null);
  const [analyzedSymbol, setAnalyzedSymbol] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const [showDiaryModal, setShowDiaryModal] = useState(false);

  const handleAnalyze = async () => {
    const trimmedSymbol = symbol.trim().toUpperCase();
    if (!trimmedSymbol) {
      toast({
        title: "Enter a symbol",
        description: "Please enter a stock symbol to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setAnalysisData(null);
    setAnalyzedSymbol(trimmedSymbol);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symbol: trimmedSymbol,
          timestamp: new Date().toISOString(),
        }),
      });

      const text = await response.text();
      let data: unknown;
      try {
        data = text ? JSON.parse(text) : { message: "Analysis request sent successfully" };
      } catch {
        data = { message: text || "Analysis request sent successfully" };
      }
      
      setAnalysisData(data);

      // Log stock_analyzer_used event
      await logEvent("stock_analyzer_used", { symbol: trimmedSymbol, timeframe: "default" });

      setRecentSearches(prev => {
        const filtered = prev.filter(s => s !== trimmedSymbol);
        return [trimmedSymbol, ...filtered].slice(0, 5);
      });

      toast({
        title: "Analysis Complete",
        description: `Successfully analyzed ${trimmedSymbol}`,
      });
    } catch (error) {
      console.error("Error analyzing:", error);
      setAnalysisData(null);
      toast({
        title: "Analysis Failed",
        description: "Unable to fetch analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SidebarLayout>
      {/* Premium Academy Video Background */}
      {isPremiumTheme && (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute w-full h-full object-cover opacity-30"
          >
            <source src="/premium-analyzer-background.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-premium-bg/70 via-premium-bg/85 to-premium-bg" />
        </div>
      )}
      
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1D3557]">AI Stock Analyzer</h1>
          <p className="text-[#6B7280]">
            Analyze any stock, forex pair, or cryptocurrency with AI-powered insights
          </p>
        </div>

        {/* Search Bar */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9CA3AF]" />
              <Input
                placeholder="Enter stock symbol (e.g., AAPL, TSLA, BTC)"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && !isLoading && handleAnalyze()}
                className="pl-10 h-12 text-lg"
                disabled={isLoading}
              />
            </div>
            <Button
              size="lg"
              onClick={handleAnalyze}
              disabled={isLoading}
              className="px-8"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze"
              )}
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Results Area */}
          <div className="lg:col-span-3">
            <Card className="p-8">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center space-y-6 py-12">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#6366F1]/20 to-[#A7E9FF]/20 flex items-center justify-center border border-[#6366F1]/30">
                      <Loader2 className="w-10 h-10 text-[#6366F1] animate-spin" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold text-[#1D3557]">
                      Analyzing {analyzedSymbol}...
                    </h3>
                    <p className="text-[#6B7280]">
                      Fetching real-time data and generating AI insights
                    </p>
                  </div>
                </div>
              ) : analysisData ? (
                <div className="space-y-8">
                  {/* Analysis Results */}
                  <StockAnalysisCard data={analysisData as any} symbol={analyzedSymbol || symbol} />
                  

                  {/* Save to Diary Button */}
                  <div className="flex justify-center">
                    <Button
                      onClick={() => setShowDiaryModal(true)}
                      size="lg"
                      className="gap-2 px-10 py-6 text-lg font-semibold bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white hover:opacity-90 shadow-[0_4px_20px_rgba(99,102,241,0.4)] hover:shadow-[0_6px_25px_rgba(99,102,241,0.5)] transition-all"
                    >
                      <BookOpen className="w-6 h-6" />
                      Save to Trading Diary
                    </Button>
                  </div>
                  
                  {/* Divider */}
                  <div className="border-t border-[#D4E0EC]" />
                  
                  {/* Integrated Chat */}
                  <StockChat symbol={analyzedSymbol} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-6 py-12">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#6366F1]/10 to-[#A7E9FF]/10 flex items-center justify-center border border-[#D4E0EC]">
                    <TrendingUp className="w-10 h-10 text-[#6B7280]" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold text-[#1D3557]">
                      Enter a symbol to get started
                    </h3>
                    <p className="text-[#6B7280] max-w-md">
                      AI-powered analysis with real-time data, technical indicators, and sentiment analysis
                      will appear here
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular Symbols */}
            <Card className="p-4">
              <h3 className="font-semibold text-[#1D3557] mb-4">Popular Symbols</h3>
              <div className="flex flex-wrap gap-2">
                {popularSymbols.map((sym) => (
                  <Button
                    key={sym}
                    variant="outline"
                    size="sm"
                    onClick={() => setSymbol(sym)}
                    disabled={isLoading}
                    className="hover:bg-[#6366F1]/10 hover:text-[#6366F1] hover:border-[#6366F1]"
                  >
                    {sym}
                  </Button>
                ))}
              </div>
            </Card>

            {/* Recent Searches */}
            <Card className="p-4">
              <h3 className="font-semibold text-[#1D3557] mb-4">Recent Searches</h3>
              {recentSearches.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((sym) => (
                    <Button
                      key={sym}
                      variant="ghost"
                      size="sm"
                      onClick={() => setSymbol(sym)}
                      disabled={isLoading}
                      className="text-[#6366F1] hover:bg-[#6366F1]/10"
                    >
                      {sym}
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#9CA3AF]">No recent searches yet</p>
              )}
            </Card>

            {/* Info Card */}
            <Card className="p-4 bg-[#6366F1]/10 border-[#6366F1]/30">
              <div className="space-y-2">
                <h4 className="font-semibold text-[#1D3557]">AI-Powered Analysis</h4>
                <p className="text-sm text-[#6B7280]">
                  Get comprehensive insights including technical analysis, market sentiment, and trading recommendations.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Save to Diary Modal */}
      <SaveAnalysisToDiaryModal
        open={showDiaryModal}
        onOpenChange={setShowDiaryModal}
        symbol={analyzedSymbol || symbol}
        currentPrice={(analysisData as any)?.output?.expectedFields?.currentPrice || 0}
        aiMessage={(analysisData as any)?.output?.expectedFields?.aiMessage || ""}
        isPremiumTheme={isPremiumTheme}
      />
    </SidebarLayout>
  );
};

export default StockAnalyzer;
