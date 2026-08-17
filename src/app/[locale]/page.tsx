import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/hero";
import {
  Contrast,
  Hardware,
  Identity,
  Jobs,
  Principles,
  Software,
  Stats,
  Training,
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
 *   là ai → tôi đang ở nấc nào → đưa AI vào thì có mất kiểm soát không → cụ
 *   thể máy làm phần nào → lên nấc 3 đáng bao nhiêu → các anh đi được sâu tới
 *   đâu → vậy tôi bắt đầu từ việc nào → mua về rồi ai dùng → bước đầu tiên là
 *   gì
 *
 * ── KHUNG "BỐN VIỆC", 2026-08-14 ───────────────────────────────────────────
 * Trang cũ trả lời câu "Pebble Vina là ai và có công nghệ gì". Người đọc đang
 * hỏi "việc đang tắc của tôi có giải được không". Cả lượt viết lại này là đảo
 * lại hai câu đó, và trục để đảo là BỐN VIỆC mà doanh nghiệp nào cũng làm:
 * tra cứu · chứng từ · báo cáo · phê duyệt.
 *
 * Bốn việc ấy vốn đã có sẵn trên trang — chúng là bốn hàng của `Contrast` và
 * bốn ô của `Stats`. Cái thiếu là chúng chưa làm xương sống: hero nói một
 * đằng, sản phẩm nói một nẻo. Nay bốn việc xuất hiện ở hero (nêu tên), ở ba
 * nấc (ở nấc 01 trông thế nào), ở `Jobs` (máy làm phần nào) và ở `Stats` (đo
 * bằng đơn vị gì) — cùng một bộ chữ, bốn góc nhìn.
 *
 * ⚠️ MỘT BỘ CHỮ, MỘT NGUỒN: tag bốn việc chỉ khai ở `home.contrast.r{n}Tag`.
 * `Stats` và `Jobs` đều lấy thẳng từ đó. Thêm hoặc đổi việc thì sửa một chỗ.
 *
 * HAI SECTION MỚI, cùng lượt:
 *   Principles — ba nguyên tắc, chặn câu "đưa AI vào thì có mất kiểm soát
 *                không" ngay khi nó vừa nảy ra. Nguyên tắc 01 nâng lên từ vế
 *                thứ hai của `who.r3Text`, nơi nó đang bị chôn.
 *   Jobs       — phân vai máy/người trên đúng bốn việc. Lấp bước còn thiếu
 *                giữa nỗi đau và sản phẩm.
 *
 * PHẦN CỨNG ĐỨNG TRƯỚC PHẦN MỀM (chủ dự án 2026-08-07). Thứ tự này có chủ ý và
 * đọc ra được: chip chứng minh chiều sâu, rồi phần mềm mới là chỗ người đọc
 * đặt chân vào — nên khối ngay trước CTA là bốn việc bắt đầu được, không phải
 * bốn con chip. Cảnh báo blueprint về vị trí này ghi ở đầu `Hardware`.
 *
 * ĐÀO TẠO AI ĐỨNG SAU PHẦN MỀM và ngay trước CTA. `Identity.r2Text` khai ba
 * mảng kinh doanh; hai section sản phẩm mới trưng được hai, nên trang chủ vốn
 * đang tự mâu thuẫn. Nó đặt ở đây vì khối phần mềm vừa làm nảy ra đúng câu mà
 * nó trả lời — "mua về rồi ai dùng?" — và vì đó là câu cuối cùng cần trả lời
 * trước khi mời người ta bấm nút.
 *
 * Nấc trời: void → night ×3 → deep ×3 → rise ×2 → dawn. Nhiều section cùng
 * nấc đứng liền nhau là hợp lệ (ranh giới là vạch chân trời + quầng sáng do
 * `<Section>` tự vẽ, không phải màu nền) — xem docs/DESIGN-TOKENS.md. Đào tạo
 * KHÔNG lấy `dawn`: nấc đó là của `CtaBand` và nấc chỉ được đi lên, tiêu trước
 * thì dải CTA hết chỗ để sáng hơn.
 *
 * Hai section thêm 2026-08-14 chia nhau đúng chỗ nối cũ: `Principles` ở
 * `night` (đóng cụm "hiểu vấn đề"), `Jobs` mở cụm `deep` ("làm gì với nó").
 * Thang vẫn chỉ đi lên, và không nấc nào bị nhảy cóc.
 *
 * ĐÃ CHUYỂN SANG TRANG RIÊNG (chủ dự án 2026-08-07 — trang chủ chỉ giữ phần
 * cô đọng và móc khách; cả hai section đều đã tự kết bằng nút "xem chi tiết"
 * dẫn sang đúng trang đó, tức chúng vốn là bản tóm tắt của trang khác):
 *   Enterprise → /how-we-deliver/governance, thành khối "phạm vi kiểm soát"
 *                (10 nhãn) đặt trên 4 card đi sâu sẵn có. Trang chủ đền lại
 *                bằng MỘT dòng ở `Identity.r3Text`, vì blueprint bắt
 *                Enterprise là mặc định chứ không phải một menu riêng.
 *                ⟹ Từ 2026-08-14 dòng đền đó KHÔNG còn ở `Identity.r3Text`
 *                  nữa: nó lên thành nguyên tắc 01 của `Principles`, đúng
 *                  hạng mà blueprint muốn cho nó.
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

  return (
    <>
      <Hero />
      <Identity />
      <Contrast />
      <Principles />
      <Jobs />
      <Stats />
      <Hardware />
      <Software />
      <Training />
      {/* Không truyền gì thêm: dải CTA nay thuần chữ và một nút, và trang chủ
          dùng đúng bản mặc định như 13 trang còn lại. */}
      <CtaBand cta="assessment" />
    </>
  );
}
