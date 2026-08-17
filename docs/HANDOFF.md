# Bàn giao — 2026-08-17

## Đang ở đâu

Vừa làm lại **hệ nhịp và màn hình** cho cả repo: khoảng cách, bề ngang,
breakpoint và chiều cao control nay gọi theo VAI TRÒ như thang chữ, và hai
check script mới chặn tràn ngang lẫn tên token đụng class lõi Tailwind.

⚠️ `develop` đã được **ép về nhánh này** (chủ dự án chốt 2026-08-17). Trước đó
`origin/develop` là một hướng thiết kế song song, 29 commit, tách từ `4886998`
ngày 11-08 — có `decor.tsx` + `sky-boundary.tsx` dựng lại, `software-bento`
thay `software-stage`, `training-program` thay `training-tracks`. Toàn bộ nằm ở
nhánh `backup/develop-2026-08-17` (đã push), chưa ai quyết giữ hay bỏ.

## Vừa hoàn thành

- Thang `--pv-space-*` (6 vai trò) · `--container-*` (4) · breakpoint khai
  thẳng, bỏ `2xl` · `--h-control-*` nhảy theo `pointer: coarse`.
- `<Section>` bỏ prop `full`, thay bằng `height="auto"|"screen"`, mặc định
  `auto`. `Identity` là ngoại lệ duy nhất dùng `screen`.
- Sửa tràn ngang ở `product-shelf.tsx` — trang chủ từng cuộn ngang ở MỌI khổ
  dưới 1024px. Drawer khảo sát trên điện thoại từ 75% lên trọn bề ngang.
- `pnpm check:layout` (33 trang × 4 khổ) và 3 luật cứng + 2 bánh cóc trong
  `check:tokens`. Cả hai đã vào `pnpm verify`.

## Đang làm dở

Không có việc dở.

## Bước tiếp theo

1. **Việc 2 của chủ dự án: nền và decorator.** Cần đường dẫn thư mục ảnh chủ dự
   án đã chuẩn bị — chưa có thì chưa dựng (`CLAUDE.md` luật 6).
2. Quyết số phận `backup/develop-2026-08-17`: bộ decor theo nấc sky trong đó có
   lấy lại không. Nếu có, kế hoạch nền bắt đầu từ đó chứ không từ số không.
3. Hạ bánh cóc trong `scripts/check-tokens.mjs` mỗi lần đụng file: đang
   386 (khoảng cách viết bằng số) và 21 (bề ngang tuỳ ý).

## Đang chờ quyết định

- **Ảnh nền**: thư mục nào? — chặn toàn bộ việc 2.
- **Bộ decor trong nhánh backup** giữ hay bỏ — chặn hướng đi của việc 2.
- Các mục cũ chưa đổi: phạm vi công bố PV One · EMS/DMS viết tắt của gì ·
  brand kit · 4 chỉ số bento · điều kiện đo `~160 TOPS`.

## Bẫy đã gặp

- **`--spacing-block` đẻ ra `.inline-block{inline-size:…}` đè class lõi
  Tailwind.** Mọi `inline-block` bị ép 56px; triệu chứng duy nhất thấy được là
  tiêu đề hero mất dấu cách ("Biến AIthành"). Build/lint/check đều sạch. Nay có
  bảng `RESERVED` trong `check-tokens.mjs`.
- **`pv-grain` gần như vô hình ở nấc tối.** Đo cô lập: biên độ chỉ 0,41 (void) →
  1,30 (dawn) trên 255. `mix-blend-mode: overlay` nhân hạt với `2 × độ sáng
  nền`, nên nền càng tối hạt càng bị bóp — ngược chiều thiết kế cần. Vặn
  `--grain-strength` không cứu được. **Việc 2 phải giải cái này.**
- **tailwind-merge chỉ gộp class CÙNG biến thể.** `w-full` không đè được
  `data-[side=right]:w-3/4`; y hệt bẫy `dark:` đã ghi. Ghi đè cái gì thì khai
  đúng biến thể của nó.
- Lenis cuộn lại giữa hai lệnh, nên đo bằng `scrollIntoView` rồi chụp ở lệnh
  sau là sai. Đo trong CÙNG một lần `evaluate`.

## Trạng thái kỹ thuật

- `pnpm verify` — sạch (109 trang · 0 khoá thiếu · 0 hardcode · 33 trang không
  cuộn ngang · lint sạch).
- Commit cuối `4dc25a7`. `develop`, `feat/hero-software-stage` và cả hai bản
  trên `origin` đều đang ở đó. Đang đứng trên `develop`.
- MCP `chrome-devtools` và `context7` đã cài ở user scope — dùng
  `evaluate_script` để lấy SỐ ĐO, đừng chỉ chụp hình.
