import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useClient } from "@/lib/clientContext";
import { useAuth } from "@/lib/AuthContext";
import SignupFormInitial, { SignupUserData } from "@/components/SignupFormInitial";
import OnboardingQuiz from "@/components/OnboardingQuiz";
import MetaPixel from "@/components/MetaPixel";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const Signup = () => {
  const { client } = useClient();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [signupOpen, setSignupOpen] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [userData, setUserData] = useState<SignupUserData | null>(null);
  const isPremiumTheme = client?.subdomain === 'finademica';

  useEffect(() => {
    // Check for pending signup data (e.g. if user refreshed during quiz)
    const storedData = localStorage.getItem("pendingSignupData");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData) as SignupUserData;
        setUserData(parsedData);
        setShowQuiz(true);
        setSignupOpen(false);
      } catch (e) {
        localStorage.removeItem("pendingSignupData");
      }
    }
  }, []);

  const handleSignupComplete = (data: SignupUserData) => {
    setUserData(data);
    setSignupOpen(false);
    setShowQuiz(true);
  };

  const handleQuizComplete = () => {
    setShowQuiz(false);
    localStorage.removeItem('pendingSignupData');
    navigate('/dashboard');
  };

  // If user is already logged in and not in quiz flow, redirect
  useEffect(() => {
    if (user && !showQuiz && !localStorage.getItem("pendingSignupData")) {
      navigate('/dashboard');
    }
  }, [user, showQuiz, navigate]);

  if (!client) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <MetaPixel />
      <main className={cn(
        "min-h-screen flex items-center justify-center p-4 relative overflow-hidden",
        isPremiumTheme ? "bg-premium-bg" : "bg-[#0f1419]"
      )}>
        {/* Animated Background Orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className={cn(
            "absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] animate-pulse opacity-20",
            isPremiumTheme ? "bg-premium-gold" : "bg-primary"
          )} />
          <div className={cn(
            "absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full blur-[120px] animate-pulse-slow opacity-10",
            isPremiumTheme ? "bg-premium-gold/50" : "bg-emerald-500"
          )} />
        </div>

        {/* Logo at the top */}
        {client?.logo_url && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20">
            <img 
              src={client.logo_url} 
              alt={client.company_name} 
              className="h-12 md:h-16 object-contain animate-fade-in"
            />
          </div>
        )}
        
        {/* The Signup Form (Modal-based for consistency, but centered here) */}
        <SignupFormInitial 
          open={signupOpen} 
          onOpenChange={(open) => {
            if (!open && !showQuiz && !localStorage.getItem('pendingSignupData')) {
              navigate('/landing');
            }
          }} 
          onSignupComplete={handleSignupComplete}
        />

        {/* The Onboarding Quiz */}
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

        {/* Premium footer tagline */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-center">
          <p className={cn(
            "text-sm font-medium tracking-widest uppercase opacity-40",
            isPremiumTheme ? "text-premium-gold" : "text-primary"
          )}>
            Powered by Artificial Intelligence
          </p>
        </div>
      </main>
    </>
  );
};

export default Signup;
