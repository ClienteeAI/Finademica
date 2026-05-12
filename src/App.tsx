import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { ClientProvider } from "@/lib/clientContext";
import { AuthProvider } from "@/lib/AuthContext";
import { XPGainToastProvider } from "@/components/XPGainToast";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";
import MyVideos from "./pages/MyVideos";
import VideoPlayer from "./pages/VideoPlayer";
import StockAnalyzer from "./pages/StockAnalyzer";
import MyRoadmap from "./pages/MyRoadmap";
import Progress from "./pages/Progress";
import Calculator from "./pages/Calculator";
import TradingDiary from "./pages/TradingDiary";
import Quiz from "./pages/Quiz";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Feed from "./pages/Feed";
import Arena from "./pages/Arena";
import ArenaResults from "./pages/ArenaResults";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import TermsOfUse from "./pages/legal/TermsOfUse";
import RiskDisclosure from "./pages/legal/RiskDisclosure";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      storageKey="user-theme"
      disableTransitionOnChange
    >
      <TooltipProvider>
        <ClientProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <XPGainToastProvider />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/landing" element={<Index />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/home" element={<Feed />} />
                <Route path="/feed" element={<Feed />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/videos" element={<MyVideos />} />
                <Route path="/video/:id" element={<VideoPlayer />} />
                <Route path="/analyzer" element={<StockAnalyzer />} />
                <Route path="/roadmap" element={<MyRoadmap />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/calculator" element={<Calculator />} />
                <Route path="/diary" element={<TradingDiary />} />
                <Route path="/trading-diary" element={<TradingDiary />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/arena" element={<Arena />} />
                <Route path="/arena/results" element={<ArenaResults />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/legal/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/legal/terms-of-use" element={<TermsOfUse />} />
                <Route path="/legal/risk-disclosure" element={<RiskDisclosure />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </ClientProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
