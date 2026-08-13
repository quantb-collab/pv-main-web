"use client";

import { useInView, useReducedMotion } from "motion/react";
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { MediaFrame } from "@/components/motion/media-frame";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SHELF } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * ============================================================================
 * KỆ SẢN PHẨM — phần cứng theo đối tác
 * ----------------------------------------------------------------------------
 * Đây là chỗ DUY NHẤT trên site trưng sản phẩm vật lý, nên nó được phép trông
 * khác thân bài — nhưng vẫn bằng đúng vật liệu của site: viền tóc, vòng viền
 * gradient `pv-edge`, không đổ bóng, không màu ngoài token.
 *
 * NGÂN SÁCH CHIỀU CAO là ràng buộc đầu tiên, không phải thứ tính sau. Section
 * cao trọn một màn hình, mà `--section-y` ở desktop là 8.5rem mỗi đầu — nên
 * trong màn 900px chỉ còn ~628px cho toàn bộ section. Phép tính hiện tại:
 *   hàng tiêu đề + tab   ~125px   (một hàng, tab nằm bên phải chứ không xuống dòng)
 *   khe                   ~24px
 *   ba tầng kệ           ~573px   (mỗi tầng 159px card + 2×12px đệm, khe 12px)
 * Cộng lại ~722px: ở ĐÚNG 1440×900 section tràn ~94px, tức khoảng 1,1 màn
 * hình; từ 1000px chiều cao trở lên thì vừa. Phần tràn đó là giá của card ảnh
 * đọc được cộng khoảng thở quanh vật thể — cả hai đều do chủ dự án chốt.
 * Nới bất kỳ con số nào cũng phải trừ vào con số khác, không được cộng thêm.
 *
 * BỐN quyết định hình:
 *
 * 1. MỖI DÒNG CHIP LÀ MỘT TẦNG KỆ. Vòng `pv-edge` chạy hết chu vi với gradient
 *    sáng ở MÉP DƯỚI: ánh sáng hắt lên từ dưới tầng kệ, cùng một nguồn sáng
 *    với chân trời của cả trang. Dùng `pv-edge` chứ không `p-px`+
 *    `overflow-hidden` vì cách kia vỡ ở bốn góc bo (xem chú thích globals.css).
 *
 * 2. ẢNH VÀ TÊN THIẾT BỊ NẰM TRONG CÙNG MỘT CARD (đổi 2026-08-07).
 *    Bản trước tách đôi: ảnh vuông 112px, tên thiết bị là một dòng chữ riêng
 *    bên dưới. Hai cái sai: dòng chữ đó ăn 18px của MỌI tầng nên ảnh phải nhỏ
 *    lại đúng bằng phần nó lấy, và ảnh rời khỏi nhãn thì mắt phải tự nối lại.
 *    Nay một card = ảnh 16:9 + nhãn ngay dưới trong cùng khung viền, nên tên
 *    thiết bị KHÔNG tốn thêm dòng nào của tầng. Ảnh rộng 198px thay cho 112px
 *    vuông — gấp 1,75 lần diện tích.
 *    ⟹ Ảnh cần giao: 16:9, 1920×1080, cùng một góc máy và một nguồn sáng lạnh
 *      cho cả 15 tấm. Lệch góc máy thì kệ đọc ra là ảnh gom từ 15 nơi.
 *
 * 3. BĂNG TỰ TRÔI THEO BƯỚC, và người dùng luôn giành được quyền lái.
 *    Bản đầu dùng `animate-marquee` trôi liên tục 40s một vòng — bỏ vì nó
 *    không sống chung được với `snap` và hai nút trôi. Nay là khung cuộn ngang
 *    thật, tự đi MỘT CARD mỗi `SHELF.auto`, hết băng thì về đầu. Được cả hai:
 *    kệ hàng tự sống, mà vuốt tay / trackpad / bàn phím / hai nút đều ăn ngay.
 *    Bốn điều kiện dừng, thiếu một cái là hiệu ứng thành phiền:
 *      · con trỏ đang ở trong băng, hoặc bàn phím đang focus trong băng
 *      · băng chưa vào khung nhìn (không chạy nền cho tốn pin)
 *      · `prefers-reduced-motion` — tắt hẳn, không chỉ giảm
 *    Ba tầng lệch pha `SHELF.stagger`: trôi cùng nhịp thì đọc ra là một cái
 *    bảng điện tử, lệch pha thì đọc ra là ba kệ hàng sống độc lập.
 *
 * 4. MỖI DÒNG CHIP MỘT MÀU LẤY TỪ CHÍNH CÁI TÊN — bạc hà, đu đủ, cà phê.
 *    Màu chỉ xuất hiện ở HAI chỗ: tên chip và mép sáng dưới chân tầng kệ. Đủ
 *    để ba dòng không lẫn nhau, không đủ để cãi nhau với ánh bình minh của
 *    trang. Ba giá trị nằm ở LỚP 1 globals.css kèm lý do vì sao chúng là ngoại
 *    lệ duy nhất của luật "mọi ánh sáng dẫn xuất từ --brand".
 *
 * TAB LÀ ĐỐI TÁC, không phải nhóm sản phẩm. Hiện chỉ một, và một tab trông vẫn
 * đúng vì nó đọc ra là nhãn đối tác đang xem. Thêm đối tác = thêm một phần tử
 * vào mảng `partners` ở `sections.tsx`, không phải sửa file này.
 * ============================================================================
 */

