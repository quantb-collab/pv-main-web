"use client";

import { ChevronDown, FileText } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Parallax, ScrollStage } from "@/components/motion/parallax";
import { CtaButton } from "@/components/pv/cta-button";
import { DawnRings } from "@/components/pv/decor";
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
 * Sits at `sky-void` — the darkest hour of the page, before any light. The only
 * light in it is the first cold edge of dawn low on the horizon, which the rest
 * of the page then walks up through. Nothing here may be brighter than that.
 *
 * The headline carries exactly two marks, one treatment each (via `brand` on
 * `<Highlight>` — hero-only, see highlight.tsx): the brand name GLOWS at the
 * head, the promise "doanh nghiệp số tự vận hành" gets a hairline UNDERLINE at
 * the tail. One light source, one horizon line — two glows in one sentence
 * would compete. Decision log: HANDOFF "tô từ nào ở hero" — chốt 2026-08-06.
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
    <section className="sky-void relative isolate flex min-h-dvh flex-col overflow-hidden">
      <HeroBackdrop />

      <div className="relative flex flex-1 flex-col">
        {/* Tỉ lệ vàng theo chiều dọc. `items-center` đặt khối chữ vào tâm
            hình học của màn hình — nhưng tâm quang học của một khung nằm CAO
            hơn tâm hình học, nên bản cũ nhìn như chữ đang chìm giữa hai
            khoảng trống vô danh. Hai spacer chia khoảng trống còn lại theo
            382 : 618 (φ): tiêu đề đậu đúng vạch vàng của màn hình, và phần
            lớn bầu trời dồn xuống dưới — đúng chỗ quầng sáng với các vòng
            cần chỗ thở, thay vì bị khối chữ đè lên.
            min-h là sàn khi màn hình thấp: trên phải lọt qua header fixed
            (h-16 / lg:h-20), dưới phải chừa chỗ cho ExploreCue neo ở mép. */}
        <div aria-hidden className="min-h-24 flex-[382] lg:min-h-28" />
        <ScrollStage className="pv-container w-full">
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            /* Nhịp dọc theo tỉ lệ chứ không đều nhau. `gap-5` là khoảng cách
               cơ sở giữa tiêu đề và slogan — chúng là MỘT ý, phải dính nhau.
               Hàng nút cách ra `mt-8` (≈1.6×) vì nó là việc phải làm, không
               phải câu phải đọc. Ba khoảng bằng nhau thì ba khối đọc ra là
               một danh sách, không phải một lời chào rồi một lời mời.

               `max-w-5xl` (1024px) chứ không `4xl`: ở 4xl tiêu đề 60 ký tự
               rơi xuống ba dòng và slogan 95 ký tự thành hai. Nới thêm 128px
               là đủ để tiêu đề nằm hai dòng và slogan nằm trọn một dòng từ
               khổ laptop trở lên — đó mới là hình dạng đúng của một lời chào:
               một câu, một dòng. */
            className="mx-auto flex max-w-5xl flex-col items-center gap-5 text-center"
          >
            {/* `text-headline` chứ không `text-display`, dù đây là h1.
                Vai trò `display` (40→72px) được cân cho tiêu đề dưới ~60 ký
                tự; tiêu đề này 60 ký tự — đúng mép trên, và ở 72px vẫn thành
                ba dòng cao hơn 230px, ép slogan cùng hai nút xuống sát mép.
                Ở 32→52px nó còn khoảng 180px — vẫn là thứ to nhất first view
                vì không có gì cạnh tranh, mà vẫn chừa chỗ cho phần dưới thở.
                Luật chung: tiêu đề trang dài quá ~60 ký tự thì dùng
                `text-headline`. Xem docs/DESIGN-TOKENS.md § Thang chữ. */}
            <motion.h1
              variants={item}
              className="font-display text-headline font-semibold text-balance"
            >
              <Highlight brand>{t("title")}</Highlight>
            </motion.h1>

            {/* Slogan, hạ một nấc xuống `text-body`. Ở `text-lead` (21px) nó
                chỉ nhỏ hơn tiêu đề 2,5 lần và hai khối tranh nhau; ở 17,5px
                khoảng cách thành 3 lần, mắt đọc ra thứ tự ngay.

                KHÔNG đặt `max-w-[58ch]` như câu dẫn thường: 95 ký tự trên một
                dòng vượt đo đọc chuẩn, nhưng slogan không phải văn bản chạy —
                nó là một câu đọc trong một hơi, và cắt đôi thì mất phép đối
                "công cụ ↔ con người". Ngoại lệ này chỉ dành cho hero.
                `text-balance` lo phần khổ hẹp: dưới laptop nó tự chia hai
                dòng cân nhau thay vì để lại một dòng cụt. */}
            <motion.p
              variants={item}
              className="text-body text-muted-foreground text-balance"
            >
              <Highlight>{t("lead")}</Highlight>
            </motion.p>

            {/* Mobile: hai nút xếp dọc và kéo đủ bề ngang khối — hai nút nhỏ
                cạnh nhau ở 375px thì vùng chạm nào cũng chật. */}
            <motion.div
              variants={item}
              className="mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4"
            >
              <CtaButton href="/ai-assessment" size="lg">
                {tc("assessment")}
              </CtaButton>
              {/* Viền sáng trên nền trong suốt.
                  `secondary` không dùng được ở đây: nền của nó là `--surface-2`,
                  mà hero ở nấc `void` nên hai màu đó gần như trùng — nút biến
                  mất. Đây là đặc tính của thang sky (bề mặt = nấc trời kế
                  tiếp), không phải lỗi của variant.
                  Ba override đều bằng token: nền trong suốt để thấy bầu trời
                  phía sau, viền `foreground/35` đủ rõ mà không thành nút chính,
                  hover chỉ nhấc viền chứ không đổ nền — nút phụ được thấy, không
                  được mời.

                  MỌI override phải khai cả bản `dark:`. `<html>` mang class
                  `dark` cố định, nên `dark:border-input` và `dark:bg-input/30`
                  của variant vẫn sống. tailwind-merge chỉ gộp các class CÙNG
                  biến thể, nên `border-foreground/35` không đẩy được
                  `dark:border-input` ra — và ở tầng CSS, biến thể `dark:` được
                  sinh sau nên nó thắng. Thiếu một cặp `dark:` là override im
                  lặng không có tác dụng, build vẫn sạch. */}
              <CtaButton
                href="/about"
                size="lg"
                variant="outline"
                arrow={false}
                className="border-foreground/35 bg-transparent hover:border-foreground/60 hover:bg-foreground/5 dark:border-foreground/35 dark:bg-transparent dark:hover:border-foreground/60 dark:hover:bg-foreground/5"
              >
                <FileText data-icon="inline-start" />
                {tc("profile")}
              </CtaButton>
            </motion.div>
          </motion.div>
        </ScrollStage>
        <div aria-hidden className="min-h-28 flex-[618]" />
      </div>

      <ExploreCue label={tc("explore")} reduced={Boolean(reduced)} />
    </section>
  );
}

