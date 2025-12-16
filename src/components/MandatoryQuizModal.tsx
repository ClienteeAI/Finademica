import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { useClient } from "@/lib/clientContext";
import { supabase } from "@/integrations/supabase/client";
import type { SignupUserData } from "./SignupFormInitial";

interface MandatoryQuizModalProps {
  open: boolean;
  userData: SignupUserData | null;
}

interface QuizAnswers {
  experience: string;
  markets: string[];
  goal: string;
  expectation: string;
  problem: string;
}

const questions = [
  {
    id: 1,
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
    id: 2,
    key: "markets",
    title: "What markets interest you?",
    type: "multiple",
    options: [
      { value: "stocks", label: "📊 Stocks" },
      { value: "forex", label: "💱 Forex" },
      { value: "crypto", label: "₿ Cryptocurrency" },
      { value: "commodities", label: "🛢️ Commodities" }
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
    key: "expectation",
    title: "What do you expect from this course?",
    type: "single",
    options: [
      { value: "learn-basics", label: "📖 Learn the basics of trading" },
      { value: "improve-skills", label: "🎯 Improve my existing skills" },
      { value: "develop-strategy", label: "📈 Develop a consistent strategy" },
      { value: "become-profitable", label: "💎 Become consistently profitable" }
    ]
  },
  {
    id: 5,
    key: "problem",
    title: "What's your BIGGEST problem with trading?",
    type: "single",
    options: [
      { value: "losing-money", label: "😰 Losing money / Risk management" },
      { value: "understanding", label: "🤔 Not understanding how it works" },
      { value: "time", label: "⏰ Not having enough time" },
      { value: "decisions", label: "🎯 Making bad decisions / Psychology" },
      { value: "capital", label: "💸 Don't have enough capital to start" }
    ]
  }
];

const MandatoryQuizModal = ({ open, userData }: MandatoryQuizModalProps) => {
  const navigate = useNavigate();
  const { client } = useClient();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [webhookError, setWebhookError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<QuizAnswers>({
    experience: "",
    markets: [],
    goal: "",
    expectation: "",
    problem: ""
  });

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleSingleChoice = (value: string) => {
    const key = question.key as keyof QuizAnswers;
    if (key !== "markets") {
      setAnswers({ ...answers, [key]: value });
    }
  };

  const handleMultipleChoice = (value: string, checked: boolean) => {
    const newMarkets = checked
      ? [...answers.markets, value]
      : answers.markets.filter(m => m !== value);
    setAnswers({ ...answers, markets: newMarkets });
  };

  const getCurrentAnswer = () => {
    const key = question.key as keyof QuizAnswers;
    return answers[key];
  };

  const canProceed = () => {
    const answer = getCurrentAnswer();
    if (Array.isArray(answer)) {
      return answer.length > 0;
    }
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
    if (!userData) {
      setWebhookError("User data not found. Please refresh and try again.");
      return;
    }

    setIsSubmitting(true);
    setWebhookError(null);

    try {
      // MANDATORY: Send quiz webhook
      const webhookPayload = {
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        quiz: {
          experience: answers.experience,
          markets: answers.markets.join(", "),
          goal: answers.goal,
          expectation: answers.expectation,
          problem: answers.problem
        },
        source: "lovable_quiz"
      };

      const response = await fetch('https://clientee.app.n8n.cloud/webhook-test/0436515b-5645-4361-b278-c6273f0d5efb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookPayload),
      });

      console.log("Quiz webhook sent successfully");

      // Now create user in Supabase (only after successful webhook)
      if (client) {
        const { data: newUser, error } = await supabase
          .from('users')
          .insert([{
            client_id: client.id,
            email: userData.email,
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone || null,
            quiz_answers: answers as any,
            is_admin: false
          }])
          .select()
          .single();

        if (error) {
          console.error('Supabase error:', error);
          // Don't block if user already exists
          if (!error.message.includes('duplicate')) {
            throw new Error(error.message);
          }
        } else {
          console.log('User created in Supabase:', newUser);
          localStorage.setItem('userId', newUser.id);
        }
      }

      // Save to localStorage - UNLOCK ACCESS
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
      console.error("Quiz webhook failed:", error);
      setWebhookError("Failed to submit quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

          {question.type === "single" ? (
            <RadioGroup
              value={getCurrentAnswer() as string}
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
          ) : (
            <div className="space-y-3">
              {question.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-3 bg-background/50 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                  <Checkbox
                    id={option.value}
                    checked={answers.markets.includes(option.value)}
                    onCheckedChange={(checked) => handleMultipleChoice(option.value, checked as boolean)}
                  />
                  <Label htmlFor={option.value} className="text-base cursor-pointer flex-1">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          )}
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
