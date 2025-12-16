import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface LevelUpModalProps {
  level: number;
  onClose: () => void;
}

const LEVEL_NAMES: Record<number, string> = {
  1: "Beginner Trader",
  2: "Student Trader",
  3: "Apprentice Trader",
  4: "Intermediate Trader",
  5: "Advanced Trader",
  6: "Expert Trader",
  7: "Professional Trader",
  8: "Elite Trader",
  9: "Master Trader",
  10: "Legend Trader",
};

const LevelUpModal = ({ level, onClose }: LevelUpModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Fade in backdrop
    setTimeout(() => setIsVisible(true), 50);
    // Show content with delay
    setTimeout(() => setShowContent(true), 300);
  }, []);

  const handleClose = () => {
    setShowContent(false);
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const levelName = LEVEL_NAMES[level] || `Level ${level} Trader`;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`relative max-w-md w-full mx-4 transition-all duration-500 ${
          showContent ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
      >
        {/* Glow rings */}
        <div className="absolute -inset-8 bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-xl animate-pulse" style={{ animationDelay: "150ms" }} />

        {/* Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl border-2 border-cyan-500/50 shadow-2xl p-8 text-center">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-purple-500/10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(34,211,238,0.15)_0%,_transparent_70%)]" />

          {/* Confetti particles (decorative) */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  backgroundColor: ['#22d3ee', '#a855f7', '#f59e0b', '#10b981'][i % 4],
                  animationDuration: `${1 + Math.random() * 2}s`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  opacity: 0.6,
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10 space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest">
                Congratulations!
              </p>
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                LEVEL UP!
              </h1>
            </div>

            {/* Level Number */}
            <div className="relative py-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 animate-ping" />
              </div>
              <div className="relative">
                <span className="text-8xl md:text-9xl font-black bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-2xl">
                  {level}
                </span>
              </div>
            </div>

            {/* Level Name */}
            <div className="space-y-1">
              <p className="text-gray-400 text-sm">You're now a</p>
              <p className="text-xl md:text-2xl font-bold text-white">
                {levelName}
              </p>
            </div>

            {/* CTA */}
            <Button
              onClick={handleClose}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-6 text-lg rounded-xl shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40 hover:scale-105"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelUpModal;
