import { Fragment, type ReactNode } from "react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Highlight } from "@/components/pv/highlight";

/**
 * ============================================================================
 * CHƯƠNG TRÌNH ĐÀO TẠO AI — MẢNG KINH DOANH THỨ BA
 * ----------------------------------------------------------------------------
 * `home.who.r2Text` khai ba mảng: "phần cứng, phần mềm và đào tạo AI". Hai mảng
 * đầu đã có section riêng (`Hardware`, `Software`); đây là mảng thứ ba, nên nó
 * phải đọc ra là ĐỒNG HẠNG với hai cái kia — cùng công thức tiêu đề (nhãn hạng
 * mục gộp dòng, cỡ `subhead`, thẻ vẫn `h2`), không phải một phụ lục dịch vụ.
 *
 * BỐ CỤC LÀ MỘT CÂU TRẢ LỜI. Câu hỏi mà khối phần mềm vừa làm nảy ra là "mua về
 * rồi ai dùng?". Hai cột trả lời hai nửa của câu đó và KHÔNG được đổi chỗ:
 *   · CỘT TRÁI  — lời hứa và ai học: đọc trong 10 giây là biết có mua hay không;
 *   · CỘT PHẢI  — ba điều làm nên chương trình, mỗi điều kèm dãy thông số để
 *                 người đã gật đầu ở cột trái có cái mà soi.
 * Trái hẹp phải rộng (1/3 · 2/3) vì cột trái là chữ để ĐỌC còn cột phải là
 * bảng để QUÉT — đảo tỷ lệ thì dãy thông số phải xuống dòng và mất luôn dạng bảng.
 *
 * BA THẺ CÙNG MỘT CƯỜNG ĐỘ. Bản thiết kế gốc tô ba tiêu đề thẻ ba màu khác nhau
 * (bạc hà · cam · xanh). Không làm được ở đây, và lý do nằm ngay trong
 * `globals.css` LỚP 1: ba màu chip là NGOẠI LỆ DUY NHẤT cho luật "mọi ánh sáng
 * trên trang dẫn xuất từ --brand", và ngoại lệ đó chỉ cấp cho kệ phần cứng, nơi
 * màu đóng vai NHÃN phân biệt ba dòng sản phẩm có thật. Ở đây ba thẻ là ba
 * nguyên tắc song hàng của cùng một chương trình — không có gì để phân biệt
 * bằng màu, và ba nguồn sáng trong một section thì section mất chân trời.
 * Nhịp thị giác của bản gốc (tiêu đề mono viết hoa có màu) vẫn giữ, chỉ là cả
 * ba cùng đọc `brand-ink` — token dành riêng cho CHỮ màu brand (7,1:1 ở mọi nấc
 * trời); `brand` là màu của quầng sáng, đem viết chữ nhỏ chỉ được 4,5:1.
 *
 * DÃY THÔNG SỐ LÀ `dl`, KHÔNG PHẢI HAI CỘT SPAN. Mỗi dòng là một cặp trị–tên
 * ("2 tuần" ↔ "Khảo sát"), tức đúng nghĩa danh sách định nghĩa: trình đọc màn
 * hình xướng "danh sách 3 mục" rồi đọc liền từng cặp, thay vì đọc rời sáu mẩu
 * chữ mất hết quan hệ. `dt` giữ TRỊ và `dd` giữ TÊN — ngược với thói quen,
 * nhưng đó là thứ tự người ta đọc trên mặt trang và `dt` phải đứng trước `dd`.
 * `dl` không có trong bảng `TAGS` của `reveal.tsx` nên nó nằm TRONG `RevealItem`
 * chứ không phải là `RevealItem` — đừng thêm `dl` vào bảng đó chỉ vì chỗ này.
 *
 * KHÔNG CÓ NÚT "XEM CHƯƠNG TRÌNH". Bản thiết kế gốc có, hai section anh em cũng
 * đều có một nút phụ ở hàng tiêu đề — nhưng registry chưa có entry nào cho mảng
 * đào tạo, tức chưa có trang để dẫn tới. Trỏ tạm sang `/ai-assessment` thì nó
 * đứng cách `CtaBand` đúng một màn hình và trùng luôn nhãn: hai lời mời giống
 * hệt nhau nằm liền nhau. Có trang thì trả nút về (xem `pageGap`).
 *
 * NGÂN SÁCH CHIỀU CAO — 1440×900, `--section-y` 8,5rem mỗi đầu nên còn 628px:
 *   tiêu đề (nhãn gộp dòng) + lead          ~118px
 *   khe `mt-10`                               40px
 *   cột phải: 3 thẻ ~124px + 2 khe 16px      404px
 * Cộng ~562px, và cột trái luôn thấp hơn cột phải nên nó không phải phần quyết
 * định. Phần dư là chỗ cho tiếng Anh và tiếng Hàn nở ra ở bước dịch — đừng tiêu
 * trước. ĐO chứ đừng cộng nhẩm khi sửa: xem bẫy "lỗ 91px" trong HANDOFF.
 * ============================================================================
 */

export interface TrainingPillar {
  /** Tiêu đề thẻ. Mono viết hoa — nó là NHÃN nguyên tắc, không phải câu. */
  title: string;
  text: string;
  /** Dãy thông số. Ba dòng là trần: dòng thứ tư đẩy thẻ cao hơn khối chữ. */
  rows: { value: string; label: string }[];
}

