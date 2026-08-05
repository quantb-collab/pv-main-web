import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";
import { Highlight } from "@/components/pv/highlight";
import { cn } from "@/lib/utils";

/**
 * ============================================================================
 * KHUNG SECTION CHUẨN
 * ----------------------------------------------------------------------------
 * Mọi section trên site dùng component này. Nó giữ ba thứ đồng nhất:
 *   - nhịp dọc (pv-section)
 *   - bề ngang và lề (pv-container)
 *   - cơ chế nền sáng/tối (tone)
 *
 * Nhịp sáng/tối: thân bài nền sáng để dễ đọc; hero, dải CTA và các điểm neo
 * dùng nền tối để tạo nhịp thị giác. Không tự bôi màu nền cho section.
 * ============================================================================
 */

type Tone = "default" | "surface" | "dark";

const TONE: Record<Tone, string> = {
  default: "bg-background text-foreground",
  surface: "bg-surface text-foreground",
  dark: "tone-dark",
};

interface SectionProps {
  children: ReactNode;
  /** Dùng cho anchor và mục lục. */
  id?: string;
  tone?: Tone;
  /** Bỏ padding dọc mặc định (hero tự quản chiều cao). */
  flush?: boolean;
  /** Bỏ container (khi cần tràn viền màn hình). */
  bleed?: boolean;
  className?: string;
  containerClassName?: string;
}

export function Section({
  children,
  id,
  tone = "default",
  flush = false,
  bleed = false,
  className,
  containerClassName,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative isolate",
        TONE[tone],
        !flush && "pv-section",
        className,
      )}
    >
      {bleed ? children : <div className={cn("pv-container", containerClassName)}>{children}</div>}
    </section>
  );
}

interface SectionHeaderProps {
  /** Nhãn ngắn phía trên tiêu đề. Nói chủ đề, không nói khẩu hiệu. */
  eyebrow?: string;
  title: ReactNode;
  /** Câu dẫn. Một đoạn, nói lợi ích, không nói tính năng. */
  lead?: ReactNode;
  align?: "left" | "center";
  /** Thẻ tiêu đề. Mỗi trang chỉ có một h1. */
  as?: "h1" | "h2" | "h3";
  className?: string;
  children?: ReactNode;
}

export function SectionHeader({
  eyebrow,
  title,
  lead,
  align = "left",
  as: Tag = "h2",
  className,
  children,
}: SectionHeaderProps) {
  /* Một vai trò cho mỗi cấp tiêu đề. Cỡ, line-height và tracking đã nằm trong
     token nên ở đây không còn bậc breakpoint nào để quên đồng bộ. */
  const size =
    Tag === "h1"
      ? "text-display"
      : Tag === "h2"
        ? "text-headline"
        : "text-subhead";

  return (
    <Reveal
      className={cn(
        "flex max-w-3xl flex-col gap-4 md:gap-5",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <span className="font-mono text-eyebrow font-medium text-subtle-foreground uppercase">
          {eyebrow}
        </span>
      ) : null}

      <Tag className={cn("font-display font-semibold", size)}>
        <Highlight>{title}</Highlight>
      </Tag>

      {/* 58ch, không phải max-w-3xl: ở cỡ lead 21px thì 3xl thành ~73 ký tự
          một dòng, quá dài để mắt bắt được đầu dòng kế tiếp. */}
      {lead ? (
        <p className="max-w-[58ch] text-lead text-muted-foreground text-pretty">
          <Highlight>{lead}</Highlight>
        </p>
      ) : null}

      {children}
    </Reveal>
  );
}
