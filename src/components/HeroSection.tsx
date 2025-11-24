import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import QuizModal from "./QuizModal";

const HeroSection = () => {
  const [quizOpen, setQuizOpen] = useState(false);

  return (
    <>
      <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-dark-blue px-4 py-20">
        <div className="container max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-xl md:text-2xl font-semibold text-primary">
            AI Trading Pro Academy
          </h2>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
            Get Your Personalized
            <br />
            Trading Roadmap
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Answer 5 questions. Get a custom learning path designed for YOUR goals, 
            experience, and schedule.
          </p>
          
          <div className="pt-4">
            <Button 
              size="lg" 
              onClick={() => setQuizOpen(true)}
              className="bg-hero-button hover:bg-hero-button-hover text-primary-foreground font-semibold px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Get My Free Roadmap
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
      
      <QuizModal open={quizOpen} onOpenChange={setQuizOpen} />
    </>
  );
};

export default HeroSection;
