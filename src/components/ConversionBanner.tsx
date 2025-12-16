import { Button } from "@/components/ui/button";
import { Check, Rocket } from "lucide-react";

export const ConversionBanner = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-700 p-8 md:p-12">
      {/* Background pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-white/5" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, white 2px, transparent 0)`,
          backgroundSize: '50px 50px'
        }} />
      </div>
      
      <div className="relative z-10 space-y-6">
        <div className="flex items-center gap-3">
          <Rocket className="w-8 h-8 text-yellow-300" />
          <h3 className="text-2xl md:text-3xl font-bold text-white">
            Ready for Professional Strategies?
          </h3>
        </div>
        
        <p className="text-white/90 text-lg">
          You&apos;ve explored the basics. Now unlock:
        </p>
        
        <div className="grid md:grid-cols-2 gap-3">
          {[
            "Richard Dennis's $150M Trading System",
            "Game Theory & Institutional Strategies",
            "Advanced Technical Analysis (VWAP, Volume)",
            "Personal Trading Diary & Tools",
            "113+ More Professional Videos",
          ].map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-white/95">
              <Check className="w-5 h-5 text-yellow-300 flex-shrink-0" />
              <span className="text-sm md:text-base">{feature}</span>
            </div>
          ))}
        </div>
        
        <Button 
          size="lg"
          className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={() => window.open('https://nasrtrade.com', '_blank')}
        >
          Open Live Account - Start with $100 →
        </Button>
      </div>
    </div>
  );
};
