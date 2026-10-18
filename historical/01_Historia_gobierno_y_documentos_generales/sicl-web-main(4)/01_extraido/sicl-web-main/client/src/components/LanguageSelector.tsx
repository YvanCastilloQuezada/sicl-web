import { Languages } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";

export default function LanguageSelector() {
  const { language, setLanguage, languages } = useLanguage();
  const { t } = useTranslation();
  const current = languages.find((item) => item.code === language);

  return (
    <label className="flex items-center gap-2 rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-muted-foreground shadow-sm">
      <Languages className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="sr-only">{t("language.label")}</span>
      <select
        aria-label={t("language.label")}
        value={language}
        onChange={(event) => setLanguage(event.target.value as typeof language)}
        className="max-w-[7rem] cursor-pointer bg-transparent text-xs font-medium text-foreground outline-none"
      >
        {languages.map((item) => (
          <option key={item.code} value={item.code}>
            {item.nativeLabel}
          </option>
        ))}
      </select>
      <span className="sr-only">{t("language.label")}: {current?.label}</span>
    </label>
  );
}
