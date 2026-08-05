# Pebble Vina — Website

Next 16 (App Router, Turbopack) · React 19 · Tailwind v4 · shadcn/ui (radix) ·
next-intl (vi/en/ko) · motion + Lenis · pnpm.

**Bắt đầu một phiên làm việc: đọc `docs/HANDOFF.md` trước.** Nó cho biết đang ở
đâu, làm gì tiếp, và đang chờ quyết định nào. Lý do đằng sau các lựa chọn nằm ở
`docs/DECISIONS.md`. Cuối phiên, cập nhật lại bằng skill `pv-handoff`.

Chiến lược gốc: `docs/BLUEPRINT.md` (bản đầy đủ — cần lưu vào repo).
Bản rút gọn để tra nhanh: `docs/BLUEPRINT-RULES.md`.
Mọi quyết định nội dung và cấu trúc trang phải truy được về một mục trong đó.

---

## Chạy

```bash
pnpm dev            # http://localhost:3000
pnpm verify         # chạy trước khi báo xong việc và trước mọi commit
pnpm check:i18n     # soát khoá messages bị thiếu
pnpm check:tokens   # soát màu/easing/thời lượng hardcode
```

`pnpm verify` = `build` + `check:i18n` + `check:tokens` + `lint`.

Hai check kia tồn tại vì `next build` không bắt được chúng: next-intl chỉ log
khoá thiếu ra console rồi in nguyên đường dẫn khoá lên mặt trang, còn giá trị
hardcode thì hoàn toàn hợp lệ với TypeScript.

Sau khi sửa `messages/*.json`, **khởi động lại dev server** — file watcher không
bắt được thay đổi nếu file bị thay bằng thao tác đổi tên.

Bảng theo dõi tiến độ nội bộ: `/track`

---

## Bốn luật của repo này

**1. Registry trước, route sau.**
`src/content/registry.ts` là nguồn sự thật về cấu trúc site. Nó điều khiển menu,
footer, sitemap và bảng `/track`. Thêm trang = thêm entry ở đó trước.

**2. Chỉ dùng token.**
Không hardcode màu, cỡ chữ, easing, thời lượng, khoảng cách section trong
component. Màu, thang chữ và nhịp lấy từ `src/app/globals.css`; easing/duration
cho JS lấy từ `src/lib/motion.ts`. Hai file này phải khớp nhau.

Chữ gọi theo vai trò (`text-body`, `text-title`, `text-eyebrow`…), không gọi
theo cỡ (`text-sm`, `text-lg`, `text-[11px]`). Mỗi vai trò đã mang sẵn cỡ,
line-height và tracking, nên không viết thêm `leading-*` hay `tracking-*`.
Bảng vai trò: `docs/DESIGN-TOKENS.md` mục *Thang chữ*.

**3. Ghép từ block có sẵn.**
`src/components/pv/blocks.tsx` và `section.tsx` là bộ dựng trang. Cần biến thể
mới thì thêm prop cho block sẵn có, đừng dựng lưới riêng cho một trang.

**4. Tiết kiệm thời gian người đọc.**
Người mua Enterprise quét chứ không đọc. Một danh sách tối đa 4 mục có mô tả,
hoặc nhiều hơn nhưng chỉ là nhãn trần. Một section tối đa 120 từ. Trang chủ
tối đa 900 từ. Liệt kê đến kiệt là cách chắc chắn để không ai đọc gì.

**5. Thiếu dữ liệu thì để ô chờ.**
Dùng `<Gap>` / `<GapChip>`. Không bịa số liệu, case study, đối tác, chứng chỉ,
benchmark hay testimonial. Không lấp bằng văn marketing chung chung.

---

## Bản đồ thư mục

```
src/
├── app/[locale]/          route theo sitemap §8.2 blueprint
│   └── track/             bảng theo dõi nội bộ
├── components/
│   ├── layout/            header, footer, chuyển ngôn ngữ
│   ├── motion/            Reveal, Parallax, MediaFrame, SmoothScroll
│   ├── home/              section trang chủ (§9)
│   ├── pv/                block dùng chung, template trang, hệ Gap
│   └── ui/                shadcn — không sửa tay, thêm qua CLI
├── content/registry.ts    cấu trúc site + trạng thái từng trang
├── i18n/                  routing, navigation, request
└── lib/                   motion tokens, cn
messages/                  vi.json là gốc; en.json, ko.json điền ở preflight
docs/                      blueprint, token, i18n, track
```

---

## Nội dung và ngôn ngữ

vi là nguồn sự thật. Khi thêm chữ: chỉ sửa `messages/vi.json`. en/ko để trống,
khoá thiếu sẽ tự rơi về vi (xem `src/i18n/request.ts`). Dịch chỉ làm ở bước
preflight trước khi phát hành — dùng skill `pv-i18n`.

Viết content dùng skill `pv-content`. Dựng giao diện dùng skill `pv-ui`.
Trước khi coi một trang là xong, chạy skill `pv-qa`.
Đầu và cuối mỗi phiên, chạy skill `pv-handoff`.
Chốt commit bằng skill `commit` (bản của repo, thay cho skill commit toàn cục).

---

## Những thứ đang chờ chốt

- Brand kit: màu trong `globals.css` LỚP 1 là **placeholder trung tính**, chưa
  phải màu thật.
- Font: đang dùng Be Vietnam Pro. Yêu cầu ban đầu là Poppins nhưng Poppins
  không có bộ ký tự tiếng Việt.
- Logo: header và footer đang dùng chữ, chưa có file logo.
- Form đánh giá chưa nối CRM, bấm gửi không đi đâu.
- `robots.ts` đang chặn toàn bộ và layout đặt `index: false`. Mở cùng lúc hai
  chỗ khi nội dung qua QA.
- 47 khoảng trống nội dung khác: xem `/track`.
