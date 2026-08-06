import { getTranslations } from "next-intl/server";
import { MediaFrame } from "@/components/motion/media-frame";
import { Reveal } from "@/components/motion/reveal";
import {
  Card,
  CardGrid,
  DefinitionList,
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

/**
 * Section 2 — Hành trình & định vị Pebble Vina (chèn theo quyết định chủ dự
 * án 2026-08-06, ngoài danh sách §9 gốc). Header GỘP MỘT DÒNG duy nhất —
 * không eyebrow, không câu tuyên bố, không gạch chân — theo yêu cầu chủ dự
 * án 2026-08-06 (các concept statement/underline trước đó đã bị loại).
 *
 * Thân section là DefinitionList theo ĐÚNG thứ tự diễn dịch chủ dự án đưa
 * (không đảo, không diễn lại):
 *   2026 — Hà Nội   ra đời, xác định ngay mục tiêu (giá trị năng lực sản
 *                   xuất và vận hành cho doanh nghiệp)
 *   Trọng tâm       BA MẢNG KINH DOANH: phần cứng · phần mềm · đào tạo AI
 *                   (đào tạo AI là một mảng dịch vụ, KHÔNG phải "nhân sự
 *                   nội bộ được đào tạo AI" — đã từng hiểu sai)
 *   Cách làm        rõ ràng mà không cứng nhắc, linh hoạt theo từng bài toán
 *
 * KHÔNG claim quy mô/vị thế — công ty mới, chưa có bằng chứng, registry cấm
 * số liệu chưa xác minh. Chi tiết dịch vụ từng mảng thuộc section offer sẽ
 * dựng sau, không liệt kê ở đây.
 */
export async function Identity() {
  const t = await getTranslations("home.who");

  return (
    <Section id="pebble-vina" sky="night">
      <SectionHeader title={t("title")} />
      <DefinitionList
        className="mt-14 w-full max-w-3xl"
        items={[1, 2, 3].map((n) => ({
          label: t(`r${n}Label`),
          text: t(`r${n}Text`),
        }))}
      />
    </Section>
  );
}

/* §9 Section 2 — Problem Recognition */
export async function Problem() {
  const t = await getTranslations("home.problem");

  return (
    <Section id="van-de" sky="night">
      {/* Không lead: tiêu đề đã nói trọn ý, ba thẻ bên dưới là phần triển khai. */}
      <SectionHeader eyebrow={t("eyebrow")} title={t("title")} />
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
    <Section id="ket-qua" sky="night">
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
    <Section id="bat-dau" sky="night">
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
    <Section id="lo-trinh" sky="deep">
      <SectionHeader eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />
      <div className="mt-14 grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        {/* Nhãn trần, không mô tả — năm nấc tự kể được câu chuyện (một công
            việc → toàn doanh nghiệp), phần "con người ở đâu" đã có ghi chú
            bên cạnh, còn phân quyền/nhật ký thuộc section Enterprise. */}
        <StepRail
          steps={[1, 2, 3, 4, 5].map((n) => ({ title: t(`s${n}Title`) }))}
        />
        <Reveal
          direction="left"
          className="self-start rounded-xl border bg-surface p-6 lg:sticky lg:top-28 lg:p-8"
        >
          <p className="text-body text-pretty">{t("humanNote")}</p>
        </Reveal>
      </div>
    </Section>
  );
}

/* §9 Section 6 — Why Pebble Vina */
export async function Why() {
  const t = await getTranslations("home.why");

  return (
    <Section id="vi-sao" sky="deep">
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
    <Section id="trien-khai" sky="deep">
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
    <Section id="enterprise" sky="deep">
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
    <Section id="nang-luc" sky="rise">
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
    <Section id="bang-chung" sky="rise">
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
