import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Settings, LogOut, Loader2 } from "lucide-react";
import { useClient } from "@/lib/clientContext";
import { useAuth } from "@/lib/AuthContext";
import XPWidget from "@/components/XPWidget";
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

  const navItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/videos", label: "My Videos" },
    { path: "/analyzer", label: "Stock Analyzer" },
    { path: "/calculator", label: "Calculator" },
    { path: "/diary", label: "Trading Diary" },
    { path: "/roadmap", label: "My Roadmap" },
    { path: "/progress", label: "Progress" },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Get user's first name from profile or user metadata
  const firstName = profile?.first_name || user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'User';

  // Theme-aware colors
  const colors = isNasrTheme ? {
    primary: "#D4AF37",
    primaryLight: "#F2C94C",
    text: "#F5F5F5",
    textMuted: "#C9C9C9",
    textDark: "#F5F5F5",
    border: "rgba(212, 175, 55, 0.15)",
    borderHover: "rgba(212, 175, 55, 0.3)",
    bgHover: "rgba(212, 175, 55, 0.1)",
    activeClass: "text-gold",
    inactiveClass: "text-nasr-text-muted hover:text-nasr-text",
    avatarBg: "from-gold to-gold-dark",
    avatarRing: "ring-gold/30",
    avatarShadow: "shadow-gold",
  } : {
    primary: "#4DE2E8",
    primaryLight: "#A7E9FF",
    text: "#1D3557",
    textMuted: "#6B7280",
    textDark: "#1D3557",
    border: "rgba(212, 224, 236, 0.6)",
    borderHover: "rgba(77, 226, 232, 0.3)",
    bgHover: "rgba(77, 226, 232, 0.1)",
    activeClass: "text-aqua",
    inactiveClass: "text-ocean-muted hover:text-ocean",
    avatarBg: "from-aqua to-aqua-deep",
    avatarRing: "ring-aqua/30",
    avatarShadow: "shadow-aqua",
  };

  return (
    <div className={`min-h-screen ${isNasrTheme ? 'bg-nasr-bg nasr-grid-bg gold-particles' : 'bg-background'}`}>
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 glass-nav animate-slide-down">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-18">
            {/* Logo */}
            <div className="flex items-center gap-6">
              <Link to="/dashboard" className="flex items-center gap-3 group">
                {client?.logo_url ? (
                  <img 
                    src={client.logo_url} 
                    alt={client.company_name} 
                    className="h-10 transition-all duration-300 group-hover:scale-105"
                  />
                ) : (
                  <span className={`text-xl font-bold tracking-tight transition-all duration-300 group-hover:scale-105 ${
                    isNasrTheme 
                      ? 'font-playfair bg-gradient-to-r from-gold-light to-gold bg-clip-text text-transparent' 
                      : 'bg-gradient-to-r from-aqua to-aqua-deep bg-clip-text text-transparent'
                  }`}>
                    {client?.company_name}
                  </span>
                )}
              </Link>

              {/* ADMIN MODE: Client Switcher */}
              {isAdminMode && (
                <div className={`flex items-center gap-3 pl-6 border-l ${isNasrTheme ? 'border-gold/20' : 'border-ice'}`}>
                  <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wide ${
                    isNasrTheme 
                      ? 'bg-gold/20 text-gold shadow-gold/30' 
                      : 'bg-lavender text-white shadow-[0_0_10px_rgba(181,167,255,0.3)]'
                  }`}>
                    ADMIN MODE
                  </span>
                  <select
                    value={client?.subdomain}
                    onChange={(e) => switchClient(e.target.value)}
                    className={`px-4 py-2 backdrop-blur-sm border rounded-full text-sm font-medium cursor-pointer transition-all ${
                      isNasrTheme
                        ? 'bg-nasr-panel/70 border-gold/20 text-nasr-text hover:border-gold/40 hover:shadow-gold/20'
                        : 'bg-white/70 border-ice text-ocean hover:border-aqua/50 hover:shadow-aqua/20'
                    }`}
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

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-10">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative text-[15px] font-semibold tracking-tight transition-all duration-250 ${
                    isActive(item.path) 
                      ? isNasrTheme ? 'text-gold' : 'text-aqua'
                      : isNasrTheme ? 'text-nasr-text-muted hover:text-nasr-text hover:scale-105' : 'text-ocean-muted hover:text-ocean hover:scale-105'
                  }`}
                >
                  {item.label}
                  {isActive(item.path) && (
                    <span className={`absolute -bottom-6 left-0 right-0 h-[2px] rounded-full ${
                      isNasrTheme 
                        ? 'bg-gradient-to-r from-gold to-gold-light shadow-[0_2px_8px_rgba(212,175,55,0.5)]'
                        : 'bg-gradient-to-r from-aqua to-aqua-light shadow-[0_2px_8px_rgba(77,226,232,0.5)]'
                    }`} />
                  )}
                </Link>
              ))}
            </div>

            {/* XP Widget + User Profile */}
            <div className="hidden md:flex items-center gap-4">
              {/* Compact XP Widget */}
              <XPWidget className="!p-3 !rounded-xl" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className={`flex items-center gap-3 h-auto py-2 px-3 rounded-full border border-transparent transition-all ${
                      isNasrTheme 
                        ? 'hover:bg-gold/10 hover:border-gold/30 hover:shadow-gold/15'
                        : 'hover:bg-white/50 hover:backdrop-blur-sm hover:border-aqua/30 hover:shadow-aqua/15'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${
                      isNasrTheme 
                        ? 'from-gold-light to-gold text-nasr-bg ring-2 ring-gold/30 shadow-gold'
                        : 'from-aqua to-aqua-deep text-white ring-2 ring-aqua/30 shadow-aqua'
                    } flex items-center justify-center font-bold text-lg`}>
                      {firstName.charAt(0).toUpperCase()}
                    </div>
                    <span className={`text-[15px] font-semibold ${isNasrTheme ? 'text-nasr-text' : 'text-ocean'}`}>
                      {firstName}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className={`w-48 backdrop-blur-xl rounded-2xl p-2 ${
                    isNasrTheme 
                      ? 'bg-nasr-panel/95 border-gold/20 shadow-nasr-card'
                      : 'bg-white/95 border-ice shadow-ice-lg'
                  }`}
                >
                  <DropdownMenuItem 
                    onClick={() => navigate("/profile")} 
                    className={`rounded-xl h-12 cursor-pointer transition-all ${
                      isNasrTheme 
                        ? 'text-nasr-text-muted hover:bg-gold/10 hover:text-nasr-text'
                        : 'text-ocean-soft hover:bg-aqua/10 hover:text-ocean'
                    }`}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => navigate("/settings")} 
                    className={`rounded-xl h-12 cursor-pointer transition-all ${
                      isNasrTheme 
                        ? 'text-nasr-text-muted hover:bg-gold/10 hover:text-nasr-text'
                        : 'text-ocean-soft hover:bg-aqua/10 hover:text-ocean'
                    }`}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    className="rounded-xl h-12 cursor-pointer text-destructive hover:bg-destructive/10 transition-all"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu Button */}
            <button
              className={`md:hidden p-2 ${isNasrTheme ? 'text-nasr-text' : 'text-ocean'}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden border-t backdrop-blur-xl animate-slide-down ${
            isNasrTheme 
              ? 'border-gold/15 bg-nasr-panel/95'
              : 'border-ice bg-white/95'
          }`}>
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-3 px-4 rounded-xl text-sm font-semibold transition-all border ${
                    isActive(item.path)
                      ? isNasrTheme 
                        ? 'bg-gold/10 text-gold border-gold/30 shadow-gold/15'
                        : 'bg-aqua/10 text-aqua border-aqua/30 shadow-aqua/15'
                      : isNasrTheme
                        ? 'text-nasr-text-muted hover:bg-gold/5 border-transparent hover:border-gold/20'
                        : 'text-ocean-muted hover:bg-white/50 border-transparent hover:border-aqua/20'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className={`pt-4 border-t mt-4 space-y-2 ${isNasrTheme ? 'border-gold/15' : 'border-ice'}`}>
                <button
                  onClick={() => {
                    navigate("/profile");
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full py-3 px-4 rounded-xl text-sm font-semibold text-left transition-all ${
                    isNasrTheme 
                      ? 'text-nasr-text-muted hover:bg-gold/5 hover:text-nasr-text'
                      : 'text-ocean-muted hover:bg-white/50 hover:text-ocean'
                  }`}
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    navigate("/settings");
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full py-3 px-4 rounded-xl text-sm font-semibold text-left transition-all ${
                    isNasrTheme 
                      ? 'text-nasr-text-muted hover:bg-gold/5 hover:text-nasr-text'
                      : 'text-ocean-muted hover:bg-white/50 hover:text-ocean'
                  }`}
                >
                  Settings
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full py-3 px-4 rounded-xl text-sm font-semibold text-left text-destructive hover:bg-destructive/10 transition-all"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 max-w-[1440px]">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;