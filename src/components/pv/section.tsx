import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";
import {
  BoundaryGlow,
  BoundaryHorizon,
} from "@/components/motion/sky-boundary";
import { type MarkGlyph, HorizonArc, SectionMark } from "@/components/pv/decor";
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
 * SNAP. Section `full` mang `data-snap`: cuộn qua nửa section kế bên là trang
 * trượt ngay cho section đó khớp khung nhìn (cơ chế ở smooth-scroll.tsx,
 * token ở SNAP trong lib/motion.ts). Vì vậy trạng thái NGHỈ của một section
 * là trọn màn hình — thiết kế section cứ nhắm vào khung đó.
 *
 * NẤC TRỜI. `sky` chọn một nấc trong thang đêm → bình minh (globals.css LỚP 2).
 * Nấc chỉ đi lên trong một trang. Ranh giới giữa hai section không phải là
 * chênh lệch màu nền — nó là vạch chân trời + quầng sáng do chính component
 * này vẽ, nên không section nào phải tự lo phần đó. Ranh giới còn SỐNG theo
 * cuộn: quầng dâng sáng và vạch tự vẽ ra khi nó đi vào khung nhìn
 * (sky-boundary.tsx) — hai section nối nhau bằng một cú trao ánh sáng.
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
  /**
   * Dấu section: số La Mã + một hình, nằm sau nội dung ở mép phải.
   *
   * CHỈ dành cho ba section mảng kinh doanh của trang chủ (phần cứng · phần
   * mềm · đào tạo). Nó là cách đánh số MỘT BỘ BA, nên section thứ tư mang dấu
   * là bộ ba hết còn là bộ ba. Ba hình dùng chung một ngữ pháp hình học với
   * `DawnRings` — luật thêm hình mới ghi ở đầu `decor.tsx`.
   */
  mark?: { numeral: string; glyph: MarkGlyph };
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
  mark,
  className,
  containerClassName,
}: SectionProps) {
  return (
    <section
      id={id}
      data-snap={full ? "" : undefined}
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
      <BoundaryGlow className="-z-10" />
      <HorizonArc className="-z-10" />
      {/* Dấu vẽ SAU cung chân trời: cả hai sống ở dải đáy, và số phải đứng
          TRÊN đường chân trời chứ không bị cung kẻ ngang qua. Ẩn dưới `lg` —
          dưới đó lưới xuống một cột và dải đáy bị nội dung ăn hết. */}
      {mark ? (
        <SectionMark
          numeral={mark.numeral}
          glyph={mark.glyph}
          className="-z-10 hidden lg:block"
        />
      ) : null}
      <BoundaryHorizon className="-z-10" />

      {bleed ? children : <div className={cn("pv-container", containerClassName)}>{children}</div>}
    </section>
  );
}

