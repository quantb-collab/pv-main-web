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
  const t = await getTranslations({ locale, namespace: "deliver.governance" });
  return { title: t("title"), description: t("lead") };
}

export default async function GovernancePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("deliver.governance");

  return (
    <>
      <Section tone="dark" className="pt-32 lg:pt-40">
        <SectionHeader
          as="h1"
          eyebrow="Vận hành và quản trị"
          title={t("title")}
          lead={t("lead")}
        />
      </Section>

      <Section>
        <div className="overflow-hidden rounded-xl border">
          <CardGrid cols={2}>
            {[1, 2, 3, 4].map((n) => (
              <Card key={n} index={n} title={t(`g${n}Title`)}>
                {t(`g${n}Body`)}
              </Card>
            ))}
          </CardGrid>
        </div>

        <Reveal className="mt-10 max-w-2xl">
          <Gap kind="confirm">{t("opsGap")}</Gap>
        </Reveal>
      </Section>

      <CtaBand cta="architecture" />
    </>
  );
}
