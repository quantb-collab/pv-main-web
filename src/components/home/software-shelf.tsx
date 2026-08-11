import { MediaFrame } from "@/components/motion/media-frame";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
/* `Link` của i18n, KHÔNG phải "next/link" — bản này tự gắn tiền tố locale.
   Dùng nhầm thì link ra `/solutions/...` và người đang đọc /en bị đá về vi. */
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * ============================================================================
 * KỆ PHẦN MỀM — một card cho mỗi sản phẩm
 * ----------------------------------------------------------------------------
 * Section phần mềm đứng NGAY DƯỚI kệ phần cứng, nên hai cái không được trông
 * giống nhau — nhưng cũng không được là hai thứ tiếng nói khác nhau. Cách chia:
 *   kệ phần cứng — ba TẦNG ngang, mỗi tầng một dòng chip, băng ảnh cuộn ngang
 *   kệ phần mềm  — một HÀNG card đứng, mỗi card một sản phẩm, ảnh không cuộn
 * Vật liệu thì y hệt: nền dốc dọc `from-surface to-surface-2`, vệt sáng mảnh ở
 * chân thẻ, nhấc 4px khi rê chuột, không đổ bóng, không màu ngoài token.
 *
 * BỐN Ô CHỮ TRÊN MỘT CARD, đúng thứ tự mắt cần (chủ dự án chốt 2026-08-10):
 *   nhãn vai   — mono, viết hoa: sản phẩm này đứng ở đâu trong bộ
 *   tên        — chữ to nhất của card
 *   lời dẫn    — MỘT câu, nói sản phẩm làm được gì, không nói tính năng
 *   dải size   — sản phẩm chạy trên những cỡ màn hình nào
 * Nhãn vai có mặt trên MỌI card chứ không riêng card lõi: thiếu nó ở hai card
 * kia thì tên sản phẩm của chúng tụt lên cao hơn, và ba card hết thẳng hàng.
 *
 * CARD LÕI SÁNG HƠN HAI CARD KIA. Vòng `pv-edge` ngả brand ở chân, tên ăn màu
 * `brand-ink`. Đây là cách "AI đứng giữa điều phối" còn sống sau khi sơ đồ ba
 * vùng bị thay bằng hàng card: thứ điều phối là thứ sáng nhất trên kệ, và nó
 * đứng giữa. Không cần vẽ mũi tên nào.
 *
 * ẢNH LÀ THỨ CHÍNH, và nó phải là ảnh THẬT của sản phẩm — không phải dashboard
 * dựng giả. Blueprint cấm thẳng thứ đó, và người mua Enterprise nhận ra một
 * giao diện bịa nhanh hơn bất kỳ thứ gì khác trên trang. Chưa có ảnh thì
 * `MediaFrame` tự hiện ô chờ kèm `need`; yêu cầu đầy đủ ở `docs/IMAGE-BRIEF.md`
 * nhóm D. Điền ảnh = thêm một dòng vào `PRODUCT_SRC` trong `sections.tsx`.
 *
 * NGÂN SÁCH CHIỀU CAO, tính như kệ phần cứng — `--section-y` 8.5rem mỗi đầu
 * nên màn 900px chỉ còn ~628px:
 *   hàng tiêu đề (eyebrow gộp dòng + lead 2 dòng)   ~110px
 *   khe                                              ~32px
 *   card  12 đệm + 219 ảnh + 16 khe + 24 nhãn vai
 *       + 28 tên + 40 lời dẫn + 12 khe + 22 size
 *       + 20 đệm                                    ~393px
 * Cộng ~535px — vừa một màn hình, khác kệ phần cứng vốn tràn ~94px ở 1440×900.
 * Ảnh là con số to nhất ở đây: nới card rộng ra thì ảnh cao lên theo 9/16 và
 * cả section đội lên. Muốn thêm sản phẩm thứ tư thì card hẹp lại, ảnh thấp
 * xuống, section còn dư chỗ — thêm được. Muốn card to hơn thì phải cắt chỗ
 * khác trước.
 * ============================================================================
 */

/** Ba cỡ màn hình. Vẽ bằng SVG chứ không dùng ký tự biểu tượng — ký tự đổi
 *  hình theo font, mà font của site không phải font biểu tượng. */
const SIZE_GLYPH = {
  phone: <path d="M5.5 1.5h5a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1ZM7 12.5h2" />,
  desktop: <path d="M2 3.5h12v7H2zM6 14h4M8 10.5V14" />,
  web: <path d="M2 3h12v10H2zM2 6h12M4.25 4.5h.01M6.25 4.5h.01" />,
} as const;

export type SizeGlyph = keyof typeof SIZE_GLYPH;

export interface ShelfSize {
  name: string;
  glyph: SizeGlyph;
}

export interface SoftwareProduct {
  /** Vai của sản phẩm trong bộ. Mono, viết hoa. */
  label: string;
  name: string;
  /** MỘT câu. Dài hơn thì card cao lên và ba card lệch nhau. */
  lead: string;
  sizes: ShelfSize[];
  /** Bỏ trống = ô chờ ảnh kèm `need`. */
  src?: string;
  need: string;
  /** Trang đi sâu. Cả thẻ thành link. */
  href: string;
  /** Card lõi — sáng hơn hai card kia. Đúng MỘT card được khai. */
  core?: boolean;
}

