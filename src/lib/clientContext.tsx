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
// Now accepts mode parameter from next-themes instead of detecting from .dark class
function applyClientTheme(client: Client, mode: 'light' | 'dark' = 'dark') {
  const root = document.documentElement;
  const themeConfig = client.theme_config as ThemeConfig | null;
  
  console.log('[Theme] Applying theme for client:', client.subdomain, 'mode:', mode, 'theme_config:', themeConfig ? 'present' : 'missing');
  
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

  // Use the mode passed in (from next-themes) to select variables
  const vars = themeConfig[mode] || themeConfig.light || themeConfig.dark;
  
  console.log('[Theme] Mode:', mode, 'Variables count:', vars ? Object.keys(vars).length : 0);

  // Apply all color variables from theme_config
  if (vars) {
    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, String(value));
    });

    // CRITICAL FIX: Ensure sidebar variables are set even if not in DB
    // If background is dark, sidebar must be dark
    if (mode === 'dark' || mode === 'theme-nasr') {
      const bg = String(vars.background || '229 84% 5%');
      root.style.setProperty('--sidebar', bg);
      root.style.setProperty('--sidebar-foreground', '210 40% 98%');
      root.style.setProperty('--sidebar-border', '217 33% 17%');
      root.style.setProperty('--sidebar-primary', String(vars.primary || '239 84% 67%'));
      root.style.setProperty('--sidebar-ring', String(vars.primary || '239 84% 67%'));
    }
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

  // Only apply .theme-nasr class for the NASR client specifically (not all dark themes)
  // This preserves NASR-specific brand styling (gold accents, serif fonts, etc.)
  const isNasrClient = client.subdomain === 'nasr';
  
  if (isNasrClient) {
    root.classList.add('theme-nasr');
    document.body.classList.add('theme-nasr');
  }
  
  // Apply appropriate background gradient based on mode
  if (mode === 'dark') {
    const bgColor = client.secondary_color || '#020617';
    document.body.style.background = `linear-gradient(145deg, ${bgColor} 0%, #000000 50%, #0B0F16 100%)`;
  } else {
    document.body.style.background = 'linear-gradient(145deg, #F6F9FB 0%, #EDF2F7 50%, #F6F9FB 100%)';
  }
  document.body.style.backgroundAttachment = 'fixed';
  
  console.log('[Theme] Applied - isNasrClient:', isNasrClient, 'mode:', mode);
}

// Helper to get current theme mode from DOM (set by next-themes)
function getCurrentThemeMode(): 'light' | 'dark' {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
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
  const [allClients, setAllClients] = useState<any[]>([]);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!client) return;
    let isApplyingTheme = false;
    const observer = new MutationObserver((mutations) => {
      if (isApplyingTheme) return;
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const target = mutation.target as HTMLElement;
          const hasDarkClass = target.classList.contains('dark');
          const previouslyHadDark = (mutation.oldValue || '').includes('dark');
          if (hasDarkClass !== previouslyHadDark) {
            isApplyingTheme = true;
            applyClientTheme(client, hasDarkClass ? 'dark' : 'light');
            queueMicrotask(() => { isApplyingTheme = false; });
          }
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true, attributeOldValue: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [client]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!cancelled) await initializeClient();
    };
    run();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => { run(); });
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  async function initializeClient() {
    setLoading(true);
    const hostname = window.location.hostname;
    const urlParams = new URLSearchParams(window.location.search);
    const clientParam = urlParams.get('client');

    let isAdmin = false;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data, error } = await supabase.rpc('is_super_admin', { p_auth_user_id: session.user.id });
        if (!error && data === true) isAdmin = true;
      }
    } catch (err) { console.error('Error checking super admin status:', err); }
    setIsAdminMode(isAdmin);

    const { data: allClientsData } = await supabase.from('clients').select('*').eq('active', true).order('company_name');
    const clients = allClientsData || [];
    setAllClients(clients);

    // EMERGENCY FALLBACK: Hardcoded Finademica branding if DB is locked by RLS
    const finademicaFallback: Client = {
      id: "a6151fd9-1513-4ae0-b960-25454f3a9bf2",
      company_name: "Finademica",
      subdomain: "finademica",
      primary_color: "#6366F1",
      secondary_color: "#020617",
      company_tagline: "The Architecture of Mastery.",
      theme_config: {
        dark: {
          primary: "239 84% 67%",
          background: "229 84% 5%",
          surface: "222 47% 11%",
          foreground: "210 40% 98%",
          "primary-foreground": "0 0% 100%",
          sidebar: "229 84% 5%",
          "sidebar-foreground": "210 40% 98%",
          "sidebar-border": "217 33% 17%",
          "sidebar-primary": "239 84% 67%"
        },
        fonts: {
          serif: "Bodoni Moda, Georgia, serif",
          sans: "Jost, Helvetica Neue, sans-serif",
          mono: "JetBrains Mono, monospace"
        },
        radius: 0.5
      }
    };

    const defaultClientId = import.meta.env.VITE_DEFAULT_CLIENT_ID || finademicaFallback.id;
    if (defaultClientId) {
      let defaultClient = clients.find(c => c.id === defaultClientId);
      
      // If DB returned nothing, use our fallback
      if (!defaultClient && defaultClientId === finademicaFallback.id) {
        console.log('[ClientProvider] DB locked. Using Emergency Fallback for Finademica.');
        defaultClient = finademicaFallback;
      }

      if (defaultClient) {
        setClient(defaultClient as Client);
        applyClientTheme(defaultClient as Client, getCurrentThemeMode());
        localStorage.setItem('client_id', defaultClient.id);
        setLoading(false);
        return;
      }
    }

    const trimmedHostname = hostname.trim().toLowerCase();
    const domainMatchedClient = allClientsData?.find(c => 
      c.custom_domain?.toLowerCase() === trimmedHostname || 
      c.subdomain.toLowerCase() === trimmedHostname.split('.')[0]
    );

    if (domainMatchedClient) {
      setClient(domainMatchedClient as Client);
      applyClientTheme(domainMatchedClient as Client, getCurrentThemeMode());
      localStorage.setItem('client_id', domainMatchedClient.id);
      setLoading(false);
      return;
    }

    if (clientParam) {
      const paramClient = allClientsData?.find(c => c.subdomain === clientParam);
      if (paramClient) {
        setClient(paramClient as Client);
        applyClientTheme(paramClient as Client, getCurrentThemeMode());
        localStorage.setItem('client_id', paramClient.id);
        setLoading(false);
        return;
      }
    }

    const fallbackClient = allClientsData?.find(c => c.subdomain === 'finademica') || allClientsData?.[0];
    if (fallbackClient) {
      setClient(fallbackClient as Client);
      applyClientTheme(fallbackClient as Client, getCurrentThemeMode());
      localStorage.setItem('client_id', fallbackClient.id);
    }
    setLoading(false);
  }

  function switchClient(subdomain: string) {
    const newClient = allClients.find(c => c.subdomain === subdomain);
    if (newClient) {
      setClient(newClient as Client);
      applyClientTheme(newClient as Client, getCurrentThemeMode());
      localStorage.setItem('admin_selected_client', subdomain);
      localStorage.setItem('client_id', newClient.id);
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

  const currentPath = window.location.pathname;
  const publicRoutes = ['/login'];
  const isPublicRoute = publicRoutes.includes(currentPath);

  if (!client && !isPublicRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 max-w-md p-8">
          <h1 className="text-2xl font-bold text-foreground">Client Not Found</h1>
          <p className="text-muted-foreground">The academy you're looking for doesn't exist.</p>
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
