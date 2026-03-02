import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mic, MicOff, PhoneOff, Loader2, Volume2 } from "lucide-react";
import { useVapiCall } from "@/hooks/useVapiCall";
import { useAuth } from "@/lib/AuthContext";
import type { Gladiator } from "./gladiators";
import { ScrollArea } from "@/components/ui/scroll-area";

interface GladiatorCallModalProps {
  gladiator: Gladiator | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function GladiatorCallModal({
  gladiator,
  open,
  onOpenChange,
}: GladiatorCallModalProps) {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { status, isSpeaking, transcript, start, stop, volumeLevel } =
    useVapiCall();
  const [hasStarted, setHasStarted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll transcript
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  // Navigate to results when call ends, passing timestamp so results page knows to poll
  useEffect(() => {
    if (status === "ended" && hasStarted) {
      const callEndedAt = new Date().toISOString();
      const timer = setTimeout(() => {
        onOpenChange(false);
        navigate("/arena/results", { state: { callEndedAt } });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status, hasStarted, navigate, onOpenChange]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setHasStarted(false);
    }
  }, [open]);

  const handleStart = async () => {
    if (!gladiator || !user) return;
    setHasStarted(true);

    const metadata = {
      user_id: user.id,
      email: user.email || "",
      first_name: profile?.first_name || user.user_metadata?.first_name || "",
      last_name: profile?.last_name || user.user_metadata?.last_name || "",
      phone: profile?.phone || user.user_metadata?.phone || "",
    };

    try {
      await start(gladiator.assistantId, metadata);
    } catch (err) {
      console.error("Failed to start call:", err);
      setHasStarted(false);
    }
  };

  const handleEnd = () => {
    stop();
  };

  const handleClose = () => {
    if (status === "active" || status === "connecting") {
      stop();
    }
    onOpenChange(false);
  };

  if (!gladiator) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        hideCloseButton={status === "active"}
        className="max-w-md p-0 overflow-hidden bg-card border-border gap-0"
      >
        <DialogTitle className="sr-only">
          Session with {gladiator.name}
        </DialogTitle>

        {/* Header with gladiator info */}
        <div className="relative p-6 pb-4 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={gladiator.imageUrl}
                alt={gladiator.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-border"
              />
              {/* Speaking indicator */}
              <AnimatePresence>
                {isSpeaking && status === "active" && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                  >
                    <Volume2 className="w-3 h-3 text-primary-foreground" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                {gladiator.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {gladiator.title}
              </p>
            </div>

            {/* Status badge */}
            <div className="ml-auto">
              {status === "active" && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              )}
              {status === "connecting" && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-amber-400">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Connecting
                </span>
              )}
              {status === "ended" && (
                <span className="text-xs font-medium text-muted-foreground">
                  Session Ended
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Transcript area */}
        <ScrollArea className="h-[300px] p-4" ref={scrollRef}>
          {!hasStarted ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Mic className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">
                  Ready to begin?
                </p>
                <p className="text-sm text-muted-foreground max-w-xs mt-1">
                  {gladiator.name} will start the conversation.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 mt-1">
                <Mic className="w-4 h-4 text-primary flex-shrink-0" />
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Enable your microphone</span> — the session requires audio input.
                </p>
              </div>
            </div>
          ) : transcript.length === 0 && status !== "ended" ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-3">
                <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                <p className="text-sm text-muted-foreground">
                  {status === "connecting"
                    ? "Connecting to the Arena..."
                    : "Waiting for response..."}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {transcript.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {status === "ended" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-4"
                >
                  <p className="text-xs text-muted-foreground">
                    Session complete
                  </p>
                </motion.div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Audio visualiser bar */}
        {status === "active" && (
          <div className="px-4 pb-2">
            <div className="h-1 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                animate={{ width: `${Math.max(volumeLevel * 100, 5)}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="p-4 pt-2 border-t border-border flex justify-center gap-3">
          {!hasStarted ? (
            <Button
              onClick={handleStart}
              className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full"
            >
              <Mic className="w-5 h-5 mr-2" />
              Start Session
            </Button>
          ) : status === "active" || status === "connecting" ? (
            <Button
              onClick={handleEnd}
              variant="destructive"
              className="h-12 px-8 rounded-full font-semibold"
            >
              <PhoneOff className="w-5 h-5 mr-2" />
              End Session
            </Button>
          ) : (
            <Button
              onClick={handleClose}
              variant="secondary"
              className="h-12 px-8 rounded-full font-semibold"
            >
              Close
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
