import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { shouldHideTradingCTAs } from "@/lib/featureFlags";
import { useClient } from "@/lib/clientContext";

interface CTASectionProps {
  onGetStarted: () => void;
}

const CTASection = ({ onGetStarted }: CTASectionProps) => {
  const { client } = useClient();
  
  // Hide the entire CTA section when trading CTAs are disabled (non-NASR clients)
  if (shouldHideTradingCTAs(client?.subdomain)) {
    return null;
  }

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple/10 to-background" />
      
      <div className="container max-w-4xl mx-auto relative z-10">
        <div className="bg-card/50 backdrop-blur-lg border border-border rounded-3xl p-12 text-center shadow-2xl">
          <div className="animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Ready to Start Your Trading Journey?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join 2,000+ traders who are already learning with personalized AI-powered training
            </p>
            
            <Button
              size="lg"
              onClick={onGetStarted}
              className="bg-gradient-to-r from-primary to-purple hover:opacity-90 text-white font-semibold px-12 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
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
