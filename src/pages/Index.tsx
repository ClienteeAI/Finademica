import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useClient } from "@/lib/clientContext";
import { useAuth } from "@/lib/AuthContext";
import HeroSection from "@/components/HeroSection";
import BenefitsSection from "@/components/BenefitsSection";
import HowItWorks from "@/components/HowItWorks";
import CTASection from "@/components/CTASection";
import SignupFormInitial, { SignupUserData } from "@/components/SignupFormInitial";
import OnboardingQuiz from "@/components/OnboardingQuiz";
import MetaPixel from "@/components/MetaPixel";

const Index = () => {
  const { client } = useClient();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [signupOnly, setSignupOnly] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [signupInProgress, setSignupInProgress] = useState(false);
  const [userData, setUserData] = useState<SignupUserData | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const signupParam = urlParams.get('signup');
    
    if (signupParam === '1') {
      setSignupOnly(true);
      setSignupOpen(true);
    } else if (client?.skip_landing_page) {
      setSignupOnly(true);
      setSignupOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client?.skip_landing_page]);

  const handleSignupComplete = (data: SignupUserData) => {
    setUserData(data);
    setSignupOpen(false);
    setShowQuiz(true);
  };

  const handleQuizComplete = () => {
    setShowQuiz(false);
    localStorage.removeItem('pendingSignupData');
    // User is auto-confirmed and logged in, redirect to dashboard
    navigate('/dashboard');
  };

  // If user is already logged in and quiz isn't showing, redirect
  useEffect(() => {
    if (user && !showQuiz && !signupOpen) {
      navigate('/dashboard');
    }
  }, [user, showQuiz, signupOpen, navigate]);

  if (signupOnly) {
    return (
      <>
        <MetaPixel />
        <main className="min-h-screen bg-[#0f1419] flex items-center justify-center p-4 relative overflow-hidden">
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
          </div>
          
          <SignupFormInitial 
            open={signupOpen} 
            onOpenChange={(open) => {
              if (!open) {
                const hasPendingSignupData = !!localStorage.getItem('pendingSignupData');
                if (!showQuiz && !hasPendingSignupData) {
                  setSignupOpen(true);
                  return;
                }
              }
              setSignupOpen(open);
            }} 
            onSignupComplete={handleSignupComplete}
          />
          <OnboardingQuiz
            open={showQuiz}
            onOpenChange={() => {}}
            onComplete={handleQuizComplete}
            userData={userData ? {
              firstName: userData.firstName,
              lastName: userData.lastName,
              email: userData.email,
              phone: userData.phone,
            } : null}
            clientData={client ? {
              id: client.id,
              subdomain: client.subdomain,
              company_name: client.company_name,
            } : null}
          />
        </main>
      </>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <HeroSection onGetStarted={() => setSignupOpen(true)} />
      <BenefitsSection />
      <HowItWorks />
      <CTASection onGetStarted={() => setSignupOpen(true)} />
      
      <SignupFormInitial 
        open={signupOpen} 
        onOpenChange={setSignupOpen}
        onSignupComplete={handleSignupComplete}
      />
      
      <OnboardingQuiz
        open={showQuiz}
        onOpenChange={() => {}}
        onComplete={handleQuizComplete}
        userData={userData ? {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone,
        } : null}
        clientData={client ? {
          id: client.id,
          subdomain: client.subdomain,
          company_name: client.company_name,
        } : null}
      />
    </main>
  );
};

export default Index;
