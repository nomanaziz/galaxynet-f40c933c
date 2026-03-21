import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";

type Language = "bn" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (en: string, bn: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem("galaxy-lang");
    return (saved === "en" || saved === "bn") ? saved : "bn";
  });

  useEffect(() => {
    localStorage.setItem("galaxy-lang", language);
  }, [language]);

  const setLanguage = useCallback((lang: Language) => setLang(lang), []);
  const t = useCallback((en: string, bn: string) => language === "en" ? en : bn, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
