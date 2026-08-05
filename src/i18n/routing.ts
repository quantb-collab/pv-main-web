import { defineRouting } from "next-intl/routing";

/**
 * vi = nguồn sự thật. en/ko chỉ được điền ở bước preflight, dịch TỪ vi.
 * Xem docs/I18N.md và skill `pv-i18n`.
 */
export const locales = ["vi", "en", "ko"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "vi";

export const localeLabels: Record<Locale, string> = {
  vi: "Tiếng Việt",
  en: "English",
  ko: "한국어",
};

/** Nhãn ngắn cho nút chuyển ngôn ngữ */
export const localeShort: Record<Locale, string> = {
  vi: "VI",
  en: "EN",
  ko: "KO",
};

export const routing = defineRouting({
  locales,
  defaultLocale,
  // vi ở gốc "/", en/ko có tiền tố "/en", "/ko"
  localePrefix: "as-needed",
  /**
   * Tắt tự động đoán ngôn ngữ theo Accept-Language.
   * Khách Việt Nam hay dùng trình duyệt cài tiếng Anh; nếu bật, họ vào "/"
   * sẽ bị đẩy sang /en. Mặc định luôn là tiếng Việt, người dùng tự đổi.
   */
  localeDetection: false,
});
