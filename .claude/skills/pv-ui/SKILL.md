---
name: pv-ui
description: Dựng và sửa giao diện website Pebble Vina sao cho mọi trang trông cùng một hệ — token màu, thang chữ theo vai trò, nhịp section, block dùng chung, và bộ chuyển động chuẩn. Dùng skill này MỖI KHI tạo hoặc sửa component, section, trang, layout, animation, chữ nghĩa về cỡ và weight, hoặc khi người dùng nói "dựng giao diện", "thêm section", "code màn hình", "làm trang X", "thêm hiệu ứng", "chỉnh layout", "chữ nhỏ quá", "chỉnh typo", "trông chưa đồng bộ". Bắt buộc dùng trước khi viết bất kỳ JSX nào trong repo này.
---

# Dựng giao diện Pebble Vina

Skill này là quy trình; bảng tra là `docs/DESIGN-TOKENS.md`. Mở bảng tra khi
cần một con số, đừng đọc cả file trước khi bắt đầu.

## Bước 0 — chốt xong ba thứ rồi mới viết JSX

Sai một trong ba thứ này là phải dựng lại, không phải sửa. Hỏi gộp MỘT lượt
(luật 6 trong `CLAUDE.md`), rồi làm liền mạch:

1. **Asset** — có sẵn file ảnh không? Chất liệu chụp được (vải, kim loại, cảnh
   thật) thì XIN ẢNH, không vẽ bằng CSS/SVG. Vẽ bằng code chỉ cho hình học
   thuần: cung, lưới, sơ đồ, chuyển động.
2. **Chữ** — có bản thiết kế kèm chữ thì lấy NGUYÊN VĂN, không viết lại.
   Không có thì dùng skill `pv-content`.
3. **Khổ** — bản thiết kế có mấy khổ? Bố cục đổi theo BỀ NGANG hay theo HƯỚNG
   MÀN (`portrait`/`landscape`)? Ảnh nền `object-cover` gần như luôn là hướng
   màn, không phải bề ngang.

Ba thứ tự quyết được, đừng hỏi: chọn block nào, đặt token nào, ngắt dòng ở đâu,
tên file.

## Ba luật không thương lượng

Chi tiết ở `CLAUDE.md` luật 2–4. Bản rút gọn để không phải mở file:

1. **Chỉ dùng token.** Sai: `bg-slate-900` · `text-lg leading-relaxed` ·
   `transition={{duration: 0.5}}`. Đúng: `<Section sky="deep">` · `text-lead` ·
   `transition={{duration: DUR.slow, ease: EASE.out}}`.
2. **Ghép từ block có sẵn.** Cần biến thể mới → thêm prop cho block sẵn có,
   không dựng lưới riêng cho một trang.
3. **Chữ nằm ở messages**, kể cả nhãn nút và `aria-label`. Chỗ ngắt dòng cũng
   là nội dung: đặt `\n` trong chuỗi + `whitespace-pre-line`, không `<br/>`.

## Chú thích trong code

Ngắn. Chỉ viết cái code không tự nói được, và ưu tiên chỗ có SỐ ĐO — "p95 chói
0,020 nên không cần scrim" đáng một dòng; "hai cung so le đọc ra chiều sâu" thì
không. Một component 60 dòng không cần 40 dòng chú thích.

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
| Khung một section | `<Section sky id height flush bleed>` |
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
| Đồ hoạ trang trí | không còn — xem mục *Trang trí* |
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
  `max-w-lead`, thân bài `max-w-body`. `<SectionHeader>` và `<StatementList>`
  đã có sẵn, tự viết `<p>` thì phải tự đặt.

Bảng đầy đủ kèm cỡ px và lý do từng con số: `docs/DESIGN-TOKENS.md` mục *Thang chữ*.
Đổi thang thì sửa LỚP 3 trong `globals.css`, không sửa component.

## Khoảng cách và bề ngang

Cùng luật với chữ: gọi theo **vai trò**, không theo con số.

| Khoảng cách đang làm gì | Dùng |
|---|---|
| Nhịp dọc của section | `py-section` (`<Section>` tự có) |
| Tiêu đề section → thân section | `mt-stack` |
| Giữa hai **cột lớn** của một bố cục | `gap-column` |
| Giữa hai nhóm trong một khối | `gap-group` |
| Giữa các item cùng loại | `gap-item` |
| Nhãn ↔ giá trị | `gap-tight` |

