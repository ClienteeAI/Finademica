import { useState, useEffect } from "react";
import { useClient } from "@/lib/clientContext";
import HeroSection from "@/components/HeroSection";
import BenefitsSection from "@/components/BenefitsSection";
import HowItWorks from "@/components/HowItWorks";
import CTASection from "@/components/CTASection";
import SignupFormInitial, { SignupUserData } from "@/components/SignupFormInitial";
import MandatoryQuizModal from "@/components/MandatoryQuizModal";

const Index = () => {
  const { client } = useClient();
  const [signupOnly, setSignupOnly] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [userData, setUserData] = useState<SignupUserData | null>(null);

  // Check if we should show signup-only mode (no landing page) - only run ONCE on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const signupParam = urlParams.get('signup');
    
    if (signupParam === '1' || client?.skip_landing_page) {
      setSignupOnly(true);
      setSignupOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client?.skip_landing_page]); // Only depend on client config, not quizOpen

  const handleSignupComplete = (data: SignupUserData) => {
    setUserData(data);
    setSignupOpen(false); // Close signup form first
    setQuizOpen(true);    // Then open quiz
  };

  // If signup-only mode, render just the signup form with a minimal dark background
  if (signupOnly) {
    return (
      <main className="min-h-screen bg-[#0A0E1A] flex items-center justify-center">
        <SignupFormInitial 
          open={signupOpen} 
          onOpenChange={(open) => {
            // Don't allow closing when in signup-only mode
            if (!open && !quizOpen) {
              // User tried to close - keep it open
              setSignupOpen(true);
            } else {
              setSignupOpen(open);
            }
          }} 
          onSignupComplete={handleSignupComplete}
        />
        <MandatoryQuizModal 
          open={quizOpen} 
          userData={userData}
        />
      </main>
    );
  }

  // Normal landing page mode
  return (
    <main className="min-h-screen bg-background">
      <HeroSection onGetStarted={() => setSignupOpen(true)} />
      <BenefitsSection />
      <HowItWorks />
      <CTASection onGetStarted={() => setSignupOpen(true)} />
      
      {/* Signup Form Modal */}
      <SignupFormInitial 
        open={signupOpen} 
        onOpenChange={setSignupOpen}
        onSignupComplete={handleSignupComplete}
      />
      
      {/* Quiz Modal (after signup) */}
      <MandatoryQuizModal 
        open={quizOpen} 
        userData={userData}
      />
    </main>
  );
};

export default Index;
