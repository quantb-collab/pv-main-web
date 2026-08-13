"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { MediaFrame } from "@/components/motion/media-frame";
import { AppShot } from "@/components/pv/app-shot";
import { BentoGrid, BentoTile } from "@/components/pv/blocks";
/* `Link` của i18n, KHÔNG phải "next/link" — bản này tự gắn tiền tố locale.
   Dùng nhầm thì link ra `/solutions/...` và người đang đọc /en bị đá về vi. */
import { Link } from "@/i18n/navigation";
import { STEPPER } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * ============================================================================
 * KỆ PHẦN MỀM — BENTO + STEPPER GIỚI THIỆU SẢN PHẨM SỐ 1
 * ----------------------------------------------------------------------------
 * Vào section là thấy CẢ BỘ sản phẩm cùng lúc, xếp bento; ô lớn nhất là PV One
 * và chính ô đó là một stepper năm bước giới thiệu sản phẩm. Hai việc trong
 * một khối chứ không phải hai khối chồng nhau — section chỉ cao một màn hình.
 *
 * HÌNH HỘP CỦA Ô LÀ MỘT CÂU CHỮ. Kệ này phải nói được "cùng một lõi, chạy trên
 * mọi cỡ màn hình", mà bốn thẻ bằng nhau thì không nói được gì. Nên:
 *   ô đứng (`1x2`)  → điện thoại
 *   ô nằm (`2x1`)   → web / máy bàn
 *   ô lớn (`2x3`)   → sản phẩm số 1, và là chỗ đủ rộng cho một màn 21:9
 * Đây là lý do `shape` của một sản phẩm quyết định cả span lẫn tỷ lệ ảnh bên
 * trong — hai thứ đó không được rời nhau, ô nằm mà chứa ảnh dọc thì hình hộp
 * đang nói ngược với cái ảnh.
 *
 * ⚠️ "NGẪU NHIÊN" Ở ĐÂY LÀ ĐA DẠNG, KHÔNG PHẢI `Math.random()`. Bốc ngẫu nhiên
 * lúc render thì server và client ra hai lưới khác nhau → hydration mismatch;
 * và một bố cục đổi hình mỗi lần tải thì không còn là bố cục. Thứ tự dưới đây
 * cố định và đã cân: lớn → nằm → đứng → đứng, không có hai ô cùng hình đứng
 * cạnh nhau ở hàng đầu.
 *
 * NHỊP LƯỚT 1,5s VÀ HỆ QUẢ CỦA NÓ (chủ dự án chốt 2026-08-11). Ở tốc độ đọc
 * 200 chữ/phút, 1,5 giây chỉ đủ **5 chữ**. Nên thẻ chỉ còn TÊN MÀN, và toàn bộ
 * phần giải thích chuyển sang bản phóng to — nơi người đọc tự bấm tới lui.
 * Đặt một đoạn văn dưới nhịp này là viết chữ cho không ai đọc; tệ hơn, người ta
 * thấy có chữ rồi cố đọc không kịp. Ba khoá dừng bắt buộc đi kèm: rê chuột hoặc
 * focus, người dùng tự bấm một bước (`taken`, chốt một chiều), và bản phóng to
 * đang mở (`zoomed`).
 *
 * NGÂN SÁCH CHIỀU CAO — đo lại trên trình duyệt ở 1440×900, không phải ước
 * lượng. `--section-y` 8,5rem mỗi đầu (136px) nên section còn 628px:
 *   tiêu đề (eyebrow gộp dòng, KHÔNG lead)               41px
 *   khe `mt-8`                                           32px
 *   lưới 3 hàng × 10,5rem + 2 khe 16                    536px
 * Cộng 609px trên 628px — vừa một màn hình, dư 19px. `lead` của section bị BỎ
 * đúng theo `docs/SOFTWARE-KIT.md` §3: câu dẫn và ảnh sản phẩm nói cùng một
 * việc, giữ cả hai là trả 52px để nói hai lần.
 *
 * Trong ô lớn (3 hàng = 536px, trừ đệm 40 còn 496px):
 *   tên sản phẩm `text-subhead` + nhãn vai, một dòng     41px
 *   khe                                                  16px
 *   khung ảnh 16:9 ở bề rộng 560                        315px
 *   khe 12 + tên màn 28 + khe 8 + dòng chú 17            65px
 *   khe                                                  16px
 *   dãy năm bước                                         28px
 * Cộng 481px, dư 15px.
 *
 * ⚠️ BẢN TRƯỚC ĐỂ LẠI MỘT LỖ 91px ĐÚNG GIỮA Ô LỚN. Hàng 10rem cho ô 512px
 * nhưng nội dung chỉ cần 421px, và vì dãy bước bám đáy bằng `mt-auto` nên toàn
 * bộ phần dư dồn thành MỘT khoảng trống giữa tên màn và dãy bước — 18% chiều
 * cao của ô, nằm ngay dưới thứ quan trọng nhất section. Chỗ đó nay trả về cho
 * ẢNH: khung 16:9 cao hơn 21:9 đúng 75px và tiêu đề to hơn một nấc ăn 13px
 * nữa. Trước khi thêm bất cứ thứ gì vào ô này, đo lại — đừng cộng nhẩm.
 *
 * VÌ SAO 16:9 CHỨ KHÔNG 21:9. Ảnh nguồn là 16:10. Khung 21:9 để lộ 68,6% chiều
 * cao màn, tức `object-cover` xén mất 31% ở chân ảnh — và nó xén ngang giữa một
 * hàng bảng, đọc ra là ảnh bị lỗi chứ không ra một cửa sổ. Khung 16:9 để lộ
 * 90%, phần xén còn 10% và rơi vào dải dưới cùng của màn.
 * Không xén một pixel nào thì phải `ratio="screen"` (16:10, 350px) — cộng 35px
 * nữa, tức hàng phải lên 10,92rem và section vượt 900px. Nó nằm ngoài ngân
 * sách đúng 1px, nên chỉ mở được nếu trả lại chỗ ở một dòng khác.
 *
 * ⚠️ Bản trước đặt cả `sXBody` lẫn `sXQuote` lên thẻ và phải nới hàng lên
 * 11rem, khiến section tràn 8px ở 1440×900. Bỏ hai khối chữ đó thì hàng về
 * được 10rem và hết tràn. Nếu sau này lại thêm chữ vào thẻ thì nhớ: `BentoTile`
 * không có `overflow-hidden`, nên phần vượt track KHÔNG bị cắt mà lòi ra ngoài
 * mặt ô. Trần của hàng là 10,89rem — trên mức đó section vượt 900px.
 *
 * CẤP BẬC CHỮ. Bốn vai trò từng cùng một cỡ 21px: tên sản phẩm số 1, tên một
 * màn trong stepper, và tên ba sản phẩm ở ba ô nhỏ. Lúc đó cấp bậc chỉ còn màu
 * và diện tích ô gánh, chữ không gánh gì. Nay `PV One` lên `text-subhead` (34px)
 * — nó là sản phẩm, ba cái tên kia cũng là sản phẩm nhưng ở ô nhỏ hơn ba lần,
 * còn tên màn chỉ là nhãn của một tấm ảnh. Đừng nâng tên màn lên theo: hai thứ
 * bằng nhau là quay lại đúng chỗ cũ.
 *
 * VÌ SAO KHÔNG DÙNG `Tabs` CỦA shadcn. Ngữ nghĩa thì đúng (tablist/tab/
 * tabpanel) nhưng `TabsTrigger` mang sẵn `text-sm`, `flex-1`, gạch chân `after:`
 * và sáu luật `dark:`; ghi đè hết chỗ đó — và phải khai kèm cặp `dark:` cho
 * từng cái, theo cảnh báo của skill `pv-ui` — dài hơn và dễ hỏng hơn 25 dòng
 * vai trò ARIA viết tay ở dưới. Bàn phím và roving tabindex vẫn làm đủ.
 *
 * ẢNH: năm màn PV One đã có thật ở `public/software/` (render 2× từ chính bộ
 * bàn giao, xem `SOFTWARE-KIT.md` §8), nên ô lớn dùng `AppShot` — bấm vào ảnh
 * là mở bản đầy đủ đọc được. Ba ô nhỏ chưa có ảnh nên vẫn là ô chờ kèm `need`;
 * điền = thêm một dòng vào `PRODUCT_SRC` trong `sections.tsx`.
 *
 * Ô lớn có ảnh thì KHÔNG được dùng `MediaFrame` trần thay cho `AppShot`: ở khổ
 * thẻ, màn 1440px thu về ~600px là 0,42× — chữ 13px thành 5,5px. Poster đó chỉ
 * nói "có một phần mềm thật", còn chỗ ĐỌC được là bản phóng to. Bỏ `AppShot`
 * là bỏ luôn chỗ đọc, và ảnh thành đồ trang trí.
 * ============================================================================
 */

