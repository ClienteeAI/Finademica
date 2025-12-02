import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ClientProvider } from "@/lib/clientContext";
import { AIMentor } from "@/components/AIMentor";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MyVideos from "./pages/MyVideos";
import VideoPlayer from "./pages/VideoPlayer";
import StockAnalyzer from "./pages/StockAnalyzer";
import MyRoadmap from "./pages/MyRoadmap";
import Progress from "./pages/Progress";
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
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/videos" element={<MyVideos />} />
            <Route path="/video/:id" element={<VideoPlayer />} />
            <Route path="/analyzer" element={<StockAnalyzer />} />
            <Route path="/roadmap" element={<MyRoadmap />} />
            <Route path="/progress" element={<Progress />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ConditionalAIMentor />
        </BrowserRouter>
      </ClientProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
