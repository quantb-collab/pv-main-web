import { cn } from "@/lib/utils";

/**
 * ============================================================================
 * ĐỒ HOẠ TRANG TRÍ
 * ----------------------------------------------------------------------------
 * MỘT ý duy nhất, dùng lại ở hai cấp độ — không phải một bộ sưu tập hoạ tiết.
 *
 *   `HorizonArc`  đường cong chân trời ở đáy MỌI section
 *   `DawnRings`   cùng chân trời đó nhìn từ gần: các gợn sóng DẸT cùng độ cong
 *                 với cung chân trời, lan ra từ nguồn sáng theo cấp số φ, ba
 *                 kinh tuyến mảnh và một chòm node ở giao điểm.
 *                 Chỉ dùng MỘT LẦN trên site, ở hero trang chủ.
 *   `SectionMark` số La Mã + một hình cho BA section mảng kinh doanh. Ba hình
 *                 là ba trạng thái của CÙNG mặt phẳng dẹt ở trên, không phải
 *                 ba hoạ tiết: một mặt · nhiều mặt chồng · một mặt lan lên.
 *
 * Vì sao không mỗi section một hoạ tiết khác: mười hoạ tiết là mười thứ tiếng
 * nói. Một hình được biến tấu theo nấc trời thì trang có nhịp mà vẫn là một hệ
 * — và người đọc nhận ra nó đang xem cùng một bầu trời từ đầu đến cuối.
 *
 * `SectionMark` là ngoại lệ ĐƯỢC KIỂM SOÁT của luật đó (chủ dự án 2026-08-12),
 * và nó chỉ đứng được vì không mang hình mới nào: cùng độ dẹt 1/φ², cùng nét
 * 1px `non-scaling-stroke`, cùng node, cùng thang mờ theo φ. Thứ thay đổi giữa
 * ba section là ĐỘNG TỪ, không phải hình. Thêm cái thứ tư thì phải trả lời
 * được nó là động từ nào của cùng mặt phẳng ấy — không trả lời được thì đừng
 * thêm.
 *
 * Cả hai lấy màu qua `currentColor` từ token, và độ đậm qua `--sky-light` khai
 * ở `.sky-*`. Không component nào truyền tham số, không chỗ nào ghi số màu.
 *
 * `vectorEffect="non-scaling-stroke"` đặt trên TỪNG shape — thuộc tính này
 * không kế thừa từ `<g>`. Cả hai hình đều bị kéo giãn
 * (`preserveAspectRatio="none"` hoặc `slice`), không có nó thì nét 1px dày
 * mỏng khác nhau theo khổ màn hình.
 * ============================================================================
 */

/**
 * Chân trời ở đáy section. Đỉnh cung nằm ở giữa, đúng chỗ `pv-skyglow` sáng
 * nhất — quầng sáng cho vùng, cung cho ĐƯỜNG. Thiếu đường thì ánh sáng không
 * có gì để chạm vào.
 *
 * Hai cung lệch nhau chứ không một: một cung đơn đọc ra là một nét vẽ, hai
 * cung so le đọc ra là chiều sâu.
 */
export function HorizonArc({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 140"
      preserveAspectRatio="none"
      className={cn("pv-arc", className)}
    >
      <g fill="none" stroke="currentColor">
        <path
          d="M0 139 Q600 6 1200 139"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M0 139 Q600 54 1200 139"
          strokeWidth="1"
          opacity="0.5"
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </svg>
  );
}

/* --------------------------------------------------------------------------
   DawnRings — hình học
   --------------------------------------------------------------------------
   Cả hệ chỉ có HAI hằng số: tỉ lệ vàng và độ dẹt suy ra từ nó. Mọi toạ độ
   còn lại (giao điểm, chòm node, vệt nhấn) đều được TÍNH từ hai hằng số đó —
   trang trí có lý do hình học thì nhìn "khớp" mà không cần nói vì sao.
   -------------------------------------------------------------------------- */

const PHI = 1.618;

/* Nguồn sáng: đáy giữa khung — trùng tâm của `pv-skyglow` và của vạch brand
   ở mép dưới hero, nên quầng sáng, gợn sóng và đường ranh cùng một gốc. */
