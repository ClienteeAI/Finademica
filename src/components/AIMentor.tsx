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
        content: data.output || data.reply || "I'm here to help! Ask me anything about trading.",
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
          "bg-gradient-to-br from-[#E4C776] to-[#F4D98C]",
          "flex items-center justify-center",
          "border-2 border-[#E4C776]/60",
          "hover:border-[#C9A95C] hover:shadow-[0_0_25px_rgba(228,199,118,0.5)]",
          "shadow-[0_4px_20px_rgba(228,199,118,0.3)]",
          "transition-all duration-300 ease-out",
          "hover:scale-110 hover:-translate-y-1",
          "animate-pulse-subtle"
        )}
        aria-label="Open AI Mentor"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-[#1E1E1F]" />
        ) : (
          <MessageCircle className="w-6 h-6 text-[#1E1E1F]" />
        )}
      </button>

      {/* Slide-in Panel */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998] md:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div
            className={cn(
              "fixed z-[9999]",
              "w-full h-[90vh] bottom-0 left-0 md:w-[380px] md:h-[600px] md:bottom-6 md:right-6 md:left-auto md:top-auto",
              "bg-white/80 backdrop-blur-xl",
              "border border-[#DBE6F0]",
              "rounded-t-[26px] md:rounded-[26px]",
              "overflow-hidden",
              "flex flex-col",
              "animate-slide-up md:animate-slide-in-right",
              "shadow-[0_8px_50px_rgba(219,230,240,0.6)]"
            )}
          >
            {/* Header */}
            <div className="relative p-6 border-b border-[#DBE6F0] bg-gradient-to-r from-[#E4C776]/10 to-[#F4D98C]/10">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E4C776] to-[#F4D98C] flex items-center justify-center shadow-[0_0_15px_rgba(228,199,118,0.4)]">
                  <Sparkles className="w-5 h-5 text-[#1E1E1F]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#1A1A1A]">AI Trading Mentor</h3>
                  <p className="text-sm text-[#7D7A72]">
                    Ask anything about trading, learning, or mindset.
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-[#7D7A72] hover:text-[#1A1A1A] transition-colors"
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
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#E4C776]/20 to-[#F4D98C]/20 flex items-center justify-center border border-[#E4C776]/30">
                    <Sparkles className="w-8 h-8 text-[#C9A95C]" />
                  </div>
                  <p className="text-[#7D7A72] text-sm">
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
                        ? "bg-gradient-to-r from-[#E4C776] to-[#F4D98C] text-[#1E1E1F] shadow-[0_0_15px_rgba(228,199,118,0.3)]"
                        : "bg-white/70 backdrop-blur-sm text-[#1A1A1A] border border-[#DBE6F0]"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-white/70 backdrop-blur-sm rounded-[18px] px-4 py-3 border border-[#DBE6F0]">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#E4C776] animate-pulse" />
                      <div className="w-2 h-2 rounded-full bg-[#E4C776] animate-pulse delay-150" />
                      <div className="w-2 h-2 rounded-full bg-[#E4C776] animate-pulse delay-300" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-[#DBE6F0] bg-white/60 backdrop-blur-xl">
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
                    "bg-white/70 border border-[#DBE6F0]",
                    "text-[#1A1A1A] placeholder:text-[#7D7A72]",
                    "focus:outline-none focus:border-[#E4C776] focus:shadow-[0_0_15px_rgba(228,199,118,0.2)]",
                    "transition-all duration-300",
                    "backdrop-blur-xl"
                  )}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className={cn(
                    "w-12 h-12 rounded-full",
                    "bg-gradient-to-r from-[#E4C776] to-[#F4D98C]",
                    "flex items-center justify-center",
                    "hover:scale-110 hover:shadow-[0_0_20px_rgba(228,199,118,0.5)]",
                    "transition-all duration-300",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  )}
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5 text-[#1E1E1F]" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}