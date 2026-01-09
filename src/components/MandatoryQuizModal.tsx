import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { useClient } from "@/lib/clientContext";
import { supabase } from "@/integrations/supabase/client";
import { ONBOARDING_WEBHOOK_URL } from "@/lib/onboardingWebhook";
import type { SignupUserData } from "./SignupFormInitial";

interface MandatoryQuizModalProps {
  open: boolean;
  userData: SignupUserData | null;
}

interface QuizAnswers {
  main_concern: string;
  experience: string;
  goal: string;
  risk_tolerance: string;
  time_available: string;
}

type ModalState = "quiz" | "email-confirmation";

const questions = [
  {
    id: 1,
    key: "main_concern",
    title: "What's your MAIN CONCERN with trading?",
    type: "single",
    options: [
      { value: "losing-money", label: "😰 Losing money / Risk management" },
      { value: "understanding", label: "🤔 Not understanding how it works" },
      { value: "time", label: "⏰ Not having enough time" },
      { value: "decisions", label: "🎯 Making bad decisions / Psychology" }
    ]
  },
  {
    id: 2,
    key: "experience",
    title: "What's your trading experience level?",
    type: "single",
    options: [
      { value: "beginner", label: "🌱 Complete beginner (never traded)" },
      { value: "researched", label: "📚 I've researched but never traded" },
      { value: "few-trades", label: "📈 I've made a few trades" },
      { value: "regular", label: "💼 I trade regularly" }
    ]
  },
  {
    id: 3,
    key: "goal",
    title: "What's your primary goal with trading?",
    type: "single",
    options: [
      { value: "extra-income", label: "💰 Generate extra income" },
      { value: "replace-income", label: "🚀 Replace my full-time income" },
      { value: "wealth", label: "🏦 Build long-term wealth" },
      { value: "hobby", label: "🎓 Learn as a hobby" }
    ]
  },
  {
    id: 4,
    key: "risk_tolerance",
    title: "What's your risk tolerance?",
    type: "single",
    options: [
      { value: "conservative", label: "🛡️ Conservative (low risk, steady returns)" },
      { value: "moderate", label: "⚖️ Moderate (balanced risk/reward)" },
      { value: "aggressive", label: "🚀 Aggressive (higher risk for higher returns)" },
      { value: "very-aggressive", label: "🔥 Very aggressive (maximum growth potential)" }
    ]
  },
  {
    id: 5,
    key: "time_available",
    title: "How much time do you have available for learning each week?",
    type: "single",
    options: [
      { value: "1-2-hours", label: "⏰ 1-2 hours per week" },
      { value: "3-5-hours", label: "📅 3-5 hours per week" },
      { value: "5-10-hours", label: "📚 5-10 hours per week" },
      { value: "10-plus-hours", label: "🎯 10+ hours per week (full commitment)" }
    ]
  }
];

