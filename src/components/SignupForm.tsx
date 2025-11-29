import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, EyeOff, Check } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    // Create combined data object
    const signupData = {
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      quizAnswers,
      timestamp: new Date().toISOString()
    };

    // Log to console (will be webhook later)
    console.log("Signup Data:", signupData);

    // Store in localStorage
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userData", JSON.stringify({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone
    }));

    // Redirect to dashboard
    navigate("/dashboard");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card/95 backdrop-blur-lg border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-foreground">
            Your Personalized Trading Academy is Ready!
          </DialogTitle>
          <p className="text-center text-muted-foreground mt-2">
            Create your free account to access everything:
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
                className={errors.firstName ? "border-error" : ""}
              />
              {errors.firstName && <p className="text-xs text-error">{errors.firstName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className={errors.lastName ? "border-error" : ""}
              />
              {errors.lastName && <p className="text-xs text-error">{errors.lastName}</p>}
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
              className={errors.email ? "border-error" : ""}
            />
            {errors.email && <p className="text-xs text-error">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={errors.phone ? "border-error" : ""}
            />
            {errors.phone && <p className="text-xs text-error">{errors.phone}</p>}
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
                className={errors.password ? "border-error pr-10" : "pr-10"}
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
              <div className={`flex items-center gap-1 ${passwordValidation.hasLength ? "text-success" : "text-muted-foreground"}`}>
                <Check className="w-3 h-3" />
                <span>At least 8 characters</span>
              </div>
              <div className={`flex items-center gap-1 ${passwordValidation.hasUppercase ? "text-success" : "text-muted-foreground"}`}>
                <Check className="w-3 h-3" />
                <span>One uppercase letter</span>
              </div>
              <div className={`flex items-center gap-1 ${passwordValidation.hasNumber ? "text-success" : "text-muted-foreground"}`}>
                <Check className="w-3 h-3" />
                <span>One number</span>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-purple hover:opacity-90 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Create My Free Account
          </Button>

          <div className="text-center space-y-2">
            <button
              type="button"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => console.log("Sign in clicked")}
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
