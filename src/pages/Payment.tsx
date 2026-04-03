import { useEffect, useState } from "react";
import { CreditCard, Loader2, ArrowRight, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import PageHeroDark from "@/components/PageHeroDark";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import breadcrumbImg from "@/assets/breadcrumb-payment.jpg";

const Payment = () => {
  const [methods, setMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const { t, language } = useLanguage();

  useEffect(() => {
    supabase.from("payment_methods").select("*").eq("visible", true).order("sort_order").then(({ data }) => {
      setMethods(data ?? []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar /><Navbar />

      <PageHeroDark
        title="Payment Methods"
        titleBn="পেমেন্ট পদ্ধতি"
        subtitle="Choose your preferred payment method."
        subtitleBn="আপনার পছন্দের পেমেন্ট পদ্ধতি বেছে নিন।"
        bgImage={breadcrumbImg}
      />

      <section className="py-12 md:py-16 bg-background flex-1">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
          ) : methods.length === 0 ? (
            <div className="text-center py-16">
              <CreditCard className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{t("No payment methods available.", "কোনো পেমেন্ট পদ্ধতি নেই।")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {methods.map((m) => (
                <Card key={m.id} className="overflow-hidden border hover:shadow-lg transition-all group">
                  <div
                    className="h-40 flex items-center justify-center p-6"
                    style={{ backgroundColor: m.bg_color || 'hsl(var(--accent))' }}
                  >
                    {m.logo_url ? (
                      <img src={m.logo_url} alt={m.name} className="max-h-20 max-w-full object-contain" />
                    ) : (
                      <CreditCard className="h-16 w-16 text-white" />
                    )}
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-lg text-foreground mb-1">
                      {language === "bn" && m.name_bn ? m.name_bn : m.name}
                    </h3>
                    {m.account_number && (
                      <p className="text-sm font-mono text-accent mb-2">{m.account_number}</p>
                    )}
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {language === "bn" && m.instructions_bn ? m.instructions_bn : m.instructions}
                    </p>
                    <Button
                      className="w-full"
                      style={{ backgroundColor: m.bg_color || undefined }}
                      onClick={() => {
                        if (m.button_url) {
                          window.open(m.button_url, "_blank");
                        } else {
                          setSelectedMethod(m);
                        }
                      }}
                    >
                      {language === "bn" && m.button_text_bn
                        ? m.button_text_bn
                        : m.button_text || t("Learn More", "বিস্তারিত জানুন")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Detail Modal */}
      <Dialog open={!!selectedMethod} onOpenChange={() => setSelectedMethod(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedMethod?.logo_url && (
                <img src={selectedMethod.logo_url} alt="" className="h-8 w-8 object-contain" />
              )}
              {language === "bn" && selectedMethod?.name_bn ? selectedMethod.name_bn : selectedMethod?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedMethod?.account_number && (
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">{t("Account Number", "অ্যাকাউন্ট নম্বর")}</p>
                <p className="text-lg font-mono font-bold text-foreground">{selectedMethod.account_number}</p>
              </div>
            )}
            {selectedMethod?.screenshot_url && (
              <img src={selectedMethod.screenshot_url} alt="Payment instructions" className="w-full rounded-lg border" />
            )}
            <p className="text-muted-foreground text-sm">
              {language === "bn" && selectedMethod?.instructions_bn ? selectedMethod.instructions_bn : selectedMethod?.instructions}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Payment;
