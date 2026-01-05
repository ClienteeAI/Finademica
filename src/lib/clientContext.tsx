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
    initializeClient();
  }, []);

  async function initializeClient() {
    // Check if user is Super Admin via secure Supabase RPC
    let isAdmin = false;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data, error } = await supabase.rpc('is_super_admin', {
          p_auth_user_id: session.user.id
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

      // Check if client override in localStorage
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

      // Default to first client
      const firstClient = data?.[0];
      if (firstClient) {
        setClient(firstClient);
        applyClientTheme(firstClient);
        localStorage.setItem('client_id', firstClient.id);
      }
    } else {
      // Regular user - detect client from query param > subdomain > custom_domain > fallback
      const urlParams = new URLSearchParams(window.location.search);
      const clientParam = urlParams.get('client');
      
      let subdomain = clientParam;
      
      // If no query param, try to extract from subdomain for real production domains
      if (!subdomain) {
        const hostname = window.location.hostname;
        const isLocalhostOrIp = hostname.includes('localhost') || hostname.match(/^\d+\.\d+\.\d+\.\d+$/);
        const isLovablePreview = hostname.includes('lovable.app') || hostname.includes('lovableproject.com');

        // Only treat the first part of the hostname as a client subdomain on real custom domains
        if (!isLocalhostOrIp && !isLovablePreview) {
          const parts = hostname.split('.');
          if (parts.length > 2) {
            subdomain = parts[0]; // Get first part as subdomain
          }
        }
      }
      
      // If we have a subdomain, try to find client by subdomain
      if (subdomain) {
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

      // Try custom_domain lookup (for white-label domains like app.client.com)
      const hostname = window.location.hostname;
      const { data: customDomainClient } = await supabase
        .from('clients')
        .select('*')
        .eq('custom_domain', hostname)
        .eq('active', true)
        .maybeSingle();
      
      if (customDomainClient) {
        setClient(customDomainClient);
        applyClientTheme(customDomainClient);
        localStorage.setItem('client_id', customDomainClient.id);
        setLoading(false);
        return;
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

  function applyClientTheme(client: Client) {
    // Apply CSS variables for dynamic theming
    document.documentElement.style.setProperty('--client-primary', client.primary_color);
    document.documentElement.style.setProperty('--client-secondary', client.secondary_color);
    
    // Apply theme class for Nasr Trade (dark gold theme)
    if (client.subdomain === 'nasr') {
      document.documentElement.classList.add('theme-nasr');
      document.body.classList.add('theme-nasr');
    } else {
      document.documentElement.classList.remove('theme-nasr');
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
