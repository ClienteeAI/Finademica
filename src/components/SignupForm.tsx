import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, EyeOff, Check, Loader2 } from "lucide-react";
import { useClient } from "@/lib/clientContext";
import { supabase } from "@/integrations/supabase/client";

interface SignupFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quizAnswers: {
    experience: string;
    markets: string[];
    goal: string;
    concern: string;
    timeCommitment: string;
  };
}

const SignupForm = ({ open, onOpenChange, quizAnswers }: SignupFormProps) => {
  const navigate = useNavigate();
  const { client } = useClient();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
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
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!isPasswordValid) newErrors.password = "Password does not meet requirements";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    if (!client) {
      alert('Client not found. Please refresh the page.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current auth user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert('You must be logged in. Please sign up first.');
        setIsSubmitting(false);
        return;
      }

      // UPDATE existing user (created by trigger), never INSERT
      const { error } = await supabase
        .from('users')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          quiz_answers: quizAnswers,
          account_status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('auth_user_id', user.id);

      if (error) {
        console.error('Supabase update error:', error);
        throw new Error(error.message);
      }

      console.log('User updated in Supabase');

      // Send to webhook (don't block on this)
      try {
        const webhookData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          timestamp: new Date().toISOString(),
          source: `${client.company_name} - Quiz`,
          clientId: client.id,
          clientSubdomain: client.subdomain,
          quizAnswers
        };

        await fetch('https://clientee.app.n8n.cloud/webhook-test/0436515b-5645-4361-b278-c6273f0d5efb', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          mode: 'no-cors',
          body: JSON.stringify(webhookData),
        });
        console.log("Signup data sent to webhook successfully");
      } catch (error) {
        console.error("Error sending signup data to webhook:", error);
      }

      // Save to localStorage
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone
      };
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userClientId', client.id);
      localStorage.setItem("quizAnswers", JSON.stringify(quizAnswers));

      // Redirect to dashboard
      navigate('/dashboard');

    } catch (err: any) {
      console.error('Signup error:', err);
      alert('Update failed: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card/95 backdrop-blur-lg border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-foreground">
            Your Personalized Trading Academy is Ready!
          </DialogTitle>
          <p className="text-center text-muted-foreground mt-2">
            Complete your profile to access everything:
          </p>
        </DialogHeader>

        {/* Benefits checklist */}
        <div className="space-y-2 my-4 bg-primary/10 rounded-lg p-4">
          {[
            "Your custom video playlist (12 videos selected for you)",
            "AI-powered stock analyzer",
            "Personalized learning roadmap",
            "Progress tracking & achievements"
          ].map((benefit, index) => (
            <div key={index} className="flex items-start gap-2 text-sm">
              <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-foreground">{benefit}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
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
                <Check className="w-3 h-3" />
                <span>At least 8 characters</span>
              </div>
              <div className={`flex items-center gap-1 ${passwordValidation.hasUppercase ? "text-green-500" : "text-muted-foreground"}`}>
                <Check className="w-3 h-3" />
                <span>One uppercase letter</span>
              </div>
              <div className={`flex items-center gap-1 ${passwordValidation.hasNumber ? "text-green-500" : "text-muted-foreground"}`}>
                <Check className="w-3 h-3" />
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
                Saving...
              </>
            ) : (
              "Complete My Profile"
            )}
          </Button>

          <div className="text-center space-y-2">
            <button
              type="button"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => navigate('/login')}
            >
              Already have an account? <span className="text-primary font-semibold">Sign In</span>
            </button>
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              🔒 We respect your privacy. No spam, ever. Unsubscribe anytime.
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SignupForm;
