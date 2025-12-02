import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, MessageSquare, Bot, User } from "lucide-react";

const CHAT_WEBHOOK_URL = "https://clientee.app.n8n.cloud/webhook/2f5da978-0085-4212-bf66-277f85e2022f";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface StockChatProps {
  symbol?: string | null;
}

const StockChat = ({ symbol }: StockChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmedInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(CHAT_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmedInput,
          symbol: symbol || null,
          timestamp: new Date().toISOString(),
          conversation_history: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const text = await response.text();
      let data: unknown;
      try {
        data = text ? JSON.parse(text) : { message: "Response received" };
      } catch {
        data = { message: text || "Response received" };
      }

      // Extract response content
      let responseContent = "";
      if (typeof data === "string") {
        responseContent = data;
      } else if (data && typeof data === "object") {
        const obj = data as Record<string, unknown>;
        responseContent =
          (obj.output as string) ||
          (obj.response as string) ||
          (obj.message as string) ||
          (obj.text as string) ||
          (obj.content as string) ||
          JSON.stringify(data, null, 2);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I couldn't process your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-[#D4E0EC]">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4DE2E8] to-[#2FB3C6] flex items-center justify-center shadow-[0_0_15px_rgba(77,226,232,0.3)]">
          <MessageSquare className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-[#1D3557]">AI Trading Assistant</h3>
          <p className="text-xs text-[#6B7280]">
            {symbol ? `Discussing ${symbol}` : "Ask anything about trading"}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 min-h-[300px] max-h-[400px]">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-8">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#4DE2E8]/10 to-[#A7E9FF]/10 flex items-center justify-center border border-[#D4E0EC]">
              <Bot className="w-7 h-7 text-[#4DE2E8]" />
            </div>
            <div>
              <p className="font-medium text-[#1D3557]">Start a conversation</p>
              <p className="text-sm text-[#6B7280] max-w-xs">
                Ask questions about {symbol || "any stock"}, trading strategies, or market analysis
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4DE2E8] to-[#2FB3C6] flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-[#4DE2E8] to-[#2FB3C6] text-white"
                    : "bg-white/60 backdrop-blur-sm border border-[#D4E0EC] text-[#4B5563]"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-[#1D3557] flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4DE2E8] to-[#2FB3C6] flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white/60 backdrop-blur-sm border border-[#D4E0EC] rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#4DE2E8]" />
                <span className="text-sm text-[#6B7280]">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="pt-4 border-t border-[#D4E0EC]">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder={`Ask about ${symbol || "trading"}...`}
            disabled={isLoading}
            className="flex-1 bg-white/60 border-[#D4E0EC] focus:border-[#4DE2E8]"
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            size="icon"
            className="bg-gradient-to-r from-[#4DE2E8] to-[#2FB3C6] hover:opacity-90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StockChat;
