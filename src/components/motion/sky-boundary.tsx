"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionStyle,
} from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Ranh giới sống giữa hai section.
 *
 * `pv-horizon` và `pv-skyglow` (globals.css LỚP 5) là bản tĩnh của chân trời.
 * Hai component này là phần chuyển động của đúng hai lớp đó: khi ranh giới
 * giữa hai section đi vào khung nhìn, quầng của section trên dâng sáng dần
 * (BoundaryGlow) và vạch chân trời của section dưới tự vẽ ra từ tâm
 * (BoundaryHorizon) — hai section trao ánh sáng cho nhau thay vì đứng cạnh
 * nhau như hai tấm nền rời.
 *
 * Cơ chế: chỉ nhân hệ số `--pv-boundary` lên opacity mà CSS đã cân theo nấc
 * trời, không đè giá trị — đổi thang sky không phải đụng vào đây. Chỗ nào
 * dùng bản tĩnh (footer, hero) var rơi về mặc định 1, không đổi gì.
 *
 * Bật "giảm chuyển động" thì trả về đúng span tĩnh như trước.
 */

/* Lát vàng trên của màn hình (1 − 1/φ) — cùng vạch 38.2% mà pv-skyglow và
   hero dùng: ranh giới sáng trọn khi leo tới đó, trước khi section kịp khớp
   khung, nên lúc đứng yên mọi thứ đã ở trạng thái nghỉ. */
const GOLDEN = 0.382;

export function BoundaryHorizon({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  /* Tiến trình 0 → 1: mép trên section đi từ đáy màn hình lên vạch vàng. */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", `start ${GOLDEN}`],
  });

  /* Vạch tự vẽ ra từ tâm — cùng hướng với gradient của pv-horizon (sáng nhất
     ở giữa), nên nhìn như ánh sáng loang dọc đường chân trời. */
  const scaleX = useTransform(scrollYProgress, [0, 1], [0.24, 1]);
  const glow = useTransform(scrollYProgress, [0, 1], [0, 1]);

  if (reduced) {
    return <span aria-hidden className={cn("pv-horizon", className)} />;
  }

  return (
    <motion.span
      aria-hidden
      ref={ref}
      className={cn("pv-horizon will-change-transform", className)}
      style={{ scaleX, "--pv-boundary": glow } as MotionStyle}
    />
  );
}

export function BoundaryGlow({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  /* Tiến trình 0 → 1: mép DƯỚI section đi từ đáy màn hình lên vạch vàng.
     Khi section còn choán trọn khung thì mép dưới chưa nhúc nhích khỏi đáy
     → tiến trình kẹp ở 0 → hệ số 1, đúng bản tĩnh. */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["end end", `end ${GOLDEN}`],
  });

  /* Trần 1.6 giữ quầng ở nấc sáng nhất dưới ~0.5 opacity: dâng lên thấy rõ
     nhưng vẫn là bầu trời, chưa thành đèn pha. */
  const glow = useTransform(scrollYProgress, [0, 1], [1, 1.6]);

  if (reduced) {
    return <span aria-hidden className={cn("pv-skyglow", className)} />;
  }

  return (
    <motion.span
      aria-hidden
      ref={ref}
      className={cn("pv-skyglow", className)}
      style={{ "--pv-boundary": glow } as MotionStyle}
    />
  );
}
