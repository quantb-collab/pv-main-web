import type { Metadata } from "next";
import { Be_Vietnam_Pro, Geist_Mono } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AssessmentDrawerProvider } from "@/components/pv/assessment-drawer";
import { routing } from "@/i18n/routing";
import "../globals.css";

/**
 * FONT TẠM — chờ brand chốt.
 *
 * Yêu cầu ban đầu là Poppins. Poppins KHÔNG có bộ ký tự tiếng Việt: Google
 * Fonts chỉ cấp subset "latin" và "latin-ext", trong khi phần lớn chữ Việt có
 * dấu nằm ở dải U+1EA0–U+1EF1 (subset "vietnamese"). Dùng Poppins thì các chữ
 * như ế, ộ, ữ rơi sang font hệ thống — chữ trong cùng một dòng lệch nét.
 *
 * Be Vietnam Pro cùng họ geometric sans, hỗ trợ tiếng Việt đầy đủ.
 * Muốn đổi font: sửa DUY NHẤT khối này. Tên biến --font-brand giữ nguyên nên
 * globals.css và component không phải đụng tới.
 *
 * BA NẤC WEIGHT, không hơn. Font này không phải variable font — mỗi weight là
 * một file tải riêng, nên thêm một nấc là thêm một request cho mọi người dùng.
 *   600  tiêu đề mọi cấp, tiêu đề thẻ, wordmark
 *   500  eyebrow, nav, nhãn nút, nhãn meta, số thứ tự
 *   400  thân bài, câu dẫn, chú thích
 * 700 chỉ để trình duyệt dùng cho <strong> trong nội dung, không gọi tay.
 * 300 đã bỏ: không chỗ nào dùng, và chữ mảnh trên nền tối là chữ khó đọc.
 */
const brandFont = Be_Vietnam_Pro({
  variable: "--font-brand",
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });

  return {
    title: {
      default: `${t("name")} — ${t("tagline")}`,
      template: `%s — ${t("name")}`,
    },
    description: t("descriptionMeta"),
    robots: {
      // Site chưa phát hành. Mở index khi nội dung đã qua QA (§27 blueprint).
      index: false,
      follow: false,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const t = await getTranslations("site");

  /*
    `dark` cố định trên <html>: site chỉ có một chế độ là đêm (xem khối chủ đề
    ở đầu globals.css). Class này không bật/tắt gì của LỚP 2 — bảng màu ở đó đã
    là bảng đêm — nó có mặt để biến thể `dark:` của các component shadcn trong
    src/components/ui/ khớp với nền thật mà chúng đang nằm trên.
  */
  return (
    <html
      lang={locale}
      className={`dark ${brandFont.variable} ${mono.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Lưới an toàn. Motion xuất `opacity:0` ngay trong HTML server-side để
          tránh nháy khi hydrate. Nếu JS không chạy, phần lớn trang sẽ vô hình.
          Khối này ép mọi phần tử đang chờ animation hiện lại.
          Không xoá khi thêm hiệu ứng mới.
        */}
        <noscript>
          <style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider>
          {/*
            Provider bọc TOÀN BỘ site, không chỉ trang chủ: drawer khảo sát là
            một bản duy nhất dùng chung, và mọi nút CTA ở mọi trang đều mở nó.
            Đặt trong NextIntlClientProvider vì nó đọc `assessment.form.*`.
          */}
          <AssessmentDrawerProvider>
            <SmoothScroll />
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
            >
              {t("skipToContent")}
            </a>
            <SiteHeader />
            <main id="main" className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </AssessmentDrawerProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
