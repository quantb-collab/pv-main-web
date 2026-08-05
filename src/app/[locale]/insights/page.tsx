import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/motion/reveal";
import { Card, CardGrid } from "@/components/pv/blocks";
import { CtaBand } from "@/components/pv/cta-band";
import { Gap } from "@/components/pv/gap";
import { Section, SectionHeader } from "@/components/pv/section";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "insights.meta" });
  return { title: t("title"), description: t("description") };
}

/**
 * §15 blueprint — bốn nhóm nội dung. Chưa xuất bản bài nào cho tới khi mỗi bài
 * có đủ: audience, funnel stage, search intent, vấn đề, trang đích, CTA.
 */
export default async function InsightsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("insights");

  const groups = [
    {
      title: "Nhận diện vấn đề",
      body: "Vì sao mua công cụ AI chưa tạo ra thay đổi. Dấu hiệu doanh nghiệp đang dùng AI rời rạc. Quy trình nào phù hợp để bắt đầu.",
    },
    {
      title: "Ra quyết định",
      body: "Nên mua công cụ hay xây hệ thống riêng. Cloud AI hay Private AI. Cách chọn use case cho PoC. Cách đánh giá dữ liệu.",
    },
    {
      title: "Quản trị rủi ro",
      body: "AI governance gồm những gì. Kiểm soát quyền truy cập. Human-in-the-loop. Xử lý câu trả lời sai. Kiểm soát chi phí.",
    },
    {
      title: "Nội dung kỹ thuật",
      body: "Kiến trúc, Edge AI, hạ tầng AI, model serving, bán dẫn và các technical paper.",
    },
  ];

  return (
    <>
      <Section tone="dark" className="pt-32 lg:pt-40">
        <SectionHeader
          as="h1"
          eyebrow={t("hero.eyebrow")}
          title={t("hero.title")}
          lead={t("hero.lead")}
        />
      </Section>

      <Section>
        <div className="overflow-hidden rounded-xl border">
          <CardGrid cols={2}>
            {groups.map((g, i) => (
              <Card key={g.title} index={i + 1} title={g.title}>
                {g.body}
              </Card>
            ))}
          </CardGrid>
        </div>

        <Reveal className="mt-10 max-w-2xl">
          <Gap kind="confirm">{t("gap")}</Gap>
        </Reveal>
      </Section>

      <CtaBand cta="assessment" />
    </>
  );
}
