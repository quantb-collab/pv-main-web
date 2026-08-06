import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/hero";
import {
  Deliver,
  Enterprise,
  FullStack,
  Identity,
  Maturity,
  Outcomes,
  Problem,
  Proof,
  StartHere,
  Why,
} from "@/components/home/sections";
import { CtaBand } from "@/components/pv/cta-band";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.meta" });
  return { title: t("title"), description: t("description") };
}

/**
 * Trang chủ — 12 section: 11 theo §9 blueprint + Identity ở vị trí 2
 * (chèn theo quyết định chủ dự án 2026-08-06 — hook giữ thuần cảm xúc,
 * phần "là ai / làm gì" dồn về một section riêng ngay dưới).
 * Thứ tự còn lại là thứ tự thuyết phục, không sắp xếp lại tuỳ ý:
 * biết là ai → nhận ra vấn đề → thấy kết quả → biết bắt đầu ở đâu
 * → tin cách làm → tin năng lực → thấy bằng chứng → biết bước tiếp theo.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home.finalCta");

  return (
    <>
      <Hero />
      <Identity />
      <Problem />
      <Outcomes />
      <StartHere />
      <Maturity />
      <Why />
      <Deliver />
      <Enterprise />
      <FullStack />
      <Proof />
      <CtaBand
        cta="assessment"
        items={[1, 2, 3, 4].map((n) => t(`g${n}`))}
      />
    </>
  );
}
