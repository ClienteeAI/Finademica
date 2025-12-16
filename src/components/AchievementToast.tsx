import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface AchievementToastProps {
  achievement: {
    name: string;
    icon: string;
    description?: string;
  };
  onClose: () => void;
}

const AchievementToast = ({ achievement, onClose }: AchievementToastProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Slide in
    setTimeout(() => setIsVisible(true), 50);
    
    // Auto dismiss after 5 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed top-4 right-4 z-[100] transition-all duration-300 ease-out ${
        isVisible && !isExiting
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0"
      }`}
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl border-2 border-yellow-500/50 shadow-2xl shadow-yellow-500/20 p-4 min-w-[280px]">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-yellow-500/10 animate-pulse" />
        
        {/* Content */}
        <div className="relative flex items-start gap-4">
          {/* Achievement Icon */}
          <div className="relative">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500/30 to-amber-600/30 flex items-center justify-center border border-yellow-500/50 shadow-lg shadow-yellow-500/20">
              <span className="text-3xl">{achievement.icon}</span>
            </div>
            {/* Shine effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-transparent via-white/20 to-transparent animate-pulse" />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-yellow-400 uppercase tracking-wider mb-1">
              Achievement Unlocked!
            </p>
            <p className="font-bold text-white text-lg truncate">
              {achievement.name}
            </p>
            {achievement.description && (
              <p className="text-sm text-gray-400 mt-0.5 truncate">
                {achievement.description}
              </p>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-white transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar for auto-dismiss */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700/50">
          <div 
            className="h-full bg-gradient-to-r from-yellow-500 to-amber-500 animate-[shrink_5s_linear]"
            style={{ animation: "shrink 5s linear forwards" }}
          />
        </div>
      </div>

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default AchievementToast;
