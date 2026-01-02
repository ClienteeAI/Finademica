import { useState, useRef, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/lib/AuthContext";
import { useClient } from "@/lib/clientContext";
import { ChevronLeft, ChevronRight, Send, Loader2, Trophy, MessageCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const WEBHOOK_URL = "https://clientee.app.n8n.cloud/webhook-test/6af55b2e-fe9a-49d3-98d6-3fc9a68b2786";

interface QuizQuestion {
  id: number;
  key: string;
  title: string;
  type: "single" | "multiple";
  options: string[];
}

const questions: QuizQuestion[] = [
  {
    id: 1,
    key: "experience_level",
    title: "What is your current trading experience level?",
    type: "single",
    options: [
      "Complete beginner - never traded before",
      "Beginner - less than 1 year",
      "Intermediate - 1-3 years",
      "Advanced - 3+ years",
    ],
  },
  {
    id: 2,
    key: "markets_interested",
    title: "Which markets are you most interested in? (Select all that apply)",
    type: "multiple",
    options: ["Forex", "Stocks", "Crypto", "Commodities", "Indices"],
  },
  {
    id: 3,
    key: "trading_style",
    title: "What trading style appeals to you most?",
    type: "single",
    options: [
      "Day trading - quick trades within the day",
      "Swing trading - holding for days/weeks",
      "Position trading - long-term holds",
      "Scalping - very short trades",
    ],
  },
  {
    id: 4,
    key: "risk_tolerance",
    title: "What is your risk tolerance?",
    type: "single",
    options: [
      "Conservative - prefer minimal risk",
      "Moderate - balanced approach",
      "Aggressive - comfortable with higher risk",
    ],
  },
  {
    id: 5,
    key: "learning_goal",
    title: "What is your primary learning goal?",
    type: "single",
    options: [
      "Build a solid foundation",
      "Develop a consistent strategy",
      "Master technical analysis",
      "Learn risk management",
      "Understand market psychology",
    ],
  },
];

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const Quiz = () => {
  const { user, profile } = useAuth();
  const { client } = useClient();
  const isNasrTheme = client?.subdomain === "nasr";

  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hi! I'm your AI learning assistant. Feel free to ask me any questions about the quiz or trading concepts while you complete the questions. I'm here to help! 🎓",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSingleChoice = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questions[currentQuestion].key]: value,
    }));
  };

  const handleMultipleChoice = (option: string, checked: boolean) => {
    const key = questions[currentQuestion].key;
    const currentAnswers = (answers[key] as string[]) || [];

    if (checked) {
      setAnswers((prev) => ({
        ...prev,
        [key]: [...currentAnswers, option],
      }));
    } else {
      setAnswers((prev) => ({
        ...prev,
        [key]: currentAnswers.filter((a) => a !== option),
      }));
    }
  };

  const canProceed = () => {
    const key = questions[currentQuestion].key;
    const answer = answers[key];
    if (questions[currentQuestion].type === "multiple") {
      return Array.isArray(answer) && answer.length > 0;
    }
    return !!answer;
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    setSubmitting(true);
    try {
      const payload = {
        type: "quiz_submission",
        auth_user_id: user?.id || null,
        email: user?.email || profile?.email || null,
        first_name: profile?.first_name || null,
        last_name: profile?.last_name || null,
        quiz_answers: answers,
        timestamp: new Date().toISOString(),
        source: "lovable_app",
      };

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setQuizCompleted(true);
        toast.success("Quiz completed! New videos are being unlocked for you.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Quiz submission error:", error);
      toast.error("Failed to submit quiz. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || chatLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setChatLoading(true);

    try {
      const payload = {
        type: "chat_message",
        auth_user_id: user?.id || null,
        email: user?.email || profile?.email || null,
        message: userMessage,
        conversation: messages,
        quiz_answers: answers,
        current_question: currentQuestion + 1,
        timestamp: new Date().toISOString(),
      };

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      let reply = "I'm here to help! What would you like to know about trading?";

      if (text) {
        try {
          const data = JSON.parse(text);
          reply = data?.reply || data?.message || data?.output || data?.[0]?.message || reply;
        } catch {
          reply = text || reply;
        }
      }

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't process your message. Please try again." },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className={`text-3xl font-bold ${isNasrTheme ? "font-playfair text-nasr-text" : "text-foreground"}`}>
            Unlock More Videos
          </h1>
          <p className={`text-lg ${isNasrTheme ? "text-nasr-text-muted" : "text-muted-foreground"}`}>
            Complete this quiz to personalize your learning path and unlock additional content
          </p>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Quiz Section */}
          <Card className={`${isNasrTheme ? "bg-nasr-panel border-gold/20" : "bg-card border-border"}`}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className={`text-xl ${isNasrTheme ? "text-nasr-text font-playfair" : "text-foreground"}`}>
                  {quizCompleted ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
                </CardTitle>
                <Trophy className={`h-6 w-6 ${isNasrTheme ? "text-gold" : "text-primary"}`} />
              </div>
              {!quizCompleted && (
                <Progress
                  value={progress}
                  className={`h-2 ${isNasrTheme ? "[&>div]:bg-gold" : ""}`}
                />
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {quizCompleted ? (
                <div className="text-center py-8 space-y-4">
                  <CheckCircle2 className={`h-16 w-16 mx-auto ${isNasrTheme ? "text-gold" : "text-primary"}`} />
                  <h3 className={`text-xl font-semibold ${isNasrTheme ? "text-nasr-text" : "text-foreground"}`}>
                    Congratulations!
                  </h3>
                  <p className={isNasrTheme ? "text-nasr-text-muted" : "text-muted-foreground"}>
                    Your answers have been submitted. New videos are being unlocked based on your profile.
                    Check your video library for new content!
                  </p>
                  <Button
                    onClick={() => window.location.href = "/videos"}
                    className={isNasrTheme ? "bg-gold hover:bg-gold-dark text-nasr-bg" : ""}
                  >
                    View My Videos
                  </Button>
                </div>
              ) : (
                <>
                  <h3 className={`text-lg font-medium ${isNasrTheme ? "text-nasr-text" : "text-foreground"}`}>
                    {question.title}
                  </h3>

                  {question.type === "single" ? (
                    <RadioGroup
                      value={(answers[question.key] as string) || ""}
                      onValueChange={handleSingleChoice}
                      className="space-y-3"
                    >
                      {question.options.map((option) => (
                        <div
                          key={option}
                          className={`flex items-center space-x-3 p-4 rounded-lg border transition-all cursor-pointer ${
                            answers[question.key] === option
                              ? isNasrTheme
                                ? "border-gold bg-gold/10"
                                : "border-primary bg-primary/10"
                              : isNasrTheme
                              ? "border-gold/20 hover:border-gold/40 bg-nasr-bg/50"
                              : "border-border hover:border-primary/40 bg-background/50"
                          }`}
                          onClick={() => handleSingleChoice(option)}
                        >
                          <RadioGroupItem value={option} id={option} />
                          <Label htmlFor={option} className={`cursor-pointer flex-1 ${isNasrTheme ? "text-nasr-text" : ""}`}>
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  ) : (
                    <div className="space-y-3">
                      {question.options.map((option) => {
                        const isChecked = ((answers[question.key] as string[]) || []).includes(option);
                        return (
                          <div
                            key={option}
                            className={`flex items-center space-x-3 p-4 rounded-lg border transition-all cursor-pointer ${
                              isChecked
                                ? isNasrTheme
                                  ? "border-gold bg-gold/10"
                                  : "border-primary bg-primary/10"
                                : isNasrTheme
                                ? "border-gold/20 hover:border-gold/40 bg-nasr-bg/50"
                                : "border-border hover:border-primary/40 bg-background/50"
                            }`}
                            onClick={() => handleMultipleChoice(option, !isChecked)}
                          >
                            <Checkbox
                              id={option}
                              checked={isChecked}
                              onCheckedChange={(checked) => handleMultipleChoice(option, checked as boolean)}
                            />
                            <Label htmlFor={option} className={`cursor-pointer flex-1 ${isNasrTheme ? "text-nasr-text" : ""}`}>
                              {option}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-4">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      disabled={currentQuestion === 0}
                      className={isNasrTheme ? "border-gold/30 text-nasr-text hover:bg-gold/10" : ""}
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>

                    {currentQuestion === questions.length - 1 ? (
                      <Button
                        onClick={handleSubmitQuiz}
                        disabled={!canProceed() || submitting}
                        className={isNasrTheme ? "bg-gold hover:bg-gold-dark text-nasr-bg" : ""}
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Submit Quiz"
                        )}
                      </Button>
                    ) : (
                      <Button
                        onClick={handleNext}
                        disabled={!canProceed()}
                        className={isNasrTheme ? "bg-gold hover:bg-gold-dark text-nasr-bg" : ""}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Chat Section */}
          <Card className={`flex flex-col h-[600px] ${isNasrTheme ? "bg-nasr-panel border-gold/20" : "bg-card border-border"}`}>
            <CardHeader className="pb-4 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${isNasrTheme ? "bg-gold/20" : "bg-primary/20"}`}>
                  <MessageCircle className={`h-5 w-5 ${isNasrTheme ? "text-gold" : "text-primary"}`} />
                </div>
                <CardTitle className={`text-xl ${isNasrTheme ? "text-nasr-text font-playfair" : "text-foreground"}`}>
                  AI Learning Assistant
                </CardTitle>
              </div>
            </CardHeader>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        msg.role === "user"
                          ? isNasrTheme
                            ? "bg-gold text-nasr-bg"
                            : "bg-primary text-primary-foreground"
                          : isNasrTheme
                          ? "bg-nasr-bg border border-gold/20 text-nasr-text"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className={`rounded-2xl px-4 py-3 ${isNasrTheme ? "bg-nasr-bg border border-gold/20" : "bg-muted"}`}>
                      <Loader2 className={`h-5 w-5 animate-spin ${isNasrTheme ? "text-gold" : "text-primary"}`} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className={`p-4 border-t ${isNasrTheme ? "border-gold/20" : "border-border/50"}`}>
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                  placeholder="Ask about trading or the quiz..."
                  className={isNasrTheme ? "bg-nasr-bg border-gold/20 text-nasr-text placeholder:text-nasr-text-muted" : ""}
                  disabled={chatLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || chatLoading}
                  size="icon"
                  className={isNasrTheme ? "bg-gold hover:bg-gold-dark text-nasr-bg" : ""}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Quiz;
