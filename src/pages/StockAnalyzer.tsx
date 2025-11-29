import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, TrendingUp } from "lucide-react";

const popularSymbols = ["AAPL", "TSLA", "GOOGL", "BTC", "ETH", "NVDA", "MSFT", "AMZN"];

const StockAnalyzer = () => {
  const [symbol, setSymbol] = useState("");

  const handleAnalyze = () => {
    if (symbol.trim()) {
      console.log("Analyzing:", symbol);
      // Will integrate actual analyzer here
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">AI Stock Analyzer</h1>
          <p className="text-muted-foreground">
            Analyze any stock, forex pair, or cryptocurrency with AI-powered insights
          </p>
        </div>

        {/* Search Bar */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Enter stock symbol (e.g., AAPL, TSLA, BTC)"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                className="pl-10 h-12 text-lg"
              />
            </div>
            <Button
              size="lg"
              onClick={handleAnalyze}
              className="bg-gradient-to-r from-primary to-purple hover:opacity-90 px-8"
            >
              Analyze
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Results Area */}
          <div className="lg:col-span-3">
            <Card className="p-12 text-center space-y-6 min-h-[500px] flex flex-col items-center justify-center">
              <TrendingUp className="h-16 w-16 text-muted-foreground" />
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">
                  Enter a symbol to get started
                </h3>
                <p className="text-muted-foreground max-w-md">
                  AI-powered analysis with real-time data, technical indicators, and sentiment analysis
                  will appear here
                </p>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular Symbols */}
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-4">Popular Symbols</h3>
              <div className="flex flex-wrap gap-2">
                {popularSymbols.map((sym) => (
                  <Button
                    key={sym}
                    variant="outline"
                    size="sm"
                    onClick={() => setSymbol(sym)}
                    className="hover:bg-primary hover:text-primary-foreground"
                  >
                    {sym}
                  </Button>
                ))}
              </div>
            </Card>

            {/* Recent Searches */}
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-4">Recent Searches</h3>
              <p className="text-sm text-muted-foreground">No recent searches yet</p>
            </Card>

            {/* Info Card */}
            <Card className="p-4 bg-primary/10 border-primary/20">
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Coming Soon</h4>
                <p className="text-sm text-muted-foreground">
                  Advanced features including portfolio tracking, alerts, and more will be added here.
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
