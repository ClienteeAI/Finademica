import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function AIMentor() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const userData = localStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;

      const response = await fetch(
        "https://clientee.app.n8n.cloud/webhook-test/81b2df02-b127-41cf-9e40-f846b4a2bd47",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage.content,
            user: {
              id: user?.id || "anonymous",
              name: user?.firstName || "User",
              email: user?.email || "",
            },
          }),
        }
      );

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply || "I'm here to help! Ask me anything about trading.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I'm having trouble connecting. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-[9999]",
          "w-[60px] h-[60px] rounded-full",
          "premium-card flex items-center justify-center",
          "border-2 border-primary/40",
          "hover:border-primary hover:shadow-[0_0_30px_rgba(34,243,255,0.4)]",
          "transition-all duration-300 ease-out",
          "hover:scale-110 hover:-translate-y-1",
          "animate-pulse-subtle"
        )}
        aria-label="Open AI Mentor"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-primary" />
        ) : (
          <MessageCircle className="w-6 h-6 text-primary" />
        )}
      </button>

      {/* Slide-in Panel */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] md:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div
            className={cn(
              "fixed z-[9999]",
              "w-full h-[90vh] bottom-0 left-0 md:w-[380px] md:h-[600px] md:bottom-6 md:right-6 md:left-auto md:top-auto",
              "premium-card overflow-hidden",
              "flex flex-col",
              "animate-slide-up md:animate-slide-in-right",
              "border-2 border-border-glass"
            )}
          >
            {/* Header */}
            <div className="relative p-6 border-b border-border-glass bg-gradient-to-r from-primary/10 to-accent/10">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-neon-glow">
                  <Sparkles className="w-5 h-5 text-background" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground">AI Trading Mentor</h3>
                  <p className="text-sm text-muted-foreground">
                    Ask anything about trading, learning, or mindset.
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Hi! I'm your AI Trading Mentor. Ask me anything!
                  </p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex animate-fade-in",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-[18px] px-4 py-3",
                      message.role === "user"
                        ? "success-gradient text-background shadow-[0_0_20px_rgba(34,243,255,0.3)]"
                        : "premium-card text-foreground border border-border-glass"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="premium-card rounded-[18px] px-4 py-3 border border-border-glass">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150" />
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-300" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border-glass bg-card/50 backdrop-blur-xl">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask your mentor…"
                  disabled={isLoading}
                  className={cn(
                    "flex-1 px-4 py-3 rounded-full",
                    "bg-background/60 border border-border-glass",
                    "text-foreground placeholder:text-muted-foreground",
                    "focus:outline-none focus:border-primary focus:shadow-[0_0_20px_rgba(34,243,255,0.2)]",
                    "transition-all duration-300",
                    "backdrop-blur-xl"
                  )}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className={cn(
                    "w-12 h-12 rounded-full",
                    "success-gradient",
                    "flex items-center justify-center",
                    "hover:scale-110 hover:shadow-[0_0_30px_rgba(34,243,255,0.4)]",
                    "transition-all duration-300",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  )}
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5 text-background" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
