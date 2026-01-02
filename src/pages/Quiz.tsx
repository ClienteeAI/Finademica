import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/AuthContext";
import { useClient } from "@/lib/clientContext";
import { Loader2, Trophy, Play } from "lucide-react";
import { toast } from "sonner";

const GENERATE_WEBHOOK_URL = "https://clientee.app.n8n.cloud/webhook-test/quiz/generate";

interface WebhookResponse {
  [key: string]: unknown;
}

const Quiz = () => {
  const { user, profile } = useAuth();
  const { client } = useClient();
  const isNasrTheme = client?.subdomain === "nasr";

  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [webhookResponse, setWebhookResponse] = useState<WebhookResponse | string | null>(null);

  const handleStartQuiz = async () => {
    setLoading(true);
    try {
      const payload = {
        auth_user_id: user?.id || null,
        email: user?.email || profile?.email || null,
        first_name: profile?.first_name || null,
        last_name: profile?.last_name || null,
        timestamp: new Date().toISOString(),
        source: "lovable_app",
      };

      const response = await fetch(GENERATE_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      
      if (text) {
        try {
          const data = JSON.parse(text);
          setWebhookResponse(data);
        } catch {
          setWebhookResponse(text);
        }
      } else {
        setWebhookResponse({ message: "Empty response from webhook" });
      }

      setStarted(true);
      toast.success("Quiz started!");
    } catch (error) {
      console.error("Quiz start error:", error);
      toast.error("Failed to start quiz. Please try again.");
    } finally {
      setLoading(false);
    }
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
                {started ? "Quiz Response" : "Ready to Start?"}
              </CardTitle>
              <Trophy className={`h-6 w-6 ${isNasrTheme ? "text-gold" : "text-primary"}`} />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {!started ? (
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
                  onClick={handleStartQuiz}
                  disabled={loading}
                  size="lg"
                  className={`px-8 ${isNasrTheme ? "bg-gold hover:bg-gold-dark text-nasr-bg" : ""}`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      Start Quiz
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className={`text-lg font-medium ${isNasrTheme ? "text-nasr-text" : "text-foreground"}`}>
                  Webhook Response:
                </h3>
                <div className={`p-4 rounded-lg overflow-auto max-h-[500px] ${isNasrTheme ? "bg-nasr-bg border border-gold/20" : "bg-muted border border-border"}`}>
                  <pre className={`text-sm whitespace-pre-wrap break-words ${isNasrTheme ? "text-nasr-text" : "text-foreground"}`}>
                    {typeof webhookResponse === "string" 
                      ? webhookResponse 
                      : JSON.stringify(webhookResponse, null, 2)}
                  </pre>
                </div>
                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={() => {
                      setStarted(false);
                      setWebhookResponse(null);
                    }}
                    variant="outline"
                    className={isNasrTheme ? "border-gold/30 text-nasr-text hover:bg-gold/10" : ""}
                  >
                    Try Again
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
