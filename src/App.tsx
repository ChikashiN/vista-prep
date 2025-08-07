import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Practice from "./pages/Practice";
import SectionalPractice from "./pages/SectionalPractice";
import FullTest from "./pages/FullTest";
import TestModeSelector from "./pages/TestModeSelector";
import Diagnostics from "./pages/Diagnostics";
import NotFound from "./pages/NotFound";
import ImportQuestions from "./pages/ImportQuestions";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/practice" element={<SectionalPractice />} />
          <Route path="/practice/:section" element={<Practice />} />
          <Route path="/test" element={<TestModeSelector />} />
          <Route path="/full-test" element={<FullTest />} />
          <Route path="/diagnostics" element={<Diagnostics />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="/import" element={<ImportQuestions />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
