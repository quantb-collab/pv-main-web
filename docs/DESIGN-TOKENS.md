# Hệ token

Nguồn: `src/app/globals.css` (CSS) và `src/lib/motion.ts` (JS).
**Hai file phải khớp nhau.** Đổi easing hay thời lượng thì sửa cả hai.

## Năm lớp trong globals.css

| Lớp | Nội dung | Khi nào sửa |
|---|---|---|
| 1 | Brand ramp `--pv-brand-*`, `--pv-ink-*`, `--pv-signal-*` | Khi chốt brand kit. Sửa **chỉ ở đây**. |
| 2 | Semantic token: `--background`, `--foreground`, `--surface`, `--primary`, `--brand`… | Khi đổi cách dùng màu, không phải khi đổi màu |
| 3 | Motion & layout: `--ease-*`, `--dur-*`, `--section-y`, `--container-max` | Khi đổi nhịp toàn site |
| 4 | Đăng ký với Tailwind (`@theme inline`) | Khi thêm token mới cần utility |
| 5 | Utility dùng chung: `pv-container`, `pv-section`, `pv-grid-bg`… | Khi thêm mẫu bố cục dùng lại nhiều nơi |

> ⚠️ Giá trị màu ở LỚP 1 hiện là **placeholder trung tính**, chưa phải màu
> brand thật. Khi có brand kit, thay toàn bộ khối đó — component không cần đụng.

## Thang bề mặt và chữ

Ba nấc nền: `bg-background` → `bg-surface` → `bg-surface-2`
Ba nấc chữ: `text-foreground` → `text-muted-foreground` → `text-subtle-foreground`

Dùng đúng nấc, đừng pha `opacity` để làm chữ nhạt hơn.

## Nhịp sáng / tối

Thân bài nền sáng. Hero, dải CTA và footer nền tối.

Cách làm: đặt `tone="dark"` cho `<Section>`. Class `.tone-dark` remap toàn bộ
semantic token, mọi component con tự đổi màu. Đây là lý do component **chỉ được
dùng token** — nhờ vậy `.tone-dark` mới có tác dụng.

Không tự viết `bg-slate-900 text-white` cho một section.

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
chỉ để nút đọc ra là bấm được. `ghost` và `link` không có bóng. Trên `.tone-dark`
token tự đổi sang vạch sáng inset ở cạnh trên — component không phải đụng.

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

Nền sáng dùng ramp đậm (`brand-600→700`) và quầng gần như tắt; `.tone-dark`
đảo sang ramp sáng có lõi gần trắng và quầng mạnh. Đổi brand kit ở LỚP 1 thì
gradient tự đổi theo, không đụng component.

Dùng qua `<Highlight>` (`src/components/pv/highlight.tsx`), đã gắn sẵn vào
`SectionHeader` (title + lead), `Card` (title + body), `StatementList` và hero.
Trang mới ghép từ những block đó thì không phải làm gì thêm.

Không áp cho eyebrow mono, chip `PillRow`, nhãn nút và chữ nhỏ — chữ phát sáng
ở cỡ 11px là nhiễu, không phải điểm nhấn.

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
