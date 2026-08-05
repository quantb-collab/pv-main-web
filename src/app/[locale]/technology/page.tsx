import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/motion/reveal";
import { Card, CardGrid, LayerStack, PillRow } from "@/components/pv/blocks";
import { CtaBand } from "@/components/pv/cta-band";
import { Gap } from "@/components/pv/gap";
import { Section, SectionHeader } from "@/components/pv/section";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "technology.meta" });
  return { title: t("title"), description: t("description") };
}

/**
 * §13 blueprint — khu vực kỹ thuật chuyên sâu.
 * Được phép dùng thuật ngữ, nhưng mỗi khẳng định phải có tài liệu đi kèm.
 * Chưa có tài liệu thì để ô chờ, không viết cho đầy.
 */
export default async function TechnologyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("technology");

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
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <SectionHeader title={t("layers.title")} />
            <Reveal className="mt-8 max-w-md">
              <Gap kind="proof">{t("archGap")}</Gap>
            </Reveal>
          </div>
          <LayerStack
            layers={[1, 2, 3, 4, 5, 6, 7, 8].map((n) => t(`layers.l${n}`))}
          />
        </div>
      </Section>

      <Section tone="surface">
        <div className="grid gap-14 md:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeader as="h3" title={t("integration.title")} lead={t("integration.lead")} />
            <PillRow
              className="mt-8"
              items={[
                "API",
                "ERP",
                "CRM",
                "MES",
                "File system",
                "Database",
                "Identity",
                "Role",
                "Audit",
                "Data lineage",
              ]}
            />
            <Reveal className="mt-8">
              <Gap kind="restricted">{t("integrationGap")}</Gap>
            </Reveal>
          </div>

          <div>
            <SectionHeader as="h3" title={t("models.title")} lead={t("models.lead")} />
            <PillRow
              className="mt-8"
              items={[
                "Model selection",
                "Model routing",
                "RAG",
                "Fine-tuning",
                "Evaluation",
                "Guardrails",
                "Tool use",
                "Human approval",
              ]}
            />
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader title={t("deployment.title")} />
        <PillRow
          className="mt-8"
          items={[1, 2, 3, 4, 5].map((n) => t(`deployment.d${n}`))}
        />
      </Section>

      <Section tone="surface">
        <SectionHeader title={t("hardware.title")} lead={t("hardware.lead")} />
        <div className="mt-12 overflow-hidden rounded-xl border">
          <CardGrid cols={3}>
            <Card title={t("hardware.mint")} />
            <Card title={t("hardware.papaya")} />
            <Card title={t("hardware.espresso")} />
          </CardGrid>
        </div>
        <Reveal className="mt-8 max-w-2xl">
          <Gap kind="proof">{t("hardware.specGap")}</Gap>
        </Reveal>
      </Section>

      <CtaBand cta="architecture" />
    </>
  );
}
