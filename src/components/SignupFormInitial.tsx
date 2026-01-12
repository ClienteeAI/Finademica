import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useClient } from "@/lib/clientContext";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ONBOARDING_WEBHOOK_URL } from "@/lib/onboardingWebhook";

export interface SignupUserData {
  firstName: string;
  lastName: string;
  nickname: string;
  email: string;
  phone: string;
  password: string;
}

interface SignupFormInitialProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignupComplete: (userData: SignupUserData) => void;
}

const SignupFormInitial = ({ open, onOpenChange, onSignupComplete }: SignupFormInitialProps) => {
  const navigate = useNavigate();
  const { client } = useClient();
  const { signUp, signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [webhookError, setWebhookError] = useState<string | null>(null);
  const [formData, setFormData] = useState<SignupUserData>({
    firstName: "",
    lastName: "",
    nickname: "",
    email: "",
    phone: "",
    password: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validatePassword = (password: string) => {
    const hasLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return { hasLength, hasUppercase, hasNumber };
  };

  const passwordValidation = validatePassword(formData.password);
  const isPasswordValid = passwordValidation.hasLength && passwordValidation.hasUppercase && passwordValidation.hasNumber;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.nickname.trim()) newErrors.nickname = "Nickname is required";
    else if (formData.nickname.trim().length < 3) newErrors.nickname = "Nickname must be at least 3 characters";
    else if (formData.nickname.trim().length > 20) newErrors.nickname = "Nickname must be 20 characters or less";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!isPasswordValid) newErrors.password = "Password does not meet requirements";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWebhookError(null);
    
    if (!validate()) return;
    if (!client) {
      setWebhookError("Client not found. Please refresh the page.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create signup session token via RPC (REQUIRED - blocks signup if fails)
      const { data: signup_token, error: tokenError } = await supabase.rpc(
        'create_signup_session',
        { p_client_slug: client.subdomain }
      );

      if (tokenError || !signup_token) {
        console.error('Failed to create signup session:', tokenError);
        setWebhookError("Failed to initialize signup. Please try again.");
        setIsSubmitting(false);
        return;
      }

      console.log("Signup token created:", signup_token);

      // 2. Send signup webhook (optional, non-blocking)
      try {
        const webhookPayload = {
          event: "signup_form_submitted",
          timestamp: new Date().toISOString(),
          first_name: formData.firstName,
          last_name: formData.lastName,
          nickname: formData.nickname,
          email: formData.email,
          phone: formData.phone,
          client_id: client.id,
          client_subdomain: client.subdomain,
          client_name: client.company_name,
          source: "lovable_signup"
        };

        await fetch(ONBOARDING_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(webhookPayload),
        });
        console.log("Signup webhook sent successfully");
      } catch (webhookErr) {
        console.warn("Webhook failed, continuing:", webhookErr);
      }


      // 3. Create user with Supabase Auth using signup_token (NOT client_id)
      const { error: signUpError } = await signUp(
        formData.email,
        formData.password,
        { 
          signup_token,
          first_name: formData.firstName,
          last_name: formData.lastName,
          nickname: formData.nickname,
          phone: formData.phone,
        }
      );

      if (signUpError) {
        console.error('Supabase auth error:', signUpError);
        if (signUpError.message.includes('already registered')) {
          setWebhookError("This email is already registered. Please sign in instead.");
        } else {
          setWebhookError(signUpError.message);
        }
        setIsSubmitting(false);
        return;
      }

      console.log('User created with Supabase Auth');
      
      // Store user data temporarily for quiz
      localStorage.setItem('pendingSignupData', JSON.stringify(formData));
      
      // Trigger quiz modal (do NOT redirect, do NOT unlock content)
      onSignupComplete(formData);
      onOpenChange(false);

    } catch (error) {
      console.error("Signup failed:", error);
      setWebhookError("Failed to complete signup. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card/95 backdrop-blur-lg border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-foreground">
            Create Your Free Account
          </DialogTitle>
          <p className="text-center text-muted-foreground mt-2">
            Join {client?.company_name || "our trading academy"} today
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {webhookError && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-lg">
              {webhookError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className={errors.firstName ? "border-destructive" : ""}
                disabled={isSubmitting}
              />
              {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className={errors.lastName ? "border-destructive" : ""}
                disabled={isSubmitting}
              />
              {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nickname">Nickname (displayed publicly)</Label>
            <Input
              id="nickname"
              placeholder="TraderJohn"
              value={formData.nickname}
              onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
              className={errors.nickname ? "border-destructive" : ""}
              disabled={isSubmitting}
            />
            {errors.nickname && <p className="text-xs text-destructive">{errors.nickname}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={errors.email ? "border-destructive" : ""}
              disabled={isSubmitting}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (with country prefix)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+420 123 456 789"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={errors.phone ? "border-destructive" : ""}
              disabled={isSubmitting}
            />
            {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a secure password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={errors.password ? "border-destructive pr-10" : "pr-10"}
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            {/* Password requirements */}
            <div className="space-y-1 text-xs">
              <div className={`flex items-center gap-1 ${passwordValidation.hasLength ? "text-green-500" : "text-muted-foreground"}`}>
                <span className="w-3">✓</span>
                <span>At least 8 characters</span>
              </div>
              <div className={`flex items-center gap-1 ${passwordValidation.hasUppercase ? "text-green-500" : "text-muted-foreground"}`}>
                <span className="w-3">✓</span>
                <span>One uppercase letter</span>
              </div>
              <div className={`flex items-center gap-1 ${passwordValidation.hasNumber ? "text-green-500" : "text-muted-foreground"}`}>
                <span className="w-3">✓</span>
                <span>One number</span>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-primary to-purple hover:opacity-90 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Continue"
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            🔒 Your data is secure. We never share your information.
          </p>

          {/* Sign in link */}
          <div className="text-center pt-2">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  onOpenChange(false);
                  navigate('/login');
                }}
                className="text-primary hover:text-primary/80 hover:underline font-medium transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SignupFormInitial;
