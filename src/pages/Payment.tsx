import { useEffect, useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const Payment = () => {
  const [methods, setMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    supabase.from("payment_methods").select("*").eq("visible", true).order("sort_order").then(({ data }) => {
      setMethods(data ?? []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar /><Navbar />

      <section className="page-hero">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">{t("Payment Methods", "পেমেন্ট পদ্ধতি")}</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            {t("Choose your preferred payment method.", "আপনার পছন্দের পেমেন্ট পদ্ধতি বেছে নিন।")}
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-background flex-1">
        <div className="container mx-auto px-4 max-w-3xl">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
          ) : methods.length === 0 ? (
            <div className="text-center py-16">
              <CreditCard className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{t("No payment methods available.", "কোনো পেমেন্ট পদ্ধতি নেই।")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {methods.map((m) => (
                <Card key={m.id} className="border hover:border-accent/40 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      {m.logo_url ? (
                        <img src={m.logo_url} alt={m.name} className="h-12 w-12 object-contain rounded" />
                      ) : (
                        <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                          <CreditCard className="h-6 w-6 text-accent" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-foreground">{m.name}</h3>
                        {m.account_number && <p className="text-sm text-accent font-mono">{m.account_number}</p>}
                      </div>
                    </div>
                    {m.instructions && <p className="text-muted-foreground text-sm">{m.instructions}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Payment;
