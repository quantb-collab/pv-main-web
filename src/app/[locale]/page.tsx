import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/hero";
import {
  Contrast,
  Enterprise,
  FullStack,
  Identity,
  Stats,
} from "@/components/home/sections";
import { CtaBand } from "@/components/pv/cta-band";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.meta" });
  return { title: t("title"), description: t("description") };
}

/**
 * Trang chủ — HƯỚNG B: một lập luận khép kín, không phải mục lục của website
 * (chủ dự án duyệt 2026-08-06). Mỗi khối trả lời đúng một câu hỏi mà khối
 * trước vừa làm nảy ra; khối nào bỏ đi mà mạch không hụt câu hỏi nào là khối
 * thừa. Thứ tự là thứ tự thuyết phục, không sắp xếp lại tuỳ ý:
 *   là ai → tôi đang ở nấc nào → lên nấc 3 đáng bao nhiêu → các anh làm thế
 *   nào → có được phép chạy trong doanh nghiệp tôi không → quy mô tăng có đi
 *   tiếp được không → bước đầu tiên là gì
 *
 * ĐÃ CẮT khỏi trang, component và khoá messages GIỮ NGUYÊN (chưa dọn — chờ
 * chủ dự án nhìn bản thật):
 *   Why   — 4 card lần lượt là bản rút gọn của StartHere, Stats, Enterprise
 *           và FullStack; không có ý nào của riêng nó.
 *   Proof — 4 ô chờ rỗng ngay trước CTA; công ty mới trưng 4 khung "sắp có"
 *           thì tệ hơn không có gì. 4 gap vẫn đếm trong /track.
 *
 * ĐÃ XOÁ HẲN (bản cũ nằm trong git):
 *   Maturity  — rail 5 nấc trùng vai với rail 8 bước của Deliver. Phần giá trị
 *               riêng của nó (ghi chú phân vai người/máy) đã chuyển sang chân
 *               khối Deliver, nên không còn gì để giữ.
 *   StartHere — chủ dự án bỏ 2026-08-07. Tiêu đề của nó gần trùng từng chữ với
 *               `finalCta.title`, và PillRow 6 use case là lần liệt kê THỨ BA
 *               của cùng bộ việc mà Contrast đã đặt tên và Stats đã gắn số.
 *               Danh mục use case thuộc `/use-cases`.
 *
 * CÒN NỢ: Stats đang là SỐ MINH HOẠ, chủ dự án chưa quyết giữ hay rút.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home.finalCta");

  return (
    <>
      <Hero />
      <Identity />
      <Contrast />
      <Stats />
      <Enterprise />
      <FullStack />
      <CtaBand
        cta="assessment"
        items={[1, 2, 3, 4].map((n) => t(`g${n}`))}
      />
    </>
  );
}
