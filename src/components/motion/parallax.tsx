"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Parallax theo cuộn trang.
 *
 * Quy ước biên độ (giữ nhỏ — parallax mạnh làm chữ khó đọc và tăng CLS cảm nhận):
 *   subtle = 6%   lớp nền, hoạ tiết
 *   base   = 12%  ảnh minh hoạ
 *   strong = 22%  chỉ dùng cho một khối "sân khấu" duy nhất trên mỗi trang
 */
const RANGE = { subtle: 6, base: 12, strong: 22 } as const;

interface ParallaxProps {
  children: ReactNode;
  /** Biên độ dịch chuyển. */
  amount?: keyof typeof RANGE;
  /** Trục dịch chuyển. */
  axis?: "y" | "x";
  className?: string;
}

export function Parallax({
  children,
  amount = "base",
  axis = "y",
  className,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });

  const distance = RANGE[amount];
  const shift = useTransform(smooth, [0, 1], [`${distance}%`, `-${distance}%`]);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      <motion.div style={axis === "y" ? { y: shift } : { x: shift }}>
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Khối "sân khấu": nội dung bên trong phóng nhẹ và mờ dần khi cuộn qua.
 * Chỉ dùng tối đa một lần mỗi trang, thường là hero.
 */
export function ScrollStage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ scale, opacity, y }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}
