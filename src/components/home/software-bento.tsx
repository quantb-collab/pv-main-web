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
 * NGÂN SÁCH CHIỀU CAO — `--section-y` 8,5rem mỗi đầu nên màn 900px còn ~628px:
 *   tiêu đề (eyebrow gộp dòng, KHÔNG lead)            ~44px
 *   khe                                                 32px
 *   lưới 3 hàng × 10rem + 2 khe 16                     512px
 * Cộng ~588px — vừa một màn hình, dư ~40px. `lead` của section bị BỎ đúng theo
 * `docs/SOFTWARE-KIT.md` §3: câu dẫn và ảnh sản phẩm nói cùng một việc, giữ cả
 * hai là trả 52px để nói hai lần.
 *
 * Trong ô lớn (3 hàng = 512px, trừ đệm còn ~472px):
 *   tên sản phẩm + nhãn vai, một dòng                    28px
 *   khung ảnh 21:9 ở bề rộng ~560 + hàng chú của AppShot 266px
 *   tên màn của bước                                     28px
 *   dãy năm bước + hai khe 16                            59px
 * Cộng ~395px, dư ~77px. Ảnh là con số to nhất: đổi 21:9 sang 16:9 là +75px và
 * cả section vỡ ngân sách. Tỷ lệ 21:9 cũng chính là tỷ lệ poster chuẩn ở
 * `SOFTWARE-KIT.md` §5.
 *
 * ⚠️ Bản trước đặt cả `sXBody` lẫn `sXQuote` lên thẻ và phải nới hàng lên
 * 11rem, khiến section tràn 8px ở 1440×900. Bỏ hai khối chữ đó thì hàng về
 * được 10rem và hết tràn. Nếu sau này lại thêm chữ vào thẻ thì nhớ: `BentoTile`
 * không có `overflow-hidden`, nên phần vượt track KHÔNG bị cắt mà lòi ra ngoài
 * mặt ô.
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
  close: string;
  prev: string;
  next: string;
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
      <BentoGrid className="mt-8 lg:auto-rows-[10rem]">
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
  /* Chốt một chiều: người dùng đã tự bấm một bước thì thôi lướt, vĩnh viễn.
     Ở nhịp 1,5s mà vẫn chạy tiếp sau khi người ta chọn thì đúng 1,5 giây sau
     lựa chọn của họ bị giật mất — và họ sẽ bấm lại, rồi lại mất. */
  const [taken, setTaken] = useState(false);

  const uid = useId();
  const tabId = (i: number) => `${uid}-tab-${i}`;
  const panelId = `${uid}-panel`;

  const ref = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  /* `once: false` — ra khỏi khung nhìn thì dừng đếm. Một stepper chạy dưới
     chân trang là bốn lần render mỗi phút cho không ai xem. */
  const inView = useInView(ref, { amount: 0.4 });

  const running = !reduced && !held && !taken && !zoomed && inView && count > 1;

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
      setTaken(true);
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
          <h3 className="font-display text-title font-semibold text-brand-ink">
            {hero.name}
          </h3>
          <p className="font-mono text-eyebrow font-medium text-subtle-foreground uppercase">
            {hero.label}
          </p>
        </div>

        {/* `bg-transparent`: `MediaFrame` mặc định nền `bg-surface`, mà nền đó
            phủ một mảng phẳng lên đúng khúc giữa gradient của ô và làm mất
            hiệu ứng khối. Tỷ lệ `ultra` = 21:9, đúng cỡ `shot` của kit. */}
        {step ? (
          <div
            id={panelId}
            role="tabpanel"
            aria-labelledby={tabId(active)}
            className="flex flex-1 flex-col gap-3.5"
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
                product={hero.name}
                detail={{
                  screen: step.title,
                  label: step.label,
                  title: step.title,
                  body: step.body,
                  story: step.story,
                  quote: step.quote,
                }}
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
              <MediaFrame
                key={active}
                ratio="ultra"
                need={step.need}
                className="border-0 bg-transparent"
              />
            )}

            {/*
              CHỈ CÒN TÊN MÀN TRÊN THẺ. Ở nhịp lướt 1,5s, tốc độ đọc 200
              chữ/phút chỉ kịp **5 chữ** — đặt một đoạn văn dưới nhịp đó là
              viết chữ cho không ai đọc, và tệ hơn là làm người ta thấy có chữ
              rồi cố đọc không kịp. Tên màn 2–4 chữ thì liếc là bắt được.
              Toàn bộ phần giải thích nằm ở bản phóng to, nơi người đọc tự bấm
              tới lui theo nhịp của mình.
            */}
            <h4 className="font-display text-title font-semibold">
              {step.title}
            </h4>
          </div>
        ) : null}

        {/*
          DÃY NĂM BƯỚC. Mỗi bước là một vạch ngang cộng một số mono — vạch cho
          biết đang ở đâu trong năm bước kể cả khi liếc qua, số cho biết bấm
          được. Chấm tròn thì không nói được "còn mấy bước nữa".
        */}
        <div
          ref={tabsRef}
          role="tablist"
          aria-label={stepsLabel}
          aria-orientation="horizontal"
          onKeyDown={onKeyDown}
          /* Một bước thì không có gì để chuyển: `hidden` chứ không bỏ hẳn, để
             `tabsRef` vẫn có chỗ bám và `aria-controls` không trỏ vào hư vô. */
          className={cn("mt-auto flex gap-2", count < 2 && "hidden")}
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
                className="group/step flex flex-1 cursor-pointer flex-col gap-1.5 rounded-control pt-1 pb-0.5 text-left focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
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
      </div>
    </BentoTile>
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
      <Link
        href={product.href}
        className={cn(
          "group/tile flex h-full gap-4 rounded-[inherit] p-5 transition-transform duration-(--dur-base) hover:-translate-y-1",
          phone ? "flex-col items-center text-center" : "flex-row items-center",
        )}
      >
        {/* Ô chờ bản CÂM ở đây: bốn khung chờ đứng cạnh nhau mà cái nào cũng
            đeo badge vàng thì kệ đọc ra là một bức tường cảnh báo. */}
        <MediaFrame
          ratio={phone ? "portrait" : "landscape"}
          src={product.src}
          alt={product.src ? product.name : undefined}
          need={product.need}
          compact
          sizes={phone ? "180px" : "150px"}
          className={cn(
            "shrink-0 bg-transparent",
            phone ? "w-[10.5rem]" : "w-[9.375rem]",
          )}
        />

        <div className={cn("flex flex-col gap-1", phone && "items-center")}>
          <p className="font-mono text-eyebrow font-medium text-subtle-foreground uppercase">
            {product.label}
          </p>
          <h3 className="font-display text-title font-semibold">
            {product.name}
          </h3>
          {/* Ô đứng hẹp (~250px) chỉ đủ chỗ cho tên; câu dẫn của nó vẫn phải
              tới được trình đọc màn hình nên chuyển thành `sr-only` chứ không
              bị cắt đi. */}
          <p
            className={cn(
              "text-body-sm text-muted-foreground",
              phone && "sr-only",
            )}
          >
            {product.lead}
          </p>
        </div>
      </Link>
    </BentoTile>
  );
}
