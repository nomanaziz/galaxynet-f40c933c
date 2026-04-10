import { Outlet } from "react-router-dom";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import FloatingCTA from "@/components/FloatingCTA";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import ScrollToTopButton from "@/components/ScrollToTopButton";

const Layout = () => (
  <div className="min-h-screen flex flex-col">
    <TopBar />
    <Navbar />
    <Outlet />
    <Footer />
    <BottomNav />
    <FloatingCTA />
    <FloatingWhatsApp />
    <ScrollToTopButton />
  </div>
);

export default Layout;
