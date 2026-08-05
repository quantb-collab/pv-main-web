import { getTranslations } from "next-intl/server";
import { MediaFrame } from "@/components/motion/media-frame";
import { Reveal } from "@/components/motion/reveal";
import {
  Card,
  CardGrid,
  LayerStack,
  PillRow,
  StatementList,
  StepRail,
} from "@/components/pv/blocks";
import { CtaButton } from "@/components/pv/cta-button";
import { Gap } from "@/components/pv/gap";
import { Section, SectionHeader } from "@/components/pv/section";

/**
 * Các section của trang chủ, đúng thứ tự §9 blueprint.
 * Mỗi section chỉ ghép từ block dùng chung — không tự dựng lưới riêng.
 */

/* §9 Section 2 — Problem Recognition */
export async function Problem() {
  const t = await getTranslations("home.problem");

  return (
    <Section id="van-de" tone="surface">
      <SectionHeader eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />
      {/* Ba mục. Không mở rộng: người mua Enterprise quét, không đọc hết danh sách. */}
      <div className="mt-14 overflow-hidden rounded-xl border">
        <CardGrid cols={3}>
          {[1, 2, 3].map((n) => (
            <Card key={n} index={n} title={t(`i${n}Title`)}>
              {t(`i${n}Body`)}
            </Card>
          ))}
        </CardGrid>
      </div>
    </Section>
  );
}

/* §9 Section 3 — Business Outcomes */
export async function Outcomes() {
  const t = await getTranslations("home.outcomes");

  return (
    <Section id="ket-qua">
      <SectionHeader eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />
      <div className="mt-14 overflow-hidden rounded-xl border">
        <CardGrid cols={4}>
          {[1, 2, 3, 4].map((n) => (
            <Card key={n} title={t(`o${n}Title`)}>
              {t(`o${n}Body`)}
            </Card>
          ))}
        </CardGrid>
      </div>
      <Reveal className="mt-8 max-w-2xl">
        <Gap kind="proof">{t("numbersGap")}</Gap>
      </Reveal>
    </Section>
  );
}

/* §9 Section 4 — Start with a Real Use Case */
export async function StartHere() {
  const t = await getTranslations("home.startHere");
  const tc = await getTranslations("cta");

  return (
    <Section id="bat-dau" tone="surface">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-20">
        <div>
          <SectionHeader
            eyebrow={t("eyebrow")}
            title={t("title")}
            lead={t("lead")}
          />
          <PillRow
            className="mt-10"
            items={[1, 2, 3, 4, 5, 6].map((n) => t(`u${n}`))}
          />
          <Reveal className="mt-8 max-w-xl">
            <Gap kind="confirm">{t("priorityGap")}</Gap>
          </Reveal>
          <Reveal className="mt-8">
            <CtaButton href="/use-cases" variant="outline">
              {tc("more")}
            </CtaButton>
          </Reveal>
        </div>

        <MediaFrame
          ratio="landscape"
          need="Ảnh minh hoạ một bài toán cụ thể: màn hình hệ thống thật đang xử lý hồ sơ hoặc tra cứu tài liệu. Chụp màn hình sản phẩm thật, không dựng dashboard giả."
        />
      </div>
    </Section>
  );
}

/* §9 Section 5 — AI Maturity Journey */
export async function Maturity() {
  const t = await getTranslations("home.maturity");

  return (
    <Section id="lo-trinh">
      <SectionHeader eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />
      <div className="mt-14 grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <StepRail
          steps={[1, 2, 3, 4, 5].map((n) => ({
            title: t(`s${n}Title`),
            body: t(`s${n}Body`),
          }))}
        />
        <Reveal
          direction="left"
          className="self-start rounded-xl border bg-surface p-6 lg:sticky lg:top-28 lg:p-8"
        >
          <p className="text-base leading-relaxed text-pretty">
            {t("humanNote")}
          </p>
        </Reveal>
      </div>
    </Section>
  );
}

/* §9 Section 6 — Why Pebble Vina */
export async function Why() {
  const t = await getTranslations("home.why");

  return (
    <Section id="vi-sao" tone="surface">
      <SectionHeader eyebrow={t("eyebrow")} title={t("title")} />
      <div className="mt-14 overflow-hidden rounded-xl border">
        <CardGrid cols={4}>
          {[1, 2, 3, 4].map((n) => (
            <Card key={n} index={n} title={t(`p${n}Title`)}>
              {t(`p${n}Body`)}
            </Card>
          ))}
        </CardGrid>
      </div>
    </Section>
  );
}

/* §9 Section 7 — How We Deliver */
export async function Deliver() {
  const t = await getTranslations("home.deliver");
  const tc = await getTranslations("cta");

  return (
    <Section id="trien-khai">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          lead={t("lead")}
        >
          <Reveal className="mt-4">
            <CtaButton href="/how-we-deliver" variant="outline">
              {tc("deliver")}
            </CtaButton>
          </Reveal>
        </SectionHeader>

        <StepRail steps={[1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({ title: t(`s${n}`) }))} />
      </div>
    </Section>
  );
}

/* §9 Section 8 — Enterprise-Grade by Design */
export async function Enterprise() {
  const t = await getTranslations("home.enterprise");
  const tc = await getTranslations("cta");

  return (
    <Section id="enterprise" tone="dark">
      <SectionHeader eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />
      {/*
        Mười mục nhưng chỉ là nhãn, không kèm mô tả.
        Tiêu đề section đã nói hết ý nghĩa; ở đây người đọc chỉ cần thấy phạm vi
        bao phủ. Ai muốn chi tiết thì vào /how-we-deliver/governance.
      */}
      <PillRow
        className="mt-12 max-w-4xl"
        items={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => t(`e${n}`))}
      />
      <Reveal className="mt-10">
        <CtaButton href="/how-we-deliver/governance" variant="outline">
          {tc("more")}
        </CtaButton>
      </Reveal>
    </Section>
  );
}

/* §9 Section 9 — Full-stack Capability */
export async function FullStack() {
  const t = await getTranslations("home.fullstack");
  const tc = await getTranslations("cta");

  return (
    <Section id="nang-luc">
      <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-20">
        <div>
          <SectionHeader
            eyebrow={t("eyebrow")}
            title={t("title")}
            lead={t("lead")}
          />
          <StatementList
            className="mt-10"
            items={[1, 2, 3, 4].map((n) => t(`b${n}`))}
          />
          <Reveal className="mt-8">
            <CtaButton href="/technology" variant="outline">
              {tc("technology")}
            </CtaButton>
          </Reveal>
        </div>

        <LayerStack layers={[1, 2, 3, 4, 5].map((n) => t(`l${n}`))} />
      </div>
    </Section>
  );
}

/* §9 Section 10 — Proof */
export async function Proof() {
  const t = await getTranslations("home.proof");

  return (
    <Section id="bang-chung" tone="surface">
      <SectionHeader eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />
      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        <Reveal>
          <Gap kind="proof">{t("caseGap")}</Gap>
        </Reveal>
        <Reveal delay={0.05}>
          <Gap kind="restricted">{t("partnerGap")}</Gap>
        </Reveal>
        <Reveal delay={0.1}>
          <Gap kind="proof">{t("teamGap")}</Gap>
        </Reveal>
        <Reveal delay={0.15}>
          <Gap kind="proof">{t("demoGap")}</Gap>
        </Reveal>
      </div>
    </Section>
  );
}
