import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClient } from '@/lib/clientContext';
import { useAuth } from '@/lib/AuthContext';
import { Eye, EyeOff, Mail, Lock, AlertTriangle, Check } from 'lucide-react';
import { ForgotPasswordModal } from '@/components/ForgotPasswordModal';

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
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0E1A] via-[#0A0E1A] to-black">
        {/* Gradient Orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-success/15 rounded-full blur-[100px] animate-pulse-subtle" 
             style={{ animationDuration: '20s' }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-500/15 rounded-full blur-[100px] animate-pulse-subtle" 
             style={{ animationDuration: '25s', animationDelay: '5s' }} />
        
        {/* Grid Overlay */}
        <div className="absolute inset-0" 
             style={{ 
               backgroundImage: 'linear-gradient(rgba(30, 41, 59, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(30, 41, 59, 0.5) 1px, transparent 1px)',
               backgroundSize: '60px 60px'
             }} />
        
        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-[0.02]" 
             style={{ 
               backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
             }} />
      </div>

      {/* Login Card */}
      <div 
        className="relative w-full max-w-[480px] animate-fade-in"
        style={{ perspective: '1000px' }}
      >
        <div 
          className={`
            relative bg-[#121827]/40 backdrop-blur-[40px] backdrop-saturate-[180%]
            border border-white/10 rounded-[32px] p-6 sm:p-10 md:p-16
            shadow-[0_20px_60px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.05)_inset]
            transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]
            hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.08)_inset]
          `}
        >
          
          {/* Header */}
          <div className="text-center mb-12 space-y-3">
            <h1 className="text-[36px] font-bold text-white tracking-tight animate-slide-down"
                style={{ animationDelay: '100ms', letterSpacing: '-0.02em' }}>
              Welcome Back
            </h1>
            <p className="text-base text-white/60 animate-slide-down"
               style={{ animationDelay: '200ms' }}>
              Sign in to {client?.company_name || 'your trading academy'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm flex items-start gap-3 animate-slide-down ${shake ? 'animate-shake' : ''}`}>
              <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Email Input */}
            <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
              <label className="block text-[13px] font-semibold uppercase tracking-wider text-white/70 mb-3">
                EMAIL ADDRESS
              </label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 transition-colors group-focus-within:text-success" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  autoFocus
                  className="w-full h-14 pl-14 pr-5 bg-[#1E293B]/60 border-[1.5px] border-[#334155]/80 rounded-2xl
                           text-white text-[15px] font-medium placeholder-white/30
                           transition-all duration-300 ease-out
                           focus:border-success focus:bg-[#1E293B]/80 focus:outline-none
                           focus:shadow-[0_0_0_4px_rgba(0,208,132,0.1),0_8px_24px_rgba(0,208,132,0.15)]
                           focus:-translate-y-0.5"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
              <label className="block text-[13px] font-semibold uppercase tracking-wider text-white/70 mb-3">
                PASSWORD
              </label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 transition-colors group-focus-within:text-success" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full h-14 pl-14 pr-14 bg-[#1E293B]/60 border-[1.5px] border-[#334155]/80 rounded-2xl
                           text-white text-[15px] font-medium placeholder-white/30
                           transition-all duration-300 ease-out
                           focus:border-success focus:bg-[#1E293B]/80 focus:outline-none
                           focus:shadow-[0_0_0_4px_rgba(0,208,132,0.1),0_8px_24px_rgba(0,208,132,0.15)]
                           focus:-translate-y-0.5"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-all hover:scale-110"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end animate-fade-in" style={{ animationDelay: '450ms' }}>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-white/60 hover:text-success transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || success}
              className={`
                relative w-full h-14 rounded-2xl font-semibold text-base text-white
                bg-gradient-to-r from-success to-[#10B981]
                shadow-[0_4px_12px_rgba(0,208,132,0.3)]
                transition-all duration-300 ease-out
                hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-[0_12px_32px_rgba(0,208,132,0.4)]
                active:scale-[0.98] active:duration-100
                disabled:opacity-80 disabled:cursor-not-allowed disabled:transform-none
                overflow-hidden group
                animate-fade-in
              `}
              style={{ animationDelay: '500ms' }}
            >
              {/* Button Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[800ms]" />
              
              {/* Button Content */}
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading && (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {success && <Check size={20} className="animate-scale-in" />}
                {success ? 'Success!' : loading ? 'Signing in...' : 'Sign In'}
              </span>
            </button>

          </form>

          {/* Signup Link */}
          <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '600ms' }}>
            <p className="text-sm text-white/60">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/?signup=1')}
                className="text-success hover:text-success/80 hover:underline font-medium transition-colors"
              >
                Sign up
              </button>
            </p>
          </div>


        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-[#0A0E1A]/80 backdrop-blur-xl z-50 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-10 h-10 mx-auto border-4 border-success/30 border-t-success rounded-full animate-spin" />
            <p className="text-white/80 text-sm font-medium">Preparing your dashboard...</p>
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
  );
}

export default Login;
