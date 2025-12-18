import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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

    // Insert message into Supabase
    const { data: insertedMsg, error } = await supabase
      .from("mentor_messages")
      .insert({
        auth_user_id: authUserId,
        role: "user",
        content: messageContent,
      })
      .select()
      .single();

    if (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      return;
    }

    // Add user message to UI immediately (realtime will also fire, but we check for duplicates)
    if (insertedMsg) {
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === insertedMsg.id);
        if (exists) return prev;
        return [
          ...prev,
          {
            id: insertedMsg.id,
            role: "user" as const,
            content: insertedMsg.content,
            timestamp: new Date(insertedMsg.created_at),
          },
        ];
      });
    }

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

    // Note: We don't call webhook here anymore!
    // Supabase trigger handles calling n8n when user message is inserted.
    // The mentor reply will come via realtime subscription.
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
          "bg-gradient-to-br from-[#4DE2E8] to-[#2FB3C6]",
          "flex items-center justify-center",
          "border-2 border-[#4DE2E8]/60",
          "hover:border-[#A7E9FF] hover:shadow-[0_0_25px_rgba(77,226,232,0.5)]",
          "shadow-[0_4px_20px_rgba(77,226,232,0.3)]",
          "transition-all duration-300 ease-out",
          "hover:scale-110 hover:-translate-y-1",
          "animate-pulse-subtle"
        )}
        aria-label="Open AI Mentor"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
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
              "bg-white/90 backdrop-blur-xl",
              "border border-[#D4E0EC]",
              "rounded-t-[26px] md:rounded-[26px]",
              "overflow-hidden",
              "flex flex-col",
              "animate-slide-up md:animate-slide-in-right",
              "shadow-[0_10px_50px_rgba(15,23,42,0.1)]"
            )}
          >
            {/* Header */}
            <div className="relative p-6 border-b border-[#D4E0EC] bg-gradient-to-r from-[#4DE2E8]/10 to-[#A7E9FF]/10">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4DE2E8] to-[#2FB3C6] flex items-center justify-center shadow-[0_0_15px_rgba(77,226,232,0.4)]">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#1D3557]">AI Trading Mentor</h3>
                  <p className="text-sm text-[#6B7280]">
                    Ask anything about trading, learning, or mindset.
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-[#6B7280] hover:text-[#1D3557] transition-colors"
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
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#4DE2E8]/20 to-[#A7E9FF]/20 flex items-center justify-center border border-[#4DE2E8]/30">
                    <Sparkles className="w-8 h-8 text-[#2FB3C6]" />
                  </div>
                  <p className="text-[#6B7280] text-sm">
                    Hi! I'm your AI Trading Mentor. Ask me anything!
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
                        ? "bg-gradient-to-r from-[#4DE2E8] to-[#2FB3C6] text-white shadow-[0_0_15px_rgba(77,226,232,0.3)]"
                        : "bg-white/80 backdrop-blur-sm text-[#1D3557] border border-[#D4E0EC]"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <p className="text-[10px] text-[#9CA3AF] mt-1 px-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-white/80 backdrop-blur-sm rounded-[18px] px-4 py-3 border border-[#D4E0EC]">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#6B7280]">Mentor is typing</span>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-[#4DE2E8] animate-pulse" />
                        <div className="w-2 h-2 rounded-full bg-[#4DE2E8] animate-pulse delay-150" />
                        <div className="w-2 h-2 rounded-full bg-[#4DE2E8] animate-pulse delay-300" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-[#D4E0EC] bg-white/70 backdrop-blur-xl">
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
                    "bg-white/80 border border-[#D4E0EC]",
                    "text-[#1D3557] placeholder:text-[#9CA3AF]",
                    "focus:outline-none focus:border-[#4DE2E8] focus:shadow-[0_0_15px_rgba(77,226,232,0.2)]",
                    "transition-all duration-300",
                    "backdrop-blur-xl"
                  )}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading || !authUserId}
                  className={cn(
                    "w-12 h-12 rounded-full",
                    "bg-gradient-to-r from-[#4DE2E8] to-[#2FB3C6]",
                    "flex items-center justify-center",
                    "hover:scale-110 hover:shadow-[0_0_20px_rgba(77,226,232,0.5)]",
                    "transition-all duration-300",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  )}
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
