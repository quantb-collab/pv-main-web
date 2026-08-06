# Bàn giao — 2026-08-06

## Đang ở đâu

Khung 33 trang chạy sạch cho ba ngôn ngữ, chưa trang nào lên trạng thái
`content` vì còn thiếu bằng chứng thật. Năm phiên gần đây làm về **hình thức**
chứ không phải nội dung: token control + hero + highlight, footer danh tính
pháp nhân, hệ thang chữ, chủ đề "đêm trước bình minh", và mới nhất là
**hero theo tỉ lệ vàng + DawnRings v2 + sửa bug Parallax**.

Nội dung chi tiết vẫn bị chặn bởi quyết định phân khúc — xem mục Đang chờ.
Đang ở nhánh `feat/controls-hero-highlight`, chưa mở PR về `main`.

## Vừa hoàn thành

Phiên 2026-08-06 — hero trang chủ, theo yêu cầu "decorator chưa có tỉ lệ":

- **Bố cục hero theo tỉ lệ vàng.** Khối chữ không còn căn giữa hình học: hai
  spacer chia khoảng trống 382:618, tiêu đề đậu đúng vạch vàng (~38% chiều
  cao). Đo thật ở 1440×900: vạch vàng rơi đúng dòng hai của h1.
- **DawnRings v2.** Vòng tròn đồng tâm (bị chê đơn điệu) vẽ lại thành gợn
  sóng ellipse dẹt cùng độ cong với `HorizonArc` (ry = rx/φ²), 5 gợn bán kính
  cấp số nhân φ, xen kẽ nét liền/vạch chia, 3 kinh tuyến chết đúng tại node
  trên gợn 4, 5 node ở giao điểm thật, một vệt bình minh hai lớp trên vai
  phải. Toàn bộ toạ độ TÍNH từ φ, không rắc tay — xem `decor.tsx`.
- **Sửa bug Parallax** (`parallax.tsx`): `motion.div` bên trong không có kích
  thước, nên khi cuộn transform biến nó thành containing block và mọi lớp nền
  absolute co về 0 — trời đen kịt ngay pixel cuộn đầu tiên, và parallax chưa
  từng chạy. Đã cho `h-full w-full`.
- **Animation decorator**: ba nhịp CSS mới (`dawn-swell` 16s, `dawn-pulse` 7s,
  `dawn-twinkle` 5.2s) — chu kỳ không chia hết cho nhau để không nháy đồng
  loạt; reduced-motion tự tắt qua kill switch sẵn có.
- **Tiêu đề hero chốt lại**: "Pebble Vina — đồng hành xây dựng doanh nghiệp số
  tự vận hành" (60 ký tự, bỏ "cùng bạn"). `Pebble Vina` PHÁT SÁNG qua chế độ
  `brand` của `<Highlight>` (chỉ hero bật — 18 chỗ khác giữ im), cụm
  "doanh nghiệp số tự vận hành" GẠCH CHÂN mảnh qua `<Horizon>`. "tự vận hành"
  rút khỏi TERMS toàn cục. Chip "cần ảnh hero" đã gỡ khỏi giao diện; brief
  chụp ảnh vẫn nằm ở `home.hero.mediaNeed` trong `vi.json`.
- `pv-skyglow` hạ về 38.2% (lát vàng), `pv-rings` nhốt trong 61.8% dưới của
  khung, mask/opacity nới cho gợn ngoài sống được.

Phiên trước đó — chủ đề thị giác mới, thay hoàn toàn nhịp sáng/tối cũ. Lý do
và cái đã cân nhắc: ba mục cuối `docs/DECISIONS.md`. Bảng tra:
`docs/DESIGN-TOKENS.md` mục *Thang sky*.

- LỚP 1 đổi sang bảng đêm: brand ramp **xanh da trời** (hue 234–255, đỉnh
  chroma 0.122 ở khúc giữa thang chứ không ở đầu sáng, hue chỉ trôi 21 độ),
  ink ramp titan, thang trời `--pv-night-0..6` chroma rất thấp (0.008–0.023),
  hue trôi 265 → 238. Đây là bản thứ ba — LED xanh và ngọc bích đều bị bác,
  lý do từng bản nằm ở `DECISIONS.md`
- Chất liệu **titan sần**: `@utility pv-grain` — nhiễu fractal SVG hoà
  `overlay` — phủ lên mọi section, footer và hero. Chroma nền thấp và lớp hạt
  là một quyết định, không tách được
