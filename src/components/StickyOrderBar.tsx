import { Link } from "react-router-dom";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const StickyOrderBar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border bg-background/95 backdrop-blur-sm px-4 py-2 flex items-center gap-2">
      <a href="tel:+8801700000000" className="flex-1">
        <Button variant="outline" className="w-full border-2 border-galaxy-blue text-galaxy-blue font-semibold text-sm">
          <Phone className="mr-1 h-4 w-4" /> Call Now
        </Button>
      </a>
      <Link to="/order" className="flex-1">
        <Button className="w-full bg-galaxy-orange hover:bg-galaxy-orange-dark text-white font-semibold text-sm animate-pulse-orange">
          Order Now · অর্ডার
        </Button>
      </Link>
    </div>
  );
};

export default StickyOrderBar;
