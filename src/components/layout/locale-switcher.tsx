"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "@/i18n/navigation";
import { localeShort, locales, type Locale } from "@/i18n/routing";

/**
 * Chuyển ngôn ngữ, giữ nguyên đường dẫn hiện tại.
 * Slug không dịch — cùng một URL cho cả ba ngôn ngữ, chỉ khác tiền tố locale.
 */
export function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const t = useTranslations("nav");
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  function onChange(next: string) {
    startTransition(() => {
      router.replace(
        // @ts-expect-error — pathname và params khớp nhau ở runtime
        { pathname, params },
        { locale: next as Locale },
      );
    });
  }

  return (
    <Select value={locale} onValueChange={onChange} disabled={isPending}>
      <SelectTrigger
        size="sm"
        aria-label={t("language")}
        className="w-[4.5rem] border-transparent bg-transparent font-mono text-xs"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {locales.map((l) => (
          <SelectItem key={l} value={l} className="font-mono text-xs">
            {localeShort[l]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