const CX = 720;
const CY = 760;

/* Gợn sóng. `rx` chạy cấp số NHÂN theo φ (150 → 1029): dày sát nguồn, thưa
   dần khi lan xa — đúng hình của sóng; bước đều hay bước cộng đọc ra là bia
   bắn. `ry = rx/φ²` nén gợn dẹt xuống theo đúng ngôn ngữ của cung chân trời —
   vòng tròn xoe cạnh một đường cong dẹt là hai thứ tiếng nói, gợn dẹt mới là
   "cùng chân trời đó nhìn từ gần". Hệ quả đẹp: ry của gợn n = rx của gợn n−2,
   các gợn tự đồng dạng với nhau. Cả trường sóng nằm gọn dưới vạch vàng ngang
   của khung — đúng phần trời mà hero chừa lại khi đặt khối chữ ở vạch trên. */
const RIPPLES = Array.from({ length: 5 }, (_, i) => {
  const rx = 150 * PHI ** i;
  return { rx, ry: rx / (PHI * PHI) };
});

/* Kinh tuyến: ba tia mảnh cắt ngang các gợn cho trường sóng có phương hướng.
   Góc lệch KHÔNG đều (52° / 103° / 131°) để không thành nan quạt đối xứng —
   103° chứ không phải 97°: tia giữa hơi ngả trái để không chạy dọc trục nút
   phụ ở giữa khung. Tia bắt đầu từ gợn thứ hai chứ không từ nguồn — từ nguồn
   thì thành mặt trời toả nắng clip-art, và đè lên ExploreCue đứng ở đáy giữa.
   Cả ba tia CHẾT đúng trên gợn thứ tư, tại chính node của mình — tia nhô quá
   gợn ngoài cùng mờ nhất sẽ kết thúc lửng giữa trời trống. */
const RAYS = [52, 103, 131] as const;

/* Khoảng cách từ nguồn tới giao điểm của tia `deg` với ellipse (rx, ry). */
function hit(deg: number, rx: number, ry: number) {
  const rad = (deg * Math.PI) / 180;
  return 1 / Math.hypot(Math.cos(rad) / rx, Math.sin(rad) / ry);
}

/* Điểm cách nguồn `s` đơn vị theo tia `deg` (0° = chân trời trái, 90° = đỉnh). */
function at(deg: number, s: number): [number, number] {
  const rad = (deg * Math.PI) / 180;
  return [CX - s * Math.cos(rad), CY - s * Math.sin(rad)];
}

/* Node = giao điểm CÓ THẬT của một tia và một gợn: [chỉ số tia, chỉ số gợn].
   Năm cái là đủ thành một chòm; nhiều hơn thì thành nhiễu trên nền đã có lớp
   hạt. Chỉ đứng trên gợn 2 và 3 — hai gợn trong cùng nằm lọt dải quầng sáng
   và tranh chỗ với ExploreCue, gợn ngoài cùng thì mờ tới mức node ở đó đọc
   ra là chấm bụi lơ lửng giữa trời. Mỗi tia kết thúc tại node của nó trên
   gợn 3, nên chòm sao là các TRẠM trên đường đo, không phải rắc tay. */
const NODES: [number, number][] = [
  [0, 3],
  [1, 3],
  [2, 2],
  [1, 2],
  [2, 3],
];

/* Điểm trên gợn `i` theo góc THAM SỐ t (không phải góc cực của tia). */
function ep(ripple: number, t: number) {
  const { rx, ry } = RIPPLES[ripple];
  const rad = (t * Math.PI) / 180;
  return `${(CX - rx * Math.cos(rad)).toFixed(1)} ${(CY - ry * Math.sin(rad)).toFixed(1)}`;
}

/* Vệt bình minh: MỘT đoạn sáng hẳn lên trên gợn thứ tư — điểm đậu duy nhất
   cho mắt; hai vệt trở lên là hết "tia sáng đầu tiên". Vẽ hai lớp chồng
   (dài mờ + lõi ngắn rõ) cho hai đầu tắt dần như ánh sáng, thay vì một nét
   đều bị cắt cụt như đường kẻ. Đoạn t=82°→108° nằm quanh đỉnh vòm, hơi ngả
   phải, và đầu phải dừng ĐÚNG tại node [2,3] (góc tham số ≈108°): trạm mà
   ánh sáng vừa chạm tới. Giữ trong khoảng này thì vệt không bị mép khung cắt
   ở cả 375px lẫn 768px. */