/**
 * Bề ngang card. 200px ⟹ card cao 159:
 *   10 đệm trên + 111 ảnh (198 × 9/16) + 8 khe + 20 nhãn + 10 đệm dưới
 *
 * Con số này KHÔNG còn vừa ngân sách chiều cao, và đó là lựa chọn có chủ ý:
 *   628 (khoang nội dung) − 125 (hàng tiêu đề, ĐÃ gộp tab) − 24 (khe) = 479
 *   (479 − 2×12 khe) / 3 = 151 mỗi tầng · − 2×12 đệm ⟹ card ≤ 127 ⟹ ảnh ≤ 93
 * 93px ảnh thì card mới chỉ hơn ô vuông 112px cũ đúng 1,2 lần — đổi mà như
 * không đổi. Nên card giữ 159 và section tràn ~94px ở 1440×900.
 *
 * Đây là chỗ ĐẦU TIÊN phải cắt nếu chủ dự án nhìn thấy chật, theo thứ tự:
 *   `py-2.5` của card → `py-2` (−12px cả section)
 *   200 → 176 (−27px)  ·  200 → 152 (−54px)
 * Cắt cả ba mới về đúng một màn hình, và lúc đó ảnh còn 150×84.
 */
const CARD = "w-[12.5rem]";
/** Khe giữa hai card. Phải khớp `gap-3` của track — `scrollByCard` cộng tay. */
const GAP_PX = 12;

/**
 * Màu ba dòng chip. Bảng nằm ở đây chứ không ở `sections.tsx` vì đây là quyết
 * định HÌNH, không phải nội dung; và Tailwind chỉ sinh class khi thấy chuỗi
 * đầy đủ trong mã nguồn, nên ba cặp này phải viết thẳng, không ghép chuỗi.
 */
const ACCENT = {
  mint: { name: "text-chip-mint", edge: "from-chip-mint/40" },
  papaya: { name: "text-chip-papaya", edge: "from-chip-papaya/40" },
  espresso: { name: "text-chip-espresso", edge: "from-chip-espresso/40" },
} as const;

export type ChipAccent = keyof typeof ACCENT;

export interface ShelfProduct {
  /** Bỏ trống = hiện ô chờ câm kèm `need` ở `title` + `sr-only`. */
  src?: string;
  /** Tên thiết bị. LUÔN hiện, kể cả khi chưa có ảnh — nhãn mới là thứ nói
   *  chip này dùng vào việc gì, ảnh đến sau chỉ bồi thêm. */
  name: string;
  need: string;
}

export interface ShelfLine {
  name: string;
  /** Địa hạt ứng dụng — MỘT câu, nói chip này hợp với loại bài toán nào.
   *  Đây là câu MÔ TẢ DUY NHẤT của một tầng. Bản trước còn một câu lợi điểm
   *  đứng trên nó ("Nghe và cảm nhận ngay tại thiết bị"); chủ dự án gỡ
   *  2026-08-07 vì hai câu nói cùng một điều thì câu thứ hai là chữ thừa. */
  fit: string;
  /** Ba thông số, số tách rời nhãn để cột số canh thẳng hàng được.
   *  Đúng ba dòng cho cả ba chip — bốn dòng thì tầng kệ cao hơn card ảnh và
   *  cả section đội lên. Nguồn và những chỗ không được sửa: `sections.tsx`. */
  specs: { value: string; label: string }[];
  /** Màu lấy từ tên chip. Xem quyết định 4. */
  accent: ChipAccent;
  products: ShelfProduct[];
  /** Nhãn hai nút trôi băng. Có tên chip trong đó vì mỗi tầng một băng riêng,
   *  "trước/sau" trần thì trình đọc màn hình nghe ba lần giống hệt nhau. */
  nav: { prev: string; next: string };
}

/**
 * Hồ sơ đối tác, đứng NGAY DƯỚI tab và TRƯỚC danh sách sản phẩm. Bốn khối, đọc
 * từ trên xuống là bốn câu hỏi liên tiếp của người mới nghe tên đối tác lần
 * đầu: đây là ai (kèm chỗ đi tra) → chip của họ hơn ở chỗ nào → ai đứng sau →
 * mạnh cỡ nào.
 *
 * CHỈ MỘT NGƯỜI (chủ dự án chốt 2026-08-07). Bản trước liệt kê cả bốn lãnh đạo
 * kèm học vấn và nơi từng làm; bốn hồ sơ ba dòng trên một trang chủ là trang
 * About của một công ty khác, và mỗi cái tên thật lại kéo theo một sự đồng ý
 * riêng phải đi xin. Người sáng lập cộng đường link về web đối tác trả lời
 * đúng câu người đọc đang hỏi — "ai đứng sau chỗ này" — và ai muốn biết sâu
 * hơn thì đã có chỗ để đi tiếp.
 */
export interface ShelfPartnerIntro {
  /** Đến từ đâu — một cụm ngắn, đứng như tiêu đề nhỏ. */
  origin: string;
  /** Web đối tác. Bỏ trống `href` = chưa có link thì không hiện gì cả — một
   *  đường link chết còn tệ hơn không có link. */
  site?: { href: string; label: string };
  /** Lợi thế kiến trúc, phủ CẢ BA dòng chip bên phải nên nó đứng ở cột trái.
   *  `title` là lợi ích, `body` mới là cơ chế — không đảo ngược thứ tự đó. */
  tech: { label: string; title: string; body: string };
  leadLabel: string;
  /** `creds` là các mốc nghề nghiệp, MỖI MỐC MỘT DÒNG. Không nối lại thành
   *  một chuỗi ngăn bằng dấu chấm giữa: hồ sơ một con người không đọc như một
   *  dòng thông số. */
  lead: { name: string; role: string; creds: string[] };
  /** Hai con số của bảng thành tích. */
  stats: { value: string; label: string }[];
}

