import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { StubPage, UseCaseTemplate } from "@/components/pv/templates";
import { getPage, PAGES } from "@/content/registry";
import { routing } from "@/i18n/routing";

const parent = PAGES.find((p) => p.key === "use-cases")!;
const slugs = (parent.children ?? []).map((c) => c.key.split(".")[1]);

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!slugs.includes(slug)) return {};
  const t = await getTranslations({ locale, namespace: "useCases" });
  const page = getPage(`use-cases.${slug}`);
  return { title: t(`${slug}.title`), description: page?.objective };
}

export default async function UseCaseDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const page = getPage(`use-cases.${slug}`);
  if (!page) notFound();

  const t = await getTranslations("useCases");

  if (page.status === "stub") {
    return <StubPage page={page} title={t(`${slug}.title`)} />;
  }

  return <UseCaseTemplate page={page} />;
}