- Bỏ chế độ sáng và `.tone-dark`. LỚP 2 còn một bảng duy nhất; `<html>` mang cố
  định class `dark` cho biến thể `dark:` của shadcn
- Thang `sky` năm nấc thay ba `tone`: `void` → `night` → `deep` → `rise` →
  `dawn`. Mỗi nấc remap cả nền lẫn chữ (hai nấc cuối nhích thang chữ lên một
  bậc để giữ 4.5:1)
- Ranh giới giữa hai section là ánh sáng chứ không phải màu nền: `pv-horizon`
  (vạch 1px mép trên) + `pv-skyglow` (quầng xanh da trời dâng từ mép dưới), cả hai đọc
  `--sky-light` — `src/app/globals.css` LỚP 5
- `<Section>` mặc định cao trọn một viewport, nội dung căn giữa. `full={false}`
  chỉ dùng ở `/track`
- 30 call site đã gán nấc; hero, header, footer theo hệ mới
- Chữ hero viết lại: bỏ eyebrow, tiêu đề định vị "đối tác đồng hành", câu dẫn
  thành slogan về công cụ. CTA chính đổi nhãn thành "Liên hệ" và đích sang
  `/ai-assessment`, nhãn "Đặt lịch khảo sát". Link phụ thành `ExploreCue` —
  anchor `#van-de` ở đáy hero, mũi kép chỉ xuống, nhãn "Khám phá thêm"
- `home.hero.mediaNeed` viết lại thành brief ảnh đầy đủ (ánh sáng, chủ thể, bố
  cục, kỹ thuật, danh sách cấm) — người đi chụp đọc là đủ
- Đã cập nhật `CLAUDE.md`, `docs/DESIGN-TOKENS.md`, skill `pv-ui`, `pv-qa`,
  `pv-page`, agent `pv-ui-builder`, `pv-page-qa`

## Đang làm dở

Không có việc dở trong code. **Hero đã được xem bằng mắt** phiên 2026-08-06
(headless 375/768/1440, cả cuộn thật — báo cáo dẫn tới loạt sửa ở trên), nhưng
**phần còn lại của trang chủ và các nấc `rise`/`dawn` vẫn chưa ai nhìn**. Các
chỗ còn ngờ:

- **Cường độ `pv-skyglow`.** Công thức `0.07 + 0.23 × --sky-light` là ước lượng.
  Ở nấc `night` quầng có thể quá mờ để tách hai section cùng nấc, ở `dawn` có
  thể quá mạnh sau lưng chữ. Sửa ở một chỗ: `@utility pv-skyglow`.
- **Độ rõ của `pv-grain`.** `opacity: 0.42` + `mix-blend-mode: overlay` là ước
  lượng, chưa nhìn thật. Quá rõ thì hạ opacity; **đừng** đổi `baseFrequency`.
- **Tiêu đề hero 97 ký tự đã hạ xuống `text-headline`** (32→52px) — ba dòng
  thay vì bốn, vẫn là `<h1>`. Luật mới: tiêu đề trang dài trên ~60 ký tự dùng
  `text-headline`. Chưa đo thật ở 375px.
- **Trang chủ giờ dài hơn ngân sách.** 11 section cao một màn hình + footer
  ≈ 11,6 màn hình cuộn ở 1440px, trong khi luật của skill `pv-ui` là ~10. Đo:
  `document.body.scrollHeight / window.innerHeight`
- Nhãn `LayerStack` đang dùng `text-title` — `src/components/pv/blocks.tsx:229`.
  Có thể quá nặng cho một sơ đồ 5 tầng; hạ về `text-body font-medium` nếu thấy vậy.
- Nav header ở đúng 1024px — `src/components/layout/site-header.tsx:70`.
  Weight 500 làm chữ rộng ra, đã bù bằng `px-2.5` nhưng chưa đo thật.

## Bước tiếp theo

1. Mở `/vi` ở 375px, 768px, 1440px — bốn chỗ ngờ ở trên, và kiểm mạch trời có
   đọc ra là "trời sáng dần" hay chỉ là các khối xám khác nhau
2. Kiểm tương phản ở nấc `rise` và `dawn` trước (nền sáng nhất, chữ phụ tụt
   trước ở đó)
3. Đọc `NAV` từ cờ `inNav` trong `src/content/registry.ts` thay cho mảng viết
   cứng ở `site-header.tsx:32`
4. Đặt `inNav: false` cho entry `insights` (`registry.ts:566`) — trang còn là ô
   chờ rỗng nhưng đang chiếm một slot menu chính