export function SoftwareShelf({
  header,
  action,
  products,
  className,
}: {
  /** Tiêu đề section. Nhận vào đây, không đặt bên ngoài, để nút phụ đứng được
   *  cùng hàng với nó — một hàng nút riêng tốn 44px của ngân sách chiều cao. */
  header?: ReactNode;
  action?: ReactNode;
  products: SoftwareProduct[];
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
        {header}
        {action}
      </div>

      {/* `items-stretch` mặc định của grid lo phần ba card cao bằng nhau khi
          một lời dẫn xuống ba dòng; `h-full` ở card để nền dốc phủ hết ô chứ
          không dừng ở đáy nội dung. */}
      <RevealGroup className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.name} product={product} />
        ))}
      </RevealGroup>
    </div>
  );
}

function ProductCard({ product }: { product: SoftwareProduct }) {
  return (
    <RevealItem className="h-full">
      {/*
        CẢ THẺ LÀ LINK, không phải một nút "xem thêm" ở chân thẻ: card đã có
        ảnh, tên và lời dẫn — thêm một nhãn nữa chỉ để nói "bấm vào đây" là
        tốn một dòng cho thứ hình thù cái thẻ đã nói.

        THẺ NỔI LÊN bằng ba thứ, không thứ nào là đổ bóng (site này dùng viền
        và ánh sáng thay bóng), giống hệt card thiết bị ở kệ phần cứng:
          · nền dốc dọc — mặt trên tối hơn mặt dưới, đúng như một vật đứng
            trong thế giới có ánh sáng dâng từ chân trời;
          · vòng `pv-edge` sáng ở MÉP DƯỚI, cùng hướng với chân trời của trang;
          · rê chuột thì nhấc 4px bằng `transform`, không đụng tới bố cục.
      */}
      <Link
        href={product.href}
        className={cn(
          "group/card relative flex h-full flex-col overflow-hidden rounded-xl bg-linear-to-b from-surface to-surface-2 pt-3 pb-5 transition-transform duration-(--dur-base) hover:-translate-y-1",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "pv-edge bg-linear-to-t to-border transition-colors duration-(--dur-base)",
            /* Card lõi mang sẵn mép brand; hai card kia chỉ ngả brand khi rê
               chuột. Nếu cả ba cùng sáng lúc nghỉ thì không còn cái nào là lõi. */
            product.core
              ? "from-brand/50"
              : "from-border group-hover/card:from-brand/40",
          )}
        />

        {/* `object-cover` chứ không `contain`: ảnh giao SAI tỷ lệ sẽ bị CẮT chứ
            không co lại. Đúng 16:9 hoặc không giao — xem IMAGE-BRIEF §5.
            `bg-transparent` bắt buộc: `MediaFrame` mặc định nền `bg-surface`,
            mà nền đó phủ một mảng phẳng lên đúng khúc giữa của gradient thẻ và
            làm mất hiệu ứng khối. */}
        <MediaFrame
          ratio="wide"
          src={product.src}
          alt={product.src ? product.name : undefined}
          need={product.need}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
          className="rounded-none border-0 bg-transparent"
        />

        <div className="mt-4 flex flex-1 flex-col px-5">
          <p className="font-mono text-eyebrow font-medium text-subtle-foreground uppercase">
            {product.label}
          </p>
          {/* Tên card lõi ăn màu brand — cùng lối với tên ba dòng chip ở kệ
              phần cứng, nơi màu là thứ nói "đây là một dòng riêng". */}
          <h3
            className={cn(
              "mt-2 font-display text-title font-semibold",
              product.core && "text-brand-ink",
            )}
          >
            {product.name}
          </h3>
          <p className="mt-1.5 text-body-sm text-muted-foreground">
            {product.lead}
          </p>

          {/*
            DẢI SIZE. `mt-auto` đẩy nó xuống đáy thẻ: ba lời dẫn không bao giờ
            dài đúng bằng nhau, mà ba dải size phải thẳng hàng nhau — nếu không
            thì mắt đọc ra ba card lệch chứ không đọc ra ba sản phẩm.
            Nhãn có chữ chứ không chỉ có hình: một cái biểu tượng điện thoại
            14px không tự khai được nó là "bản điện thoại" hay "gọi cho chúng
            tôi", và cả ba đều là hình chữ nhật bo góc.
          */}
          <ul className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t pt-3.5">
            {product.sizes.map((size) => (
              <li
                key={size.name}
                className="flex items-center gap-1.5 text-meta text-subtle-foreground"
              >
                <svg
                  aria-hidden
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-3.5 shrink-0"
                >
                  {SIZE_GLYPH[size.glyph]}
                </svg>
                {size.name}
              </li>
            ))}
          </ul>
        </div>
      </Link>
    </RevealItem>
  );
}
