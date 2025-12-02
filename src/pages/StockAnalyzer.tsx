import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, TrendingUp, Loader2, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const WEBHOOK_URL = "https://clientee.app.n8n.cloud/webhook-test/e08c02aa-77d1-458b-9a86-d19f16b04cbb";

const popularSymbols = ["AAPL", "TSLA", "GOOGL", "BTC", "ETH", "NVDA", "MSFT", "AMZN"];

const StockAnalyzer = () => {
  const [symbol, setSymbol] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [analyzedSymbol, setAnalyzedSymbol] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

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
    setAnalysis(null);
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

      const data = await response.json();
      
      // Extract analysis from response (adjust based on webhook response structure)
      const analysisText = data.output || data.analysis || data.result || data.message || JSON.stringify(data, null, 2);
      setAnalysis(analysisText);

      // Add to recent searches (avoid duplicates, max 5)
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
      setAnalysis(null);
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
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
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
            <Card className="p-8 min-h-[500px]">
              {isLoading ? (
                <div className="h-full flex flex-col items-center justify-center space-y-6 py-12">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4DE2E8]/20 to-[#A7E9FF]/20 flex items-center justify-center border border-[#4DE2E8]/30">
                      <Loader2 className="w-10 h-10 text-[#4DE2E8] animate-spin" />
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
              ) : analysis ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-[#D4E0EC]">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4DE2E8] to-[#2FB3C6] flex items-center justify-center shadow-[0_0_15px_rgba(77,226,232,0.3)]">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[#1D3557]">{analyzedSymbol}</h2>
                      <p className="text-sm text-[#6B7280]">AI Analysis Report</p>
                    </div>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-[#4B5563] leading-relaxed">
                      {analysis}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center space-y-6 py-12">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4DE2E8]/10 to-[#A7E9FF]/10 flex items-center justify-center border border-[#D4E0EC]">
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
                    className="hover:bg-[#4DE2E8]/10 hover:text-[#2FB3C6] hover:border-[#4DE2E8]"
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
                      className="text-[#4DE2E8] hover:bg-[#4DE2E8]/10"
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
            <Card className="p-4 bg-[#4DE2E8]/10 border-[#4DE2E8]/30">
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
    </DashboardLayout>
  );
};

export default StockAnalyzer;
