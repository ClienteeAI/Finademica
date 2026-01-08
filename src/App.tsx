import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ClientProvider } from "@/lib/clientContext";
import { AuthProvider } from "@/lib/AuthContext";
import { AIMentor } from "@/components/AIMentor";
import { XPGainToastProvider } from "@/components/XPGainToast";
import Index from "./pages/Index";
import Login from "./pages/Login";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ConditionalAIMentor = () => {
  const location = useLocation();
  // Hide AI Mentor on the Stock Analyzer page (has its own chat)
  if (location.pathname === "/analyzer") return null;
  return <AIMentor />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ClientProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <XPGainToastProvider />
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
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
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
            <ConditionalAIMentor />
          </BrowserRouter>
        </AuthProvider>
      </ClientProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