/**
 * Gợi ý cuộn ở đáy hero.
 *
 * Là ANCHOR xuống section kế, không phải link sang trang khác: một mũi kép chỉ
 * xuống nằm ở mép dưới màn hình thì người đọc hiểu là "còn nữa ở phía dưới".
 * Cho nó dẫn đi nơi khác là nói dối một cử chỉ mà ai cũng đọc được.
 *
 * Mũi kép chồng nhau chứ không xếp cách nhau: hai mũi rời thành hai ký hiệu,
 * chồng lệch thì thành một — cùng một cử chỉ, nhấn mạnh hơn.
 */
function ExploreCue({ label, reduced }: { label: string; reduced: boolean }) {
  return (
    <motion.a
      href="#van-de"
      initial={reduced ? undefined : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: DUR.slow, ease: EASE.out, delay: 0.6 }}
      className="group absolute inset-x-0 bottom-7 mx-auto flex w-fit flex-col items-center gap-2 text-ui font-medium text-muted-foreground transition-colors duration-(--dur-fast) hover:text-foreground focus-visible:text-foreground"
    >
      {label}
      <span aria-hidden className="flex flex-col items-center animate-nudge">
        <ChevronDown className="size-4" />
        <ChevronDown className="-mt-2.5 size-4 opacity-50" />
      </span>
    </motion.a>
  );
}

/**
 * Layer order matters: the scrim sits directly on the photo so it can guarantee
 * contrast, while the grid and the dawn glow stay above it and keep their edge.
 * Without `src` the empty state is the grid and glow alone — a deliberate
 * technical surface, not a hole waiting for stock art.
 *
 * The glow is anchored to the BOTTOM edge, not floated in the middle of the
 * frame. A light source overhead reads as a spotlight; the same light along the
 * bottom edge reads as a horizon about to break — which is the whole premise of
 * the page. `pv-skyglow` puts the identical light at the foot of every section
 * below, so the hero is the first frame of one continuous sunrise rather than a
 * separate picture with its own lighting.
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

      <div className="pv-grain" />
      <div className="pv-grid-bg absolute inset-0 opacity-60" />

      {/* Dawn, still under the horizon. Parallax gives it a slower rate than the
          copy above, so the light reads as far away rather than pasted on.
          The rings ride the same layer so glow and geometry drift together —
          split them and the light detaches from the thing emitting it. */}
      <Parallax amount="subtle" className="absolute inset-0">
        {/* Không thêm `inset-0`: pv-skyglow tự neo vào mép dưới, còn inset-0 đặt
            cả top lẫn bottom nên khung bị ràng buộc thừa và quầng nhảy lên đỉnh. */}
        <div className="pv-skyglow pv-skyglow-hero" />
        <DawnRings />
      </Parallax>

      {/* A cold rim right on the edge — the sharp line the diffuse glow can't
          give on its own, and the seam that hands off to the next section. */}
      <div
        className="absolute inset-x-0 bottom-0 h-px opacity-70"
        style={{
          background:
            "linear-gradient(to right, transparent, var(--brand) 50%, transparent)",
        }}
      />
    </div>
  );
}