| Bề ngang của khối chữ | Dùng |
|---|---|
| Câu dẫn | `max-w-lead` (58ch) |
| Thân bài | `max-w-body` (68ch) |
| Khoang tiêu đề section | `max-w-header` |
| Cột phụ, hồ sơ, dãy điều hướng dọc | `max-w-rail` |

`mt-14`, `gap-3`, `max-w-3xl`, `w-[15rem]` là **code cũ**. Chúng còn chạy nhưng
nằm dưới bánh cóc trong `scripts/check-tokens.mjs`: số chỗ chỉ được đi xuống.
Đụng vào file nào thì đổi chỗ đó sang tên vai trò rồi hạ `max` xuống số mới.

## Màn hình — bốn mốc, mỗi mốc một việc

| Mốc | Từ | Được phép đổi |
|---|---|---|
| — | 0 | một cột |
| `sm` | 640 | **chỉ** căn lề / hướng của một khối chữ hay hàng nút |
| `md` | 768 | một cột → hai cột |
| `lg` | 1024 | bố cục đủ: cột phụ, sidebar, kệ ngang |
| `xl` | 1280 | **chỉ** chạm trần container |

`2xl` đã gỡ khỏi từ vựng. `check:tokens` chặn nếu viết lại.

**Breakpoint chỉ đổi SỐ CỘT và HƯỚNG XẾP.** Cỡ chữ, khoảng cách, lề đều đã
clamp mượt — `lg:text-headline` hay `lg:mt-16` là chữa thứ đã tự chữa.

**Đừng nhảy từ một cột thẳng lên bố cục đủ.** Đó là lỗi cũ của repo này: 163
chỗ dùng `lg:` so với 26 chỗ `md:`, nên dải 768–1023 không ai thiết kế và trang
chủ cuộn ngang được ở mọi khổ dưới 1024 suốt nhiều phiên. Có `lg:` thì hỏi luôn
"ở 768 nó ra sao".

### Băng cuộn ngang — chỗ vỡ quen thuộc nhất

Một băng card cuộn ngang (`overflow-x-auto`) **không được** làm cả trang cuộn
ngang. `overflow-x-auto` chỉ ăn khi phần tử được phép hẹp lại, mà mặc định
`min-width: auto` của flex/grid item thì không.

Phải mở **cả chuỗi** từ khung xuống tới băng, thiếu một mắt là đứt:
- `grid` một cột: khai `grid-cols-[minmax(0,1fr)]`. Không khai thì cột ngầm là
  `auto`, rộng bằng min-content của con.
- Mọi flex/grid item trên đường: `min-w-0`.

Mẫu đã sửa đúng: `product-shelf.tsx` — ba mắt xích, có chú thích tại chỗ.

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

## Nấc trời

Cả site là một bầu trời dọc: đỉnh trang tối nhất, càng xuống chân trời càng
sáng, và thứ ló rạng là xanh da trời. Mỗi `<Section>` khai một nấc qua `sky`:
`void` (hero) → `night` → `deep` → `rise` (ngay trước CTA) → `dawn` (CtaBand tự
đặt).

**Nấc chỉ đi lên trong một trang.** Sáng rồi tối lại là lỗi duy nhất không được
phép ở đây. Muốn một chỗ sáng hơn thì đổi nấc, không chỉnh opacity tại chỗ.

⚠️ **Ranh giới giữa hai section hiện KHÔNG CÓ GÌ VẼ** (xoá 2026-08-14). Hai
section cùng nấc đứng liền nhau nay không còn đường nào tách ra, và hai nền đêm
cách nhau ~3% độ sáng thì đọc ra là lỗi render. Đây là việc còn nợ của kế hoạch
nền mới, không phải thứ vá tại chỗ bằng một viền hay một khoảng đệm.

Bảng nấc và lớp hạt: `docs/DESIGN-TOKENS.md` mục *Thang sky*.

## Chiều cao section

Hai nấc qua prop `height`, **mặc định `auto`**:

- `auto` — cao theo nội dung, nhịp do `pv-section` tạo. Dùng cho gần như mọi thứ.
- `screen` — `min-h-dvh`, nội dung căn giữa. Chỉ khi khối **cần** trọn màn để
  đọc đúng (hero, một cảnh dựng bằng ảnh).

