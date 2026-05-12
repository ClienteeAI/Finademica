import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useClient } from '@/lib/clientContext';
import { cn } from '@/lib/utils';

interface ForgotPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultEmail?: string;
}

export function ForgotPasswordModal({ open, onOpenChange, defaultEmail = '' }: ForgotPasswordModalProps) {
  const { client } = useClient();
  const isPremiumTheme = client?.subdomain === 'finademica';
  const [email, setEmail] = useState(defaultEmail);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update email when defaultEmail changes (e.g., user typed in login form)
  useEffect(() => {
    if (defaultEmail) {
      setEmail(defaultEmail);
    }
  }, [defaultEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after modal closes
    setTimeout(() => {
      setSuccess(false);
      setError(null);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={cn(
        "backdrop-blur-xl sm:max-w-md",
        isPremiumTheme 
          ? "bg-premium-bg/95 border-premium-gold/20" 
          : "bg-card/95 border-border/50"
      )}>
        <DialogHeader>
          <DialogTitle className={cn(
            "text-xl font-bold",
            isPremiumTheme ? "text-premium-gold" : "text-foreground"
          )}>
            Reset Password
          </DialogTitle>
          <DialogDescription className={cn(isPremiumTheme ? "text-premium-text-muted" : "text-muted-foreground")}>
            Enter your email address and we'll send you a password reset link.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center py-6 gap-4">
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center",
              isPremiumTheme ? "bg-premium-gold/20" : "bg-success/20"
            )}>
              <CheckCircle className={cn("w-8 h-8", isPremiumTheme ? "text-premium-gold" : "text-success")} />
            </div>
            <div className="text-center">
              <p className="text-foreground font-medium">Link Sent!</p>
              <p className="text-muted-foreground text-sm mt-1">
                Check your inbox and click the link to reset your password.
              </p>
            </div>
            <Button 
              onClick={handleClose} 
              className={cn("mt-2", isPremiumTheme && "bg-premium-gold hover:bg-premium-gold-dark text-premium-bg")}
            >
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="reset-email" className="text-foreground">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className={cn(
                    "pr-10 focus:outline-none",
                    isPremiumTheme 
                      ? "bg-premium-panel/50 border-premium-gold/20 focus:border-premium-gold text-premium-text placeholder:text-premium-text-muted/50" 
                      : "bg-background/50 border-border/50 focus:border-primary"
                  )}
                  required
                  dir="ltr"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className={cn(
                  "flex-1",
                  isPremiumTheme 
                    ? "bg-premium-gold hover:bg-premium-gold-dark text-premium-bg" 
                    : ""
                )}
                disabled={loading || !email}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  'Send Link'
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
