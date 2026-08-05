"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { SCROLL } from "@/lib/motion";

/**
 * Smooth scroll toàn site.
 * Đặt MỘT lần ở layout gốc. Không lồng nhiều instance.
 *
 * Tự tắt khi người dùng bật "giảm chuyển động" ở hệ điều hành — bắt buộc,
 * vì cuộn mượt là thứ gây khó chịu nhất với nhóm nhạy cảm tiền đình.
 */
export function SmoothScroll() {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    if (prefersReduced.matches) return;

    const lenis = new Lenis({
      duration: SCROLL.duration,
      // khớp --ease-out-expo
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: SCROLL.touchMultiplier,
    });

    let frame = 0;
    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
