import { useState } from 'react';
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
  Menu,
  User,
  Loader2,
  Wrench,
  ChevronDown,
  Map,
} from 'lucide-react';
import { useClient } from '@/lib/clientContext';
import { useAuth } from '@/lib/AuthContext';
import XPNavIndicator from '@/components/XPNavIndicator';
import TradingDisclaimer from '@/components/TradingDisclaimer';
import { ProfileSheet } from '@/components/layout/ProfileSheet';
import { RoadmapDialog } from '@/components/RoadmapDialog';
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

const toolsItems = [
  { path: '/analyzer', label: 'Stock Analyzer', icon: LineChart },
  { path: '/calculator', label: 'Calculator', icon: Calculator },
  { path: '/diary', label: 'Trading Diary', icon: BookOpen },
];

interface SidebarNavContentProps {
  onOpenRoadmap: () => void;
}

function SidebarNavContent({ onOpenRoadmap }: SidebarNavContentProps) {
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
      <SidebarHeader className="border-b border-sidebar-border p-4">
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
                isNasrTheme
                  ? 'font-playfair text-[#E8E8E8] group-hover:text-primary'
                  : 'font-playfair text-primary'
              )}
            >
              {collapsed ? (isNasrTheme ? 'N' : client?.company_name?.[0] || 'L') : (isNasrTheme ? 'NASR Academy' : client?.company_name)}
            </span>
          )}
        </Link>

        {/* Admin Mode Client Switcher */}
        {isAdminMode && !collapsed && (
          <div className="mt-3 pt-3 border-t border-sidebar-border">
            <span className="px-2 py-1 text-[10px] font-bold rounded-full uppercase tracking-wide bg-primary/20 text-primary">
              ADMIN
            </span>
            <select
              value={client?.subdomain}
              onChange={(e) => switchClient(e.target.value)}
              className="mt-2 w-full px-3 py-2 bg-sidebar-accent border border-sidebar-border rounded-lg text-sm font-medium cursor-pointer transition-all hover:border-primary/40"
            >
              {allClients.map((c) => (
                <option key={c.id} value={c.subdomain}>
                  {c.company_name}
                </option>
              ))}
            </select>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.path)}
                    tooltip={item.label}
                  >
                    <Link to={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {/* Roadmap Button */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={onOpenRoadmap}
                  tooltip="Roadmap"
                >
                  <Map className="h-4 w-4" />
                  <span>Roadmap</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Tools */}
        <SidebarGroup>
          <Collapsible open={toolsOpen} onOpenChange={setToolsOpen}>
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="cursor-pointer hover:bg-sidebar-accent rounded-md transition-colors">
                <div className="flex items-center gap-2 w-full">
                  <Wrench className="h-4 w-4" />
                  {!collapsed && <span>Tools</span>}
                  {!collapsed && (
                    <ChevronDown
                      className={cn(
                        'ml-auto h-4 w-4 transition-transform',
                        toolsOpen && 'rotate-180'
                      )}
                    />
                  )}
                </div>
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {toolsItems.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(item.path)}
                        tooltip={item.label}
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

  const isNasrTheme = client?.subdomain === 'nasr';
  const firstName =
    profile?.first_name ||
    user?.user_metadata?.first_name ||
    user?.email?.split('@')[0] ||
    'User';

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b px-4 md:px-6',
          isNasrTheme
            ? 'bg-[#0B0B0D]/95 backdrop-blur-xl border-[#1A1A1A]'
            : 'bg-background/95 backdrop-blur-xl border-border'
        )}
      >
        {/* Left: Sidebar trigger for mobile */}
        <div className="flex items-center gap-3">
          <SidebarTrigger className="md:hidden" />
          <XPNavIndicator isNasrTheme={isNasrTheme} />
        </div>

        {/* Right: Profile button */}
        <Button
          variant="ghost"
          className="flex items-center gap-3 h-auto py-2 px-3 rounded-full border border-transparent transition-all hover:bg-primary/5 hover:border-primary/20"
          onClick={() => setProfileSheetOpen(true)}
        >
          <div
            className={cn(
              'w-9 h-9 rounded-full flex items-center justify-center font-semibold text-base transition-all',
              isNasrTheme
                ? 'bg-gradient-to-br from-primary to-primary/80 text-[#0B0B0D] ring-2 ring-primary/30'
                : 'bg-gradient-to-br from-primary to-primary/80 text-white ring-2 ring-primary/30'
            )}
          >
            {firstName.charAt(0).toUpperCase()}
          </div>
          <span
            className={cn(
              'hidden sm:inline text-sm font-medium',
              isNasrTheme ? 'text-[#E0E0E0]' : 'text-foreground'
            )}
          >
            {firstName}
          </span>
          <User className="h-4 w-4 text-muted-foreground" />
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
  const [roadmapOpen, setRoadmapOpen] = useState(false);

  const isNasrTheme = client?.subdomain === 'nasr';

  // Show loading state while auth is being checked
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className={cn('min-h-screen flex w-full', isNasrTheme && 'bg-[#0B0B0D]')}>
        <Sidebar
          collapsible="icon"
          className={cn(
            isNasrTheme
              ? 'bg-[#0B0B0D] border-r border-[#1A1A1A]'
              : 'bg-sidebar border-r border-sidebar-border'
          )}
        >
          <SidebarNavContent onOpenRoadmap={() => setRoadmapOpen(true)} />
        </Sidebar>

        <SidebarInset className="flex flex-col">
          <TopHeader />

          <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
            <div className="max-w-[1440px] mx-auto">{children}</div>
          </main>

          <TradingDisclaimer isNasrTheme={isNasrTheme} />
        </SidebarInset>
      </div>

      <RoadmapDialog open={roadmapOpen} onOpenChange={setRoadmapOpen} />
    </SidebarProvider>
  );
}
