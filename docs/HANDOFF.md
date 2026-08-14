# Bàn giao — 2026-08-14 (phiên 2)

## Đang ở đâu

Hero trang chủ vừa dựng lại theo bản thiết kế chủ dự án: chữ mới, nền là **ảnh
chụp nhung** thay cho hình vẽ. Xong cả khổ ngang lẫn khổ dọc. Việc còn mở của
phiên trước không đổi: section phần mềm chờ nội dung cho CRM · EMS · DMS, và
snap cuộn vẫn TẮT bằng cờ `SNAP.enabled` (`src/lib/motion.ts:54`).

## Vừa hoàn thành

- Hero: chữ mới trong `home.hero`, nền `public/brand/hero-{wide,tall}.webp` đổi
  bản theo tỉ lệ khung 1:1 qua `<picture>`. Số đo: `docs/IMAGE-BRIEF.md` §5c.
  Bỏ khỏi hero: `DawnRings`, lưới, ô chờ ảnh, chế độ `brand` của `<Highlight>`,
  `<Parallax>` ở lớp nền. `pv-grain` nhận núm `--grain-strength` (hero 0,16);
  `pv-skyglow-hero` 0,5 → 0,16.
- Siết quy trình cho nhanh hơn: `CLAUDE.md` thêm luật 6 (hỏi asset/chữ/khổ
  trước khi dựng) + mục *Cách làm nhanh*; `pv-ui` thêm Bước 0 và ngân sách đo;
  `pv-handoff` giới hạn 60 dòng, DECISIONS thành có điều kiện.

## Đang làm dở

Không có việc dở.

## Bước tiếp theo

1. Xem hero ở **375px trên trình duyệt thật** — Chrome headless không hạ cửa sổ
   dưới 500px.
2. Chốt số phận `DawnRings` (nay không còn chỗ dùng): bỏ hẳn thì xoá kèm
   `pv-rings`, ba animation `dawn-*`, khối `.pv-rings .pv-node` trong
   `globals.css`.
3. Sửa tràn ngang ở `#phan-cung` (`product-shelf.tsx`): ≤768px `scrollWidth`
   1120 vs `clientWidth` 753. **Lỗi có từ trước.** Header ở ~1024px cũng tràn
   nút CTA ra ngoài mép phải.
4. Điền ba sản phẩm phần mềm khi có câu trả lời: thêm `pNLabel` + `pNLead` +
   `pNNeed` vào `home.software`, không phải sửa JSX.
5. Dọn: xoá `software-shelf.tsx` · sửa hydration `parallax.tsx` · đọc NAV từ
   `inNav` trong registry thay mảng cứng `site-header.tsx:32`.

## Đang chờ quyết định

- **Giữ hay bỏ `ExploreCue`** ở đáy hero — bản thiết kế không vẽ nó, tôi giữ.
- **Comment trong code viết tiếng Việt hay tiếng Anh** — repo đang tiếng Việt,
  ghi nhớ cũ nói tiếng Anh.
- **Ảnh master lớn hơn**: nhung ≥2880px, key visual ≥3200px + bản cắt 1024–1280.
- **EMS/DMS viết tắt của gì** · có sản phẩm thứ năm không · bấm slide đi đâu ·
  bật lại snap không · `PV One` hay `Pebble One` — chặn nội dung section phần mềm.
- **Phạm vi được công bố của PV One** (chặn phát hành trang chủ) · ảnh giao diện
  đang là tiếng Anh · brand kit · 4 chỉ số bento · điều kiện đo `~160 TOPS`.

## Bẫy đã gặp

- **Lớp hạt phủ lên ảnh cộng dồn thành giấy nhám**, tắt hẳn thì vùng tối phẳng
  lộ banding — núm chỉnh là `--grain-strength`, không phải xoá lớp.
- **`text-balance` chia hai dòng BẰNG NHAU**, không ngắt được theo ý; muốn ngắt
  đúng chỗ thì `\n` trong messages + `whitespace-pre-line`.
- **Đổi bản ảnh theo bề ngang là sai** với `object-cover` — ngưỡng đúng là tỉ lệ
  khung hình. Sửa `messages/*.json` xong phải restart dev server; thay file
  trong `public/` mà giữ tên thì `next/image` vẫn phục vụ bản cũ.
- Chrome headless: hẹp nhất 500px · có lúc không chạy `rAF` nên ảnh chụp là
  khung cũ (khởi động lại Chrome) · `curl /vi` trả 307, thiếu `-L` là trang rỗng.

## Trạng thái kỹ thuật

- `pnpm verify` — sạch (109 trang; 2 cảnh báo eslint CŨ ở `sections.tsx:95,97`).
- Việc hai phiên hôm nay đã commit thành 4 mốc trên `develop`, commit cuối là
  `docs: tighten the working rules and record the hero decisions`. **Chưa push.**
- `origin/HEAD` chưa set — dò nhánh mặc định bằng `git remote -v`.
