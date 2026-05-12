const { createClient } = require('@supabase/supabase-js');

const NEW_URL = 'https://esdeyoadcgyjppfeqaky.supabase.co';
const NEW_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzZGV5b2FkY2d5anBwZmVxYWt5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODMyMjAyMCwiZXhwIjoyMDkzODk4MDIwfQ.CXYZ6YgUgyB3ToRSpxsoPrGCFPSN7e_rh8vx4JfstZg';

const supabase = createClient(NEW_URL, NEW_KEY);

const FINADEMICA_CLIENT_ID = 'a6151fd9-1513-4ae0-b960-25454f3a9bf2';

async function applyBranding() {
    console.log('🎨 Applying Finademica Brand Book to Database...');

    const themeConfig = {
        dark: {
            background: "222 84% 5%", // Derived from #020617 (Deep Navy)
            foreground: "210 40% 98%",
            card: "222 47% 11%", // Derived from #0F172A (Rich Slate)
            "card-foreground": "210 40% 98%",
            popover: "222 47% 11%",
            "popover-foreground": "210 40% 98%",
            primary: "239 84% 67%", // #6366F1 (Electric Indigo)
            "primary-foreground": "210 40% 98%",
            secondary: "222 47% 14%",
            "secondary-foreground": "210 40% 98%",
            muted: "222 47% 14%",
            "muted-foreground": "215 20% 65%",
            accent: "235 89% 74%", // #818CF8 (Vibrant Indigo)
            "accent-foreground": "210 40% 98%",
            destructive: "0 62% 30%",
            "destructive-foreground": "210 40% 98%",
            border: "217 33% 17%",
            input: "217 33% 17%",
            ring: "239 84% 67%",
            "sidebar-background": "222 47% 11%",
            "sidebar-foreground": "240 5% 96%",
            "sidebar-primary": "239 84% 67%",
            "sidebar-primary-foreground": "0 0% 100%",
            "sidebar-accent": "240 4% 16%",
            "sidebar-accent-foreground": "240 5% 96%",
            "sidebar-border": "240 4% 16%",
            "sidebar-ring": "239 84% 67%",
            "text-primary": "0 0% 100%",
            "text-secondary": "215 20% 75%",
            "text-tertiary": "215 20% 55%",
            "gold": "235 89% 74%",
            "gold-light": "235 89% 80%",
            "gold-glow": "239 84% 67%"
        },
        light: {
            // Mapping light theme for safety, even though brand is primarily dark
            background: "0 0% 100%",
            foreground: "222 84% 5%",
            primary: "239 84% 67%"
        },
        fonts: {
            sans: "Helvetica Neue, Jost, sans-serif",
            serif: "Georgia, Bodoni Moda, serif",
            mono: "JetBrains Mono, monospace"
        },
        radius: "0.5rem"
    };

    const { error } = await supabase
        .from('clients')
        .update({
            company_name: 'Finademica',
            company_tagline: 'The Architecture of Mastery.',
            primary_color: '#6366F1',
            secondary_color: '#020617',
            theme_config: themeConfig,
            active: true
        })
        .eq('id', FINADEMICA_CLIENT_ID);

    if (error) {
        console.error('❌ Error updating branding:', error.message);
    } else {
        console.log('✅ Finademica Branding Applied to Database Successfully!');
    }
}

applyBranding();
