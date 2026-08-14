import type { ReactNode } from "react";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Highlight } from "@/components/pv/highlight";
import { cn } from "@/lib/utils";

/**
 * ============================================================================
 * BẢNG LỘ TRÌNH ĐÀO TẠO — MẢNG KINH DOANH THỨ BA
 * ----------------------------------------------------------------------------
 * `home.who.r2Text` khai ba mảng: "phần cứng, phần mềm và đào tạo AI". Hai mảng
 * đầu đã có section riêng (`Hardware`, `Software`); đây là mảng thứ ba, nên nó
 * phải đọc ra là ĐỒNG HẠNG với hai cái kia — cùng công thức tiêu đề (nhãn hạng
 * mục gộp dòng, cỡ `subhead`, thẻ `h2`), không phải một phụ lục dịch vụ.
 *
 * BỐ CỤC LÀ MỘT CÂU TRẢ LỜI. Câu hỏi mà khối phần mềm vừa làm nảy ra là "mua về
 * rồi ai dùng?", và câu trả lời phải nói cùng lúc hai vế nghe như trái nhau:
 *   · KHUNG THÌ RÕ    — ba lộ trình, mỗi lộ trình bốn phần, đọc hết trong 15s;
 *   · CHI TIẾT THÌ KHÔNG — bài tập và dữ liệu là của chính doanh nghiệp.
 * Nên ba panel song song (không phải ba nấc tăng tiến: ba nhóm người này học
 * cùng lúc, không ai là nấc trên của ai — đây là chỗ khác `StageMatrix`), và
 * một dải chú ở chân lưới nói vế thứ hai MỘT lần cho cả ba, thay vì lặp chữ
 * "tuỳ chỉnh" ba lần trong ba panel.
 *
 * DÃY MODULE LÀ THỨ LÀM NÓ RA "KHOÁ HỌC". Bỏ dãy số và sợi dọc đi thì ba panel
 * này thành ba thẻ dịch vụ như mọi trang web khác. Số `01–04` + sợi sáng dần
 * xuống dưới là cách site này đã nói "tiến trình" ở `StepRail` — ở đây thu nhỏ
 * lại cho vừa một cột 1/3.
 *
 * VÌ SAO KHÔNG DÙNG THẲNG `StepRail`. Nó là đường ray CHIỀU NGANG TRỌN TRANG:
 * cột số 2,25–4rem, `pb-14` giữa hai nấc, tiêu đề `text-subhead`, thêm khối
 * `meta` hai cột. Nhét vào panel rộng ~330px thì cột số ăn hết một phần ba bề
 * ngang và bốn nấc cao hơn cả section. Thêm một prop `dense` cho nó thì gần như
 * mọi dòng trong `render` phải rẽ nhánh — lúc đó là hai component ở chung một
 * hàm. Sợi dọc và thang sáng ở dưới lấy ĐÚNG ý đồ của `RAIL_LIT`, nên hai chỗ
 * vẫn nói cùng một thứ tiếng.
 *
 * KHÔNG CÓ NÚT "XEM CHI TIẾT". Hai section anh em đều có một nút phụ dẫn sang
 * trang đi sâu; ở đây chưa có trang nào để dẫn tới — registry chưa có entry cho
 * mảng đào tạo. Thêm một nút trỏ tạm sang `/ai-assessment` thì nó đứng cách
 * `CtaBand` đúng một màn hình và trùng luôn nhãn, tức là hai CTA giống hệt nhau
 * nằm liền nhau. Có trang đào tạo thì trả nút lại (xem `trainingGap`).
 *
 * NGÂN SÁCH CHIỀU CAO — 1440×900, `--section-y` 8,5rem mỗi đầu nên còn 628px:
 *   tiêu đề (nhãn gộp dòng, không lead)      41px
 *   khe `mt-8`                               32px
 *   panel cao nhất                          ~352px
 *   khe lưới                                 16px
 *   dải chú                                  ~90px
 * Cộng ~531px. Phần dư là chỗ cho tiếng Anh và tiếng Hàn nở ra ở bước dịch —
 * đừng tiêu trước.
 *
 * MỖI PANEL BỎ CÂU DẪN, GIỮ "ĐẦU RA". Bản đầu có cả hai và chúng nói y hệt
 * nhau ("học xong làm được gì"), tốn 36 từ trên trần 120 từ của một section.
 * Giữ "Đầu ra" vì đó là thứ người ký duyệt ngân sách đào tạo đọc.
 * ============================================================================
 */

export interface TrainingTrack {
  /** Ai học. Mono, viết hoa — nhãn, không phải tiêu đề. */
  audience: string;
  /** Tên lộ trình. Đây mới là tiêu đề của panel. */
  name: string;
  /** NHÃN TRẦN, không mô tả. Bốn mục là trần: xem luật mật độ trong `pv-ui`. */
  modules: string[];
  /** aria-label cho dãy module — một dãy `01…04` không tự khai nó là gì. */
  modulesLabel: string;
  outcomeLabel: string;
  outcome: string;
}

/**
 * Thang sáng ba bậc cho dãy module, cùng ý đồ và cùng bộ màu với `RAIL_LIT`
 * trong `blocks.tsx`: nấc đầu mờ, nấc cuối ánh brand. Ba bậc chứ không phải mỗi
 * dòng một màu — nhiều bậc hơn thì mắt đọc ra loang màu chứ không ra tiến trình.
 */
const STEP_LIT = [
  "text-subtle-foreground",
  "text-muted-foreground",
  "text-brand",
] as const;

