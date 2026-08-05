import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section, SectionHeader } from "@/components/pv/section";
import { Badge } from "@/components/ui/badge";
import { ALL_PAGES, allGaps, type Status } from "@/content/registry";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  title: "Track",
  robots: { index: false, follow: false },
};

/**
 * ============================================================================
 * BẢNG THEO DÕI NỘI BỘ — /track
 * (không đặt tên thư mục là _track: Next coi thư mục bắt đầu bằng "_" là
 *  private folder và không tạo route)
 * ----------------------------------------------------------------------------
 * Trả lời ba câu trong một màn hình:
 *   1. Trang nào đã tới đâu?
 *   2. Còn thiếu gì, ở trang nào?
 *   3. Thứ nào đang chặn việc phát hành?
 *
 * Dữ liệu lấy thẳng từ src/content/registry.ts — không có bản chép tay thứ hai,
 * nên bảng này không bao giờ lệch với thực tế khai báo.
 * ============================================================================
 */

const STATUS_ORDER: Status[] = ["ready", "content", "wireframe", "stub", "spec"];

const STATUS_TONE: Record<Status, string> = {
  ready: "bg-success/15 text-success border-success/30",
  content: "bg-brand/15 text-brand border-brand/30",
  wireframe: "bg-muted text-foreground border-border",
  stub: "bg-warning/15 text-warning border-warning/30",
  spec: "bg-muted text-subtle-foreground border-border",
};

export default async function TrackPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("track");
  const gaps = allGaps();

  const counts = STATUS_ORDER.map((s) => ({
    status: s,
    count: ALL_PAGES.filter((p) => p.status === s).length,
  }));

  const v1 = ALL_PAGES.filter((p) => p.phase === "V1");
  const v2 = ALL_PAGES.filter((p) => p.phase === "V2");

  return (
    <>
      <Section className="pt-32 lg:pt-40">
        <SectionHeader as="h1" title={t("title")} lead={t("lead")} />

        <div className="mt-10 flex flex-wrap gap-3">
          {counts.map((c) => (
            <div
              key={c.status}
              className={`rounded-lg border px-4 py-3 ${STATUS_TONE[c.status]}`}
            >
              <div className="font-mono text-subhead font-semibold tabular-nums">
                {c.count}
              </div>
              <div className="mt-0.5 text-meta">
                {t(`statusLabel.${c.status}`)}
              </div>
            </div>
          ))}
          <div className="rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-warning">
            <div className="font-mono text-subhead font-semibold tabular-nums">
              {gaps.length}
            </div>
            <div className="mt-0.5 text-meta">{t("gaps")}</div>
          </div>
        </div>
      </Section>

      <Section flush className="pb-16">
        <PhaseTable title="V1 — bắt buộc trước khi phát hành" pages={v1} t={t} />
        <div className="mt-14">
          <PhaseTable title="V2 — làm sau" pages={v2} t={t} />
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeader title={t("gapsTitle")} lead={t("gapsLead")} />
        <ul className="mt-10 flex flex-col gap-px overflow-hidden rounded-xl border bg-border">
          {gaps.map(({ page, gap }, i) => (
            <li
              key={`${page.key}-${i}`}
              className="flex flex-col gap-1 bg-background p-4 sm:flex-row sm:items-baseline sm:gap-6"
            >
              <Link
                href={page.path}
                className="shrink-0 font-mono text-meta text-brand sm:w-64"
              >
                {page.path}
              </Link>
              <span className="text-body-sm">{gap}</span>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}

function PhaseTable({
  title,
  pages,
  t,
}: {
  title: string;
  pages: typeof ALL_PAGES;
  t: Awaited<ReturnType<typeof getTranslations<"track">>>;
}) {
  return (
    <div>
      <h2 className="font-display text-title font-semibold">{title}</h2>
      <div className="mt-5 overflow-x-auto rounded-xl border">
        <table className="w-full min-w-[56rem] text-left text-body-sm">
          <thead className="border-b bg-surface">
            <tr className="font-mono text-micro text-subtle-foreground uppercase">
              <th className="p-3 font-medium">{t("pages")}</th>
              <th className="p-3 font-medium">{t("status")}</th>
              <th className="p-3 font-medium">{t("audience")}</th>
              <th className="p-3 font-medium">{t("funnel")}</th>
              <th className="p-3 font-medium">{t("cta")}</th>
              <th className="p-3 font-medium">{t("gaps")}</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((p) => (
              <tr key={p.key} className="border-b last:border-b-0 align-top">
                <td className="p-3">
                  <Link href={p.path} className="font-mono text-meta text-brand">
                    {p.path}
                  </Link>
                  <p className="mt-1 max-w-md text-meta text-muted-foreground">
                    {p.objective}
                  </p>
                </td>
                <td className="p-3">
                  <Badge variant="outline" className={STATUS_TONE[p.status]}>
                    {t(`statusLabel.${p.status}`)}
                  </Badge>
                </td>
                <td className="p-3 text-meta text-muted-foreground">
                  {t(`audienceLabel.${p.audiencePrimary}`)}
                </td>
                <td className="p-3 text-meta text-muted-foreground">
                  {t(`funnelLabel.${p.funnel}`)}
                </td>
                <td className="p-3 font-mono text-meta text-muted-foreground">
                  {p.cta}
                </td>
                <td className="p-3 font-mono text-meta tabular-nums">
                  {p.gaps.length > 0 ? (
                    <span className="text-warning">{p.gaps.length}</span>
                  ) : (
                    <span className="text-success">0</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
