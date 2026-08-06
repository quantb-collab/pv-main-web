# Bàn giao — 2026-08-06 (tối)

## Đang ở đâu

Section 3 trang chủ dựng lại xong trong một phiên bốn vòng chỉ đạo: §9 S2
(Problem) + S3 (Outcomes) **gộp thành một** section `Contrast` (`#ket-qua`) —
ma trận 4 hàng × 3 nấc "Vận hành cổ điển → Đã số hoá → Số hoá tự hành cùng
AI", dựng bằng block dùng chung mới `StageMatrix`. Trang chủ còn 11 section.
Section này **đã được xem bằng browser thật** (agent pv-ui-builder, 375/768/
1024/1440, zoom góc viền); phần còn lại của trang vẫn chưa ai nhìn.
Nhánh `feat/controls-hero-highlight`, chưa mở PR.

## Vừa hoàn thành

- `StageMatrix` — `src/components/pv/blocks.tsx`: hàng thẳng vai bằng CSS
  subgrid, rail nhãn hàng bên trái (mobile: nhãn rơi vào từng ô), mức nhấn
  suy từ vị trí cột. Panel 3 premium: nền `brand-soft`, viền gradient trọn
  vòng, hào quang `dawn-pulse`, `lg:scale-110`, bo `rounded-tr-[2.25rem]`.
  Nấc 1 không nền — lớp hạt của section xuyên qua.
- `@utility pv-edge` — `src/app/globals.css` LỚP 5: viền gradient bằng mask
  ring. Sinh ra vì trick `p-px` cũ vỡ viền (xem Bẫy). Đã ghi vào
  `docs/DESIGN-TOKENS.md`.
- Nội dung `home.contrast` (`messages/vi.json`): 4 hàng = 4 pain Layer A —
  Tra cứu · Chứng từ · Báo cáo · **Phê duyệt** (thay "Tri thức" vì trùng trục
  với Tra cứu). Nấc 2 cố ý viết kiểu "được một nửa" — tấm gương của khách.
  Tiêu đề chốt: "Doanh nghiệp bạn đang ở nấc nào?" — căn giữa, không eyebrow,
  không lead, không Gap.
- `BeforeAfter` trả về nguyên bản (SolutionTemplate không đổi);
  `Problem`/`Outcomes` cũ đã xoá khỏi `sections.tsx` + `page.tsx`.

## Đang làm dở

Không có việc dở trong code. Bốn chỗ chờ mắt chủ dự án quyết:

- Hàng panel 3 lệch tối đa ~30 px mép trên/dưới (giá của `scale-110`).
  Đường lui giữ hàng thẳng: bỏ scale, nới cột bằng `1.15fr` trong
  `StageMatrix`.
- Rãnh panel 2↔3 còn ~15 px (nửa rãnh 1↔2) — hệ quả toán học của scale.
- Quầng panel 3 phủ nhẹ mép phải panel 2 — xem trên màn thật.
- Section ~200 từ, gấp đôi trần 120 dù gánh hai section cũ. Muốn gọn: bỏ
  một hàng.

## Bước tiếp theo

1. Sửa hydration `src/components/motion/parallax.tsx`: bật
   `prefers-reduced-motion` thì server render `pv-skyglow` trực tiếp còn
   client bọc thêm div transform → mismatch (2 Issues trên overlay dev).
2. Mở `/vi` cả trang ở 375/768/1440 — các nấc `rise`/`dawn` phía dưới vẫn
   chưa ai nhìn (nợ từ phiên trước).
3. Đọc NAV từ cờ `inNav` trong `src/content/registry.ts` thay mảng cứng ở
   `site-header.tsx:32`; đặt `inNav: false` cho `insights` (`registry.ts:566`).
4. Viết một solution page mẫu (`enterprise-knowledge`) kiểm chứng
   `SolutionTemplate`.
5. Mở PR `feat/controls-hero-highlight` → `main`.

## Đang chờ quyết định

- Phân khúc ưu tiên 6–12 tháng — Pebble Vina — chặn Section 4 + solution page.
- Assessment phí/miễn phí — Pebble Vina — chặn `/ai-assessment`.
- CRM nhận lead — Pebble Vina — form chưa gửi đi đâu.
- Brand kit — Pebble Vina — LỚP 1 vẫn placeholder; các nấc opacity của quầng/
  viền StageMatrix sẽ phải cân lại khi thay brand.
- Scale-110 hay cột `1.15fr` — chủ dự án, sau khi nhìn thật.
- Trang chủ vượt ngân sách cuộn/từ — chủ dự án — gộp tiếp hay chấp nhận.

## Bẫy đã gặp

- **`p-px` + `overflow-hidden` + ô con góc vuông = viền vỡ:** ở cung bo, góc
  vuông của ô con đè mất vòng viền 1 px. Dùng `pv-edge` (overlay absolute,
  không chiếm slot subgrid). Đừng quay lại `p-px`.
- Padding/border trên container subgrid trừ vào track đầu/cuối — panel nào
  cũng phải cùng mức (hiện: không panel nào có) kẻo lệch hàng.
- `motion.div` trong `Parallax` phải có `h-full w-full` (phiên trước).
- `overflow-hidden` trên `<Section>` giết `sticky` của con (Maturity).
- Sửa `messages/*.json` xong phải khởi động lại dev server.
- `pnpm build` không bắt khoá messages thiếu — luôn dùng `pnpm verify`.

## Trạng thái kỹ thuật

- Lệnh kiểm tra cuối: `pnpm verify` — sạch (104 trang, 43 file, lint im lặng).
- Commit cuối: commit chứa chính file này — toàn bộ section 3 + `pv-edge`.
- Việc chưa commit: không (sau commit này).
- Remote: `origin` → `https://github.com/quantb-collab/pv-main-web.git`.
