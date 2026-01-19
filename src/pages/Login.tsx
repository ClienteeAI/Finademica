import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClient } from '@/lib/clientContext';
import { useAuth } from '@/lib/AuthContext';
import { Eye, EyeOff, Mail, Lock, AlertTriangle, Check, Loader2 } from 'lucide-react';
import { ForgotPasswordModal } from '@/components/ForgotPasswordModal';
import { Button } from '@/components/ui/button';
import MetaPixel from '@/components/MetaPixel';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();
  const { client } = useClient();
  const { signIn, user } = useAuth();

  // Handle ?signup=1 parameter - redirect to signup flow
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('signup') === '1') {
      navigate('/landing?signup=1', { replace: true });
      return;
    }
  }, [navigate]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    console.log('[Login] Form submitted, email:', email);
    setLoading(true);
    setError('');
    setShake(false);

    try {
      console.log('[Login] Calling signIn...');
      const result = await signIn(email, password);
      console.log('[Login] signIn result:', result);

      if (result.error) {
        console.error('[Login] Sign in error:', result.error);
        let errorMessage = 'Invalid email or password';
        if (result.error.message?.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password';
        } else if (result.error.message?.includes('Email not confirmed')) {
          errorMessage = 'Please confirm your email before signing in';
        } else {
          errorMessage = result.error.message || 'Sign in failed';
        }
        setError(errorMessage);
        setLoading(false);
        setShake(true);
        setTimeout(() => setShake(false), 500);
        return;
      }

      console.log('[Login] Sign in successful, redirecting...');

      // Show success state
      setSuccess(true);
      setLoading(false);

      // Redirect after success animation
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
      
    } catch (err) {
      console.error('[Login] Caught exception:', err);
      setError('Something went wrong. Please try again.');
      setLoading(false);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }

  return (
    <>
      <MetaPixel />
      <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background effects - using semantic tokens */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-success/10 rounded-full blur-3xl" />
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md z-10">
        {/* Logo */}
        {client?.logo_url && (
          <div className="flex justify-center mb-8">
            <img 
              src={client.logo_url} 
              alt={client.company_name || 'Logo'} 
              className="h-12 object-contain"
            />
          </div>
        )}

        <div className="bg-card/90 backdrop-blur-xl rounded-2xl p-8 border border-border/50 shadow-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Sign in to {client?.company_name || 'your trading academy'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-xl text-destructive text-sm flex items-start gap-3 ${shake ? 'animate-shake' : ''}`}>
              <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  autoFocus
                  className="w-full h-12 pl-12 pr-4 bg-card border border-border rounded-xl
                           text-foreground placeholder:text-muted-foreground
                           transition-all duration-200
                           focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full h-12 pl-12 pr-12 bg-card border border-border rounded-xl
                           text-foreground placeholder:text-muted-foreground
                           transition-all duration-200
                           focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || success}
              className="w-full h-12 text-base font-semibold"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
              {success && <Check size={20} className="mr-2" />}
              {success ? 'Success!' : loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Signup Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/landing?signup=1')}
                className="text-primary hover:text-primary/80 hover:underline font-medium transition-colors"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="w-10 h-10 mx-auto animate-spin text-primary" />
            <p className="text-foreground text-sm font-medium">Preparing your dashboard...</p>
          </div>
        </div>
      )}

        {/* Forgot Password Modal */}
        <ForgotPasswordModal
          open={showForgotPassword}
          onOpenChange={setShowForgotPassword}
          defaultEmail={email}
        />
      </div>
    </>
  );
}

export default Login;