import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import { Crown, Star, Trophy } from "lucide-react";

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
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    // Fade in backdrop
    setTimeout(() => setIsVisible(true), 50);
    // Show content with delay
    setTimeout(() => setShowContent(true), 300);
    // Reveal badge with delay
    setTimeout(() => setShowBadge(true), 800);
    
    // Trigger celebratory confetti burst
    setTimeout(() => {
      // Center burst
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5, x: 0.5 },
        colors: ["#22d3ee", "#a855f7", "#f59e0b", "#10b981", "#3b82f6"],
      });
      
      // Left side burst
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: ["#22d3ee", "#a855f7", "#f59e0b"],
      });
      
      // Right side burst
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: ["#22d3ee", "#a855f7", "#f59e0b"],
      });
    }, 400);
    
    // Second confetti wave
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 120,
        origin: { y: 0.4 },
        colors: ["#ffd700", "#ffec00", "#ffc107"],
      });
    }, 1200);
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

            {/* Badge reveal */}
            <div className={`relative py-6 transition-all duration-700 ${showBadge ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}>
              {/* Outer glow ring */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-yellow-500/30 via-amber-500/20 to-orange-500/30 animate-ping" />
              </div>
              
              {/* Badge container */}
              <div className="relative flex items-center justify-center">
                {/* Background shield */}
                <div className="absolute w-36 h-36 rounded-full bg-gradient-to-br from-yellow-500/20 via-amber-600/30 to-yellow-500/20 blur-xl" />
                
                {/* Main badge */}
                <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 shadow-[0_0_60px_rgba(251,191,36,0.5)] flex items-center justify-center border-4 border-yellow-300/50">
                  {/* Inner circle with level */}
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center border-2 border-yellow-400/30">
                    <span className="text-5xl font-black bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                      {level}
                    </span>
                  </div>
                  
                  {/* Crown icon on top */}
                  <Crown className="absolute -top-3 w-8 h-8 text-yellow-300 fill-yellow-400 drop-shadow-lg" />
                  
                  {/* Star decorations */}
                  <Star className="absolute -left-2 top-4 w-5 h-5 text-yellow-300 fill-yellow-300 animate-pulse" />
                  <Star className="absolute -right-2 top-4 w-5 h-5 text-yellow-300 fill-yellow-300 animate-pulse" style={{ animationDelay: "200ms" }} />
                  <Trophy className="absolute -bottom-1 w-6 h-6 text-yellow-400 fill-yellow-500" />
                </div>
              </div>
            </div>

            {/* Level Name */}
            <div className={`space-y-1 transition-all duration-500 delay-300 ${showBadge ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
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
              Continue Your Journey
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelUpModal;
