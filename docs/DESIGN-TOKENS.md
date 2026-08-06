# Hệ token

Nguồn: `src/app/globals.css` (CSS) và `src/lib/motion.ts` (JS).
**Hai file phải khớp nhau.** Đổi easing hay thời lượng thì sửa cả hai.

## Chủ đề: đêm trước bình minh

Cả site là **một bầu trời dọc**. Đỉnh trang là giờ tối nhất; càng cuộn xuống
chân trời càng sáng. Thứ ló rạng **không phải nắng vàng** — là **xanh da trời**,
đúng màu của bầu trời lúc rạng, không phải màu của đèn.

Chất liệu là **titan sần**: nền không phải mặt phẳng nhẵn mà là kim loại nhám.

Ba hệ quả, áp cho mọi trang:

1. **Không có chế độ sáng.** Bảng màu ở LỚP 2 là bảng duy nhất. Không còn cặp
   `tone="default"` / `tone="surface"` / `tone="dark"`, không còn class
   `.tone-dark`.
2. **Mọi ánh sáng dẫn xuất từ `--brand`.** Màu ấm duy nhất còn lại là
   `--warning` của ô chờ, và nó chỉ hiện lúc dev/review.
3. **Nấc trời chỉ đi lên trong một trang.** Mạch của trang là một lần trời
   sáng, không phải sáng rồi tối lại.

## Năm lớp trong globals.css

| Lớp | Nội dung | Khi nào sửa |
|---|---|---|
| 1 | Brand ramp `--pv-brand-*`, `--pv-ink-*`, thang trời `--pv-night-*`, `--pv-signal-*` | Khi chốt brand kit. Sửa **chỉ ở đây**. |
| 2 | Semantic token + thang sky `.sky-*`: `--background`, `--foreground`, `--surface`, `--brand`, `--sky-light`… | Khi đổi cách dùng màu, không phải khi đổi màu |
| 3 | Motion, layout & chữ: `--ease-*`, `--dur-*`, `--section-y`, `--container-max`, `--pv-text-*` | Khi đổi nhịp hoặc thang chữ toàn site |
| 4 | Đăng ký với Tailwind (`@theme inline`) | Khi thêm token mới cần utility |
| 5 | Utility dùng chung: `pv-container`, `pv-section`, `pv-horizon`, `pv-skyglow`… | Khi thêm mẫu bố cục dùng lại nhiều nơi |

> ⚠️ **Hướng** màu ở LỚP 1 (xanh da trời trên titan sần) đã chốt. **Giá trị** cụ thể
> vẫn là placeholder, chưa phải brand kit chính thức. Khi có brand kit, thay
> toàn bộ khối đó — component không cần đụng.

## Thang sky — nấc trời của một section

Mỗi `<Section>` khai đúng một nấc qua prop `sky`. Nấc quyết định cả nền lẫn
chữ, và cả cường độ ánh sáng ở chân trời.

| `sky` | Khoảnh khắc | Dùng ở |
|---|---|---|
| `void` | giờ tối nhất, chưa có gì | hero, section mở trang |
| `night` | nền đêm mặc định | thân bài |
| `deep` | trời đã nhạt hơn một nấc | thân bài, đoạn giữa trang |
| `rise` | chân trời bắt đầu ăn sáng | section ngay trước CTA |
| `dawn` | ánh sáng đã lên | dải CTA đóng trang (`CtaBand` tự đặt) |

Mẫu của một trang: `void` → `night` → `deep` → `rise` → `dawn` → footer
(`sky-deep`, lùi một nấc để dải CTA vẫn là điểm sáng cuối mắt dừng lại).

**Nấc không phải là thứ tách hai section liền nhau.** Hai nền đêm cách nhau 3%
độ sáng thì mắt đọc ra là lỗi render. Ranh giới là ánh sáng, do `<Section>` tự
vẽ, không trang nào phải lo:

- `pv-horizon` — vạch 1px ở mép **trên**, sáng nhất ở giữa, tắt dần ra hai mép.
- `pv-skyglow` — quầng xanh da trời dâng từ mép **dưới**.

