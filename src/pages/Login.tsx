import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useClient } from '@/lib/clientContext';
import { Eye, EyeOff } from 'lucide-react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { client } = useClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Query user from database
      const { data: user, error: queryError } = await supabase
        .from('users')
        .select('*, clients(*)')
        .eq('email', email)
        .single();

      if (queryError || !user) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }

      // For now, we're not checking password (no auth yet)
      // In production, you'd verify password hash here

      // Save to localStorage
      localStorage.setItem('email', user.email);
      localStorage.setItem('firstName', user.first_name || '');
      localStorage.setItem('lastName', user.last_name || '');
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('client_id', user.client_id);

      // Check if admin
      if (user.is_admin) {
        localStorage.setItem('isAdmin', 'true');
      }

      // If not admin, save their client
      if (!user.is_admin) {
        localStorage.setItem('userClientId', user.client_id);
      }

      // Redirect to dashboard
      navigate('/dashboard');
      
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-card/80 backdrop-blur-xl border border-border rounded-3xl p-12 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to continue to {client?.company_name || 'your academy'}</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/20 border border-destructive rounded-lg text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none transition-colors pr-12"
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

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 success-gradient text-white font-semibold rounded-xl hover:scale-[1.02] hover:shadow-lg hover:shadow-success/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>

        </form>

        {/* Signup Link */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground text-sm">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/')}
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </button>
          </p>
        </div>

        {/* Quick Test Logins (Remove in production) */}
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground mb-3">Quick test logins:</p>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                setEmail('petr@clientee.co');
                setPassword('test');
              }}
              className="w-full text-left px-3 py-2 text-xs bg-purple-900/20 border border-purple-600/30 rounded-lg text-purple-400 hover:bg-purple-900/30 transition-colors"
            >
              🔧 Admin: petr@clientee.co
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('test-naga@email.com');
                setPassword('test');
              }}
              className="w-full text-left px-3 py-2 text-xs bg-orange-900/20 border border-orange-600/30 rounded-lg text-orange-400 hover:bg-orange-900/30 transition-colors"
            >
              👤 NAGA User: test-naga@email.com
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('test-forex@email.com');
                setPassword('test');
              }}
              className="w-full text-left px-3 py-2 text-xs bg-green-900/20 border border-green-600/30 rounded-lg text-green-400 hover:bg-green-900/30 transition-colors"
            >
              👤 Forex User: test-forex@email.com
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;
