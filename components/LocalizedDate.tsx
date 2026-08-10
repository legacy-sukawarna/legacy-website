"use client";

import { useLanguage } from "@/providers/language-provider";

type LocalizedDateProps = {
  value: string;
  month?: "short" | "long";
};

export const LocalizedDate = ({ value, month = "short" }: LocalizedDateProps) => {
  const { language } = useLanguage();
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return (
    <time dateTime={value}>
      {date.toLocaleDateString(language === "id" ? "id-ID" : "en-US", {
        year: "numeric",
        month,
        day: "numeric",
      })}
    </time>
  );
};
