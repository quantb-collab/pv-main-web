"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { DUR, EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * ============================================================================
 * KHUNG ẢNH CHUẨN CỦA SITE
 * ----------------------------------------------------------------------------
 * Mọi ảnh trên site đi qua component này. Lý do:
 *   1. Nhịp xuất hiện giống nhau (mở khung + ảnh phóng nhẹ về đúng cỡ).
 *   2. Tỷ lệ khung và bo góc thống nhất.
 *   3. Khi CHƯA có ảnh thật, nó tự render ô chờ ghi rõ cần ảnh gì —
 *      thay vì cắm stock photo rồi quên thay.
 *
 * Không dùng <img> hay <Image> trần trong trang.
 * ============================================================================
 */

const RATIO = {
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  wide: "aspect-[16/9]",
  ultra: "aspect-[21/9]",
  /** Màn hình sản phẩm: PV One dựng ở 1440×900, và ảnh chụp giữ nguyên tỷ lệ
   *  đó. Có tên riêng để chỗ nào cần "cả màn, không cắt" thì khai đúng một
   *  chữ, thay vì mỗi trang tự đoán ra 16/10. */
  screen: "aspect-[16/10]",
} as const;

export interface MediaFrameProps {
  /** Bỏ trống = hiện ô chờ ảnh. */
  src?: string;
  /** Mô tả ảnh cho screen reader. Bắt buộc khi có src. */
  alt?: string;
  /**
   * Ảnh này cần là gì. Hiện trong ô chờ để người chuẩn bị tư liệu biết phải
   * chụp/thiết kế cái gì. Ví dụ: "Ảnh phòng lab, chụp ngang, có người thật".
   */
  need?: string;
  ratio?: keyof typeof RATIO;
  priority?: boolean;
  /**
   * Ô chờ bản CÂM — cho khung thấp dưới ~120px, và cho chỗ có nhiều khung chờ
   * đứng cạnh nhau (card sản phẩm trên kệ phần cứng: 15 khung một section).
   * Bản thường cần ~110px chiều cao cho badge + một dòng `need`, và mười lăm
   * badge vàng cạnh nhau thì đọc ra là một bức tường cảnh báo chứ không ra
   * mười lăm chỗ thiếu ảnh. Bản câm giữ nguyên nền kẻ chéo (vẫn đọc ra "chưa
   * có ảnh") nhưng bỏ badge, và đẩy `need` xuống `title` + `sr-only` để người
   * làm nội dung vẫn lấy được yêu cầu.
   */
  compact?: boolean;
  /**
   * Bề ngang thật của khung, cho `next/image` chọn đúng bản. Mặc định là khung
   * lớn (ảnh hero, ảnh trang giải pháp). Khung nhỏ PHẢI khai — để mặc định thì
   * trình duyệt tải bản 640w cho một ô 200px, nặng gấp ba lần cần thiết.
   */
  sizes?: string;
  /**
   * Phần ảnh được giữ lại khi khung hẹp hơn ảnh. Mặc định cắt đều hai phía.
   * `top` cho ảnh chụp giao diện: phần trên của một màn là chỗ đặt thanh công
   * cụ, tiêu đề và số — cắt cân đối là cắt mất đúng phần khai màn đó là gì.
   */
  focus?: "center" | "top";
  /**
   * Chỉ nâng cho ảnh chụp GIAO DIỆN ở bản phóng to, nơi người đọc phải đọc
   * được chữ 13px nằm trong ảnh. Mức phải có trong `images.qualities` của
   * `next.config.ts`, không thì trình tối ưu trả HTTP 400 và ảnh mất trắng.
   */
  quality?: number;
  className?: string;
  /** Lớp phủ đặt lên trên ảnh (nhãn, chú thích…) */
  children?: React.ReactNode;
}

export function MediaFrame({
  src,
  alt,
  need,
  ratio = "landscape",
  priority = false,
  compact = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px",
  focus = "center",
  quality,
  className,
  children,
}: MediaFrameProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const shouldAnimate = !reduced;

  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-xl border bg-surface",
        RATIO[ratio],
        className,
      )}
    >
      {src ? (
        <motion.div
          className="absolute inset-0"
          initial={shouldAnimate ? { clipPath: "inset(0 0 100% 0)" } : false}
          animate={
            shouldAnimate && inView ? { clipPath: "inset(0 0 0% 0)" } : undefined
          }
          transition={{ duration: DUR.scene, ease: EASE.outSoft }}
        >
          <motion.div
            className="absolute inset-0"
            initial={shouldAnimate ? { scale: 1.12 } : false}
            animate={shouldAnimate && inView ? { scale: 1 } : undefined}
            transition={{ duration: DUR.settle, ease: EASE.outSoft }}
          >
            <Image
              src={src}
              alt={alt ?? ""}
              fill
              priority={priority}
              quality={quality}
              sizes={sizes}
              className={cn("object-cover", focus === "top" && "object-top")}
            />
          </motion.div>
        </motion.div>
      ) : (
        <MediaPending need={need} compact={compact} />
      )}

      {children}
    </div>
  );
}

const HATCH = {
  backgroundImage:
    "repeating-linear-gradient(45deg, var(--border) 0 1px, transparent 1px 12px)",
} as const;

/**
 * Ô chờ ảnh — cố ý trông như bản vẽ kỹ thuật, không giống ảnh thật.
 *
 * Bản thường cần ~110px chiều cao cho badge + một dòng `need` (đã tính `p-6`).
 * Khung thấp hơn thế thì dùng `compact`, đừng thu nhỏ badge: badge co lại là
 * badge không ai đọc, mà thứ duy nhất ô chờ phải làm được là nhắc rằng chỗ này
 * còn thiếu ảnh.
 */
function MediaPending({ need, compact }: { need?: string; compact?: boolean }) {
  if (compact) {
    return (
      <div
        className="absolute inset-0 flex items-center justify-center"
        title={need}
      >
        <div aria-hidden className="absolute inset-0 opacity-[0.35]" style={HATCH} />
        <span
          aria-hidden
          className="relative font-mono text-micro font-medium text-subtle-foreground"
        >
          +
        </span>
        {need ? <span className="sr-only">{need}</span> : null}
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
      <div aria-hidden className="absolute inset-0 opacity-[0.35]" style={HATCH} />
      <span className="relative rounded-full border border-warning/40 bg-warning/10 px-2.5 py-0.5 font-mono text-micro font-medium text-warning uppercase">
        Cần bổ sung ảnh
      </span>
      {need ? (
        <p className="relative max-w-[34ch] text-meta text-muted-foreground">
          {need}
        </p>
      ) : null}
    </div>
  );
}
