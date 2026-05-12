import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { shouldHideTradingCTAs } from "@/lib/featureFlags";
import { useClient } from "@/lib/clientContext";
import { cn } from "@/lib/utils";

import { useNavigate } from "react-router-dom";

interface CTASectionProps {
  onGetStarted: () => void;
}

const CTASection = ({ onGetStarted }: CTASectionProps) => {
  const navigate = useNavigate();
  const { client } = useClient();
  const isPremiumTheme = client?.subdomain === 'finademica';
  
  // Hide the entire CTA section when trading CTAs are disabled (only for non-finademica and non-nasr clients)
  if (shouldHideTradingCTAs(client?.subdomain) && !isPremiumTheme) {
    return null;
  }

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Gradient background */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br",
        isPremiumTheme 
          ? "from-premium-gold/10 via-premium-bg/50 to-background" 
          : "from-primary/20 via-purple/10 to-background"
      )} />
      
      <div className="container max-w-4xl mx-auto relative z-10">
        <div className={cn(
          "backdrop-blur-lg border rounded-3xl p-12 text-center shadow-2xl",
          isPremiumTheme 
            ? "bg-premium-panel/50 border-premium-gold/20" 
            : "bg-card/50 border-border"
        )}>
          <div className="animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Ready to Start Your Trading Journey?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join 2,000+ traders who are already learning with personalized AI-powered training
            </p>
            
            <Button
              size="lg"
              onClick={() => navigate('/signup')}
              className={cn(
                "hover:opacity-90 text-white font-semibold px-12 py-6 text-lg rounded-xl shadow-lg transition-all duration-300 hover:scale-105",
                isPremiumTheme 
                  ? "bg-premium-gold hover:shadow-premium-gold/50 text-premium-bg" 
                  : "bg-gradient-to-r from-primary to-purple hover:shadow-primary/50"
              )}
            >
              Get My Free Access Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                ✓ No Credit Card Required
              </span>
              <span className="flex items-center gap-2">
                ✓ 100% Free
              </span>
              <span className="flex items-center gap-2">
                ✓ Start Immediately
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
