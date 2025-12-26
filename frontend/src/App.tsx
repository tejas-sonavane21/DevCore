import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ContactModalProvider } from "@/contexts/ContactModalContext";
import ContactModal from "@/components/ContactModal";
import Index from "./pages/Index";
import ProjectIdeas from "./pages/ProjectIdeas";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTemplates from "./pages/admin/AdminTemplates";
import AdminPortfolio from "./pages/admin/AdminPortfolio";
import AdminTeam from "./pages/admin/AdminTeam";
import AdminContacts from "./pages/admin/AdminContacts";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ContactModalProvider>
        <Toaster />
        <Sonner />
        <ContactModal />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/project-ideas" element={<ProjectIdeas />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="templates" element={<AdminTemplates />} />
              <Route path="portfolio" element={<AdminPortfolio />} />
              <Route path="team" element={<AdminTeam />} />
              <Route path="contacts" element={<AdminContacts />} />
            </Route>

            {/* Catch-all Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ContactModalProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
