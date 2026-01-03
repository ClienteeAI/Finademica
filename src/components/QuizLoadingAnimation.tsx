import { useEffect, useState } from "react";

interface QuizLoadingAnimationProps {
  module: string;
  isNasrTheme?: boolean;
}

const QuizLoadingAnimation = ({ module, isNasrTheme = false }: QuizLoadingAnimationProps) => {
  const [dots, setDots] = useState("");
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".");
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const accentColor = isNasrTheme ? "text-gold" : "text-primary";
  const mutedColor = isNasrTheme ? "text-nasr-text-muted" : "text-muted-foreground";
  const trackBg = isNasrTheme ? "bg-gold/20" : "bg-primary/20";
  const runnerColor = isNasrTheme ? "#E4C776" : "hsl(var(--primary))";

  return (
    <div className="py-12 space-y-8">
      {/* Running Track Container */}
      <div className="relative h-32 overflow-hidden">
        {/* Track/Road */}
        <div className={`absolute bottom-8 left-0 right-0 h-2 ${trackBg} rounded-full`}>
          {/* Moving dashes on track */}
          <div className="absolute inset-0 overflow-hidden rounded-full">
            <div className="track-dashes" />
          </div>
        </div>

        {/* Running Figure SVG */}
        <div className="running-figure absolute bottom-10">
          <svg
            width="60"
            height="60"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-lg"
          >
            {/* Head */}
            <circle cx="32" cy="12" r="8" fill={runnerColor} />
            {/* Body */}
            <path
              d="M32 20 L32 38"
              stroke={runnerColor}
              strokeWidth="4"
              strokeLinecap="round"
              className="runner-body"
            />
            {/* Arms - animated */}
            <g className="runner-arms">
              <path
                d="M32 26 L22 34"
                stroke={runnerColor}
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M32 26 L42 18"
                stroke={runnerColor}
                strokeWidth="3"
                strokeLinecap="round"
              />
            </g>
            {/* Legs - animated */}
            <g className="runner-legs">
              <path
                d="M32 38 L24 54"
                stroke={runnerColor}
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M32 38 L40 54"
                stroke={runnerColor}
                strokeWidth="3"
                strokeLinecap="round"
              />
            </g>
          </svg>
        </div>

        {/* Floating particles/sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`sparkle-particle absolute w-2 h-2 rounded-full ${isNasrTheme ? "bg-gold" : "bg-primary"}`}
              style={{
                left: `${15 + i * 15}%`,
                animationDelay: `${i * 0.3}s`,
                opacity: 0.6,
              }}
            />
          ))}
        </div>

        {/* Progress indicator dots */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                isNasrTheme ? "bg-gold" : "bg-primary"
              }`}
              style={{
                animation: `pulse-dot 1.5s ease-in-out infinite`,
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Loading Text */}
      <div className="text-center space-y-2">
        <p className={`text-lg font-medium ${accentColor}`}>
          Preparing Your Quiz{dots}
        </p>
        <p className={`text-sm ${mutedColor}`}>
          Generating {module} questions tailored for you
        </p>
      </div>

      {/* Fun Facts / Tips while loading */}
      <div className={`max-w-md mx-auto text-center p-4 rounded-xl ${isNasrTheme ? "bg-gold/10" : "bg-primary/10"}`}>
        <p className={`text-xs ${mutedColor}`}>
          💡 Tip: Take your time with each question. Understanding is more important than speed!
        </p>
      </div>

      {/* CSS Animations */}
      <style>{`
        .running-figure {
          animation: run-across 3s ease-in-out infinite;
        }

        @keyframes run-across {
          0% {
            left: -10%;
            transform: translateY(0);
          }
          25% {
            transform: translateY(-8px);
          }
          50% {
            left: 50%;
            transform: translateX(-50%) translateY(0);
          }
          75% {
            transform: translateY(-8px);
          }
          100% {
            left: 110%;
            transform: translateY(0);
          }
        }

        .runner-arms {
          animation: swing-arms 0.3s ease-in-out infinite alternate;
          transform-origin: 32px 26px;
        }

        @keyframes swing-arms {
          0% { transform: rotate(-15deg); }
          100% { transform: rotate(15deg); }
        }

        .runner-legs {
          animation: swing-legs 0.3s ease-in-out infinite alternate-reverse;
          transform-origin: 32px 38px;
        }

        @keyframes swing-legs {
          0% { transform: rotate(-20deg); }
          100% { transform: rotate(20deg); }
        }

        .track-dashes {
          position: absolute;
          top: 50%;
          left: 0;
          width: 200%;
          height: 2px;
          background: repeating-linear-gradient(
            90deg,
            transparent,
            transparent 20px,
            currentColor 20px,
            currentColor 40px
          );
          animation: move-track 1s linear infinite;
        }

        @keyframes move-track {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .sparkle-particle {
          animation: float-sparkle 2s ease-in-out infinite;
        }

        @keyframes float-sparkle {
          0%, 100% {
            transform: translateY(40px) scale(0.5);
            opacity: 0;
          }
          50% {
            transform: translateY(10px) scale(1);
            opacity: 0.8;
          }
        }

        @keyframes pulse-dot {
          0%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.5);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default QuizLoadingAnimation;
