"use client";

import { ArrowDown, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { MediaFrame } from "@/components/motion/media-frame";
import { Parallax, ScrollStage } from "@/components/motion/parallax";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { DUR, EASE, LIFT, STAGGER } from "@/lib/motion";

/**
 * Hero — §9 Section 1.
 * Nhiệm vụ: trong 10–15 giây trả lời Pebble là ai, giúp ai, tạo kết quả gì,
 * bước tiếp theo là gì. Không đặt danh sách công nghệ ở đây.
 *
 * Đây là khối duy nhất trên trang được dùng ScrollStage (biên độ mạnh).
 */
export function Hero() {
  const t = useTranslations("home.hero");
  const tc = useTranslations("cta");
  const reduced = useReducedMotion();

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: STAGGER, delayChildren: 0.15 } },
  };
  const item = reduced
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: LIFT.md },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: DUR.slow, ease: EASE.out },
        },
      };

  return (
    <section className="tone-dark relative isolate overflow-hidden">
      {/* nền lưới kỹ thuật + quầng sáng, chỉ dùng ở hero */}
      <div aria-hidden className="pv-grid-bg absolute inset-0 opacity-40" />
      <Parallax amount="subtle" className="absolute inset-0 -z-10">
        <div
          aria-hidden
          className="absolute top-[-20%] left-1/2 size-[46rem] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, var(--brand) 0%, transparent 65%)",
          }}
        />
      </Parallax>

      <ScrollStage className="pv-container flex min-h-[92svh] flex-col justify-center pt-28 pb-20 lg:pt-36">
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-7"
          >
            <motion.span
              variants={item}
              className="font-mono text-[11px] tracking-[0.2em] text-brand uppercase"
            >
              {t("eyebrow")}
            </motion.span>

            <motion.h1
              variants={item}
              className="max-w-[15ch] font-display text-4xl leading-[1.04] font-semibold text-balance sm:text-5xl lg:text-6xl xl:text-7xl"
            >
              {t("title")}
            </motion.h1>

            <motion.p
              variants={item}
              className="max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty"
            >
              {t("lead")}
            </motion.p>

            <motion.div variants={item} className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="group">
                <Link href="/ai-assessment">
                  {tc("assessment")}
                  <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/how-we-deliver">{tc("deliver")}</Link>
              </Button>
            </motion.div>

            <motion.ul
              variants={item}
              className="mt-4 flex flex-col gap-2 border-t pt-6 text-sm text-muted-foreground sm:flex-row sm:gap-8"
            >
              <li>{t("proof1")}</li>
              <li>{t("proof2")}</li>
              <li>{t("proof3")}</li>
            </motion.ul>
          </motion.div>

          <motion.div
            initial={reduced ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: DUR.scene, ease: EASE.outSoft, delay: 0.25 }}
          >
            <MediaFrame
              ratio="portrait"
              priority
              need="Ảnh chủ đạo trang chủ. Gợi ý: người thật đang làm việc với hệ thống trong môi trường doanh nghiệp hoặc phòng lab. Không dùng robot, não phát sáng, tay chạm màn hình hay ảnh stock bắt tay."
            />
          </motion.div>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: DUR.slow }}
          className="mt-16 hidden items-center gap-2 font-mono text-[11px] tracking-[0.16em] text-subtle-foreground uppercase lg:flex"
        >
          <ArrowDown className="size-3.5 animate-bounce" />
          {t("scrollHint")}
        </motion.div>
      </ScrollStage>
    </section>
  );
}
