import { useState, useRef, useCallback, useEffect } from "react";
import Vapi from "@vapi-ai/web";
import { supabase } from "@/integrations/supabase/client";

type CallStatus = "idle" | "connecting" | "active" | "ended";

interface UseVapiCallReturn {
  status: CallStatus;
  isSpeaking: boolean;
  transcript: Array<{ role: "user" | "assistant"; text: string }>;
  start: (assistantId: string, metadata: Record<string, string>) => Promise<void>;
  stop: () => void;
  volumeLevel: number;
}

export function useVapiCall(): UseVapiCallReturn {
  const vapiRef = useRef<Vapi | null>(null);
  const [status, setStatus] = useState<CallStatus>("idle");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<Array<{ role: "user" | "assistant"; text: string }>>([]);
  const [volumeLevel, setVolumeLevel] = useState(0);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
        vapiRef.current = null;
      }
    };
  }, []);

  const start = useCallback(async (assistantId: string, metadata: Record<string, string>) => {
    setStatus("connecting");
    setTranscript([]);

    try {
      // Fetch VAPI public key from edge function
      const { data, error } = await supabase.functions.invoke("vapi-config");
      if (error || !data?.publicKey) {
        throw new Error("Failed to fetch VAPI configuration");
      }

      const vapi = new Vapi(data.publicKey);
      vapiRef.current = vapi;

      // Event listeners
      vapi.on("call-start", () => {
        console.log("[VAPI] Call started");
        setStatus("active");
      });

      vapi.on("call-end", () => {
        console.log("[VAPI] Call ended");
        setStatus("ended");
        setIsSpeaking(false);
      });

      vapi.on("speech-start", () => {
        setIsSpeaking(true);
      });

      vapi.on("speech-end", () => {
        setIsSpeaking(false);
      });

      vapi.on("volume-level", (level: number) => {
        setVolumeLevel(level);
      });

      vapi.on("message", (msg: any) => {
        if (msg.type === "transcript") {
          if (msg.transcriptType === "final") {
            setTranscript((prev) => [
              ...prev,
              { role: msg.role, text: msg.transcript },
            ]);
          }
        }
      });

      vapi.on("error", (err: any) => {
        console.error("[VAPI] Error:", err);
        setStatus("ended");
      });

      // Start the call with assistant overrides
      await vapi.start(assistantId, {
        metadata,
        variableValues: metadata,
      });
    } catch (err) {
      console.error("[VAPI] Failed to start:", err);
      setStatus("idle");
      throw err;
    }
  }, []);

  const stop = useCallback(() => {
    if (vapiRef.current) {
      vapiRef.current.stop();
      vapiRef.current = null;
    }
    setStatus("ended");
    setIsSpeaking(false);
  }, []);

  return { status, isSpeaking, transcript, start, stop, volumeLevel };
}
