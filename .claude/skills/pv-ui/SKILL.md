---
name: pv-ui
description: Dựng và sửa giao diện website Pebble Vina sao cho mọi trang trông cùng một hệ — token màu, thang chữ theo vai trò, nhịp section, block dùng chung, và bộ chuyển động chuẩn. Dùng skill này MỖI KHI tạo hoặc sửa component, section, trang, layout, animation, chữ nghĩa về cỡ và weight, hoặc khi người dùng nói "dựng giao diện", "thêm section", "code màn hình", "làm trang X", "thêm hiệu ứng", "chỉnh layout", "chữ nhỏ quá", "chỉnh typo", "trông chưa đồng bộ". Bắt buộc dùng trước khi viết bất kỳ JSX nào trong repo này.
---

# Dựng giao diện Pebble Vina

Đọc `docs/DESIGN-TOKENS.md` trước. Skill này là quy trình; file đó là bảng tra.

## Ba luật không thương lượng

**1. Chỉ dùng token.**
Không hardcode màu, cỡ chữ, easing, ms, px cho nhịp section. Màu qua semantic
token (`bg-surface`, `text-muted-foreground`, `text-brand`…), chữ qua vai trò
(`text-body`, `text-title`…), chuyển động qua `EASE` / `DUR` trong
`src/lib/motion.ts`.

Sai: `className="bg-slate-900 text-white"` · `text-lg leading-relaxed`
· `transition={{duration: 0.5}}`
Đúng: `<Section tone="dark">` · `text-lead`
· `transition={{duration: DUR.slow, ease: EASE.out}}`

**2. Ghép từ block có sẵn.**
Cần biến thể mới → thêm prop cho block sẵn có. Không dựng lưới riêng cho một
trang. Mười trang tự dựng lưới riêng sẽ thành mười thứ tiếng nói khác nhau.

**3. Chữ nằm ở messages, không nằm trong JSX.**
Mọi chuỗi đi qua `useTranslations` / `getTranslations`. Không có ngoại lệ, kể cả
nhãn nút và aria-label.

---

## Mật độ — luật cứng

Trang dành cho người mua Enterprise. Họ quét chứ không đọc. Section dài là
section bị bỏ qua.

- Một `CardGrid` tối đa **4 thẻ**. Cần nhiều hơn thì đó là dấu hiệu section này
  nên tách thành một trang riêng.
- Nhiều hơn 4 mục thì bỏ phần mô tả, chỉ giữ nhãn, dùng `<PillRow>`.
- Một section tối đa một danh sách. Hai danh sách cạnh nhau là hai section.
- Trang chủ giữ trong khoảng 10 màn hình cuộn ở 1440px. Kiểm tra:
  `document.body.scrollHeight / window.innerHeight`

## Bộ dựng trang

| Cần gì | Dùng |
|---|---|
| Khung một section | `<Section tone id flush bleed>` |
| Tiêu đề + eyebrow + lead | `<SectionHeader as eyebrow title lead align>` |
| Lưới thẻ | `<CardGrid cols>` + `<Card index title>` |
| Danh sách khẳng định | `<StatementList items>` |
| Nhóm chip từ khoá | `<PillRow items>` |
| Quy trình / lộ trình có số bước | `<StepRail steps>` |
| Sơ đồ chồng tầng | `<LayerStack layers>` |
| So sánh trước / sau | `<BeforeAfter>` |
| Ảnh | `<MediaFrame ratio need src alt>` |
| Ô chờ nội dung | `<Gap kind>` / `<GapChip kind>` |
| Dải CTA đóng trang | `<CtaBand cta items>` |
| Trang solution / use case | `<SolutionTemplate>` / `<UseCaseTemplate>` |
| Trang V2 chưa tới lượt | `<StubPage>` |

Tất cả nằm ở `src/components/pv/` và `src/components/motion/`.

## Chữ

Chọn theo **việc chữ đang làm**, không theo cỡ. Thang Tailwind mặc định
(`text-sm`, `text-lg`, `text-[11px]`) chỉ còn dành cho `src/components/ui/`.

| Chữ đang làm gì | Dùng | Weight |
|---|---|---|
| h1, mỗi trang một cái | `text-display` | `font-semibold` |
| h2 mở section | `text-headline` | `font-semibold` |
| h3, tiêu đề khối trong section | `text-subhead` | `font-semibold` |
| Tiêu đề thẻ, bước, tầng | `text-title` | `font-semibold` |
| Câu dẫn dưới tiêu đề | `text-lead` | — |
| Thân bài | `text-body` | — |
| Thân bài trong cột hẹp (thẻ lưới 3–4 cột, footer) | `text-body-sm` | — |
| Nav, chip, nhãn control | `text-ui` | `font-medium` |
| Chú thích, dòng pháp lý, ô bảng | `text-meta` | — |
| Số thứ tự mono, chip ô chờ | `text-micro` | `font-medium` |
| Eyebrow mono viết hoa | `text-eyebrow` | `font-medium` |

