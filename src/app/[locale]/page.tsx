import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/hero";
import {
  Contrast,
  Hardware,
  Identity,
  Software,
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
 *   là ai → tôi đang ở nấc nào → lên nấc 3 đáng bao nhiêu → các anh đi được
 *   sâu tới đâu → vậy tôi bắt đầu từ việc nào → bước đầu tiên là gì
 *
 * PHẦN CỨNG ĐỨNG TRƯỚC PHẦN MỀM (chủ dự án 2026-08-07). Thứ tự này có chủ ý và
 * đọc ra được: chip chứng minh chiều sâu, rồi phần mềm mới là chỗ người đọc
 * đặt chân vào — nên khối ngay trước CTA là bốn việc bắt đầu được, không phải
 * bốn con chip. Cảnh báo blueprint về vị trí này ghi ở đầu `Hardware`.
 *
 * Nấc trời: void → night → night → deep → deep → rise → dawn. Hai section cùng
 * nấc đứng liền nhau là hợp lệ (ranh giới là vạch chân trời + quầng sáng do
 * `<Section>` tự vẽ, không phải màu nền) — xem docs/DESIGN-TOKENS.md.
 *
 * ĐÃ CHUYỂN SANG TRANG RIÊNG (chủ dự án 2026-08-07 — trang chủ chỉ giữ phần
 * cô đọng và móc khách; cả hai section đều đã tự kết bằng nút "xem chi tiết"
 * dẫn sang đúng trang đó, tức chúng vốn là bản tóm tắt của trang khác):
 *   Enterprise → /how-we-deliver/governance, thành khối "phạm vi kiểm soát"
 *                (10 nhãn) đặt trên 4 card đi sâu sẵn có. Trang chủ đền lại
 *                bằng MỘT dòng ở `Identity.r3Text`, vì blueprint bắt
 *                Enterprise là mặc định chứ không phải một menu riêng.
 *   FullStack  → /about, KHÔNG phải /technology: /technology đã có LayerStack
 *                8 tầng (bản 5 tầng ở đây là tập con) và trang đó tự khai là
 *                dành cho CTO/CIO/CISO, trong khi 4 lợi ích kia — trách nhiệm
 *                một đầu mối, bớt phụ thuộc nhiều nhà cung cấp — là lập luận
 *                cho CEO và mua hàng. Chúng chứng minh đúng h1 của /about
 *                ("Một đối tác đủ sâu để đi đường dài"), vốn đang nói suông.
 *
 * Nấc trời chỉnh lại sau khi cắt: bỏ hai section `deep` và `rise` thì trang
 * nhảy thẳng `night` → `dawn`. Contrast lên `deep`, Stats lên `rise` để lấy
 * lại mẫu chuẩn void → night → deep → rise → dawn (docs/DESIGN-TOKENS.md).
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
      <Hardware />
      <Software />
      <CtaBand
        cta="assessment"
        items={[1, 2, 3, 4].map((n) => t(`g${n}`))}
      />
    </>
  );
}
