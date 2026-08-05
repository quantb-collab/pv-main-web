import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { defaultLocale, routing } from "./routing";

type Messages = Record<string, unknown>;

/**
 * Gộp sâu: khoá nào locale chưa dịch thì rơi về vi.
 * Nhờ vậy en/ko có thể để rỗng trong lúc build khung mà trang không vỡ,
 * và bước preflight chỉ cần điền dần, không phải điền một lần cho xong.
 */
function deepMerge(base: Messages, override: Messages): Messages {
  const out: Messages = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const prev = out[key];
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      prev &&
      typeof prev === "object" &&
      !Array.isArray(prev)
    ) {
      out[key] = deepMerge(prev as Messages, value as Messages);
    } else if (value !== undefined && value !== "") {
      out[key] = value;
    }
  }
  return out;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : defaultLocale;

  const source = (await import(`../../messages/${defaultLocale}.json`))
    .default as Messages;

  const messages =
    locale === defaultLocale
      ? source
      : deepMerge(
          source,
          (await import(`../../messages/${locale}.json`)).default as Messages,
        );

  return {
    locale,
    messages,
    timeZone: "Asia/Ho_Chi_Minh",
  };
});
