# Bàn giao — 2026-08-05

## Đang ở đâu

Khung 33 trang chạy sạch cho ba ngôn ngữ, chưa trang nào lên trạng thái
`content` vì còn thiếu bằng chứng thật. Ba phiên gần đây làm về **hình thức**
chứ không phải nội dung: token control + hero + highlight, rồi footer danh tính
pháp nhân, rồi hệ thang chữ.

Nội dung chi tiết vẫn bị chặn bởi quyết định phân khúc — xem mục Đang chờ.
Đang ở nhánh `feat/controls-hero-highlight`, đã push, chưa mở PR về `main`.

## Vừa hoàn thành

- Thang chữ 11 vai trò thay cho thang cỡ Tailwind — LỚP 3/4 trong
  `src/app/globals.css`; bảng tra ở `docs/DESIGN-TOKENS.md` mục *Thang chữ*
- `check:tokens` chặn thêm cỡ chữ, `leading-*` và `tracking-*` viết thẳng —
  `scripts/check-tokens.mjs`
- Luật thang chữ vào skill `pv-ui`, `pv-qa` và luật 2 của `CLAUDE.md`
- Footer đổi từ ô chờ sang khối pháp nhân thật —
  `src/components/layout/site-footer.tsx`

## Đang làm dở

Không có việc dở giữa chừng trong code. Nhưng **hệ thang chữ chưa ai xem bằng
mắt** — hai commit vừa rồi dựa trên `pnpm verify` sạch và tính lại `clamp()`,
không dựa trên nhìn thấy ở ba khổ màn hình. Hai chỗ đáng ngờ nhất:

- Nhãn `LayerStack` đang dùng `text-title` — `src/components/pv/blocks.tsx:229`.
  Có thể quá nặng cho một sơ đồ 5 tầng; hạ về `text-body font-medium` nếu thấy
  vậy.
- Nav header ở đúng 1024px — `src/components/layout/site-header.tsx:64`.
  Weight 500 làm chữ rộng ra, đã bù bằng `px-2.5` nhưng chưa đo thật.

## Bước tiếp theo

1. Mở `/vi` ở 375px, 768px, 1440px — kiểm hai chỗ ngờ ở trên và tràn ngang
2. Đọc `NAV` từ cờ `inNav` trong `src/content/registry.ts` thay cho mảng viết
   cứng ở `site-header.tsx:26`
3. Đặt `inNav: false` cho entry `insights` (`registry.ts:566`) — trang còn là ô
   chờ rỗng nhưng đang chiếm một slot menu chính
4. Viết nội dung đầy đủ cho một solution page mẫu để kiểm chứng
   `SolutionTemplate` — đề xuất `enterprise-knowledge`
5. Mở PR `feat/controls-hero-highlight` → `main`

## Đang chờ quyết định

| Câu hỏi | Ai trả lời | Việc bị chặn |
|---|---|---|
| Phân khúc ưu tiên 6–12 tháng | Pebble Vina | Ba use case nào lên Section 4 trang chủ; solution page nào viết trước |
| Assessment miễn phí hay có phí, kéo dài bao lâu | Pebble Vina | Trang `/ai-assessment` và `/how-we-deliver/assessment` |
| Bộ phận nhận lead + CRM nào | Pebble Vina | Form đánh giá hiện chưa gửi đi đâu |
| Brand kit và logo chính thức | Pebble Vina | LỚP 1 token trong `globals.css`, wordmark ở header/footer |
| Có làm mega-menu ngay hay đợi chốt phân khúc | Người dùng | Bước 2 và 3 ở trên |
| Lộ trình chuyển ngang + giảm `--section-y` | Người dùng | Rút ngắn thêm chiều cao trang chủ |

47 khoảng trống nội dung khác: xem `/track`, không chép lại ở đây.

## Bẫy đã gặp

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

- Lệnh kiểm tra cuối: `pnpm verify` — sạch (104 trang, 41 file, không lỗi)
- Commit code cuối: `89801b9` — `feat: replace the type scale with eleven
  role-based tokens`
- Việc chưa commit: không
- Remote: `origin` → `https://github.com/quantb-collab/pv-main-web.git`.
  `origin/feat/controls-hero-highlight` = `89801b9`, `origin/main` = `9f9db9b`.
- **Lỗi 403 ở bàn giao trước đã hết** — push chạy được ngày 2026-08-05, không
  cần xử lý quyền GitHub nữa.
