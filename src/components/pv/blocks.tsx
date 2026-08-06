import type { ReactNode } from "react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { GapChip } from "@/components/pv/gap";
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

/* -------------------------------------------------------------------------- */
/* Bento chỉ số — lưới ô lệch cỡ cho các con số đo                             */
/* -------------------------------------------------------------------------- */

/**
 * Lưới bento cho MỘT bộ chỉ số + các ô tư liệu đi kèm (tuyên ngôn, ảnh khi
 * có thật) — "đa tầng kiến thức": số, chữ, hình chung một khối. Sơ đồ do
 * span của từng ô quyết định; bản trang chủ lấp kín 4×3, note là ô trần
 * cuối lưới:
 *
 *   lg — 4 cột                    md — 2 cột        375 — 1 cột
 *   ┌───────┬───────────┐         hero              (xếp dọc theo
 *   │       │ statement │         statement          thứ tự DOM)
 *   │ hero  ├───────────┤         wide
 *   │       │   wide    │         stat · stat
 *   ├───┬───┼───────────┤         note
 *   │st │st │   note    │
 *   └───┴───┴───────────┘
 *
 * Cả khối phải nằm GỌN dưới một màn hình cùng tiêu đề section — thêm ô là
 * phải bớt ô khác, không nống thêm hàng. Ô ảnh (khi có ảnh THẬT) đi thẳng
 * bằng `MediaFrame` + class span; ô chữ tự do đi qua `BentoTile`.
 */
export function BentoGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <RevealGroup
      className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-4", className)}
    >
      {children}
    </RevealGroup>
  );
}

/**
 * Ô tự do trong BentoGrid cho nội dung KHÔNG phải chỉ số — tuyên ngôn, đoạn
 * dẫn, nhóm chip. Chrome lấy đúng hai nấc giữa/thấp của StatTile để lưới vẫn
 * đọc ra một hệ; nội dung căn giữa theo trục dọc vì ô chữ đứng cạnh ô số
 * cao hơn nó.
 */
export function BentoTile({
  span = "1x1",
  chrome = "mid",
  children,
  className,
}: {
  span?: "1x1" | "2x1";
  chrome?: "mid" | "low";
  children: ReactNode;
  className?: string;
}) {
  return (
    <RevealItem
      className={cn(
        "relative isolate flex flex-col justify-center rounded-xl p-6 lg:p-7",
        span === "2x1" && "md:col-span-2",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 rounded-[inherit] bg-surface bg-linear-to-t via-transparent to-transparent",
          chrome === "mid" ? "from-brand/10" : "from-brand/5",
        )}
      />
      <span
        aria-hidden
        className={cn(
          "pv-edge bg-linear-to-t",
          chrome === "mid"
            ? "from-brand/45 via-brand/15 to-border"
            : "from-brand/20 to-border",
        )}
      />
      {children}
    </RevealItem>
  );
}

/** Bốn nấc của một ô bento. Bảng đặc tả ở docstring của `StatTile`. */
export type StatTier = "hero" | "wide" | "stat" | "note";

/**
 * Đặc tả một nấc: chỗ trong lưới, hình hộp, và bậc cỡ của ba tầng chữ.
 * Gom vào một bảng để đọc dọc theo cột là thấy ngay thang có đủ bậc chưa.
 */
const TIER: Record<
  Exclude<StatTier, "note">,
  { box: string; stack: string; tag: string; value: string; label: string }
> = {
  hero: {
    box: "rounded-2xl p-6 md:col-span-2 lg:row-span-2 lg:p-8",
    stack: "gap-4",
    tag: "text-brand",
    value: "text-display",
    label: "max-w-[26ch] text-lead",
  },
  wide: {
    box: "rounded-xl p-6 md:col-span-2 lg:p-7",
    stack: "gap-3",
    tag: "text-foreground",
    value: "text-headline",
    label: "max-w-[36ch] text-body",
  },
  stat: {
    box: "rounded-xl p-5 lg:p-6",
    stack: "gap-2.5",
    tag: "text-subtle-foreground",
    value: "text-subhead",
    label: "text-body-sm text-muted-foreground",
  },
};

