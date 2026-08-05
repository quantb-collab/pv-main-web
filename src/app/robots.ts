import type { MetadataRoute } from "next";

/**
 * Site chưa phát hành → chặn toàn bộ.
 * Khi nội dung đã qua QA (§27 blueprint), đổi thành allow và bỏ `index: false`
 * trong generateMetadata của layout gốc. Hai chỗ này phải đổi cùng lúc.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
  };
}