interface SectionHeaderProps {
  /** Nhãn ngắn phía trên tiêu đề. Nói chủ đề, không nói khẩu hiệu. */
  eyebrow?: string;
  /**
   * Kéo eyebrow vào NẰM CÙNG DÒNG với tiêu đề thay vì đứng riêng một dòng
   * phía trên. Dùng khi hàng tiêu đề phải gọn đúng một dòng — ví dụ section
   * phần cứng ở trang chủ, nơi tiêu đề chia hàng với tab đối tác và section
   * đang chật chiều cao.
   *
   * Dấu hai chấm nằm trong CHÍNH chuỗi eyebrow ở messages, không nối trong
   * JSX: mỗi ngôn ngữ một lối chấm câu, và tiếng Pháp còn chừa khoảng trắng
   * trước dấu hai chấm.
   *
   * Eyebrow lúc này nằm TRONG thẻ tiêu đề nên trình đọc màn hình đọc liền
   * "Phần cứng: Mũi nhọn công nghệ cao" thành một tiêu đề — đúng ý, vì hai vế
   * vốn là một câu bị tách làm hai dòng. Nó cũng ăn luôn cỡ chữ, font và
   * weight của tiêu đề: một dòng chữ có hai cỡ đọc ra là hai thứ, mà đây là
   * một câu. Phân biệt bằng VIẾT HOA và màu mờ hơn một nấc, không bằng cỡ.
   */
  eyebrowInline?: boolean;
  title: ReactNode;
  /** Câu dẫn. Một đoạn, nói lợi ích, không nói tính năng. */
  lead?: ReactNode;
  align?: "left" | "center";
  /** Thẻ tiêu đề. Mỗi trang chỉ có một h1. */
  as?: "h1" | "h2" | "h3";
  /**
   * Hạ hoặc nâng CỠ tiêu đề mà không đụng tới CẤP thẻ. Mặc định cỡ đi theo
   * thẻ (h1→display, h2→headline, h3→subhead) và hầu hết trang nên để nguyên.
   *
   * Có prop này vì hai thứ đó là hai việc khác nhau: cấp thẻ là cấu trúc tài
   * liệu, cỡ chữ là chỗ trống trên màn hình. Section phần cứng ở trang chủ cần
   * `h2` cho đúng dàn bài nhưng phải vẽ ở cỡ `subhead` thì cụm
   * "PHẦN CỨNG: Mũi nhọn công nghệ cao" mới đứng gọn một dòng. Cách sai là hạ
   * thẻ xuống `h3`: dàn bài của trang khi đó khuyết một cấp.
   */
  size?: "display" | "headline" | "subhead" | "title";
  className?: string;
  children?: ReactNode;
}

export function SectionHeader({
  eyebrow,
  eyebrowInline = false,
  title,
  lead,
  align = "left",
  as: Tag = "h2",
  size,
  className,
  children,
}: SectionHeaderProps) {
  /* Bảng viết THẲNG cả bốn chuỗi: Tailwind chỉ sinh class khi thấy chuỗi đầy
     đủ trong mã nguồn, nên `text-${size}` ghép tay sẽ ra một class không tồn
     tại và cỡ chữ rơi im lặng về mặc định. */
  const SIZES = {
    display: "text-display",
    headline: "text-headline",
    subhead: "text-subhead",
    title: "text-title",
  } as const;

  /* Một vai trò cho mỗi cấp tiêu đề. Cỡ, line-height và tracking đã nằm trong
     token nên ở đây không còn bậc breakpoint nào để quên đồng bộ. */
  const sizeClass =
    SIZES[size ?? (Tag === "h1" ? "display" : Tag === "h2" ? "headline" : "subhead")];

  return (
    <Reveal
      className={cn(
        "flex max-w-3xl flex-col gap-4 md:gap-5",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      {eyebrow && !eyebrowInline ? (
        <span className="font-mono text-eyebrow font-medium text-subtle-foreground uppercase">
          {eyebrow}
        </span>
      ) : null}

      <Tag className={cn("font-display font-semibold", sizeClass)}>
        {/* Nhãn KHÔNG khai cỡ, font hay weight — nó thừa kế hết từ thẻ tiêu đề
            để cả dòng đọc ra là một câu. Chỉ hai thứ khác: viết hoa, và mờ hơn
            một nấc để mắt biết đâu là nhãn đâu là tiêu đề.

            Khoảng cách là một DẤU CÁCH THẬT chứ không phải `mr-*`, và nó nằm
            trong nhánh điều kiện chứ không đứng ngoài:
            · thật — hai phần tử inline dính liền nhau trong DOM thì trình đọc
              màn hình đọc ra "…phần cứngMũi nhọn…"; `margin` không cứu được vì
              nó là chuyện của mắt, không phải của cây nội dung.
            · nằm trong nhánh — để ngoài thì mọi header KHÔNG dùng inline sẽ
              lãnh một dấu cách thừa ngay trước chữ đầu tiên.
            Dấu cách ăn cỡ chữ của thẻ tiêu đề nên nó giãn theo tiêu đề, đúng
            như khi cả hai vế là một chuỗi liền. */}
        {eyebrow && eyebrowInline ? (
          <>
            <span className="text-subtle-foreground uppercase">{eyebrow}</span>{" "}
          </>
        ) : null}
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
