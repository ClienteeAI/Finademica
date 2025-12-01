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
      <nav className="sticky top-0 z-50 glass-nav border-b border-border animate-slide-down">
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
                  <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-success to-info bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105">
                    {client?.company_name}
                  </span>
                )}
              </Link>

              {/* ADMIN MODE: Client Switcher */}
              {isAdminMode && (
                <div className="flex items-center gap-3 pl-6 border-l border-border">
                  <span className="px-3 py-1 text-[10px] font-bold bg-purple-600 text-white rounded-full uppercase tracking-wide">
                    ADMIN MODE
                  </span>
                  <select
                    value={client?.subdomain}
                    onChange={(e) => switchClient(e.target.value)}
                    className="px-4 py-2 bg-secondary border border-border rounded-lg text-sm font-medium text-foreground hover:border-border-hover transition-colors cursor-pointer"
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
                  className={`relative text-[15px] font-medium transition-all duration-300 ${
                    isActive(item.path) ? "text-success" : "text-text-secondary hover:text-white hover:scale-105"
                  }`}
                >
                  {item.label}
                  {isActive(item.path) && (
                    <span className="absolute -bottom-6 left-0 right-0 h-[3px] success-gradient rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* User Profile */}
            <div className="hidden md:flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-3 hover:bg-secondary h-auto py-2 px-3 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-success text-white flex items-center justify-center font-bold text-lg ring-2 ring-success/30">
                      {userData.firstName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-[15px] font-medium">{userData.firstName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-card border-border rounded-xl p-2 shadow-2xl">
                  <DropdownMenuItem onClick={() => console.log("Profile clicked")} className="rounded-lg h-12 cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log("Settings clicked")} className="rounded-lg h-12 cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="rounded-lg h-12 cursor-pointer text-error">
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
          <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-xl">
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-3 px-4 rounded-xl text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? "bg-success/10 text-success"
                      : "text-text-secondary hover:bg-secondary"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-border mt-4 space-y-2">
                <button
                  onClick={() => {
                    console.log("Profile clicked");
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full py-3 px-4 rounded-xl text-sm font-medium text-left text-text-secondary hover:bg-secondary"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    console.log("Settings clicked");
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full py-3 px-4 rounded-xl text-sm font-medium text-left text-text-secondary hover:bg-secondary"
                >
                  Settings
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full py-3 px-4 rounded-xl text-sm font-medium text-left text-error hover:bg-secondary"
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
