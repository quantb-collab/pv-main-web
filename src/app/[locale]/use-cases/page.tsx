import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CtaBand } from "@/components/pv/cta-band";
import { Section, SectionHeader } from "@/components/pv/section";
import { IndexGrid } from "@/components/pv/templates";
import { getPage } from "@/content/registry";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "useCases.meta" });
  return { title: t("title"), description: t("description") };
}

export default async function UseCasesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("useCases");
  const page = getPage("use-cases")!;
  const children = page.children ?? [];

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
        <IndexGrid
          items={children.map((c) => {
            const slug = c.key.split(".")[1];
            return {
              href: c.path,
              title: t(`${slug}.title`),
              body: c.objective,
            };
          })}
        />
      </Section>

      <CtaBand cta="usecase" />
    </>
  );
}
