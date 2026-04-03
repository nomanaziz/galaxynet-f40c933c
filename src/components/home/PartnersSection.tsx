import { useLanguage } from "@/contexts/LanguageContext";

interface Partner {
  id: string;
  name: string;
  logo_url: string | null;
}

const PartnersSection = ({ partners }: { partners: Partner[] }) => {
  const { t } = useLanguage();

  if (partners.length === 0) return null;

  return (
    <section className="py-14 bg-[#f5f0e8]">
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-bold uppercase tracking-wider">
            🤝 {t("Memberships & Partners", "মেম্বারশিপস ও পার্টনারস")}
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-8 items-center">
          {partners.map((p) => (
            <div key={p.id} className="flex flex-col items-center gap-2 px-4 py-3 rounded-xl bg-white border border-border shadow-sm min-w-[120px] h-[60px] justify-center hover:shadow-md transition-shadow">
              {p.logo_url ? (
                <img src={p.logo_url} alt={p.name} className="max-h-[32px] max-w-[100px] object-contain" loading="lazy" />
              ) : (
                <span className="text-sm text-foreground font-semibold">{p.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
