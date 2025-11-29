import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import QuizModal from "./QuizModal";

const HeroSection = () => {
  const [quizOpen, setQuizOpen] = useState(false);

  return (
    <>
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-20 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/10 to-purple/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(139,92,246,0.1),transparent_50%)]" />
        
        <div className="container max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <div className="animate-fade-in">
            <div className="inline-block mb-4">
              <span className="text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                🚀 AI-Powered Trading Education
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6">
              Your Personalized Path to
              <br />
              <span className="bg-gradient-to-r from-primary to-purple bg-clip-text text-transparent">
                Trading Success
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
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
