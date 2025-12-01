import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useClient } from "@/lib/clientContext";
import QuizModal from "./QuizModal";

const HeroSection = () => {
  const client = useClient();
  const [quizOpen, setQuizOpen] = useState(false);

  return (
    <>
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-20 overflow-hidden">
        {/* Video background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-background.mp4" type="video/mp4" />
        </video>
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-background/70 backdrop-blur-[2px]" />
        
        <div className="container max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <div className="animate-fade-in">
            <div className="inline-block mb-4">
              <span className="text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                🚀 AI-Powered Trading Education
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6">
              {client.company_tagline || "Your Personalized Path to Trading Success"}
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Welcome to <span className="text-foreground font-semibold">{client.company_name}</span>. 
              Answer 5 questions. Get AI-powered video training, custom roadmap, 
              and professional tools - all <span className="text-foreground font-semibold">free</span>.
            </p>
            
            <div className="pt-4">
              <Button 
                size="lg" 
                onClick={() => setQuizOpen(true)}
                data-quiz-trigger
                className="bg-gradient-to-r from-primary to-purple hover:opacity-90 text-white font-semibold px-12 py-7 text-lg rounded-xl shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                ✓ No Credit Card Required
              </span>
              <span className="hidden md:inline text-border">•</span>
              <span className="flex items-center gap-2">
                ✓ 2,000+ Active Learners
              </span>
              <span className="hidden md:inline text-border">•</span>
              <span className="flex items-center gap-2">
                ✓ Powered by AI
              </span>
            </div>
          </div>
        </div>
      </section>
      
      <QuizModal open={quizOpen} onOpenChange={setQuizOpen} />
    </>
  );
};

export default HeroSection;
