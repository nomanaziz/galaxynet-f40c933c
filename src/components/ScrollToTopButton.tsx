import { useEffect, useState } from "react";

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-20 right-4 md:bottom-8 md:right-6 z-50 h-12 w-12 rounded-full bg-galaxy-blue hover:bg-galaxy-orange flex items-center justify-center shadow-lg transition-all hover:scale-110"
      aria-label="Scroll to top"
    >
      <img src="/images/rocket.svg" alt="Back to top" className="h-7 w-7" />
    </button>
  );
};

export default ScrollToTopButton;
