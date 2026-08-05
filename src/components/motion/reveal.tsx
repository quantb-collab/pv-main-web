"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";
import {
  groupVariants,
  LIFT,
  revealVariants,
  staticVariants,
  STAGGER,
  VIEWPORT,
  type RevealDirection,
} from "@/lib/motion";

/**
 * ============================================================================
 * BỘ PRIMITIVE XUẤT HIỆN
 * ----------------------------------------------------------------------------
 * Chỉ dùng 3 thành phần này cho mọi hiệu ứng "hiện khi cuộn tới".
 * Không viết motion.div rời rạc trong trang — nhịp sẽ lệch giữa các section.
 *
 *   <Reveal>            một khối hiện lên
 *   <RevealGroup>       khung điều phối, con hiện lần lượt
 *     <RevealItem>      từng phần tử con trong nhóm
 *
 * Cả ba tự trả về nội dung tĩnh khi người dùng bật giảm chuyển động.
 * ============================================================================
 */

/**
 * Bảng tra component motion, khai báo MỘT lần ở cấp module.
 *
 * ⚠️ Không gọi motion.create() trong thân component: mỗi lần render sẽ sinh ra
 * một component type mới, React coi là component khác nên unmount rồi mount
 * lại cây con. Hậu quả: animation reset vô hạn và phần tử kẹt ở trạng thái ẩn.
 * Cần thêm thẻ mới thì thêm vào bảng này.
 */
const TAGS = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  header: motion.header,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
  span: motion.span,
  p: motion.p,
  figure: motion.figure,
} as const;

export type RevealTag = keyof typeof TAGS;

interface BaseProps extends Omit<HTMLMotionProps<"div">, "variants"> {
  children: ReactNode;
  /** Thẻ HTML muốn render. Mặc định div. */
  as?: RevealTag;
}

interface RevealProps extends BaseProps {
  /** Hướng phần tử trôi vào. Mặc định "up". */
  direction?: RevealDirection;
  /** Quãng đường trôi, px. Khối càng lớn dùng quãng càng dài. */
  distance?: number;
  /** Trễ trước khi bắt đầu, giây. */
  delay?: number;
}

export function Reveal({
  children,
  direction = "up",
  distance = LIFT.md,
  delay = 0,
  as = "div",
  ...props
}: RevealProps) {
  const reduced = useReducedMotion();
  const Comp = TAGS[as] as typeof motion.div; // union thẻ -> chuẩn hoá về kiểu props của div

  return (
    <Comp
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={reduced ? staticVariants : revealVariants(direction, distance)}
      transition={delay ? { delay } : undefined}
      {...props}
    >
      {children}
    </Comp>
  );
}

interface RevealGroupProps extends BaseProps {
  /** Độ trễ giữa các con, giây. */
  stagger?: number;
  delay?: number;
}

export function RevealGroup({
  children,
  stagger = STAGGER,
  delay = 0,
  as = "div",
  ...props
}: RevealGroupProps) {
  const reduced = useReducedMotion();
  const Comp = TAGS[as] as typeof motion.div; // union thẻ -> chuẩn hoá về kiểu props của div

  return (
    <Comp
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={reduced ? staticVariants : groupVariants(stagger, delay)}
      {...props}
    >
      {children}
    </Comp>
  );
}

interface RevealItemProps extends BaseProps {
  direction?: RevealDirection;
  distance?: number;
}

export function RevealItem({
  children,
  direction = "up",
  distance = LIFT.sm,
  as = "div",
  ...props
}: RevealItemProps) {
  const reduced = useReducedMotion();
  const Comp = TAGS[as] as typeof motion.div; // union thẻ -> chuẩn hoá về kiểu props của div

  return (
    <Comp
      variants={reduced ? staticVariants : revealVariants(direction, distance)}
      {...props}
    >
      {children}
    </Comp>
  );
}
