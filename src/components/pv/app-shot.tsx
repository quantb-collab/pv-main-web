"use client";

import { MediaFrame } from "@/components/motion/media-frame";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/**
 * ============================================================================
 * KHUNG ẢNH GIAO DIỆN SẢN PHẨM — poster trên trang, ảnh đầy đủ khi bấm vào
 * ----------------------------------------------------------------------------
 * Đọc kèm `docs/SOFTWARE-KIT.md` §4.
 *
 * VÌ SAO PHẢI CÓ KHUNG RIÊNG, KHÔNG DÙNG `MediaFrame` TRẦN. Ảnh ở đây là giao
 * diện Aurora của PV One — một hệ màu KHÁC hệ của site:
 *   nền màn `#0B1220` (L .183) so với nền section `sky-rise` `#121920` (L .210)
 *   → tương phản **1.06:1**, và nấc trời cao nhất cũng chỉ cho 1.18.
 * Tức là ảnh KHÔNG có mép. Dán thẳng lên trang thì nó tan vào nền chứ không
 * đọc ra là một vật. Vòng `pv-edge` ở dưới chính là cái mép đó, do site vẽ.
 *
 * BA THỨ KHUNG NÀY KHÔNG LÀM, mỗi cái là một luật của kit:
 *   · không vẽ đè CHỮ hay MÀU lên ảnh — kể cả nhãn, kể cả gradient mờ mép. Đè
 *     chữ của site lên nền Aurora là lấy bảng tương phản của hệ này áp lên nền
 *     của hệ kia, và không bảng nào bảo đảm được con số đó. Nhãn "dữ liệu mẫu"
 *     và cụm điều hướng vì vậy đều nằm NGOÀI khung ảnh.
 *   · không chỉnh màu ảnh (desaturate, tint, hạ opacity) — chỉnh màu ảnh sản
 *     phẩm là nói dối về sản phẩm. Điều tiết nằm ở diện tích, không ở pixel.
 *   · không vẽ khung trình duyệt hay vỏ máy quanh ảnh. Màn nguồn là app desktop
 *     1440×900, không phải một trang web; thêm thanh địa chỉ là bịa một sự thật
 *     nhỏ, và người mua Enterprise đọc ra ngay.
 *
 * POSTER ≠ BẰNG CHỨNG. Ở khổ thẻ, ảnh 1440px thu về ~600px là 0,42× — chữ 13px
 * thành 5,5px, không ai đọc được. Nên khung trên trang chỉ làm POSTER: nó nói
 * "đây là một phần mềm thật, hình thù thế này". Chỗ ĐỌC được là bản phóng to,
 * và đó cũng là nơi đặt đoạn giải thích dài. Sàn 0,85× của kit §3 áp cho
 * DIALOG, không áp cho poster.
 *
 * THỨ TỰ DƯỚI ẢNH: TIÊU ĐỀ TRƯỚC, DÒNG CHÚ SAU. Bản đầu đặt dòng chú
 * (`ONE CORE · DỮ LIỆU MẪU` / `XEM ẢNH LỚN`) ngay dưới ảnh rồi mới tới tên màn,
 * nên nhãn engine đứng giữa ảnh và tên của chính ảnh đó — mắt đọc ra nó là
 * chrome của khung ảnh chứ không phải eyebrow của tiêu đề. Tiêu đề nhận qua
 * prop `heading` để chỗ dùng vẫn giữ được thẻ và vai trò ARIA của riêng nó
 * (ở kệ phần mềm nó là `h4` nằm trong `tabpanel`).
 *
 * ĐIỀU HƯỚNG NỔI, ĐẶT DƯỚI ẢNH CHỨ KHÔNG ĐÈ LÊN ẢNH. Kiểu lightbox cổ điển gắn
 * hai mũi tên ‹ › đè lên hai mép ảnh; ở đây làm vậy là che đúng sidebar và cột
 * rail phải — hai chỗ mang lập luận của màn. Cụm điều hướng vì thế là một viên
 * thuốc `sticky` bám đáy vùng cuộn của dialog: luôn thấy, luôn với tới, và
 * không ăn một pixel nào của sản phẩm. Kèm phím ← → cho cả dialog.
 *
 * MỞ/ĐÓNG DO CHỖ DÙNG GIỮ (`open` + `onOpenChange`), không để Dialog tự giữ:
 * thẻ đang tự lướt 1,5s một bước, mà lướt tiếp trong lúc dialog mở thì nội dung
 * đổi ngay dưới tay người đang đọc. Chỗ dùng phải biết dialog đang mở để dừng.
 *
 * NHÃN "DỮ LIỆU MẪU" KHÔNG CÓ PROP TẮT. Số trong ảnh (₫4,2bn · 86% · 91,4%) là
 * bộ dữ liệu đóng băng của kịch bản POC, không phải kết quả của khách hàng nào.
 * Ảnh không nhãn đứng trên trang bán hàng chính là một case study bịa — thứ
 * blueprint §17 cấm và `pv-proof` soát. Xem kit §10 luật 1.
 * ============================================================================
 */

