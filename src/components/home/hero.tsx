"use client";

import { CalendarDays, ChevronDown, FileText } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { ScrollStage } from "@/components/motion/parallax";
import { CtaButton } from "@/components/pv/cta-button";
import { Highlight } from "@/components/pv/highlight";
import { DUR, EASE, LIFT, STAGGER } from "@/lib/motion";

/**
 * Hero — §9 Section 1. Cao trọn một viewport, nấc `sky-void`, và là chỗ DUY
 * NHẤT trên site được dùng ScrollStage.
 *
 * NỀN ĐANG TRỐNG (chủ dự án 2026-08-14): ảnh chụp nhung, quầng `pv-skyglow-hero`
 * và vạch brand ở mép dưới đều đã gỡ để đổi sang kế hoạch nền khác. Chỉ còn lớp
 * hạt — `CLAUDE.md` luật 2 bắt mọi nền phải có nó, và hero không dựng bằng
 * `<Section>` nên nó không được cấp sẵn như các section khác.
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
    <section
      data-snap=""
      className="sky-void relative isolate flex min-h-dvh flex-col overflow-hidden"
    >
      <span aria-hidden className="pv-grain -z-10" />

      <div className="relative flex flex-1 flex-col">
        {/* Tỉ lệ vàng theo chiều dọc. `items-center` đặt khối chữ vào tâm
            hình học của màn hình — nhưng tâm quang học của một khung nằm CAO
            hơn tâm hình học, nên bản cũ nhìn như chữ đang chìm giữa hai
            khoảng trống vô danh. Hai spacer chia khoảng trống còn lại theo
            382 : 618 (φ): tiêu đề đậu đúng vạch vàng của màn hình, và phần
            lớn khoảng trống dồn xuống dưới — nửa dưới là chỗ nền hero cần để
            thở, thay vì bị khối chữ đè lên.
            min-h là sàn khi màn hình thấp: trên phải lọt qua header fixed
            (h-16 / lg:h-20), dưới phải chừa chỗ cho ExploreCue neo ở mép. */}
        <div aria-hidden className="min-h-24 flex-[382] lg:min-h-28" />
        <ScrollStage className="pv-container w-full">
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            /* Nhịp dọc theo tỉ lệ chứ không đều nhau. `gap-5` là khoảng cách
               cơ sở giữa tiêu đề và câu dẫn — chúng là MỘT ý, phải dính nhau.
               Hàng nút cách ra `mt-8` (≈1.6×) vì nó là việc phải làm, không
               phải câu phải đọc. Ba khoảng bằng nhau thì ba khối đọc ra là
               một danh sách, không phải một lời chào rồi một lời mời.

               Khổ hẹp căn TRÁI: tiêu đề ba dòng căn giữa ở 375px cho ba mép
               lởm chởm. Từ `sm` còn hai dòng cân nhau nên căn giữa. */
            className="mx-auto flex max-w-5xl flex-col items-start gap-5 text-left sm:items-center sm:text-center"
          >
            {/* Chỗ ngắt dòng nằm trong chuỗi messages (`\n` + `pre-line`), không
                trong JSX: `text-balance` chia hai dòng BẰNG NHAU nên câu gãy
                giữa cụm "…thành năng lực". */}
            <motion.h1
              variants={item}
              className="font-display text-display font-semibold whitespace-pre-line"
            >
              <Highlight>{t("title")}</Highlight>
            </motion.h1>

            <motion.p
              variants={item}
              className="max-w-[58ch] text-lead text-muted-foreground"
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
                <CalendarDays data-icon="inline-start" />
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
      href="#pebble-vina"
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
