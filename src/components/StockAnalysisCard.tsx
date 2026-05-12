import { TrendingUp, TrendingDown, Minus, AlertTriangle, Target, BarChart3, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface AnalysisData {
  output?: {
    ticker?: string;
    timestamp?: string;
    expectedFields?: {
      currentPrice?: number;
      aiScore?: string | number;
      riskLevel?: string;
      trendAnalysis?: string;
      keyFactors?: string;
      forecast?: string;
      bullProbability?: number;
      neutralProbability?: number;
      bearProbability?: number;
      aiMessage?: string;
    };
  };
}

interface StockAnalysisCardProps {
  data: AnalysisData;
  symbol: string;
}

const StockAnalysisCard = ({ data, symbol }: StockAnalysisCardProps) => {
  const fields = data?.output?.expectedFields;
  
  if (!fields) {
    return (
      <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
        {JSON.stringify(data, null, 2)}
      </div>
    );
  }

  const aiScore = Number(fields.aiScore) || 0;
  const currentPrice = Number(fields.currentPrice) || 0;
  const bullProb = Number(fields.bullProbability) || 0;
  const neutralProb = Number(fields.neutralProbability) || 0;
  const bearProb = Number(fields.bearProbability) || 0;

  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case 'low': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'moderate': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'high': return 'text-red-500 bg-red-50 border-red-200';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-emerald-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header with Price and Score */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#D4E0EC]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#4F46E5] flex items-center justify-center shadow-[0_0_20px_rgba(99, 102, 241,0.3)]">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#1D3557]">{symbol}</h2>
            <p className="text-[#6B7280] text-sm">AI Analysis Report</p>
          </div>
        </div>
        
        {currentPrice > 0 && (
          <div className="text-right">
            <p className="text-3xl font-bold text-[#1D3557]">${currentPrice.toFixed(2)}</p>
            <p className="text-sm text-[#6B7280]">Current Price</p>
          </div>
        )}
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* AI Score */}
        <Card className="p-4 bg-gradient-to-br from-white/80 to-[#F6F9FB] border-[#D4E0EC]">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-[#6366F1]" />
            <span className="text-sm text-[#6B7280]">AI Score</span>
          </div>
          <p className={`text-3xl font-bold ${getScoreColor(aiScore)}`}>{aiScore}</p>
          <Progress value={aiScore} className="mt-2 h-2" />
        </Card>

        {/* Risk Level */}
        <Card className="p-4 bg-gradient-to-br from-white/80 to-[#F6F9FB] border-[#D4E0EC]">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-[#6366F1]" />
            <span className="text-sm text-[#6B7280]">Risk Level</span>
          </div>
          <Badge className={`${getRiskColor(fields.riskLevel || '')} text-base px-3 py-1`}>
            {fields.riskLevel || 'N/A'}
          </Badge>
        </Card>

        {/* Sentiment Distribution */}
        <Card className="p-4 bg-gradient-to-br from-white/80 to-[#F6F9FB] border-[#D4E0EC] col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-[#6366F1]" />
            <span className="text-sm text-[#6B7280]">Sentiment</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1 text-emerald-600">
                <TrendingUp className="w-3 h-3" /> Bull
              </span>
              <span className="font-medium">{bullProb.toFixed(0)}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1 text-[#6B7280]">
                <Minus className="w-3 h-3" /> Neutral
              </span>
              <span className="font-medium">{neutralProb.toFixed(0)}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1 text-red-500">
                <TrendingDown className="w-3 h-3" /> Bear
              </span>
              <span className="font-medium">{bearProb.toFixed(0)}%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* AI Message */}
      {fields.aiMessage && (
        <Card className="p-4 bg-gradient-to-r from-[#6366F1]/10 to-[#A7E9FF]/10 border-[#6366F1]/30">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6366F1] to-[#4F46E5] flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#1D3557] mb-1">AI Recommendation</p>
              <p className="text-[#4B5563]">{fields.aiMessage}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Analysis Sections */}
      <div className="grid md:grid-cols-2 gap-4">
        {fields.trendAnalysis && (
          <Card className="p-4 border-[#D4E0EC]">
            <h4 className="font-semibold text-[#1D3557] mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#6366F1]" />
              Trend Analysis
            </h4>
            <p className="text-sm text-[#4B5563] leading-relaxed">{fields.trendAnalysis}</p>
          </Card>
        )}

        {fields.keyFactors && (
          <Card className="p-4 border-[#D4E0EC]">
            <h4 className="font-semibold text-[#1D3557] mb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-[#6366F1]" />
              Key Factors
            </h4>
            <p className="text-sm text-[#4B5563] leading-relaxed">{fields.keyFactors}</p>
          </Card>
        )}
      </div>

      {fields.forecast && (
        <Card className="p-4 border-[#D4E0EC]">
          <h4 className="font-semibold text-[#1D3557] mb-2 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#6366F1]" />
            Forecast
          </h4>
          <p className="text-sm text-[#4B5563] leading-relaxed">{fields.forecast}</p>
        </Card>
      )}
    </div>
  );
};

export default StockAnalysisCard;