5. Viết nội dung đầy đủ cho một solution page mẫu để kiểm chứng
   `SolutionTemplate` — đề xuất `enterprise-knowledge`
6. Mở PR `feat/controls-hero-highlight` → `main`

## Đang chờ quyết định

| Câu hỏi | Ai trả lời | Việc bị chặn |
|---|---|---|
| Phân khúc ưu tiên 6–12 tháng | Pebble Vina | Ba use case nào lên Section 4 trang chủ; solution page nào viết trước |
| Assessment miễn phí hay có phí, kéo dài bao lâu | Pebble Vina | Trang `/ai-assessment` và `/how-we-deliver/assessment` |
| Bộ phận nhận lead + CRM nào | Pebble Vina | Form đánh giá hiện chưa gửi đi đâu |
| Brand kit và logo chính thức | Pebble Vina | Giá trị LỚP 1 (hướng xanh da trời + titan sần đã chốt), wordmark ở header/footer |
| Có làm mega-menu ngay hay đợi chốt phân khúc | Người dùng | Bước 3 và 4 ở trên |
| Trang chủ vượt ngân sách cuộn — gộp section hay giảm `--section-y` | Người dùng | Rút ngắn chiều cao trang chủ |

47 khoảng trống nội dung khác: xem `/track`, không chép lại ở đây.

## Bẫy đã gặp

- **Phần tử nhận `transform` phải có kích thước nếu chứa con `absolute`.**
  `motion.div` trong `Parallax` từng không có class: cao 0, và khi cuộn ghi
  `transform` lên nó thì nó thành containing block — mọi lớp nền `inset-0`
  bên trong co về 0, bầu trời hero biến mất. Triệu chứng đánh lừa: đứng yên
  thì mọi thứ đẹp, cuộn 1px là mất. Đã sửa bằng `h-full w-full`.
- **`overflow-hidden` trên `<Section>` giết `position: sticky` của con.** Nó
  biến section thành scroll container. Hai lớp nền của section đều nằm gọn
  trong khung nên không cần `overflow` — đừng thêm lại. Chỗ gãy: khối ghi chú
  sticky trong `Maturity`.
- **`pv-skyglow` tự neo vào mép dưới, đừng kèm `inset-0`.** Đặt cả `top` lẫn
  `bottom` cộng `height` là ràng buộc thừa, trình duyệt bỏ `bottom` và quầng
  nhảy lên đỉnh khung.
- **Comment JSX đứng trước thẻ gốc trong `return (…)` làm build fail.** Thành
  hai con mà không có fragment. Viết comment thường phía trên `return`.
- **Token thang chữ phải khai ở `:root` rồi mới map vào `@theme inline`.** Khai
  thẳng `clamp()` trong `@theme inline` thì không dùng lại được ở `@layer base`
  — chính là chỗ `body` lấy cỡ mặc định. Đó là lý do có cặp `--pv-text-*` và
  `--text-*` trông như trùng nhau.
- **Tab ẩn làm animation kẹt.** Trình duyệt dừng `requestAnimationFrame` khi tab
  bị ẩn, phần tử đứng nguyên ở `opacity: 0`. Kiểm tra `document.hidden` trước
  khi đi tìm nguyên nhân khác.
- **Không gọi `motion.create()` trong thân component.** Mỗi lần render sinh một
  component type mới, React unmount rồi mount lại cây con. Dùng bảng `TAGS`
  trong `src/components/motion/reveal.tsx`.
- **Sửa `messages/*.json` xong phải khởi động lại dev server.** File watcher
  không bắt được nếu file bị thay bằng thao tác đổi tên — trang hiện đường dẫn
  khoá thay vì nội dung, dễ tưởng là thiếu khoá.
- **`pnpm build` không bắt được khoá messages thiếu.** Luôn dùng `pnpm verify`.

## Trạng thái kỹ thuật

- Lệnh kiểm tra cuối: `pnpm verify` — sạch (104 trang, 42 file, không lỗi)
- Commit này gói cả hai phiên: chủ đề "đêm trước bình minh" (globals, section,
  30 call site, hero/header/footer, docs, skill) + toàn bộ phần hero ở mục
  Vừa hoàn thành
- Remote: `origin` → `https://github.com/quantb-collab/pv-main-web.git`.
  `origin/main` = `9f9db9b`.
- Bẫy mới ghi nhận: xem "Bẫy đã gặp" — mục motion.div không kích thước trong
  `Parallax`.
