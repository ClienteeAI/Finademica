import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, Lock, Trophy, RotateCcw, Video, Calendar, Clock } from "lucide-react";
import confetti from "canvas-confetti";
import { format } from "date-fns";

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
  isNasrTheme?: boolean;
}

const QuizResults = ({ result, onRetry, isNasrTheme = false }: QuizResultsProps) => {
  const navigate = useNavigate();
  const [displayScore, setDisplayScore] = useState(0);
  const [showOnlyWrong, setShowOnlyWrong] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  const isPassed = result.status === "passed" || result.score_percent >= result.pass_score;
  const isFailed = result.status === "failed" || (result.score_percent < result.pass_score && result.status !== "daily_locked");
  const isDailyLocked = result.status === "daily_locked";

  // Animate score counting up
  useEffect(() => {
    if (hasAnimated) return;
    
    const duration = 1500;
    const steps = 60;
    const increment = result.score_percent / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= result.score_percent) {
        setDisplayScore(result.score_percent);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(current));
      }
    }, duration / steps);

    setHasAnimated(true);
    return () => clearInterval(timer);
  }, [result.score_percent, hasAnimated]);

  // Trigger confetti for passed
  useEffect(() => {
    if (isPassed && !isDailyLocked) {
      const timer = setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFD700', '#00D084', '#10B981']
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isPassed, isDailyLocked]);

  const filteredReview = showOnlyWrong 
    ? result.review?.filter(item => !item.is_correct) || []
    : result.review || [];

  const formatDateTime = (isoString: string) => {
    try {
      return format(new Date(isoString), "MMM d, yyyy 'at' h:mm a");
    } catch {
      return isoString;
    }
  };

  const getStatusTitle = () => {
    if (isPassed && !isDailyLocked) return "Passed ✅";
    if (isDailyLocked) return "Already completed today 🔒";
    return "Not passed ❌";
  };

  const getStatusIcon = () => {
    if (isPassed && !isDailyLocked) return <Trophy className="h-8 w-8 text-emerald-500" />;
    if (isDailyLocked) return <Lock className="h-8 w-8 text-amber-500" />;
    return <XCircle className="h-8 w-8 text-red-500" />;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Block */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className={`overflow-hidden ${
          isNasrTheme 
            ? "bg-nasr-bg/80 border-gold/30" 
            : "bg-card border-border"
        }`}>
          <CardContent className="pt-8 pb-8">
            {/* Score Display */}
            <div className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  delay: 0.2 
                }}
                className="flex justify-center"
              >
                {getStatusIcon()}
              </motion.div>

              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={`text-2xl md:text-3xl font-bold ${
                  isNasrTheme ? "text-nasr-text" : "text-foreground"
                }`}
              >
                {getStatusTitle()}
              </motion.h2>

              {/* Score Circle */}
              <motion.div
                className="relative inline-block"
                initial={{ scale: 0.8 }}
                animate={{ 
                  scale: 1,
                  ...(isFailed && !isDailyLocked && {
                    x: [0, -5, 5, -5, 5, 0]
                  })
                }}
                transition={{ 
                  scale: { duration: 0.5 },
                  x: { duration: 0.5, delay: 0.5 }
                }}
              >
                {/* Glow effect for passed */}
                {isPassed && !isDailyLocked && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-emerald-500/30 blur-xl"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: [0.3, 0.5, 0.3], scale: 1.2 }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                {/* Red pulse for failed */}
                {isFailed && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-red-500/50"
                    initial={{ opacity: 0, scale: 1 }}
                    animate={{ opacity: [0, 0.8, 0], scale: [1, 1.3, 1.5] }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                )}

                <div className={`relative w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center ${
                  isPassed && !isDailyLocked
                    ? "bg-gradient-to-br from-emerald-500/20 to-emerald-600/30 border-2 border-emerald-500/50"
                    : isFailed
                    ? "bg-gradient-to-br from-red-500/20 to-red-600/30 border-2 border-red-500/50"
                    : "bg-gradient-to-br from-amber-500/20 to-amber-600/30 border-2 border-amber-500/50"
                }`}>
                  <div className="text-center">
                    <span className={`text-4xl md:text-5xl font-bold ${
                      isPassed && !isDailyLocked
                        ? "text-emerald-400"
                        : isFailed
                        ? "text-red-400"
                        : "text-amber-400"
                    }`}>
                      {displayScore}%
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className={`text-sm ${isNasrTheme ? "text-nasr-text-muted" : "text-muted-foreground"}`}
              >
                Pass score: {result.pass_score}%
              </motion.p>

              {/* Status-specific messages */}
              <AnimatePresence>
                {isPassed && !isDailyLocked && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, type: "spring" }}
                    className="flex items-center justify-center gap-2"
                  >
                    <Video className="h-5 w-5 text-emerald-500" />
                    <span className={`text-lg font-semibold ${isNasrTheme ? "text-gold" : "text-emerald-500"}`}>
                      Unlocked: {result.unlocked_count} videos
                    </span>
                  </motion.div>
                )}

                {isFailed && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-red-400"
                  >
                    You need {result.pass_score}% to unlock videos.
                  </motion.p>
                )}

                {isDailyLocked && result.next_allowed_at && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="flex items-center justify-center gap-2 text-amber-400"
                  >
                    <Clock className="h-4 w-4" />
                    <span>Next attempt: {formatDateTime(result.next_allowed_at)}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Attempt timestamp */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className={`flex items-center justify-center gap-2 text-xs ${
                  isNasrTheme ? "text-nasr-text-muted" : "text-muted-foreground"
                }`}
              >
                <Calendar className="h-3 w-3" />
                <span>Attempted: {formatDateTime(result.attempted_at)}</span>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-3 mt-8 justify-center"
            >
              {(isPassed || isDailyLocked) && (
                <Button
                  onClick={() => navigate("/videos")}
                  className={`${
                    isNasrTheme
                      ? "bg-gold hover:bg-gold/90 text-nasr-dark"
                      : "bg-primary hover:bg-primary/90"
                  }`}
                >
                  <Video className="h-4 w-4 mr-2" />
                  Go to videos
                </Button>
              )}

              {isFailed && (
                <>
                  <motion.div
                    animate={{ 
                      scale: [1, 1.05, 1],
                    }}
                    transition={{ 
                      duration: 0.5, 
                      delay: 1.5,
                      repeat: 2
                    }}
                  >
                    <Button
                      onClick={onRetry}
                      className={`${
                        isNasrTheme
                          ? "bg-gold hover:bg-gold/90 text-nasr-dark"
                          : "bg-primary hover:bg-primary/90"
                      }`}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Try again
                    </Button>
                  </motion.div>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/videos")}
                    className={isNasrTheme ? "border-gold/30 text-nasr-text hover:bg-gold/10" : ""}
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
        <Card className={`${
          isNasrTheme 
            ? "bg-nasr-bg/80 border-gold/30" 
            : "bg-card border-border"
        }`}>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className={isNasrTheme ? "text-nasr-text" : ""}>
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
                  className={`text-sm cursor-pointer ${
                    isNasrTheme ? "text-nasr-text-muted" : "text-muted-foreground"
                  }`}
                >
                  Show only wrong answers
                </Label>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {(!result.review || result.review.length === 0) ? (
              <p className={`text-center py-8 ${
                isNasrTheme ? "text-nasr-text-muted" : "text-muted-foreground"
              }`}>
                No review data received.
              </p>
            ) : filteredReview.length === 0 ? (
              <p className={`text-center py-8 ${
                isNasrTheme ? "text-nasr-text-muted" : "text-muted-foreground"
              }`}>
                All answers were correct! 🎉
              </p>
            ) : (
              <div className="space-y-4">
                {filteredReview.map((item, index) => (
                  <motion.div
                    key={item.question_id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3 + index * 0.1 }}
                  >
                    <Card className={`${
                      isNasrTheme 
                        ? "bg-nasr-dark/50 border-gold/20" 
                        : "bg-muted/30 border-border"
                    }`}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <p className={`font-medium ${isNasrTheme ? "text-nasr-text" : "text-foreground"}`}>
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
                              <>
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Correct
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3 mr-1" />
                                Wrong
                              </>
                            )}
                          </Badge>
                        </div>

                        <div className="grid gap-2">
                          {item.options.map((option, optIndex) => {
                            const isUserAnswer = optIndex === item.user_answer_index;
                            const isCorrectAnswer = optIndex === item.correct_answer_index;
                            const optionLetter = String.fromCharCode(65 + optIndex);

                            return (
                              <div
                                key={optIndex}
                                className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                                  isCorrectAnswer
                                    ? "bg-emerald-500/10 border border-emerald-500/30"
                                    : isUserAnswer && !item.is_correct
                                    ? "bg-red-500/10 border border-red-500/30"
                                    : isNasrTheme
                                    ? "bg-nasr-bg/30"
                                    : "bg-background/50"
                                }`}
                              >
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                  isCorrectAnswer
                                    ? "bg-emerald-500 text-white"
                                    : isUserAnswer && !item.is_correct
                                    ? "bg-red-500 text-white"
                                    : isNasrTheme
                                    ? "bg-nasr-dark text-nasr-text-muted"
                                    : "bg-muted text-muted-foreground"
                                }`}>
                                  {optionLetter}
                                </span>
                                <span className={`flex-1 text-sm ${
                                  isCorrectAnswer
                                    ? "text-emerald-400 font-medium"
                                    : isUserAnswer && !item.is_correct
                                    ? "text-red-400"
                                    : isNasrTheme
                                    ? "text-nasr-text"
                                    : "text-foreground"
                                }`}>
                                  {option}
                                </span>
                                {isUserAnswer && (
                                  <span className={`text-xs px-2 py-0.5 rounded ${
                                    item.is_correct
                                      ? "bg-emerald-500/20 text-emerald-400"
                                      : "bg-red-500/20 text-red-400"
                                  }`}>
                                    Your answer
                                  </span>
                                )}
                                {isCorrectAnswer && !isUserAnswer && (
                                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                                    Correct
                                  </span>
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
