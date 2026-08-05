import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/motion/reveal";
import { StatementList, StepRail } from "@/components/pv/blocks";
import { CtaBand } from "@/components/pv/cta-band";
import { Gap } from "@/components/pv/gap";
import { Section, SectionHeader } from "@/components/pv/section";
import { Card, CardGrid } from "@/components/pv/blocks";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "deliver.meta" });
  return { title: t("title"), description: t("description") };
}

/**
 * §12 blueprint — trang cốt lõi để bán sự tin cậy.
 * Mỗi bước hiển thị đủ mục tiêu, đầu vào, đầu ra, người tham gia và tiêu chí
 * chuyển bước. Đây chính là thứ procurement và pháp chế tìm kiếm.
 */
export default async function HowWeDeliverPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("deliver");
  const ts = await getTranslations("deliver.steps");

  const steps = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
    title: ts(`s${n}Title`),
    body: ts(`s${n}Objective`),
    meta: [
      { label: ts("input"), value: ts(`s${n}Input`) },
      { label: ts("output"), value: ts(`s${n}Output`) },
      { label: ts("people"), value: ts(`s${n}People`) },
      { label: ts("exit"), value: ts(`s${n}Exit`) },
    ],
  }));

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

      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeader title={t("principles.title")} />
          <StatementList
            items={[1, 2, 3, 4, 5].map((n) => t(`principles.p${n}`))}
          />
        </div>
      </Section>

      <Section>
        <StepRail steps={steps} />
        <Reveal className="mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
          <Gap kind="confirm">{t("engagementGap")}</Gap>
          <Gap kind="confirm">{t("slaGap")}</Gap>
        </Reveal>
      </Section>

      <Section tone="surface">
        <SectionHeader title="Ba hình thức bắt đầu" />
        <div className="mt-12 overflow-hidden rounded-xl border">
          <CardGrid cols={3}>
            <Card index={1} title={<Link href="/how-we-deliver/assessment" className="after:absolute after:inset-0">{t("assessment.title")}</Link>}>
              {t("assessment.lead")}
            </Card>
            <Card index={2} title={<Link href="/how-we-deliver/proof-of-concept" className="after:absolute after:inset-0">{t("poc.title")}</Link>}>
              {t("poc.lead")}
            </Card>
            <Card index={3} title={<Link href="/how-we-deliver/governance" className="after:absolute after:inset-0">{t("governance.title")}</Link>}>
              {t("governance.lead")}
            </Card>
          </CardGrid>
        </div>
      </Section>

      <CtaBand cta="assessment" />
    </>
  );
}
