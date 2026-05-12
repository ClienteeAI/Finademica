import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, LogIn } from "lucide-react";
import { useClient } from "@/lib/clientContext";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  const { client } = useClient();
  const navigate = useNavigate();
  const isPremiumTheme = client?.subdomain === 'finademica';

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Login button - positioned absolutely in top right */}
      <div className="absolute top-8 right-8 z-20">
        <Button 
          variant="outline"
          onClick={() => {
            console.log('LOGIN_CLICK');
            navigate('/login');
          }}
          className={cn(
            "gap-2",
            isPremiumTheme && "border-premium-gold/30 text-premium-text hover:bg-premium-gold/10"
          )}
        >
          <LogIn size={18} />
          Login
        </Button>
      </div>
      {/* Video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={isPremiumTheme ? "https://finademica.com/nasr_background.mp4" : "/hero-background.mp4"} type="video/mp4" />
      </video>
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-background/70 backdrop-blur-[2px]" />
      
      <div className="container max-w-5xl mx-auto text-center space-y-8 relative z-10">
        <div className="animate-fade-in">
          <div className="inline-block mb-4">
            <span className={cn(
              "text-sm font-semibold px-4 py-2 rounded-full border",
              isPremiumTheme 
                ? "text-premium-gold bg-premium-gold/10 border-premium-gold/20" 
                : "text-primary bg-primary/10 border-primary/20"
            )}>
              🚀 AI-Powered Trading Education
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6">
            {client?.company_tagline || "Your Personalized Path to Trading Success"}
          </h1>
          
          <p className={cn(
            "text-xl md:text-2xl max-w-3xl mx-auto mb-8",
            isPremiumTheme ? "text-premium-text-muted" : "text-muted-foreground"
          )}>
            Welcome to <span className={cn("font-semibold", isPremiumTheme ? "text-premium-text" : "text-foreground")}>{client?.company_name}</span>.
            Answer 5 questions. Get AI-powered video training, custom roadmap, 
            and professional tools - all <span className={cn("font-semibold", isPremiumTheme ? "text-premium-text" : "text-foreground")}>free</span>.
          </p>
          
          <div className="pt-4">
            <Button 
              size="lg" 
              onClick={() => navigate('/signup')}
              data-quiz-trigger
              className={cn(
                "hover:opacity-90 text-white font-semibold px-12 py-7 text-lg rounded-xl shadow-2xl transition-all duration-300 hover:scale-105",
                isPremiumTheme 
                  ? "bg-premium-gold hover:shadow-premium-gold/50 text-premium-bg" 
                  : "bg-gradient-to-r from-primary to-purple hover:shadow-primary/50"
              )}
            >
              Get Started Free
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </div>

          {/* Trust indicators */}
          <div className={cn(
            "flex flex-wrap items-center justify-center gap-6 mt-8 text-sm",
            isPremiumTheme ? "text-premium-text-muted" : "text-muted-foreground"
          )}>
            <span className="flex items-center gap-2">
              ✓ No Credit Card Required
            </span>
            <span className={cn("hidden md:inline", isPremiumTheme ? "text-premium-gold/20" : "text-border")}>•</span>
            <span className="flex items-center gap-2">
              ✓ 2,000+ Active Learners
            </span>
            <span className={cn("hidden md:inline", isPremiumTheme ? "text-premium-gold/20" : "text-border")}>•</span>
            <span className="flex items-center gap-2">
              ✓ Powered by AI
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
