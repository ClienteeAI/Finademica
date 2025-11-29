import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import BenefitsSection from "@/components/BenefitsSection";
import HowItWorks from "@/components/HowItWorks";
import CTASection from "@/components/CTASection";

const Index = () => {
  const [quizOpen, setQuizOpen] = useState(false);

  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <BenefitsSection />
      <HowItWorks />
      <CTASection onGetStarted={() => {
        // Trigger quiz modal (will be passed down through HeroSection)
        const btn = document.querySelector('[data-quiz-trigger]') as HTMLButtonElement;
        if (btn) btn.click();
      }} />
    </main>
  );
};

export default Index;