Ở boundary, quầng của section trên và vạch của section dưới chồng lên nhau
thành một dải sáng. Nhịp *mép trên tối → mép dưới có quầng → vạch* đọc ra ranh
giới **kể cả khi hai section cùng một nấc trời** — nên hai section cùng nấc
đứng liền nhau là hợp lệ.

Cả hai utility đọc `--sky-light` (0 → 1), và `.sky-*` là nơi duy nhất đặt biến
đó. Muốn một section sáng hơn thì đổi nấc, **không** chỉnh opacity tại chỗ.

Ranh giới còn **sống** theo cuộn: khi nó đi vào khung nhìn, quầng của section
trên dâng sáng dần và vạch của section dưới tự vẽ ra từ tâm — hai section trao
ánh sáng cho nhau. Phần chuyển động nằm ở `BoundaryHorizon` / `BoundaryGlow`
(`src/components/motion/sky-boundary.tsx`, `<Section>` tự gắn); chúng chỉ nhân
hệ số `--pv-boundary` (mặc định 1) lên opacity CSS đã cân, nên chỗ dùng span
tĩnh (footer, hero) và người bật giảm chuyển động vẫn thấy đúng bản tĩnh.

## Trang trí — `pv-arc` và `pv-rings`

Hình nằm ở `src/components/pv/decor.tsx`, khung và độ đậm ở LỚP 5.

| Utility | Hình | Ở đâu |
|---|---|---|
| `pv-arc` | cung chân trời ở đáy section | `<Section>` tự gắn, mọi trang |
| `pv-rings` | vòng đồng tâm toả từ nguồn sáng | hero trang chủ, **một lần/site** |

`pv-arc` đọc `--sky-light` nên trang trí cũng sáng dần theo mạch trời. `pv-rings`
thì không — hero ở nấc `void` (`--sky-light: 0`) nên đọc biến đó là nó tắt hẳn,
mà đây lại là vector chính của trang.

Cung nhạt hơn hẳn quầng sáng: cung là **đường viền** của ánh sáng. Thấy nó rõ
hơn chính ánh sáng thì nó thành hình vẽ chứ không thành chân trời.

## Viền gradient — `pv-edge`

Một nét 1px chạy trọn chu vi một hộp bo góc, màu lấy từ gradient brand.

```jsx
<div className="relative rounded-xl">
  <span aria-hidden className="pv-edge bg-linear-to-t from-brand to-border" />
  …
</div>
```

**Không dùng cách `p-px` + con mang nền đặc.** Con có góc vuông, nên trong vùng
bo tròn nó trùm ra ngoài đường cong trong và đè mất chính vòng viền — mắt đọc
ra bốn vết khuyết đối xứng ở bốn góc. Nếu hộp đó còn là `grid-rows-subgrid`
thì 1px padding kia bị trừ vào track đầu và cuối, kéo hàng lệch so với panel
không có padding.

`pv-edge` là phần tử phủ `position: absolute` — không chiếm ô nào trong lưới,
và không cần `overflow-hidden` nên quầng sáng đặt sau lưng hộp vẫn toả ra
được. Ruột được khoét bằng mask; cả `content-box` lẫn `border-box` đều bo theo
bán kính của chính phần tử nên dải còn lại dày đều tuyệt đối.

## Chiều cao section

Mặc định mỗi section cao trọn một viewport, nội dung căn giữa —
`min-h-dvh` chứ không phải `h-dvh`, nội dung dài hơn thì section cao lên chứ
không cắt. Tắt bằng `full={false}`, và chỉ tắt cho trang công cụ nội bộ như
`/track`.

Đánh đổi đã chấp nhận: trang dài hơn. Vì vậy luật mật độ trong skill `pv-ui`
càng phải giữ — **một section, một ý**.

**Cuộn có snap** — hai tầng, cơ chế ở `smooth-scroll.tsx`, token ở `SNAP`
(`src/lib/motion.ts`):

