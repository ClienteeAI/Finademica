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
import { SIGNUP_WEBHOOK_URL } from "@/lib/onboardingWebhook";
import CountryCodeSelect from "@/components/CountryCodeSelect";

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
  const [countryCode, setCountryCode] = useState("+420"); // Default to Czech Republic
  const [phoneNumber, setPhoneNumber] = useState("");
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
    if (!phoneNumber.trim()) newErrors.phone = "Phone number is required";
    else if (phoneNumber.trim().length < 6) newErrors.phone = "Please enter a valid phone number";
    
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
          phone: `${countryCode} ${phoneNumber}`,
          client_id: client.id,
          client_subdomain: client.subdomain,
          client_name: client.company_name,
          source: "lovable_signup"
        };

        await fetch(SIGNUP_WEBHOOK_URL, {
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
          phone: `${countryCode} ${phoneNumber}`,
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
      
      // Create combined user data with full phone number
      const completeUserData: SignupUserData = {
        ...formData,
        phone: `${countryCode} ${phoneNumber}`
      };
      
      // Store user data temporarily for quiz
      localStorage.setItem('pendingSignupData', JSON.stringify(completeUserData));
      
      // Trigger quiz modal (do NOT redirect, do NOT unlock content)
      onSignupComplete(completeUserData);
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
      <DialogContent className="max-w-md bg-[#1a1f2e] border-[#2a3142] text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-white">
            Create Your Free Account
          </DialogTitle>
          <p className="text-center text-gray-400 mt-2">
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
              <Label htmlFor="firstName" className="text-white">First Name</Label>
              <Input
                id="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className={`bg-[#2a3142] text-white placeholder:text-gray-500 border-[#3a4152] focus:border-primary ${errors.firstName ? "border-destructive" : ""}`}
                disabled={isSubmitting}
              />
              {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-white">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className={`bg-[#2a3142] text-white placeholder:text-gray-500 border-[#3a4152] focus:border-primary ${errors.lastName ? "border-destructive" : ""}`}
                disabled={isSubmitting}
              />
              {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nickname" className="text-white">Nickname (displayed publicly)</Label>
            <Input
              id="nickname"
              placeholder="TraderJohn"
              value={formData.nickname}
              onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
              className={`bg-[#2a3142] text-white placeholder:text-gray-500 border-[#3a4152] focus:border-primary ${errors.nickname ? "border-destructive" : ""}`}
              disabled={isSubmitting}
            />
            {errors.nickname && <p className="text-xs text-destructive">{errors.nickname}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`bg-[#2a3142] text-white placeholder:text-gray-500 border-[#3a4152] focus:border-primary ${errors.email ? "border-destructive" : ""}`}
              disabled={isSubmitting}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white">Phone Number</Label>
            <div className="flex gap-2">
              <CountryCodeSelect
                value={countryCode}
                onChange={setCountryCode}
                disabled={isSubmitting}
                hasError={!!errors.phone}
                className="bg-[#2a3142] border-[#3a4152]"
              />
              <Input
                id="phone"
                type="tel"
                placeholder="123 456 789"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className={`flex-1 bg-[#2a3142] text-white placeholder:text-gray-500 border-[#3a4152] focus:border-primary ${errors.phone ? "border-destructive" : ""}`}
                disabled={isSubmitting}
              />
            </div>
            {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a secure password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`bg-[#2a3142] text-white placeholder:text-gray-500 border-[#3a4152] focus:border-primary ${errors.password ? "border-destructive pr-10" : "pr-10"}`}
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            {/* Password requirements */}
            <div className="space-y-1 text-xs">
              <div className={`flex items-center gap-1 ${passwordValidation.hasLength ? "text-green-500" : "text-gray-500"}`}>
                <span className="w-3">✓</span>
                <span>At least 8 characters</span>
              </div>
              <div className={`flex items-center gap-1 ${passwordValidation.hasUppercase ? "text-green-500" : "text-gray-500"}`}>
                <span className="w-3">✓</span>
                <span>One uppercase letter</span>
              </div>
              <div className={`flex items-center gap-1 ${passwordValidation.hasNumber ? "text-green-500" : "text-gray-500"}`}>
                <span className="w-3">✓</span>
                <span>One number</span>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 text-base font-semibold"
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

          <p className="text-xs text-center text-gray-400">
            🔒 Your data is secure. We never share your information.
          </p>

          {/* Sign in link */}
          <div className="text-center pt-2">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  onOpenChange(false);
                  navigate('/login');
                }}
                className="text-white hover:text-gray-300 hover:underline font-medium transition-colors"
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
