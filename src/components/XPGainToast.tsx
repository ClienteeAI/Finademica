import { useEffect, useState, useCallback, useRef } from "react";
import { Sparkles, TrendingUp, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import LevelUpModal from "@/components/LevelUpModal";

interface XPGainEvent {
  xpAmount: number;
  title?: string;
}

interface LevelUpEvent {
  level: number;
}

interface XPToastState extends XPGainEvent {
  id: number;
}

// Internal toast component
const XPToastContent = ({ xpAmount, title, onComplete }: XPGainEvent & { onComplete: () => void }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showNumber, setShowNumber] = useState(false);
  const [displayedXP, setDisplayedXP] = useState(0);

  useEffect(() => {
    // Trigger entrance animation
    const entranceTimer = setTimeout(() => setIsVisible(true), 50);
    
    // Show number after entrance
    const numberTimer = setTimeout(() => setShowNumber(true), 300);
    
    // Animate XP count up
    const countDuration = 800;
    const startTime = Date.now() + 400;
    
    const countInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed < 0) return;
      
      const progress = Math.min(elapsed / countDuration, 1);
      // Ease out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      setDisplayedXP(Math.floor(eased * xpAmount));
      
      if (progress >= 1) {
        clearInterval(countInterval);
      }
    }, 16);

    // Auto-hide after 4 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onComplete(), 300);
    }, 4000);

    return () => {
      clearTimeout(entranceTimer);
      clearTimeout(numberTimer);
      clearTimeout(hideTimer);
      clearInterval(countInterval);
    };
  }, [xpAmount, onComplete]);

  return (
    <div
      className={cn(
        "fixed top-20 left-1/2 -translate-x-1/2 z-[100] pointer-events-none",
        "transition-all duration-500 ease-out",
        isVisible 
          ? "opacity-100 translate-y-0 scale-100" 
          : "opacity-0 -translate-y-4 scale-95"
      )}
    >
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-purple-500/30 blur-xl rounded-full scale-150" />
        
        {/* Main toast container */}
        <div className={cn(
          "relative px-6 py-4 rounded-2xl",
          "bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95",
          "backdrop-blur-xl border border-cyan-500/30",
          "shadow-[0_0_40px_rgba(34,211,238,0.3)]",
          "flex items-center gap-4"
        )}>
          {/* Icon with pulse */}
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/50 rounded-full blur-lg animate-pulse" />
            <div className={cn(
              "relative w-12 h-12 rounded-full",
              "bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500",
              "flex items-center justify-center",
              "shadow-[0_0_20px_rgba(34,211,238,0.5)]",
              showNumber && "animate-bounce"
            )}>
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            
            {/* Floating stars */}
            <Star className={cn(
              "absolute -top-1 -right-1 w-4 h-4 text-yellow-400 fill-yellow-400",
              "transition-all duration-500",
              showNumber ? "opacity-100 scale-100" : "opacity-0 scale-0"
            )} />
            <Star className={cn(
              "absolute -bottom-1 -left-1 w-3 h-3 text-cyan-400 fill-cyan-400",
              "transition-all duration-700 delay-100",
              showNumber ? "opacity-100 scale-100" : "opacity-0 scale-0"
            )} />
          </div>
          
          {/* Content */}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-400">
              {title || "XP Earned!"}
            </span>
            <div className="flex items-baseline gap-1">
              <span className={cn(
                "text-3xl font-black",
                "bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400",
                "bg-clip-text text-transparent",
                "transition-all duration-300",
                showNumber ? "opacity-100 scale-100" : "opacity-0 scale-90"
              )}>
                +{displayedXP}
              </span>
              <span className="text-lg font-bold text-cyan-400">XP</span>
            </div>
          </div>
          
          {/* Trending indicator */}
          <div className={cn(
            "ml-2 p-2 rounded-lg bg-green-500/20 border border-green-500/30",
            "transition-all duration-500 delay-300",
            showNumber ? "opacity-100 scale-100" : "opacity-0 scale-0"
          )}>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
        </div>
        
        {/* Particle effects */}
        {showNumber && (
          <>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "absolute w-2 h-2 rounded-full",
                  i % 2 === 0 ? "bg-cyan-400" : "bg-purple-400",
                  "animate-ping opacity-75"
                )}
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `${10 + Math.random() * 80}%`,
                  animationDelay: `${i * 100}ms`,
                  animationDuration: "1s",
                }}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

// Provider component that listens for XP gain and level-up events
export const XPGainToastProvider = () => {
  const [toasts, setToasts] = useState<XPToastState[]>([]);
  const [levelUpData, setLevelUpData] = useState<LevelUpEvent | null>(null);
  const idCounter = useRef(0);

  const handleXPGain = useCallback((event: CustomEvent<XPGainEvent>) => {
    const id = ++idCounter.current;
    setToasts(prev => [...prev, { ...event.detail, id }]);
  }, []);

  const handleLevelUp = useCallback((event: CustomEvent<LevelUpEvent>) => {
    // Delay level-up modal slightly so XP toast shows first
    setTimeout(() => {
      setLevelUpData(event.detail);
    }, 1500);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const closeLevelUpModal = useCallback(() => {
    setLevelUpData(null);
  }, []);

  useEffect(() => {
    window.addEventListener('xp-gain', handleXPGain as EventListener);
    window.addEventListener('level-up', handleLevelUp as EventListener);
    return () => {
      window.removeEventListener('xp-gain', handleXPGain as EventListener);
      window.removeEventListener('level-up', handleLevelUp as EventListener);
    };
  }, [handleXPGain, handleLevelUp]);

  return (
    <>
      {toasts.map((toast) => (
        <XPToastContent
          key={toast.id}
          xpAmount={toast.xpAmount}
          title={toast.title}
          onComplete={() => removeToast(toast.id)}
        />
      ))}
      
      {levelUpData && (
        <LevelUpModal
          level={levelUpData.level}
          onClose={closeLevelUpModal}
        />
      )}
    </>
  );
};

// Hook to manually trigger XP toast
export const useXPToast = () => {
  const showXPGain = useCallback((xpAmount: number, title?: string) => {
    window.dispatchEvent(new CustomEvent('xp-gain', { 
      detail: { xpAmount, title } 
    }));
  }, []);

  const showLevelUp = useCallback((level: number) => {
    window.dispatchEvent(new CustomEvent('level-up', { 
      detail: { level } 
    }));
  }, []);

  return { showXPGain, showLevelUp };
};

export default XPGainToastProvider;