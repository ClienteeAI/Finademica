import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/AuthContext";
import { useClient } from "@/lib/clientContext";
import { Loader2, Trophy, Play, TrendingUp, BarChart3, Bitcoin, Package } from "lucide-react";
import { toast } from "sonner";

const GENERATE_WEBHOOK_URL = "https://clientee.app.n8n.cloud/webhook-test/674ea19a-33ae-40af-9794-6c641f1b8215";

type Module = "forex" | "stocks" | "crypto" | "commodities";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer?: string;
}

interface WebhookResponse {
  quiz_id: string;
  questions: QuizQuestion[];
}

const moduleOptions: { id: Module; label: string; icon: React.ReactNode }[] = [
  { id: "forex", label: "Forex", icon: <TrendingUp className="h-6 w-6" /> },
  { id: "stocks", label: "Stocks", icon: <BarChart3 className="h-6 w-6" /> },
  { id: "crypto", label: "Crypto", icon: <Bitcoin className="h-6 w-6" /> },
  { id: "commodities", label: "Commodities", icon: <Package className="h-6 w-6" /> },
];

const Quiz = () => {
  const { user } = useAuth();
  const { client } = useClient();
  const isNasrTheme = client?.subdomain === "nasr";

  const [step, setStep] = useState<"intro" | "select-module" | "loading" | "quiz">("intro");
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

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
          setQuizId(data.quiz_id);
          setQuestions(data.questions || []);
          setStep("quiz");
          toast.success("Quiz loaded!");
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
  };

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
                <div className="grid grid-cols-2 gap-4">
                  {moduleOptions.map((option) => (
                    <Button
                      key={option.id}
                      onClick={() => handleModuleSelect(option.id)}
                      variant="outline"
                      className={`h-24 flex flex-col items-center justify-center gap-2 transition-all ${
                        isNasrTheme
                          ? "border-gold/30 text-nasr-text hover:bg-gold/20 hover:border-gold"
                          : "hover:bg-primary/10 hover:border-primary"
                      }`}
                    >
                      <span className={isNasrTheme ? "text-gold" : "text-primary"}>{option.icon}</span>
                      <span className="font-medium">{option.label}</span>
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
              <div className="text-center py-12 space-y-4">
                <Loader2 className={`h-12 w-12 mx-auto animate-spin ${isNasrTheme ? "text-gold" : "text-primary"}`} />
                <p className={isNasrTheme ? "text-nasr-text-muted" : "text-muted-foreground"}>
                  Generating your {selectedModule} quiz...
                </p>
              </div>
            )}

            {/* Step: Quiz */}
            {step === "quiz" && (
              <div className="space-y-6">
                <div className={`p-3 rounded-lg ${isNasrTheme ? "bg-gold/10 border border-gold/20" : "bg-muted"}`}>
                  <p className={`text-sm ${isNasrTheme ? "text-nasr-text-muted" : "text-muted-foreground"}`}>
                    Quiz ID: <span className="font-mono">{quizId}</span>
                  </p>
                </div>

                {questions.length > 0 ? (
                  <div className="space-y-6">
                    {questions.map((q, index) => (
                      <div
                        key={q.id || index}
                        className={`p-4 rounded-lg border ${isNasrTheme ? "bg-nasr-bg border-gold/20" : "bg-muted/50 border-border"}`}
                      >
                        <p className={`font-medium mb-3 ${isNasrTheme ? "text-nasr-text" : "text-foreground"}`}>
                          {index + 1}. {q.question}
                        </p>
                        <div className="space-y-2">
                          {q.options?.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className={`p-3 rounded-md border cursor-pointer transition-colors ${
                                isNasrTheme
                                  ? "border-gold/20 hover:bg-gold/10"
                                  : "border-border hover:bg-muted"
                              }`}
                            >
                              <span className={isNasrTheme ? "text-nasr-text" : "text-foreground"}>
                                {option}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={isNasrTheme ? "text-nasr-text-muted" : "text-muted-foreground"}>
                    No questions received from the server.
                  </p>
                )}

                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className={isNasrTheme ? "border-gold/30 text-nasr-text hover:bg-gold/10" : ""}
                  >
                    Start Over
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Quiz;