export function TrainingTracks({
  header,
  tracks,
  note,
  className,
}: {
  /** Tiêu đề section — nhận vào đây để nó nằm chung khối với lưới. */
  header?: ReactNode;
  tracks: TrainingTrack[];
  /** Dải chú ở chân lưới: vế "chi tiết theo doanh nghiệp". */
  note: { label: string; body: string };
  className?: string;
}) {
  return (
    <div className={className}>
      {header}

      <RevealGroup className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tracks.map((track) => (
          <TrackPanel key={track.name} track={track} />
        ))}

        {/* Dải chú — cùng nấc trần với ô `note` của bento chỉ số: không mặt,
            không viền, chỉ chữ. Nó là chú thích cho CẢ BA panel nên phải nằm
            ngoài panel; cho nó một mặt nền là biến nó thành panel thứ tư. */}
        <RevealItem className="flex flex-col justify-center gap-2 p-5 md:col-span-2 lg:col-span-3 lg:p-6">
          <span className="font-mono text-micro font-medium text-subtle-foreground uppercase">
            {note.label}
          </span>
          <p className="max-w-[68ch] text-body-sm text-muted-foreground">
            <Highlight>{note.body}</Highlight>
          </p>
        </RevealItem>
      </RevealGroup>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Một lộ trình                                                                */
/* -------------------------------------------------------------------------- */

function TrackPanel({ track }: { track: TrainingTrack }) {
  const last = Math.max(track.modules.length - 1, 1);

  return (
    <RevealItem className="relative isolate flex flex-col rounded-xl p-6 lg:p-7">
      {/* Mặt panel + vòng viền: lấy nguyên nấc thấp của `BentoTile` để lưới này
          và bento chỉ số ở nửa trên trang đọc ra là một hệ. Ba panel CÙNG một
          cường độ — chúng song song, và panel sáng hơn là nói có nhóm người
          nào quan trọng hơn nhóm khác. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] bg-surface bg-linear-to-t from-brand/5 via-transparent to-transparent"
      />
      <span aria-hidden className="pv-edge bg-linear-to-t from-brand/20 to-border" />

      {/* Nhãn ĐỨNG MỘT MÌNH, không có số thứ tự panel. Bản đầu có, và nó sai
          hai lần trên cùng một dòng: ba lộ trình song song thì đánh số là nói
          có thứ tự phải học theo, mà mỗi panel lại chứa sẵn một dãy `01–04`
          của riêng nó — hai con `01` cách nhau 60px, một cái là "lộ trình thứ
          nhất" và một cái là "phần thứ nhất". Đo trên trình duyệt mới thấy. */}
      <span className="font-mono text-eyebrow font-medium text-subtle-foreground uppercase">
        {track.audience}
      </span>

      <h3 className="mt-4 font-display text-title font-semibold text-balance">
        <Highlight>{track.name}</Highlight>
      </h3>

      {/* ⚠️ KHÔNG `mt-auto` VÀ CŨNG KHÔNG `flex-1` Ở ĐÂY. Cả hai đều đẩy khối
          "Đầu ra" xuống đáy panel, và vì ba câu đầu ra dài ngắn khác nhau (một
          dòng hay hai) thì thứ bám chung đường đáy là ĐÁY câu — nhãn "ĐẦU RA"
          của panel câu ngắn tụt thấp hơn hai panel kia đúng một dòng, 34px ở
          1440. Đo bằng ảnh chụp mới thấy; trên giấy cả hai cách đều "nghe hợp
          lý". Nhãn mono là thứ lặp lại ba lần nên mắt lấy nó làm đường kẻ —
          nó phải thẳng, còn khoảng trống thì rơi xuống đáy panel, nơi không ai
          đo được.
          Ba nhãn thẳng hàng được là nhờ MỌI THỨ nằm trên chúng có cùng chiều
          cao ở cả ba panel: nhãn đối tượng một dòng, tên lộ trình một dòng,
          dãy module cùng số mục. Đặt một tên lộ trình dài tới mức xuống hai
          dòng là gãy hàng — đó là trần thực tế của `t{n}Name`, không phải con
          số tôi bịa ra.

          Sợi dọc bám thẻ `relative` bọc riêng `ol` để nó chỉ dài bằng dãy
          module. Nó KHÔNG được nằm trong `<ol>`: `ol` chỉ nhận `li`, một
          `span` lạc vào đó là HTML sai — trình duyệt tự sửa cây DOM và React
          báo hydration mismatch. */}
      <div className="relative mt-6">
        <span
          aria-hidden
          className="absolute inset-y-1 left-[1.875rem] w-px bg-linear-to-b from-border to-brand/50"
        />
        <ol aria-label={track.modulesLabel} className="flex flex-col gap-3">
          {track.modules.map((module, i) => (
            <li
              key={module}
              className="grid grid-cols-[1.375rem_1fr] items-start gap-x-4"
            >
              <span
                className={cn(
                  "text-right font-mono text-micro font-medium tabular-nums",
                  STEP_LIT[Math.round((i / last) * (STEP_LIT.length - 1))],
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-body-sm">{module}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex flex-col gap-1.5 pt-6">
        <span className="font-mono text-micro font-medium text-subtle-foreground uppercase">
          {track.outcomeLabel}
        </span>
        <p className="text-body-sm text-muted-foreground">
          <Highlight>{track.outcome}</Highlight>
        </p>
      </div>
    </RevealItem>
  );
}
