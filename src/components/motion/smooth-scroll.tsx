"use client";

import Lenis, { type VirtualScrollData } from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { SCROLL, SNAP } from "@/lib/motion";

/** Khớp --ease-out-expo trong globals.css. */
const easeOutExpo = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

/**
 * Smooth scroll + snap section toàn site.
 * Đặt MỘT lần ở layout gốc. Không lồng nhiều instance.
 *
 * SNAP ĐANG TẮT TẠM (`SNAP.enabled` trong `src/lib/motion.ts`). Cuộn mượt vẫn
 * chạy; effect dựng điểm dừng bên dưới thoát ngay. Phần mô tả sau đây giữ
 * nguyên cho lần bật lại — các mốc `data-snap` trong markup cũng để nguyên,
 * chúng là thuộc tính trơ, không CSS nào bám vào.
 *
 * SNAP — hai tầng, cùng một bộ điểm dừng:
 *
 * 1. TRƯỢT NGAY khi cuộn qua nửa section kế bên. Cuộn xuống: mép trên của
 *    section dưới vượt quá giữa màn hình là trang trượt cho nó khớp khung,
 *    và khoá cuộn trong lúc trượt (lock) để đà cuộn còn lại không giật ngược
 *    cú trượt. Cuộn lên: đối xứng — section trên chiếm quá nửa màn hình thì
 *    khớp nó; section cao hơn một màn hình thì khớp MÀN CUỐI của nó (mép dưới
 *    chạm đáy) để đọc tiếp phần giữa, không nhảy vọt lên đầu.
 *
 * 2. LƯỚI AN TOÀN sau khi ngừng cuộn (SNAP.debounce): còn đứng cách một điểm
 *    dừng dưới ngưỡng thì gom về đó — hứng các cú thả chưa qua nửa và phần đà
 *    lặt vặt. Đứng giữa một section cao hơn màn hình thì không điểm dừng nào
 *    trong ngưỡng → để yên cho người ta đọc.
 *
 * Điểm dừng là mọi phần tử mang `data-snap`:
 *   data-snap=""      mép TRÊN khớp mép trên màn hình — `<Section full>` và
 *                     hero tự gắn, không trang nào phải khai gì.
 *   data-snap="end"   mép DƯỚI khớp đáy màn hình — footer. Thiếu điểm dừng
 *                     này thì cuối trang không phải vị trí hợp lệ và người
 *                     dùng đứng ở footer sẽ bị hút ngược lên CtaBand.
 *
 * Tự tắt khi người dùng bật "giảm chuyển động" — bắt buộc, vì cuộn mượt lẫn
 * cú trượt tự động là thứ gây khó chịu nhất với nhóm nhạy cảm tiền đình.
 * Trên cảm ứng Lenis không điều khiển cuộn (syncTouch mặc định tắt) nên snap
 * cũng không can thiệp — mobile giữ nguyên đà cuộn native.
 */
