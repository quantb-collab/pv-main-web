import { getTranslations } from "next-intl/server";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { AssessmentDrawerButton } from "@/components/pv/assessment-drawer";
import { CtaButton } from "@/components/pv/cta-button";
import { Section, SectionHeader } from "@/components/pv/section";
import type { Cta } from "@/content/registry";

/**
 * Dải CTA đóng trang.
 * §23 blueprint: mỗi trang phải kết thúc bằng một bước tiếp theo rõ ràng,
 * và chỉ MỘT CTA chính. Nút phụ nếu có phải là hành động đọc thêm, không phải
 * một lời mời ngang hàng.
 */

/*
  MỌI CTA CHÀO MỜI ĐỀU MỞ FORM (chủ dự án 2026-08-14). Năm nhãn dưới đây là năm
  cách nói của cùng một lời mời — ba offer §"Ba offer" blueprint — nên tất cả
  phải rơi vào cùng một chỗ nhận lead. Trước đó chỉ `assessment` mở form, còn
  bốn nhãn kia trỏ về `/contact` — trang KHÔNG có form, tức 23/33 trang của site
  kết thúc bằng một ngõ cụt.

  `contact` và `none` KHÔNG nằm trong danh sách: đó là "liên hệ" trần của trang
  pháp lý, không phải một lời mời khảo sát — nút hứa liên hệ mà mở ra form khảo
  sát là hứa một đằng mở một nẻo.

  `/ai-assessment` vẫn sống và vẫn là đích của link chia sẻ; drawer là lối tắt.
*/
const OFFER_CTA: ReadonlySet<Cta> = new Set([
  "assessment",
  "process",
  "architecture",
  "usecase",
  "poc",
]);

export async function CtaBand({
  cta = "assessment",
  /** Danh sách những gì khách nhận được. Bỏ trống nếu trang đã nói ở trên. */
  items,
  title,
  lead,
}: {
  cta?: Cta;
  items?: string[];
  title?: string;
  lead?: string;
}) {
  const t = await getTranslations("cta");
  const tf = await getTranslations("home.finalCta");

  return (
    <Section sky="dawn">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <SectionHeader
          eyebrow={tf("eyebrow")}
          title={title ?? tf("title")}
          lead={lead ?? tf("lead")}
        >
          {/*
            Drawer thay vì điều hướng (chủ dự án 2026-08-07): người đọc vừa bị
            thuyết phục xong thì đừng bắt họ rời trang để điền form — rời trang
            là chỗ rơi rụng lớn nhất của phễu. Nhãn GIỮ NGUYÊN theo từng trang
            ("Trao đổi kiến trúc" ở trang kỹ thuật, "Khoanh phạm vi PoC" ở trang
            PoC): nhãn là lời mời hợp ngữ cảnh, form phía sau là một.
          */}
          <Reveal className="mt-4">
            {OFFER_CTA.has(cta) ? (
              <AssessmentDrawerButton size="lg">{t(cta)}</AssessmentDrawerButton>
            ) : (
              <CtaButton href="/contact" size="lg">
                {t("contact")}
              </CtaButton>
            )}
          </Reveal>
        </SectionHeader>

        {items?.length ? (
          <RevealGroup className="flex flex-col self-center">
            {items.map((item, i) => (
              <RevealItem
                key={i}
                direction="left"
                className="flex items-baseline gap-4 border-b py-4 last:border-b-0"
              >
                <span className="font-mono text-micro font-medium text-subtle-foreground tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-body">{item}</span>
              </RevealItem>
            ))}
          </RevealGroup>
        ) : null}
      </div>
    </Section>
  );
}
