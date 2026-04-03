import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface FestivalTheme {
  id: string;
  name: string;
  name_bn: string | null;
  greeting_en: string | null;
  greeting_bn: string | null;
  start_date: string;
  end_date: string;
  hero_image_url: string | null;
  gradient_from: string | null;
  gradient_to: string | null;
  accent_color: string | null;
  decoration_type: string;
  animation_type: string;
  is_ramadan: boolean;
  sehri_time: string | null;
  iftar_time: string | null;
  enabled: boolean;
  banner_text_en: string | null;
  banner_text_bn: string | null;
}

export function useFestivalTheme() {
  const today = new Date().toISOString().split("T")[0];

  const { data: festival = null } = useQuery({
    queryKey: ["active_festival", today],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("festival_themes" as any)
        .select("*")
        .eq("enabled", true)
        .lte("start_date", today)
        .gte("end_date", today)
        .order("start_date", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as FestivalTheme | null;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Iftar countdown
  const [iftarCountdown, setIftarCountdown] = useState("");

  useEffect(() => {
    if (!festival?.is_ramadan || !festival?.iftar_time) return;

    const tick = () => {
      const now = new Date();
      const [timePart, ampm] = (festival.iftar_time || "").split(" ");
      const [h, m] = timePart.split(":").map(Number);
      let hours = h;
      if (ampm?.toUpperCase() === "PM" && hours !== 12) hours += 12;
      if (ampm?.toUpperCase() === "AM" && hours === 12) hours = 0;

      const target = new Date(now);
      target.setHours(hours, m, 0, 0);
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setIftarCountdown("");
        return;
      }
      const hrs = Math.floor(diff / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setIftarCountdown(
        `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
      );
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [festival?.is_ramadan, festival?.iftar_time]);

  return { festival, iftarCountdown };
}
