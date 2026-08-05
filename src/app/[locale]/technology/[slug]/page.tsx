import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { StubPage } from "@/components/pv/templates";
import { getPage, PAGES } from "@/content/registry";
import { routing } from "@/i18n/routing";

const parent = PAGES.find((p) => p.key === "technology")!;
const slugs = (parent.children ?? []).map((c) => c.key.split(".")[1]);

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

export default async function TechnologyDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const page = getPage(`technology.${slug}`);
  if (!page) notFound();

  return <StubPage page={page} title={page.objective} />;
}
