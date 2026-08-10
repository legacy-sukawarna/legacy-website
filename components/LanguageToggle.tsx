"use client";

import { useLanguage, type PublicLanguage } from "@/providers/language-provider";

const languages: Array<{ code: PublicLanguage; label: string; name: string }> = [
  { code: "en", label: "EN", name: "English" },
  { code: "id", label: "ID", name: "Bahasa Indonesia" },
];

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="legacy-language-toggle" aria-label="Choose language">
      {languages.map((option) => (
        <button
          key={option.code}
          type="button"
          className={language === option.code ? "is-active" : undefined}
          aria-label={option.name}
          aria-pressed={language === option.code}
          onClick={() => setLanguage(option.code)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
