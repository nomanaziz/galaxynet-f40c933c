import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const FloatingWhatsApp = () => {
  const [number, setNumber] = useState("8801646078000");

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "whatsapp_number")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.value) setNumber(data.value);
      });
  }, []);

  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 left-4 md:bottom-6 md:left-6 z-50 h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white flex items-center justify-center shadow-lg transition-all hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <svg viewBox="0 0 32 32" className="h-8 w-8 fill-white">
        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.96A15.89 15.89 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.335 22.594c-.39 1.1-1.932 2.014-3.164 2.28-.844.18-1.946.324-5.66-1.216-4.752-1.97-7.81-6.79-8.046-7.104-.228-.314-1.864-2.482-1.864-4.734 0-2.252 1.18-3.36 1.6-3.82.42-.46.916-.574 1.22-.574.304 0 .608.002.874.016.28.014.656-.106.026 1.544-.63 1.65-1.086 2.846-1.086 2.846-.228.39-.468.338-.228.052.24-.286 1.164-1.364 1.698-1.93.534-.566 1.068-.468 1.432-.28.364.188 2.34 1.1 2.74 1.3.4.2.666.3.764.468.098.168.098.968-.292 1.902z" />
      </svg>
    </a>
  );
};

export default FloatingWhatsApp;
