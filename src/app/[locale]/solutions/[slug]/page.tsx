import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SolutionTemplate, StubPage } from "@/components/pv/templates";
import { getPage, PAGES } from "@/content/registry";
import { routing } from "@/i18n/routing";

const parent = PAGES.find((p) => p.key === "solutions")!;
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
  const t = await getTranslations({ locale, namespace: "solutions" });
  return {
    title: t(`${slug}.title`),
    description: t(`${slug}.body`),
  };
}

export default async function SolutionDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const page = getPage(`solutions.${slug}`);
  if (!page) notFound();

  const t = await getTranslations("solutions");

  // Trang thuộc V2 chỉ dựng khung tạm — không viết copy khi chưa tới lượt.
  if (page.status === "stub") {
    return <StubPage page={page} title={t(`${slug}.title`)} />;
  }

  return <SolutionTemplate page={page} />;
}
