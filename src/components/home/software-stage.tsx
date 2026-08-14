"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { MediaFrame } from "@/components/motion/media-frame";
import { Reveal } from "@/components/motion/reveal";
import { AppShot, type AppShotDetail } from "@/components/pv/app-shot";
import { Gap } from "@/components/pv/gap";
import { STAGE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * ============================================================================
 * SÂN KHẤU SẢN PHẨM PHẦN MỀM — một sản phẩm mỗi lúc, sản phẩm kế ló ra mép phải
 * ----------------------------------------------------------------------------
 * Thay cho bento bốn ô (`software-bento.tsx`, đã xoá — còn trong git nếu cần
 * đọc lại). Chủ dự án chốt 2026-08-14: "không dùng card nữa, làm dạng slide
 * show, sản phẩm đi từ trái qua phải".
 *
 * VÌ SAO ĐỔI ĐƯỢC MÀ KHÔNG MẤT GÌ. Bento bày CẢ BỘ cùng lúc, nên nó phải chia
 * diện tích: một ô lớn cho sản phẩm số 1 và ba ô nhỏ ~1/3 cỡ đó. Ba ô nhỏ chỉ
 * còn chỗ cho một tấm ảnh 150–180px và hai dòng chữ — tức chúng bày được sự tồn
 * tại của sản phẩm chứ không bày được sản phẩm. Sân khấu trả cho MỌI sản phẩm
 * cùng một khung ảnh lớn; giá phải trả là không còn thấy cả bộ trong một cái
 * liếc, và DÃY CHỌN gánh phần đó — nó in đủ TÊN cả bốn, luôn hiện.
 *
 * ── BA THỨ SỬA SAU KHI NHÌN BẢN CHỤP THẬT (cùng ngày) ──────────────────────
 *
 * 1. CHỮ VÀ DÃY CHỌN RA NGOÀI BĂNG TRƯỢT. Bản đầu nhét cả ảnh lẫn chữ vào mỗi
 *    slide, cột chữ 20rem căn giữa cạnh một tấm ảnh cao 411px. Cụm chữ chỉ cao
 *    ~140px nên bên dưới nó rỗng ~180px — đúng cái lỗ mà bento đã mất công lấp
 *    một phiên trước, dựng lại to gấp đôi. Nay chỉ ẢNH trượt; chữ và dãy chọn
 *    đứng yên ở cột phải, chữ neo TRÊN và dãy chọn neo DƯỚI. Khoảng hở giữa hai
 *    cụm neo hai đầu đọc ra là bố cục; khoảng hở dưới một cụm căn giữa đọc ra là
 *    lỗ thủng. Hệ quả kèm theo: ảnh ăn trọn cột trái (767px thay vì 658px, tức
 *    0,53× cỡ thiết kế thay vì 0,46×).
 *
 * 2. KHÔNG TỰ TRÔI VÀO Ô CHỜ. Sản phẩm chưa có nội dung thì không nằm trong
 *    vòng tự chạy — `autoOrder` bên dưới chỉ gom sản phẩm đã "chín" (có ảnh
 *    thật hoặc có lời dẫn). Bấm vào vẫn xem được. Không có luật này thì cứ 5,2
 *    giây trang bán hàng lại tự đẩy khách vào một khung cảnh báo màu cam. Khi
 *    chỉ còn một sản phẩm chín thì KHÔNG có gì tự chạy, và nút tạm dừng cũng
 *    biến mất — một nút dừng thứ không chạy là một nút nói dối.
 *
 * 3. KHÔNG PHỦ GRADIENT MỜ LÊN MÉP LÓ. Cách quen của carousel là mask mờ dần ở
 *    mép để phần ló trông "chìm". Ở đây phần ló có thể là ảnh chụp giao diện,
 *    mà `docs/SOFTWARE-KIT.md` cấm vẽ đè màu hay gradient lên ảnh sản phẩm — và
 *    cấm cả hạ `opacity`, vì chỉnh màu ảnh sản phẩm là nói dối về sản phẩm. Nên
 *    mép ló để nguyên, chỉ thu hẹp lại, và việc "còn nữa" do dãy chọn nói.
 *
 * MÉP LÓ LÀ MỘT CÂU CHỮ, KHÔNG PHẢI TRANG TRÍ. Một slide chiếm trọn bề ngang
 * đọc ra là một khối tĩnh. Chừa ~12% cho slide kế là cách rẻ nhất để nói "còn
 * nữa" mà không tốn một dòng chữ nào. Đây cũng là lý do bề ngang slide khai
 * bằng `cqw` chứ không bằng `%`: `%` trong `translateX` tính theo bề ngang của
 * CHÍNH cái băng (tổng bốn slide), còn `cqw` tính theo khung sân khấu — thứ ta
 * thật sự muốn lấy làm mốc. Không có `cqw` thì phải đo bằng JS, và đo bằng JS
 * thì lần render đầu tiên trên máy chủ không có số để đặt.
 *
 * ⚠️ SLIDE CUỐI ĐƯỢC KẸP BẰNG `clamp`, KHÔNG TRƯỢT ĐỀU TỚI CÙNG. Trượt đều thì
 * tới slide cuối bên phải còn một mảng trống đúng bằng phần đáng lẽ dành cho
 * slide kế — đọc ra là bố cục hỏng. Kẹp lại thì slide cuối áp mép phải và slide
 * áp chót ló ra bên TRÁI; cùng một cơ chế "còn nữa", chỉ đổi phía.
 *
 * NGÂN SÁCH CHIỀU CAO — section cao trọn một màn, đo ở 1440×900. `--section-y`
 * 8,5rem mỗi đầu nên còn 628px:
 *   hàng tiêu đề (eyebrow gộp dòng, KHÔNG lead)          41px
 *   khe `mt-8`                                           32px
 *   hàng sân khấu                                       504px
 * Cộng 577px trên 628px. Cột phải cao bằng cột ảnh (504px) và chứa: cụm chữ
 * ~138px neo trên, dãy chọn ~230px neo dưới.
 *
 * Cột trái ở `lg`: 1216 − 320 (cột phải) − 24 (khe) = 872px sân khấu;
 * slide 88cqw = 767px; khung 16:10 = 479px; cộng dòng chú 25px = 504px.
 *
 * `screen` (16:10) = ĐÚNG tỷ lệ ảnh nguồn, tức `object-cover` không xén một
 * pixel nào. Bento cũ phải dùng `wide` (16:9) và mất 10% chân màn vì ngân sách
 * khi đó vượt đúng 1px.
 *
 * KHỔ HẸP. Ba thứ đổi, không phải một:
 *   · Thứ tự đọc đảo lại — chữ TRƯỚC, ảnh SAU, dãy chọn cuối. Ở `lg` mắt đi
 *     ngang (ảnh → chữ) nên ảnh đứng trước được; xếp dọc thì một tấm ảnh giao
 *     diện chưa có tên đứng ngay dưới tiêu đề section là bắt người ta đoán.
 *   · Dãy chọn nằm NGANG (vạch trên + tên dưới), không phải dọc — dọc ăn 230px
 *     chiều cao của một màn 812px.
 *   · Vùng bấm ≥44px cho mọi nút (`min-h-11`, nút dừng `size-11`). Ở `lg` chúng
 *     co lại vì chuột không cần 44px.
 *
 * KÉO ĐƯỢC, VÀ CÚ KÉO PHẢI NUỐT CÚ BẤM THEO SAU NÓ. `AppShot` phủ một lớp bấm
 * trong suốt lên ảnh để mở bản phóng to; kéo ngang bắt đầu từ trên tấm ảnh sẽ
 * kết thúc bằng một sự kiện `click` trên chính lớp đó, và bản phóng to bật lên
 * ngay sau khi người dùng chỉ định lật slide. `onClickCapture` ở dưới chặn đúng
 * cú bấm đó — chặn ở pha capture chứ không pha bubble, vì lớp phủ nằm SÂU hơn.
 *
 * Nhịp tự chạy tắt khi: giảm chuyển động, rê chuột, focus, đang kéo, bản phóng
 * to đang mở, người dùng đã tự chọn một sản phẩm, hoặc section ra khỏi khung
 * nhìn. Thêm một nút dừng thấy được — WCAG 2.2.2, và màn cảm ứng không có rê
 * chuột lẫn focus.
 * ============================================================================
 */

export interface StageShot {
  src: string;
  alt: string;
  detail: AppShotDetail;
}

export interface StageProduct {
  name: string;
  /** Vai của sản phẩm trong bộ. Bỏ trống = chưa chốt, cột phải không hiện nhãn. */
  label?: string;
  /** MỘT câu. Bỏ trống thì `pending` đứng thay. */
  lead?: string;
  /** Câu ô chờ khi chưa có `lead`. Viết như một yêu cầu giao việc. */
  pending?: string;
  /** Ảnh cần chụp gì, khi chưa có `shot`. */
  need: string;
  /** Có ảnh giao diện thật thì slide dùng `AppShot` (bấm vào đọc được). */
  shot?: StageShot;
}

export interface StageLabels {
  sample: string;
  zoom: string;
  close: string;
  pause: string;
  resume: string;
  /** aria-label cho dãy chọn — một hàng tên trần không tự khai nó là gì. */
  rail: string;
}

/** Sản phẩm đã đủ nội dung để đứng một mình trên sân khấu. Ô chờ thì chưa. */
const isReady = (p: StageProduct) => Boolean(p.shot ?? p.lead);

/**
 * Dãy chọn nằm dọc từ `lg`, nằm ngang ở dưới. `aria-orientation` và phím mũi
 * tên phải đi theo hướng THẬT, nếu không người dùng bàn phím bấm mũi tên theo
 * chiều họ nhìn thấy mà không có gì xảy ra.
 * Máy chủ không biết bề ngang cửa sổ nên lần render đầu trả `false` (ngang, cũng
 * là mặc định của ARIA), rồi effect sửa lại — `aria-orientation` không vẽ ra
 * pixel nào nên không có nhấp nháy.
 */
function useVerticalRail() {
  const [vertical, setVertical] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 64rem)");
    const sync = () => setVertical(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return vertical;
}

export function SoftwareStage({
  header,
  action,
  products,
  labels,
  className,
}: {
  /** Nhận vào đây để nút phụ đứng cùng hàng tiêu đề — một hàng nút riêng tốn
   *  44px của ngân sách chiều cao. */
  header?: ReactNode;
  action?: ReactNode;
  products: StageProduct[];
  labels: StageLabels;
  className?: string;
}) {
  const count = products.length;
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const [paused, setPaused] = useState(false);
  /* Chỉ số slide đang mở bản phóng to, `null` là không có. Giữ theo CHỈ SỐ chứ
     không phải một cờ boolean: hôm nay mới một sản phẩm có ảnh thật, nhưng một
     cờ dùng chung sẽ mở đồng thời mọi dialog ngay khi sản phẩm thứ hai có ảnh. */
  const [zoomed, setZoomed] = useState<number | null>(null);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);

  const uid = useId();
  const tabId = (i: number) => `${uid}-tab-${i}`;
  const panelId = (i: number) => `${uid}-panel-${i}`;

  const stageRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  /* Cú kéo đã đi đủ xa để KHÔNG còn là một cú bấm. Giữ ở ref chứ không ở state:
     nó được đọc trong `onClickCapture`, tức trong cùng một vòng sự kiện với cú
     thả tay — một lần `setState` không kịp có mặt ở đó. */
  const moved = useRef(false);

  const reduced = useReducedMotion();
  const vertical = useVerticalRail();
  /* `once: false` — ra khỏi khung nhìn thì dừng đếm. Một sân khấu chạy dưới
     chân trang là đổi slide cho không ai xem. */
  const inView = useInView(stageRef, { amount: 0.4 });

  /* Vòng tự chạy CHỈ đi qua sản phẩm đã chín — xem điểm 2 ở đầu file. */
  const autoOrder = products.flatMap((p, i) => (isReady(p) ? [i] : []));
  const autoplay = autoOrder.length > 1;

  const running =
    !reduced &&
    !held &&
    !paused &&
    !dragging &&
    zoomed === null &&
    inView &&
    autoplay;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setActive((i) => {
        /* Đứng ở một sản phẩm chưa chín (người dùng vừa bấm vào) thì bước kế là
           sản phẩm chín ĐẦU TIÊN sau nó, không phải phần tử kế trong `autoOrder`. */
        const next = autoOrder.find((j) => j > i);
        return next ?? autoOrder[0];
      });
    }, STAGE.auto);
    return () => clearInterval(id);
    /* `autoOrder` dựng lại mỗi lần render nhưng nội dung chỉ đổi khi `products`
       đổi; khoá theo chuỗi để effect không tự huỷ mỗi render. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, autoOrder.join()]);

  /* Chọn tay thì dừng nhịp: người ta vừa nói mình muốn xem cái nào, mà 5,2 giây
     sau nó tự trôi mất thì họ sẽ chọn lại, rồi lại mất. */
  const select = useCallback(
    (i: number, focus = false) => {
      const next = ((i % count) + count) % count;
      setActive(next);
      setPaused(true);
      if (focus) {
        const el = railRef.current?.querySelectorAll("[role=tab]")[next];
        (el as HTMLElement | undefined)?.focus();
      }
    },
    [count],
  );

  /* Bàn phím của một tablist. Nhận CẢ hai cặp mũi tên vì dãy đổi hướng theo khổ
     màn: người dùng bấm theo chiều họ nhìn thấy. Home/End về hai đầu. */
  const onKeyDown = (e: React.KeyboardEvent) => {
    const key = e.key;
    if (key === "ArrowRight" || key === "ArrowDown") select(active + 1, true);
    else if (key === "ArrowLeft" || key === "ArrowUp") select(active - 1, true);
    else if (key === "Home") select(0, true);
    else if (key === "End") select(count - 1, true);
    else return;
    e.preventDefault();
  };

  /* -------- kéo ngang -------------------------------------------------- */

  const onPointerDown = (e: React.PointerEvent) => {
    /* Chuột phải và chuột giữa không phải cử chỉ kéo. */
    if (e.pointerType === "mouse" && e.button !== 0) return;
    startX.current = e.clientX;
    moved.current = false;
    setDragging(true);
    /* Bắt con trỏ để cú kéo còn sống khi tay đi ra ngoài sân khấu — không bắt
       thì thả tay ở ngoài là băng đứng lại giữa hai slide. */
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - startX.current;
    /* 6px là ngưỡng rung tay. Dưới mức đó vẫn coi là một cú bấm, để bấm vào ảnh
       mở được bản phóng to. */
    if (Math.abs(dx) > 6) moved.current = true;
    setDrag(dx);
  };

  const onPointerUp = () => {
    if (!dragging) return;
    const width = stageRef.current?.clientWidth ?? 0;
    /* Sàn 48px cho màn hẹp, còn lại lấy 12% bề ngang sân khấu. Ngưỡng cố định
       theo px thì trên màn 1440 nó là một cú nhích, còn theo % thuần thì trên
       375 nó đòi kéo gần nửa màn. */
    const threshold = Math.max(48, width * 0.12);
    const dx = drag;
    setDragging(false);
    setDrag(0);
    if (dx <= -threshold) select(Math.min(active + 1, count - 1));
    else if (dx >= threshold) select(Math.max(active - 1, 0));
  };

  /* Xem khối chú thích đầu file: chặn cú bấm sinh ra từ chính cú kéo vừa xong,
     ở pha capture vì lớp bấm của `AppShot` nằm sâu hơn phần tử này. */
  const onClickCapture = (e: React.MouseEvent) => {
    if (!moved.current) return;
    moved.current = false;
    e.preventDefault();
    e.stopPropagation();
  };

  /* Quãng trượt của băng, tính bằng CSS thuần để lần render đầu trên máy chủ đã
     đúng chỗ. `--slide-pct` là một SỐ TRẦN (không đơn vị) nên nhân được với cả
     `1cqw` lẫn số slide; `clamp` lo phần kẹp ở hai đầu — xem chú thích đầu file.
     Trần của `clamp` âm khi cả bộ hẹp hơn sân khấu (một slide), lúc đó `clamp`
     trả về cận dưới `0px`, tức băng đứng yên. Đúng ý.

     Viết PHẲNG từng số hạng (`n * var(--slide-pct) * 1cqw`) chứ không gom nhóm
     rồi nhân với đơn vị. Cả hai dạng Chrome đều tính đúng — dạng phẳng chỉ dễ
     đọc hơn khi phải dò bằng `getComputedStyle`.

     ⚠️ BẪY KHI ĐI ĐO CHỖ NÀY. Chrome headless CÓ LÚC không chạy
     `requestAnimationFrame` — trong cùng một phiên đo được cả hai: một lần 40
     khung liên tiếp trong 600ms cho 0 lần gọi, lần sau đủ 40. Khi nó không
     chạy thì mọi transition đóng băng ở `currentTime: 0`, nên
     `getComputedStyle(track).transform` trả `matrix(1,0,0,1,0,0)` SAU KHI đã
     bấm sang slide khác — đọc ra y hệt một cái transform bị CSS loại, và dễ
     ngồi sửa một lỗi không có thật. Cùng nguyên nhân đó làm `Reveal` đứng ở
     `opacity: 0`. Đừng tin số đo nếu chưa ép chạy hết trước khi đo:
       track.getAnimations().forEach((a) => a.finish()) */
  const shift = `clamp(0px, ${active} * var(--slide-pct) * 1cqw + ${active} * var(--slide-gap), ${count} * var(--slide-pct) * 1cqw - 100cqw + ${count - 1} * var(--slide-gap))`;

  const current = products[active];

  return (
    <div className={className}>
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
        {header}
        {action}
      </div>

      <Reveal className="mt-8">
        {/* Ba ô: sân khấu (cột trái, hai hàng), cụm chữ (phải trên), dãy chọn
            (phải dưới). Ở khổ hẹp lưới về một cột và `order-*` đảo lại thành
            chữ → ảnh → dãy chọn. */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:grid-rows-[auto_1fr] lg:gap-x-6 lg:gap-y-5">
          <div
            ref={stageRef}
            /* `@container` là điều kiện để `cqw` bên trong có mốc đo.
               `touch-action: pan-y` nhường cuộn dọc lại cho trang và giữ lại
               cuộn ngang cho mình — thiếu nó thì trên cảm ứng người dùng vừa
               lật slide vừa cuộn trang. */
            className="@container order-2 [--slide-gap:1rem] [--slide-pct:90] touch-pan-y overflow-hidden lg:order-none lg:col-start-1 lg:row-span-2 lg:self-center lg:[--slide-pct:88]"
            onMouseEnter={() => setHeld(true)}
            onMouseLeave={() => setHeld(false)}
            onFocus={() => setHeld(true)}
            onBlur={() => setHeld(false)}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onClickCapture={onClickCapture}
          >
            <div
              className={cn(
                "flex items-start gap-(--slide-gap) motion-reduce:transition-none",
                dragging
                  ? "transition-none"
                  : "transition-transform duration-(--dur-slow) ease-out-expo",
              )}
              style={{ transform: `translateX(calc(${drag}px - ${shift}))` }}
            >
              {products.map((product, i) => (
                <Frame
                  key={product.name}
                  product={product}
                  id={panelId(i)}
                  labelledBy={tabId(i)}
                  /* Slide ngoài sân khấu không được nhận focus: phần ló ra mép
                     phải vẫn thấy được nên `hidden` là sai, nhưng để nó bắt Tab
                     thì bàn phím rơi vào một sản phẩm đang khuất 88%. */
                  off={i !== active}
                  zoomed={zoomed === i}
                  onZoom={(open) => setZoomed(open ? i : null)}
                  labels={labels}
                />
              ))}
            </div>
          </div>

          {/* CỤM CHỮ đứng yên, chỉ thay nội dung. `key` để React thay cả cụm và
              `animate-in fade-in` bắt được cú thay — ảnh trượt còn chữ mờ vào,
              hai kiểu chuyển động khác nhau cho hai vai trò khác nhau. */}
          <div
            key={active}
            className="order-1 flex animate-in flex-col gap-3 fade-in lg:order-none lg:col-start-2 lg:row-start-1"
          >
            {current?.label ? (
              <p className="font-mono text-eyebrow font-medium text-subtle-foreground uppercase">
                {current.label}
              </p>
            ) : null}
            <h3 className="font-display text-subhead font-semibold text-brand-ink">
              {current?.name}
            </h3>
            {current?.lead ? (
              <p className="text-body-sm text-muted-foreground">
                {current.lead}
              </p>
            ) : current?.pending ? (
              <Gap kind="confirm">{current.pending}</Gap>
            ) : null}
          </div>

          {/*
            DÃY CHỌN SẢN PHẨM — chỗ gánh phần mà bento cũ làm được còn sân khấu
            thì không: cho thấy cả bộ cùng lúc. Vì vậy nó in TÊN chứ không rút
            xuống mấy chấm tròn; chấm tròn nói được "có bốn thứ" nhưng không nói
            được bốn thứ đó là gì.

            Nút dừng đứng NGOÀI `tablist` — một nút không mang `role=tab` nằm
            trong tablist là phá đúng cái mẫu ARIA mà dãy này đang khai.
          */}
          <div className="order-3 flex items-end gap-3 lg:order-none lg:col-start-2 lg:row-start-2 lg:flex-col lg:items-stretch lg:justify-end lg:gap-4">
            <div
              ref={railRef}
              role="tablist"
              aria-label={labels.rail}
              aria-orientation={vertical ? "vertical" : "horizontal"}
              onKeyDown={onKeyDown}
              className={cn(
                "flex flex-1 gap-2 lg:flex-none lg:flex-col lg:gap-0",
                count < 2 && "hidden",
              )}
            >
              {products.map((product, i) => {
                const on = i === active;
                return (
                  <button
                    key={product.name}
                    type="button"
                    id={tabId(i)}
                    role="tab"
                    aria-selected={on}
                    aria-controls={panelId(i)}
                    tabIndex={on ? 0 : -1}
                    onClick={() => select(i)}
                    /* `min-h-11` = 44px, sàn vùng chạm. Ở `lg` bỏ sàn đó và đổi
                       vạch ngang trên đầu thành vạch dọc bên trái — cùng một
                       tín hiệu, xoay theo hướng của dãy. */
                    /* ⚠️ `lg:justify-start` KHÔNG thừa. `justify-end` ở trên là
                       cho trục DỌC của khổ hẹp (đẩy tên xuống sát vạch); đổi
                       sang `flex-row` thì cùng cái `justify-end` đó đẩy tên
                       sang PHẢI, cách vạch bên trái gần 280px và hai thứ hết
                       đọc ra là một mục. */
                    className={cn(
                      "group/pick flex min-h-11 min-w-0 flex-1 cursor-pointer flex-col justify-end gap-1.5 rounded-control pt-1 pb-1 text-left focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                      "lg:min-h-0 lg:flex-none lg:flex-row lg:items-center lg:justify-start lg:rounded-none lg:border-l-2 lg:py-3 lg:pt-3 lg:pb-3 lg:pl-4",
                      on
                        ? "lg:border-brand"
                        : "lg:border-border lg:hover:border-brand/40",
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "h-px w-full transition-colors duration-(--dur-base) lg:hidden",
                        on
                          ? "bg-brand"
                          : "bg-border group-hover/pick:bg-brand/40",
                      )}
                    />
                    {/* Ở khổ hẹp đây là nhãn của một vạch trong dãy ngang chật
                        chỗ → `text-micro` mono. Từ `lg` nó là ĐIỀU HƯỚNG CHÍNH
                        của section (bốn sản phẩm, danh sách dọc) nên lên
                        `text-ui` — vai trò "nav, chip, nhãn control" trong thang
                        chữ. Giữ `text-micro` ở cả hai khổ thì cột phải chỉ còn
                        một tên lớn và bốn dòng 11px, tức dãy chọn đọc ra là chú
                        thích chứ không ra chỗ bấm được. */}
                    <span
                      className={cn(
                        "truncate font-mono text-micro font-medium transition-colors duration-(--dur-base) lg:text-ui",
                        on
                          ? "text-brand-ink"
                          : "text-subtle-foreground group-hover/pick:text-foreground",
                      )}
                    >
                      {product.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Không có gì tự chạy thì không có gì để dừng. Một nút dừng cạnh
                một băng đứng yên là một nút nói dối — và nó sẽ xuất hiện lại
                đúng lúc sản phẩm thứ hai có nội dung. */}
            {autoplay ? (
              <PauseButton
                paused={paused}
                onToggle={() => setPaused((p) => !p)}
                label={paused ? labels.resume : labels.pause}
              />
            ) : null}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Một slide — CHỈ có ảnh; chữ ở cột phải, đứng ngoài băng trượt               */
/* -------------------------------------------------------------------------- */

function Frame({
  product,
  id,
  labelledBy,
  off,
  zoomed,
  onZoom,
  labels,
}: {
  product: StageProduct;
  id: string;
  labelledBy: string;
  off: boolean;
  zoomed: boolean;
  onZoom: (open: boolean) => void;
  labels: StageLabels;
}) {
  return (
    <div
      id={id}
      role="tabpanel"
      aria-labelledby={labelledBy}
      inert={off || undefined}
      /* KHÔNG bọc thêm mặt ô (nền + `pv-edge`) quanh slide: `AppShot` và
         `MediaFrame` đều đã tự vẽ vòng mép của chúng, nên bọc thêm là hai
         đường viền lồng nhau cách nhau 20px — và mất đúng 40px bề ngang đáng
         lẽ thuộc về ảnh. */
      className="w-[calc(var(--slide-pct)*1cqw)] shrink-0"
    >
      {product.shot ? (
        <AppShot
          src={product.shot.src}
          alt={product.shot.alt}
          detail={product.shot.detail}
          product={product.name}
          /* `screen` (16:10) = đúng tỷ lệ ảnh nguồn, không xén một pixel nào.
             Xem ngân sách chiều cao ở đầu file trước khi đổi. */
          ratio="screen"
          labels={{
            sample: labels.sample,
            zoom: labels.zoom,
            close: labels.close,
          }}
          open={zoomed}
          onOpenChange={onZoom}
          /* Khung thật ~767px ở `lg`; dưới đó slide chiếm gần trọn bề ngang. */
          sizes="(max-width: 1024px) 90vw, 800px"
        />
      ) : (
        /* `bg-transparent`: nền `bg-surface` mặc định phủ một mảng phẳng lên
           đúng khúc giữa gradient của section. */
        <MediaFrame
          ratio="screen"
          need={product.need}
          className="bg-transparent"
        />
      )}
    </div>
  );
}

/** Nút dừng/chạy nhịp. Chỉ có biểu tượng trên mặt trang — nhãn chữ nằm ở
 *  `sr-only` vì hai chữ tiếng Việt cạnh dãy tên sản phẩm là thêm một tầng chữ
 *  vào chỗ đã chật, mà hình hai vạch và hình tam giác thì không cần dịch.
 *  Vẽ bằng SVG chứ không dùng ký tự ▮▶: ký tự đổi hình theo font.
 *  `size-11` (44px) là sàn vùng chạm; chuột không cần chừng đó nên `lg` co lại. */
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
      className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-control text-subtle-foreground transition-colors duration-(--dur-fast) hover:bg-surface-2 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none lg:size-8 lg:self-start"
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
