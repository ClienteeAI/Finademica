import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/AuthContext";
import { useClient } from "@/lib/clientContext";
import { Loader2, Trophy, Play, TrendingUp, BarChart3, Bitcoin, Package, CheckCircle2, Circle, Send } from "lucide-react";
import { toast } from "sonner";
import QuizLoadingAnimation from "@/components/QuizLoadingAnimation";
import { Progress } from "@/components/ui/progress";
import QuizResults from "@/components/QuizResults";

const GENERATE_WEBHOOK_URL = "https://clientee.app.n8n.cloud/webhook/674ea19a-33ae-40af-9794-6c641f1b8215";

type Module = "forex" | "stocks" | "crypto" | "commodities";

interface QuizQuestion {
  id: number | string;
  question: string;
  options: string[];
  correct_index?: number;
  correct_answer?: string;
}

interface WebhookResponse {
  quiz_id?: string;
  quiz?: {
    questions?: QuizQuestion[];
  };
  questions?: QuizQuestion[];
  [key: string]: unknown;
}

interface ReviewItem {
  question_id: string;
  question: string;
  options: string[];
  user_answer_index: number;
  correct_answer_index: number;
  is_correct: boolean;
}

interface QuizResultData {
  status: "passed" | "failed" | "daily_locked";
  score_percent: number;
  pass_score: number;
  attempt_id: string;
  attempted_at: string;
  next_allowed_at: string | null;
  unlocked_count: number;
  review: ReviewItem[];
}

interface SubmitResponse extends Partial<QuizResultData> {
  score?: number;
  passed?: boolean;
  message?: string;
  correct_count?: number;
  total_questions?: number;
  [key: string]: unknown;
}

const moduleOptions: { id: Module; label: string; icon: React.ReactNode }[] = [
  { id: "forex", label: "Forex", icon: <TrendingUp className="h-10 w-10" /> },
  { id: "stocks", label: "Stocks", icon: <BarChart3 className="h-10 w-10" /> },
  { id: "crypto", label: "Crypto", icon: <Bitcoin className="h-10 w-10" /> },
  { id: "commodities", label: "Commodities", icon: <Package className="h-10 w-10" /> },
];

const SUBMIT_WEBHOOK_URL = "https://clientee.app.n8n.cloud/webhook-test/quiz/submit";

