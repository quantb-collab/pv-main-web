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
