import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { StatementList } from "@/components/pv/blocks";
import { CtaBand } from "@/components/pv/cta-band";
import { Section, SectionHeader } from "@/components/pv/section";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "deliver.poc" });
  return { title: t("title"), description: t("lead") };
}

export default async function PocPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("deliver.poc");

  return (
    <>
      <Section sky="void" className="pt-32 lg:pt-40">
        <SectionHeader
          as="h1"
          eyebrow="PoC Scoping Workshop"
          title={t("title")}
          lead={t("lead")}
        />
      </Section>

      <Section sky="rise">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeader title={t("outputTitle")} />
          <StatementList
            items={[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => t(`o${n}`))}
          />
        </div>
      </Section>

      <CtaBand cta="poc" />
    </>
  );
}
