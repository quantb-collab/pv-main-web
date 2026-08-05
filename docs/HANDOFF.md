# Bàn giao — 2026-08-05

## Đang ở đâu

Khung website đã dựng xong và chạy được: 33 trang khai trong registry, 107 trang
tĩnh build sạch cho ba ngôn ngữ. Trang chủ đã có đủ 11 section theo §9 và vừa
qua một vòng siết nội dung. Các trang V1 khác đang ở mức khung. Chưa có trang
nào lên trạng thái `content` hay `ready` vì còn thiếu bằng chứng thật.

Giai đoạn tiếp theo là **điền nội dung chi tiết theo thứ tự ưu tiên** — nhưng bị
chặn bởi một quyết định kinh doanh chưa có (xem mục Đang chờ).

## Vừa hoàn thành

- Nền repo: token 5 lớp, i18n vi/en/ko, motion + Lenis, bộ block dùng chung
- 19 route theo sitemap §8.2 — `src/app/[locale]/`
- Trang chủ 11 section — `src/components/home/`
- Bảng theo dõi nội bộ `/track` sinh từ registry
- Siết nội dung trang chủ: 1611 → 1001 từ, chiều cao 12.833 → 9.558px
- `pnpm verify` + `scripts/check-messages.mjs` soát khoá messages thiếu
- 7 skill và 5 agent riêng cho dự án — `.claude/`

## Đang làm dở

Không có việc dở giữa chừng. Nhưng có **một nợ đã biết**: menu chính đang viết
cứng ở `src/components/layout/site-header.tsx:24` thay vì đọc cờ `inNav` từ
registry — trái với luật "registry là nguồn sự thật" của chính repo này.

## Bước tiếp theo

1. Đọc `NAV` từ `inNav` trong `src/content/registry.ts` thay cho mảng viết cứng
   ở `site-header.tsx:24`
2. Đặt `inNav: false` cho entry `insights` trong registry — trang đang là ô chờ
   rỗng nhưng chiếm một slot menu chính
3. Mở mega-menu cho Giải pháp và Bài toán bằng `navigation-menu` (đã cài, chưa
   dùng) — cho khách thấy 6 và 7 trang con
4. Viết nội dung đầy đủ cho một solution page mẫu để kiểm chứng
   `SolutionTemplate` — đề xuất `enterprise-knowledge`
5. Xử lý quyền GitHub rồi `git push -u origin main` (xem Trạng thái kỹ thuật)

## Đang chờ quyết định

| Câu hỏi | Ai trả lời | Việc bị chặn |
|---|---|---|
| Phân khúc ưu tiên 6–12 tháng | Pebble Vina | Ba use case nào lên Section 4 trang chủ; solution page nào viết trước |
| Assessment miễn phí hay có phí, kéo dài bao lâu | Pebble Vina | Trang `/ai-assessment` và `/how-we-deliver/assessment` |
| Bộ phận nhận lead + CRM nào | Pebble Vina | Form đánh giá hiện chưa gửi đi đâu |
| Brand kit và logo chính thức | Pebble Vina | LỚP 1 token trong `globals.css`, wordmark ở header/footer |
| Có làm mega-menu ngay hay đợi chốt phân khúc | Người dùng | Bước 3 ở trên |
| Lộ trình chuyển ngang + giảm `--section-y` | Người dùng | Rút ngắn thêm chiều cao trang chủ |

47 khoảng trống nội dung khác: xem `/track`, không chép lại ở đây.

## Bẫy đã gặp

- **Tab ẩn làm animation kẹt.** Trình duyệt dừng `requestAnimationFrame` khi tab
  bị ẩn, nên phần tử đứng nguyên ở `opacity: 0`. Trông giống lỗi code nhưng
  không phải. Kiểm tra `document.hidden` trước khi đi tìm nguyên nhân khác.
- **Không gọi `motion.create()` trong thân component.** Mỗi lần render sinh một
  component type mới, React unmount rồi mount lại cây con. Dùng bảng `TAGS`
  trong `src/components/motion/reveal.tsx`.
- **Sửa `messages/*.json` xong phải khởi động lại dev server.** File watcher
  không bắt được nếu file bị thay bằng thao tác đổi tên — trang sẽ hiện đường
  dẫn khoá thay vì nội dung, dễ tưởng là thiếu khoá.
- **`pnpm build` không bắt được khoá messages thiếu.** Luôn dùng `pnpm verify`.

## Trạng thái kỹ thuật

- Lệnh kiểm tra cuối: `pnpm verify` — sạch (104 trang, 39 file, không lỗi)
- Commit cuối: `5970f8e` — `feat: scaffold Pebble Vina site with vi/en/ko and
  page registry`, 96 file
- Việc chưa commit: không
- Remote: `origin` → `https://github.com/quantb-collab/pv-main-web.git`
- **Chưa push được.** Git trên máy xác thực bằng `quantruong-2518`, repo đích
  thuộc `quantb-collab` → HTTP 403. Credential nằm ở macOS Keychain, chưa cài
  `gh`. Cần cấp quyền ghi cho `quantruong-2518` hoặc đổi sang tài khoản có
  quyền, rồi chạy `git push -u origin main`.
