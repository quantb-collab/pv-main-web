import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";
import { HorizonArc } from "@/components/pv/decor";
import { Highlight } from "@/components/pv/highlight";
import { cn } from "@/lib/utils";

/**
 * ============================================================================
 * KHUNG SECTION CHUẨN
 * ----------------------------------------------------------------------------
 * Mọi section trên site dùng component này. Nó giữ bốn thứ đồng nhất:
 *   - chiều cao (một màn hình, nội dung căn giữa)
 *   - nhịp dọc (pv-section)
 *   - bề ngang và lề (pv-container)
 *   - nấc trời (sky) và ranh giới giữa hai section
 *
 * CHIỀU CAO. Mặc định mỗi section chiếm trọn một viewport và nội dung nằm
 * giữa. `min-h-dvh` chứ không phải `h-dvh`: nội dung dài hơn thì section cao
 * lên, không cắt. Cái được là không còn section nào lửng lơ giữa màn hình,
 * và mắt luôn có đủ chỗ trống quanh khối chữ. Cái mất là trang dài hơn — nên
 * luật mật độ trong skill `pv-ui` càng phải giữ: một section, một ý.
 *
 * NẤC TRỜI. `sky` chọn một nấc trong thang đêm → bình minh (globals.css LỚP 2).
 * Nấc chỉ đi lên trong một trang. Ranh giới giữa hai section không phải là
 * chênh lệch màu nền — nó là vạch chân trời + quầng sáng do chính component
 * này vẽ, nên không section nào phải tự lo phần đó.
 * ============================================================================
 */

/** Năm khoảnh khắc của một đêm. Bảng đầy đủ: docs/DESIGN-TOKENS.md § Thang sky. */
export type Sky = "void" | "night" | "deep" | "rise" | "dawn";

const SKY: Record<Sky, string> = {
  void: "sky-void",
  night: "sky-night",
  deep: "sky-deep",
  rise: "sky-rise",
  dawn: "sky-dawn",
};

interface SectionProps {
  children: ReactNode;
  /** Dùng cho anchor và mục lục. */
  id?: string;
  sky?: Sky;
  /**
   * Bỏ ràng buộc cao một màn hình. Chỉ dùng cho trang công cụ nội bộ và các
   * khối phụ — trang bán hàng thì để nguyên mặc định.
   */
  full?: boolean;
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
  sky = "night",
  full = true,
  flush = false,
  bleed = false,
  className,
  containerClassName,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        /* Không đặt overflow-hidden ở đây: hai lớp nền bên dưới đều nằm gọn
           trong khung section, còn `overflow` lại biến section thành scroll
           container và làm chết `position: sticky` của con (Maturity dùng). */
        "relative isolate",
        SKY[sky],
        !flush && "pv-section",
        full && "flex min-h-dvh flex-col justify-center",
        className,
      )}
    >
      {/* -z-10 chứ không chỉ dựa vào thứ tự DOM: bốn lớp này position:absolute,
          còn container nội dung là static — không có z-index thì phần tử được
          định vị luôn vẽ đè lên phần tử tĩnh, dù đứng trước trong DOM.
          Thứ tự dựng cảnh: hạt titan (vật liệu) → quầng bình minh (ánh sáng)
          → cung chân trời (đường mà ánh sáng chạm vào) → vạch ranh giới. */}
      <span aria-hidden className="pv-grain -z-10" />
      <span aria-hidden className="pv-skyglow -z-10" />
      <HorizonArc className="-z-10" />
      <span aria-hidden className="pv-horizon -z-10" />

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
