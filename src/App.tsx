import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Packages from "./pages/Packages";
import Coverage from "./pages/Coverage";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Services from "./pages/Services";
import NewConnection from "./pages/NewConnection";
import SpeedTest from "./pages/SpeedTest";
import Notices from "./pages/Notices";
import Offers from "./pages/Offers";
import Payment from "./pages/Payment";
import Selfcare from "./pages/Selfcare";

import NotFound from "./pages/NotFound";

import ScrollToTop from "./components/ScrollToTop";
import SeoHead from "./components/SeoHead";
import ScrollToTopButton from "./components/ScrollToTopButton";
import Login from "./pages/Login";
import Register from "./pages/Register";
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
import OffersManager from "./pages/admin/OffersManager";
import TestimonialsManager from "./pages/admin/TestimonialsManager";
import PartnersManager from "./pages/admin/PartnersManager";
import FeaturesManager from "./pages/admin/FeaturesManager";
import DepartmentManager from "./pages/admin/DepartmentManager";
import DesignationManager from "./pages/admin/DesignationManager";
import EmployeeManager from "./pages/admin/EmployeeManager";
import ServicesManager from "./pages/admin/ServicesManager";
import FestivalManager from "./pages/admin/FestivalManager";
import AboutManager from "./pages/admin/AboutManager";
import FtpServerManager from "./pages/admin/FtpServerManager";
import FtpServers from "./pages/FtpServers";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <SeoHead />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/services" element={<Services />} />
              <Route path="/coverage" element={<Coverage />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/new-connection" element={<NewConnection />} />
              <Route path="/order" element={<Navigate to="/new-connection" replace />} />
              <Route path="/speed-test" element={<SpeedTest />} />
              <Route path="/notices" element={<Notices />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/pay-bill" element={<Payment />} />
              <Route path="/selfcare" element={<Selfcare />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            {/* Standalone Pages */}
            <Route path="/ftp" element={<FtpServers />} />
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
              <Route path="offers" element={<OffersManager />} />
              <Route path="testimonials" element={<TestimonialsManager />} />
              <Route path="partners" element={<PartnersManager />} />
              <Route path="features" element={<FeaturesManager />} />
              <Route path="departments" element={<DepartmentManager />} />
              <Route path="designations" element={<DesignationManager />} />
              <Route path="employees" element={<EmployeeManager />} />
              <Route path="services" element={<ServicesManager />} />
              <Route path="festivals" element={<FestivalManager />} />
              <Route path="about" element={<AboutManager />} />
              <Route path="ftp-servers" element={<FtpServerManager />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
          
          <ScrollToTopButton />
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
