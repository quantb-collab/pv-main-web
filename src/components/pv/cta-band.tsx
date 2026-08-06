import { getTranslations } from "next-intl/server";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
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
          <Reveal className="mt-4">
            <CtaButton href={HREF[cta]} size="lg">
              {t(cta === "none" ? "contact" : cta)}
            </CtaButton>
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
