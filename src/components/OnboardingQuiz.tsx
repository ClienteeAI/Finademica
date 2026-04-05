import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { QUIZ_WEBHOOK_URL } from "@/lib/onboardingWebhook";

export interface OnboardingAnswers {
  experience: string;
  markets: string[];
  goal: string;
  concern: string;
  timeCommitment: string;
}

interface OnboardingQuizProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (answers: OnboardingAnswers) => void;
  userData?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  } | null;
  clientData?: {
    id: string;
    subdomain: string;
    company_name: string;
  } | null;
}

const questions = [
  {
    id: 1,
    title: "What's your trading experience level?",
    type: "single" as const,
    key: "experience",
    options: [
      { value: "beginner", label: "🌱 Complete beginner (never traded)" },
      { value: "researched", label: "📚 I've researched but never traded" },
      { value: "few-trades", label: "📈 I've made a few trades" },
      { value: "regular", label: "💼 I trade regularly" },
    ],
  },
  {
    id: 2,
    title: "What markets interest you?",
    type: "multiple" as const,
    key: "markets",
    options: [
      { value: "stocks", label: "📊 Stocks" },
      { value: "forex", label: "💱 Forex" },
      { value: "crypto", label: "₿ Cryptocurrency" },
      { value: "commodities", label: "🛢️ Commodities" },
    ],
  },
  {
    id: 3,
    title: "What's your primary goal with trading?",
    type: "single" as const,
    key: "goal",
    options: [
      { value: "extra-income", label: "💰 Generate extra income" },
      { value: "replace-income", label: "🚀 Replace my full-time income" },
      { value: "wealth", label: "🏦 Build long-term wealth" },
      { value: "hobby", label: "🎓 Learn as a hobby" },
    ],
  },
  {
    id: 4,
    title: "What's your BIGGEST concern about trading?",
    type: "single" as const,
    key: "concern",
    options: [
      { value: "losing-money", label: "😰 Losing money / Risk management" },
      { value: "understanding", label: "🤔 Not understanding how it works" },
      { value: "time", label: "⏰ Not having enough time" },
      { value: "decisions", label: "🎯 Making bad decisions / Psychology" },
      { value: "capital", label: "💸 Don't have enough capital to start" },
    ],
  },
  {
    id: 5,
    title: "How much time can you dedicate weekly?",
    type: "single" as const,
    key: "timeCommitment",
    options: [
      { value: "1-3", label: "⏱️ 1-3 hours (casual)" },
      { value: "4-6", label: "📅 4-6 hours (part-time)" },
      { value: "7-10", label: "💪 7-10 hours (serious commitment)" },
      { value: "10+", label: "🔥 10+ hours (full-time focus)" },
    ],
  },
];

const OnboardingQuiz = ({
  open,
  onOpenChange,
  onComplete,
  userData,
  clientData,
}: OnboardingQuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<OnboardingAnswers>({
    experience: "",
    markets: [],
    goal: "",
    concern: "",
    timeCommitment: "",
  });

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleSingleChoice = (value: string) => {
    setAnswers({ ...answers, [question.key]: value });
  };

  const handleMultipleChoice = (value: string, checked: boolean) => {
    const newMarkets = checked
      ? [...answers.markets, value]
      : answers.markets.filter((m) => m !== value);
    setAnswers({ ...answers, markets: newMarkets });
  };

  const canProceed = () => {
    if (currentQuestion === 0) return answers.experience !== "";
    if (currentQuestion === 1) return answers.markets.length > 0;
    if (currentQuestion === 2) return answers.goal !== "";
    if (currentQuestion === 3) return answers.concern !== "";
    if (currentQuestion === 4) return answers.timeCommitment !== "";
    return false;
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
    setSubmitting(true);
    try {
      // Send quiz answers to webhook
      const webhookPayload = {
        event: "onboarding_quiz_completed",
        timestamp: new Date().toISOString(),
        answers: {
          experience_level: answers.experience,
          markets_interested: answers.markets,
          primary_goal: answers.goal,
          main_concern: answers.concern,
          time_available: answers.timeCommitment,
        },
        ...(userData && {
          first_name: userData.firstName,
          last_name: userData.lastName,
          email: userData.email,
          phone: userData.phone,
        }),
        ...(clientData && {
          client_id: clientData.id,
          client_subdomain: clientData.subdomain,
          client_name: clientData.company_name,
        }),
        source: "post_signup_onboarding",
      };

      await fetch(QUIZ_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(webhookPayload),
      });
      console.log("Onboarding quiz webhook sent");
    } catch (err) {
      console.warn("Quiz webhook failed, continuing:", err);
    } finally {
      setSubmitting(false);
      onComplete(answers);
    }
  };

  const currentValue =
    currentQuestion === 0
      ? answers.experience
      : currentQuestion === 2
        ? answers.goal
        : currentQuestion === 3
          ? answers.concern
          : answers.timeCommitment;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-3xl bg-card/95 backdrop-blur-lg border-border p-0 [&>button]:hidden">
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
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
            {question.title}
          </h2>

          {question.type === "single" ? (
            <RadioGroup
              value={currentValue}
              onValueChange={handleSingleChoice}
              className="space-y-3"
            >
              {question.options.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-3 bg-background/50 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <RadioGroupItem value={option.value} id={`ob-${option.value}`} />
                  <Label
                    htmlFor={`ob-${option.value}`}
                    className="text-base cursor-pointer flex-1"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <div className="space-y-3">
              {question.options.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-3 bg-background/50 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <Checkbox
                    id={`ob-${option.value}`}
                    checked={answers.markets.includes(option.value)}
                    onCheckedChange={(checked) =>
                      handleMultipleChoice(option.value, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`ob-${option.value}`}
                    className="text-base cursor-pointer flex-1"
                  >
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
            disabled={currentQuestion === 0 || submitting}
          >
            Back
          </Button>

          {currentQuestion === questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || submitting}
              className="bg-gradient-to-r from-primary to-purple hover:opacity-90 text-white font-semibold px-8"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Complete & Start Learning 🚀"
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

export default OnboardingQuiz;
