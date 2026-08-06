# Bàn giao — 2026-08-06 (tối, lần 2)

## Đang ở đâu

Nửa trên trang chủ đã thành hình qua hai commit trong ngày: section 3 là
**ma trận ba nấc** (`#ket-qua`, `StageMatrix`) và section 4 là **bento bốn
chỉ số** (`#con-so`, `BentoGrid`/`StatTile`/`BentoTile`). Trang chủ hiện
12 section. Đang chuẩn bị brainstorm section 5 (hiện là `StartHere` bản
nháp cũ). Nhánh `feat/controls-hero-highlight`, 4 commit chưa push, chưa PR.

## Vừa hoàn thành

- `815491b` — bento section 4: bốn nấc `tier` (hero 2×2 → wide 2×1 → stat
  1×1 → note trần), ô tuyên ngôn (thông điệp trung tâm blueprint, lần duy
  nhất trên trang chủ), hệ lớp lấy nguyên của StageMatrix.
- **Số trên bento là SỐ MINH HOẠ** (−72/−58/−64/−45%) theo quyết định chủ
  dự án: mặt khách sạch cảnh báo. Ba chốt an toàn: `data-gap="proof"` vô
  hình trên từng số (QA//track vẫn đếm), ô note "số minh hoạ" nói thẳng
  trên trang, comment trong `sections.tsx`. **Phải thay bằng số đo thật
  trước khi phát hành.**
- Ô ảnh `MediaFrame` đã RÚT khỏi bento (khung chờ ảnh cũng là một cảnh
  báo) — có ảnh sản phẩm thật thì trả lại, sơ đồ cũ trong git.
- Fix `cn()` (`src/lib/utils.ts`): dạy thang chữ vai trò cho
  tailwind-merge — xem Bẫy.
- `3ff0a6b` — ma trận ba nấc, utility `pv-edge`, panel premium scale-110.

## Đang làm dở

Không có việc dở trong code. Chờ mắt chủ dự án: bento sau lần nén chiều
cao chưa soi lại ở 375/1024; hàng panel 3 ma trận lệch ~30px do scale-110
(đường lui: cột `1.15fr`); section 3 vẫn ~200 từ so với trần 120.

## Bước tiếp theo

1. Brainstorm + dựng section 5 — đang bàn với chủ dự án (xem cuối phiên).
2. Sửa hydration `src/components/motion/parallax.tsx` (reduced-motion:
   server thiếu div bọc transform — chính là "1 Issue" trên overlay dev).
3. Mở `/vi` cả trang ở 375/768/1440 — nửa dưới và nấc `rise`/`dawn` chưa ai nhìn.
4. Đọc NAV từ `inNav` trong `registry.ts` thay mảng cứng
   `site-header.tsx:32`; `inNav: false` cho `insights` (`registry.ts:566`).
5. Push + mở PR `feat/controls-hero-highlight` → `main`.

## Đang chờ quyết định

- Phân khúc ưu tiên 6–12 tháng — Pebble Vina — chặn use case cụ thể cho
  section 5 và solution page đầu tiên.
- Số đo thật cho 4 chỉ số bento (trước–sau + điều kiện đo) — Pebble Vina —
  chặn phát hành trang chủ (4 data-gap vô hình đang đếm).
- Assessment phí/miễn phí · CRM nhận lead · brand kit — Pebble Vina — như cũ.
- Scale-110 hay cột `1.15fr` cho panel 3 — chủ dự án, sau khi nhìn thật.

## Bẫy đã gặp

- **`cn()` từng vứt cỡ chữ im lặng:** tailwind-merge coi `text-display` là
  class MÀU nên `cn("text-display", "text-brand/70")` chỉ giữ lại màu.
  Đã fix bằng `extendTailwindMerge` trong `src/lib/utils.ts` — **thêm vai
  trò chữ mới ở LỚP 3 thì phải thêm vào `TEXT_ROLES` ở đó**, không thì vai
  trò mới dính lại đúng bẫy này và `pnpm verify` vẫn sạch.
- Số minh hoạ KHÔNG có chip cảnh báo — đừng tưởng đã có số thật. Nguồn sự
  thật là `data-gap` trong DOM và prop `placeholder` trong `sections.tsx`.
- `p-px` + `overflow-hidden` + ô con góc vuông = viền vỡ ở cung bo → dùng
  `pv-edge`. Padding/border trên container subgrid trừ vào track đầu/cuối.
- `motion.div` trong `Parallax` phải có `h-full w-full`. `overflow-hidden`
  trên `<Section>` giết `sticky` của con. Sửa `messages/*.json` xong phải
  khởi động lại dev server. Luôn dùng `pnpm verify`, không dùng `pnpm build`.

## Trạng thái kỹ thuật

- Lệnh kiểm tra cuối: `pnpm verify` — sạch (104 trang, 43 file).
- Commit cuối: `815491b` (bento) trên `3ff0a6b` (ma trận). Chưa push.
- Việc chưa commit: chỉ file bàn giao này và `DECISIONS.md`.
- Remote: `origin` → `https://github.com/quantb-collab/pv-main-web.git`.