const Quiz = () => {
  const { user, profile } = useAuth();
  const { client } = useClient();
  const isNasrTheme = client?.subdomain === "nasr";

  const [step, setStep] = useState<"intro" | "select-module" | "loading" | "quiz" | "submitting" | "results">("intro");
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitResponse, setSubmitResponse] = useState<SubmitResponse | null>(null);

  const handleAttemptQuiz = () => {
    setStep("select-module");
  };

  const handleModuleSelect = async (module: Module) => {
    setSelectedModule(module);
    setStep("loading");

    try {
      const payload = {
        user_id: user?.id || null,
        client_id: client?.id || null,
        asset_type: module,
        module: module,
        level: 1,
      };

      const response = await fetch(GENERATE_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await response.text();

      if (text) {
        try {
          const data: WebhookResponse = JSON.parse(text);
          // Handle both { quiz: { questions: [...] } } and { questions: [...] } formats
          const questionsData = data.quiz?.questions || data.questions || [];
          setQuizId(data.quiz_id || null);
          setQuestions(questionsData);
          setStep("quiz");
          toast.success(`Quiz loaded! ${questionsData.length} questions`);
        } catch {
          toast.error("Invalid response from server");
          setStep("select-module");
        }
      } else {
        toast.error("Empty response from server");
        setStep("select-module");
      }
    } catch (error) {
      console.error("Quiz generation error:", error);
      toast.error("Failed to load quiz. Please try again.");
      setStep("select-module");
    }
  };

  const handleReset = () => {
    setStep("intro");
    setSelectedModule(null);
    setQuizId(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setSubmitResponse(null);
  };

  const handleSelectAnswer = (questionIndex: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    const unansweredCount = questions.length - Object.keys(answers).length;
    if (unansweredCount > 0) {
      toast.error(`Please answer all questions. ${unansweredCount} remaining.`);
      return;
    }

    setStep("submitting");

    // Build the submission payload with all user and quiz information
    const questionsWithAnswers = questions.map((q, idx) => ({
      question_id: q.id,
      question: q.question,
      options: q.options,
      correct_index: q.correct_index,
      correct_answer: q.correct_answer || null,
      user_answer: answers[idx] || null,
      user_answer_index: q.options?.indexOf(answers[idx]) ?? -1,
    }));

    const payload = {
      // User information
      user: {
        id: profile?.id || null,
        auth_user_id: user?.id || null,
        email: profile?.email || user?.email || null,
        first_name: profile?.first_name || null,
        last_name: profile?.last_name || null,
        phone: profile?.phone || null,
        is_admin: profile?.is_admin || false,
        client_id: profile?.client_id || null,
        quiz_answers: profile?.quiz_answers || null,
      },
      // Client information
      client: {
        id: client?.id || null,
        subdomain: client?.subdomain || null,
        company_name: client?.company_name || null,
      },
      // Quiz information
      quiz: {
        quiz_id: quizId,
        module: selectedModule,
        level: 1,
        total_questions: questions.length,
        answered_count: Object.keys(answers).length,
        submitted_at: new Date().toISOString(),
      },
      // Questions with answers
      questions: questionsWithAnswers,
    };

    try {
      const response = await fetch(SUBMIT_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      console.log("Quiz webhook raw response:", text);
      
      if (text) {
        try {
          const data: SubmitResponse = JSON.parse(text);
          console.log("Quiz webhook parsed response:", data);
          setSubmitResponse(data);
        } catch {
          // Non-JSON response, store as message
          console.log("Quiz webhook non-JSON response");
          setSubmitResponse({ message: text });
        }
      } else {
        console.log("Quiz webhook empty response");
        setSubmitResponse({ message: "Quiz submitted successfully!" });
      }

      setStep("results");
      toast.success("Quiz submitted!");
    } catch (error) {
      console.error("Quiz submit error:", error);
      toast.error("Failed to submit quiz. Please try again.");
      setStep("quiz");
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const answeredCount = Object.keys(answers).length;

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className={`text-3xl font-bold ${isNasrTheme ? "font-playfair text-nasr-text" : "text-foreground"}`}>
            Unlock More Videos
          </h1>
          <p className={`text-lg ${isNasrTheme ? "text-nasr-text-muted" : "text-muted-foreground"}`}>
            Complete this quiz to personalize your learning path and unlock additional content
          </p>
        </div>

        {/* Main Content */}
        <Card className={`${isNasrTheme ? "bg-nasr-panel border-gold/20" : "bg-card border-border"}`}>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className={`text-xl ${isNasrTheme ? "text-nasr-text font-playfair" : "text-foreground"}`}>
                {step === "intro" && "Ready to Start?"}
                {step === "select-module" && "Choose Your Module"}
                {step === "loading" && "Loading Quiz..."}
                {step === "quiz" && `${selectedModule?.charAt(0).toUpperCase()}${selectedModule?.slice(1)} Quiz`}
              </CardTitle>
              <Trophy className={`h-6 w-6 ${isNasrTheme ? "text-gold" : "text-primary"}`} />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step: Intro */}
            {step === "intro" && (
              <div className="text-center py-12 space-y-6">
                <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center ${isNasrTheme ? "bg-gold/20" : "bg-primary/20"}`}>
                  <Play className={`h-10 w-10 ${isNasrTheme ? "text-gold" : "text-primary"}`} />
                </div>
                <div className="space-y-2">
                  <h3 className={`text-xl font-semibold ${isNasrTheme ? "text-nasr-text" : "text-foreground"}`}>
                    Start Your Personalized Quiz
                  </h3>
                  <p className={`max-w-md mx-auto ${isNasrTheme ? "text-nasr-text-muted" : "text-muted-foreground"}`}>
                    Answer a few questions to unlock videos tailored to your trading experience and goals.
                  </p>
                </div>
                <Button
                  onClick={handleAttemptQuiz}
                  size="lg"
                  className={`px-8 ${isNasrTheme ? "bg-gold hover:bg-gold-dark text-nasr-bg" : ""}`}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Attempt Quiz
                </Button>
              </div>
            )}

            {/* Step: Select Module */}
            {step === "select-module" && (
              <div className="space-y-6">
                <p className={`text-center ${isNasrTheme ? "text-nasr-text-muted" : "text-muted-foreground"}`}>
                  Select a module to take the quiz for:
                </p>
                <div className="grid grid-cols-2 gap-6">
                  {moduleOptions.map((option) => (
                    <Button
                      key={option.id}
                      onClick={() => handleModuleSelect(option.id)}
                      variant="outline"
                      className={`h-36 md:h-44 flex flex-col items-center justify-center gap-4 transition-all border-2 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] ${
                        isNasrTheme
                          ? "border-gold/40 text-nasr-text hover:bg-gold/20 hover:border-gold bg-nasr-bg/50"
                          : "border-primary/30 hover:bg-primary/10 hover:border-primary bg-card"
                      }`}
                    >
                      <span className={`${isNasrTheme ? "text-gold" : "text-primary"}`}>{option.icon}</span>
                      <span className="font-bold text-xl md:text-2xl">{option.label}</span>
                    </Button>
                  ))}
                </div>
                <div className="text-center pt-4">
                  <Button
                    onClick={handleReset}
                    variant="ghost"
                    className={isNasrTheme ? "text-nasr-text-muted hover:text-nasr-text" : ""}
                  >
                    Back
                  </Button>
                </div>
              </div>
            )}

            {/* Step: Loading */}
            {step === "loading" && (
              <QuizLoadingAnimation 
                module={selectedModule || "trading"} 
                isNasrTheme={isNasrTheme} 
              />
            )}

            {/* Step: Submitting */}
            {step === "submitting" && (
              <div className="text-center py-12 space-y-4">
                <Loader2 className={`h-12 w-12 mx-auto animate-spin ${isNasrTheme ? "text-gold" : "text-primary"}`} />
                <p className={isNasrTheme ? "text-nasr-text-muted" : "text-muted-foreground"}>
                  Submitting your answers...
                </p>
              </div>
            )}

            {/* Step: Quiz */}
            {step === "quiz" && questions.length > 0 && (
              <div className="space-y-6">
                {/* Progress Header */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className={isNasrTheme ? "text-nasr-text-muted" : "text-muted-foreground"}>
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </span>
                    <span className={isNasrTheme ? "text-gold" : "text-primary"}>
                      {answeredCount}/{questions.length} answered
                    </span>
                  </div>
                  <Progress 
                    value={progress} 
                    className={`h-2 ${isNasrTheme ? "bg-gold/20" : ""}`}
                  />
                </div>

                {/* Question Card */}
                <div className={`p-6 rounded-xl border animate-fade-in ${
                  isNasrTheme ? "bg-nasr-bg/50 border-gold/20" : "bg-muted/30 border-border"
                }`}>
                  <h3 className={`text-lg font-semibold mb-6 ${isNasrTheme ? "text-nasr-text" : "text-foreground"}`}>
                    {currentQuestion.question}
                  </h3>
                  
                  <div className="space-y-3">
                    {currentQuestion.options?.map((option, optIndex) => {
                      const isSelected = answers[currentQuestionIndex] === option;
                      return (
                        <button
                          key={optIndex}
                          onClick={() => handleSelectAnswer(currentQuestionIndex, option)}
                          className={`w-full p-4 rounded-lg border text-left transition-all duration-200 flex items-center gap-3 ${
                            isSelected
                              ? isNasrTheme
                                ? "border-gold bg-gold/20 shadow-md"
                                : "border-primary bg-primary/10 shadow-md"
                              : isNasrTheme
                                ? "border-gold/20 hover:border-gold/50 hover:bg-gold/5"
                                : "border-border hover:border-primary/50 hover:bg-muted/50"
                          }`}
                        >
                          {isSelected ? (
                            <CheckCircle2 className={`h-5 w-5 flex-shrink-0 ${isNasrTheme ? "text-gold" : "text-primary"}`} />
                          ) : (
                            <Circle className={`h-5 w-5 flex-shrink-0 ${isNasrTheme ? "text-gold/40" : "text-muted-foreground"}`} />
                          )}
                          <span className={`${isNasrTheme ? "text-nasr-text" : "text-foreground"}`}>
                            {option}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Question Navigation Dots */}
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {questions.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`w-8 h-8 rounded-full text-xs font-medium transition-all ${
                        idx === currentQuestionIndex
                          ? isNasrTheme
                            ? "bg-gold text-nasr-bg"
                            : "bg-primary text-primary-foreground"
                          : answers[idx]
                            ? isNasrTheme
                              ? "bg-gold/30 text-nasr-text"
                              : "bg-primary/30 text-foreground"
                            : isNasrTheme
                              ? "bg-gold/10 text-nasr-text-muted hover:bg-gold/20"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-4">
                  <Button
                    onClick={handlePrevQuestion}
                    variant="outline"
                    disabled={currentQuestionIndex === 0}
                    className={isNasrTheme ? "border-gold/30 text-nasr-text hover:bg-gold/10 disabled:opacity-30" : ""}
                  >
                    Previous
                  </Button>

                  <div className="flex gap-3">
                    {currentQuestionIndex < questions.length - 1 ? (
                      <Button
                        onClick={handleNextQuestion}
                        className={isNasrTheme ? "bg-gold hover:bg-gold-dark text-nasr-bg" : ""}
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSubmitQuiz}
                        className={isNasrTheme ? "bg-gold hover:bg-gold-dark text-nasr-bg" : ""}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Submit Quiz
                      </Button>
                    )}
                  </div>
                </div>

                <div className="text-center pt-2">
                  <Button
                    onClick={handleReset}
                    variant="ghost"
                    size="sm"
                    className={isNasrTheme ? "text-nasr-text-muted hover:text-nasr-text" : "text-muted-foreground"}
                  >
                    Cancel Quiz
                  </Button>
                </div>
              </div>
            )}

            {/* Step: No Questions */}
            {step === "quiz" && questions.length === 0 && (
              <div className="text-center py-12 space-y-4">
                <p className={isNasrTheme ? "text-nasr-text-muted" : "text-muted-foreground"}>
                  No questions received from the server.
                </p>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className={isNasrTheme ? "border-gold/30 text-nasr-text hover:bg-gold/10" : ""}
                >
                  Try Again
                </Button>
              </div>
            )}

            {/* Step: Results */}
            {step === "results" && submitResponse && (
              <QuizResults
                result={{
                  status: submitResponse.status || (
                    submitResponse.passed === true ? "passed" :
                    submitResponse.passed === false ? "failed" : 
                    (submitResponse.score_percent ?? submitResponse.score ?? 0) >= (submitResponse.pass_score ?? 75) ? "passed" : "failed"
                  ),
                  score_percent: submitResponse.score_percent ?? submitResponse.score ?? 0,
                  pass_score: submitResponse.pass_score ?? 75,
                  attempt_id: submitResponse.attempt_id ?? quizId ?? "",
                  attempted_at: submitResponse.attempted_at ?? new Date().toISOString(),
                  next_allowed_at: submitResponse.next_allowed_at ?? null,
                  unlocked_count: submitResponse.unlocked_count ?? 0,
                  review: submitResponse.review ?? questions.map((q, idx) => ({
                    question_id: String(q.id),
                    question: q.question,
                    options: q.options || [],
                    user_answer_index: q.options?.indexOf(answers[idx]) ?? -1,
                    correct_answer_index: q.correct_index ?? -1,
                    is_correct: q.correct_index !== undefined 
                      ? q.options?.indexOf(answers[idx]) === q.correct_index
                      : q.correct_answer !== undefined 
                        ? answers[idx] === q.correct_answer 
                        : false
                  }))
                }}
                onRetry={handleReset}
                isNasrTheme={isNasrTheme}
              />
            )}

            {/* Step: Results - No response */}
            {step === "results" && !submitResponse && (
              <div className="text-center py-12 space-y-6">
                <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center ${isNasrTheme ? "bg-gold/20" : "bg-primary/20"}`}>
                  <Trophy className={`h-10 w-10 ${isNasrTheme ? "text-gold" : "text-primary"}`} />
                </div>
                <div className="space-y-2">
                  <h3 className={`text-2xl font-semibold ${isNasrTheme ? "text-nasr-text" : "text-foreground"}`}>
                    Quiz Submitted
                  </h3>
                  <p className={`${isNasrTheme ? "text-nasr-text-muted" : "text-muted-foreground"}`}>
                    No detailed results received from server.
                  </p>
                </div>
                <Button
                  onClick={handleReset}
                  size="lg"
                  className={`px-8 ${isNasrTheme ? "bg-gold hover:bg-gold-dark text-nasr-bg" : ""}`}
                >
                  Take Another Quiz
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Quiz;