const ACCENT = (() => {
  const { rx, ry } = RIPPLES[3];
  const a = (t1: number, t2: number) =>
    `M ${ep(3, t1)} A ${rx.toFixed(1)} ${ry.toFixed(1)} 0 0 1 ${ep(3, t2)}`;
  return { halo: a(82, 108), core: a(90, 103) };
})();

/**
 * Vector chính của trang chủ. Gợn sóng dẹt toả lên từ đúng điểm mà
 * `pv-skyglow` đặt nguồn sáng, nên quầng sáng có nguồn gốc nhìn thấy được
 * thay vì là một vệt mờ không rõ từ đâu ra.
 *
 * Đọc ra là tín hiệu đang lan trên một mặt nước tối, là phép đo — không phải
 * robot, não phát sáng hay dashboard giả, đúng danh sách cấm trong skill
 * `pv-ui`.
 */
export function DawnRings({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 760"
      preserveAspectRatio="xMidYMax slice"
      /* origin-bottom: nhịp thở phồng lên từ nguồn sáng ở đáy, không phải từ
         tâm khung. */
      className={cn("pv-rings origin-bottom animate-dawn-swell", className)}
    >
      <g fill="none" stroke="currentColor">
        {RIPPLES.map(({ rx, ry }, i) => (
          <ellipse
            key={rx}
            cx={CX}
            cy={CY}
            rx={rx}
            ry={ry}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            /* Gợn chẵn liền nét, gợn lẻ đứt thành vạch chia — nhịp đặc/thưa
               xen kẽ để năm đường không đọc ra là một hình bị photocopy bốn
               lần. Dash theo đơn vị TUYỆT ĐỐI chứ không pathLength: mọi gợn
               cùng một cỡ vạch, chỉ khác số vạch — đúng nghĩa vạch chia độ;
               chuẩn hoá theo chu vi thì gợn to mang vạch to, thành đường kẻ
               đứt chứ không còn là thước. */
            strokeDasharray={i % 2 === 1 ? "2 11" : undefined}
            /* Càng xa nguồn càng mờ, suy giảm nửa bậc φ mỗi gợn
               (1 → 0.786 → 0.618 → 0.486 → 0.382) — cùng tỉ lệ với bán kính,
               để độ mờ và khoảng cách kể cùng một câu chuyện. */
            opacity={1 / PHI ** (i / 2)}
          />
        ))}

        {RAYS.map((deg) => {
          const [x1, y1] = at(deg, hit(deg, RIPPLES[1].rx, RIPPLES[1].ry));
          const [x2, y2] = at(deg, hit(deg, RIPPLES[3].rx, RIPPLES[3].ry));
          return (
            <line
              key={deg}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              opacity={0.38}
            />
          );
        })}

        {/* Nhịp hải đăng: cả vệt loé chậm rồi dịu xuống — chuyển động duy nhất
            đủ rõ để thấy, và nó nằm đúng ở điểm nhấn duy nhất. */}
        <g className="animate-dawn-pulse">
          <path
            d={ACCENT.halo}
            strokeWidth="1.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            opacity={0.5}
          />
          <path
            d={ACCENT.core}
            strokeWidth="1.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            opacity={0.95}
          />
        </g>
      </g>

      {NODES.map(([ray, ripple]) => {
        const [x, y] = at(
          RAYS[ray],
          hit(RAYS[ray], RIPPLES[ripple].rx, RIPPLES[ripple].ry),
        );
        return (
          <circle
            key={`${ray}-${ripple}`}
            cx={x}
            cy={y}
            r="3"
            fill="currentColor"
            className="pv-node animate-dawn-twinkle"
            /* Gợn 2 là gợn trong cùng có node → mốc 0.9, xa dần mờ theo nửa
               bậc φ như chính các gợn. Twinkle đổi scale chứ không đổi opacity
               để không giẫm lên thang mờ này. */
            opacity={0.9 / PHI ** ((ripple - 2) / 2)}
          />
        );
      })}
    </svg>
  );
}

