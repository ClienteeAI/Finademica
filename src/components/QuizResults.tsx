import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, Trophy, RotateCcw, Video, Frown } from "lucide-react";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";
import { useClient } from "@/lib/clientContext";

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

interface QuizResultsProps {
  result: QuizResultData;
  onRetry: () => void;
}

const QuizResults = ({ result, onRetry }: QuizResultsProps) => {
  const { client } = useClient();
  const isPremiumTheme = client?.subdomain === 'finademica';
  const navigate = useNavigate();
  const [displayScore, setDisplayScore] = useState(result.score_percent);
  const [showOnlyWrong, setShowOnlyWrong] = useState(false);

  // Debug: log the result from webhook
  useEffect(() => {
    console.log("QuizResults received:", result);
  }, [result]);

  const isPassed = result.score_percent >= 75;

  // Animate score counting up on mount
  useEffect(() => {
    const targetScore = result.score_percent;
    
    // Start from 0 and animate to target
    setDisplayScore(0);
    
    const duration = 1500;
    const steps = 60;
    const increment = targetScore / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetScore) {
        setDisplayScore(Math.round(targetScore));
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [result.score_percent]);

  // Trigger confetti for passed (75%+)
  useEffect(() => {
    if (isPassed) {
      const timer = setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#FFD700', '#00D084', '#10B981', '#22C55E']
        });
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isPassed]);

  const filteredReview = showOnlyWrong 
    ? result.review?.filter(item => !item.is_correct) || []
    : result.review || [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Block */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className={cn(
          "overflow-hidden",
          isPremiumTheme 
            ? "bg-premium-bg/80 border-premium-gold/30" 
            : "bg-card border-border"
        )}>
          <CardContent className="pt-8 pb-8">
            {/* Score Display */}
            <div className="text-center space-y-6">
              
              {/* Icon based on result */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  ...(isPassed ? {} : { 
                    // Sad wobble animation for failed
                    rotate: [-5, 5, -5, 5, 0]
                  })
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  delay: 0.2,
                  rotate: { duration: 0.5, delay: 0.5 }
                }}
                className="flex justify-center"
              >
                {isPassed ? (
                  <Trophy className={cn("h-16 w-16", isPremiumTheme ? "text-premium-gold" : "text-emerald-500")} />
                ) : (
                  <Frown className="h-16 w-16 text-red-400" />
                )}
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={cn(
                  "text-2xl md:text-3xl font-bold",
                  isPremiumTheme ? "text-premium-gold font-serif" : "text-foreground"
                )}
              >
                {isPassed ? "Congratulations! 🎉" : "Keep Learning! 📚"}
              </motion.h2>

              {/* Score Circle */}
              <motion.div
                className="relative inline-block"
                initial={{ scale: 0.8 }}
                animate={{ 
                  scale: 1,
                  ...(!isPassed && {
                    // Shake animation for failed
                    x: [0, -8, 8, -8, 8, -4, 4, 0]
                  })
                }}
                transition={{ 
                  scale: { duration: 0.5 },
                  x: { duration: 0.6, delay: 0.6 }
                }}
              >
                {/* Glow effect for passed */}
                {isPassed && (
                  <motion.div
                    className={cn(
                      "absolute inset-0 rounded-full blur-2xl",
                      isPremiumTheme ? "bg-premium-gold/40" : "bg-emerald-500/40"
                    )}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: [0.4, 0.7, 0.4], scale: 1.3 }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                {/* Red pulse for failed */}
                {!isPassed && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-red-500/60"
                    initial={{ opacity: 0, scale: 1 }}
                    animate={{ opacity: [0, 0.8, 0], scale: [1, 1.4, 1.6] }}
                    transition={{ duration: 1.2, delay: 0.8 }}
                  />
                )}

                <div className={cn(
                  "relative w-36 h-36 md:w-44 md:h-44 rounded-full flex items-center justify-center border-4",
                  isPassed
                    ? (isPremiumTheme 
                      ? "bg-gradient-to-br from-premium-gold/20 to-premium-gold/40 border-premium-gold/60" 
                      : "bg-gradient-to-br from-emerald-500/20 to-emerald-600/40 border-emerald-500/60")
                    : "bg-gradient-to-br from-red-500/20 to-red-600/40 border-red-500/60"
                )}>
                  <div className="text-center">
                    <span className={cn(
                      "text-5xl md:text-6xl font-bold",
                      isPassed 
                        ? (isPremiumTheme ? "text-premium-gold" : "text-emerald-400") 
                        : "text-red-400"
                    )}>
                      {displayScore}%
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Pass score info */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className={cn("text-sm", isPremiumTheme ? "text-premium-text-muted" : "text-muted-foreground")}
              >
                Pass score: {result.pass_score}%
              </motion.p>

              {/* Status-specific messages */}
              <AnimatePresence>
                {isPassed ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, type: "spring" }}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Video className={cn("h-5 w-5", isPremiumTheme ? "text-premium-gold" : "text-emerald-500")} />
                      <span className={cn("text-lg font-semibold", isPremiumTheme ? "text-premium-gold" : "text-emerald-500")}>
                        {result.status === "daily_locked" 
                          ? "Daily Limit Reached" 
                          : result.unlocked_count > 0 
                            ? `${result.unlocked_count} Videos unlocked!` 
                            : "Quiz Passed!"}
                      </span>
                    </div>
                    <p className={cn("text-sm", isPremiumTheme ? "text-premium-text-muted" : "text-muted-foreground")}>
                      {result.status === "daily_locked" 
                        ? "You've already earned your videos for today. Come back tomorrow!" 
                        : "Great job! Your progress has been saved."}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="space-y-2"
                  >
                    <p className="text-red-400">
                      You need {result.pass_score}% to unlock videos.
                    </p>
                    <p className={cn("text-sm", isPremiumTheme ? "text-premium-text-muted" : "text-muted-foreground")}>
                      Don't give up - try again!
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-3 mt-8 justify-center"
            >
              {isPassed ? (
                <Button
                  onClick={() => navigate("/videos")}
                  size="lg"
                  className={cn(
                    isPremiumTheme
                      ? "bg-premium-gold hover:bg-premium-gold/90 text-premium-bg"
                      : "bg-primary hover:bg-primary/90"
                  )}
                >
                  <Video className="h-4 w-4 mr-2" />
                  Go to videos
                </Button>
              ) : (
                <>
                  <motion.div
                    animate={{ 
                      scale: [1, 1.08, 1],
                    }}
                    transition={{ 
                      duration: 0.6, 
                      delay: 1.5,
                      repeat: 2
                    }}
                  >
                    <Button
                      onClick={onRetry}
                      size="lg"
                      className={cn(
                        isPremiumTheme
                          ? "bg-premium-gold hover:bg-premium-gold/90 text-premium-bg"
                          : "bg-primary hover:bg-primary/90"
                      )}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Try again
                    </Button>
                  </motion.div>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigate("/videos")}
                    className={isPremiumTheme ? "border-premium-gold/30 text-premium-gold hover:bg-premium-gold/10" : ""}
                  >
                    Back to videos
                  </Button>
                </>
              )}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Question Review Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <Card className={cn(
          isPremiumTheme 
            ? "bg-premium-bg/80 border-premium-gold/30" 
            : "bg-card border-border"
        )}>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className={cn(isPremiumTheme ? "text-premium-gold font-serif" : "")}>
                Question Review
              </CardTitle>
              <div className="flex items-center gap-2">
                <Switch
                  id="show-wrong"
                  checked={showOnlyWrong}
                  onCheckedChange={setShowOnlyWrong}
                />
                <Label 
                  htmlFor="show-wrong" 
                  className={cn(
                    "text-sm cursor-pointer",
                    isPremiumTheme ? "text-premium-text-muted" : "text-muted-foreground"
                  )}
                >
                  Show only wrong answers
                </Label>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {(!result.review || result.review.length === 0) ? (
              <p className={cn(
                "text-center py-8",
                isPremiumTheme ? "text-premium-text-muted" : "text-muted-foreground"
              )}>
                No review data received.
              </p>
            ) : filteredReview.length === 0 ? (
              <p className={cn(
                "text-center py-8",
                isPremiumTheme ? "text-premium-text-muted" : "text-muted-foreground"
              )}>
                All answers were correct! 🎉
              </p>
            ) : (
              <div className="space-y-4">
                {filteredReview.map((item, index) => (
                  <motion.div
                    key={item.question_id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3 + index * 0.1 }}
                  >
                    <Card className={cn(
                      isPremiumTheme 
                        ? "bg-premium-bg/50 border-premium-gold/20" 
                        : "bg-muted/30 border-border"
                    )}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <p className={cn("font-medium", isPremiumTheme ? "text-premium-text" : "text-foreground")}>
                            {index + 1}. {item.question}
                          </p>
                          <Badge 
                            variant={item.is_correct ? "default" : "destructive"}
                            className={`shrink-0 ${
                              item.is_correct 
                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" 
                                : "bg-red-500/20 text-red-400 border-red-500/30"
                            }`}
                          >
                            {item.is_correct ? (
                              <><CheckCircle2 className="h-3 w-3 mr-1" /> Correct</>
                            ) : (
                              <><XCircle className="h-3 w-3 mr-1" /> Wrong</>
                            )}
                          </Badge>
                        </div>

                        <div className="grid gap-2">
                          {(item.options || []).map((option, optIndex) => {
                            const isUserAnswer = optIndex === item.user_answer_index;
                            const isCorrectAnswer = optIndex === item.correct_answer_index;
                            const optionLetter = String.fromCharCode(65 + optIndex);

                            let optionStyle = "";
                            if (isCorrectAnswer) {
                              optionStyle = "bg-emerald-500/20 border-emerald-500/50 text-emerald-300";
                            } else if (isUserAnswer && !item.is_correct) {
                              optionStyle = "bg-red-500/20 border-red-500/50 text-red-300";
                            } else {
                              optionStyle = isPremiumTheme 
                                ? "bg-premium-bg/30 border-premium-gold/10 text-premium-text-muted" 
                                : "bg-muted/20 border-border/50 text-muted-foreground";
                            }

                            return (
                              <div
                                key={optIndex}
                                className={`flex items-center gap-3 p-3 rounded-lg border ${optionStyle}`}
                              >
                                <span className="font-medium w-6">{optionLetter}.</span>
                                <span className="flex-1">{option}</span>
                                {isUserAnswer && (
                                  <span className="text-xs opacity-70">Your answer</span>
                                )}
                                {isCorrectAnswer && (
                                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default QuizResults;
