import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  /** Variant: 'default' for light glass, 'dark' for darker backgrounds, 'solid' for full opacity */
  variant?: 'default' | 'dark' | 'solid';
  /** Add hover lift effect */
  hoverable?: boolean;
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * GlassCard - A consistent frosted glass card component with proper readability.
 * 
 * Features:
 * - Proper opacity for text contrast
 * - Consistent blur and border styling
 * - Dark theme compatible
 * - Proper shadow for depth separation
 */
export function GlassCard({
  children,
  className,
  variant = 'default',
  hoverable = false,
  padding = 'md',
}: GlassCardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-3 md:p-4',
    md: 'p-4 md:p-5',
    lg: 'p-5 md:p-6',
  };

  const variantClasses = {
    default: 'glass-card-light',
    dark: 'glass-card-dark',
    solid: 'glass-card-solid',
  };

  return (
    <Card
      className={cn(
        'overflow-hidden transition-all duration-300',
        variantClasses[variant],
        paddingClasses[padding],
        hoverable && 'hover:-translate-y-1 hover:shadow-lg',
        className
      )}
    >
      {children}
    </Card>
  );
}

export default GlassCard;