/* --------------------------------------------------------------------------
   SectionMark — số La Mã + hình cho ba section mảng kinh doanh
   --------------------------------------------------------------------------
   MỘT hằng số hình học, lấy lại từ DawnRings: độ dẹt 1/φ². Cả ba hình đều là
   một hình thoi dẹt đúng độ đó — tức cùng một mặt phẳng nhìn từ cùng một góc
   với cung chân trời. Ba section khác nhau ở việc mặt phẳng ấy LÀM GÌ:

     I   phần cứng   một mặt, ba lớp lồng vào nhau     → cái đế, thứ có thật
     II  phần mềm    ba mặt chồng nhau, có cột nối     → tầng trên cùng một lõi
     III đào tạo     một mặt, ba nấc dâng lên khỏi nó  → trao lên trên

   Số La Mã vẽ bằng `<text>` TRONG SVG chứ không phải một thẻ chữ nằm ngoài:
   cỡ của nó là đơn vị viewBox, không phải một cỡ chữ CSS. Đặt ngoài thì hoặc
   phải viết thẳng một cỡ chữ tuỳ ý cỡ 13rem (luật token cấm), hoặc phải bịa
   thêm một vai trò vào thang chữ cho một thứ không ai đọc. Nó cũng chỉ có NÉT,
   không ruột: một khối chữ đặc cỡ đó nằm sau nội dung là một mảng màu, còn nét
   thì vẫn là line-art như phần còn lại của hệ.

   `aria-hidden`, không `<title>`: số thứ tự của section là thông tin của MẮT.
   Trình đọc màn hình đã có `<h2>` để biết đang ở đâu; thêm "một, hai, ba" vào
   cây nội dung chỉ là ba tiếng lạ chen giữa các tiêu đề.
   -------------------------------------------------------------------------- */

/** Độ dẹt của mọi mặt phẳng trên site — xem RIPPLES ở trên. */
const FLAT = 1 / (PHI * PHI);

/* Khung NẰM NGANG và THẤP: hình bên trái, số bên phải. Lý do nằm ở `.pv-mark`
   trong globals.css — dấu chỉ có dải padding DƯỚI của section để đứng (đo được
   136px ở 1440), nên chiều cao là thứ khan hiếm còn chiều ngang thì thoải mái. */
const MARK_CX = 74;
const MARK_CY = 68;
/** Nửa bề ngang mặt ngoài cùng. Nửa chiều cao suy ra từ FLAT. */
const MARK_RX = 54;
/** Bước chồng tầng của glyph `layers`. */
const MARK_STEP = 22;

/** Hình thoi dẹt tâm (cx, cy), nửa ngang `rx`, dẹt theo FLAT. */
function plane(cx: number, cy: number, rx: number) {
  const ry = rx * FLAT;
  return `M ${cx - rx} ${cy} L ${cx} ${cy - ry} L ${cx + rx} ${cy} L ${cx} ${cy + ry} Z`;
}

export type MarkGlyph = "base" | "layers" | "raise";

/** Ba nấc của glyph `raise`, toạ độ dùng chung cho cung nối và ba node. */
const RAISE = [
  [MARK_CX - 32, MARK_CY + 24],
  [MARK_CX + 1, MARK_CY],
  [MARK_CX + 34, MARK_CY - 24],
] as const;

/**
 * Dấu của một section: một hình và một số La Mã, nằm sau nội dung ở mép phải.
 *
 * Độ đậm do `.pv-mark` quản và nó đọc `--sky-light`, nên dấu cũng sáng dần theo
 * mạch trời như cung chân trời. Trần cố ý thấp hơn `pv-arc`: cung nằm ở đáy,
 * chỗ không có chữ, còn dấu này nằm SAU chữ.
 */
