import { AlertTriangle } from "lucide-react";

interface TradingDisclaimerProps {
  isNasrTheme?: boolean;
}

const TradingDisclaimer = ({ isNasrTheme = false }: TradingDisclaimerProps) => {
  return (
    <div className={`mt-12 py-6 border-t ${
      isNasrTheme 
        ? 'border-gold/10 bg-nasr-panel/30' 
        : 'border-ice bg-white/30'
    }`}>
      <div className="container mx-auto px-6 max-w-[1440px]">
        <div className={`flex items-start gap-3 text-xs leading-relaxed ${
          isNasrTheme ? 'text-nasr-text-muted/70' : 'text-ocean-muted/70'
        }`}>
          <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
            isNasrTheme ? 'text-gold/50' : 'text-aqua/50'
          }`} />
          <p>
            <span className="font-semibold">Disclaimer:</span> This platform is for educational purposes only and does not constitute financial advice. 
            Trading involves substantial risk of loss and is not suitable for all investors. 
            Past performance is not indicative of future results. 
            You are solely responsible for your own trading decisions. 
            Always conduct your own research and consult with a qualified financial advisor before making any investment decisions. 
            Never trade with money you cannot afford to lose.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TradingDisclaimer;
