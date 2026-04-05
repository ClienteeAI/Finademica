import { useState, useEffect } from "react";
import { useClient } from "@/lib/clientContext";
import HeroSection from "@/components/HeroSection";
import BenefitsSection from "@/components/BenefitsSection";
import HowItWorks from "@/components/HowItWorks";
import CTASection from "@/components/CTASection";
import SignupFormInitial, { SignupUserData } from "@/components/SignupFormInitial";
import MetaPixel from "@/components/MetaPixel";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Mail } from "lucide-react";

const Index = () => {
  const { client } = useClient();
  const [signupOnly, setSignupOnly] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
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
    setShowEmailConfirmation(true);
  };

  const EmailConfirmationModal = () => (
    <Dialog open={showEmailConfirmation} onOpenChange={() => {}}>
      <DialogContent className="max-w-md bg-[#1a1f2e] border-[#2a3142] text-white [&>button]:hidden">
        <div className="flex flex-col items-center text-center py-6 space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Check Your Email</h2>
          <p className="text-[#94a3b8]">
            We've sent a confirmation link to{" "}
            <span className="text-white font-semibold">{userData?.email}</span>
          </p>
          <p className="text-[#94a3b8] text-sm">
            Click the link in the email to activate your account and start learning.
            Check your spam folder if you don't see it.
          </p>
          <div className="bg-[#0f1419] rounded-lg p-4 w-full mt-4">
            <p className="text-xs text-[#94a3b8]">
              Already confirmed?{" "}
              <a href="/login" className="text-primary hover:underline font-semibold">
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

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
                if (!showEmailConfirmation && !hasPendingSignupData) {
                  setSignupOpen(true);
                  return;
                }
              }
              setSignupOpen(open);
            }} 
            onSignupComplete={handleSignupComplete}
          />
          <EmailConfirmationModal />
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
      
      <EmailConfirmationModal />
    </main>
  );
};

export default Index;
