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
| 3 | Motion, layout & chữ: `--ease-*`, `--dur-*`, `--pv-space-*`, `--gutter`, `--container-max`, `--pv-text-*` | Khi đổi nhịp hoặc thang chữ toàn site |
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

### ⚠️ Ranh giới giữa hai section: HIỆN KHÔNG CÓ GÌ VẼ

Chủ dự án xoá toàn bộ lớp dựng cảnh 2026-08-14 để đổi kế hoạch nền. `<Section>`
nay chỉ còn nền màu của nấc + lớp hạt.

Trước đó, **nấc không phải là thứ tách hai section liền nhau** — ranh giới là
ánh sáng: `pv-horizon` (vạch 1px mép trên) + `pv-skyglow` (quầng dâng từ mép
dưới) + `pv-arc` (cung chân trời), cộng hai bản chuyển động `BoundaryHorizon` /
`BoundaryGlow`. Nhịp *mép trên tối → mép dưới có quầng → vạch* đọc ra ranh giới
kể cả khi hai section cùng nấc.

Vấn đề mà bộ đó giải nay quay lại nguyên vẹn, và đây là thứ kế hoạch nền mới
phải trả lời: **hai nền đêm cách nhau ~3% độ sáng thì mắt đọc ra là lỗi render,
không phải ranh giới.** Nặng nhất ở hai section CÙNG nấc đứng liền nhau — trang
chủ đang có hai cặp như vậy (`night`+`night`, `rise`+`rise`).

`--sky-light` (0 → 1, đặt ở `.sky-*`) vẫn còn nhưng **hiện không ai đọc**. Giữ
vì nó là thang cường độ của nấc trời: nền mới cần biết nấc này sáng cỡ nào thì
đọc ở đó, đừng tự đặt số. Muốn một section sáng hơn thì đổi nấc, **không** chỉnh
opacity tại chỗ.

## Trang trí — KHÔNG CÒN

Site hiện **không có đồ hoạ trang trí nào**. Xoá hết 2026-08-14 cùng lần với
ranh giới section: `decor.tsx` (`HorizonArc`, `DawnRings`), `sky-boundary.tsx`,
và các utility `pv-arc` · `pv-horizon` · `pv-skyglow` · `pv-skyglow-hero` ·
`pv-rings` · `pv-grid-bg`. Bản cũ nằm trong git nếu cần đọc lại lý do hình học.

Luật cũ vẫn còn giá trị khi dựng bộ mới: **một ý hình học duy nhất, biến tấu
theo nấc trời** — mười hoạ tiết là mười thứ tiếng nói. Đừng thêm hình thứ hai
chỉ để một section trông khác đi; đó là việc của nấc `sky`.

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

Hai nấc, khai qua prop `height`. **Mặc định là `auto`** (đổi 2026-08-17).

| `height` | Làm gì | Dùng ở |
|---|---|---|
| `auto` | cao theo nội dung; nhịp do `pv-section` tạo | **mặc định**, gần như mọi section |
| `screen` | `min-h-dvh`, nội dung căn giữa | khối CẦN trọn màn để đọc đúng — hero, một cảnh dựng bằng ảnh |

`screen` vẫn là `min-h-dvh` chứ không `h-dvh`: nội dung dài hơn thì cao lên,
không cắt.

**Không chọn `screen` để section "trông rộng rãi".** Chỗ trống là việc của
`--pv-space-section`; ép trọn màn chỉ dồn khoảng trống ra hai đầu chứ không tạo
nhịp — và dồn đúng một lượng như nhau ở mọi section thì không section nào đọc
ra là quan trọng hơn section nào.

> ⚠️ Vì sao đổi mặc định: `screen` từng là mặc định cho **mọi** section, và đo
> ở 1440×900 thì trang chủ có **2 488px — 32% chiều dài trang** là dải trống
> trên/dưới nội dung, lấp đầy chỉ 36–73% mỗi section (`CtaBand` 36%,
> `Identity` 51%). Ở khổ hẹp thì ngược lại: `phan-cung` cao 1 866px, `min-h-dvh`
> không còn nghĩa gì. Prop cũ `full` đã gỡ.

