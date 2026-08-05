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
  const size =
    Tag === "h1"
      ? "text-4xl sm:text-5xl lg:text-6xl"
      : Tag === "h2"
        ? "text-3xl sm:text-4xl lg:text-[2.75rem]"
        : "text-2xl sm:text-3xl";

  return (
    <Reveal
      className={cn(
        "flex max-w-3xl flex-col gap-4",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <span className="font-mono text-[11px] tracking-[0.18em] text-subtle-foreground uppercase">
          {eyebrow}
        </span>
      ) : null}

      <Tag className={cn("font-semibold leading-[1.08]", size)}>
        <Highlight>{title}</Highlight>
      </Tag>

      {lead ? (
        <p className="text-lg leading-relaxed text-muted-foreground text-pretty">
          <Highlight>{lead}</Highlight>
        </p>
      ) : null}

      {children}
    </Reveal>
  );
}