export interface BentoStep {
  /** Nhãn mono: engine hoặc tầng license mà bước này bán. */
  label: string;
  title: string;
  /** MỘT đoạn ngắn. Dài hơn ba dòng thì ô lớn vỡ ngân sách chiều cao. */
  body: string;
  /** Đoạn dài: màn này nói về cái gì. Chỉ hiện ở bản phóng to. */
  story: string;
  /** Câu chốt của màn, lấy nguyên từ bộ bàn giao POC. */
  quote: string;
  need: string;
  src?: string;
  /** Theo công thức của kit §11: "Màn X của PV One: việc đang diễn ra". */
  alt: string;
}

/** Nhãn cho phần phóng to ảnh. Gom lại một cục để `AppShot` khỏi nhận rời
 *  ba prop chuỗi, và để chỗ dùng thấy ngay là còn thiếu nhãn nào. */
export interface ShotLabels {
  sample: string;
  zoom: string;
  /** Chỉ dẫn vuốt dưới khung ảnh phóng to ở khổ hẹp. */
  pan: string;
  /** Nhãn nhóm và hai nhãn của cặp nút chọn cách xem ảnh phóng to (dưới `lg`). */
  view: string;
  fit: string;
  read: string;
  close: string;
  prev: string;
  next: string;
  /** Nhãn nút dừng nhịp lướt, và nhãn của chính nút đó khi đang dừng. */
  pause: string;
  resume: string;
}

