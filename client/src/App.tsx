import { useEffect } from "react";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { queryClient } from "./lib/queryClient";
import { useThemeStore } from "@/store/theme";
import { useAuth } from "@/hooks/use-auth";

// Pages
import Home from "@/pages/home";
import Marketplace from "@/pages/marketplace";
import MyCards from "@/pages/my-cards";
import MyTrades from "@/pages/my-trades";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/my-cards" component={MyCards} />
      <Route path="/my-trades" component={MyTrades} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { isDark } = useThemeStore();
  const { checkAuth } = useAuth();

  useEffect(() => {
    // Initialize theme
    document.documentElement.classList.toggle('dark', isDark);
    
    // Check authentication on app load
    checkAuth();
  }, [isDark, checkAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