**Cuộn có snap — ĐANG TẮT TẠM** (`SNAP.enabled = false` trong
`src/lib/motion.ts`). Cuộn mượt Lenis vẫn chạy, chỉ bỏ cú trượt tự khớp màn
hình. Code và các mốc `data-snap` giữ nguyên; bật lại chỉ cần đổi cờ. Mô tả
dưới đây là hành vi khi bật — hai tầng, cơ chế ở `smooth-scroll.tsx`:

1. **Trượt ngay khi cuộn qua nửa section kế bên.** Xuống: mép trên của section
   dưới vượt quá giữa màn hình là trượt cho nó khớp khung, khoá cuộn trong lúc
   trượt. Lên: đối xứng — section cao hơn một màn hình thì khớp *màn cuối* của
   nó, không nhảy vọt lên đầu.
2. **Lưới an toàn khi ngừng cuộn**: còn đứng cách một điểm dừng dưới nửa màn
   hình thì gom về đó. Đứng giữa một section cao (mobile) thì không điểm dừng
   nào trong ngưỡng → để yên cho người ta đọc.

Điểm dừng là mọi phần tử mang `data-snap`: mọi `<Section>` và hero tự gắn
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

## Thang màn hình

Bốn mốc, khai thẳng trong `@theme` để đọc được hệ có mấy mốc và mốc nào làm
việc gì. Giá trị giữ đúng mặc định Tailwind.

| Mốc | Từ | Mốc này được phép đổi cái gì |
|---|---|---|
| — | 0 | một cột, mọi thứ xếp dọc |
| `sm` | 640 | **chỉ** căn lề và hướng của một khối chữ hoặc hàng nút. Không đổi số cột. |
| `md` | 768 | một cột → hai cột |
| `lg` | 1024 | bố cục đủ: cột phụ, sidebar, kệ ngang xuất hiện |
| `xl` | 1280 | **chỉ** chạm trần `--container-max`. Cấm đổi bố cục ở đây. |

`2xl` đã **gỡ khỏi từ vựng** (`--breakpoint-2xl: initial`). Nó có 0 chỗ dùng, và
một mốc không ai thiết kế cho nó chỉ là chỗ để code trôi vào. `check:tokens`
chặn nếu ai viết lại.

**Breakpoint chỉ được đổi SỐ CỘT và HƯỚNG XẾP.** Cỡ chữ, khoảng cách và lề đều
đã clamp mượt nên không còn bậc nào để khai — viết `lg:text-headline` hay
`lg:mt-16` là đang chữa một thứ đã tự chữa. `check:tokens` bắt cả hai.

> ⚠️ Bài học phải trả giá: trước 2026-08-17 hệ chỉ có **một** mốc thật sự làm
> việc (`lg`, 163 chỗ dùng, so với `md` 26 chỗ), còn `--gutter` bước ở 768 và
> `--section-y` bước ở 1280. Ba thang bước ở ba chỗ khác nhau, và dải 768–1023
> thì không ai thiết kế — kết quả là trang chủ cuộn ngang được ở **mọi** bề
> ngang dưới 1024px mà không ai biết. Nay có `pnpm check:layout` canh.

## Thang nhịp — khoảng cách theo vai trò

Cùng mô hình với thang chữ: chọn theo **việc khoảng cách đang làm**, không theo
nó rộng bao nhiêu. Cả sáu clamp mượt 375 → 1280, không nhảy bậc.