export interface ShelfPartner {
  id: string;
  name: string;
  intro: ShelfPartnerIntro;
  lines: ShelfLine[];
}

export function ProductShelf({
  partners,
  header,
  action,
  motionLabels,
  className,
}: {
  partners: ShelfPartner[];
  /** Tiêu đề section. Nhận vào đây thay vì đặt bên ngoài để tab đứng ĐƯỢC
   *  cùng hàng với nó — `TabsList` bắt buộc nằm trong `<Tabs>`, mà một hàng
   *  tab riêng tốn 44px, đúng phần chiều cao mà card ảnh đang cần. */
  header?: ReactNode;
  /** Nút phụ đứng cạnh tab. */
  action?: ReactNode;
  /** Nhãn hai trạng thái của nút dừng chuyển động. */
  motionLabels: { pause: string; play: string };
  className?: string;
}) {
  /**
   * Băng tự trôi phải DỪNG ĐƯỢC (WCAG 2.2.2, mức A): nội dung tự chuyển động,
   * chạy quá 5 giây và nằm cạnh chữ cần đọc thì bắt buộc có cách dừng. Dừng
   * khi rê chuột KHÔNG tính — người dùng bàn phím đang đọc cột chữ bên trái và
   * người dùng cảm ứng đều không rê được.
   *
   * MỘT nút cho cả section chứ không mỗi tầng một nút: ba nút làm cùng một
   * việc là ba lần hỏi cùng một câu, và chúng sẽ chen vào đúng chỗ chật nhất
   * của tầng kệ.
   */
  const [autoplay, setAutoplay] = useState(true);
  const reduced = useReducedMotion();

  return (
    <Tabs defaultValue={partners[0]?.id} className={className}>
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
        {header}
        {/* `flex-wrap` + `gap-3`: ở 375px cụm này rộng ~330px trong khung 335px.
            Không cho xuống dòng thì nó tràn ngay ở màn nhỏ nhất. */}
        <div className="flex flex-wrap items-center gap-3">
          {/* MỘT đối tác thì KHÔNG vẽ tablist. Một tab đơn độc không chuyển
              được sang đâu: nó trông y hệt một control (có gạch chân, đứng ngay
              cạnh nút "Xem chi tiết") nhưng bấm vào không xảy ra gì, và ở 375
              nó còn ăn trọn một dòng của hàng tiêu đề. Tên đối tác đã nằm trong
              câu dẫn của section và trong hồ sơ bên dưới, nên không mất chữ
              nào. Thêm đối tác thứ hai là tablist tự quay lại — đây là điều
              kiện trên dữ liệu, không phải một quyết định bị gỡ. */}
          {partners.length > 1 ? (
            <TabsList variant="line" className="h-auto">
              {partners.map((partner) => (
                <TabsTrigger
                  key={partner.id}
                  value={partner.id}
                  className="px-3 py-1.5 font-display text-ui font-medium"
                >
                  {partner.name}
                </TabsTrigger>
              ))}
            </TabsList>
          ) : null}

          {/* Không vẽ nút khi hệ điều hành đã khai `prefers-reduced-motion`:
              lúc đó băng vốn đứng yên, một cái nút "chạy lại" không làm gì là
              nói dối người dùng.

              CŨNG KHÔNG VẼ DƯỚI `lg`, và vì đúng lý do đó: thứ nút này dừng là
              băng ảnh trong `ShelfTier`, mà cả chồng `ShelfTier` khai
              `hidden ... lg:flex`. Dưới `lg` mặt trang là `ChipSpecs` — không
              có gì chuyển động — nên nút nằm đó là một control cho một vật
              không tồn tại. Đo ở 375 · 768 · 900: chiều cao của chồng tầng kệ
              bằng 0. */}
          {reduced ? null : (
            <span className="hidden lg:block">
              <MotionToggle
                playing={autoplay}
                labels={motionLabels}
                onToggle={() => setAutoplay((v) => !v)}
              />
            </span>
          )}
          {action}
        </div>
      </div>

      {partners.map((partner) => (
        <TabsContent key={partner.id} value={partner.id} className="mt-6">
          {/*
            Hồ sơ đối tác đứng CỘT TRÁI, kệ chip cột phải — không xếp chồng
            dọc. Thứ tự đọc trong DOM vẫn là giới thiệu → sản phẩm, đúng yêu
            cầu, nhưng nó tiêu chỗ theo chiều NGANG nên không lấy một pixel
            chiều cao nào của ba tầng kệ. Xếp dọc thì card phải tụt từ 141px
            xuống ~90px để section còn vừa một màn hình.
            Dưới lg thì xuống dòng như bình thường.
          */}
          <div className="grid gap-8 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-12">
            {/*
              `ChipSpecs` đứng TRƯỚC hồ sơ đối tác trong DOM, và đó là thứ tự
              đọc đúng ở khổ hẹp: section này tên là "phần cứng", nên câu hỏi
              đầu tiên là có những chip nào chứ không phải người sáng lập đối
              tác học ở đâu. Đo bản trước ở 375: hồ sơ chiếm ~700px đứng trên,
              tức phải cuộn gần một màn hình mới gặp con chip đầu tiên. Uy tín
              đối tác là BẰNG CHỨNG BỒI THÊM, đọc sau sản phẩm vẫn nguyên giá
              trị; đọc trước thì nó chặn mất sản phẩm.

              Không cần `order-*` ở cả hai khổ: mỗi khổ đúng một trong hai khối
              (`ChipSpecs` / kệ) mang `display:none`, nên khối bị ẩn rời hẳn
              khỏi dòng chảy và thứ tự DOM còn lại tự khớp thứ tự nhìn thấy.
              Nhờ vậy trình đọc màn hình và mắt luôn đi cùng một mạch — thứ mà
              `order` thuần CSS không bảo đảm được.
            */}
            <ChipSpecs lines={partner.lines} className="lg:hidden" />

            <PartnerIntro intro={partner.intro} />

            {/* `min-w-0` KHÔNG phải để cho đẹp — thiếu nó thì cả trang chủ
                cuộn ngang được ở mọi khổ dưới `lg`.

                Băng thẻ chip bên trong cuộn ngang được, nhưng bề rộng
                MIN-CONTENT của nó vẫn là tổng năm thẻ (5 × 12,5rem + khe =
                1048px). Con số đó dâng lên qua `ShelfTier` thành 1088px, và
                khối này là GRID ITEM: `min-width: auto` của grid item bằng
                chính min-content ấy, nên cột lưới nở ra 1088px và đẩy tài
                liệu rộng hơn khung nhìn. Từ `lg` trở lên không thấy lỗi vì
                `lg:grid-cols-[minmax(0,...)]` đã chặn sẵn; dưới `lg` lưới
                chỉ có một cột ngầm `auto` nên không có gì chặn.
                Đo ở 768: `scrollWidth` 1120 trên khung 768. Ở 375 còn nặng
                hơn — trình duyệt thu nhỏ cả trang cho vừa phần tràn, nên
                `innerWidth` báo về 1108 và trang chủ hiện ra ở dạng thu nhỏ. */}
            <RevealGroup className="hidden min-w-0 lg:flex lg:flex-col lg:gap-3">
              {partner.lines.map((line, i) => (
                <ShelfTier
                  key={line.name}
                  line={line}
                  index={i}
                  autoplay={autoplay}
                />
              ))}
            </RevealGroup>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}

function PartnerIntro({ intro }: { intro: ShelfPartnerIntro }) {
  return (
    <Reveal className="flex flex-col gap-6">
      <div>
        <h3 className="font-display text-title font-semibold text-balance">
          {intro.origin}
        </h3>
        {/* Đường link đứng NGAY DƯỚI câu định nghĩa công ty, không nằm cuối
            khối hồ sơ như bản cũ: người đọc hỏi "đây là ai" thì chỗ đi tra
            phải ở ngay chỗ vừa trả lời, không phải ba đoạn sau. */}
        {intro.site ? <PartnerSite site={intro.site} /> : null}
      </div>

      <div>
        <p className="font-mono text-eyebrow font-medium text-subtle-foreground uppercase">
          {intro.tech.label}
        </p>
        <p className="mt-3 text-body-sm font-medium">{intro.tech.title}</p>
        <p className="mt-1 text-meta text-muted-foreground">{intro.tech.body}</p>
      </div>

      <div>
        <p className="font-mono text-eyebrow font-medium text-subtle-foreground uppercase">
          {intro.leadLabel}
        </p>
        {/* Tên người lên `text-body` + `font-display` (bản cũ `text-body-sm`):
            trong cột này nó đang là dòng duy nhất chỉ một con người, mà nó lại
            nhỏ bằng chú thích. Vẫn dưới `text-title` của `origin` nên thứ bậc
            trong cột không đổi. */}
        <p className="mt-3 font-display text-body font-medium">
          {intro.lead.name}
        </p>
        {/* Chức danh tô màu thương hiệu: đó là thứ mắt cần bám để biết mình
            đang đọc hồ sơ của ai, không phải cái tên. */}
        {/* `brand-ink` chứ không `brand/80`: bản cũ chỉ 3.2:1 — mờ nhất section,
            mà đây lại là dòng cố ý tô màu để mắt bám vào. */}
        <p className="text-ui font-medium text-brand-ink">{intro.lead.role}</p>

        {/* Ba mốc nghề nghiệp, mỗi mốc một dòng, có chấm đầu dòng.
            `list-outside` + `pl-4` chứ không `list-inside`: mốc dài xuống dòng
            thì dòng hai thụt vào thẳng hàng với CHỮ, không chui xuống dưới cái
            chấm. Đó là khác biệt giữa một hồ sơ và một đoạn văn bị bẻ.
            Chấm ăn màu `subtle-foreground` — mờ hơn chữ một nấc, đủ để dẫn mắt
            xuống mà không đếm ngang với nội dung. */}
        <ul className="mt-2.5 list-disc space-y-1 pl-4 marker:text-subtle-foreground">
          {intro.lead.creds.map((cred) => (
            <li key={cred} className="text-meta text-muted-foreground">
              {cred}
            </li>
          ))}
        </ul>
      </div>

      {/* Hai con số nằm ngang nhau, nhãn xuống dòng dưới. Chữ số cỡ `subhead`
          chứ không `display`: đây là chứng chỉ năng lực của một đối tác, không
          được to hơn bốn chỉ số kết quả kinh doanh ở section Stats phía trên. */}
      <dl className="flex gap-8 border-t pt-5">
        {intro.stats.map((stat) => (
          <div key={stat.label}>
            <dt className="sr-only">{stat.label}</dt>
            <dd className="font-display text-subhead font-semibold tabular-nums">
              {stat.value}
            </dd>
            <p aria-hidden className="mt-0.5 text-meta text-muted-foreground">
              {stat.label}
            </p>
          </div>
        ))}
      </dl>
    </Reveal>
  );
}

/**
 * Đường về web đối tác. Nhãn là CHÍNH TÊN MIỀN chứ không phải "Xem web
 * Pebble Square": tên miền tự nói nó dẫn đi đâu, còn một câu mệnh lệnh thì
 * chiếm hai lần chữ để nói cùng chừng ấy. Mũi tên chéo là dấu quy ước của link
 * mở tab mới — nó thay luôn phần chữ đã bỏ đi.
 *
 * Không gạch chân, không viền dưới như bản cũ: cột này đã có ba khối chữ xếp
 * dọc, thêm một đường kẻ nữa là thêm một vạch chia không cần thiết. Trạng thái
 * link nói bằng màu và bằng cú nhích của mũi tên khi rê chuột.
 */
function PartnerSite({ site }: { site: { href: string; label: string } }) {
  return (
    <a
      href={site.href}
      target="_blank"
      rel="noreferrer"
      className="group/site mt-2.5 inline-flex items-center gap-1.5 text-meta text-muted-foreground transition-colors duration-(--dur-fast) hover:text-brand"
    >
      {site.label}
      {/* Vẽ bằng SVG chứ không dùng ký tự ↗ — ký tự đổi hình theo font, mà font
          của site không phải font biểu tượng. */}
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-3 transition-transform duration-(--dur-fast) group-hover/site:-translate-y-px group-hover/site:translate-x-px"
      >
        <path d="M5.5 10.5 10.5 5.5M6 5.5h4.5V10" />
      </svg>
    </a>
  );
}

/**
 * Thứ tự đọc trong một tầng: TÊN → hợp với việc gì → thông số. Lợi ích trước,
 * con số sau — người quét trang dừng ở dòng thứ hai là đủ hiểu, người soi kỹ
 * đi tiếp xuống bảng số. Đảo lại thì ai cũng phải bước qua bảng số. Cột chữ
 * rộng cố định 15rem còn băng card ăn hết phần dư, nên ở 1440px băng thấy 2
 * card rưỡi và ở 1024px thấy 1 card rưỡi — luôn có một card bị cắt dở, và đó
 * chính là thứ nói cho người đọc biết còn thứ nữa ở bên phải.
 */
/**
 * ============================================================================
 * BẢN KHỔ HẸP — ba cột thông số, không có kệ ảnh. Chỉ sống dưới `lg`.
 * ----------------------------------------------------------------------------
 * VÌ SAO KHÔNG DÙNG LẠI KỆ. Kệ là ba tầng, mỗi tầng một băng cuộn ngang năm
 * thẻ ảnh. Xếp dọc ở khổ hẹp thì nó cho ra, đo ở 375:
 *   · section cao 2049px = 2,5 màn hình, dài nhất trang;
 *   · 15 thẻ ứng dụng, trong khi luật 4 của repo cho tối đa 4 mục CÓ MÔ TẢ;
 *   · 10/15 ảnh chưa có, nên phần lớn băng là ô chờ rỗng;
 *   · nhãn bị cắt giữa chữ ("Kiểm tr…", "Cảm b…"), mà hai nút trôi chỉ hiện
 *     khi rê chuột — trên cảm ứng không còn tín hiệu nào báo là cuộn được.
 * Ba dòng chip là ba LỰA CHỌN THAY THẾ NHAU, không phải ba nấc tăng tiến. Bắt
 * người đọc cuộn dọc qua cả ba cùng 15 ô chờ là bắt họ đi hết thứ họ đã loại
 * ngay từ dòng đầu.
 *
 * VÌ SAO KHÔNG PHẢI BẢNG SO SÁNH THẬT. Bảng so sánh cần một trục chung, mà ba
 * chip KHÔNG dùng chung bộ thông số: MINT và PAPAYA khai (hiệu suất điện · nơ-
 * ron · kích thước), còn ESPRESSO khai (tiến trình · hiệu năng đỉnh · công
 * suất). Ép chúng vào một bảng bốn dòng thì phải bịa ra giá trị cho những ô
 * trống — đúng thứ luật 5 cấm. Nên đây là ba CỘT thông số đặt cạnh nhau: so
 * được hình dáng và thứ hạng, không giả vờ so được từng dòng.
 *
 * ỨNG DỤNG THÀNH NHÃN TRẦN, ngăn bằng dấu chấm giữa. Luật 4 cho phép "nhiều
 * hơn bốn mục nhưng chỉ là nhãn trần" — và đó cũng là tất cả những gì năm cái
 * tên kia đang nói, vì ảnh thì chưa có. Khi đủ 15 ảnh thì cân lại: hoặc trả
 * kệ về cho khổ hẹp, hoặc cho mỗi chip một băng ảnh riêng sau khi bấm chọn.
 * ============================================================================
 */
function ChipSpecs({
  lines,
  className,
}: {
  lines: ShelfLine[];
  className?: string;
}) {
  return (
    /* `md:grid-cols-3` — ở 768 khung rộng 704px cho ba cột ~224px, đủ cho dòng
       thông số dài nhất ("Công suất điển hình") không gãy làm ba. Hẹp hơn thì
       xuống một cột. */
    <RevealGroup className={cn("grid min-w-0 gap-4 md:grid-cols-3", className)}>
      {lines.map((line) => (
        <RevealItem
          key={line.name}
          className="relative isolate flex flex-col gap-4 rounded-xl p-5"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] bg-surface"
          />
          {/* Mép sáng dưới chân thẻ mang màu chip — đúng hai chỗ được dùng màu
              chip như quyết định 4 của kệ, giữ nguyên ở bản này. */}
          <span
            aria-hidden
            className={cn("pv-edge bg-linear-to-t to-border", ACCENT[line.accent].edge)}
          />

          <div className="flex flex-col gap-1.5">
            <h4
              className={cn(
                "font-display text-title font-semibold",
                ACCENT[line.accent].name,
              )}
            >
              {line.name}
            </h4>
            <p className="text-body-sm text-muted-foreground">{line.fit}</p>
          </div>

          {/* Cột số canh thẳng hàng: `dt` cố định bề ngang theo nội dung dài
              nhất của CHÍNH thẻ đó, không phải của cả ba — ba chip khai ba bộ
              đơn vị khác nhau nên ép chung một bề ngang là để lại một khoảng
              trống lớn ở thẻ có số ngắn. */}
          <dl className="flex flex-col gap-1.5 border-t pt-4">
            {line.specs.map((spec) => (
              <div key={spec.label} className="flex items-baseline gap-3">
                {/* `whitespace-nowrap`: giá trị là MỘT đơn vị đo, gãy dòng
                    giữa số và đơn vị thì "17 TOPS/W" đọc thành "17" rồi
                    "TOPS/W" ở dòng dưới. Ở cột 224px của khổ 768 thì cả ba
                    chip đều dính: 17 TOPS/W, 30 TOPS/W, ~160 TOPS. Nhãn mới
                    là thứ được phép xuống dòng. */}
                <dt className="font-mono text-meta whitespace-nowrap text-foreground">
                  {spec.value}
                </dt>
                <dd className="text-body-sm text-muted-foreground">{spec.label}</dd>
              </div>
            ))}
          </dl>

          {/* Tên thiết bị nối bằng dấu chấm giữa.

              Dấu đứng SAU mỗi mục (trừ mục cuối), không phải trước mỗi mục
              (trừ mục đầu). Hai cách nhìn qua như nhau nhưng khác hẳn khi
              xuống dòng: đặt trước thì dấu bị đẩy xuống mở đầu dòng mới và cả
              cụm đọc ra là một danh sách bullet lạc — đo ở 375 thì hai trong
              năm nhãn của MINT rơi đúng vào cảnh đó. Đặt sau thì dấu luôn dính
              vào đuôi mục nó vừa ngăn, và dòng mới bắt đầu bằng chữ.

              `aria-hidden` cho dấu: nó là nét phân cách của MẮT. Cấu trúc danh
              sách đã nằm ở `ul`/`li` nên trình đọc màn hình tự biết có bao
              nhiêu mục, đọc thêm "chấm" giữa mỗi mục chỉ là rác. */}
          {/* Dòng chảy CHỮ, không phải lưới flex. Để `flex flex-wrap` thì mỗi
              `li` là một ô lưới và ô nào không đủ chỗ sẽ tự chiếm trọn một
              dòng — ở cột 224px của khổ 768 thành ra mỗi tên một dòng, kèm một
              dấu chấm lơ lửng ở cuối dòng chẳng ngăn cách gì. `inline` thì năm
              cái tên chảy liền như một câu và tự lấp đầy từng dòng, đúng thứ
              "nhãn trần" mà luật 4 cho phép liệt kê quá bốn mục. */}
          <ul className="border-t pt-4 text-body-sm text-subtle-foreground">
            {line.products.map((p, i) => (
              <li key={p.name} className="inline">
                {p.name}
                {i < line.products.length - 1 ? (
                  <span aria-hidden className="mx-2 text-border">
                    ·
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

function ShelfTier({
  line,
  index,
  autoplay,
}: {
  line: ShelfLine;
  index: number;
  autoplay: boolean;
}) {
  const accent = ACCENT[line.accent];

  return (
    <RevealItem className="group relative flex flex-col gap-4 rounded-xl bg-background px-5 py-2 transition-colors duration-(--dur-base) hover:bg-surface lg:flex-row lg:items-center lg:gap-6 lg:px-7">
      {/* Vòng viền 1px. Gradient đi từ dưới lên nên mép sáng nằm ở chân tầng
          kệ — cùng hướng ánh sáng với `pv-skyglow` của section, chỉ đổi màu
          theo dòng chip. */}
      <span
        aria-hidden
        className={cn("pv-edge bg-linear-to-t to-border", accent.edge)}
      />

      <div className="min-w-0 lg:w-[15rem] lg:shrink-0">
        <h3 className={cn("font-display text-title font-semibold", accent.name)}>
          {line.name}
        </h3>
        {/* Câu ứng dụng ăn màu chữ mặc định chứ không `muted`: nó là câu văn
            duy nhất của tầng, bản cũ để nó mờ ngang chú thích. */}
        <p className="mt-1 text-body-sm">{line.fit}</p>

        {/*
          BẢNG THÔNG SỐ. Bản trước là một dòng mono 11px màu mờ nhất bảng
          (`17 TOPS/W · mạng nơ-ron 4 triệu · 5×5 mm²`) — ba giá trị khác loại
          nhau bị nhồi vào một dòng, ngăn bằng dấu chấm giữa, ở cỡ chữ không ai
          đọc nổi. Nay mỗi thông số một dòng, và số tách khỏi nhãn.

          BA quyết định hình, cả ba đều để cột số đọc như một bảng datasheet
          chứ không như một câu:
          · SỐ ĐỨNG TRƯỚC NHÃN. Người soi thông số tìm con số, không tìm chữ.
          · CỘT SỐ RỘNG CỐ ĐỊNH `5rem` — vừa `~160 TOPS`, chuỗi dài nhất trong
            ba dòng chip, còn dư một nhịp phòng khi font mono đo khác. Cố định
            thì ba nhãn thẳng hàng nhau và mắt đi xuống theo một mép; để `auto`
            thì mỗi dòng lệch một kiểu. Kèm `whitespace-nowrap`: một con số bị
            bẻ đôi vừa sai nghĩa vừa đội chiều cao cả tầng.
          · `tabular-nums` để chữ số nào cũng cùng bề ngang, không thì `1` hẹp
            hơn `0` và cột số trông rung.

          DOM vẫn là `dt` trước `dd` (đúng thứ tự HTML yêu cầu, và trình đọc
          màn hình nghe ra "Hiệu suất điện — 17 TOPS/W" mới thuận tai); chỉ
          `order` đảo lại phần NHÌN. Đừng đổi thành `dd` đứng trước trong DOM.
        */}
        <dl className="mt-3 space-y-1">
          {line.specs.map((spec) => (
            <div key={spec.label} className="flex items-baseline gap-3">
              <dt className="order-2 min-w-0 text-meta text-muted-foreground">
                {spec.label}
              </dt>
              <dd className="order-1 w-20 shrink-0 font-mono text-meta font-medium whitespace-nowrap tabular-nums">
                {spec.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <ProductCarousel line={line} index={index} autoplay={autoplay} />
    </RevealItem>
  );
}

/** Nút dừng / chạy lại băng. Đổi NHÃN theo trạng thái chứ không dùng
 *  `aria-pressed` — với một cặp play/pause thì tên nút phải nói việc bấm vào
 *  sẽ làm gì, đó là điều trình đọc màn hình đọc ra trước tiên. */
function MotionToggle({
  playing,
  labels,
  onToggle,
}: {
  playing: boolean;
  labels: { pause: string; play: string };
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={playing ? labels.pause : labels.play}
      title={playing ? labels.pause : labels.play}
      className="grid size-8 shrink-0 place-items-center rounded-full border text-muted-foreground transition-colors duration-(--dur-fast) hover:border-brand hover:text-brand"
    >
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        fill="currentColor"
        className="size-3.5"
      >
        {playing ? (
          <path d="M5 3h2.2v10H5zM8.8 3H11v10H8.8z" />
        ) : (
          <path d="M5 3.2 12.5 8 5 12.8z" />
        )}
      </svg>
    </button>
  );
}

/**
 * Băng card sản phẩm — một khung cuộn ngang thật, không phải transform giả.
 * Được cái: vuốt bằng ngón tay, cuộn ngang bằng trackpad, `Tab` vào card và
 * bàn phím tự cuộn theo — tất cả miễn phí từ trình duyệt. `snap-start` để card
 * luôn dừng ở mép trái khung chứ không nằm nửa trong nửa ngoài.
 *
 * Hai nút chỉ hiện khi rê vào tầng hoặc khi chính nó nhận focus bàn phím —
 * `opacity-0` chứ không `hidden`, nên nút vẫn nằm trong thứ tự Tab.
 *
 * `py-1` ở track KHÔNG phải để cho đẹp: card nhấc lên 4px khi rê chuột, mà
 * `overflow-x-auto` khiến trục dọc cũng thành `auto` — không chừa 4px đó thì
 * cú nhấc bị cắt cụt hoặc đẻ ra thanh cuộn dọc. Đổi lại, tầng kệ hạ `py-3`
 * xuống `py-2` nên tổng chiều cao không đổi một pixel nào.
 */
function ProductCarousel({
  line,
  index,
  autoplay,
}: {
  line: ShelfLine;
  index: number;
  autoplay: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  /* Không `once`: băng phải dừng lại khi cuộn ra khỏi khung nhìn, nên cờ này
     bật tắt hai chiều. */
  const inView = useInView(trackRef, { amount: 0.4 });
  /* `ref` chứ không `state`: chuột vào ra băng liên tục, mà mỗi lần đổi state
     là một lần render lại cả 5 card cho một thứ không hề đổi hình.
     Hai cờ riêng chứ không một cờ chung: rời focus trong khi chuột vẫn đang
     nằm trên băng thì băng phải TIẾP TỤC dừng. */
  const hoverRef = useRef(false);
  const focusRef = useRef(false);

  const scrollByCard = useCallback(
    (dir: 1 | -1) => {
      const track = trackRef.current;
      const card = track?.firstElementChild;
      if (!track || !(card instanceof HTMLElement)) return;
      /* "instant" chứ không "auto": `auto` nghĩa là "theo CSS", mà CSS ở track
         đang là `scroll-smooth` — nên `auto` vẫn trôi mượt và người bật
         reduced-motion không được gì. */
      track.scrollBy({
        left: dir * (card.offsetWidth + GAP_PX),
        behavior: reduced ? "instant" : "smooth",
      });
    },
    [reduced],
  );

  useEffect(() => {
    if (reduced || !inView || !autoplay) return;

    const step = () => {
      const track = trackRef.current;
      if (!track || hoverRef.current || focusRef.current) return;
      /* Trừ 2px: `scrollWidth` và `scrollLeft` là số thực đã làm tròn, ở một
         số tỷ lệ zoom hai vế lệch nhau đúng một pixel và băng kẹt ở cuối. */
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
      if (atEnd) track.scrollTo({ left: 0, behavior: "smooth" });
      else scrollByCard(1);
    };

    /* Lệch pha bằng một `setTimeout` mở màn, rồi mới vào nhịp đều. */
    let ticker: ReturnType<typeof setInterval>;
    const opening = setTimeout(() => {
      step();
      ticker = setInterval(step, SHELF.auto);
    }, index * SHELF.stagger);

    return () => {
      clearTimeout(opening);
      clearInterval(ticker);
    };
  }, [reduced, inView, autoplay, index, scrollByCard]);

  return (
    <div
      className="relative min-w-0 flex-1"
      /* Dừng băng khi con trỏ hoặc bàn phím đang ở trong. `pointer` chứ không
         `mouse` để bắt cả ngón tay và bút cảm ứng. */
      onPointerEnter={() => (hoverRef.current = true)}
      onPointerLeave={() => (hoverRef.current = false)}
      onFocusCapture={() => (focusRef.current = true)}
      onBlurCapture={() => (focusRef.current = false)}
    >
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto py-1 scroll-smooth [scrollbar-width:none] motion-reduce:scroll-auto [&::-webkit-scrollbar]:hidden"
      >
        {/* Card KHÔNG viền. Nó đã tự tách khỏi tầng kệ bằng nền sáng hơn một
            nấc; thêm viền nữa là hai lần nói cùng một điều, và 15 khung viền
            cạnh nhau đọc ra là một cái bảng chứ không phải một kệ hàng.

            THẺ NỔI LÊN bằng ba thứ, không thứ nào là đổ bóng (site này dùng
            viền và ánh sáng thay bóng):
              · nền dốc từ tối lên sáng theo chiều DỌC — mặt trên tối hơn mặt
                dưới, đúng như một vật đứng trong thế giới có ánh sáng dâng từ
                chân trời. Đây là thứ làm nó ra khối chứ không ra mảng phẳng.
              · một vệt sáng mảnh ở CHÂN thẻ, mờ dần về hai đầu nên không đọc
                ra là cạnh viền — đọc ra là ánh sáng lọt xuống dưới đáy thẻ.
              · rê chuột thì thẻ nhấc lên 4px và vệt sáng chân thẻ ngả sang màu
                brand. Nhấc bằng `transform` nên không đụng tới bố cục.
            `py-2.5` để vật thể có khoảng thở trên dưới — ảnh vẫn tràn hết bề
            ngang card nhưng không chạm mép trên mép dưới. */}
        {line.products.map((product) => (
          <article
            key={product.name}
            className={cn(
              CARD,
              "group/card relative shrink-0 snap-start overflow-hidden rounded-xl bg-linear-to-b from-surface to-surface-2 py-2.5 transition-transform duration-(--dur-base) hover:-translate-y-1",
            )}
          >
            <span
              aria-hidden
              className="absolute inset-x-5 bottom-0 h-px bg-linear-to-r from-transparent via-border to-transparent transition-colors duration-(--dur-base) group-hover/card:via-brand/60"
            />
            {/* `object-cover` chứ không `contain`: ảnh giao SAI tỷ lệ sẽ bị
                CẮT chứ không co lại. Ảnh 1:1 đưa vào khung 16:9 mất 44% chiều
                cao — đệm trong suốt cho đủ 16:9 trước khi giao, đừng sửa ở đây
                (xem docs/IMAGE-BRIEF.md §2.1). */}
            <MediaFrame
              compact
              ratio="wide"
              src={product.src}
              alt={product.name}
              need={product.need}
              sizes="200px"
              /* `bg-transparent` bắt buộc: `MediaFrame` mặc định có nền
                 `bg-surface`, mà nền đó sẽ phủ một mảng phẳng lên đúng khúc
                 giữa của gradient thẻ và làm mất hiệu ứng khối. */
              className="rounded-none border-0 bg-transparent"
            />
            {/* `truncate` chứ không cho xuống dòng: nhãn hai dòng làm mọi card
                cao thêm 20px và ảnh phải tụt lại. Nhãn dài quá một dòng là
                nhãn viết chưa đủ gọn — sửa chữ, đừng nới card. */}
            <p className="mt-2 truncate px-2.5 text-center text-meta text-muted-foreground">
              {product.name}
            </p>
          </article>
        ))}
      </div>

      <CarouselButton side="left" label={line.nav.prev} onClick={() => scrollByCard(-1)} />
      <CarouselButton side="right" label={line.nav.next} onClick={() => scrollByCard(1)} />
    </div>
  );
}

function CarouselButton({
  side,
  label,
  onClick,
}: {
  side: "left" | "right";
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "absolute top-1/2 z-10 grid size-7 -translate-y-1/2 place-items-center rounded-full border bg-background/80 text-muted-foreground opacity-0 backdrop-blur-sm transition-all duration-(--dur-fast) hover:border-brand hover:text-brand focus-visible:opacity-100 group-hover:opacity-100",
        side === "left" ? "left-1" : "right-1",
      )}
    >
      {/* Mũi tên vẽ bằng SVG chứ không dùng ký tự ‹ › — ký tự đổi hình theo
          font, mà font chữ của site không phải font biểu tượng. */}
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("size-3.5", side === "left" && "rotate-180")}
      >
        <path d="M6 3.5 10.5 8 6 12.5" />
      </svg>
    </button>
  );
}
