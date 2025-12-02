import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Client {
  id: string;
  company_name: string;
  subdomain: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  company_tagline?: string;
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
    // Check if user is admin
    const userEmail = localStorage.getItem('email');
    const isAdmin = userEmail === 'petr@clientee.co';
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
      // Regular user - detect client from subdomain/query param
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
      
      // Default to 'naga' for testing / preview environments
      subdomain = subdomain || 'naga';

      const { data } = await supabase
        .from('clients')
        .select('*')
        .eq('subdomain', subdomain)
        .single();

      if (data) {
        setClient(data);
        applyClientTheme(data);
        localStorage.setItem('client_id', data.id);
      } else {
        console.error('Client not found:', subdomain);
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