1. **Trượt ngay khi cuộn qua nửa section kế bên.** Xuống: mép trên của section
   dưới vượt quá giữa màn hình là trượt cho nó khớp khung, khoá cuộn trong lúc
   trượt. Lên: đối xứng — section cao hơn một màn hình thì khớp *màn cuối* của
   nó, không nhảy vọt lên đầu.
2. **Lưới an toàn khi ngừng cuộn**: còn đứng cách một điểm dừng dưới nửa màn
   hình thì gom về đó. Đứng giữa một section cao (mobile) thì không điểm dừng
   nào trong ngưỡng → để yên cho người ta đọc.

Điểm dừng là mọi phần tử mang `data-snap`: `<Section full>` và hero tự gắn
(mép trên), footer gắn `data-snap="end"` để cuối trang là một điểm dừng hợp lệ.
Tắt cùng Lenis khi người dùng bật giảm chuyển động; trên cảm ứng giữ nguyên
cuộn native.

## Thang bề mặt và chữ

Ba nấc nền: `bg-background` → `bg-surface` → `bg-surface-2`
Ba nấc chữ: `text-foreground` → `text-muted-foreground` → `text-subtle-foreground`

Dùng đúng nấc, đừng pha `opacity` để làm chữ nhạt hơn.

Bất biến của thang nền: **một bề mặt nổi lên = một nấc trời sáng hơn**. Vì vậy
`bg-surface` trong section `sky-deep` và trong section `sky-rise` ra hai màu
khác nhau — đúng như mong muốn, component không phải biết mình đang ở đâu.

Thang chữ cũng dịch theo nấc trời: ở `sky-dawn` nền đã đủ sáng để kéo tụt chữ
phụ, nên `--muted-foreground` và `--subtle-foreground` tự nhích lên một nấc để
giữ 4.5:1. Đây là lý do **không** được viết `text-white/60` thay cho nấc chữ.

## Thang chữ

Chọn theo **vai trò của chữ**, không theo cỡ. Không dùng `text-sm`, `text-lg`,
`text-[11px]` cho nội dung nữa — thang Tailwind mặc định chỉ còn dành cho
`src/components/ui/`.

| Vai trò | Cỡ (375 → 1440) | Weight | Dùng ở |
|---|---|---|---|
| `text-display` | 40 → 72 | 600 | h1 **dưới ~60 ký tự** |
| `text-headline` | 32 → 52 | 600 | h2 mở section, **và h1 dài trên ~60 ký tự** |
| `text-subhead` | 24 → 34 | 600 | h3, tiêu đề khối trong section |
| `text-title` | 19 → 21 | 600 | tiêu đề thẻ, bước, tầng |
| `text-lead` | 18 → 21 | 400 | câu dẫn dưới tiêu đề |
| `text-body` | 16 → 17.5 | 400 | thân bài |
| `text-body-sm` | 15 | 400 | thân bài trong cột hẹp: thẻ lưới 3–4 cột, footer |
| `text-ui` | 14 | 500 | nav, chip, nhãn control |
| `text-meta` | 13 | 400 | chú thích, dòng pháp lý, ô bảng |
| `text-micro` | 11 | 500 | số thứ tự mono, chip ô chờ |
| `text-eyebrow` | 12 | 500 | eyebrow mono viết hoa |

Mỗi utility mang sẵn **cỡ + line-height + tracking**. Viết `text-body` là đủ,
không kèm `leading-relaxed` hay `tracking-tight` nữa. Cần khác thì `leading-*`
và `tracking-*` vẫn đè lên được.

**Ngoại lệ về độ dài, không phải về cấp.** Vai trò `display` được cân cho tiêu
đề dưới khoảng 50–60 ký tự. Dài hơn thế thì ở 72px nó thành bốn dòng và nuốt
gần hết một màn hình, nên h1 đó dùng `text-headline`. Nó vẫn là `<h1>` —
đổi cỡ chứ không đổi cấp tiêu đề. Đang áp dụng ở hero trang chủ.

Ba điều đã cân trong token:

