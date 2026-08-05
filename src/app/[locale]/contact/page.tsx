import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/motion/reveal";
import { Card, CardGrid } from "@/components/pv/blocks";
import { Gap } from "@/components/pv/gap";
import { Section, SectionHeader } from "@/components/pv/section";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact.meta" });
  return { title: t("title"), description: t("description") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

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
          <CardGrid cols={3}>
            <Card
              index={1}
              title={
                <Link href="/ai-assessment" className="after:absolute after:inset-0">
                  {t("routes.assessmentTitle")}
                </Link>
              }
            >
              {t("routes.assessmentBody")}
            </Card>
            <Card index={2} title={t("routes.processTitle")}>
              {t("routes.processBody")}
            </Card>
            <Card index={3} title={t("routes.architectureTitle")}>
              {t("routes.architectureBody")}
            </Card>
          </CardGrid>
        </div>

        <Reveal className="mt-10 max-w-2xl">
          <Gap kind="confirm">{t("infoGap")}</Gap>
        </Reveal>
      </Section>
    </>
  );
}
