import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AssessmentForm } from "@/components/forms/assessment-form";
import { Reveal } from "@/components/motion/reveal";
import { StatementList } from "@/components/pv/blocks";
import { Gap } from "@/components/pv/gap";
import { Section, SectionHeader } from "@/components/pv/section";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "assessment.meta" });
  return { title: t("title"), description: t("description") };
}

/**
 * Trang chuyển đổi chính của site. Mọi CTA "Đánh giá cơ hội ứng dụng AI"
 * đều dẫn về đây, nên trang phải trả lời đủ: nhận được gì, mất bao lâu,
 * cần chuẩn bị gì — trước khi hỏi thông tin.
 */
export default async function AiAssessmentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("assessment");

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
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="flex flex-col gap-10">
            <div>
              <SectionHeader as="h3" title={t("receive.title")} />
              <StatementList
                className="mt-5"
                items={[1, 2, 3, 4, 5].map((n) => t(`receive.r${n}`))}
              />
            </div>

            <div>
              <SectionHeader as="h3" title={t("prepare.title")} />
              <StatementList
                className="mt-5"
                items={[1, 2, 3, 4].map((n) => t(`prepare.p${n}`))}
              />
              <p className="mt-4 text-body-sm text-muted-foreground">
                {t("prepare.note")}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Gap kind="confirm">{t("feeGap")}</Gap>
              <Gap kind="confirm">{t("slaGap")}</Gap>
              <Gap kind="confirm">{t("ownerGap")}</Gap>
              <Gap kind="confirm">{t("crmGap")}</Gap>
            </div>
          </div>

          <Reveal direction="left" className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="font-display text-subhead font-semibold">
              {t("form.title")}
            </h2>
            <p className="mt-3 mb-6 text-body-sm text-muted-foreground">
              {t("form.lead")}
            </p>
            <AssessmentForm />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