Không tự đặt `min-h-*`. Và **đừng chọn `screen` để cho section trông rộng rãi**
— chỗ trống là việc của `--pv-space-section`; ép trọn màn chỉ dồn khoảng trống
ra hai đầu, mà dồn đều ở mọi section thì không section nào nổi hơn section nào.

Luật mật độ vẫn giữ nguyên: **một section, một ý**.

## Trang trí — KHÔNG CÒN GÌ

Xoá sạch 2026-08-14 để đổi kế hoạch nền: hai lớp ảnh thương hiệu của trang chủ,
`decor.tsx` (`HorizonArc`, `DawnRings`), `sky-boundary.tsx`, và các utility
`pv-arc` · `pv-horizon` · `pv-skyglow` · `pv-rings` · `pv-grid-bg`. Cả site nay
chỉ còn **nền màu theo nấc `sky` + lớp hạt `pv-grain`** (và `pv-edge` cho mép
card).

**ĐỪNG DỰNG LẠI khi chưa có quyết định** — kể cả một cung, một quầng hay một
vạch "cho đỡ trống". Đó đúng là thứ vừa bị bỏ.

Luật cũ vẫn dùng được khi dựng bộ mới: MỘT ý hình học duy nhất, biến tấu theo
nấc trời, không phải một bộ hoạ tiết. Cần trang trí mới thì hỏi trước — nếu nó
là một hình khác hẳn thì đó là tiếng nói thứ hai, và câu trả lời là không.

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

## Đo — máy trước, mắt sau

**Đo bằng máy trước khi nhìn.** Mắt không đọc được `scrollWidth`, không đọc
được một section lấp đầy bao nhiêu phần trăm, và không phân biệt được std 0,4
với std 2,0 trên nền đen. Chụp ảnh rồi ngắm là cách chắc chắn nhất để bỏ sót
đúng thứ đang hỏng.

```bash
pnpm check:layout      # tràn ngang, 33 trang × 4 khổ — đã nằm trong pnpm verify
pnpm check:tokens      # hardcode + bánh cóc khoảng cách/bề ngang
```

Lái trình duyệt bằng **MCP `chrome-devtools`** (`navigate_page` · `resize_page`
· `take_screenshot` · `evaluate_script` · `list_console_messages`). Dùng
`evaluate_script` để lấy SỐ ĐO, không chỉ chụp hình: chiều cao section, chiều
cao nội dung, `scrollWidth`, độ sáng nền.

Rồi mới đến mắt, và **có ngân sách**: một vòng chụp ở hai khổ (1440 ngang +
500 dọc) là đủ để kết luận một bố cục. Quá **ba vòng** chỉnh bằng mắt mà chưa
đạt thì dừng, mô tả chỗ lệch và hỏi — vòng thứ tư gần như luôn là đang đoán ý
người khác.

Cửa sổ Chrome hẹp nhất là 500px, nhưng `resize_page` / `Emulation` hạ được
xuống 360px, nên không còn phải "xem bằng trình duyệt thật" để kiểm 375.

## Kiểm lại trước khi xong

- [ ] Không còn màu/easing/thời lượng hardcode?
- [ ] Chữ, khoảng cách, bề ngang đều gọi bằng **vai trò**, không bằng số?
- [ ] Không tự viết `leading-*`, `tracking-*` hay bậc breakpoint cho cỡ chữ?
- [ ] Không có chuỗi tiếng Việt nằm trong JSX?
- [ ] Section dùng `<Section>`, không tự đặt padding dọc hay `min-h-*`?
- [ ] `height="screen"` chỉ dùng khi khối THẬT SỰ cần trọn màn?
- [ ] Nấc `sky` chỉ đi lên, hero `void`, section trước CTA `rise`?
- [ ] Có `lg:` thì đã trả lời "ở 768 nó ra sao" chưa?
- [ ] Băng cuộn ngang đã mở đủ chuỗi `min-w-0` / `grid-cols-[minmax(0,1fr)]`?
- [ ] Ảnh đi qua `MediaFrame` và có `need` hoặc `alt`?
- [ ] Chỉ một `<h1>` mỗi trang?
- [ ] `prefers-reduced-motion` bật lên trang vẫn đọc được **và console sạch**?
- [ ] `pnpm verify` sạch (đã gồm `check:layout`)?
