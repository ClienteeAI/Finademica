import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface MobileScreenContainerProps {
  children: ReactNode;
  /** Background video source URL */
  backgroundVideo?: string;
  /** Enable dark overlay for text readability on video/image backgrounds */
  withOverlay?: boolean;
  /** Additional className for the container */
  className?: string;
  /** Enable safe area top padding (for headers/titles) */
  safeAreaTop?: boolean;
}

/**
 * MobileScreenContainer - Provides consistent safe area handling and background overlays
 * for mobile screens across the app.
 * 
 * Features:
 * - iOS notch/status bar safe area padding
 * - Background video with gradient overlay for readability
 * - Consistent spacing that works on all device types
 */
export function MobileScreenContainer({
  children,
  backgroundVideo,
  withOverlay = false,
  className,
  safeAreaTop = true,
}: MobileScreenContainerProps) {
  return (
    <div className={cn('relative min-h-full', className)}>
      {/* Background Video Layer */}
      {backgroundVideo && (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute w-full h-full object-cover opacity-30"
          >
            <source src={backgroundVideo} type="video/mp4" />
          </video>
          {/* Dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>
      )}

      {/* Background overlay without video (for complex backgrounds) */}
      {withOverlay && !backgroundVideo && (
        <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
      )}

      {/* Safe Area Top Padding - accounts for iOS status bar/notch */}
      {safeAreaTop && (
        <div 
          className="h-safe-area-top w-full" 
          style={{ 
            height: 'max(env(safe-area-inset-top, 0px), 20px)',
            minHeight: '20px'
          }} 
        />
      )}

      {/* Main Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export default MobileScreenContainer;
