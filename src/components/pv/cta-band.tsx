import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/reveal";
import { AssessmentDrawerButton } from "@/components/pv/assessment-drawer";
import { CtaButton } from "@/components/pv/cta-button";
import { Section, SectionHeader } from "@/components/pv/section";
import type { Cta } from "@/content/registry";

/**
 * ============================================================================
 * DẢI CTA ĐÓNG TRANG — THUẦN CHỮ VÀ MỘT NÚT
 * ----------------------------------------------------------------------------
 * §23 blueprint: mỗi trang kết thúc bằng một bước tiếp theo rõ ràng, và chỉ
 * MỘT CTA chính. Nút phụ nếu có phải là hành động đọc thêm, không phải một lời
 * mời ngang hàng.
 *
 * KHÔNG CÒN CỘT THỨ HAI. Bản trước là lưới `1.1fr · 1fr`, cột phải là danh sách
 * bốn mục đánh số "bạn nhận được gì". Hai vấn đề: chỉ TRANG CHỦ truyền `items`,
 * nên ở 13 trang còn lại lưới vẫn chia đôi và nửa phải bỏ trống — khối chữ nép
 * vào nửa trái của một màn hình sáng nhất trang, đọc ra như bố cục hỏng chứ
 * không như một câu kết. Và ở chỗ có danh sách thì nó lặp lại đúng bốn câu trả
 * lời mà biểu mẫu khảo sát đã nói ngay khi bấm nút — một dải CTA không phải chỗ
 * trả lời, nó là chỗ MỜI.
 *
 * Bốn mục ấy nay nằm gọn trong câu dẫn (`home.finalCta.lead`). Đó là cách một
 * giao diện thuần chữ nuốt một danh sách: biến nó thành một câu, đừng giữ lại
 * cái khung.
 *
 * CĂN GIỮA, và đây là một trong ba chỗ hiếm hoi được căn giữa trên site (hai
 * chỗ kia ở `sections.tsx`). Lý do: không còn cột thứ hai để căn thẳng lề trái,
 * và section này là dấu chấm hết của trang — mắt dừng ở giữa màn hình sáng nhất
 * rồi mới xuống footer. Còn cột thì phải căn trái.
 *
 * CỠ TIÊU ĐỀ GIỮ NGUYÊN `headline` (mặc định của h2). Đừng nâng lên `display`:
 * cỡ đó dành riêng cho h1, và dải này đứng ở mọi trang — nâng lên là mọi trang
 * có hai dòng chữ to ngang nhau, tiêu đề trang thành ra không còn to nhất.
 * ============================================================================
 */

/*
  Đích phải khớp nhãn. `cta.assessment` hiện là "Đặt lịch khảo sát" nên nó trỏ
  về `/ai-assessment` — đúng trang có form khảo sát. Đổi nhãn thì đổi luôn ba
  href ở hero + header cho khớp, đừng để nút hứa một đằng mở ra một nẻo.
*/
const HREF: Record<Cta, string> = {
  assessment: "/ai-assessment",
  process: "/contact",
  architecture: "/contact",
  usecase: "/contact",
  poc: "/contact",
  contact: "/contact",
  none: "/contact",
};

export async function CtaBand({
  cta = "assessment",
  title,
  lead,
}: {
  cta?: Cta;
  title?: string;
  lead?: string;
}) {
  const t = await getTranslations("cta");
  const tf = await getTranslations("home.finalCta");

  return (
    <Section sky="dawn">
      <SectionHeader
        align="center"
        eyebrow={tf("eyebrow")}
        title={title ?? tf("title")}
        lead={lead ?? tf("lead")}
      >
        {/*
          `assessment` mở DRAWER thay vì điều hướng (chủ dự án 2026-08-07):
          người đọc vừa bị thuyết phục xong thì đừng bắt họ rời trang để điền
          form — rời trang là chỗ rơi rụng lớn nhất của phễu. Các cta còn lại
          (`architecture`, `poc`, `contact`…) vẫn là link như cũ, vì chúng dẫn
          tới một cuộc trao đổi cần đọc thêm chứ không phải một form.

          `/ai-assessment` VẪN sống và vẫn là đích của mọi link chia sẻ —
          drawer chỉ là lối tắt, không thay thế trang.
        */}
        <Reveal className="mt-4">
          {cta === "assessment" ? (
            <AssessmentDrawerButton size="lg">
              {t("assessment")}
            </AssessmentDrawerButton>
          ) : (
            <CtaButton href={HREF[cta]} size="lg">
              {t(cta === "none" ? "contact" : cta)}
            </CtaButton>
          )}
        </Reveal>
      </SectionHeader>
    </Section>
  );
}
