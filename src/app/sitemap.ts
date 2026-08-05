import type { MetadataRoute } from "next";
import { ALL_PAGES } from "@/content/registry";
import { defaultLocale, locales } from "@/i18n/routing";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.invalid";

/**
 * Sitemap sinh từ registry. Trang trạng thái "spec" hoặc "stub" chưa có nội
 * dung thật nên không đưa vào — tránh để công cụ tìm kiếm lập chỉ mục ô chờ.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return ALL_PAGES.filter(
    (p) => p.status === "content" || p.status === "ready",
  ).map((page) => {
    const path = page.path === "/" ? "" : page.path;
    return {
      url: `${BASE}${path}`,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [
            l,
            `${BASE}${l === defaultLocale ? "" : `/${l}`}${path}`,
          ]),
        ),
      },
    };
  });
}
