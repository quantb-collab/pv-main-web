import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/motion/reveal";
import { Card, CardGrid, PillRow } from "@/components/pv/blocks";
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
      <Section sky="void" className="pt-32 lg:pt-40">
        <SectionHeader
          as="h1"
          eyebrow="Vận hành và quản trị"
          title={t("title")}
          lead={t("lead")}
        />
      </Section>

      {/*
        Phạm vi kiểm soát — chuyển từ trang chủ về 2026-08-07. Mười mục nhưng
        chỉ là nhãn trần, không kèm mô tả: tiêu đề đã nói hết ý nghĩa, ở đây
        người đọc chỉ cần thấy phạm vi bao phủ.

        Đặt TRÊN bốn card là có chủ ý — phạm vi trước, chiều sâu sau. Hai nhãn
        "Kiểm soát chi phí" và "Theo dõi chất lượng đầu ra" lặp lại tiêu đề của
        card g3/g4 phía dưới; đó là quan hệ tổng quan → chi tiết, không phải
        trùng lặp. Bỏ chúng khỏi hàng nhãn thì phạm vi đọc ra chỉ còn 8 mục.
      */}
      <Section sky="night">
        <SectionHeader title={t("scopeTitle")} lead={t("scopeLead")} />
        <PillRow
          className="mt-12 max-w-4xl"
          items={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => t(`e${n}`))}
        />
      </Section>

      <Section sky="rise">
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
