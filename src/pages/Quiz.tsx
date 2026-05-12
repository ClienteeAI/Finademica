import { useState } from "react";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/AuthContext";
import { useClient } from "@/lib/clientContext";
import { Loader2, Trophy, Play, TrendingUp, BarChart3, Bitcoin, Package, CheckCircle2, Circle, Send, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import QuizLoadingAnimation from "@/components/QuizLoadingAnimation";
import { Progress } from "@/components/ui/progress";
import QuizResults from "@/components/QuizResults";

// No generation webhook needed, fetching from Supabase directly
// const GENERATE_WEBHOOK_URL = "...";

type Module = "forex" | "stocks" | "crypto" | "commodities";

interface QuizQuestion {
  id: number | string;
  question: string;
  options: string[];
  correct_index?: number;
  correct_answer?: string;
  explanation?: string;
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

const SUBMIT_WEBHOOK_URL = "https://n8n.srv1474318.hstgr.cloud/webhook/quiz-attemt-res-finademica";

const Quiz = () => {
  const { user, profile } = useAuth();
  const { client } = useClient();
  const isPremiumTheme = client?.subdomain === "finademica";

  const [step, setStep] = useState<"intro" | "select-module" | "loading" | "quiz" | "submitting" | "results">("intro");
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitResponse, setSubmitResponse] = useState<SubmitResponse | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [quizLevel, setQuizLevel] = useState<string>("Beginner");
  const [unlockedCount, setUnlockedCount] = useState(0);

  const checkDailyLimit = async () => {
    if (!user?.id) return false;
    const { data, error } = await supabase.rpc('check_quiz_daily_limit', { p_user_id: user.id });
    if (error) {
      console.error("Error checking daily limit:", error);
      return false;
    }
    return data === true;
  };

  const handleAttemptQuiz = async () => {
    const isLocked = await checkDailyLimit();
    if (isLocked) {
      setStep("results");
      setSubmitResponse({
        status: "daily_locked",
        score_percent: 100,
        message: "You have already passed a quiz today! Come back tomorrow for more.",
        passed: true
      });
      return;
    }
    setStep("select-module");
  };

  const handleModuleSelect = async (module: Module) => {
    setSelectedModule(module);
    setStep("loading");

    try {
      // Determine question count based on experience level
      const rawLevel = (profile?.quiz_answers as any)?.experience_level || "beginner";
      
      let questionCount = 5;
      let levelLabel = "Beginner";
      
      if (rawLevel === "regular") {
        questionCount = 15;
        levelLabel = "Elite";
      } else if (rawLevel === "few-trades") {
        questionCount = 10;
        levelLabel = "Intermediate";
      } else {
        questionCount = 5;
        levelLabel = "Beginner";
      }

      setQuizLevel(levelLabel);

      // Fetch questions from Supabase
      const { data, error } = await supabase
        .from("ai_quiz_questions")
        .select("*")
        .eq("module", module)
        .eq("level", levelLabel);

      if (error) throw error;

      if (data && data.length > 0) {
        // Shuffle questions and options
        const shuffledQuestions = [...data].sort(() => Math.random() - 0.5);
        const selectedQuestions = shuffledQuestions.slice(0, questionCount).map(q => {
          const originalOptions = Array.isArray(q.options) ? [...q.options] : [];
          const correctOptionText = originalOptions[q.correct_option];
          
          // Shuffle the options array
          const shuffledOptions = [...originalOptions].sort(() => Math.random() - 0.5);
          
          // Find the new index of the correct answer
          const newCorrectIndex = shuffledOptions.indexOf(correctOptionText);
          
          return {
            id: q.id,
            question: q.question,
            options: shuffledOptions,
            correct_index: newCorrectIndex !== -1 ? newCorrectIndex : q.correct_option,
            explanation: q.explanation
          };
        });

        setQuizId(`quiz_${module}_${levelLabel}_${Date.now()}`);
        setQuestions(selectedQuestions);
        setStep("quiz");
        toast.success(`${selectedQuestions.length} questions loaded from library!`);
      } else {
        console.warn(`No questions found for ${module} at ${levelLabel} level.`);
        toast.error(`Library is empty for ${module} ${levelLabel}. Seeding in progress...`);
        setStep("select-module");
      }
    } catch (error) {
      console.error("Quiz Fetch Error:", error);
      toast.error("Failed to load questions from database.");
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
    if (isAnswering) return; // Prevent multiple clicks during feedback
    
    setIsAnswering(true);
    setAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
    
    // Evaluate instantly
    const currentQ = questions[questionIndex];
    const isCorrect = currentQ.correct_index !== undefined 
      ? currentQ.options[currentQ.correct_index] === answer
      : currentQ.correct_answer !== undefined
        ? currentQ.correct_answer === answer
        : null;

    if (isCorrect !== null) {
      setLastCorrect(isCorrect);
      setShowFeedback(true);
      
      // Auto-advance after a delay
      setTimeout(() => {
        setShowFeedback(false);
        setLastCorrect(null);
        setIsAnswering(false);
        
        if (questionIndex < questions.length - 1) {
          setCurrentQuestionIndex(questionIndex + 1);
        }
      }, 1500);
    } else {
      setIsAnswering(false);
    }
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
      const score = questions.reduce((acc, q, idx) => {
        const isCorrect = q.correct_index !== undefined 
          ? q.options[q.correct_index] === answers[idx]
          : q.correct_answer !== undefined
            ? q.correct_answer === answers[idx]
            : false;
        return acc + (isCorrect ? 1 : 0);
      }, 0);

      const scorePercent = Math.round((score / questions.length) * 100);
      const isPassed = scorePercent >= 75;

      // Add results to payload
      const finalPayload = {
        ...payload,
        results: {
          score,
          score_percent: scorePercent,
          passed: isPassed,
          min_pass_score: 75
        }
      };

      // 1. Save to Supabase
      try {
        await supabase.from("quiz_attempts").insert({
          user_id: user?.id,
          client_id: client?.id,
          quiz_key: selectedModule || "general",
          score_percent: scorePercent,
          passed: isPassed,
          metadata: {
            answers: answers,
            questions: questions.map(q => ({
              id: q.id,
              question: q.question,
              correct: q.correct_answer || (q.correct_index !== undefined ? q.options[q.correct_index] : null)
            })),
            level: quizLevel
          },
          started_at: new Date(Date.now() - 60000).toISOString(), // Estimated
          submitted_at: new Date().toISOString()
        });

        // 1b. Unlock videos if passed
        if (isPassed && user?.id && client?.id) {
          console.log("Unlocking videos for user:", user.id);
          const { data: unlockCount, error: unlockError } = await supabase.rpc('unlock_videos_after_quiz', {
            p_client_id: client.id,
            p_quiz_id: quizId || "general",
            p_quiz_score: scorePercent,
            p_user_id: user.id
          });
          
          if (unlockError) {
            console.error("Video unlock error:", unlockError);
          } else {
            const count = Number(unlockCount || 0);
            console.log(`Successfully unlocked ${count} videos`);
            setUnlockedCount(count);
            if (count > 0) {
              toast.success(`Congratulations! You unlocked ${count} new videos!`);
            } else {
              console.log("No new videos were available to unlock for this user/quiz.");
            }
          }
        }
      } catch (dbError) {
        console.error("Database save error:", dbError);
      }

      // 2. Prepare Local Results (Fallback/Primary)
      const localResults = {
        status: isPassed ? "passed" : "failed",
        score_percent: scorePercent,
        score: score,
        passed: isPassed,
        pass_score: 75,
        questions_count: questions.length,
        message: isPassed ? "Congratulations! You passed the quiz." : "Keep learning! You need 75% to pass.",
      };

      // 3. Send to Webhook (CRM) - Non-blocking for the UI
      try {
        const response = await fetch(SUBMIT_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalPayload),
        });

        if (response.ok) {
          const text = await response.text();
          if (text) {
            try {
              const serverData = JSON.parse(text);
              // Merge server data into local results
              setSubmitResponse({ ...localResults, ...serverData });
            } catch {
              setSubmitResponse({ ...localResults, message: text });
            }
          } else {
            setSubmitResponse(localResults);
          }
        } else {
          console.warn("Webhook returned non-OK status");
          setSubmitResponse(localResults);
        }
      } catch (webhookError) {
        console.error("Webhook submission failed:", webhookError);
        // Still show results locally even if webhook fails
        setSubmitResponse(localResults);
        toast.error("Could not sync results to CRM, but your progress was saved locally.");
      }

      // 4. Award XP points if passed
      if (isPassed && user?.id && client?.id) {
        try {
          const xpAmount = 100;
          await supabase.from("activity_log").insert({
            user_id: user.id,
            client_id: client.id,
            activity_type: "quiz_pass",
            points_awarded: xpAmount,
            activity_data: {
              module: selectedModule,
              level: quizLevel,
              score: scorePercent
            }
          });
          console.log(`Awarded ${xpAmount} XP for passing quiz`);
          toast.success(`+${xpAmount} XP earned!`);
        } catch (xpError) {
          console.error("Error awarding XP:", xpError);
        }
      }

      setStep("results");
      toast.success("Quiz submitted!");
    } catch (error) {
      console.error("Quiz submit error:", error);
      toast.error("There was an error processing your quiz results.");
      setStep("results"); // Fallback to showing results if we have them
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const answeredCount = Object.keys(answers).length;

  return (
    <SidebarLayout>
      <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto">
        {/* Header - more compact on mobile */}
        <div className="text-center space-y-1 md:space-y-2">
          <h1 className={`text-2xl md:text-3xl font-bold ${isPremiumTheme ? "font-playfair text-premium-text" : "text-foreground"}`}>
            Unlock More Videos
          </h1>
          <p className={`text-sm md:text-lg ${isPremiumTheme ? "text-premium-text-muted" : "text-muted-foreground"}`}>
            Complete this quiz to unlock additional content
          </p>
        </div>

        {/* Main Content */}
        <Card className={`${isPremiumTheme ? "bg-premium-panel border-premium-gold/20" : "bg-card border-border"}`}>
          <CardHeader className="pb-3 md:pb-4 px-4 md:px-6 pt-4 md:pt-6">
            <div className="flex items-center justify-between">
              <CardTitle className={`text-lg md:text-xl ${isPremiumTheme ? "text-premium-text font-playfair" : "text-foreground"}`}>
                {step === "intro" && "Ready to Start?"}
                {step === "select-module" && "Choose Your Module"}
                {step === "loading" && "Loading Quiz..."}
                {step === "quiz" && `${selectedModule?.charAt(0).toUpperCase()}${selectedModule?.slice(1)} Quiz`}
              </CardTitle>
              <Trophy className={`h-5 w-5 md:h-6 md:w-6 ${isPremiumTheme ? "text-premium-gold" : "text-primary"}`} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6 px-4 md:px-6 pb-5 md:pb-6">
            {/* Step: Intro */}
            {step === "intro" && (
              <div className="text-center py-8 md:py-12 space-y-4 md:space-y-6">
                <div className={`mx-auto w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center ${isPremiumTheme ? "bg-premium-gold/20" : "bg-primary/20"}`}>
                  <Play className={`h-8 w-8 md:h-10 md:w-10 ${isPremiumTheme ? "text-premium-gold" : "text-primary"}`} />
                </div>
                <div className="space-y-1.5 md:space-y-2">
                  <h3 className={`text-lg md:text-xl font-semibold ${isPremiumTheme ? "text-premium-text" : "text-foreground"}`}>
                    Start Your Quiz
                  </h3>
                  <p className={`text-sm md:text-base max-w-md mx-auto px-4 ${isPremiumTheme ? "text-premium-text-muted" : "text-muted-foreground"}`}>
                    Answer a few questions to unlock videos tailored to your goals.
                  </p>
                </div>
                <Button
                  onClick={handleAttemptQuiz}
                  size="lg"
                  className={`px-6 md:px-8 h-12 md:h-11 text-base ${isPremiumTheme ? "bg-premium-gold hover:bg-premium-gold-dark text-premium-bg" : ""}`}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Attempt Quiz
                </Button>
              </div>
            )}

            {/* Step: Select Module */}
            {step === "select-module" && (
              <div className="space-y-4 md:space-y-6">
                <p className={`text-center text-sm md:text-base ${isPremiumTheme ? "text-premium-text-muted" : "text-muted-foreground"}`}>
                  Select a module:
                </p>
                <div className="grid grid-cols-2 gap-3 md:gap-6">
                  {moduleOptions.map((option) => (
                    <Button
                      key={option.id}
                      onClick={() => handleModuleSelect(option.id)}
                      variant="outline"
                      className={`h-28 md:h-36 lg:h-44 flex flex-col items-center justify-center gap-2 md:gap-4 transition-all border-2 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] ${
                        isPremiumTheme
                          ? "border-premium-gold/40 text-premium-text hover:bg-premium-gold/20 hover:border-premium-gold bg-premium-bg/50"
                          : "border-primary/30 hover:bg-primary/10 hover:border-primary bg-card"
                      }`}
                    >
                      <span className={`${isPremiumTheme ? "text-premium-gold" : "text-primary"} [&>svg]:h-8 [&>svg]:w-8 md:[&>svg]:h-10 md:[&>svg]:w-10`}>{option.icon}</span>
                      <span className="font-bold text-base md:text-xl lg:text-2xl">{option.label}</span>
                    </Button>
                  ))}
                </div>
                <div className="text-center pt-2 md:pt-4">
                  <Button
                    onClick={handleReset}
                    variant="ghost"
                    className={`h-11 ${isPremiumTheme ? "text-premium-text-muted hover:text-premium-text" : ""}`}
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
                isPremiumTheme={isPremiumTheme} 
              />
            )}

            {/* Step: Submitting */}
            {step === "submitting" && (
              <div className="text-center py-12 space-y-4">
                <Loader2 className={`h-12 w-12 mx-auto animate-spin ${isPremiumTheme ? "text-premium-gold" : "text-primary"}`} />
                <p className={isPremiumTheme ? "text-premium-text-muted" : "text-muted-foreground"}>
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
                    <span className={isPremiumTheme ? "text-premium-text-muted" : "text-muted-foreground"}>
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </span>
                    <span className={isPremiumTheme ? "text-premium-gold" : "text-primary"}>
                      {answeredCount}/{questions.length} answered
                    </span>
                  </div>
                  <Progress 
                    value={progress} 
                    className={`h-2 ${isPremiumTheme ? "bg-premium-gold/20" : ""}`}
                  />
                </div>

                {/* Question Card */}
                <div className={`p-6 rounded-xl border animate-fade-in ${
                  isPremiumTheme ? "bg-premium-bg/50 border-premium-gold/20" : "bg-muted/30 border-border"
                }`}>
                  <h3 className={`text-lg font-semibold mb-6 ${isPremiumTheme ? "text-premium-text" : "text-foreground"}`}>
                    {currentQuestion.question}
                  </h3>
                  
                  <div className="space-y-3 relative">
                    {/* Feedback Overlay */}
                    <AnimatePresence>
                      {showFeedback && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className={`absolute inset-0 z-10 flex items-center justify-center rounded-xl backdrop-blur-[2px] ${
                            lastCorrect ? "bg-emerald-500/10" : "bg-red-500/10"
                          }`}
                        >
                          <div className={`flex flex-col items-center gap-2 p-4 rounded-2xl shadow-2xl ${
                            lastCorrect ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                          }`}>
                            {lastCorrect ? (
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 0.5 }}
                              >
                                <CheckCircle2 className="h-12 w-12" />
                              </motion.div>
                            ) : (
                              <motion.div
                                animate={{ x: [0, -10, 10, -10, 10, 0] }}
                                transition={{ duration: 0.4 }}
                              >
                                <XCircle className="h-12 w-12" />
                              </motion.div>
                            )}
                            <span className="font-bold text-lg">{lastCorrect ? "CORRECT!" : "WRONG!"}</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {currentQuestion.options?.map((option, optIndex) => {
                      const isSelected = answers[currentQuestionIndex] === option;
                      const isCorrect = currentQuestion.correct_index === optIndex || currentQuestion.correct_answer === option;
                      
                      let feedbackStyle = "";
                      if (showFeedback) {
                        if (isCorrect) feedbackStyle = "border-emerald-500 bg-emerald-500/20 text-emerald-400";
                        else if (isSelected && !isCorrect) feedbackStyle = "border-red-500 bg-red-500/20 text-red-400";
                      }

                      return (
                        <button
                          key={optIndex}
                          onClick={() => handleSelectAnswer(currentQuestionIndex, option)}
                          disabled={isAnswering}
                          className={`w-full p-4 rounded-lg border text-left transition-all duration-200 flex items-center gap-3 ${
                            feedbackStyle || (isSelected
                              ? isPremiumTheme
                                ? "border-premium-gold bg-premium-gold/20 shadow-md"
                                : "border-primary bg-primary/10 shadow-md"
                              : isPremiumTheme
                                ? "border-premium-gold/20 hover:border-premium-gold/50 hover:bg-premium-gold/5"
                                : "border-border hover:border-primary/50 hover:bg-muted/50")
                          }`}
                        >
                          {isSelected ? (
                            <CheckCircle2 className={`h-5 w-5 flex-shrink-0 ${isPremiumTheme ? "text-premium-gold" : "text-primary"}`} />
                          ) : (
                            <Circle className={`h-5 w-5 flex-shrink-0 ${isPremiumTheme ? "text-premium-gold/40" : "text-muted-foreground"}`} />
                          )}
                          <span className={isPremiumTheme ? "text-premium-text" : "text-foreground"}>
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
                          ? isPremiumTheme
                            ? "bg-premium-gold text-premium-bg"
                            : "bg-primary text-primary-foreground"
                          : answers[idx]
                            ? isPremiumTheme
                              ? "bg-premium-gold/30 text-premium-text"
                              : "bg-primary/30 text-foreground"
                            : isPremiumTheme
                              ? "bg-premium-gold/10 text-premium-text-muted hover:bg-premium-gold/20"
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
                    className={isPremiumTheme ? "border-premium-gold/30 text-premium-text hover:bg-premium-gold/10 disabled:opacity-30" : ""}
                  >
                    Previous
                  </Button>

                  <div className="flex gap-3">
                    {currentQuestionIndex < questions.length - 1 ? (
                      <Button
                        onClick={handleNextQuestion}
                        className={isPremiumTheme ? "bg-premium-gold hover:bg-premium-gold-dark text-premium-bg" : ""}
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSubmitQuiz}
                        className={isPremiumTheme ? "bg-premium-gold hover:bg-premium-gold-dark text-premium-bg" : ""}
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
                    className={isPremiumTheme ? "text-premium-text-muted hover:text-premium-text" : "text-muted-foreground"}
                  >
                    Cancel Quiz
                  </Button>
                </div>
              </div>
            )}

            {/* Step: No Questions */}
            {step === "quiz" && questions.length === 0 && (
              <div className="text-center py-12 space-y-4">
                <p className={isPremiumTheme ? "text-premium-text-muted" : "text-muted-foreground"}>
                  No questions received from the server.
                </p>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className={isPremiumTheme ? "border-premium-gold/30 text-premium-text hover:bg-premium-gold/10" : ""}
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
                  unlocked_count: unlockedCount || submitResponse.unlocked_count || 0,
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
                isPremiumTheme={isPremiumTheme}
              />
            )}

            {/* Step: Results - No response */}
            {step === "results" && !submitResponse && (
              <div className="text-center py-12 space-y-6">
                <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center ${isPremiumTheme ? "bg-premium-gold/20" : "bg-primary/20"}`}>
                  <Trophy className={`h-10 w-10 ${isPremiumTheme ? "text-premium-gold" : "text-primary"}`} />
                </div>
                <div className="space-y-2">
                  <h3 className={`text-2xl font-semibold ${isPremiumTheme ? "text-premium-text" : "text-foreground"}`}>
                    Quiz Submitted
                  </h3>
                  <p className={`${isPremiumTheme ? "text-premium-text-muted" : "text-muted-foreground"}`}>
                    No detailed results received from server.
                  </p>
                </div>
                <Button
                  onClick={handleReset}
                  size="lg"
                  className={`px-8 ${isPremiumTheme ? "bg-premium-gold hover:bg-premium-gold-dark text-premium-bg" : ""}`}
                >
                  Take Another Quiz
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  );
};

export default Quiz;