const MandatoryQuizModal = ({ open, userData }: MandatoryQuizModalProps) => {
  const navigate = useNavigate();
  const { client } = useClient();
  const [modalState, setModalState] = useState<ModalState>("quiz");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [webhookError, setWebhookError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<QuizAnswers>({
    main_concern: "",
    experience: "",
    goal: "",
    risk_tolerance: "",
    time_available: ""
  });

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleSingleChoice = (value: string) => {
    const key = question.key as keyof QuizAnswers;
    setAnswers({ ...answers, [key]: value });
  };

  const getCurrentAnswer = () => {
    const key = question.key as keyof QuizAnswers;
    return answers[key];
  };

  const canProceed = () => {
    const answer = getCurrentAnswer();
    return answer !== "";
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setWebhookError(null);

    // TESTING MODE: If no userData, just send to webhook and skip DB operations
    if (!userData) {
      try {
        const testPayload = {
          main_concern: answers.main_concern,
          experience_level: answers.experience,
          primary_goal: answers.goal,
          risk_tolerance: answers.risk_tolerance,
          time_available: answers.time_available,
          client_id: client?.id,
          client_name: client?.company_name,
          source: "lovable_quiz"
        };

        const response = await fetch(ONBOARDING_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testPayload),
        });
        console.log("Quiz webhook sent:", response.ok);
        setIsSubmitting(false);
        return;
      } catch (err) {
        console.error("Test webhook error:", err);
        setWebhookError("Failed to send test data");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      // Get current auth user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // If the user isn't logged in (e.g., email confirmation required), still send the quiz to webhook.
        try {
          const quizPayload = {
            email: userData.email,
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
            main_concern: answers.main_concern,
            experience_level: answers.experience,
            primary_goal: answers.goal,
            risk_tolerance: answers.risk_tolerance,
            time_available: answers.time_available,
            client_id: client?.id,
            client_name: client?.company_name,
            source: "lovable_quiz_no_session",
          };

          await fetch(ONBOARDING_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(quizPayload),
          });
        } catch (webhookErr) {
          console.warn("Quiz webhook failed (no session):", webhookErr);
        }

        // Show email confirmation screen instead of redirecting
        setModalState("email-confirmation");
        setIsSubmitting(false);
        return;
      }


      // 1. Update existing user with quiz answers (use auth_user_id, NOT legacy userId)
      const { error: updateError } = await supabase
        .from('users')
        .update({
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone,
          quiz_answers: answers as any,
          account_status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('auth_user_id', user.id);

      if (updateError) {
        console.error('User update error:', updateError);
        throw new Error(updateError.message);
      }

      console.log('User updated with quiz answers');

      // 2. If onboarding is enabled for client, save to user_onboarding_answers
      const onboardingConfig = client?.onboarding_config as { enabled?: boolean } | null;
      if (onboardingConfig?.enabled) {
        // First get the public.users.id (not auth_user_id)
        const { data: userRecord } = await supabase
          .from('users')
          .select('id')
          .eq('auth_user_id', user.id)
          .single();

        if (userRecord && client) {
          await supabase.from('user_onboarding_answers').insert({
            user_id: userRecord.id,
            client_id: client.id,
            answers: answers as any
          });
          console.log('Onboarding answers saved');
        }
      }

      // 3. Send quiz webhook (non-blocking)
      try {
        const quizPayload = {
          auth_user_id: user.id,
          email: userData.email,
          first_name: userData.firstName,
          last_name: userData.lastName,
          main_concern: answers.main_concern,
          experience_level: answers.experience,
          primary_goal: answers.goal,
          risk_tolerance: answers.risk_tolerance,
          time_available: answers.time_available,
          client_id: client?.id,
          client_name: client?.company_name,
          source: "lovable_quiz"
        };

        await fetch(ONBOARDING_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(quizPayload),
        });
        console.log("Quiz webhook sent successfully");
      } catch (webhookErr) {
        console.warn("Quiz webhook failed, continuing:", webhookErr);
      }

      // 4. Save to localStorage
      const storedUserData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone
      };
      localStorage.setItem('userData', JSON.stringify(storedUserData));
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('quizCompleted', 'true');
      localStorage.setItem('quizAnswers', JSON.stringify(answers));
      if (client) {
        localStorage.setItem('userClientId', client.id);
      }
      
      // Clear pending data
      localStorage.removeItem('pendingSignupData');

      // NOW redirect to dashboard (access unlocked)
      navigate('/dashboard');

    } catch (error) {
      console.error("Quiz submission failed:", error);
      setWebhookError("Failed to submit quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Email confirmation screen
  if (modalState === "email-confirmation") {
    return (
      <Dialog open={open} onOpenChange={() => {}}>
        <DialogContent
          className="max-w-md bg-card/95 backdrop-blur-lg border-border p-8 text-center"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          hideCloseButton
        >
          <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Check Your Email
              </h2>
              <p className="text-muted-foreground mb-4">
                We've sent a confirmation link to:
              </p>
              <p className="text-primary font-medium text-lg mb-4">
                {userData?.email}
              </p>
              <p className="text-sm text-muted-foreground">
                Please click the link in your email to activate your account and start learning.
              </p>
            </div>

            <Button
              onClick={() => navigate("/login")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground w-full"
            >
              Go to Login
            </Button>
            
            <p className="text-xs text-muted-foreground">
              Didn't receive the email? Check your spam folder.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // BLOCKING: No close button, no escape, no background click
  return (
    <Dialog 
      open={open} 
      onOpenChange={() => {}} // Prevent closing
    >
      <DialogContent 
        className="max-w-3xl bg-card/95 backdrop-blur-lg border-border p-0"
        onPointerDownOutside={(e) => e.preventDefault()} // Block background clicks
        onEscapeKeyDown={(e) => e.preventDefault()} // Block escape key
        hideCloseButton // Custom prop to hide X button
      >
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="p-8 animate-fade-in">
          {webhookError && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-lg mb-4">
              {webhookError}
              <Button 
                variant="link" 
                className="text-destructive underline ml-2 p-0 h-auto"
                onClick={() => setWebhookError(null)}
              >
                Retry
              </Button>
            </div>
          )}

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
            {question.title}
          </h2>

          <RadioGroup
            value={getCurrentAnswer()}
            onValueChange={handleSingleChoice}
            className="space-y-3"
          >
            {question.options.map((option) => (
              <div key={option.value} className="flex items-center space-x-3 bg-background/50 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="text-base cursor-pointer flex-1">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex justify-between p-6 pt-0 border-t border-border">
          <Button 
            variant="ghost" 
            onClick={handleBack} 
            disabled={currentQuestion === 0 || isSubmitting}
          >
            Back
          </Button>
          
          {currentQuestion === questions.length - 1 ? (
            <Button 
              onClick={handleSubmit} 
              disabled={!canProceed() || isSubmitting} 
              className="bg-gradient-to-r from-primary to-purple hover:opacity-90 text-white font-semibold px-8"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit & Get My Results"
              )}
            </Button>
          ) : (
            <Button 
              onClick={handleNext} 
              disabled={!canProceed()} 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
            >
              Next
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MandatoryQuizModal;
