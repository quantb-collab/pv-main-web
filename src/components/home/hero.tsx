"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Parallax, ScrollStage } from "@/components/motion/parallax";
import { CtaButton } from "@/components/pv/cta-button";
import { GapChip } from "@/components/pv/gap";
import { Highlight } from "@/components/pv/highlight";
import { DUR, EASE, LIFT, STAGGER } from "@/lib/motion";

/**
 * Hero — §9 Section 1.
 * Answers who Pebble is, who it serves, what result it produces and what the
 * next step is, within 10–15 seconds. No technology list here.
 *
 * Locked to exactly one viewport (min-h-dvh) with the pitch centred in it, so
 * no slack can accumulate at either edge.
 *
 * Copy budget: "AI" appears exactly once on this screen. It is the hook, and
 * repeating it turns a claim into a slogan.
 *
 * This is the only block on the page allowed to use ScrollStage.
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
    <section className="tone-dark relative isolate flex min-h-dvh flex-col overflow-hidden">
      <HeroBackdrop />

      <div className="relative flex flex-1 items-center">
        <ScrollStage className="pv-container w-full pt-20 pb-16 lg:pt-24">
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center"
          >
            <motion.span
              variants={item}
              className="font-mono text-[11px] tracking-[0.2em] text-brand uppercase"
            >
              {t("eyebrow")}
            </motion.span>

            {/* 25ch keeps the headline at two lines down to lg; below that it
                wraps naturally rather than being capped into short ragged lines. */}
            <motion.h1
              variants={item}
              className="max-w-[25ch] font-display text-4xl leading-[1.06] font-semibold text-balance sm:text-5xl lg:text-6xl xl:text-[4.25rem]"
            >
              <Highlight>{t("title")}</Highlight>
            </motion.h1>

            <motion.p
              variants={item}
              className="max-w-2xl text-lg leading-relaxed text-muted-foreground text-balance"
            >
              <Highlight>{t("lead")}</Highlight>
            </motion.p>

            <motion.div
              variants={item}
              className="mt-2 flex flex-col items-center gap-3 sm:flex-row sm:gap-5"
            >
              <CtaButton href="/ai-assessment" size="lg">
                {tc("assessment")}
              </CtaButton>
              <CtaButton
                href="/how-we-deliver"
                size="lg"
                variant="link"
                arrow={false}
                className="px-0"
              >
                {tc("deliver")}
              </CtaButton>
            </motion.div>
          </motion.div>
        </ScrollStage>
      </div>

      <GapChip
        kind="confirm"
        className="absolute right-6 bottom-6 hidden lg:inline-flex"
      >
        <span title={t("mediaNeed")}>{t("mediaGap")}</span>
      </GapChip>
    </section>
  );
}

/**
 * Layer order matters: the scrim sits directly on the photo so it can guarantee
 * contrast, while the grid and brand glow stay above it and keep their edge.
 * Without `src` the empty state is the grid and glow alone — a deliberate
 * technical surface, not a hole waiting for stock art.
 */
function HeroBackdrop({ src, alt }: { src?: string; alt?: string }) {
  return (
    <div aria-hidden className="absolute inset-0 -z-10">
      {src ? (
        <Image
          src={src}
          alt={alt ?? ""}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : null}

      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />

      <Parallax amount="subtle" className="absolute inset-0">
        <div
          className="absolute top-[6%] left-1/2 size-[60rem] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, var(--brand) 0%, transparent 65%)",
          }}
        />
      </Parallax>

      <div className="pv-grid-bg absolute inset-0 opacity-60" />

      {/* Settles the grid into flat background before the next section starts. */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
    </div>
  );
}
