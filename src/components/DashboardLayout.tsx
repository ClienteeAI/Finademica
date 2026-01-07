import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Settings, LogOut, Loader2, ChevronDown } from "lucide-react";
import { useClient } from "@/lib/clientContext";
import { useAuth } from "@/lib/AuthContext";
import XPNavIndicator from "@/components/XPNavIndicator";
import TradingDisclaimer from "@/components/TradingDisclaimer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { client, allClients, isAdminMode, switchClient } = useClient();
  const { user, profile, loading, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  // Detect if Nasr theme
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
    navigate("/login");
    return null;
  }

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  // Main navigation items (without tools)
  const mainNavItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/videos", label: "My Videos" },
    { path: "/quiz", label: "Quiz" },
  ];

  // Tools dropdown items
  const toolsItems = [
    { path: "/analyzer", label: "Stock Analyzer" },
    { path: "/calculator", label: "Calculator" },
    { path: "/diary", label: "Trading Diary" },
  ];

  // Secondary navigation
  const secondaryNavItems = [
    { path: "/roadmap", label: "Roadmap" },
    { path: "/progress", label: "Progress" },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isToolsActive = toolsItems.some(item => isActive(item.path));

  // Get user's first name from profile or user metadata
  const firstName = profile?.first_name || user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'User';

  // NavLink component with premium styling and animated underline
  const NavLink = ({ 
    path, 
    label, 
    isActive: active 
  }: { 
    path: string; 
    label: string; 
    isActive: boolean;
  }) => (
    <Link
      to={path}
      className={`
        relative py-2 text-[15px] font-medium tracking-wide transition-all duration-300
        ${active 
          ? 'text-gold' 
          : 'text-[#A0A0A0] hover:text-[#E0E0E0]'
        }
      `}
    >
      {label}
      {/* Animated gold underline */}
      <span 
        className={`
          absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-gold to-gold-light
          transition-all duration-300 ease-out
          ${active 
            ? 'w-full opacity-100 shadow-[0_0_8px_rgba(212,175,55,0.6)]' 
            : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
          }
        `}
      />
    </Link>
  );

  return (
    <div className={`min-h-screen ${isNasrTheme ? 'bg-[#0B0B0D]' : 'bg-background'}`}>
      {/* Premium Navigation Bar */}
      <nav className={`
        fixed top-0 left-0 right-0 z-50
        ${isNasrTheme 
          ? 'bg-[#0B0B0D]/95 backdrop-blur-xl border-b border-[#1A1A1A]' 
          : 'glass-nav'
        }
      `}>
        {/* Subtle gold gradient line at bottom for Nasr */}
        {isNasrTheme && (
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        )}
        
        <div className="container mx-auto px-8">
          <div className="flex items-center justify-between h-[72px]">
            
            {/* Left: Logo */}
            <div className="flex items-center gap-8">
              <Link to="/dashboard" className="flex items-center gap-3 group">
                {client?.logo_url && !isNasrTheme ? (
                  <img 
                    src={client.logo_url} 
                    alt={client.company_name} 
                    className="h-10 transition-all duration-300 group-hover:scale-105"
                  />
                ) : (
                  <span className={`
                    text-[22px] font-medium tracking-tight transition-all duration-300
                    ${isNasrTheme 
                      ? 'font-playfair text-[#E8E8E8] group-hover:text-gold' 
                      : 'font-playfair bg-gradient-to-r from-aqua to-aqua-deep bg-clip-text text-transparent'
                    }
                  `}>
                    {isNasrTheme ? 'NASR Academy' : client?.company_name}
                  </span>
                )}
              </Link>

              {/* ADMIN MODE: Client Switcher */}
              {isAdminMode && (
                <div className="flex items-center gap-3 pl-6 border-l border-gold/20">
                  <span className="px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wide bg-gold/20 text-gold">
                    ADMIN
                  </span>
                  <select
                    value={client?.subdomain}
                    onChange={(e) => switchClient(e.target.value)}
                    className="px-4 py-2 bg-[#1A1A1A] border border-gold/20 rounded-lg text-sm font-medium text-[#E0E0E0] cursor-pointer transition-all hover:border-gold/40"
                  >
                    {allClients.map(c => (
                      <option key={c.id} value={c.subdomain}>
                        {c.company_name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Center: Primary Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {/* Main nav items */}
              {mainNavItems.map((item) => (
                <div key={item.path} className="group">
                  <NavLink 
                    path={item.path} 
                    label={item.label} 
                    isActive={isActive(item.path)} 
                  />
                </div>
              ))}

              {/* Tools Dropdown */}
              <DropdownMenu open={toolsOpen} onOpenChange={setToolsOpen}>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`
                      flex items-center gap-1.5 py-2 text-[15px] font-medium tracking-wide 
                      transition-all duration-300 outline-none relative
                      ${isToolsActive 
                        ? 'text-gold' 
                        : 'text-[#A0A0A0] hover:text-[#E0E0E0]'
                      }
                    `}
                  >
                    Tools
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${toolsOpen ? 'rotate-180' : ''}`} />
                    {/* Underline for active state */}
                    <span 
                      className={`
                        absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-gold to-gold-light
                        transition-all duration-300 ease-out
                        ${isToolsActive 
                          ? 'w-full opacity-100 shadow-[0_0_8px_rgba(212,175,55,0.6)]' 
                          : 'w-0 opacity-0'
                        }
                      `}
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="center" 
                  sideOffset={12}
                  className="w-48 bg-[#0F0F0F] border border-[#2A2A2A] rounded-xl p-2 shadow-2xl animate-slide-down"
                >
                  {toolsItems.map((item) => (
                    <DropdownMenuItem 
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={`
                        rounded-lg h-11 cursor-pointer transition-all text-[14px] font-medium
                        ${isActive(item.path)
                          ? 'bg-gold/10 text-gold'
                          : 'text-[#A0A0A0] hover:bg-[#1A1A1A] hover:text-[#E0E0E0]'
                        }
                      `}
                    >
                      {item.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Secondary nav items */}
              {secondaryNavItems.map((item) => (
                <div key={item.path} className="group">
                  <NavLink 
                    path={item.path} 
                    label={item.label} 
                    isActive={isActive(item.path)} 
                  />
                </div>
              ))}
            </div>

            {/* Right: User Status */}
            <div className="hidden lg:flex items-center gap-5">
              {/* XP/Level Indicator */}
              <XPNavIndicator isNasrTheme={isNasrTheme} />
              
              {/* Separator */}
              <div className="h-8 w-px bg-[#2A2A2A]" />
              
              {/* User Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-3 h-auto py-2 px-3 rounded-full border border-transparent transition-all hover:bg-gold/5 hover:border-gold/20"
                  >
                    {/* Avatar with gold ring */}
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center 
                      font-semibold text-lg transition-all
                      ${isNasrTheme 
                        ? 'bg-gradient-to-br from-gold to-gold-dark text-[#0B0B0D] ring-2 ring-gold/30' 
                        : 'bg-gradient-to-br from-aqua to-aqua-deep text-white ring-2 ring-aqua/30'
                      }
                    `}>
                      {firstName.charAt(0).toUpperCase()}
                    </div>
                    <span className={`text-[15px] font-medium ${isNasrTheme ? 'text-[#E0E0E0]' : 'text-ocean'}`}>
                      {firstName}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  sideOffset={12}
                  className="w-48 bg-[#0F0F0F] border border-[#2A2A2A] rounded-xl p-2 shadow-2xl animate-slide-down"
                >
                  <DropdownMenuItem 
                    onClick={() => navigate("/profile")} 
                    className="rounded-lg h-11 cursor-pointer transition-all text-[#A0A0A0] hover:bg-[#1A1A1A] hover:text-[#E0E0E0]"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => navigate("/settings")} 
                    className="rounded-lg h-11 cursor-pointer transition-all text-[#A0A0A0] hover:bg-[#1A1A1A] hover:text-[#E0E0E0]"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    className="rounded-lg h-11 cursor-pointer text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu Button */}
            <button
              className={`lg:hidden p-2 ${isNasrTheme ? 'text-[#E0E0E0]' : 'text-ocean'}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`
            lg:hidden border-t animate-slide-down
            ${isNasrTheme 
              ? 'border-[#1A1A1A] bg-[#0B0B0D]/98 backdrop-blur-xl'
              : 'border-ice bg-white/95 backdrop-blur-xl'
            }
          `}>
            <div className="container mx-auto px-4 py-4 space-y-2">
              {/* All nav items for mobile */}
              {[...mainNavItems, ...toolsItems, ...secondaryNavItems].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    block py-3 px-4 rounded-xl text-sm font-medium transition-all border
                    ${isActive(item.path)
                      ? 'bg-gold/10 text-gold border-gold/30'
                      : 'text-[#A0A0A0] hover:bg-[#1A1A1A] border-transparent hover:border-[#2A2A2A]'
                    }
                  `}
                >
                  {item.label}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-[#1A1A1A] mt-4 space-y-2">
                <button
                  onClick={() => {
                    navigate("/profile");
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full py-3 px-4 rounded-xl text-sm font-medium text-left text-[#A0A0A0] hover:bg-[#1A1A1A] transition-all"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    navigate("/settings");
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full py-3 px-4 rounded-xl text-sm font-medium text-left text-[#A0A0A0] hover:bg-[#1A1A1A] transition-all"
                >
                  Settings
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full py-3 px-4 rounded-xl text-sm font-medium text-left text-red-400 hover:bg-red-500/10 transition-all"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-12 pt-28 max-w-[1440px]">
        {children}
      </main>

      {/* Trading Disclaimer Footer */}
      <TradingDisclaimer isNasrTheme={isNasrTheme} />
    </div>
  );
};

export default DashboardLayout;
