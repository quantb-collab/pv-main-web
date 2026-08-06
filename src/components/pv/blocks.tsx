import type { ReactNode } from "react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Highlight } from "@/components/pv/highlight";
import { cn } from "@/lib/utils";

/**
 * ============================================================================
 * BLOCK DÙNG CHUNG
 * ----------------------------------------------------------------------------
 * Trang được GHÉP từ những block này, không tự chế layout riêng.
 * Cần biến thể mới → thêm prop cho block sẵn có, đừng tạo block mới cho một trang.
 *
 * Vì sao: mười trang tự dựng lưới riêng sẽ thành mười thứ tiếng nói khác nhau.
 * ============================================================================
 */

/* -------------------------------------------------------------------------- */
/* Lưới thẻ                                                                    */
/* -------------------------------------------------------------------------- */

const COLS = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

export function CardGrid({
  children,
  cols = 3,
  className,
}: {
  children: ReactNode;
  cols?: keyof typeof COLS;
  className?: string;
}) {
  return (
    <RevealGroup className={cn("grid gap-px bg-border", COLS[cols], className)}>
      {children}
    </RevealGroup>
  );
}

/**
 * Thẻ nội dung cơ bản. Nền bằng nền trang, cách nhau bằng đường 1px —
 * hệ này dùng viền tóc thay đổ bóng.
 */
export function Card({
  index,
  title,
  children,
  className,
}: {
  /** Số thứ tự hiển thị mờ ở góc. Bỏ trống nếu thứ tự không có ý nghĩa. */
  index?: number;
  title: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <RevealItem
      className={cn(
        "group relative flex flex-col gap-3 bg-background p-6 transition-colors duration-300 hover:bg-surface lg:p-8",
        className,
      )}
    >
      {index !== undefined ? (
        <span className="font-mono text-micro font-medium text-subtle-foreground tabular-nums">
          {String(index).padStart(2, "0")}
        </span>
      ) : null}
      <h3 className="font-display text-title font-semibold">
        <Highlight>{title}</Highlight>
      </h3>
      {/* body-sm chứ không phải body: thẻ nằm trong lưới 3–4 cột, ở cỡ thân
          bài đầy đủ mỗi dòng chỉ còn khoảng 30 ký tự và đọc thành ngắt quãng. */}
      {children ? (
        <p className="text-body-sm text-muted-foreground">
          <Highlight>{children}</Highlight>
        </p>
      ) : null}
    </RevealItem>
  );
}

/* -------------------------------------------------------------------------- */
/* Danh sách khẳng định — dùng cho nguyên tắc, lợi ích, tiêu chí               */
/* -------------------------------------------------------------------------- */

