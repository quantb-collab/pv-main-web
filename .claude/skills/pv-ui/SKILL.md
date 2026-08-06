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
Đúng: `<Section sky="deep">` · `text-lead`
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
| Khung một section | `<Section sky id full flush bleed>` |
| Tiêu đề + eyebrow + lead | `<SectionHeader as eyebrow title lead align>` |
| Lưới thẻ | `<CardGrid cols>` + `<Card index title>` |
| Danh sách khẳng định | `<StatementList items>` |
| Nhóm chip từ khoá | `<PillRow items>` |
| Quy trình / lộ trình có số bước | `<StepRail steps>` |
| Sơ đồ chồng tầng | `<LayerStack layers>` |
| So sánh trước / sau | `<BeforeAfter>` |
| Ma trận nấc tiến hoá (nhấn theo vị trí cột) | `<StageMatrix stages rows>` |
| Bento chỉ số (số chưa xác minh thì để slot chờ) | `<BentoGrid>` + `<StatTile hero tag value label gap>` |
| Ảnh | `<MediaFrame ratio need src alt>` |
| Ô chờ nội dung | `<Gap kind>` / `<GapChip kind>` |
| Đồ hoạ trang trí | `<HorizonArc>` (Section tự gắn) · `<DawnRings>` (hero, 1 lần/site) |
| Dải CTA đóng trang | `<CtaBand cta items>` |
| Trang solution / use case | `<SolutionTemplate>` / `<UseCaseTemplate>` |
| Trang V2 chưa tới lượt | `<StubPage>` |

Tất cả nằm ở `src/components/pv/` và `src/components/motion/`.

## Chữ

Chọn theo **việc chữ đang làm**, không theo cỡ. Thang Tailwind mặc định
(`text-sm`, `text-lg`, `text-[11px]`) chỉ còn dành cho `src/components/ui/`.

| Chữ đang làm gì | Dùng | Weight |
|---|---|---|
| h1 dưới ~60 ký tự | `text-display` | `font-semibold` |
| h2 mở section · **h1 dài trên ~60 ký tự** | `text-headline` | `font-semibold` |
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

## Nấc trời — đêm trước bình minh

Chủ đề: cả site là một bầu trời dọc, đỉnh trang tối nhất, càng xuống chân trời
càng sáng, và thứ ló rạng là **xanh da trời** chứ không phải nắng vàng.
Chất liệu nền là **titan sần**: chroma rất thấp cộng lớp hạt `pv-grain` —
`<Section>` tự phủ, đừng gỡ.
Không có chế độ sáng. Không còn `.tone-dark`.

Mỗi `<Section>` khai một nấc qua `sky`:
`void` (hero) → `night` → `deep` → `rise` (ngay trước CTA) → `dawn` (CtaBand tự đặt).

**Nấc chỉ đi lên trong một trang.** Sáng rồi tối lại là gãy mạch — đó là lỗi
duy nhất không được phép ở đây.

Hai section **cùng nấc đứng liền nhau là hợp lệ**: ranh giới không nằm ở màu
nền mà ở vạch chân trời + quầng sáng do `<Section>` tự vẽ. Đừng bù bằng cách
nhảy nấc chỉ để "cho khác nhau".

Muốn một chỗ sáng hơn → đổi nấc. Không chỉnh opacity hay bôi màu tại chỗ.

## Chiều cao section

Mặc định cao trọn một viewport, nội dung căn giữa. Không tự đặt `min-h-*`.
`full={false}` chỉ dành cho trang công cụ nội bộ (`/track`).

Hệ quả: mỗi section chỉ còn chỗ cho **một ý**. Nhồi hai ý vào một màn hình thì
khối chữ tụt xuống nhỏ và chật đúng thứ mà chiều cao này sinh ra để tránh.

## Trang trí

MỘT ý duy nhất, biến tấu theo nấc trời — không phải một bộ hoạ tiết.
`<Section>` **tự** gắn cung chân trời, không phải khai gì. `<DawnRings>` là
vector chính của trang chủ, chỉ dùng **một lần trên toàn site**.

Cần trang trí mới thì hỏi trước: nó có phải cùng một bầu trời không? Nếu là
một hình khác hẳn thì đó là thứ tiếng nói thứ hai, và câu trả lời là không.

## Ghi đè class cho component `ui/`

`<html>` mang class `dark` cố định, nên mọi biến thể `dark:` trong
`src/components/ui/` đều đang chạy. tailwind-merge chỉ gộp class **cùng biến
thể** — `border-foreground/35` không đẩy được `dark:border-input` ra, và ở tầng
CSS biến thể `dark:` sinh sau nên nó thắng.

**Ghi đè cái gì thì khai luôn cặp `dark:` của nó.** Thiếu một cặp là override
im lặng không có tác dụng và `pnpm verify` vẫn sạch. Xem nút phụ trong
`hero.tsx` làm mẫu.

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
- [ ] Nấc `sky` chỉ đi lên, hero `void`, section trước CTA `rise`?
- [ ] Section cao trọn một màn hình và nội dung không bị chật?
- [ ] Ảnh đi qua `MediaFrame` và có `need` hoặc `alt`?
- [ ] Chỉ một `<h1>` mỗi trang?
- [ ] Đã thử ở 375px, 768px, 1440px?
- [ ] `prefers-reduced-motion` bật lên trang vẫn đọc được?
- [ ] `pnpm build` sạch?
