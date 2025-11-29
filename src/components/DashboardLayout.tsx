import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Settings, LogOut } from "lucide-react";
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
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2">
              <span className="text-xl font-bold text-foreground">AI Trading Pro Academy</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative text-sm font-medium transition-colors hover:text-primary ${
                    isActive(item.path) ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                  {isActive(item.path) && (
                    <span className="absolute -bottom-[1.45rem] left-0 right-0 h-0.5 bg-primary" />
                  )}
                </Link>
              ))}
            </div>

            {/* User Dropdown */}
            <div className="hidden md:flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                      {userData.firstName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">{userData.firstName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => console.log("Profile clicked")}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log("Settings clicked")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card">
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-border mt-4">
                <button
                  onClick={() => {
                    console.log("Profile clicked");
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full py-2 px-4 rounded-lg text-sm font-medium text-left text-muted-foreground hover:bg-muted"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    console.log("Settings clicked");
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full py-2 px-4 rounded-lg text-sm font-medium text-left text-muted-foreground hover:bg-muted"
                >
                  Settings
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full py-2 px-4 rounded-lg text-sm font-medium text-left text-muted-foreground hover:bg-muted"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
