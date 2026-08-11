import type { Transition, Variants } from "motion/react";

/**
 * ============================================================================
 * TOKEN CHUYỂN ĐỘNG (mặt JS)
 * ----------------------------------------------------------------------------
 * Đây là bản sao của các token trong app/globals.css (LỚP 3).
 * Hai file PHẢI khớp nhau. Đổi easing/duration thì sửa cả hai.
 *
 * Luật: component không được tự viết cubic-bezier hay số ms rời rạc.
 * Mọi chuyển động lấy từ EASE / DUR ở đây.
 * ============================================================================
 */

/** Cubic-bezier dạng tuple cho motion. Khớp --ease-* trong globals.css */
export const EASE = {
  /** Mặc định cho phần tử xuất hiện. Vào nhanh, dừng êm. */
  out: [0.16, 1, 0.3, 1],
  /** Mềm hơn out một chút, dùng cho khối lớn. */
  outSoft: [0.22, 1, 0.36, 1],
  /** Đối xứng, dùng cho phần tử đang chuyển trạng thái qua lại. */
  inOut: [0.76, 0, 0.24, 1],
  /** Nảy nhẹ. Chỉ dùng cho micro-interaction, không dùng cho section. */
  spring: [0.34, 1.56, 0.64, 1],
} as const satisfies Record<string, [number, number, number, number]>;

/** Giây (motion dùng giây, CSS dùng ms) */
export const DUR = {
  instant: 0.12,
  fast: 0.2,
  base: 0.34,
  slow: 0.62,
  scene: 1.0,
  /** Ảnh phóng nhẹ về đúng cỡ — chậm hơn scene để mắt kịp bám vào ảnh */
  settle: 1.4,
} as const;

/** Cấu hình cuộn mượt của Lenis. Để ở đây cho cùng chỗ với các token nhịp. */
export const SCROLL = {
  duration: 1.05,
  touchMultiplier: 1.6,
} as const;

/**
 * Snap section vào khung nhìn (cơ chế ở smooth-scroll.tsx).
 * Cuộn QUA nửa section kế bên là trượt ngay cho section đó khớp khung —
 * không chờ ngừng cuộn. Section cao hơn một màn hình vẫn đọc được phần giữa.
 */
export const SNAP = {
  /** Ngưỡng kích hoạt — phần màn hình mà section kế bên phải chiếm được. */
  distance: 0.5,
  /** ms sau cử chỉ cuộn cuối cùng mới chạy lưới an toàn (gom về điểm dừng). */
  debounce: 500,
  /** Cú trượt khớp màn hình đi cùng nhịp với cuộn mượt. */
  duration: SCROLL.duration,
} as const;

/**
 * Băng sản phẩm ở kệ phần cứng (product-shelf.tsx). Đơn vị ms — đây là nhịp
 * của `setInterval`, không phải thời lượng một cú chuyển động, nên nó không
 * nằm trong `DUR`.
 */
export const SHELF = {
  /** Giữa hai lần tự trôi. Đủ lâu để đọc xong một nhãn rồi mới đổi. */
  auto: 4200,
  /**
   * Lệch pha giữa ba tầng kệ. Ba băng trôi cùng một nhịp đọc ra là một cái
   * bảng điện tử đang chạy; lệch pha thì đọc ra là ba kệ hàng sống độc lập.
   */
  stagger: 1300,
} as const;

/**
 * Bước tự chạy của kệ phần mềm (software-bento.tsx). Cùng đơn vị và cùng cơ chế
 * với `SHELF`.
 *
 * 1,5s là nhịp LƯỚT, không phải nhịp đọc — chủ dự án chốt 2026-08-11. Ở tốc độ
 * đọc 200 chữ/phút, 1,5 giây chỉ đủ cho **5 chữ**. Vì vậy thẻ chỉ còn giữ TÊN
 * màn (2–4 chữ, liếc là bắt được), và toàn bộ phần giải thích chuyển vào bản
 * phóng to — nơi người đọc tự bấm tới lui theo nhịp của mình. Đặt một đoạn văn
 * dưới nhịp này là viết chữ cho không ai đọc.
 *
 * Ba chỗ khoá bắt buộc đi kèm nhịp nhanh, xem `software-bento.tsx`: dừng khi rê
 * chuột hoặc focus, dừng hẳn khi người dùng tự bấm một bước, và dừng khi bản
 * phóng to đang mở — nếu không thì nội dung đổi ngay dưới tay người đang xem.
 */
export const STEPPER = {
  /** Nhịp lướt qua năm màn. Đủ để nhận ra hình, không đủ để đọc. */
  auto: 1500,
} as const;

/** Độ trễ giữa các phần tử trong một nhóm */
export const STAGGER = 0.07;

/** Khoảng dịch chuyển khi xuất hiện, khớp --lift-* */
export const LIFT = {
  sm: 8,
  md: 20,
  lg: 40,
} as const;

export const transition = {
  base: { duration: DUR.base, ease: EASE.out },
  slow: { duration: DUR.slow, ease: EASE.out },
  scene: { duration: DUR.scene, ease: EASE.outSoft },
} as const satisfies Record<string, Transition>;

/**
 * Ngưỡng kích hoạt khi cuộn tới. Dùng chung để nhịp toàn site giống nhau:
 * phần tử bắt đầu hiện khi đã vào khung nhìn khoảng 15%.
 */
export const VIEWPORT = { once: true, amount: 0.15 } as const;

export type RevealDirection = "up" | "down" | "left" | "right" | "none";

function offsetFor(direction: RevealDirection, distance: number) {
  switch (direction) {
    case "up":
      return { y: distance };
    case "down":
      return { y: -distance };
    case "left":
      return { x: distance };
    case "right":
      return { x: -distance };
    default:
      return {};
  }
}

/** Variants cho một phần tử xuất hiện độc lập */
export function revealVariants(
  direction: RevealDirection = "up",
  distance: number = LIFT.md,
): Variants {
  return {
    hidden: { opacity: 0, ...offsetFor(direction, distance) },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: transition.slow,
    },
  };
}

/** Variants cho container điều phối nhóm con lần lượt hiện */
export function groupVariants(stagger: number = STAGGER, delay = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };
}

/** Biến thể "không chuyển động" — dùng khi người dùng bật giảm hiệu ứng */
export const staticVariants: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
};