export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    if (prefersReduced.matches) return;

    const lenis = new Lenis({
      duration: SCROLL.duration,
      // khớp --ease-out-expo
      easing: easeOutExpo,
      smoothWheel: true,
      touchMultiplier: SCROLL.touchMultiplier,
    });
    lenisRef.current = lenis;

    let frame = 0;
    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenisRef.current = null;
      lenis.destroy();
    };
  }, []);

  /* Bộ điểm dừng thay theo trang → dựng lại mỗi lần đổi route. Effect chạy
     sau khi DOM của trang mới đã commit nên querySelectorAll thấy đủ section. */
  useEffect(() => {
    if (!SNAP.enabled) return;
    const lenis = lenisRef.current;
    if (!lenis) return;

    /* Vị trí scroll tuyệt đối của từng điểm dừng, sắp tăng dần. Đo lại khi
       layout đổi (ảnh/font tải xong làm trang cao lên). */
    let points: number[] = [];
    const measure = () => {
      const y = window.scrollY;
      points = Array.from(document.querySelectorAll<HTMLElement>("[data-snap]"))
        .map((el) => {
          const rect = el.getBoundingClientRect();
          return Math.round(
            el.dataset.snap === "end"
              ? rect.bottom + y - window.innerHeight
              : rect.top + y,
          );
        })
        .sort((a, b) => a - b);
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener("resize", measure);

    /* Mục tiêu của cú trượt gần nhất — chặn việc bắn lại cùng một đích mỗi
       sự kiện wheel (scrollTo lặp sẽ reset easing liên tục, cú trượt không
       bao giờ về đích). Rời xa quá một màn hình thì xoá để lần quay lại sau
       vẫn trượt được. */
    let lastTarget: number | null = null;
    let settleTimer = 0;

    const go = (target: number, lock: boolean) => {
      lastTarget = target;
      lenis.scrollTo(target, {
        duration: SNAP.duration,
        easing: easeOutExpo,
        lock,
      });
    };

    const onVirtualScroll = ({ deltaY, event }: VirtualScrollData) => {
      /* Cảm ứng giữ nguyên đà cuộn native — không can thiệp. */
      if (event.type === "touchmove" || deltaY === 0) return;
      if (points.length === 0) return;

      const vh = window.innerHeight;
      const threshold = vh * SNAP.distance;
      /* targetScroll là nơi cử chỉ đang lái tới — đọc Ý ĐỊNH của người dùng,
         không phải vị trí đã lăn tới (scroll còn đang đuổi theo sau). Cộng
         thêm delta của chính sự kiện này vì listener có thể chạy trước khi
         Lenis kịp cộng. */
      const t = Math.min(
        Math.max(lenis.targetScroll + deltaY, 0),
        lenis.limit,
      );

      if (lastTarget !== null && Math.abs(t - lastTarget) > vh) {
        lastTarget = null;
      }

      /* Ranh giới kế tiếp phía dưới mép trên màn hình (+1 để bỏ qua chính
         điểm đang đứng). */
      const i = points.findIndex((p) => p > t + 1);
      if (i !== -1) {
        const boundary = points[i];
        if (deltaY > 0) {
          /* Xuống: section dưới chiếm quá nửa màn hình → khớp nó. */
          if (boundary - t < threshold && boundary !== lastTarget) {
            go(boundary, true);
          }
        } else {
          /* Lên: section trên chiếm quá nửa → khớp nó. Đích là màn cuối của
             section trên (mép dưới chạm đáy màn hình); section cao đúng một
             màn thì đó cũng chính là mép trên của nó. Kẹp bằng max() để
             không bao giờ vọt lên quá đầu section. */
          const above = Math.max(i > 0 ? points[i - 1] : 0, boundary - vh);
          if (
            boundary - t > threshold &&
            boundary - t < vh &&
            above !== lastTarget
          ) {
            go(above, true);
          }
        }
      }

      /* Lưới an toàn: gom về điểm dừng gần nhất khi đã buông tay mà còn đứng
         lửng lơ trong ngưỡng. Nếu cú trượt tầng 1 đã chạy thì targetScroll
         trùng điểm dừng → khoảng cách 0 → tự bỏ qua, không trượt đúp. */
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        const s = lenis.targetScroll;
        const j = points.findIndex((p) => p > s + 1);
        if (j === -1) return;
        const prev = j > 0 ? points[j - 1] : 0;
        const candidates = [prev, Math.max(prev, points[j] - vh), points[j]];
        const nearest = candidates.reduce((a, c) =>
          Math.abs(c - s) < Math.abs(a - s) ? c : a,
        );
        if (Math.abs(nearest - s) > 1 && Math.abs(nearest - s) <= threshold) {
          go(nearest, false);
        }
      }, SNAP.debounce);
    };

    lenis.on("virtual-scroll", onVirtualScroll);

    return () => {
      lenis.off("virtual-scroll", onVirtualScroll);
      window.clearTimeout(settleTimer);
      window.removeEventListener("resize", measure);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
