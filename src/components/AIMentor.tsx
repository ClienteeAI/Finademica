import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { sendMentorMessageSentEvent } from "@/lib/crmWebhook";
import { useClient } from "@/lib/clientContext";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function AIMentor() {
  const { client } = useClient();
  const isPremiumTheme = client?.subdomain === 'finademica';
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastMessageTimestamp = useRef<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const isNearBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return true;
    return container.scrollHeight - container.scrollTop - container.clientHeight < 100;
  };

  useEffect(() => {
    if (isNearBottom()) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Get auth user ID on mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setAuthUserId(user.id);
      }
    };
    getUser();
  }, []);

  // Load messages from Supabase when panel opens
  useEffect(() => {
    if (!isOpen || !authUserId) return;

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from("mentor_messages")
        .select("*")
        .eq("auth_user_id", authUserId)
        .order("created_at", { ascending: true })
        .limit(100);

      if (error) {
        console.error("Error loading messages:", error);
        return;
      }

      if (data) {
        const loadedMessages: Message[] = data.map((msg) => ({
          id: msg.id,
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content,
          timestamp: new Date(msg.created_at),
        }));
        setMessages(loadedMessages);
        
        // Track the last message timestamp
        if (data.length > 0) {
          lastMessageTimestamp.current = data[data.length - 1].created_at;
        }
      }
    };

    loadMessages();
  }, [isOpen, authUserId]);

  // Subscribe to realtime updates for mentor replies
  useEffect(() => {
    if (!authUserId) return;

    const channel = supabase
      .channel("mentor-messages-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "mentor_messages",
          filter: `auth_user_id=eq.${authUserId}`,
        },
        (payload) => {
          console.log("New mentor message received:", payload);
          const newMsg = payload.new as {
            id: string;
            role: string;
            content: string;
            created_at: string;
            auth_user_id: string;
          };

          // Only add if it's a new message we don't already have
          setMessages((prev) => {
            const exists = prev.some((m) => m.id === newMsg.id);
            if (exists) return prev;

            const message: Message = {
              id: newMsg.id,
              role: newMsg.role === "user" ? "user" : "assistant",
              content: newMsg.content,
              timestamp: new Date(newMsg.created_at),
            };

            // If mentor message arrives, stop loading
            if (newMsg.role === "assistant" || newMsg.role === "mentor") {
              setIsLoading(false);
            }

            return [...prev, message];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [authUserId]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading || !authUserId) return;

    const messageContent = input.trim();
    setInput("");
    setIsLoading(true);

    // Add user message to UI immediately
    const userMsgId = crypto.randomUUID();
    const userMessage: Message = {
      id: userMsgId,
      role: "user",
      content: messageContent,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Build conversation history for the webhook
    const conversationHistory = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));
    conversationHistory.push({ role: "user", content: messageContent });

    try {
      // Send CRM webhook for mentor message (fire immediately after user sends)
      sendMentorMessageSentEvent(userMsgId, messageContent, authUserId).catch(console.error);
      
      // Send to n8n webhook
      const response = await fetch(
        "https://n8n.srv1474318.hstgr.cloud/webhook/AI-mentor-finademica",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            auth_user_id: authUserId,
            message: messageContent,
            conversation: conversationHistory,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Webhook error response:", response.status, errorText);
        throw new Error(`Webhook error: ${response.status}`);
      }

      const text = await response.text();
      let data: unknown;
      try {
        data = text ? JSON.parse(text) : { message: "Response received" };
      } catch {
        data = { message: text || "Response received" };
      }
      
      // Log the full webhook response for debugging
      console.log("=== MENTOR WEBHOOK RESPONSE ===");
      console.log("Raw data:", data);
      console.log("Type:", typeof data);
      console.log("Keys:", data && typeof data === "object" ? Object.keys(data) : "N/A");
      console.log("JSON:", JSON.stringify(data, null, 2));
      console.log("===============================");
      
      // Extract assistant reply from response
      let assistantContent = "I couldn't generate a response.";
      if (typeof data === "string") {
        assistantContent = data;
      } else if (data && typeof data === "object") {
        const obj = data as Record<string, unknown>;
        assistantContent =
          (obj.reply as string) || (obj.message as string) || (obj.content as string) || 
          (obj.text as string) || (obj.output as string) ||
          (Array.isArray(data) && (data[0]?.message || data[0]?.content || data[0]?.text)) ||
          JSON.stringify(data, null, 2);
      }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: assistantContent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Award XP for mentor message
      try {
        const { data: xpResult } = await supabase.rpc("award_xp", {
          p_action_key: "mentor_message",
          p_auth_user_id: authUserId,
          p_meta: { message_length: messageContent.length },
        });

        const result = xpResult as { xp_awarded?: number } | null;
        if (result?.xp_awarded && result.xp_awarded > 0) {
          toast({
            title: `+${result.xp_awarded} XP earned!`,
            description: "Keep chatting with your mentor!",
          });
          window.dispatchEvent(new Event("gamification-update"));
        }
      } catch (err) {
        console.error("XP award error:", err);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to get mentor response. Please try again.",
        variant: "destructive",
      });
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
      {/* Floating Button - positioned above bottom nav on mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed z-[9999]",
          "bottom-[calc(76px+env(safe-area-inset-bottom))] right-4 md:bottom-6 md:right-6",
          "w-[52px] h-[52px] md:w-[60px] md:h-[60px] rounded-full",
          isPremiumTheme 
            ? "bg-premium-gold border-2 border-premium-gold/60 hover:border-premium-gold hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] shadow-[0_4px_20px_rgba(212,175,55,0.3)]" 
            : "bg-gradient-to-br from-[#6366F1] to-[#4F46E5] border-2 border-[#6366F1]/60 hover:border-[#818CF8] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] shadow-[0_4px_20px_rgba(99,102,241,0.3)]",
          "flex items-center justify-center",
          "transition-all duration-300 ease-out",
          "hover:scale-110 hover:-translate-y-1",
          isPremiumTheme ? "animate-gold-pulse" : "animate-pulse-subtle"
        )}
        aria-label="Open AI Mentor"
      >
        {isOpen ? (
          <X className={cn("w-5 h-5 md:w-6 md:h-6", isPremiumTheme ? "text-premium-bg" : "text-white")} />
        ) : (
          <MessageCircle className={cn("w-5 h-5 md:w-6 md:h-6", isPremiumTheme ? "text-premium-bg" : "text-white")} />
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
              isPremiumTheme ? "bg-premium-bg/95 border-premium-gold/20" : "bg-[#0F172A]/90 border-white/10",
              "backdrop-blur-xl border",
              "rounded-t-[26px] md:rounded-[26px]",
              "overflow-hidden",
              "flex flex-col",
              "animate-slide-up md:animate-slide-in-right",
              "shadow-[0_10px_50px_rgba(15,23,42,0.1)]"
            )}
          >
            {/* Header */}
            <div className={cn(
              "relative p-6 border-b",
              isPremiumTheme ? "border-premium-gold/10 bg-premium-gold/5" : "border-white/10 bg-gradient-to-r from-[#6366F1]/10 to-[#818CF8]/10"
            )}>
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  isPremiumTheme 
                    ? "bg-premium-gold shadow-[0_0_15px_rgba(212,175,55,0.4)]" 
                    : "bg-gradient-to-br from-[#6366F1] to-[#4F46E5] shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                )}>
                  <Sparkles className={cn("w-5 h-5", isPremiumTheme ? "text-premium-bg" : "text-white")} />
                </div>
                <div className="flex-1">
                  <h3 className={cn("text-lg font-bold", isPremiumTheme ? "text-premium-gold font-serif" : "text-white font-serif")}>AI Trading Mentor</h3>
                  <p className={cn("text-sm", isPremiumTheme ? "text-premium-text-muted" : "text-white/60")}>
                    Ask anything about trading, learning, or mindset.
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className={cn("transition-colors", isPremiumTheme ? "text-premium-text-muted hover:text-premium-gold" : "text-[#6B7280] hover:text-[#1D3557]")}
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <div className={cn(
                    "w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center border",
                    isPremiumTheme 
                      ? "bg-premium-gold/10 border-premium-gold/30" 
                      : "bg-gradient-to-br from-[#6366F1]/20 to-[#818CF8]/20 border-[#6366F1]/30"
                  )}>
                    <Sparkles className={cn("w-8 h-8", isPremiumTheme ? "text-premium-gold" : "text-[#6366F1]")} />
                  </div>
                  <p className={cn("text-sm font-medium", isPremiumTheme ? "text-premium-text-muted" : "text-white/60")}>
                    Hi, my name is Finn. How can I help?
                  </p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex flex-col animate-fade-in",
                    message.role === "user" ? "items-end" : "items-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-[18px] px-4 py-3",
                      message.role === "user"
                        ? (isPremiumTheme 
                          ? "bg-premium-gold text-premium-bg shadow-[0_0_15px_rgba(212,175,55,0.3)]" 
                          : "bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]")
                        : (isPremiumTheme 
                          ? "bg-premium-panel text-premium-text border border-premium-gold/10" 
                          : "bg-[#1E293B]/80 backdrop-blur-sm text-white border border-white/10")
                    )}
                  >
                    <p className="text-sm font-medium whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <p className={cn("text-[10px] mt-1 px-1", isPremiumTheme ? "text-premium-text-muted" : "text-[#9CA3AF]")}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className={cn(
                    "rounded-[18px] px-4 py-3 border",
                    isPremiumTheme ? "bg-premium-panel text-premium-text border-premium-gold/10" : "bg-[#1E293B]/80 border-white/10 backdrop-blur-sm"
                  )}>
                    <div className="flex items-center gap-2">
                      <span className={cn("text-sm", isPremiumTheme ? "text-premium-text-muted" : "text-white/60")}>Mentor is typing</span>
                      <div className="flex gap-1">
                        <div className={cn("w-2 h-2 rounded-full animate-pulse", isPremiumTheme ? "bg-premium-gold" : "bg-[#6366F1]")} />
                        <div className={cn("w-2 h-2 rounded-full animate-pulse delay-150", isPremiumTheme ? "bg-premium-gold" : "bg-[#6366F1]")} />
                        <div className={cn("w-2 h-2 rounded-full animate-pulse delay-300", isPremiumTheme ? "bg-premium-gold" : "bg-[#6366F1]")} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className={cn(
              "p-4 border-t backdrop-blur-xl",
              isPremiumTheme ? "border-premium-gold/10 bg-premium-bg/70" : "border-white/10 bg-[#0F172A]/70"
            )}>
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask your mentor…"
                  disabled={isLoading || !authUserId}
                  className={cn(
                    "flex-1 px-4 py-3 rounded-full",
                    "backdrop-blur-xl transition-all duration-300",
                    isPremiumTheme 
                      ? "bg-premium-panel/80 border-premium-gold/20 text-premium-text placeholder:text-premium-text-muted/40 focus:border-premium-gold focus:shadow-[0_0_15px_rgba(212,175,55,0.2)]" 
                      : "bg-[#1E293B]/80 border-white/10 text-white placeholder:text-white/40 focus:border-[#6366F1] focus:shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                  )}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading || !authUserId}
                  className={cn(
                    "w-12 h-12 rounded-full",
                    "flex items-center justify-center transition-all duration-300",
                    isPremiumTheme 
                      ? "bg-premium-gold hover:shadow-[0_0_20px_rgba(212,175,55,0.5)]" 
                      : "bg-gradient-to-r from-[#6366F1] to-[#4F46E5] hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]",
                    "hover:scale-110",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  )}
                  aria-label="Send message"
                >
                  <Send className={cn("w-5 h-5", isPremiumTheme ? "text-premium-bg" : "text-white")} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
