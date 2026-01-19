import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

// Theme configuration types for dynamic theming from Supabase
interface ThemeConfig {
  light?: Record<string, string>;
  dark?: Record<string, string>;
  fonts?: {
    sans?: string;
    serif?: string;
    mono?: string;
  };
  radius?: string;
  shadows?: Record<string, string>;
}

interface Client {
  id: string;
  company_name: string;
  subdomain: string;
  custom_domain?: string | null;
  logo_url?: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  company_tagline?: string | null;
  skip_landing_page?: boolean | null;
  require_quiz?: boolean | null;
  signup_config?: Json | null;
  onboarding_config?: Json | null;
  theme_config?: ThemeConfig | null;
}

interface ClientContextType {
  client: Client | null;
  allClients: Client[];
  isAdminMode: boolean;
  switchClient: (subdomain: string) => void;
}

const ClientContext = createContext<ClientContextType | null>(null);

interface ClientProviderProps {
  children: ReactNode;
}

// Helper to load Google Fonts dynamically
function loadGoogleFont(fontFamily: string | undefined) {
  if (!fontFamily) return;
  
  const fontName = fontFamily.split(',')[0].trim().replace(/['"]/g, '');
  
  // Skip system fonts
  if (fontName.startsWith('ui-') || fontName === 'system-ui' || fontName === 'sans-serif' || fontName === 'serif') {
    return;
  }
  
  const existingLink = document.querySelector(`link[href*="${encodeURIComponent(fontName.replace(/ /g, '+'))}"]`);
  
  if (!existingLink) {
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@400;500;600;700&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
}

// Main function to apply theme from Supabase theme_config
function applyClientTheme(client: Client) {
  const root = document.documentElement;
  const themeConfig = client.theme_config as ThemeConfig | null;
  
  console.log('[Theme] Applying theme for client:', client.subdomain, 'theme_config:', themeConfig ? 'present' : 'missing');
  
  // Clear previous theme classes and inline styles
  root.classList.remove('theme-nasr');
  document.body.classList.remove('theme-nasr');
  document.body.style.background = '';
  document.body.style.backgroundAttachment = '';
  
  // If no theme_config, fall back to legacy primary/secondary colors
  if (!themeConfig) {
    console.log('[Theme] No theme_config, using legacy colors');
    // Legacy support: apply raw hex values
    if (client.primary_color) {
      root.style.setProperty('--client-primary', client.primary_color);
      const primaryHSL = hexToHSL(client.primary_color);
      root.style.setProperty('--primary', primaryHSL);
      root.style.setProperty('--ring', primaryHSL);
    }
    if (client.secondary_color) {
      root.style.setProperty('--client-secondary', client.secondary_color);
      const secondaryHSL = hexToHSL(client.secondary_color);
      root.style.setProperty('--accent', secondaryHSL);
    }
    return;
  }

  // Detect dark mode via .dark class on <html>
  const isDark = root.classList.contains('dark');
  const mode = isDark ? 'dark' : 'light';
  const vars = themeConfig[mode] || themeConfig.light;
  
  console.log('[Theme] Mode:', mode, 'Variables count:', vars ? Object.keys(vars).length : 0);

  // Apply all color variables from theme_config
  if (vars) {
    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, String(value));
    });
  }

  // Apply font variables
  if (themeConfig.fonts) {
    if (themeConfig.fonts.sans) {
      root.style.setProperty('--font-sans', themeConfig.fonts.sans);
      loadGoogleFont(themeConfig.fonts.sans);
    }
    if (themeConfig.fonts.serif) {
      root.style.setProperty('--font-serif', themeConfig.fonts.serif);
      loadGoogleFont(themeConfig.fonts.serif);
    }
    if (themeConfig.fonts.mono) {
      root.style.setProperty('--font-mono', themeConfig.fonts.mono);
    }
  }

  // Apply radius
  if (themeConfig.radius) {
    root.style.setProperty('--radius', String(themeConfig.radius));
  }

  // Apply shadow variables
  if (themeConfig.shadows) {
    Object.entries(themeConfig.shadows).forEach(([key, value]) => {
      const varName = key === 'DEFAULT' ? '--shadow' : `--shadow-${key}`;
      root.style.setProperty(varName, String(value));
    });
  }

  // Detect if this is a dark-based theme by checking background lightness
  // Support both HSL format: "H S% L%" and OKLCH format: "oklch(L C H)"
  const bgValue = vars?.background || '';
  let isDarkTheme = false;
  
  if (bgValue.startsWith('oklch(')) {
    // OKLCH format: oklch(0.2204 0.0198 275.8439) - L is first value (0-1 scale)
    const oklchMatch = bgValue.match(/oklch\(\s*([\d.]+)/);
    if (oklchMatch) {
      const lightness = parseFloat(oklchMatch[1]);
      isDarkTheme = lightness < 0.4; // OKLCH lightness: 0-1 scale, <0.4 is dark
    }
  } else {
    // HSL format: "H S% L%" - check L (lightness) percentage
    const bgLightness = parseFloat(bgValue.split(' ')[2]?.replace('%', '') || '50');
    isDarkTheme = bgLightness < 20;
  }
  
  console.log('[Theme] Background:', bgValue, 'isDarkTheme:', isDarkTheme);

  // Apply theme class for CSS utility overrides (e.g., .theme-nasr .premium-card)
  // This is needed for clients with dark themes that have special styling
  if (isDarkTheme) {
    root.classList.add('theme-nasr');
    document.body.classList.add('theme-nasr');
    // Dark theme - apply dark gradient background
    document.body.style.background = 'linear-gradient(145deg, #000000 0%, #02040A 50%, #0B0F16 100%)';
  } else {
    // Light theme - apply light gradient background
    document.body.style.background = 'linear-gradient(145deg, #F6F9FB 0%, #EDF2F7 50%, #F6F9FB 100%)';
  }
  document.body.style.backgroundAttachment = 'fixed';
}

// Legacy helper for hex to HSL conversion (for clients without theme_config)
function hexToHSL(hex: string): string {
  hex = hex.replace(/^#/, '');
  
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export function ClientProvider({ children }: ClientProviderProps) {
  const [client, setClient] = useState<Client | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [allClients, setAllClients] = useState<any[]>([]);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Watch for dark mode changes and reapply theme
  // Use a flag to prevent infinite loops when applyClientTheme modifies classes
  useEffect(() => {
    if (!client) return;

    let isApplyingTheme = false;

    const observer = new MutationObserver((mutations) => {
      // Skip if we're currently applying theme (prevents infinite loop)
      if (isApplyingTheme) return;
      
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          // Check if the change is a dark mode toggle (not our own theme class changes)
          const target = mutation.target as HTMLElement;
          const hasDarkClass = target.classList.contains('dark');
          const previouslyHadDark = (mutation.oldValue || '').includes('dark');
          
          // Only reapply if dark mode actually changed
          if (hasDarkClass !== previouslyHadDark) {
            isApplyingTheme = true;
            applyClientTheme(client);
            // Reset flag after a microtask to allow DOM to settle
            queueMicrotask(() => {
              isApplyingTheme = false;
            });
          }
        }
      });
    });

    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeOldValue: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, [client]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (cancelled) return;
      await initializeClient();
    };

    run();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      run();
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  async function initializeClient() {
    setLoading(true);

    // Check if user is Super Admin via secure Supabase RPC
    let isAdmin = false;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data, error } = await supabase.rpc('is_super_admin', {
          p_auth_user_id: session.user.id,
        });

        if (!error && data === true) {
          isAdmin = true;
        }
      }
    } catch (err) {
      console.error('Error checking super admin status:', err);
    }

    setIsAdminMode(isAdmin);

    if (isAdmin) {
      // Load ALL clients for admin
      const { data } = await supabase
        .from('clients')
        .select('*')
        .eq('active', true)
        .order('company_name');
      
      setAllClients(data || []);

      // PRIORITY 1: Match by custom_domain (so admin sees correct client on white-label domains)
      const hostname = window.location.hostname;
      const domainMatchedClient = data?.find(c => c.custom_domain === hostname);
      if (domainMatchedClient) {
        setClient(domainMatchedClient as Client);
        applyClientTheme(domainMatchedClient as Client);
        localStorage.setItem('client_id', domainMatchedClient.id);
        setLoading(false);
        return;
      }

      // PRIORITY 2: Check if client override in localStorage (for Lovable/admin domain)
      const savedClient = localStorage.getItem('admin_selected_client');
      if (savedClient) {
        const selectedClient = data?.find(c => c.subdomain === savedClient);
        if (selectedClient) {
          setClient(selectedClient as Client);
          applyClientTheme(selectedClient as Client);
          localStorage.setItem('client_id', selectedClient.id);
          setLoading(false);
          return;
        }
      }

      // PRIORITY 3: Default to first client
      const firstClient = data?.[0];
      if (firstClient) {
        setClient(firstClient as Client);
        applyClientTheme(firstClient as Client);
        localStorage.setItem('client_id', firstClient.id);
      }
    } else {
      // Regular user - detect client from query param > custom_domain > subdomain > fallback
      const urlParams = new URLSearchParams(window.location.search);
      const clientParam = urlParams.get('client');
      const hostname = window.location.hostname;
      
      // PRIORITY 1: Query param override (for testing)
      if (clientParam) {
        const { data } = await supabase
          .from('clients')
          .select('*')
          .eq('subdomain', clientParam)
          .eq('active', true)
          .single();

        if (data) {
          setClient(data as Client);
          applyClientTheme(data as Client);
          localStorage.setItem('client_id', data.id);
          setLoading(false);
          return;
        }
      }

      // PRIORITY 2: Custom domain lookup FIRST (for white-label domains like trade.nallio.io)
      // Use trimmed and lowercased hostname for robust matching
      const trimmedHostname = hostname.trim().toLowerCase();
      const { data: customDomainClient } = await supabase
        .from('clients')
        .select('*')
        .eq('custom_domain', trimmedHostname)
        .eq('active', true)
        .maybeSingle();
      
      if (customDomainClient) {
        console.log('[ClientProvider] Matched custom domain:', trimmedHostname, '-> client:', customDomainClient.subdomain);
        // Clear any stale localStorage overrides when on a custom domain
        localStorage.removeItem('user_client_subdomain');
        localStorage.removeItem('admin_selected_client');
        setClient(customDomainClient as Client);
        applyClientTheme(customDomainClient as Client);
        localStorage.setItem('client_id', customDomainClient.id);
        setLoading(false);
        return;
      }

      // PRIORITY 3: Try subdomain extraction for multi-tenant subdomains
      const isLocalhostOrIp = hostname.includes('localhost') || hostname.match(/^\d+\.\d+\.\d+\.\d+$/);
      const isLovablePreview = hostname.includes('lovable.app') || hostname.includes('lovableproject.com');

      if (!isLocalhostOrIp && !isLovablePreview) {
        const parts = hostname.split('.');
        if (parts.length > 2) {
          const subdomain = parts[0];
          const { data } = await supabase
            .from('clients')
            .select('*')
            .eq('subdomain', subdomain)
            .eq('active', true)
            .single();

          if (data) {
            setClient(data as Client);
            applyClientTheme(data as Client);
            localStorage.setItem('client_id', data.id);
            setLoading(false);
            return;
          }
        }
      }

      // PRIORITY 4: Saved client override ONLY for localhost
      // (Preview domains should stay deterministic; otherwise you can get “stuck” on another client)
      const savedUserClient = localStorage.getItem('user_client_subdomain');

      if (savedUserClient && isLovablePreview) {
        localStorage.removeItem('user_client_subdomain');
      }

      if (savedUserClient && isLocalhostOrIp) {
        const { data: userClientData } = await supabase
          .from('clients')
          .select('*')
          .eq('subdomain', savedUserClient)
          .eq('active', true)
          .maybeSingle();

        if (userClientData) {
          console.log('[ClientProvider] Using saved user client:', savedUserClient);
          setClient(userClientData as Client);
          applyClientTheme(userClientData as Client);
          localStorage.setItem('client_id', userClientData.id);
          setLoading(false);
          return;
        }
      }

      // PRIORITY 5: Fallback to 'nallio' for testing / preview environments
      const { data: fallbackClient } = await supabase
        .from('clients')
        .select('*')
        .eq('subdomain', 'nallio')
        .eq('active', true)
        .single();

      if (fallbackClient) {
        setClient(fallbackClient as Client);
        applyClientTheme(fallbackClient as Client);
        localStorage.setItem('client_id', fallbackClient.id);
      } else {
        console.error('Client not found: nallio (fallback)');
      }
    }
    
    setLoading(false);
  }

  function switchClient(subdomain: string) {
    const newClient = allClients.find(c => c.subdomain === subdomain);
    if (newClient) {
      setClient(newClient as Client);
      applyClientTheme(newClient as Client);
      localStorage.setItem('admin_selected_client', subdomain);
      localStorage.setItem('client_id', newClient.id);
      
      // Reload page to apply changes everywhere
      window.location.reload();
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Allow login page to render without a valid client
  const currentPath = window.location.pathname;
  const publicRoutes = ['/login'];
  const isPublicRoute = publicRoutes.includes(currentPath);

  if (!client && !isPublicRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 max-w-md p-8">
          <h1 className="text-2xl font-bold text-foreground">Client Not Found</h1>
          <p className="text-muted-foreground">
            The trading academy you're looking for doesn't exist. Please check the URL and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ClientContext.Provider value={{ client, allClients, isAdminMode, switchClient }}>
      {children}
    </ClientContext.Provider>
  );
}

export function useClient() {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClient must be used within ClientProvider');
  }
  return context;
}
