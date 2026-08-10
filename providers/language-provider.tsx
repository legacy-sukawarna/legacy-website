"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type PublicLanguage = "en" | "id";

type LanguageContextValue = {
  language: PublicLanguage;
  setLanguage: (language: PublicLanguage) => void;
};

const LANGUAGE_STORAGE_KEY = "legacy-public-language";

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<PublicLanguage>("en");
  const [preferenceLoaded, setPreferenceLoaded] = useState(false);

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (storedLanguage === "en" || storedLanguage === "id") {
      setLanguage(storedLanguage);
    }
    setPreferenceLoaded(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "id" ? "id" : "en";
    document.documentElement.dataset.language = language;
    if (preferenceLoaded) {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
  }, [language, preferenceLoaded]);

  const value = useMemo(() => ({ language, setLanguage }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
};