/**
 * Một ô trong BentoGrid.
 *
 * MỘT prop `tier` điều khiển CẢ BA trục cùng lúc — chỗ trong lưới, số lớp thị
 * giác, bậc cỡ chữ. Cố ý không tách thành ba prop: tách ra là mở đường cho ô
 * to mà nhạt hoặc ô nhỏ mà chói, và lúc đó lưới hết cấp bậc.
 *
 *          span (lg)  lớp thị giác                                value     label
 *   hero   2×2        quầng thở → mặt brand-soft + ánh dâng → viền  display   lead
 *   wide   2×1        mặt surface + ánh dâng → viền nửa sáng        headline  body
 *   stat   1×1        mặt surface → viền mờ                         subhead   body-sm
 *   note   4×1        không mặt, chỉ một vạch trên                  —         body-sm
 *
 * Hai thang chạy CÙNG chiều — ô to hơn thì cũng nhiều lớp hơn và chữ to hơn —
 * nên liếc một cái là ra thứ tự đọc, không phải đọc chữ mới biết cái nào chính.
 * Bộ lớp và thứ tự dựng lấy nguyên của `StageMatrix` (quầng -z-20 → mặt -z-10
 * → nội dung → vòng `pv-edge`) để bento và ma trận đứng liền nhau vẫn đọc ra
 * là một hệ. Góc vuốt `tr-[2.25rem]` thì không lấy — đó là chữ ký riêng của
 * panel ma trận.
 *
 * Tag mono giữ NGUYÊN một cỡ (`text-eyebrow`) ở cả ba nấc số, chỉ đổi màu: nó
 * là hằng số của lưới, nhờ vậy mắt nối được ô số với đúng hàng của ma trận
 * đứng trên. `note` không ứng với hàng nào nên tag của nó tụt về `text-micro`
 * — lệch cỡ chính là cách nói "cái này không nằm trong bộ bốn".
 *
 * Ba trạng thái của phần số, suy từ prop:
 *   - `value` có thật  → con số lớn. Chữ số PROPORTIONAL, không tabular-nums:
 *     số đứng một mình mà ép mono-width thì chữ số 1 bị hở hai bên.
 *   - chưa có `value` nhưng có `gap` → vạch dài giữ chỗ + GapChip proof.
 *     Layout là bản chốt: có số xác minh chỉ việc điền `value`, khung không
 *     đổi. KHÔNG điền số khi chưa có case study kèm điều kiện đo.
 *   - không `value` không `gap` → chỉ còn tag và câu chữ (dùng cho `note`).
 */
