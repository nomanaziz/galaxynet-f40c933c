import { useEffect, useState } from "react";
import { Bell, AlertTriangle, Gift, Wrench, Calendar, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PageHeroDark from "@/components/PageHeroDark";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import breadcrumbImg from "@/assets/breadcrumb-notices.jpg";

const categoryConfig: Record<string, { label: string; labelBn: string; icon: typeof Bell; color: string }> = {
  maintenance: { label: "Maintenance", labelBn: "রক্ষণাবেক্ষণ", icon: Wrench, color: "bg-blue-100 text-blue-700" },
  offer: { label: "Offer", labelBn: "অফার", icon: Gift, color: "bg-green-100 text-green-700" },
  alert: { label: "Alert", labelBn: "সতর্কতা", icon: AlertTriangle, color: "bg-red-100 text-red-700" },
};

const Notices = () => {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    supabase.from("notices").select("*").eq("published", true).order("created_at", { ascending: false }).then(({ data }) => {
      setNotices(data ?? []);
      setLoading(false);
    });
  }, []);

  return (
    <>

      <PageHeroDark
        title="Notices & Updates"
        titleBn="নোটিশ ও আপডেট"
        subtitle="Stay informed about maintenance, offers, and service updates."
        subtitleBn="রক্ষণাবেক্ষণ, অফার ও সেবা আপডেট সম্পর্কে জানুন।"
        bgImage={breadcrumbImg}
      />

      <section className="py-12 md:py-16 bg-background flex-1">
        <div className="container mx-auto px-4 max-w-3xl">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-accent" /></>
          ) : notices.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">{t("No notices at this time.", "এই মুহূর্তে কোনো নোটিশ নেই।")}</p>
          ) : (
            <div className="space-y-6">
              {notices.map((n) => {
                const cat = categoryConfig[n.category] || categoryConfig.alert;
                return (
                  <Card key={n.id} className="border hover:border-accent/40 transition-all">
                    <CardContent className="p-6">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <Badge className={`${cat.color} border-0 flex items-center gap-1`}>
                          <cat.icon className="h-3 w-3" />
                          {t(cat.label, cat.labelBn)}
                        </Badge>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(n.created_at).toLocaleDateString()}
                        </span>
                      </>
                      <h3 className="text-lg font-bold text-foreground">{t(n.title, n.title_bn || n.title)}</h3>
                      {n.content && <p className="text-muted-foreground text-sm mt-2">{n.content}</p>}
                    </CardContent>
                  </Card>
                );
              })}
            </>
          )}
        </>
      </section>

    </>
  );
};

export default Notices;
