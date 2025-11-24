import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { X, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

interface QuizModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface QuizAnswers {
  experience: string;
  markets: string[];
  goal: string;
  concern: string;
  timeCommitment: string;
}

const questions = [
  {
    id: 1,
    title: "What's your trading experience level?",
    type: "single",
    options: [
      { value: "beginner", label: "Complete beginner (never traded)" },
      { value: "researched", label: "I've researched but never traded" },
      { value: "few-trades", label: "I've made a few trades" },
      { value: "regular", label: "I trade regularly" },
    ],
  },
  {
    id: 2,
    title: "What do you want to trade?",
    type: "multiple",
    options: [
      { value: "stocks", label: "Stocks" },
      { value: "forex", label: "Forex" },
      { value: "crypto", label: "Cryptocurrency" },
      { value: "commodities", label: "Commodities" },
    ],
  },
  {
    id: 3,
    title: "What's your PRIMARY goal with trading?",
    type: "single",
    options: [
      { value: "extra-income", label: "Generate extra income" },
      { value: "replace-income", label: "Replace my full-time income" },
      { value: "wealth", label: "Build long-term wealth" },
      { value: "hobby", label: "Learn as a hobby" },
    ],
  },
  {
    id: 4,
    title: "What's your BIGGEST concern about trading?",
    type: "single",
    options: [
      { value: "risk", label: "Losing money / Risk management" },
      { value: "understanding", label: "Not understanding how it works" },
      { value: "time", label: "Not having enough time" },
      { value: "psychology", label: "Making bad decisions / Psychology" },
      { value: "capital", label: "Don't have enough capital to start" },
    ],
  },
  {
    id: 5,
    title: "How much time can you dedicate to trading each week?",
    type: "single",
    options: [
      { value: "1-3", label: "1-3 hours (casual)" },
      { value: "4-6", label: "4-6 hours (part-time)" },
      { value: "7-10", label: "7-10 hours (serious commitment)" },
      { value: "10+", label: "10+ hours (full-time focus)" },
    ],
  },
];

const QuizModal = ({ open, onOpenChange }: QuizModalProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswers>({
    experience: "",
    markets: [],
    goal: "",
    concern: "",
    timeCommitment: "",
  });

  const progress = (currentQuestion / questions.length) * 100;
  const question = questions[currentQuestion - 1];

  const handleSingleChoice = (value: string) => {
    const key = Object.keys(answers)[currentQuestion - 1] as keyof QuizAnswers;
    setAnswers({ ...answers, [key]: value });
  };

  const handleMultipleChoice = (value: string, checked: boolean) => {
    const currentMarkets = answers.markets;
    if (checked) {
      setAnswers({ ...answers, markets: [...currentMarkets, value] });
    } else {
      setAnswers({
        ...answers,
        markets: currentMarkets.filter((m) => m !== value),
      });
    }
  };

  const canProceed = () => {
    if (currentQuestion === 1) return answers.experience !== "";
    if (currentQuestion === 2) return answers.markets.length > 0;
    if (currentQuestion === 3) return answers.goal !== "";
    if (currentQuestion === 4) return answers.concern !== "";
    if (currentQuestion === 5) return answers.timeCommitment !== "";
    return false;
  };

  const handleNext = () => {
    if (currentQuestion < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Quiz submitted:", answers);
      setIsSubmitting(false);
      onOpenChange(false);
      // Reset for next time
      setCurrentQuestion(1);
      setAnswers({
        experience: "",
        markets: [],
        goal: "",
        concern: "",
        timeCommitment: "",
      });
    }, 3000);
  };

  const getCurrentValue = () => {
    if (currentQuestion === 1) return answers.experience;
    if (currentQuestion === 2) return answers.markets;
    if (currentQuestion === 3) return answers.goal;
    if (currentQuestion === 4) return answers.concern;
    if (currentQuestion === 5) return answers.timeCommitment;
    return "";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-background border-border">
        {isSubmitting ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-6">
            <Loader2 className="h-16 w-16 text-primary animate-spin" />
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-foreground">
                Analyzing your answers...
              </h3>
              <p className="text-muted-foreground">
                Creating your personalized roadmap...
              </p>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between mb-4">
                <DialogTitle className="text-lg font-semibold text-foreground">
                  Question {currentQuestion} of {questions.length}
                </DialogTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onOpenChange(false)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Progress value={progress} className="h-2" />
            </DialogHeader>

            <div className="py-6 space-y-6">
              <h2 className="text-2xl font-bold text-foreground">
                {question.title}
              </h2>

              {question.type === "single" ? (
                <RadioGroup
                  value={getCurrentValue() as string}
                  onValueChange={handleSingleChoice}
                  className="space-y-3"
                >
                  {question.options.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => handleSingleChoice(option.value)}
                    >
                      <RadioGroupItem
                        value={option.value}
                        id={option.value}
                      />
                      <Label
                        htmlFor={option.value}
                        className="flex-1 cursor-pointer text-base"
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
                      className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => {
                        const isChecked = (getCurrentValue() as string[]).includes(
                          option.value
                        );
                        handleMultipleChoice(option.value, !isChecked);
                      }}
                    >
                      <Checkbox
                        id={option.value}
                        checked={(getCurrentValue() as string[]).includes(
                          option.value
                        )}
                        onCheckedChange={(checked) =>
                          handleMultipleChoice(option.value, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={option.value}
                        className="flex-1 cursor-pointer text-base"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between gap-4 pt-4 border-t border-border">
              {currentQuestion > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}

              {currentQuestion < questions.length ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="flex-1 ml-auto bg-hero-button hover:bg-hero-button-hover"
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed()}
                  className="flex-1 ml-auto bg-hero-button hover:bg-hero-button-hover"
                >
                  Submit
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuizModal;