export function StatTile({
  tag,
  value,
  label,
  gap,
  placeholder = false,
  tier = "stat",
  className,
}: {
  tag?: string;
  /** Con số đã xác minh — hoặc số minh hoạ nếu kèm `placeholder`. */
  value?: ReactNode;
  label: ReactNode;
  /** Nội dung GapChip khi chưa có số — nêu rõ số sẽ lấy từ đâu. */
  gap?: ReactNode;
  /**
   * `value` là SỐ MINH HOẠ, chưa xác minh (quyết định chủ dự án 2026-08-06:
   * mặt khách xem sạch cảnh báo). Cắm data-gap="proof" VÔ HÌNH lên con số —
   * không đổi hình thức, nhưng QA và /track vẫn đếm nó là khoảng trống, nên
   * release gate vẫn chặn nếu quên thay số thật. Đi kèm bắt buộc: một ô
   * `note` trong cùng lưới nói rõ "số liệu minh hoạ".
   */
  placeholder?: boolean;
  tier?: StatTier;
  className?: string;
}) {
  /* Nấc trần nhất: không mặt, không viền vòng, chỉ một vạch ngăn với lưới số
     bên trên. Nhịp nhãn-trái / chữ-phải mượn của `DefinitionList` để dòng chú
     thích này đọc ra là cùng một giọng với phần dữ kiện ở các section khác. */
  if (tier === "note") {
    /* Ô trần: không mặt, không viền — một chú thích lặng đứng trong lưới.
       Nó là nơi khai báo tình trạng số liệu (minh hoạ / đã xác minh), nên
       không được mang bất kỳ chrome cảnh báo nào: cảnh báo cho NGƯỜI LÀM
       nằm ở data-gap (QA đếm), không nằm trên mặt khách xem. */
    return (
      <RevealItem
        className={cn(
          "flex flex-col justify-center gap-2 p-5 md:col-span-2 lg:col-span-2 lg:p-6",
          className,
        )}
      >
        {tag ? (
          <span className="font-mono text-micro font-medium text-subtle-foreground uppercase">
            {tag}
          </span>
        ) : null}
        <p className="max-w-[46ch] text-body-sm text-muted-foreground">
          <Highlight>{label}</Highlight>
        </p>
      </RevealItem>
    );
  }

  const t = TIER[tier];
  const hero = tier === "hero";

  return (
    <RevealItem className={cn("relative isolate flex flex-col", t.box, className)}>
      {/* Quầng bình minh sau lưng — chỉ nấc cao nhất được, và nó là thứ duy
          nhất trong lưới có ánh sáng RIÊNG. Nở dọc nhiều hơn ngang để không
          chạm vai ô bên cạnh; nhịp thở tái dùng keyframe của hero, người bật
          giảm chuyển động thì @media trong globals.css tắt ngay. */}
      {hero ? (
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-x-3 -inset-y-4 -z-20 animate-dawn-pulse rounded-3xl bg-linear-to-t from-brand/35 via-brand/12 to-transparent blur-2xl"
        />
      ) : null}

      {/* Mặt panel. Cả ba nấc đều có ánh dâng từ đáy, cùng chiều với
          `pv-skyglow` của section — khác nhau ở cường độ, không ở kiểu. */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 rounded-[inherit] bg-linear-to-t via-transparent to-transparent",
          hero && "bg-brand-soft from-brand/22",
          tier === "wide" && "bg-surface from-brand/10",
          tier === "stat" && "bg-surface from-brand/5",
        )}
      />

      {/* Vòng viền gradient, đậm dần theo nấc: brand trọn vòng → nửa sáng →
          gần như hairline. Đây là nét mảnh nhất nhưng cũng là thứ đọc ra cấp
          bậc nhanh nhất khi liếc qua cả lưới. */}
      <span
        aria-hidden
        className={cn(
          "pv-edge bg-linear-to-t",
          hero && "from-brand via-brand/45 to-brand/25",
          tier === "wide" && "from-brand/45 via-brand/15 to-border",
          tier === "stat" && "from-brand/20 to-border",
        )}
      />

      {tag ? (
        <span
          className={cn(
            "font-mono text-eyebrow font-medium uppercase",
            t.tag,
          )}
        >
          {tag}
        </span>
      ) : null}

      {/* Nấc hero đẩy cả cụm số xuống ĐÁY ô: ánh sáng dâng từ dưới lên, nên
          con số đặt ngay trên chân trời chứ không treo giữa khoảng trống.
          Hai nấc kia kéo dài hết ô (`flex-1`) để chip chờ của các ô cùng hàng
          bám chung một đường đáy dù nhãn dài ngắn khác nhau. */}
      <div
        className={cn(
          "flex flex-col",
          t.stack,
          /* hero: `mt-auto` KHÔNG kèm `flex-1` — cụm số bị đẩy trọn xuống đáy
             và đọc ra là MỘT khối. Cho `flex-1` vào thì `mt-auto` của chip lại
             ăn hết chỗ trống, chip tụt xuống đáy còn vạch với nhãn ở lại giữa
             — đúng cái lỗ giữa ô của bản trước. */
          hero ? "mt-auto pt-6 lg:pt-8" : "flex-1",
        )}
      >
        {value != null ? (
          <span
            {...(placeholder ? { "data-gap": "proof" } : {})}
            className={cn("font-display font-semibold", t.value)}
          >
            {value}
          </span>
        ) : gap ? (
          /* Vạch chờ được VẼ, không dùng ký tự "—". Em-dash chỉ dày 0.05em
             nhưng vẫn chiếm trọn hộp dòng cỡ display, nên ở nấc hero nó thành
             một nét con con lạc giữa 78px khoảng trắng — chính chỗ trông
             "thủng" của bản trước. Vạch vẽ dài 1.1em, `align-middle` nên nằm
             đúng chỗ em-dash sẽ nằm; và vì nó là inline-block trong một span
             vẫn mang vai trò cỡ của nấc, hộp dòng KHÔNG đổi — điền `value`
             thật vào thì khung giữ nguyên từng pixel. */
          <span
            aria-hidden
            className={cn(
              "font-display font-semibold",
              t.value,
              hero ? "text-brand/70" : "text-subtle-foreground",
            )}
          >
            <span className="inline-block h-[0.055em] w-[1.1em] rounded-full bg-current align-middle" />
          </span>
        ) : null}

        <p className={t.label}>
          <Highlight>{label}</Highlight>
        </p>

        {value == null && gap ? (
          <GapChip kind="proof" className="mt-auto self-start">
            {gap}
          </GapChip>
        ) : null}
      </div>
    </RevealItem>
  );
}