export function SectionMark({
  numeral,
  glyph,
  className,
}: {
  /** "I" · "II" · "III". Chuỗi chứ không phải số: nó là hình, không phải giá trị. */
  numeral: string;
  glyph: MarkGlyph;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 320 140"
      preserveAspectRatio="xMidYMid meet"
      className={cn("pv-mark", className)}
    >
      <g fill="none" stroke="currentColor">
        {/* Ba mặt lồng nhau theo thang φ — một khối đặc nhìn xuyên qua. */}
        {glyph === "base"
          ? [1, 1 / PHI, 1 / (PHI * PHI)].map((k, i) => (
              <path
                key={k}
                d={plane(MARK_CX, MARK_CY, MARK_RX * k)}
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                opacity={1 / PHI ** (i / 2)}
              />
            ))
          : null}

        {/* Ba mặt CÙNG CỠ chồng lên nhau: cùng một lõi, khác bề mặt. Nhỏ dần
            thì đọc ra là xa dần, tức lại là phối cảnh chứ không phải tầng.
            Hai cột nối ở đỉnh ngang cho chồng mặt có bề dày. */}
        {glyph === "layers"
          ? [0, 1, 2].map((i) => {
              const cy = MARK_CY - MARK_STEP + i * MARK_STEP;
              return (
                <g key={i} opacity={1 / PHI ** (i / 2)}>
                  <path
                    d={plane(MARK_CX, cy, MARK_RX)}
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                  {i < 2
                    ? [MARK_CX - MARK_RX, MARK_CX + MARK_RX].map((x) => (
                        <line
                          key={x}
                          x1={x}
                          y1={cy}
                          x2={x}
                          y2={cy + MARK_STEP}
                          strokeWidth="1"
                          vectorEffect="non-scaling-stroke"
                          opacity={0.55}
                        />
                      ))
                    : null}
                </g>
              );
            })
          : null}

        {glyph === "raise" ? (
          <>
            {/* Mặt nền — chỗ chương trình đứng. */}
            <path
              d={plane(MARK_CX, MARK_CY + 24, MARK_RX)}
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            {/* Đường nối ba nấc là một CUNG, không phải đường gấp khúc: cùng
                họ với cung chân trời, và "trao lên" là một chuyển động liền. */}
            <path
              d={`M ${RAISE[0][0]} ${RAISE[0][1]} Q ${RAISE[1][0]} ${RAISE[1][1] - 17} ${RAISE[2][0]} ${RAISE[2][1]}`}
              strokeWidth="1"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              opacity={0.62}
            />
          </>
        ) : null}

        {/* Số La Mã — chỉ nét, `font-display` để nó là chữ của thương hiệu.
            Neo mép PHẢI chứ không neo tâm: "I", "II", "III" rộng khác nhau, neo
            tâm thì ba con dấu lệch nhau khi cuộn qua ba section liền nhau. */}
        <text
          x="312"
          y="118"
          textAnchor="end"
          fontSize="132"
          fontWeight="600"
          className="font-display"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          opacity={0.8}
        >
          {numeral}
        </text>
      </g>

      {/* Ba nấc học viên. Node đặc, cùng ngôn ngữ với chòm node của hero; sáng
          dần theo chiều dâng, đúng chiều thang STEP_LIT của section đào tạo. */}
      {glyph === "raise"
        ? RAISE.map(([x, y], i) => (
            <circle
              key={x}
              cx={x}
              cy={y}
              r="3"
              fill="currentColor"
              opacity={0.45 * PHI ** (i / 2)}
            />
          ))
        : null}

      {/* Bốn đỉnh của mặt ngoài cùng — điểm tiếp xúc, thứ làm nó đọc ra là một
          linh kiện có chân chứ không phải một hình thoi. */}
      {glyph === "base"
        ? [
            [MARK_CX - MARK_RX, MARK_CY],
            [MARK_CX, MARK_CY - MARK_RX * FLAT],
            [MARK_CX + MARK_RX, MARK_CY],
            [MARK_CX, MARK_CY + MARK_RX * FLAT],
          ].map(([x, y]) => (
            <circle
              key={`${x}-${y}`}
              cx={x}
              cy={y}
              r="3"
              fill="currentColor"
              opacity={0.7}
            />
          ))
        : null}
    </svg>
  );
}
