"use client";

import type { ReactNode } from "react";

import { useLanguage } from "@/providers/language-provider";

type LocalizedTextProps = {
  en: ReactNode;
  id: ReactNode;
};

export const LocalizedText = ({ en, id }: LocalizedTextProps) => {
  const { language } = useLanguage();

  return <>{language === "id" ? id : en}</>;
};