/* -------------------------------------------------------------------------- */
/* Ma trận nấc tiến hoá — các cột là các nấc, các hàng là cùng một việc        */
/* -------------------------------------------------------------------------- */

export interface MatrixStage {
  /** Tên nấc, hiện ở đầu cột. */
  label: string;
  /** Một ô mỗi hàng. Các nấc phải có cùng số ô, cùng thứ tự hàng. */
  items: ReactNode[];
}

/**
 * Thang sáng của site đặt NẰM NGANG, mức nhấn suy ra từ VỊ TRÍ cột — tăng
 * tiến là ngữ nghĩa của block, không cấu hình được, cũng như nấc sky chỉ
 * được đi lên. Sáu thứ cùng leo một lượt, để liếc qua là thấy cấp bậc:
 *
 *            nấc đầu            nấc giữa           nấc cuối
 *   nền      không có gì        surface            brand-soft + ánh dâng
 *   viền     hairline xám       gradient nửa sáng  gradient brand trọn vòng
 *   sáng     —                  —                  quầng brand thở sau lưng
 *   hình     rounded-xl         rounded-xl         2xl + một góc vuốt rộng
 *   cỡ       1                  1                  1.10 (chỉ từ lg)
 *   lớp      —                  —                  z-10, nằm trên hai nấc kia
 *
 * Nấc đầu CỐ Ý không có nền riêng: lớp hạt và quầng sáng của section chạy
 * thẳng qua nó. "Chưa ai chạm vào" thì không nên có bề mặt.
 *
 * BA LỚP PHỦ, không lớp nào là ô trong lưới (`absolute` → ngoài dòng, nên
 * subgrid không mất track nào):
 *   quầng (-z-20) → mặt panel (-z-10) → nội dung → vòng viền `pv-edge`.
 * Vì mặt panel nằm ở lớp phủ chứ không phải nền của các ô, các ô con KHÔNG
 * được mang nền: ô con có góc vuông, đặt nền lên nó thì góc bo của panel bị
 * ăn mất. Cũng vì vậy panel không cần `overflow-hidden` — và không có nó thì
 * quầng sáng mới toả ra ngoài được.
 *
 * Hàng giữa các panel thẳng nhau bằng subgrid: các panel rời nhau nhưng
 * chia chung track hàng của lưới cha, và không panel nào có padding/border
 * riêng để làm lệch track đầu–cuối. Nấc cuối phóng 1.10 quanh tâm nên hàng của
 * nó lệch dần ra hai đầu (tối đa ~30px ở mép trên và mép dưới, 0 ở giữa) —
 * đổi lấy hiệu ứng "nổi lên", chủ dự án đã chọn (2026-08-06).
 * Nhãn hàng (`rows`) đứng MỘT lần ở rail trái trên desktop; dưới lg rail ẩn
 * đi và nhãn hiện lại trong từng ô để panel xếp dọc vẫn tự đọc được.
 */
