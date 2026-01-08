import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

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

export function ClientProvider({ children }: ClientProviderProps) {
  const [client, setClient] = useState<Client | null>(null);
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [loading, setLoading] = useState(true);

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
        setClient(domainMatchedClient);
        applyClientTheme(domainMatchedClient);
        localStorage.setItem('client_id', domainMatchedClient.id);
        setLoading(false);
        return;
      }

      // PRIORITY 2: Check if client override in localStorage (for Lovable/admin domain)
      const savedClient = localStorage.getItem('admin_selected_client');
      if (savedClient) {
        const selectedClient = data?.find(c => c.subdomain === savedClient);
        if (selectedClient) {
          setClient(selectedClient);
          applyClientTheme(selectedClient);
          localStorage.setItem('client_id', selectedClient.id);
          setLoading(false);
          return;
        }
      }

      // PRIORITY 3: Default to first client
      const firstClient = data?.[0];
      if (firstClient) {
        setClient(firstClient);
        applyClientTheme(firstClient);
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
          setClient(data);
          applyClientTheme(data);
          localStorage.setItem('client_id', data.id);
          setLoading(false);
          return;
        }
      }

      // PRIORITY 2: Custom domain lookup FIRST (for white-label domains like trade.nasrlector.com)
      // Use trimmed and lowercased hostname for robust matching
      const trimmedHostname = hostname.trim().toLowerCase();
      const { data: customDomainClient } = await supabase
        .from('clients')
        .select('*')
        .eq('custom_domain', trimmedHostname)
        .eq('active', true)
        .maybeSingle();
      
      if (customDomainClient) {
        setClient(customDomainClient);
        applyClientTheme(customDomainClient);
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
            setClient(data);
            applyClientTheme(data);
            localStorage.setItem('client_id', data.id);
            setLoading(false);
            return;
          }
        }
      }

      // Fallback to 'nallio' for testing / preview environments
      const { data: fallbackClient } = await supabase
        .from('clients')
        .select('*')
        .eq('subdomain', 'nallio')
        .eq('active', true)
        .single();

      if (fallbackClient) {
        setClient(fallbackClient);
        applyClientTheme(fallbackClient);
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
      setClient(newClient);
      applyClientTheme(newClient);
      localStorage.setItem('admin_selected_client', subdomain);
      localStorage.setItem('client_id', newClient.id);
      
      // Reload page to apply changes everywhere
      window.location.reload();
    }
  }

  function hexToHSL(hex: string): string {
    // Remove # if present
    hex = hex.replace(/^#/, '');
    
    // Parse hex to RGB
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
    
    // Return as "H S% L%" format for CSS variables
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  }

  function applyClientTheme(client: Client) {
    const root = document.documentElement;
    
    // Apply raw hex values for legacy usage
    root.style.setProperty('--client-primary', client.primary_color);
    root.style.setProperty('--client-secondary', client.secondary_color);
    
    // Convert and apply HSL values to semantic design tokens
    if (client.primary_color) {
      const primaryHSL = hexToHSL(client.primary_color);
      root.style.setProperty('--primary', primaryHSL);
      root.style.setProperty('--ring', primaryHSL);
      root.style.setProperty('--success', primaryHSL);
      root.style.setProperty('--success-from', primaryHSL);
      root.style.setProperty('--premium-from', primaryHSL);
      root.style.setProperty('--border-hover', primaryHSL);
    }
    
    if (client.secondary_color) {
      const secondaryHSL = hexToHSL(client.secondary_color);
      root.style.setProperty('--accent', secondaryHSL);
      root.style.setProperty('--success-to', secondaryHSL);
      root.style.setProperty('--premium-to', secondaryHSL);
    }
    
    // Apply theme class for Nasr Trade (dark gold theme)
    if (client.subdomain === 'nasr') {
      root.classList.add('theme-nasr');
      document.body.classList.add('theme-nasr');
    } else {
      root.classList.remove('theme-nasr');
      document.body.classList.remove('theme-nasr');
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
