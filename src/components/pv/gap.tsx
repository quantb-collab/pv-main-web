import { cn } from "@/lib/utils";

/**
 * ============================================================================
 * HỆ PLACEHOLDER — §24 blueprint
 * ----------------------------------------------------------------------------
 * Nội dung chưa đủ dữ liệu thì để ô chờ, KHÔNG lấp bằng văn marketing chung
 * hay số liệu tự nghĩ ra. Ô chờ cố ý nổi bật để không ai quên nó.
 *
 * Mọi ô chờ mang thuộc tính data-gap → QA đếm được bằng một câu:
 *   document.querySelectorAll("[data-gap]").length
 * Điều kiện phát hành: con số này bằng 0 trên các trang đã chốt.
 * ============================================================================
 */

const KIND = {
  /** Thiếu quyết định từ phía Pebble Vina */
  confirm: {
    label: "Cần Pebble Vina xác nhận",
    tone: "border-warning/40 bg-warning/10 text-warning",
  },
  /** Thiếu bằng chứng: case study, số liệu, datasheet, hồ sơ */
  proof: {
    label: "Cần bổ sung bằng chứng",
    tone: "border-warning/40 bg-warning/10 text-warning",
  },
  /** Có dữ liệu nhưng chưa được phép công bố */
  restricted: {
    label: "Chưa được phép công khai",
    tone: "border-muted-foreground/30 bg-muted text-muted-foreground",
  },
  /** Cần pháp chế soạn hoặc duyệt */
  legal: {
    label: "Cần pháp chế duyệt",
    tone: "border-muted-foreground/30 bg-muted text-muted-foreground",
  },
} as const;

export type GapKind = keyof typeof KIND;

interface GapProps {
  kind?: GapKind;
  /** Mô tả chính xác thứ còn thiếu. Viết như một yêu cầu giao việc. */
  children: React.ReactNode;
  className?: string;
}

/** Ô chờ dạng khối — dùng thay cho cả một cụm nội dung. */
export function Gap({ kind = "confirm", children, className }: GapProps) {
  const { label, tone } = KIND[kind];
  return (
    <div
      data-gap={kind}
      className={cn(
        "rounded-lg border border-dashed p-4 text-sm leading-relaxed",
        tone,
        className,
      )}
    >
      <span className="mb-1.5 block font-mono text-[10px] tracking-widest uppercase opacity-80">
        {label}
      </span>
      <span className="text-foreground/80">{children}</span>
    </div>
  );
}

/** Ô chờ dạng chip — chèn giữa dòng, dùng cho một con số hay một tên riêng. */
export function GapChip({ kind = "confirm", children, className }: GapProps) {
  const { tone } = KIND[kind];
  return (
    <span
      data-gap={kind}
      className={cn(
        "inline-flex items-center rounded border border-dashed px-1.5 py-0.5 font-mono text-[11px] align-middle",
        tone,
        className,
      )}
    >
      {children}
    </span>
  );
}