export interface AppShotDetail {
  /** Nhãn engine hoặc tầng license. Cũng là mẩu giữa của dòng nguồn mono. */
  label: string;
  title: string;
  /** Một câu tóm tắt. Cũng là nguồn của `alt`. */
  body: string;
  /** Đoạn dài: màn này nói về cái gì, viết theo giọng trang bán hàng. */
  story: string;
  quote: string;
}

export interface AppShotNav {
  index: number;
  count: number;
  onPrev: () => void;
  onNext: () => void;
  prevLabel: string;
  nextLabel: string;
}

export interface AppShotLabels {
  sample: string;
  zoom: string;
  close: string;
}

export function AppShot({
  src,
  alt,
  detail,
  product,
  labels,
  nav,
  open,
  onOpenChange,
  ratio = "ultra",
  sizes,
  heading,
  className,
}: {
  src: string;
  alt: string;
  detail: AppShotDetail;
  /** Tên sản phẩm cho dòng nguồn mono. */
  product: string;
  labels: AppShotLabels;
  /** Bỏ trống = không có cụm điều hướng (dùng cho ảnh đứng một mình). */
  nav?: AppShotNav;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Tỷ lệ khung POSTER. Ảnh gốc luôn là `screen` (16:10). */
  ratio?: "ultra" | "wide" | "screen";
  sizes?: string;
  /** Tiêu đề của ảnh, đặt giữa khung và dòng chú. Chỗ dùng tự chọn thẻ. */
  heading?: React.ReactNode;
  className?: string;
}) {
  /* Dòng nguồn KHÔNG lặp tên màn: ở bản phóng to, tên màn đã là tiêu đề đứng
     ngay dưới nó. Hai dòng mono xếp liền nhau mà một dòng nhắc lại dòng kia
     đọc ra là header bị lặp, không đọc ra hai mẩu thông tin. */
  const source = `${product} · ${detail.label} · ${labels.sample}`;

  /* Phím ← → đi lại giữa các màn ngay trong dialog. Radix đã lo Esc và bẫy
     focus; hai phím này là thứ người ta thử đầu tiên trong một khung xem ảnh. */
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!nav) return;
    if (e.key === "ArrowRight") nav.onNext();
    else if (e.key === "ArrowLeft") nav.onPrev();
    else return;
    e.preventDefault();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className={cn("group/shot flex flex-col", className)}>
        <div className="relative rounded-xl">
          <MediaFrame
            ratio={ratio}
            src={src}
            alt={alt}
            focus="top"
            sizes={sizes}
            className="border-0 bg-transparent"
          />
          <span
            aria-hidden
            className="pv-edge bg-linear-to-t from-brand/35 to-border transition-colors duration-(--dur-base) group-hover/shot:from-brand/60"
          />
          {/*
            LỚP BẤM PHỦ ẢNH — trong suốt, không vẽ gì lên ảnh, nên không phạm
            luật "không đè lên ảnh"; nó là lớp tương tác chứ không phải lớp
            hình. `aria-hidden` + `tabIndex -1` là cố ý: cùng một hành động mà
            có hai điểm dừng bàn phím thì trình đọc màn hình đọc hai lần. Chuột
            và cảm ứng bấm vào ảnh; bàn phím và trình đọc dùng nút CÓ NHÃN ở
            hàng dưới.
          */}
          <DialogTrigger asChild>
            <button
              type="button"
              aria-hidden
              tabIndex={-1}
              className="absolute inset-0 cursor-zoom-in rounded-xl"
            />
          </DialogTrigger>
        </div>

        {heading ? <div className="mt-3">{heading}</div> : null}

        <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="font-mono text-eyebrow font-medium text-subtle-foreground uppercase">
            {detail.label} · {labels.sample}
          </p>
          <DialogTrigger asChild>
            <button
              type="button"
              className="cursor-pointer rounded-control font-mono text-eyebrow font-medium text-brand-ink uppercase transition-colors duration-(--dur-fast) hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {labels.zoom}
            </button>
          </DialogTrigger>
        </div>
      </div>

      {/* `sm:max-w-sm` của bản shadcn là cỡ hộp thoại xác nhận — ảnh 16:10 nhét
          vào đó thì chữ trong ảnh còn nhỏ hơn cả bản poster. 72rem cho ảnh chạy
          ~1150px, tức 0,8× cỡ thiết kế, đủ đọc mọi dòng trong màn. */}
      {/*
        `flex` ĐÈ `grid` CỦA BẢN shadcn, và đây là một lỗi thật chứ không phải
        sở thích bố cục: `DialogContent` mang sẵn class `grid`, mà ô ảnh dùng
        `aspect-ratio` thì bị hàng lưới kéo giãn theo `align-items: stretch` —
        khung cao theo hàng còn ảnh bên trong vẫn `absolute inset-0`, nên nó
        trùm xuống ô chữ. Đổi sang `flex flex-col` là hết, vì lúc đó chiều cao
        của ô ảnh do chính tỷ lệ của nó quyết định.
      */}
      <DialogContent
        showCloseButton={false}
        onKeyDown={onKeyDown}
        className="flex max-h-[92dvh] flex-col gap-5 overflow-y-auto p-5 sm:max-w-[min(96vw,96rem)] lg:p-6"
      >
        {/*
          ẢNH MỘT BÊN, CHỮ MỘT BÊN. Xếp chồng thì chiều cao cộng dồn: ảnh 16:10
          ở 1150px đã cao 719px, thêm đoạn chữ nữa là vượt màn và người đọc phải
          cuộn để nối ảnh với lời giải thích về chính nó.
          Cột chữ CỐ ĐỊNH 20rem, ảnh ăn hết phần còn lại — không chia tỷ lệ.
          Chia 50/50 thì trên màn 1440 ảnh chỉ còn ~650px, tức 0,45× cỡ thiết
          kế, chữ 13px trong ảnh thành 5,9px và bản phóng to hết lý do tồn tại.
          Cột cố định giữ cho mọi pixel thừa đều chảy vào ảnh.
          Dưới `lg` thì xuống chồng, vì 20rem cột chữ cộng ảnh không vừa.

          ⚠️ Con số thật, đừng tô hồng: trần 96rem, trừ đệm 48 và cột chữ 20rem
          cộng khe, ảnh được ~1148px trên màn ≥1600 (**0,80×** — đúng sàn của
          kit §3) nhưng chỉ ~994px trên màn 1440 (**0,69×**, chữ 13px còn 9px).
          Đó là giá của việc đặt lời giải thích BÊN CẠNH ảnh thay vì bên dưới.
          Đổi lại là không phải cuộn để nối ảnh với đoạn nói về chính nó. Muốn
          lấy lại 0,80× ở 1440 thì phải bỏ cột chữ, không có cách thứ ba.

          TIÊU ĐỀ NẰM TRONG CỘT CHỮ, không đứng thành một hàng header riêng.
          Bản trước để `DialogTitle` ở góc trái trên và dòng nguồn ở góc phải,
          nên trên màn 1440 tiêu đề cách đoạn nói về chính nó **1200px** và
          giữa hai đầu không có gì nối. Gom cả cụm vào một cột thì mắt đọc
          liền một mạch: nguồn → tên màn → luận điểm → chuyện → câu chốt.
        */}
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
          {/* `quality` 90 chứ không phải 75 mặc định: đây là chỗ DUY NHẤT trên
              site mà người đọc phải đọc chữ nằm BÊN TRONG một tấm ảnh (13px ở
              cỡ thiết kế), và chữ nhỏ là thứ hỏng trước tiên khi nén. Mức 90 đã
              khai ở `images.qualities` trong `next.config.ts` — Next 16 trả HTTP
              400 cho mọi mức không khai, tức ảnh mất trắng chứ không xấu đi.

              `sizes` KHÔNG được vượt 1024: ảnh nguồn rộng 2880, mà nấc thiết bị
              của Next nhảy 2048 → 3840. Khai 1100px thì màn retina cần 2200 và
              trình duyệt lấy bản 3840 — phóng to quá cả bản gốc, không thêm một
              chi tiết nào, chỉ thêm một lần mã hoá nguội (lần mở đầu tiên là
              một hình chữ nhật đen vài giây). 1000px đưa mọi màn về nấc 2048,
              đúng nhu cầu thật của khung ~994–1148px ở DPR 2. */}
          <div className="relative min-w-0 rounded-xl">
            {/* `priority` = `loading="eager"` + `fetchPriority: high`, và nó
                KHÔNG tốn gì ở lần tải trang: ảnh này chỉ tồn tại sau khi người
                dùng bấm mở, trước đó dialog chưa render. Đây cũng là ảnh duy
                nhất trên site mà người dùng ĐÃ chủ động xin xem — để nó xếp
                hàng sau mọi thứ khác là sai thứ tự ưu tiên.
                Lý do trực tiếp: đo trong dialog thì sau 6 giây `currentSrc` vẫn
                rỗng và `naturalWidth` vẫn 0 — trình duyệt còn chưa bắt đầu tải,
                trong khi poster cùng trang thì đã tải xong. Ép eager là hết
                ngay. (Phép đo chạy trên Chrome headless nên chưa khẳng định
                được là hành vi của trình duyệt thật; nhưng eager ở đây đúng
                bất kể nguyên nhân.) */}
            <MediaFrame
              ratio="screen"
              src={src}
              alt={alt}
              quality={90}
              priority
              sizes="(max-width: 1024px) 92vw, 1000px"
              className="border-0 bg-transparent"
            />
            {/* Cùng vòng mép với poster ngoài trang. Kit §11: ảnh giao diện tối
                nằm trên nền tối là chỗ dễ mất mép nhất — và trong dialog thì
                ảnh to nhất, tức mất mép cũng lộ nhất. */}
            <span
              aria-hidden
              className="pv-edge bg-linear-to-t from-brand/35 to-border"
            />
          </div>

          <div className="flex flex-col gap-3">
            {/* Nhãn và tiêu đề là MỘT cụm — khe 6px, không phải 12px của cột.
                Eyebrow cách tiêu đề bằng đúng khoảng cách với đoạn kế thì nó
                thôi làm eyebrow, thành một dòng chữ độc lập. */}
            <div className="flex flex-col gap-1.5">
              <p className="font-mono text-eyebrow font-medium text-subtle-foreground uppercase">
                {source}
              </p>
              <DialogTitle className="font-display text-subhead font-semibold">
                {detail.title}
              </DialogTitle>
            </div>
            <DialogDescription className="text-lead text-foreground">
              {detail.body}
            </DialogDescription>
            <p className="text-body-sm text-muted-foreground">{detail.story}</p>
            {/* Câu chốt để TRẦN, không đóng ngoặc kép. Một câu bán hàng đặt
                trong ngoặc kép trên trang bán hàng đọc ra là lời khách hàng —
                tức một testimonial bịa, thứ blueprint §17 cấm. Bỏ ngoặc thì nó
                trở lại đúng thân phận: lời của Pebble Vina. */}
            <p className="text-body-sm text-brand-ink">{detail.quote}</p>
          </div>
        </div>

        {/*
          CỤM ĐIỀU HƯỚNG NỔI. `sticky` ở đáy vùng cuộn của dialog, nền
          `bg-popover` của chính dialog nên nó không bao giờ nằm trên ảnh —
          xem lý do ở đầu file. Số `02 / 05` không phải trang trí: một cụm chỉ
          có hai mũi tên thì không nói được còn mấy màn nữa.
        */}
        {nav ? (
          <div className="sticky bottom-0 -mx-5 -mb-5 flex items-center justify-between gap-4 bg-popover px-5 pt-3 pb-5 lg:-mx-6 lg:-mb-6 lg:px-6 lg:pb-6">
            <DialogClose className="cursor-pointer rounded-control font-mono text-eyebrow font-medium text-subtle-foreground uppercase transition-colors duration-(--dur-fast) hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
              {labels.close}
            </DialogClose>

            <div className="flex items-center gap-1 rounded-control bg-surface p-1">
              <NavButton label={nav.prevLabel} onClick={nav.onPrev} back />
              <span className="px-2 font-mono text-micro font-medium text-subtle-foreground tabular-nums">
                {String(nav.index + 1).padStart(2, "0")} / {String(nav.count).padStart(2, "0")}
              </span>
              <NavButton label={nav.nextLabel} onClick={nav.onNext} />
            </div>
          </div>
        ) : (
          <DialogClose className="cursor-pointer self-start rounded-control font-mono text-eyebrow font-medium text-subtle-foreground uppercase transition-colors duration-(--dur-fast) hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
            {labels.close}
          </DialogClose>
        )}
      </DialogContent>
    </Dialog>
  );
}

/** Mũi tên vẽ bằng SVG chứ không dùng ký tự ‹ ›: ký tự đổi hình theo font, mà
 *  font của site không phải font biểu tượng. */
function NavButton({
  label,
  onClick,
  back = false,
}: {
  label: string;
  onClick: () => void;
  back?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex size-(--h-control-sm) cursor-pointer items-center justify-center rounded-control text-muted-foreground transition-colors duration-(--dur-fast) hover:bg-surface-2 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("size-4", back && "rotate-180")}
      >
        <path d="M6 3.5 10.5 8 6 12.5" />
      </svg>
      <span className="sr-only">{label}</span>
    </button>
  );
}