- **Co giãn mượt** bằng `clamp()` giữa 375px và 1440px, không nhảy bậc ở
  breakpoint. Phần ưu tiên của clamp luôn có `rem` nên phóng to chữ của trình
  duyệt vẫn ăn — dùng `vw` trần là vi phạm WCAG 1.4.4.
- **line-height rộng** hơn mức quen thuộc vì tiếng Việt chồng hai tầng dấu
  (ữ, ế, ộ): dòng sát nhau thì dấu chạm nhau trước khi chữ chạm nhau.
- **tracking đi ngược cỡ chữ**: cỡ lớn siết âm, cỡ nhỏ nới dương. Vì vậy
  `globals.css` không còn đặt `tracking-tight` chung cho h1–h3.

Ba nấc weight, không hơn: **600** tiêu đề và wordmark · **500** eyebrow, nav,
nhãn · **400** thân bài. Font brand không phải variable font, mỗi nấc là một
file tải riêng.

Độ dài dòng: câu dẫn `max-w-[58ch]`, thân bài `max-w-[68ch]`. Đừng để `max-w-3xl`
tự quyết — ở cỡ chữ mới nó thành 85–90 ký tự một dòng, mắt mất đầu dòng kế tiếp.

## Vì sao component chỉ được dùng token

Class `.sky-*` remap toàn bộ semantic token trên chính `<section>`, rồi mọi
component con **tự** đổi màu vì chúng gọi `bg-surface`, `text-muted-foreground`
chứ không gọi màu. Đó là toàn bộ cơ chế: một prop trên section đổi được cả
section mà không component nào phải biết chuyện gì đang xảy ra.

Viết `bg-slate-900 text-white` cho một section là cắt đứt chính cơ chế đó —
khối đó sẽ đứng yên một màu trong khi cả trang sáng dần quanh nó.

## Control — nút, input, select

Control có bo góc và đổ bóng **riêng**, không dùng chung với thẻ và ảnh.

| Token | Giá trị | Dùng ở |
|---|---|---|
| `--radius-control` | 6px → `rounded-control` | button, input, select trigger, chip |
| `--shadow-control` | gần như không thấy | variant có bề mặt, trạng thái nghỉ |
| `--shadow-control-hover` | nhấc nhẹ | cùng variant, trạng thái hover |

`--radius` (10px) vẫn dành cho thẻ, ảnh, `BeforeAfter`. Chỉnh nút không được
kéo theo thẻ.

Đổ bóng là **ngoại lệ có ranh giới**: hệ này dùng viền tóc cho khối lớn, bóng
chỉ để nút đọc ra là bấm được. `ghost` và `link` không có bóng.

Trên nền đêm bóng đen vô hình, nên `--shadow-control` không phải là bóng đổ mà
là **vạch sáng inset ở cạnh trên** cộng một lớp tối sâu bên dưới — nút đọc ra
là một bề mặt đang hứng ánh sáng từ trên xuống. Component không phải đụng.

Thang cao: `sm` 36px · `default` 40px · `lg` 44px. `lg` cho hero và dải CTA,
`sm` cho header, `default` cho mọi chỗ còn lại.

## Highlight — làm nổi từ khoá trong câu

Từ khoá được tô bằng gradient brand kèm hai lớp quầng sáng, đọc như chữ phát
sáng. Hiện chỉ áp cho **"AI"**, viết hoa và đứng thành từ riêng.

| Token | Vai trò |
|---|---|
| `--highlight-from/via/to` | ba chặng gradient, dẫn xuất từ `--pv-brand-*` |
| `--highlight-glow` | màu lớp quầng rộng |
| `--highlight-halo-opacity` · `--highlight-halo-blur` | quầng rộng — ánh toả ra nền |
| `--highlight-rim-opacity` · `--highlight-rim-blur` | quầng sát viền — giữ nét chữ |