export interface BentoProduct {
  /** Vai của sản phẩm trong bộ. Mono, viết hoa. */
  label: string;
  name: string;
  lead: string;
  need: string;
  src?: string;
  /** Trang đi sâu. Cả thẻ thành link. */
  href: string;
  /** Hình hộp — và cũng là cỡ màn hình mà sản phẩm này chạy trên đó. */
  shape: "web" | "phone";
}

export function SoftwareBento({
  header,
  action,
  hero,
  products,
  stepsLabel,
  labels,
  className,
}: {
  /** Tiêu đề section. Nhận vào đây để nút phụ đứng cùng hàng với nó — một
   *  hàng nút riêng tốn 44px của ngân sách chiều cao. */
  header?: ReactNode;
  action?: ReactNode;
  hero: { label: string; name: string; steps: BentoStep[] };
  products: BentoProduct[];
  /** aria-label cho dãy bước. Bắt buộc: một dãy `01…05` không tự khai nó là gì. */
  stepsLabel: string;
  labels: ShotLabels;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
        {header}
        {action}
      </div>

      {/* Chiều cao hàng chỉ cố định từ `lg` — dưới đó lưới xuống 1–2 cột và ô
          tự co theo nội dung, ép chiều cao ở khổ hẹp chỉ tạo ra ô rỗng. */}
      <BentoGrid className="mt-8 lg:auto-rows-[10.5rem]">
        <HeroTile hero={hero} stepsLabel={stepsLabel} labels={labels} />
        {products.map((product) => (
          <ProductTile key={product.name} product={product} />
        ))}
      </BentoGrid>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Ô lớn — sản phẩm số 1, và là stepper năm bước                               */
/* -------------------------------------------------------------------------- */

function HeroTile({
  hero,
  stepsLabel,
  labels,
}: {
  hero: { label: string; name: string; steps: BentoStep[] };
  stepsLabel: string;
  labels: ShotLabels;
}) {
  const steps = hero.steps;
  const count = steps.length;
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  /* Bấm một bước là dừng lướt — ở nhịp 1,5s mà vẫn chạy tiếp sau khi người ta
     chọn thì đúng 1,5 giây sau lựa chọn của họ bị giật mất, và họ sẽ bấm lại,
     rồi lại mất.
     ⚠️ Đây CŨNG là lối thoát mà WCAG 2.2.2 đòi, nên nó không được là chốt một
     chiều nữa: một khối tự đổi nội dung vô hạn phải có cách dừng THẤY ĐƯỢC.
     Rê chuột và focus cũng dừng, nhưng màn cảm ứng không có cả hai. Vì vậy có
     thêm một nút bấm được, và nó bật lại được. */
  const [paused, setPaused] = useState(false);

  const uid = useId();
  const tabId = (i: number) => `${uid}-tab-${i}`;
  const panelId = `${uid}-panel`;

  const ref = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  /* `once: false` — ra khỏi khung nhìn thì dừng đếm. Một stepper chạy dưới
     chân trang là bốn lần render mỗi phút cho không ai xem. */
  const inView = useInView(ref, { amount: 0.4 });

  const running = !reduced && !held && !paused && !zoomed && inView && count > 1;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(
      () => setActive((i) => (i + 1) % count),
      STEPPER.auto,
    );
    return () => clearInterval(id);
  }, [running, count]);

  /* Bàn phím của một tablist: mũi tên đi vòng, Home/End về hai đầu. Chọn xong
     thì kéo focus theo — roving tabindex chỉ đúng khi focus và `aria-selected`
     cùng nằm ở một nút. */
  const select = useCallback(
    (i: number, focus = false) => {
      const next = ((i % count) + count) % count;
      setActive(next);
      setPaused(true);
      if (focus) {
        const el = tabsRef.current?.querySelectorAll("[role=tab]")[next];
        (el as HTMLElement | undefined)?.focus();
      }
    },
    [count],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    const key = e.key;
    if (key === "ArrowRight") select(active + 1, true);
    else if (key === "ArrowLeft") select(active - 1, true);
    else if (key === "Home") select(0, true);
    else if (key === "End") select(count - 1, true);
    else return;
    e.preventDefault();
  };

  /* KHÔNG viết thẳng `steps[active].src`. Danh sách bước dò bằng `t.has` nên
     nó rỗng được — gõ sai một khoá, hoặc dev server giữ bản messages cũ (bẫy
     quen của repo này) — và lúc đó `steps[0]` là `undefined`, đọc `.src` trên
     nó là ném lỗi và sập CẢ TRANG CHỦ vì một khoá thiếu. Thiếu dữ liệu thì ô
     lớn tụt về còn tên sản phẩm, không kéo theo cái gì khác. */
  const step: BentoStep | undefined = steps[active];

  return (
    <BentoTile
      span="2x3"
      chrome="mid"
      /* `justify-start` đè `justify-center` của BentoTile: ô này chứa một cột
         nội dung cao gần kín ô, căn giữa thì dãy bước rời khỏi đáy và ba ô
         bên cạnh hết thẳng hàng với nó. */
      className="justify-start gap-4 p-5 lg:p-5"
    >
      {/* Rê chuột hoặc focus vào bất cứ đâu trong ô thì dừng đếm — người ta
          đang đọc. `focus`/`blur` của React nổi bọt nên không cần capture. */}
      <div
        ref={ref}
        className="flex h-full flex-col gap-4"
        onMouseEnter={() => setHeld(true)}
        onMouseLeave={() => setHeld(false)}
        onFocus={() => setHeld(true)}
        onBlur={() => setHeld(false)}
      >
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          {/* Nhãn vai đứng CÙNG DÒNG với tên chứ không nằm trên như ở ba ô nhỏ,
              và đó là chủ ý: xếp chồng tốn thêm 21px mà ngân sách ô chỉ dư 15.
              Cấp bậc vẫn đọc được vì cỡ chữ đã chênh hẳn một nấc. */}
          <h3 className="font-display text-subhead font-semibold text-brand-ink">
            {hero.name}
          </h3>
          <p className="font-mono text-eyebrow font-medium text-subtle-foreground uppercase">
            {hero.label}
          </p>
        </div>

        {/* `bg-transparent`: `MediaFrame` mặc định nền `bg-surface`, mà nền đó
            phủ một mảng phẳng lên đúng khúc giữa gradient của ô và làm mất
            hiệu ứng khối. */}
        {step ? (
          <div
            id={panelId}
            role="tabpanel"
            aria-labelledby={tabId(active)}
            className="flex flex-1 flex-col"
          >
            {/* KHÔNG đặt `key={active}` ở đây: đổi `key` là unmount rồi mount
                lại, mà `Dialog` nằm bên trong `AppShot` — bản phóng to sẽ tự
                đóng đúng lúc người dùng bấm sang màn kế. Ảnh thay tại chỗ.
                Có ảnh thì dùng `AppShot` (bấm vào phóng to, có hàng chú và
                nhãn dữ liệu mẫu); chưa có thì `MediaFrame` tự hiện ô chờ. */}
            {step.src ? (
              <AppShot
                src={step.src}
                alt={step.alt}
                ratio="wide"
                product={hero.name}
                detail={{
                  label: step.label,
                  title: step.title,
                  body: step.body,
                  story: step.story,
                  quote: step.quote,
                }}
                /*
                  TÊN MÀN ĐI QUA `heading` ĐỂ NẰM NGAY DƯỚI ẢNH, TRÊN DÒNG CHÚ.
                  Trước đây nó là phần tử anh em đứng SAU `AppShot`, nên dòng
                  chú (`ONE CORE · DỮ LIỆU MẪU` / `XEM ẢNH LỚN`) chen vào giữa
                  ảnh và tên của chính ảnh đó — nhãn engine đọc ra là chrome của
                  khung, không đọc ra eyebrow của tiêu đề.

                  CHỈ CÒN TÊN MÀN TRÊN THẺ. Ở nhịp lướt 1,5s, tốc độ đọc 200
                  chữ/phút chỉ kịp **5 chữ** — đặt một đoạn văn dưới nhịp đó là
                  viết chữ cho không ai đọc, và tệ hơn là làm người ta thấy có
                  chữ rồi cố đọc không kịp. Tên màn 2–4 chữ thì liếc là bắt
                  được. Toàn bộ phần giải thích nằm ở bản phóng to, nơi người
                  đọc tự bấm tới lui theo nhịp của mình.
                */
                heading={
                  <h4 className="font-display text-title font-semibold">
                    {step.title}
                  </h4>
                }
                labels={labels}
                open={zoomed}
                onOpenChange={setZoomed}
                nav={{
                  index: active,
                  count,
                  onPrev: () => select(active - 1),
                  onNext: () => select(active + 1),
                  prevLabel: labels.prev,
                  nextLabel: labels.next,
                }}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
              />
            ) : (
              /* Chưa có ảnh: ô chờ cùng tỷ lệ, và tên màn phải tự đứng ra vì
                 không có `AppShot` để nhận nó qua `heading`. Khe 12px giữ đúng
                 bằng khe `mt-3` bên trong `AppShot`. */
              <>
                <MediaFrame
                  key={active}
                  ratio="wide"
                  need={step.need}
                  className="border-0 bg-transparent"
                />
                <h4 className="mt-3 font-display text-title font-semibold">
                  {step.title}
                </h4>
              </>
            )}
          </div>
        ) : null}

        {/*
          DÃY NĂM BƯỚC cộng một nút dừng. Mỗi bước là một vạch ngang cộng một số
          mono — vạch cho biết đang ở đâu trong năm bước kể cả khi liếc qua, số
          cho biết bấm được. Chấm tròn thì không nói được "còn mấy bước nữa".

          Nút dừng đứng NGOÀI `tablist`: một nút không phải `role=tab` nằm trong
          tablist là phá đúng cái mẫu ARIA mà dãy này đang khai.
        */}
        <div className="mt-auto flex items-end gap-3">
          <div
            ref={tabsRef}
            role="tablist"
            aria-label={stepsLabel}
            aria-orientation="horizontal"
            onKeyDown={onKeyDown}
            /* Một bước thì không có gì để chuyển: `hidden` chứ không bỏ hẳn, để
               `tabsRef` vẫn có chỗ bám và `aria-controls` không trỏ vào hư vô. */
            className={cn("flex flex-1 gap-2", count < 2 && "hidden")}
          >
            {steps.map((s, i) => {
              const on = i === active;
              return (
                <button
                  key={s.title}
                  type="button"
                  id={tabId(i)}
                  role="tab"
                  aria-selected={on}
                  aria-controls={panelId}
                  tabIndex={on ? 0 : -1}
                  onClick={() => select(i)}
                  /* Vùng chạm nới XUỐNG bằng một pseudo-element, không bằng
                     padding: nút chỉ cao 28px (vạch + số mono), nhưng thêm
                     padding thật thì dãy bước đội lên và ô lớn vỡ ngân sách
                     chiều cao — ô chỉ dư 15px ở 1440×900. `after` không chiếm
                     dòng nào mà vẫn nhận chạm, nên vùng chạm thành 44px trong
                     khi bố cục không đổi một pixel. Nới xuống chứ không nới đều
                     hai đầu: phía trên là lớp bấm phủ ảnh của `AppShot`, chồng
                     lên đó là cướp cú chạm của chính tấm ảnh. 16px nới thêm nằm
                     gọn trong `p-5` ở chân ô. */
                  className="group/step relative flex flex-1 cursor-pointer flex-col gap-1.5 rounded-control pt-1 pb-0.5 text-left after:absolute after:inset-x-0 after:top-0 after:-bottom-4 after:content-[''] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <span
                    aria-hidden
                    className={cn(
                      "h-px w-full transition-colors duration-(--dur-base)",
                      on
                        ? "bg-brand"
                        : "bg-border group-hover/step:bg-brand/40",
                    )}
                  />
                  <span
                    className={cn(
                      "font-mono text-micro font-medium tabular-nums transition-colors duration-(--dur-base)",
                      on ? "text-brand-ink" : "text-subtle-foreground",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="sr-only">{s.title}</span>
                </button>
              );
            })}
          </div>

          {count > 1 ? (
            <PauseButton
              paused={paused}
              onToggle={() => setPaused((p) => !p)}
              label={paused ? labels.resume : labels.pause}
            />
          ) : null}
        </div>
      </div>
    </BentoTile>
  );
}

/** Nút dừng/chạy nhịp lướt. Chỉ có biểu tượng trên mặt trang — nhãn chữ nằm ở
 *  `sr-only` vì hai chữ tiếng Việt cạnh dãy năm số mono là thêm một tầng chữ
 *  vào chỗ đã chật, mà hình hai vạch và hình tam giác thì không cần dịch.
 *  Vẽ bằng SVG chứ không dùng ký tự ▮▶: ký tự đổi hình theo font. */
function PauseButton({
  paused,
  onToggle,
  label,
}: {
  paused: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-control text-subtle-foreground transition-colors duration-(--dur-fast) hover:bg-surface-2 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        fill="currentColor"
        className="size-3.5"
      >
        {paused ? (
          <path d="M5 3.2v9.6l7.5-4.8z" />
        ) : (
          <path d="M4.5 3h2.2v10H4.5zm4.8 0h2.2v10H9.3z" />
        )}
      </svg>
      <span className="sr-only">{label}</span>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Ô thường — một sản phẩm, hình hộp nói ra cỡ màn hình                        */
/* -------------------------------------------------------------------------- */

function ProductTile({ product }: { product: BentoProduct }) {
  const phone = product.shape === "phone";

  return (
    <BentoTile
      span={phone ? "1x2" : "2x1"}
      chrome="low"
      className="justify-start p-0 lg:p-0"
    >
      {/* CẢ THẺ LÀ LINK: thẻ đã có ảnh, tên và một câu — thêm một nhãn "xem
          thêm" nữa là tốn một dòng cho thứ hình thù cái thẻ đã nói. Ô lớn thì
          KHÔNG phải link vì bên trong nó đã có năm nút bước. */}
      {/* CĂN TRÁI Ở CẢ HAI HÌNH HỘP. Bản trước để ô đứng căn giữa còn ô nằm căn
          trái, nên ba ô đứng cạnh nhau trong cùng một lưới nói hai thứ tiếng.
          Hình hộp đã đủ để phân biệt điện thoại với máy bàn; đổi thêm cách căn
          là đổi thứ không mang thông tin gì.

          ── DƯỚI `lg` LÀ MỘT HÀNG NGANG, KHÔNG PHẢI MỘT Ô ĐỨNG (2026-08-14) ──
          Hình hộp chỉ NÓI được cỡ màn hình khi lưới còn span để dựng hình hộp
          đó, và `BENTO_SPAN` khai `1x2`/`2x3` từ `lg` trở lên. Dưới `lg` cả bốn
          ô rơi về một cột rộng bằng nhau, nên "ô đứng" không còn đứng so với
          cái gì — nó chỉ còn là một khung ảnh dọc 168px chiếm 326px chiều cao.
          Đo ở 375: PV One 378px, ba ô sản phẩm 919px. Tức ba khung chờ RỖNG ăn
          gấp 2,4 lần sản phẩm số 1 — cấp bậc của kệ lộn ngược đúng ở khổ máy mà
          người ta xem nhiều nhất. Ở 900 còn tệ hơn: ô 410px chỉ dùng 168px bên
          trái, nửa phải trống trơn.

          Nên dưới `lg` cả ba ô đọc như một DANH SÁCH: thumb nhỏ bên trái, chữ
          bên phải, mỗi ô một hàng. Hình hộp quay lại đúng lúc lưới có span để
          dựng nó — từ `lg`. */}
      <Link
        href={product.href}
        className={cn(
          "group/tile flex h-full flex-row items-center gap-4 rounded-[inherit] p-5 transition-transform duration-(--dur-base) hover:-translate-y-1",
          phone && "lg:flex-col lg:items-start",
        )}
      >
        {/* Ô chờ bản CÂM ở đây: bốn khung chờ đứng cạnh nhau mà cái nào cũng
            đeo badge vàng thì kệ đọc ra là một bức tường cảnh báo.

            Thumb co theo khổ: 96px ở điện thoại (chừa 183px cho cột chữ ở 375 —
            đủ ~22 ký tự một dòng), 128px từ `sm`, và chỉ ở `lg` mới trả về bề
            ngang gốc, nơi ô đứng lại là ô đứng. */}
        <MediaFrame
          ratio={phone ? "portrait" : "landscape"}
          src={product.src}
          alt={product.src ? product.name : undefined}
          need={product.need}
          compact
          sizes="(min-width: 1024px) 180px, (min-width: 640px) 128px, 96px"
          className={cn(
            "w-24 shrink-0 bg-transparent sm:w-32",
            phone ? "lg:w-[10.5rem]" : "lg:w-[9.375rem]",
          )}
        />

        <div className="flex flex-col gap-1">
          <p className="font-mono text-eyebrow font-medium text-subtle-foreground uppercase">
            {product.label}
          </p>
          <h3 className="font-display text-title font-semibold">
            {product.name}
          </h3>
          {/* Ô đứng hẹp (~250px) chỉ đủ chỗ cho tên; câu dẫn của nó vẫn phải
              tới được trình đọc màn hình nên chuyển thành `sr-only` chứ không
              bị cắt đi. Chỉ từ `lg` — dưới đó ô là một hàng ngang và cột chữ
              rộng 183px ở 375, 226px ở 900, tức thừa chỗ cho câu dẫn. Giấu nó
              ở khổ hẹp là bỏ đúng câu nói ERP và MES khác nhau ở chỗ nào. */}
          <p
            className={cn(
              "text-body-sm text-muted-foreground",
              phone && "lg:sr-only",
            )}
          >
            {product.lead}
          </p>
        </div>
      </Link>
    </BentoTile>
  );
}
