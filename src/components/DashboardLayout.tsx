import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Settings, LogOut } from "lucide-react";
import { useClient } from "@/lib/clientContext";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState<{ firstName: string } | null>(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/");
      return;
    }

    const data = localStorage.getItem("userData");
    if (data) {
      setUserData(JSON.parse(data));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/videos", label: "My Videos" },
    { path: "/analyzer", label: "Stock Analyzer" },
    { path: "/roadmap", label: "My Roadmap" },
    { path: "/progress", label: "Progress" },
  ];

  const isActive = (path: string) => location.pathname === path;

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation - Command Center */}
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
                    className="h-10 transition-all duration-300 group-hover:scale-105 drop-shadow-[0_0_8px_rgba(34,243,255,0.4)]"
                  />
                ) : (
                  <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105 drop-shadow-[0_0_12px_rgba(34,243,255,0.5)]">
                    {client?.company_name}
                  </span>
                )}
              </Link>

              {/* ADMIN MODE: Client Switcher */}
              {isAdminMode && (
                <div className="flex items-center gap-3 pl-6 border-l border-border-glass">
                  <span className="px-3 py-1 text-[10px] font-bold bg-purple text-background rounded-full uppercase tracking-wide shadow-[0_0_12px_rgba(139,92,246,0.4)]">
                    ADMIN MODE
                  </span>
                  <select
                    value={client?.subdomain}
                    onChange={(e) => switchClient(e.target.value)}
                    className="px-4 py-2 bg-card/60 backdrop-blur-sm border border-border-glass rounded-full text-sm font-medium text-foreground hover:border-primary/50 hover:shadow-[0_0_12px_rgba(34,243,255,0.2)] transition-all cursor-pointer"
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
                      ? "text-primary drop-shadow-[0_0_8px_rgba(34,243,255,0.6)]" 
                      : "text-text-secondary hover:text-foreground hover:scale-105"
                  }`}
                >
                  {item.label}
                  {isActive(item.path) && (
                    <span className="absolute -bottom-6 left-0 right-0 h-[2px] bg-gradient-to-r from-primary to-accent rounded-full shadow-[0_2px_12px_rgba(34,243,255,0.6)]" />
                  )}
                </Link>
              ))}
            </div>

            {/* User Profile */}
            <div className="hidden md:flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-3 hover:bg-card/50 hover:backdrop-blur-sm h-auto py-2 px-3 rounded-full border border-transparent hover:border-primary/30 hover:shadow-[0_0_16px_rgba(34,243,255,0.2)]">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent text-background flex items-center justify-center font-bold text-lg ring-2 ring-primary/40 shadow-[0_0_16px_rgba(34,243,255,0.4)]">
                      {userData.firstName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-[15px] font-semibold">{userData.firstName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-card/95 backdrop-blur-xl border-border-glass rounded-2xl p-2 shadow-[0_24px_80px_rgba(15,23,42,0.9)]">
                  <DropdownMenuItem onClick={() => console.log("Profile clicked")} className="rounded-xl h-12 cursor-pointer hover:bg-primary/10 hover:text-primary transition-all">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log("Settings clicked")} className="rounded-xl h-12 cursor-pointer hover:bg-primary/10 hover:text-primary transition-all">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="rounded-xl h-12 cursor-pointer text-error hover:bg-error/10 transition-all">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-foreground p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border-glass bg-card/95 backdrop-blur-xl animate-slide-down">
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                    isActive(item.path)
                      ? "bg-primary/10 text-primary border border-primary/30 shadow-[0_0_12px_rgba(34,243,255,0.2)]"
                      : "text-text-secondary hover:bg-card/50 hover:border-primary/20 border border-transparent"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-border-glass mt-4 space-y-2">
                <button
                  onClick={() => {
                    console.log("Profile clicked");
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full py-3 px-4 rounded-xl text-sm font-semibold text-left text-text-secondary hover:bg-card/50 hover:text-foreground transition-all"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    console.log("Settings clicked");
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full py-3 px-4 rounded-xl text-sm font-semibold text-left text-text-secondary hover:bg-card/50 hover:text-foreground transition-all"
                >
                  Settings
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full py-3 px-4 rounded-xl text-sm font-semibold text-left text-error hover:bg-error/10 transition-all"
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
