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
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px"
              className="object-cover"
            />
          </motion.div>
        </motion.div>
      ) : (
        <MediaPending need={need} />
      )}

      {children}
    </div>
  );
}

/** Ô chờ ảnh — cố ý trông như bản vẽ kỹ thuật, không giống ảnh thật. */
function MediaPending({ need }: { need?: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, var(--border) 0 1px, transparent 1px 12px)",
        }}
      />
      <span className="relative rounded-full border border-warning/40 bg-warning/10 px-2.5 py-0.5 font-mono text-[10px] tracking-widest text-warning uppercase">
        Cần bổ sung ảnh
      </span>
      {need ? (
        <p className="relative max-w-[28ch] text-xs leading-relaxed text-muted-foreground">
          {need}
        </p>
      ) : null}
    </div>
  );
}
