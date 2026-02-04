import { Button } from "@/components/ui/button";
import { Check, Rocket } from "lucide-react";
import { shouldHideTradingCTAs } from "@/lib/featureFlags";
import { useClient } from "@/lib/clientContext";

export const ConversionBanner = () => {
  const { client } = useClient();
  
  // Hide the entire banner when trading CTAs are disabled (non-NASR clients)
  if (shouldHideTradingCTAs(client?.subdomain)) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-700 p-5 sm:p-8 md:p-12">
      {/* Background pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-white/5" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, white 2px, transparent 0)`,
          backgroundSize: '50px 50px'
        }} />
      </div>
      
      <div className="relative z-10 space-y-4 sm:space-y-6">
        <div className="flex items-start gap-2 sm:gap-3">
          <Rocket className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300 flex-shrink-0 mt-1" />
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight">
            Ready for Professional Strategies?
          </h3>
        </div>
        
        <p className="text-white/90 text-base sm:text-lg">
          You&apos;ve explored the basics. Now unlock:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
          {[
            "Richard Dennis's $150M Trading System",
            "Game Theory & Institutional Strategies",
            "Advanced Technical Analysis (VWAP, Volume)",
            "Personal Trading Diary & Tools",
            "113+ More Professional Videos",
          ].map((feature, index) => (
            <div key={index} className="flex items-start gap-2 text-white/95">
              <Check className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base">{feature}</span>
            </div>
          ))}
        </div>
        
        <Button 
          size="lg"
          className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-sm sm:text-lg px-4 sm:px-8 py-4 sm:py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={() => window.open('https://client.nasrtrade.com/client.add/?promocode=NTPP', '_blank')}
        >
          Open Live Account - Start with $100 →
        </Button>
      </div>
    </div>
  );
};