| Vai trò | Utility | 375 → 1280 | Dùng ở |
|---|---|---|---|
| `--pv-space-section` | `py-section` | 80 → 136 | nhịp dọc section (`pv-section` đọc) |
| `--pv-space-stack` | `mt-stack` | 40 → 56 | tiêu đề section → thân section |
| `--pv-space-column` | `gap-column` | 32 → 80 | giữa hai **cột lớn** của một bố cục |
| `--pv-space-group` | `gap-group` | 24 → 32 | giữa hai nhóm trong cùng một khối |
| `--pv-space-item` | `gap-item` | 12 → 16 | giữa các item cùng loại |
| `--pv-space-tight` | `gap-tight` | 8 | nhãn ↔ giá trị. Không co giãn. |

Thang số của Tailwind (`mt-14`, `gap-3`) **vẫn chạy** nhưng chỉ còn hợp lệ trong
`src/components/ui/`. Ngoài đó nó nằm dưới **bánh cóc** trong
`scripts/check-tokens.mjs`: số chỗ vi phạm chỉ được đi xuống. Đụng vào file nào
thì chuyển chỗ đó sang tên vai trò rồi hạ `max`.

## Thang bề ngang

| Vai trò | Utility | Giá trị | Dùng ở |
|---|---|---|---|
| `--container-lead` | `max-w-lead` | 58ch | câu dẫn dưới tiêu đề |
| `--container-body` | `max-w-body` | 68ch | thân bài |
| `--container-header` | `max-w-header` | 48rem | khoang tiêu đề section |
| `--container-rail` | `max-w-rail` | 15rem | cột phụ, hồ sơ, dãy điều hướng dọc |

Hai vai trò chữ để bằng `ch` **có chủ ý**: 58ch của `text-lead` và 58ch của
`text-body` ra hai bề ngang khác nhau, và đó đúng là điều mình muốn — giới hạn
là **số ký tự một dòng**, không phải số pixel. Đừng để `max-w-3xl` tự quyết.

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

### Chiều cao — hai bộ, chọn theo THIẾT BỊ TRỎ

| Token | Chuột | Ngón tay | Dùng ở |
|---|---|---|---|
| `--h-control-xs` | 28 | 36 | mũi tên điều hướng băng card |
| `--h-control-sm` | 36 | 44 | nút trong header, nút phụ trong khối |
| `--h-control-md` | 40 | 48 | mặc định |
| `--h-control-lg` | 48 | 52 | nút chính của hero và dải CTA |

Bộ thứ hai bật bằng `@media (pointer: coarse)` — **không phải breakpoint**. Bề
ngang màn hình không nói được người ta bấm bằng gì: máy tính bảng 1024px vẫn là
ngón tay, còn cửa sổ kéo hẹp còn 380px trên máy bàn vẫn là con trỏ chuột. Lấy
bề ngang làm dấu hiệu là đoán sai cả hai đầu. Đây là `@media` **duy nhất** trong
hệ được phép đổi kích thước.

Số của bộ chạm lấy theo 44px (Apple HIG) và 48dp (Material). `xs` cố ý dừng ở
36 và vẫn dưới ngưỡng: nó là control phụ, thao tác chính là vuốt ngang.

`button.tsx` đọc thẳng bốn token này thay cho các bậc `h-*` cố định. Đặt lại
`h-10`/`h-11` là âm thầm kéo vùng chạm trên điện thoại xuống dưới ngưỡng.

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
chỗ cùng phát sáng, và chữ phát sáng ở mọi nơi là nhiễu chứ không phải điểm
nhấn. Chỉ thêm từ HIẾM và mang định vị. Đã loại `vận hành` (15 chỗ) và
`Pebble Vina` (19 chỗ) vì lý do đó.

Từng có chế độ `brand` tô thêm hai cụm riêng cho tiêu đề hero (`Pebble Vina`
phát sáng, `doanh nghiệp số tự vận hành` gạch chân mảnh). **Đã bỏ 2026-08-14**
cùng lúc với tiêu đề hero mới — tiêu đề nay không chứa cụm nào trong hai cụm
đó, nên nó chỉ còn ĐÚNG MỘT điểm nhấn: chữ `AI`.

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