export function StageMatrix({
  stages,
  rows,
  className,
}: {
  stages: MatrixStage[];
  /** Nhãn hàng ngắn (1–2 chữ). */
  rows?: string[];
  className?: string;
}) {
  const last = stages.length - 1;
  const rowCount = Math.max(...stages.map((s) => s.items.length));
  const span = { gridRow: `span ${rowCount + 1}` };

  return (
    <RevealGroup
      className={cn(
        /* Rãnh ngang rộng hơn từ lg: nấc cuối phóng 110% và mang quầng sáng,
           mỗi bên nở thêm ~13px — thiếu chỗ thì nó chạm vai panel bên cạnh. */
        "grid gap-x-5 gap-y-5 lg:gap-x-8 lg:gap-y-0",
        stages.length === 2
          ? rows
            ? "lg:grid-cols-[auto_1fr_1fr]"
            : "lg:grid-cols-2"
          : rows
            ? "lg:grid-cols-[auto_1fr_1fr_1fr]"
            : "lg:grid-cols-3",
        className,
      )}
      // Khai track hàng tường minh để subgrid của rail và các panel có chỗ bám.
      style={{ gridTemplateRows: `repeat(${rowCount + 1}, auto)` }}
    >
      {rows ? (
        <div className="hidden lg:grid lg:grid-rows-subgrid" style={span}>
          {/* ô rỗng chiếm hàng tiêu đề cột */}
          <div />
          {rows.map((label) => (
            <div key={label} className="flex items-start justify-end py-5 lg:py-6">
              <span className="font-mono text-eyebrow font-medium text-subtle-foreground uppercase">
                {label}
              </span>
            </div>
          ))}
        </div>
      ) : null}
      {stages.map((stage, s) => {
        const dim = s === 0;
        const high = s === last;
        const mid = !dim && !high;
        return (
          <RevealItem
            key={s}
            className={cn(
              "relative isolate rounded-xl lg:grid lg:grid-rows-subgrid",
              /* Góc vuốt rộng ở phía trên–ngoài: cùng một đường cong với cung
                 chân trời của site, đặt đúng chỗ mạch đọc đi ra khỏi bảng.
                 Chỉ nấc cuối được phép — hai nấc kia giữ hộp vuông vức. */
              high &&
                "rounded-2xl rounded-tr-[2.25rem] lg:z-10 lg:origin-center lg:scale-110",
            )}
            style={span}
          >
            {/* Quầng bình minh sau lưng panel — panel nổi bằng ÁNH SÁNG chứ
                không bằng bóng đen, đúng chất đêm rạng dần. Đậm ở đáy nhạt ở
                đỉnh, cùng chiều với `pv-skyglow` của section. Nở theo chiều
                DỌC nhiều hơn chiều ngang: bề ngang còn phải chừa chỗ cho panel
                bên cạnh và cho mép container ở khổ 1024–1344. Nhịp thở tái
                dùng keyframe của hero; người bật giảm chuyển động thì @media
                trong globals.css tắt nó ngay. */}
            {high ? (
              <span
                aria-hidden
                className="pointer-events-none absolute -inset-x-2 -inset-y-5 -z-20 animate-dawn-pulse rounded-3xl bg-linear-to-t from-brand/35 via-brand/20 to-brand/5 blur-2xl lg:-inset-x-3 lg:-inset-y-8 lg:rounded-[2.5rem]"
              />
            ) : null}

            {/* Mặt panel. Nấc cuối có thêm ánh dâng từ đáy — cùng hướng sáng
                với `pv-skyglow` của section. */}
            <span
              aria-hidden
              className={cn(
                "pointer-events-none absolute inset-0 -z-10 rounded-[inherit]",
                dim && "border",
                mid && "bg-surface",
                high &&
                  "bg-brand-soft bg-linear-to-t from-brand/15 via-transparent to-transparent",
              )}
            />

            {/* Vòng viền gradient. Nấc đầu không có — nó chỉ là một nét
                hairline, và đó chính là khác biệt phải thấy ngay. */}
            {dim ? null : (
              <span
                aria-hidden
                className={cn(
                  "pv-edge bg-linear-to-t",
                  mid && "from-brand/45 via-brand/15 to-border",
                  high && "from-brand via-brand/45 to-brand/25",
                )}
              />
            )}

            <div className="flex items-baseline gap-3 p-5 lg:p-6">
              <span
                className={cn(
                  "font-mono text-micro font-medium tabular-nums",
                  dim ? "text-subtle-foreground" : "text-brand",
                )}
              >
                {String(s + 1).padStart(2, "0")}
              </span>
              <h3
                className={cn(
                  "font-mono text-eyebrow font-medium uppercase",
                  dim && "text-subtle-foreground",
                  mid && "text-foreground",
                  high && "text-brand",
                )}
              >
                {stage.label}
              </h3>
            </div>
            {stage.items.map((item, r) => (
              <div
                key={r}
                className={cn(
                  "flex flex-col gap-1.5 border-t p-5 lg:p-6",
                  high && "border-brand/15",
                )}
              >
                {rows?.[r] ? (
                  <span
                    className={cn(
                      "font-mono text-micro font-medium uppercase lg:hidden",
                      high ? "text-brand" : "text-subtle-foreground",
                    )}
                  >
                    {rows[r]}
                  </span>
                ) : null}
                <p className={cn("text-body-sm", dim && "text-muted-foreground")}>
                  <Highlight>{item}</Highlight>
                </p>
              </div>
            ))}
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}
