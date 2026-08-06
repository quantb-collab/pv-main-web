import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MediaFrame } from "@/components/motion/media-frame";
import { Reveal } from "@/components/motion/reveal";
import { StatementList } from "@/components/pv/blocks";
import { CtaBand } from "@/components/pv/cta-band";
import { Gap } from "@/components/pv/gap";
import { Section, SectionHeader } from "@/components/pv/section";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.meta" });
  return { title: t("title"), description: t("description") };
}

/**
 * §14 blueprint — About không mở đầu bằng lịch sử công ty.
 * Mở đầu bằng lý do khách hàng nên tin đơn vị này đi được đường dài.
 */
export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  return (
    <>
      <Section sky="void" className="pt-32 lg:pt-40">
        <SectionHeader
          as="h1"
          eyebrow={t("hero.eyebrow")}
          title={t("hero.title")}
          lead={t("hero.lead")}
        />
      </Section>

      <Section sky="night">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-20">
          <div>
            <SectionHeader title={t("mission.title")} lead={t("mission.body")} />
          </div>
          <MediaFrame
            ratio="landscape"
            need="Ảnh không gian làm việc hoặc phòng lab thật của Pebble Vina. Có người, chụp tự nhiên, không dàn dựng kiểu ảnh stock."
          />
        </div>
      </Section>

      <Section sky="deep">
        <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
          <Reveal className="rounded-xl border bg-background p-6 lg:p-8">
            <h3 className="font-display text-title font-semibold">
              {t("vietnam.title")}
            </h3>
            <div className="mt-4">
              <Gap kind="confirm">
                Mô tả năng lực triển khai tại Việt Nam: quy mô đội ngũ, vai trò
                đảm nhiệm, phạm vi chịu trách nhiệm trong một dự án.
              </Gap>
            </div>
          </Reveal>

          <Reveal delay={0.06} className="rounded-xl border bg-background p-6 lg:p-8">
            <h3 className="font-display text-title font-semibold">
              {t("korea.title")}
            </h3>
            <div className="mt-4">
              <Gap kind="confirm">{t("squareGap")}</Gap>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section sky="deep">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeader title={t("principles.title")} />
          <StatementList
            items={[1, 2, 3, 4].map((n) => t(`principles.p${n}`))}
          />
        </div>
      </Section>

      <Section sky="rise">
        <SectionHeader title="Bằng chứng cần bổ sung" />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <Gap kind="proof">{t("leadershipGap")}</Gap>
          <Gap kind="proof">{t("teamPhotoGap")}</Gap>
          <Gap kind="confirm">{t("legalGap")}</Gap>
        </div>
      </Section>

      <CtaBand cta="assessment" />
    </>
  );
}
