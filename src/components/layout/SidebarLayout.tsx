import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Video,
  HelpCircle,
  Calculator,
  LineChart,
  BookOpen,
  Users,
  User,
  Loader2,
  Wrench,
  ChevronDown,
} from 'lucide-react';
import { useClient } from '@/lib/clientContext';
import { useAuth } from '@/lib/AuthContext';
import XPNavIndicator from '@/components/XPNavIndicator';
import TradingDisclaimer from '@/components/TradingDisclaimer';
import { ProfileSheet } from '@/components/layout/ProfileSheet';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

const mainNavItems = [
  { path: '/feed', label: 'Home', icon: Users },
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/videos', label: 'My Videos', icon: Video },
  { path: '/quiz', label: 'Quiz', icon: HelpCircle },
];

// Tools are grouped in collapsible

const toolsItems = [
  { path: '/analyzer', label: 'Stock Analyzer', icon: LineChart },
  { path: '/calculator', label: 'Calculator', icon: Calculator },
  { path: '/diary', label: 'Trading Diary', icon: BookOpen },
];

function SidebarNavContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { client, allClients, isAdminMode, switchClient } = useClient();
  const [toolsOpen, setToolsOpen] = useState(true);
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const isNasrTheme = client?.subdomain === 'nasr';
  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <SidebarHeader className="p-4 pb-3">
        <Link to="/feed" className="flex items-center gap-3 group">
          {client?.logo_url && !isNasrTheme ? (
            <img
              src={client.logo_url}
              alt={client.company_name}
              className="h-8 transition-all duration-300 group-hover:scale-105"
            />
          ) : (
            <span
              className={cn(
                'text-lg font-medium tracking-tight transition-all duration-300',
                'font-playfair text-[#e2e8f0] group-hover:text-[#38bdf8]'
              )}
            >
              {collapsed ? (isNasrTheme ? 'N' : client?.company_name?.[0] || 'L') : (isNasrTheme ? 'NASR Lector' : client?.company_name)}
            </span>
          )}
        </Link>

        {/* Admin Mode Client Switcher - hidden on mobile */}
        {isAdminMode && !collapsed && (
          <div className="mt-3 pt-3 border-t border-[rgba(148,163,184,0.08)] hidden md:block">
            <span className="px-2 py-1 text-[10px] font-bold rounded-full uppercase tracking-wide bg-[#38bdf8]/20 text-[#38bdf8]">
              ADMIN
            </span>
            <select
              value={client?.subdomain}
              onChange={(e) => switchClient(e.target.value)}
              className="mt-2 w-full px-3 py-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(148,163,184,0.12)] rounded-lg text-sm font-medium cursor-pointer transition-all hover:border-[#38bdf8]/40 text-[#cbd5e1]"
            >
              {allClients.map((c) => (
                <option key={c.id} value={c.subdomain} className="bg-[#0f172a]">
                  {c.company_name}
                </option>
              ))}
            </select>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#64748b] text-xs font-medium uppercase tracking-wider mb-1">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.path)}
                    tooltip={item.label}
                    className={cn(
                      'rounded-[10px] px-3 py-2.5 transition-all duration-200 ease-in-out',
                      isActive(item.path)
                        ? 'bg-[rgba(56,189,248,0.12)] text-[#38bdf8] shadow-[inset_3px_0_0_#38bdf8]'
                        : 'text-[#cbd5e1] hover:bg-[rgba(148,163,184,0.08)]',
                      '[&>svg]:transition-colors [&>svg]:duration-200',
                      isActive(item.path)
                        ? '[&>svg]:text-[#38bdf8]'
                        : '[&>svg]:text-[#64748b] hover:[&>svg]:text-[#94a3b8]'
                    )}
                  >
                    <Link to={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Section Divider */}
        <div className="mx-2 my-3 border-t border-[rgba(148,163,184,0.08)]" />

        {/* Tools */}
        <SidebarGroup>
          <Collapsible open={toolsOpen} onOpenChange={setToolsOpen}>
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="cursor-pointer rounded-[10px] px-3 py-2 transition-all duration-200 hover:bg-[rgba(148,163,184,0.08)] text-[#64748b]">
                <div className="flex items-center gap-2 w-full">
                  <Wrench className="h-4 w-4" />
                  {!collapsed && <span className="text-xs font-medium uppercase tracking-wider">Tools</span>}
                  {!collapsed && (
                    <ChevronDown
                      className={cn(
                        'ml-auto h-4 w-4 transition-transform duration-200',
                        toolsOpen && 'rotate-180'
                      )}
                    />
                  )}
                </div>
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1 mt-1">
                  {toolsItems.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(item.path)}
                        tooltip={item.label}
                        className={cn(
                          'rounded-[10px] px-3 py-2.5 transition-all duration-200 ease-in-out',
                          isActive(item.path)
                            ? 'bg-[rgba(56,189,248,0.12)] text-[#38bdf8] shadow-[inset_3px_0_0_#38bdf8]'
                            : 'text-[#cbd5e1] hover:bg-[rgba(148,163,184,0.08)]',
                          '[&>svg]:transition-colors [&>svg]:duration-200',
                          isActive(item.path)
                            ? '[&>svg]:text-[#38bdf8]'
                            : '[&>svg]:text-[#64748b] hover:[&>svg]:text-[#94a3b8]'
                        )}
                      >
                        <Link to={item.path}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>
    </>
  );
}
function TopHeader() {
  const { client } = useClient();
  const { user, profile, loading } = useAuth();
  const [profileSheetOpen, setProfileSheetOpen] = useState(false);

  const firstName =
    profile?.first_name ||
    user?.user_metadata?.first_name ||
    user?.email?.split('@')[0] ||
    'User';

  return (
    <>
      <header
        className="sticky top-0 z-40 flex items-center justify-between gap-3 px-4 md:px-6 bg-transparent"
        style={{
          // Safe area + header height
          paddingTop: 'max(env(safe-area-inset-top, 0px), 8px)',
          minHeight: 'calc(48px + env(safe-area-inset-top, 0px))',
        }}
      >
        {/* Left: Sidebar trigger for mobile */}
        <div className="flex items-center gap-2 md:gap-3">
          <SidebarTrigger className="md:hidden text-[#cbd5e1] hover:text-[#38bdf8] hover:bg-[rgba(56,189,248,0.12)] h-9 w-9" />
          <XPNavIndicator isNasrTheme={true} />
        </div>

        {/* Right: Profile button - more compact on mobile */}
        <Button
          variant="ghost"
          className="flex items-center gap-1.5 md:gap-2 h-auto py-1 md:py-1.5 px-2 md:px-3 rounded-full bg-[#1e293b]/80 backdrop-blur-sm border border-[#334155]/50 shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-200 hover:bg-[#334155]/80 hover:border-[#475569]/50"
          onClick={() => setProfileSheetOpen(true)}
        >
          <div
            className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-semibold text-xs md:text-sm transition-all bg-gradient-to-br from-[#0ea5e9] to-[#0284c7] text-white ring-2 ring-[#0ea5e9]/30"
          >
            {firstName.charAt(0).toUpperCase()}
          </div>
          <span className="hidden sm:inline text-sm font-medium text-[#e2e8f0]">
            {firstName}
          </span>
          <User className="h-4 w-4 text-[#94a3b8] hidden sm:block" />
        </Button>
      </header>

      <ProfileSheet open={profileSheetOpen} onOpenChange={setProfileSheetOpen} />
    </>
  );
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const { user, loading } = useAuth();
  const { client } = useClient();
  const navigate = useNavigate();

  const isNasrTheme = client?.subdomain === 'nasr';

  // Redirect to login if not authenticated (after loading completes)
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

  // Show loading state while auth is being checked OR while redirecting
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-[#0C0E13]">
        {/* Desktop Sidebar - hidden on mobile */}
        <Sidebar
          collapsible="icon"
          variant="floating"
          className="hidden md:flex rounded-[18px] shadow-[0_10px_50px_rgba(0,0,0,0.5)] border border-[#3a4150]/30"
          style={{
            background: '#2A303A',
          }}
        >
          <SidebarNavContent />
        </Sidebar>

        <SidebarInset className="flex flex-col bg-[#0C0E13]">
          <TopHeader />

          {/* Main content with mobile bottom padding */}
          <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 mobile-content-padding">
            <div className="max-w-[1440px] mx-auto">{children}</div>
          </main>

          <TradingDisclaimer isNasrTheme={true} />
        </SidebarInset>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>
    </SidebarProvider>
  );
}
