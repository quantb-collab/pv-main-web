import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/motion/reveal";
import { StatementList } from "@/components/pv/blocks";
import { CtaBand } from "@/components/pv/cta-band";
import { Gap } from "@/components/pv/gap";
import { Section, SectionHeader } from "@/components/pv/section";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "deliver.assessment" });
  return { title: t("title"), description: t("lead") };
}

export default async function AssessmentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("deliver.assessment");

  return (
    <>
      <Section tone="dark" className="pt-32 lg:pt-40">
        <SectionHeader
          as="h1"
          eyebrow="AI Readiness Assessment"
          title={t("title")}
          lead={t("lead")}
        />
      </Section>

      <Section>
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeader as="h3" title={t("scopeTitle")} />
            <StatementList
              className="mt-6"
              items={[1, 2, 3, 4, 5, 6].map((n) => t(`sc${n}`))}
            />
          </div>
          <div>
            <SectionHeader as="h3" title={t("outputTitle")} />
            <StatementList
              className="mt-6"
              items={[1, 2, 3, 4, 5, 6].map((n) => t(`o${n}`))}
            />
          </div>
        </div>

        <Reveal className="mt-12 max-w-2xl">
          <Gap kind="confirm">{t("feeGap")}</Gap>
        </Reveal>
      </Section>

      <CtaBand cta="assessment" />
    </>
  );
}