/** Một cặp nhãn–nội dung ở cột trái. */
export interface TrainingNote {
  label: string;
  text: string;
}

/** Một con số ở chân cột trái. */
export interface TrainingMetric {
  value: string;
  label: string;
}

export function TrainingProgram({
  header,
  claim,
  notes,
  metrics,
  pillarsLabel,
  pillars,
  className,
}: {
  /** Tiêu đề section — nhận vào đây để nó nằm chung khối với hai cột. */
  header?: ReactNode;
  /** Lời hứa của chương trình, ba nhịp. Không phải tiêu đề: nó là một câu. */
  claim: string;
  notes: TrainingNote[];
  metrics: TrainingMetric[];
  /** aria-label cho cột phải — một chồng ba thẻ không tự khai nó là gì. */
  pillarsLabel: string;
  pillars: TrainingPillar[];
  className?: string;
}) {
  return (
    <div className={className}>
      {header}

      {/* `items-start` chứ không `items-stretch`: cột trái ngắn hơn cột phải và
          nó phải bám mép trên, không giãn ra cho bằng. */}
      <div className="mt-10 grid items-start gap-x-10 gap-y-8 lg:grid-cols-3">
        <Reveal className="flex flex-col gap-6">
          <p className="font-display text-title font-semibold text-balance">
            <Highlight>{claim}</Highlight>
          </p>

          {/* Vạch ngăn là `border-t`, không phải một `<hr>`: nó thuộc về khối
              chữ bên dưới chứ không phải một phần tử độc lập trong dàn bài. */}
          <dl className="flex flex-col gap-5 border-t border-border pt-6">
            {notes.map((note) => (
              <div key={note.label} className="flex flex-col gap-1.5">
                <dt className="font-mono text-micro font-medium text-subtle-foreground uppercase">
                  {note.label}
                </dt>
                <dd className="text-body-sm text-muted-foreground">
                  <Highlight>{note.text}</Highlight>
                </dd>
              </div>
            ))}
          </dl>

          {/* `max-w` chứ không để lưới tự giãn: từ `lg` cột trái hẹp nên hai
              số đứng vừa tầm mắt, nhưng dưới `lg` cột này rộng cả trang và
              `grid-cols-2` thả trơn sẽ ném "90" sang tận mép phải, cách "12"
              hơn 600px — hai con số của cùng một khối đọc ra thành hai khối. */}
          <dl className="grid max-w-[22rem] grid-cols-2 gap-x-6 border-t border-border pt-6">
            {metrics.map((metric) => (
              <div key={metric.label} className="flex flex-col gap-1">
                <dt className="font-display text-subhead font-semibold tabular-nums">
                  {metric.value}
                </dt>
                <dd className="text-meta text-subtle-foreground">
                  {metric.label}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <RevealGroup
          aria-label={pillarsLabel}
          className="flex flex-col gap-4 lg:col-span-2"
        >
          {pillars.map((pillar) => (
            <PillarCard key={pillar.title} pillar={pillar} />
          ))}
        </RevealGroup>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Một nguyên tắc                                                             */
/* -------------------------------------------------------------------------- */

function PillarCard({ pillar }: { pillar: TrainingPillar }) {
  return (
    <RevealItem className="relative isolate rounded-xl p-6 lg:p-7">
      {/* Mặt thẻ + vòng viền: lấy nguyên nấc `stat` của `StatTile` để lưới này
          và bento chỉ số ở nửa trên trang đọc ra là một hệ. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] bg-surface bg-linear-to-t from-brand/5 via-transparent to-transparent"
      />
      <span aria-hidden className="pv-edge bg-linear-to-t from-brand/20 to-border" />

      {/* Cột thông số RỘNG CỐ ĐỊNH, không phải `auto`. Với `auto` mỗi thẻ tự co
          theo nội dung của riêng nó, nên ba dãy bắt đầu ở ba mốc khác nhau
          ("2 tuần" · "Đám mây" · "Tuần 0" lệch nhau ~45px) — đo ở 1440 thấy rõ
          là ba thẻ răng cưa. 15rem đủ cho cặp rộng nhất hiện có
          ("30·60·90" + "Quy trình rà soát" ≈ 218px) và còn biên cho tiếng Anh,
          tiếng Hàn nở ra ở bước dịch.

          Tách cột từ `md` chứ không phải `sm`: ở 640px, trừ đi 15rem này thì
          khối chữ chỉ còn ~256px, tức khoảng 30 ký tự một dòng. Dưới ngưỡng đó
          dãy thông số xuống nằm dưới khối chữ — xem bản 375. */}
      <div className="grid gap-x-8 gap-y-4 md:grid-cols-[minmax(0,1fr)_15rem] md:items-start">
        <div className="flex flex-col gap-2">
          <h3 className="font-mono text-eyebrow font-medium text-brand-ink uppercase">
            {pillar.title}
          </h3>
          <p className="max-w-[46ch] text-body-sm text-muted-foreground">
            <Highlight>{pillar.text}</Highlight>
          </p>
        </div>

        <dl className="grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-2">
          {pillar.rows.map((row) => (
            <Fragment key={row.label}>
              <dt className="font-mono text-meta tabular-nums">{row.value}</dt>
              <dd className="font-mono text-meta text-subtle-foreground">
                {row.label}
              </dd>
            </Fragment>
          ))}
        </dl>
      </div>
    </RevealItem>
  );
}
