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

const ClientContext = createContext<Client | null>(null);

interface ClientProviderProps {
  children: ReactNode;
}

export function ClientProvider({ children }: ClientProviderProps) {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    detectAndFetchClient();
  }, []);

  async function detectAndFetchClient() {
    // Detect subdomain
    // For local dev: Use query param ?client=naga
    // For production: Extract from subdomain (e.g., naga.yourdomain.com)
    
    const urlParams = new URLSearchParams(window.location.search);
    const clientParam = urlParams.get('client');
    
    let subdomain = clientParam;
    
    // If no query param, try to extract from subdomain
    if (!subdomain) {
      const hostname = window.location.hostname;
      // Check if it's not localhost or IP
      if (!hostname.includes('localhost') && !hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
        const parts = hostname.split('.');
        if (parts.length > 2) {
          subdomain = parts[0]; // Get first part as subdomain
        }
      }
    }
    
    // Default to 'naga' for testing
    subdomain = subdomain || 'naga';

    // Fetch client from Supabase
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('subdomain', subdomain)
      .single();

    if (data) {
      setClient(data);
      applyClientTheme(data);
      // Store client_id for easy access
      localStorage.setItem('client_id', data.id);
    } else {
      console.error('Client not found:', subdomain, error);
    }
    
    setLoading(false);
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

  if (!client) {
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
    <ClientContext.Provider value={client}>
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