Lõi ngả gần trắng (`brand-100`) và quầng mạnh: chữ phải đọc ra là **nguồn**
phát sáng, không phải chữ được tô xanh. Đây cũng là cùng một thứ ánh sáng với
chân trời ở `pv-skyglow` — cả hai đọc `--pv-brand-*`, nên đổi brand kit ở LỚP 1
là cả từ khoá lẫn bình minh đổi theo, không đụng component.

Dùng qua `<Highlight>` (`src/components/pv/highlight.tsx`), đã gắn sẵn vào
`SectionHeader` (title + lead), `Card` (title + body), `StatementList` và hero.
Trang mới ghép từ những block đó thì không phải làm gì thêm.

Không áp cho eyebrow mono, chip `PillRow`, nhãn nút và chữ nhỏ — chữ phát sáng
ở cỡ 11px là nhiễu, không phải điểm nhấn.

**Thêm từ khoá thì đếm trước.** Một từ xuất hiện 15 chỗ trong `messages` thì 15
chỗ cùng phát sáng. Chỉ thêm từ HIẾM và mang định vị: `tự vận hành` được chọn
vì nó xuất hiện đúng một lần trên toàn site — chính là tiêu đề hero. Đã loại
`vận hành` (15 chỗ) và `Pebble Vina` (19 chỗ).

**Và giữ từ khoá ngắn.** `<Led>` là `inline-block` nên cụm bên trong không
xuống dòng được; cụm dài nằm trong tiêu đề ở khổ mobile sẽ tràn ngang. Ba từ
là trần.

Nhận diện từ khoá phân biệt hoa thường và có biên từ: bắt "AI", không bắt đại
từ "ai", cũng không bắt đuôi của HAI / MAI / OpenAI.

## Nhãn nút

Trần **20 ký tự**. Nút hẹp nhất là nút trong header — nhãn phải vừa chỗ đó.

Nút dẫn sang trang khác luôn dùng `<CtaButton>`; mũi tên của nó đã là động từ
"đi tới", nên nhãn **bỏ** "Xem", "Tìm hiểu thêm", "Khám phá".

> ❌ "Xem cách chúng tôi triển khai" → ✅ "Cách triển khai"
> ❌ "Đánh giá cơ hội ứng dụng AI" → ✅ "Đặt buổi đánh giá"

Nút phụ đặt `arrow={false}` — hai mũi tên cạnh nhau thành hai lời mời ngang
hàng, trái §23.

## Chuyển động

| Token | Dùng cho |
|---|---|
| `EASE.out` | mặc định, phần tử xuất hiện |
| `EASE.outSoft` | khối lớn, ảnh, cảnh |
| `EASE.inOut` | phần tử chuyển qua lại giữa hai trạng thái |
| `EASE.spring` | chỉ micro-interaction, không dùng cho section |
| `DUR.fast` 0.2s | hover, đổi màu |
| `DUR.base` 0.34s | UI chuyển trạng thái |
| `DUR.slow` 0.62s | phần tử xuất hiện khi cuộn |
| `DUR.scene` 1.0s | mở ảnh, cảnh hero |
| `STAGGER` 0.07s | độ trễ giữa các con trong một nhóm |

Biên độ parallax: `subtle` 6% cho nền, `base` 12% cho ảnh, `strong` 22% chỉ cho
một khối duy nhất mỗi trang.

## Bắt buộc về khả năng tiếp cận

- Mọi primitive đã tôn trọng `prefers-reduced-motion`. Viết hiệu ứng mới thì
  phải kiểm tra `useReducedMotion()` trước.
- Lenis tự tắt khi người dùng bật giảm chuyển động.
- Không dùng animation làm phương tiện truyền đạt duy nhất một thông tin.

## Ảnh

Mọi ảnh đi qua `<MediaFrame>`. Chưa có ảnh thật thì để trống `src` và ghi rõ
`need="…"` — khung sẽ hiện ô chờ mô tả cần chụp gì. Không cắm ảnh stock tạm.

Cấm theo §22 blueprint: robot hình người, bộ não phát sáng, bàn tay chạm màn
hình, cyberpunk, neon mạnh, dashboard giả, ảnh bắt tay, chip rải mọi section.
