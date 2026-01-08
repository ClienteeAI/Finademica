import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { COACH_TIPS, TipId, CoachTipData } from '@/hooks/useCoachTips';

interface CoachTipProps {
  tipId: TipId;
  variant?: 'inline' | 'floating';
  onDismiss: () => void;
  onCta?: () => void;
  className?: string;
}

export function CoachTip({ tipId, variant = 'inline', onDismiss, onCta, className }: CoachTipProps) {
  const tip = COACH_TIPS[tipId];
  if (!tip) return null;

  const isFloating = variant === 'floating';

  return (
    <motion.div
      initial={{ opacity: 0, y: isFloating ? 20 : 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: isFloating ? 20 : 8, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={cn(
        'relative rounded-lg border bg-card/95 backdrop-blur-sm shadow-lg',
        isFloating && 'fixed z-50',
        // Desktop: bottom-right, Mobile: bottom sheet style
        isFloating && 'bottom-4 right-4 left-4 sm:left-auto sm:w-80',
        !isFloating && 'w-full',
        className
      )}
    >
      {/* Accent border */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary/60 to-primary/20 rounded-t-lg" />
      
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-primary" />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-semibold text-sm text-foreground leading-tight">
                {tip.title}
              </h4>
              <button
                onClick={onDismiss}
                className="flex-shrink-0 p-1 -m-1 rounded-full hover:bg-muted transition-colors"
                aria-label="Dismiss tip"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              {tip.text}
            </p>
            
            {tip.cta && (
              <Button
                size="sm"
                variant="default"
                className="mt-3 h-8 text-xs"
                onClick={() => {
                  onCta?.();
                  onDismiss();
                }}
              >
                {tip.cta.label}
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Floating container that handles positioning and max 1 tip
interface FloatingCoachTipProps {
  tipId: TipId | null;
  onDismiss: (tipId: TipId) => void;
  onCta?: (action: string) => void;
}

export function FloatingCoachTip({ tipId, onDismiss, onCta }: FloatingCoachTipProps) {
  if (!tipId) return null;
  
  const tip = COACH_TIPS[tipId];
  
  return (
    <AnimatePresence>
      {tipId && (
        <CoachTip
          tipId={tipId}
          variant="floating"
          onDismiss={() => onDismiss(tipId)}
          onCta={() => {
            if (tip?.cta?.action) {
              onCta?.(tip.cta.action);
            }
          }}
        />
      )}
    </AnimatePresence>
  );
}
