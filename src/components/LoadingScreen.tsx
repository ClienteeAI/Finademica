import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

const messages = [
  "Analyzing your answers...",
  "Selecting your perfect videos...",
  "Creating your custom roadmap...",
  "Setting up your dashboard..."
];

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => {
        if (prev < messages.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1200);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => {
      clearInterval(messageInterval);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-background via-primary/10 to-purple/10 backdrop-blur-sm">
      <div className="text-center space-y-8 animate-fade-in">
        {/* Animated spinner */}
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 border-4 border-primary/30 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-4 border-transparent border-t-purple rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "1s" }}></div>
        </div>
        
        {/* Animated message */}
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold text-foreground animate-pulse">
            {messages[messageIndex]}
          </h3>
          <div className="flex justify-center gap-2">
            {messages.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index <= messageIndex ? "bg-primary scale-125" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
