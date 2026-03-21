import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Packages from "./pages/Packages";
import Coverage from "./pages/Coverage";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Services from "./pages/Services";
import Order from "./pages/Order";
import SpeedTest from "./pages/SpeedTest";
import Notices from "./pages/Notices";
import NotFound from "./pages/NotFound";
import FloatingWhatsApp from "./components/FloatingWhatsApp";

// Admin
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import PackageManager from "./pages/admin/PackageManager";
import CoverageManager from "./pages/admin/CoverageManager";
import OrderManager from "./pages/admin/OrderManager";
import PageManager from "./pages/admin/PageManager";
import NoticeManager from "./pages/admin/NoticeManager";
import SettingsPage from "./pages/admin/SettingsPage";
import UserManager from "./pages/admin/UserManager";
import MenuManager from "./pages/admin/MenuManager";
import PaymentManager from "./pages/admin/PaymentManager";
import HomepageEditor from "./pages/admin/HomepageEditor";
import MediaManager from "./pages/admin/MediaManager";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/services" element={<Services />} />
            <Route path="/coverage" element={<Coverage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/order" element={<Order />} />
            <Route path="/speed-test" element={<SpeedTest />} />
            <Route path="/notices" element={<Notices />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="packages" element={<PackageManager />} />
              <Route path="coverage" element={<CoverageManager />} />
              <Route path="orders" element={<OrderManager />} />
              <Route path="pages" element={<PageManager />} />
              <Route path="notices" element={<NoticeManager />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="users" element={<UserManager />} />
              <Route path="menu" element={<MenuManager />} />
              <Route path="payments" element={<PaymentManager />} />
              <Route path="homepage" element={<HomepageEditor />} />
              <Route path="media" element={<MediaManager />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
          <FloatingWhatsApp />
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