Bốn điều đi kèm:

- **Không viết `leading-*` và `tracking-*`.** Mỗi vai trò đã mang sẵn cả hai,
  cân riêng theo cỡ. Viết thêm là ghi đè lên thứ đã cân đúng.
- **Không viết bậc breakpoint cho cỡ chữ.** `text-headline` đã tự co giãn từ
  32px lên 52px. Thấy `text-3xl sm:text-4xl lg:text-[2.75rem]` là code cũ.
- **Ba nấc weight, không hơn:** 600 tiêu đề · 500 nhãn giao diện · 400 thân bài.
  Cần nhấn mà không đổi cấp thì đổi màu (`text-muted-foreground`), không đổi weight.
- **Giới hạn độ dài dòng** khi khối chữ nằm trong cột rộng: câu dẫn
  `max-w-[58ch]`, thân bài `max-w-[68ch]`. `<SectionHeader>` và `<StatementList>`
  đã có sẵn, tự viết `<p>` thì phải tự đặt.

Bảng đầy đủ kèm cỡ px và lý do từng con số: `docs/DESIGN-TOKENS.md` mục *Thang chữ*.
Đổi thang thì sửa LỚP 3 trong `globals.css`, không sửa component.

## Chuyển động

Chỉ dùng ba primitive: `<Reveal>`, `<RevealGroup>` + `<RevealItem>`.
Không viết `motion.div` rời rạc trong trang — nhịp sẽ lệch giữa các section.

⚠️ **Không gọi `motion.create()` trong thân component.** Mỗi lần render sẽ sinh
một component type mới, React unmount rồi mount lại cây con, animation kẹt ở
trạng thái ẩn. Cần thẻ mới thì thêm vào bảng `TAGS` trong `reveal.tsx`.

Biên độ:
- `<Reveal>` cho khối độc lập; `<RevealGroup>` khi có từ ba phần tử cùng loại.
- `<Parallax amount="base">` cho ảnh. `amount="strong"` và `<ScrollStage>` chỉ
  dùng **một lần mỗi trang**, thường là hero.
- Hiệu ứng mới phải kiểm tra `useReducedMotion()` trước.

Chuyển động để dẫn hướng đọc, không để giải trí. Hiệu ứng làm chậm việc đọc là
hiệu ứng sai.

## Nhịp sáng / tối

Thân bài sáng, hero và dải CTA tối. Đặt `tone="dark"` lên `<Section>` —
`.tone-dark` remap token, component con tự đổi màu. Không tự bôi màu nền.

Mẫu bố cục của một trang trong:
`Hero (dark)` → nội dung sáng, xen `tone="surface"` để tạo nhịp → `CtaBand (dark)`
→ Footer (dark).

Hai section `tone="surface"` không được đứng liền nhau.

## Ảnh

Mọi ảnh đi qua `<MediaFrame>`. Chưa có ảnh thật thì để trống `src` và viết
`need="…"` mô tả rõ cần chụp gì. **Không cắm ảnh stock tạm.**

Cấm: robot hình người, bộ não phát sáng, bàn tay chạm màn hình, cyberpunk, neon
mạnh, dashboard giả, ảnh bắt tay, chip ở mọi section.

## Thêm component shadcn

```bash
pnpm dlx shadcn@latest add <tên> -y
```
Không sửa tay file trong `src/components/ui/` trừ khi bắt buộc — sửa thì ghi chú
lý do ngay trên chỗ sửa, vì lần `add` sau sẽ ghi đè.

## Kiểm lại trước khi xong

- [ ] Không còn màu/easing/thời lượng hardcode?
- [ ] Chữ dùng vai trò, không còn `text-sm`/`text-lg`/`text-[11px]` ngoài `ui/`?
- [ ] Không tự viết `leading-*`, `tracking-*` hay bậc breakpoint cho cỡ chữ?
- [ ] Không có chuỗi tiếng Việt nằm trong JSX?
- [ ] Section dùng `<Section>`, không tự đặt padding dọc?
- [ ] Nhịp sáng/tối đúng, không hai `surface` liền nhau?
- [ ] Ảnh đi qua `MediaFrame` và có `need` hoặc `alt`?
- [ ] Chỉ một `<h1>` mỗi trang?
- [ ] Đã thử ở 375px, 768px, 1440px?
- [ ] `prefers-reduced-motion` bật lên trang vẫn đọc được?
- [ ] `pnpm build` sạch?
