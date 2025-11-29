import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/");
      return;
    }

    // Get user data
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, [navigate]);

  if (!userData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-purple/5">
      <div className="max-w-7xl mx-auto p-8">
        <div className="animate-fade-in">
          {/* Welcome header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Welcome back, {userData.firstName}! 👋
            </h1>
            <p className="text-xl text-muted-foreground">
              Your personalized trading dashboard is ready
            </p>
          </div>

          {/* Coming soon card */}
          <div className="bg-card/50 backdrop-blur-lg border border-border rounded-2xl p-12 text-center">
            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">🚀</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Dashboard Coming Soon!
            </h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              We're building something amazing for you. Your personalized video library, 
              roadmap, and AI stock analyzer will be available here soon.
            </p>
            
            {/* User info */}
            <div className="bg-background/50 rounded-lg p-6 max-w-md mx-auto text-left">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Your Account</h3>
              <div className="space-y-2 text-foreground">
                <p><span className="font-medium">Name:</span> {userData.firstName} {userData.lastName}</p>
                <p><span className="font-medium">Email:</span> {userData.email}</p>
                <p><span className="font-medium">Phone:</span> {userData.phone}</p>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={() => {
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("userData");
                navigate("/");
              }}
              className="mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors underline"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
