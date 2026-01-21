import { useState, useEffect } from "react";
import { useClient } from "@/lib/clientContext";
import HeroSection from "@/components/HeroSection";
import BenefitsSection from "@/components/BenefitsSection";
import HowItWorks from "@/components/HowItWorks";
import CTASection from "@/components/CTASection";
import SignupFormInitial, { SignupUserData } from "@/components/SignupFormInitial";
import MandatoryQuizModal from "@/components/MandatoryQuizModal";
import MetaPixel from "@/components/MetaPixel";

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
    
    // Show signup if ?signup=1 param OR client is configured to skip landing page
    if (signupParam === '1') {
      setSignupOnly(true);
      setSignupOpen(true);
    } else if (client?.skip_landing_page) {
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

  // If signup-only mode, render just the signup form with premium dark styling
  if (signupOnly) {
    return (
      <>
        <MetaPixel />
        <main className="min-h-screen bg-[#0f1419] flex items-center justify-center p-4 relative overflow-hidden">
          {/* Background blur effects - matching login page */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
          </div>
          
          <SignupFormInitial 
            open={signupOpen} 
            onOpenChange={(open) => {
              // Don't allow closing when in signup-only mode *unless* we are transitioning to the quiz.
              // (Fixes the issue where the quiz opens behind the signup modal overlay.)
              if (!open) {
                const hasPendingSignupData = !!localStorage.getItem('pendingSignupData');
                if (!quizOpen && !hasPendingSignupData) {
                  setSignupOpen(true);
                  return;
                }
              }
              setSignupOpen(open);
            }} 
            onSignupComplete={handleSignupComplete}
          />
          <MandatoryQuizModal 
            open={quizOpen} 
            userData={userData}
          />
        </main>
      </>
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