export function StatementList({
  items,
  className,
}: {
  items: ReactNode[];
  className?: string;
}) {
  return (
    <RevealGroup className={cn("flex flex-col", className)}>
      {items.map((item, i) => (
        <RevealItem
          key={i}
          className="flex items-start gap-4 border-b py-4 last:border-b-0"
        >
          {/* Lề trên tính bằng em để chấm luôn nằm giữa dòng đầu, kể cả khi
              cỡ thân bài co giãn theo khổ màn hình. */}
          <span className="mt-[0.65em] size-1.5 shrink-0 rounded-full bg-brand" />
          <span className="max-w-[68ch] text-body">
            <Highlight>{item}</Highlight>
          </span>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

/* -------------------------------------------------------------------------- */
/* Danh sách định nghĩa — các vế nối tiếp một câu tuyên bố                     */
/* -------------------------------------------------------------------------- */

/**
 * Mỗi hàng là một nhãn mono ngắn và một vế nội dung cỡ lead — dùng khi vài
 * dòng dữ kiện phải đọc như phần tiếp của tiêu đề đứng trên, nên chữ to hơn
 * thân bài, không chấm đầu dòng, không hộp viền, không vạch phân cách (chủ
 * dự án đã bỏ divider 2026-08-06); các hàng tách nhau bằng khoảng trống.
 * Thứ tự hàng là thứ tự kể chuyện — người gọi quyết, block không sắp lại.
 */
export function DefinitionList({
  items,
  className,
}: {
  items: { label: ReactNode; text: ReactNode }[];
  className?: string;
}) {
  return (
    <RevealGroup className={cn("flex flex-col gap-8 sm:gap-10", className)}>
      {items.map((item, i) => (
        <RevealItem
          key={i}
          className="grid grid-cols-1 items-baseline gap-2 sm:grid-cols-[9rem_1fr] sm:gap-8"
        >
          <span className="font-mono text-eyebrow font-medium text-subtle-foreground uppercase">
            {item.label}
          </span>
          <p className="max-w-[58ch] text-lead text-pretty">
            <Highlight>{item.text}</Highlight>
          </p>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

/* -------------------------------------------------------------------------- */
/* Chip — nhóm từ khoá ngắn                                                    */
/* -------------------------------------------------------------------------- */

export function PillRow({
  items,
  className,
}: {
  items: ReactNode[];
  className?: string;
}) {
  return (
    <RevealGroup className={cn("flex flex-wrap gap-2.5", className)} stagger={0.04}>
      {items.map((item, i) => (
        <RevealItem
          key={i}
          className="rounded-control border px-3.5 py-2 text-ui font-medium transition-colors duration-(--dur-fast) hover:border-brand hover:text-brand"
        >
          {item}
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

/* -------------------------------------------------------------------------- */
/* Đường ray các bước — dùng cho quy trình và lộ trình                         */
/* -------------------------------------------------------------------------- */

export interface RailStep {
  title: string;
  body?: ReactNode;
  /** Các cặp nhãn/giá trị hiển thị dưới phần mô tả. */
  meta?: { label: string; value: ReactNode }[];
}

export function StepRail({
  steps,
  className,
}: {
  steps: RailStep[];
  className?: string;
}) {
  return (
    <RevealGroup className={cn("relative", className)} stagger={0.09}>
      {/* đường dọc nối các bước */}
      <span
        aria-hidden
        className="absolute top-2 bottom-2 left-[15px] w-px bg-border md:left-[19px]"
      />
      <ol className="flex flex-col">
        {steps.map((step, i) => (
          <RevealItem key={i} as="li" className="relative flex gap-5 pb-10 last:pb-0 md:gap-7">
            <span className="relative z-10 mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border bg-background font-mono text-micro font-medium tabular-nums md:size-10 md:text-ui">
              {i + 1}
            </span>
            <div className="flex flex-col gap-2 pt-1">
              <h3 className="font-display text-title font-semibold">
                {step.title}
              </h3>
              {step.body ? (
                <p className="max-w-[62ch] text-body text-muted-foreground">
                  {step.body}
                </p>
              ) : null}
              {step.meta?.length ? (
                <dl className="mt-2 grid gap-x-8 gap-y-2 sm:grid-cols-2">
                  {step.meta.map((m) => (
                    <div key={m.label} className="flex flex-col gap-0.5">
                      <dt className="font-mono text-eyebrow font-medium text-subtle-foreground uppercase">
                        {m.label}
                      </dt>
                      <dd className="text-body-sm text-muted-foreground">
                        {m.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>
          </RevealItem>
        ))}
      </ol>
    </RevealGroup>
  );
}

/* -------------------------------------------------------------------------- */
/* Chồng tầng — sơ đồ năng lực full-stack                                      */
/* -------------------------------------------------------------------------- */

export function LayerStack({
  layers,
  className,
}: {
  layers: string[];
  className?: string;
}) {
  return (
    <RevealGroup className={cn("flex flex-col gap-2", className)} stagger={0.08}>
      {layers.map((layer, i) => (
        <RevealItem
          key={layer}
          direction="right"
          className="relative flex items-center gap-4 overflow-hidden rounded-lg border px-5 py-4 transition-colors duration-500 hover:border-brand"
          style={{
            // tầng dưới lùi vào, tạo cảm giác chồng lớp
            marginInlineStart: `${i * 6}px`,
          }}
        >
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 w-1 bg-brand"
            style={{ opacity: 1 - i * 0.15 }}
          />
          <span className="font-mono text-micro font-medium text-subtle-foreground tabular-nums">
            L{i + 1}
          </span>
          <span className="font-display text-title font-semibold">{layer}</span>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

/* -------------------------------------------------------------------------- */
/* Bảng so sánh trước / sau                                                    */
/* -------------------------------------------------------------------------- */

export function BeforeAfter({
  beforeTitle,
  afterTitle,
  before,
  after,
  className,
}: {
  beforeTitle: string;
  afterTitle: string;
  before: ReactNode[];
  after: ReactNode[];
  className?: string;
}) {
  return (
    <div className={cn("grid gap-px overflow-hidden rounded-xl border bg-border md:grid-cols-2", className)}>
      <Reveal direction="right" className="bg-background p-6 lg:p-8">
        <h3 className="font-mono text-eyebrow font-medium text-subtle-foreground uppercase">
          {beforeTitle}
        </h3>
        <ul className="mt-5 flex flex-col gap-3">
          {before.map((b, i) => (
            <li key={i} className="text-body text-muted-foreground">
              {b}
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal direction="left" className="bg-surface p-6 lg:p-8">
        <h3 className="font-mono text-eyebrow font-medium text-brand uppercase">
          {afterTitle}
        </h3>
        <ul className="mt-5 flex flex-col gap-3">
          {after.map((a, i) => (
            <li key={i} className="text-body">
              {a}
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}
